/**
 * Authorization + input-validation tests for the PCI /generate handler.
 *
 * Tests the scope rules:
 *   - No session     → 401
 *   - Non-super-admin + clientIds in body → 403
 *   - Non-super-admin → always scoped to accessibleClients
 *   - Super admin + no body clientIds → runs with null (all clients)
 *   - Super admin + body clientIds → runs with that exact list
 *
 * And the input validation:
 *   - dryRun defaults to TRUE
 *   - unknown rule → 400
 *   - empty rules[] → 400
 *   - limit out of range → 400
 *
 * The generator is stubbed — we only care that the handler wires the
 * right arguments through.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";

import { handleGenerate } from "./generate-handler.ts";
import type { GenerateOptions, GenerateResult } from "./ingest.ts";
import type { AdminTokenPayload } from "../admin-auth.ts";

const EMPTY_RESULT: GenerateResult = {
  dryRun: true,
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

function stubRun(): {
  run: (opts: GenerateOptions) => Promise<GenerateResult>;
  calls: GenerateOptions[];
} {
  const calls: GenerateOptions[] = [];
  return {
    calls,
    run: async (opts: GenerateOptions) => {
      calls.push(opts);
      return { ...EMPTY_RESULT, dryRun: opts.dryRun ?? true };
    },
  };
}

function superAdmin(): AdminTokenPayload {
  return {
    userId: "u-super",
    email: "super@example.com",
    isSuperAdmin: true,
    accessibleClients: [],
    exp: Date.now() + 60_000,
  };
}

function scopedAdmin(clients: string[]): AdminTokenPayload {
  return {
    userId: "u-scoped",
    email: "scoped@example.com",
    isSuperAdmin: false,
    accessibleClients: clients,
    exp: Date.now() + 60_000,
  };
}

// ── Authorization ─────────────────────────────────────────────────

test("handleGenerate: no session → 401", async () => {
  const { run, calls } = stubRun();
  const res = await handleGenerate({ session: null, body: {}, run });
  assert.equal(res.status, 401);
  assert.equal(calls.length, 0);
});

test("handleGenerate: non-super trying to pass clientIds → 403", async () => {
  const { run, calls } = stubRun();
  const res = await handleGenerate({
    session: scopedAdmin(["c1"]),
    body: { clientIds: ["c2"] },
    run,
  });
  assert.equal(res.status, 403);
  assert.equal(calls.length, 0);
});

test("handleGenerate: non-super → scope forced to accessibleClients", async () => {
  const { run, calls } = stubRun();
  const res = await handleGenerate({
    session: scopedAdmin(["c1", "c2"]),
    body: {},
    run,
  });
  assert.equal(res.status, 200);
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].client_ids, ["c1", "c2"]);
});

test("handleGenerate: super admin without clientIds → null scope (all clients)", async () => {
  const { run, calls } = stubRun();
  const res = await handleGenerate({
    session: superAdmin(),
    body: {},
    run,
  });
  assert.equal(res.status, 200);
  assert.equal(calls[0].client_ids, null);
});

test("handleGenerate: super admin with clientIds → that exact list", async () => {
  const { run, calls } = stubRun();
  const res = await handleGenerate({
    session: superAdmin(),
    body: { clientIds: ["c1"] },
    run,
  });
  assert.equal(res.status, 200);
  assert.deepEqual(calls[0].client_ids, ["c1"]);
});

test("handleGenerate: super admin + non-array clientIds → 400", async () => {
  const { run } = stubRun();
  const res = await handleGenerate({
    session: superAdmin(),
    body: { clientIds: "c1" },
    run,
  });
  assert.equal(res.status, 400);
});

test("handleGenerate: super admin + clientIds with empty string → 400", async () => {
  const { run } = stubRun();
  const res = await handleGenerate({
    session: superAdmin(),
    body: { clientIds: [""] },
    run,
  });
  assert.equal(res.status, 400);
});

// ── Input validation ─────────────────────────────────────────────

test("handleGenerate: dryRun defaults TRUE when omitted", async () => {
  const { run, calls } = stubRun();
  await handleGenerate({
    session: superAdmin(),
    body: {},
    run,
  });
  assert.equal(calls[0].dryRun, true);
});

test("handleGenerate: dryRun=false is honored", async () => {
  const { run, calls } = stubRun();
  await handleGenerate({
    session: superAdmin(),
    body: { dryRun: false },
    run,
  });
  assert.equal(calls[0].dryRun, false);
});

test("handleGenerate: any non-boolean dryRun falls back to safe TRUE", async () => {
  const { run, calls } = stubRun();
  await handleGenerate({
    session: superAdmin(),
    body: { dryRun: "no" },
    run,
  });
  assert.equal(calls[0].dryRun, true);
});

test("handleGenerate: unknown rule → 400", async () => {
  const { run } = stubRun();
  const res = await handleGenerate({
    session: superAdmin(),
    body: { rules: ["bogus_rule"] },
    run,
  });
  assert.equal(res.status, 400);
});

test("handleGenerate: empty rules[] → 400", async () => {
  const { run } = stubRun();
  const res = await handleGenerate({
    session: superAdmin(),
    body: { rules: [] },
    run,
  });
  assert.equal(res.status, 400);
});

test("handleGenerate: valid rules subset propagates", async () => {
  const { run, calls } = stubRun();
  await handleGenerate({
    session: superAdmin(),
    body: { rules: ["missed_call_unbooked", "no_show_risk"] },
    run,
  });
  assert.deepEqual(calls[0].rules, ["missed_call_unbooked", "no_show_risk"]);
});

test("handleGenerate: limit out of range → 400", async () => {
  const { run } = stubRun();
  const res1 = await handleGenerate({
    session: superAdmin(),
    body: { limit: 0 },
    run,
  });
  assert.equal(res1.status, 400);
  const res2 = await handleGenerate({
    session: superAdmin(),
    body: { limit: 501 },
    run,
  });
  assert.equal(res2.status, 400);
});

test("handleGenerate: limit within range is honored", async () => {
  const { run, calls } = stubRun();
  await handleGenerate({
    session: superAdmin(),
    body: { limit: 25 },
    run,
  });
  assert.equal(calls[0].limit, 25);
});
