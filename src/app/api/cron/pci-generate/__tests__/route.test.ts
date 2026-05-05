/**
 * Route-level tests for /api/cron/pci-generate.
 *
 * The pure tier-filter logic is covered exhaustively by
 * src/lib/pci/cron-generate-handler.test.ts. These tests focus on
 * the route adapter's responsibilities:
 *   - 401 when assertCron throws
 *   - default tier is "standard" when query param is missing
 *   - tier query param flows through to runPciGenerateCron
 *   - clientIds loaded from sbSelect are forwarded
 */

import { strict as assert } from "node:assert";
import { mock, test } from "node:test";

// ── Mocks ──────────────────────────────────────────────────────────
// These run before the route module is imported below.

type AssertCronImpl = (req: Request) => void;
let assertCronImpl: AssertCronImpl = () => {};

mock.module("@/lib/agents/cron-auth", {
  namedExports: {
    assertCron: (req: Request) => assertCronImpl(req),
  },
});

let mockClientRows: Array<{ client_id: string }> = [];
const sbSelectCalls: Array<{
  table: string;
  params: unknown;
  options: unknown;
}> = [];

mock.module("@/lib/agents/supabase", {
  namedExports: {
    sbSelect: async (table: string, params: unknown, options: unknown) => {
      sbSelectCalls.push({ table, params, options });
      return mockClientRows;
    },
  },
});

mock.module("@/lib/agents/config", {
  namedExports: {
    getClientConfig: async (clientId: string) => ({
      clientId,
      businessName: clientId,
      vertical: "test",
      pciCronTier: "standard",
      agents: { support: true, frontDesk: false, care: false },
      active: true,
    }),
  },
});

interface CapturedCronInput {
  tier: string;
  clientIds: string[];
}

let lastCronInput: CapturedCronInput | null = null;

mock.module("@/lib/pci/cron-generate-handler", {
  namedExports: {
    runPciGenerateCron: async (input: {
      tier: "standard" | "realtime";
      clientIds: string[];
    }) => {
      lastCronInput = { tier: input.tier, clientIds: [...input.clientIds] };
      return {
        ok: true,
        tier: input.tier,
        processed: input.clientIds.length,
        succeeded: input.clientIds.length,
        failed: 0,
        errors: [],
      };
    },
  },
});

// Import after every mock is registered.
const { GET } = await import("../route.ts");

function reset(): void {
  assertCronImpl = () => {};
  mockClientRows = [];
  sbSelectCalls.length = 0;
  lastCronInput = null;
}

// ── Tests ─────────────────────────────────────────────────────────

test("401 when assertCron throws", async () => {
  reset();
  assertCronImpl = () => {
    throw new Error("unauthorized");
  };
  const res = await GET(
    new Request("https://example.com/api/cron/pci-generate?tier=standard")
  );
  assert.equal(res.status, 401);
  const json = (await res.json()) as { error: string };
  assert.equal(json.error, "unauthorized");
});

test("default tier is 'standard' when query param missing", async () => {
  reset();
  mockClientRows = [{ client_id: "santa" }];
  const res = await GET(
    new Request("https://example.com/api/cron/pci-generate")
  );
  assert.equal(res.status, 200);
  assert.equal(lastCronInput?.tier, "standard");
});

test("tier=realtime flows through to the cron runner", async () => {
  reset();
  mockClientRows = [{ client_id: "opsbynoell" }];
  const res = await GET(
    new Request("https://example.com/api/cron/pci-generate?tier=realtime")
  );
  assert.equal(res.status, 200);
  assert.equal(lastCronInput?.tier, "realtime");
});

test("clientIds loaded from sbSelect are forwarded", async () => {
  reset();
  mockClientRows = [
    { client_id: "santa" },
    { client_id: "opsbynoell" },
    { client_id: "third" },
  ];
  const res = await GET(
    new Request("https://example.com/api/cron/pci-generate?tier=standard")
  );
  assert.equal(res.status, 200);
  assert.deepEqual(lastCronInput?.clientIds, ["santa", "opsbynoell", "third"]);
  assert.equal(sbSelectCalls.length, 1);
  assert.equal(sbSelectCalls[0].table, "clients");
});

test("response includes tier, processed, succeeded, failed, errors", async () => {
  reset();
  mockClientRows = [{ client_id: "a" }];
  const res = await GET(
    new Request("https://example.com/api/cron/pci-generate?tier=standard")
  );
  const json = (await res.json()) as Record<string, unknown>;
  assert.equal(json.ok, true);
  assert.equal(json.tier, "standard");
  assert.equal(typeof json.processed, "number");
  assert.equal(typeof json.succeeded, "number");
  assert.equal(typeof json.failed, "number");
  assert.ok(Array.isArray(json.errors));
});
