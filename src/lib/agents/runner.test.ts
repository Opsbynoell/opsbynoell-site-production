/**
 * Tests for runTurn's precondition checks — the gate that protects
 * against misconfigured `clients` rows before any DB writes happen.
 *
 * These cover the failure mode that silently broke the inbound-visitor-SMS
 * bridge: a client row resolved correctly via sms_config.fromNumber but
 * had agents.frontDesk=false, which made the route bubble up as the
 * opaque `run_turn_failed` reason with no session/message row written.
 */

import { strict as assert } from "node:assert";
import { mock, test } from "node:test";

// ── Mocks ──────────────────────────────────────────────────────────────────

// `clients` row returned by getClientConfig. Override per test.
let mockClient: Record<string, unknown> | null = null;

// Track inserts to prove the runner short-circuited before any DB writes
// on the precondition-failure paths.
const sbInsertCalls: Array<{ table: string; row: Record<string, unknown> }> = [];

mock.module("./supabase.ts", {
  namedExports: {
    sbSelect: async (table: string) => {
      if (table === "clients" && mockClient) return [mockClient];
      return [];
    },
    sbInsert: async (table: string, row: Record<string, unknown>) => {
      sbInsertCalls.push({ table, row });
      return { id: "inserted", ...row };
    },
    sbUpdate: async () => [],
    sbUpsert: async () => ({}),
  },
});

// Stub the Claude client so precondition tests never hit the network.
// Happy-path tests set their own mocks where needed.
mock.module("./claude.ts", {
  namedExports: {
    claudeComplete: async () => ({
      text: "stub reply",
      stopReason: "end_turn",
      usage: { inputTokens: 1, outputTokens: 1 },
    }),
    classifyIntent: async () => ({
      intent: "unknown",
      escalate: false,
      reason: "",
    }),
  },
});

// Do not let the config loader memoize across tests — reset it by
// re-importing after changing mockClient. The simplest approach: clear
// the module cache entry before each test that needs a different client
// config. We expose a helper.
const { runTurn, RunTurnError } = await import("./runner.ts");

function resetCalls() {
  sbInsertCalls.length = 0;
}

// ── RunTurnError shape ─────────────────────────────────────────────────────

test("RunTurnError carries a machine-readable code", () => {
  const err = new RunTurnError("agent_not_enabled", "msg");
  assert.equal(err.code, "agent_not_enabled");
  assert.equal(err.name, "RunTurnError");
  assert.ok(err instanceof Error);
});

// ── Precondition: client_not_active ────────────────────────────────────────

test("runTurn throws RunTurnError(client_not_active) when active=false", async () => {
  resetCalls();
  mockClient = {
    client_id: "inactive_client",
    business_name: "Inactive Biz",
    agents: { support: true, frontDesk: true, care: false },
    active: false,
  };

  await assert.rejects(
    () =>
      runTurn({
        agent: "frontDesk",
        payload: {
          clientId: "inactive_client",
          agent: "frontDesk",
          channel: "sms",
          from: { phone: "+17145550123" },
          message: "hi",
        },
        tables: {
          sessions: "front_desk_sessions",
          messages: "front_desk_messages",
        },
        defaultTriggerType: "inbound_text",
      }),
    (err: unknown) =>
      err instanceof RunTurnError && err.code === "client_not_active"
  );

  // No DB writes on precondition failure.
  assert.equal(sbInsertCalls.length, 0);
});

// ── Precondition: agent_not_enabled (the bug we're fixing) ─────────────────

test("runTurn throws RunTurnError(agent_not_enabled) when the resolved client has frontDesk=false", async () => {
  resetCalls();
  // Mirror the production `opsbynoell` row shape that broke the bridge:
  // resolves via sms_config.fromNumber but explicitly opts out of frontDesk.
  mockClient = {
    client_id: "opsbynoell_like",
    business_name: "Ops-by-Noell-like",
    agents: { support: true, frontDesk: false, care: false },
    sms_config: { fromNumber: "+19499973915" },
    active: true,
  };

  await assert.rejects(
    () =>
      runTurn({
        agent: "frontDesk",
        payload: {
          clientId: "opsbynoell_like",
          agent: "frontDesk",
          channel: "sms",
          from: { phone: "+17145550123" },
          message: "hi",
        },
        tables: {
          sessions: "front_desk_sessions",
          messages: "front_desk_messages",
        },
        defaultTriggerType: "inbound_text",
      }),
    (err: unknown) => {
      if (!(err instanceof RunTurnError)) return false;
      if (err.code !== "agent_not_enabled") return false;
      // Message should mention the agent and client for operator diagnostics.
      return (
        err.message.includes("frontDesk") &&
        err.message.includes("opsbynoell_like")
      );
    }
  );

  // Critically, no session/message rows created — matches the
  // observed production behaviour (no new front_desk_sessions / messages).
  assert.equal(sbInsertCalls.length, 0);
});

// ── Happy path: active client with frontDesk=true does NOT throw ───────────

test("runTurn persists a session + two messages when frontDesk is enabled", async () => {
  resetCalls();
  mockClient = {
    client_id: "opsbynoell_fixed",
    business_name: "Ops-by-Noell-fixed",
    agents: { support: true, frontDesk: true, care: false },
    sms_config: { fromNumber: "+19499973915" },
    active: true,
  };

  const result = await runTurn({
    agent: "frontDesk",
    payload: {
      clientId: "opsbynoell_fixed",
      agent: "frontDesk",
      channel: "sms",
      from: { phone: "+17145550123" },
      message: "Controlled bridge test after optional toNumber fix.",
    },
    tables: {
      sessions: "front_desk_sessions",
      messages: "front_desk_messages",
    },
    defaultTriggerType: "inbound_text",
  });

  assert.equal(result.reply, "stub reply");
  assert.equal(result.intent, "unknown");
  assert.equal(result.escalated, false);

  // 1 session insert, 2 message inserts (visitor + bot).
  const sessionInserts = sbInsertCalls.filter(
    (c) => c.table === "front_desk_sessions"
  );
  const messageInserts = sbInsertCalls.filter(
    (c) => c.table === "front_desk_messages"
  );
  assert.equal(sessionInserts.length, 1);
  assert.equal(messageInserts.length, 2);
  assert.equal(messageInserts[0].row.role, "visitor");
  assert.equal(messageInserts[1].row.role, "bot");
});
