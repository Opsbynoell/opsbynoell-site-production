/**
 * Tests for the per-client PCI cron tier runner.
 *
 * Covers the requirements from the cron-tier feature:
 *   - tier=standard runs only standard clients
 *   - tier=realtime runs only realtime clients
 *   - one client throwing inside generateForClient does not stop the
 *     loop; failures land in `errors` and `failed`
 *   - default tier (missing query param) is "standard"
 *   - "disabled" / missing-tier clients are skipped
 *
 * Auth (the 401 path) lives in the route adapter; that is exercised
 * implicitly via assertCron, which has its own tests.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";

import { parseTier, runPciGenerateCron } from "./cron-generate.ts";
import type { CronGenerateDeps } from "./cron-generate.ts";
import type { PciCronTier } from "../agents/types.ts";

interface TierMap {
  [clientId: string]: PciCronTier;
}

function makeDeps(
  tiers: TierMap,
  options: { failFor?: Set<string>; tierError?: Set<string> } = {}
): {
  deps: CronGenerateDeps;
  generated: string[];
} {
  const generated: string[] = [];
  const deps: CronGenerateDeps = {
    listClientIds: async () => Object.keys(tiers),
    getTierFor: async (id) => {
      if (options.tierError?.has(id)) {
        throw new Error(`config load failed for ${id}`);
      }
      return tiers[id];
    },
    generateForClient: async (id) => {
      if (options.failFor?.has(id)) {
        throw new Error(`boom for ${id}`);
      }
      generated.push(id);
    },
  };
  return { deps, generated };
}

test("parseTier: missing param defaults to standard", () => {
  const sp = new URLSearchParams("");
  assert.equal(parseTier(sp), "standard");
});

test("parseTier: explicit standard", () => {
  const sp = new URLSearchParams("tier=standard");
  assert.equal(parseTier(sp), "standard");
});

test("parseTier: explicit realtime", () => {
  const sp = new URLSearchParams("tier=realtime");
  assert.equal(parseTier(sp), "realtime");
});

test("parseTier: bogus value falls back to standard", () => {
  const sp = new URLSearchParams("tier=garbage");
  assert.equal(parseTier(sp), "standard");
});

test("tier=standard only invokes generate for standard clients", async () => {
  const { deps, generated } = makeDeps({
    a: "standard",
    b: "realtime",
    c: "disabled",
  });
  const result = await runPciGenerateCron("standard", deps);
  assert.deepEqual(generated, ["a"]);
  assert.equal(result.tier, "standard");
  assert.equal(result.processed, 1);
  assert.equal(result.succeeded, 1);
  assert.equal(result.failed, 0);
  assert.deepEqual(result.errors, []);
});

test("tier=realtime only invokes generate for realtime clients", async () => {
  const { deps, generated } = makeDeps({
    a: "standard",
    b: "realtime",
    c: "disabled",
  });
  const result = await runPciGenerateCron("realtime", deps);
  assert.deepEqual(generated, ["b"]);
  assert.equal(result.tier, "realtime");
  assert.equal(result.processed, 1);
  assert.equal(result.succeeded, 1);
});

test("disabled and missing-tier clients are skipped under both tiers", async () => {
  const tiers: TierMap = { x: "disabled" };
  const { deps, generated } = makeDeps(tiers);
  const std = await runPciGenerateCron("standard", deps);
  const rt = await runPciGenerateCron("realtime", deps);
  assert.deepEqual(generated, []);
  assert.equal(std.processed, 0);
  assert.equal(rt.processed, 0);
});

test("one client failing does not stop the loop", async () => {
  const { deps, generated } = makeDeps(
    { a: "standard", b: "standard", c: "standard" },
    { failFor: new Set(["b"]) }
  );
  const result = await runPciGenerateCron("standard", deps);
  assert.deepEqual(generated, ["a", "c"]);
  assert.equal(result.processed, 3);
  assert.equal(result.succeeded, 2);
  assert.equal(result.failed, 1);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].clientId, "b");
  assert.match(result.errors[0].error, /boom for b/);
});

test("getTierFor throwing surfaces an error and continues", async () => {
  const { deps, generated } = makeDeps(
    { a: "standard", b: "standard" },
    { tierError: new Set(["a"]) }
  );
  const result = await runPciGenerateCron("standard", deps);
  assert.deepEqual(generated, ["b"]);
  assert.equal(result.processed, 1);
  assert.equal(result.succeeded, 1);
  assert.equal(result.failed, 1);
  assert.equal(result.errors[0].clientId, "a");
});
