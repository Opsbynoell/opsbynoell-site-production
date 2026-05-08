/**
 * Tests for the PCI cron generate handler.
 *
 * These exercise the pure tier-filter + per-client error-isolation
 * logic. handleGenerate is reused as-is (we inject a stub via the
 * `run` field, which is the same hook the existing
 * generate-handler.test.ts uses).
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";

import { runPciGenerateCron } from "./cron-generate-handler.ts";
import type { GenerateOptions, GenerateResult } from "./ingest.ts";
import type { ClientConfig, PciCronTier } from "../agents/types.ts";

const NOW = () => 1_777_000_000_000;

const EMPTY_RESULT: GenerateResult = {
  dryRun: false,
  now: "2026-04-24T12:00:00Z",
  results: [],
  totals: {
    scanned: 0,
    drafts: 0,
    created: 0,
    skipped_existing: 0,
    events_written: 0,
  },
};

function cfg(clientId: string, tier: PciCronTier | undefined): ClientConfig {
  return {
    clientId,
    businessName: clientId,
    vertical: "test",
    pciCronTier: tier,
    agents: { support: true, frontDesk: false, care: false },
    active: true,
  };
}

function loaderFor(
  byId: Record<string, ClientConfig | Error>
): (id: string) => Promise<ClientConfig> {
  return async (id) => {
    const v = byId[id];
    if (!v) throw new Error(`unknown client_id: ${id}`);
    if (v instanceof Error) throw v;
    return v;
  };
}

function recordingRunner(): {
  run: (opts: GenerateOptions) => Promise<GenerateResult>;
  calls: GenerateOptions[];
} {
  const calls: GenerateOptions[] = [];
  return {
    calls,
    run: async (opts) => {
      calls.push(opts);
      return { ...EMPTY_RESULT, dryRun: opts.dryRun ?? true };
    },
  };
}

// ── Tier filter ────────────────────────────────────────────────────

test("tier=standard runs only standard clients", async () => {
  const { run, calls } = recordingRunner();
  const res = await runPciGenerateCron({
    tier: "standard",
    clientIds: ["a", "b", "c"],
    loadConfig: loaderFor({
      a: cfg("a", "standard"),
      b: cfg("b", "realtime"),
      c: cfg("c", "disabled"),
    }),
    run,
    now: NOW,
  });
  assert.equal(res.processed, 1);
  assert.equal(res.succeeded, 1);
  assert.equal(res.failed, 0);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].client_ids, ["a"]);
});

test("tier=realtime runs only realtime clients", async () => {
  const { run, calls } = recordingRunner();
  const res = await runPciGenerateCron({
    tier: "realtime",
    clientIds: ["a", "b", "c"],
    loadConfig: loaderFor({
      a: cfg("a", "standard"),
      b: cfg("b", "realtime"),
      c: cfg("c", "disabled"),
    }),
    run,
    now: NOW,
  });
  assert.equal(res.processed, 1);
  assert.equal(res.succeeded, 1);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].client_ids, ["b"]);
});

test("clients with no pciCronTier default to disabled and are skipped", async () => {
  const { run, calls } = recordingRunner();
  const res = await runPciGenerateCron({
    tier: "standard",
    clientIds: ["a"],
    loadConfig: loaderFor({ a: cfg("a", undefined) }),
    run,
    now: NOW,
  });
  assert.equal(res.processed, 0);
  assert.equal(res.succeeded, 0);
  assert.equal(calls.length, 0);
});

// ── Per-client error isolation ─────────────────────────────────────

test("one client throwing inside handleGenerate does not stop others", async () => {
  const calls: GenerateOptions[] = [];
  let count = 0;
  const run: (opts: GenerateOptions) => Promise<GenerateResult> = async (
    opts
  ) => {
    calls.push(opts);
    count += 1;
    if (count === 2) throw new Error("boom");
    return { ...EMPTY_RESULT, dryRun: opts.dryRun ?? true };
  };
  const res = await runPciGenerateCron({
    tier: "standard",
    clientIds: ["a", "b", "c"],
    loadConfig: loaderFor({
      a: cfg("a", "standard"),
      b: cfg("b", "standard"),
      c: cfg("c", "standard"),
    }),
    run,
    now: NOW,
  });
  assert.equal(res.processed, 3);
  assert.equal(res.succeeded, 2);
  assert.equal(res.failed, 1);
  assert.equal(res.errors.length, 1);
  assert.equal(res.errors[0].clientId, "b");
  assert.match(res.errors[0].error, /boom/);
});

test("config load failure does not stop other clients", async () => {
  const { run, calls } = recordingRunner();
  const res = await runPciGenerateCron({
    tier: "standard",
    clientIds: ["a", "b"],
    loadConfig: loaderFor({
      a: new Error("supabase down for a"),
      b: cfg("b", "standard"),
    }),
    run,
    now: NOW,
  });
  assert.equal(res.processed, 1);
  assert.equal(res.succeeded, 1);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].client_ids, ["b"]);
});

// ── Wiring through handleGenerate ─────────────────────────────────

test("runs with dryRun=false and scopes to single client_id", async () => {
  const { run, calls } = recordingRunner();
  await runPciGenerateCron({
    tier: "standard",
    clientIds: ["a"],
    loadConfig: loaderFor({ a: cfg("a", "standard") }),
    run,
    now: NOW,
  });
  assert.equal(calls.length, 1);
  assert.equal(calls[0].dryRun, false);
  assert.deepEqual(calls[0].client_ids, ["a"]);
});

test("response shape is ok+tier+counters+errors", async () => {
  const { run } = recordingRunner();
  const res = await runPciGenerateCron({
    tier: "realtime",
    clientIds: [],
    loadConfig: loaderFor({}),
    run,
    now: NOW,
  });
  assert.equal(res.ok, true);
  assert.equal(res.tier, "realtime");
  assert.equal(res.processed, 0);
  assert.equal(res.succeeded, 0);
  assert.equal(res.failed, 0);
  assert.deepEqual(res.errors, []);
});
