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

// Track UPDATEs so the lead-capture test can assert visitor_* columns
// got patched onto the session row.
const sbUpdateCalls: Array<{
  table: string;
  filter: Record<string, unknown>;
  patch: Record<string, unknown>;
}> = [];

// Track outbound side-effects (SMS / Telegram / email) the runner fires
// on escalation so the lead-capture test can assert they were called.
const ownerSmsCalls: Array<Record<string, unknown>> = [];
const telegramCalls: Array<Record<string, unknown>> = [];
const emailCalls: Array<Record<string, unknown>> = [];

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
    sbUpdate: async (
      table: string,
      filter: Record<string, unknown>,
      patch: Record<string, unknown>
    ) => {
      sbUpdateCalls.push({ table, filter, patch });
      return [];
    },
    sbUpsert: async () => ({}),
  },
});

// Stub the outbound side-effects so the lead-capture test never opens
// a network socket. Each mock just records the call for assertions.
mock.module("./sms-alert.ts", {
  namedExports: {
    sendOwnerSmsAlert: async (params: Record<string, unknown>) => {
      ownerSmsCalls.push(params);
      return { ok: true, messageId: "stub-sms-id" };
    },
  },
});
mock.module("./telegram.ts", {
  namedExports: {
    sendTelegramAlert: async (params: Record<string, unknown>) => {
      telegramCalls.push(params);
      return { ok: true };
    },
  },
});
mock.module("./email-alert.ts", {
  namedExports: {
    sendAgentEmailAlert: async (params: Record<string, unknown>) => {
      emailCalls.push(params);
      return { ok: true };
    },
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
  sbUpdateCalls.length = 0;
  ownerSmsCalls.length = 0;
  telegramCalls.length = 0;
  emailCalls.length = 0;
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

// ── Lead capture: extractor backfill + forced escalation (Bug 1) ───────────

test(
  "runTurn extracts visitor name/phone/email from chat, patches session, " +
    "and escalates when a phone is captured for the first time",
  async () => {
    resetCalls();
    mockClient = {
      client_id: "opsbynoell",
      business_name: "Ops by Noell",
      agents: { support: true, frontDesk: true, care: false },
      sms_config: {
        fromNumber: "+19499973915",
        alertSmsTo: "+19497849726",
      },
      // No keyword escalation rules; classifier won't escalate either
      // (the stub returns escalate:false). The only thing that should
      // promote this turn to escalated=true is the lead-capture path.
      escalation_rules: [],
      active: true,
    };

    const result = await runTurn({
      agent: "support",
      payload: {
        clientId: "opsbynoell",
        agent: "support",
        channel: "chat",
        from: {}, // anonymous web visitor — widget didn't pre-fill
        message: "Sarah Mendez, 949-555-0142, sarah@derma.co",
      },
      tables: {
        sessions: "support_sessions",
        messages: "support_messages",
      },
      defaultTriggerType: "website_chat",
    });

    // Escalation flag flips on so the API response signals the alert
    // path fired (this is what the live curl repro asserts).
    assert.equal(result.escalated, true);

    // The session row got a PATCH with all three extracted fields.
    const sessionPatches = sbUpdateCalls.filter(
      (c) => c.table === "support_sessions"
    );
    assert.ok(sessionPatches.length >= 1, "expected a support_sessions UPDATE");
    const visitorPatch = sessionPatches.find(
      (c) =>
        c.patch.visitor_name !== undefined ||
        c.patch.visitor_phone !== undefined ||
        c.patch.visitor_email !== undefined
    );
    assert.ok(visitorPatch, "expected a visitor_* PATCH");
    assert.equal(visitorPatch!.patch.visitor_name, "Sarah Mendez");
    assert.equal(visitorPatch!.patch.visitor_phone, "+19495550142");
    assert.equal(visitorPatch!.patch.visitor_email, "sarah@derma.co");

    // The owner SMS alert (the actual reason this bug exists) fired.
    assert.equal(ownerSmsCalls.length, 1);
    const smsCall = ownerSmsCalls[0] as {
      message: string;
      sessionContext: { agent: string };
    };
    assert.match(smsCall.message, /Sarah Mendez/);
    assert.match(smsCall.message, /\+19495550142/);
    assert.match(smsCall.message, /lead captured/);
    assert.equal(smsCall.sessionContext.agent, "support");

    // Telegram + email also fire alongside SMS.
    assert.equal(telegramCalls.length, 1);
    assert.equal(emailCalls.length, 1);
  }
);

// ── Lead capture: stats-speak must NOT trigger backfill or escalation ──────

test(
  "runTurn does NOT extract a phone from stats-speak " +
    "and does NOT escalate when no contact info is present",
  async () => {
    resetCalls();
    mockClient = {
      client_id: "opsbynoell",
      business_name: "Ops by Noell",
      agents: { support: true, frontDesk: true, care: false },
      sms_config: {
        fromNumber: "+19499973915",
        alertSmsTo: "+19497849726",
      },
      escalation_rules: [],
      active: true,
    };

    const result = await runTurn({
      agent: "support",
      payload: {
        clientId: "opsbynoell",
        agent: "support",
        channel: "chat",
        from: {},
        message: "we miss 20-35% of calls and get 200 calls/week",
      },
      tables: {
        sessions: "support_sessions",
        messages: "support_messages",
      },
      defaultTriggerType: "website_chat",
    });

    assert.equal(result.escalated, false);
    const visitorPatch = sbUpdateCalls.find(
      (c) =>
        c.table === "support_sessions" &&
        (c.patch.visitor_name !== undefined ||
          c.patch.visitor_phone !== undefined ||
          c.patch.visitor_email !== undefined)
    );
    assert.equal(
      visitorPatch,
      undefined,
      "expected no visitor_* PATCH for a stats-only message"
    );
    assert.equal(ownerSmsCalls.length, 0);
  }
);
