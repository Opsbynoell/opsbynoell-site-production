/**
 * Tests for the two-way SMS reply bridge.
 *
 * Tests handleInboundSms() and extractInboundPayload() from
 * inbound-sms-handler.ts — the pure logic layer, decoupled from the
 * Next.js route wrapper.
 *
 * Phone semantic verification (the most common bug in two-way bridges):
 *   Outbound alert:  from = fromNumber (+19499973915)  →  to = alertSmsTo (+19497849726)
 *   Nikki's reply:   from = +19497849726               →  to = +19499973915
 *   Table key:       from_phone = alertSmsTo (+19497849726)   ← REPLIER
 *                    to_phone   = fromNumber (+19499973915)   ← LC Phone
 */

import { strict as assert } from "node:assert";
import { mock, test } from "node:test";

// ── Mocks ──────────────────────────────────────────────────────────────────

const sbSelectCalls: Array<{ table: string; params: Record<string, unknown> }> = [];
const sbInsertCalls: Array<{ table: string; row: Record<string, unknown> }> = [];
const sbUpdateCalls: Array<{
  table: string;
  filter: Record<string, unknown>;
  patch: Record<string, unknown>;
}> = [];

// Overrideable session mapping returned by sbSelect.
let mockMapping: Record<string, unknown> | null = {
  from_phone: "+19497849726",
  to_phone: "+19499973915",
  session_id: "sess-uuid-001",
  agent: "support",
  client_id: "client-abc",
};

mock.module("./supabase.ts", {
  namedExports: {
    sbSelect: async (table: string, params: Record<string, unknown>) => {
      sbSelectCalls.push({ table, params });
      if (table === "sms_alert_sessions" && mockMapping) {
        return [mockMapping];
      }
      return [];
    },
    sbInsert: async (table: string, row: Record<string, unknown>) => {
      sbInsertCalls.push({ table, row });
      return { id: "new-msg-id", ...row };
    },
    sbUpdate: async (
      table: string,
      filter: Record<string, unknown>,
      patch: Record<string, unknown>
    ) => {
      sbUpdateCalls.push({ table, filter, patch });
      return [patch];
    },
    sbUpsert: async () => ({}),
  },
});

const { handleInboundSms, extractInboundPayload, resolveTables } =
  await import("./inbound-sms-handler.ts");

// ── Helpers ────────────────────────────────────────────────────────────────

function resetCalls() {
  sbSelectCalls.length = 0;
  sbInsertCalls.length = 0;
  sbUpdateCalls.length = 0;
}

// ── Unit tests: extractInboundPayload ──────────────────────────────────────

test("extractInboundPayload: primary GHL shape (phone / toNumber / body)", () => {
  const result = extractInboundPayload({
    phone: "+19497849726",
    toNumber: "+19499973915",
    body: "Heyyyyyy",
  });
  assert.ok(result);
  assert.equal(result.fromPhone, "+19497849726");
  assert.equal(result.toPhone, "+19499973915");
  assert.equal(result.messageText, "Heyyyyyy");
});

test("extractInboundPayload: LC workflow alias shape (from / to / message)", () => {
  const result = extractInboundPayload({
    from: "+19497849726",
    to: "+19499973915",
    message: "Using aliases",
  });
  assert.ok(result);
  assert.equal(result.fromPhone, "+19497849726");
  assert.equal(result.toPhone, "+19499973915");
  assert.equal(result.messageText, "Using aliases");
});

test("extractInboundPayload: returns null when phones are missing", () => {
  assert.equal(extractInboundPayload({ body: "no phones" }), null);
  assert.equal(extractInboundPayload({ phone: "+1..." }), null); // missing toPhone
});

// ── Unit tests: resolveTables ──────────────────────────────────────────────

test("resolveTables: support → chatSessions / chatMessages (camelCase)", () => {
  const t = resolveTables("support");
  assert.equal(t.sessionsTable, "chatSessions");
  assert.equal(t.messagesTable, "chatMessages");
  assert.equal(t.humanTakeoverField, "humanTakeover");
  assert.equal(t.sessionIdField, "sessionId");
});

test("resolveTables: frontDesk → front_desk_sessions / front_desk_messages", () => {
  const t = resolveTables("frontDesk");
  assert.equal(t.sessionsTable, "front_desk_sessions");
  assert.equal(t.messagesTable, "front_desk_messages");
  assert.equal(t.humanTakeoverField, "human_takeover");
  assert.equal(t.sessionIdField, "session_id");
});

test("resolveTables: care → care_sessions / care_messages", () => {
  const t = resolveTables("care");
  assert.equal(t.sessionsTable, "care_sessions");
  assert.equal(t.messagesTable, "care_messages");
  assert.equal(t.humanTakeoverField, "human_takeover");
  assert.equal(t.sessionIdField, "session_id");
});

// ── Integration tests: handleInboundSms ───────────────────────────────────

test("phone semantics: looks up (from_phone=alertSmsTo, to_phone=fromNumber)", async () => {
  resetCalls();
  // Nikki (+19497849726) replies to the LC Phone (+19499973915).
  await handleInboundSms({
    fromPhone: "+19497849726", // owner / alertSmsTo → will be inbound `from`
    toPhone: "+19499973915",   // LC Phone / fromNumber → will be inbound `to`
    messageText: "Heyyyyyy",
  });

  assert.equal(sbSelectCalls.length, 1);
  assert.equal(sbSelectCalls[0].table, "sms_alert_sessions");
  const params = sbSelectCalls[0].params as Record<string, string>;
  assert.equal(
    params.from_phone,
    "eq.+19497849726",
    "from_phone must be the replier (alertSmsTo / Nikki's cell)"
  );
  assert.equal(
    params.to_phone,
    "eq.+19499973915",
    "to_phone must be the LC Phone (fromNumber used in outbound)"
  );
});

test("known sender: inserts human message into chatMessages with author 'Nikki (human)'", async () => {
  resetCalls();
  const result = await handleInboundSms({
    fromPhone: "+19497849726",
    toPhone: "+19499973915",
    messageText: "Heyyyyyy",
  });

  assert.equal(result.ok, true);
  if (!result.ok) throw new Error("expected ok");
  assert.equal(result.sessionId, "sess-uuid-001");

  // One insert (message), one update (session patch).
  assert.equal(sbInsertCalls.length, 1);
  assert.equal(sbUpdateCalls.length, 1);

  const msg = sbInsertCalls[0].row;
  assert.equal(msg.content, "Heyyyyyy");
  assert.equal(msg.role, "human");
  assert.equal(msg.author, "Nikki (human)");
  assert.equal(sbInsertCalls[0].table, "chatMessages");
});

test("known sender (support): flips humanTakeover=true on chatSessions (camelCase)", async () => {
  resetCalls();
  await handleInboundSms({
    fromPhone: "+19497849726",
    toPhone: "+19499973915",
    messageText: "I'm here",
  });

  const update = sbUpdateCalls[0];
  assert.equal(update.table, "chatSessions");
  assert.equal(update.patch.humanTakeover, true);
});

test("known sender (frontDesk): uses front_desk_messages and human_takeover", async () => {
  resetCalls();
  const saved = mockMapping;
  mockMapping = {
    from_phone: "+19497849726",
    to_phone: "+19499973915",
    session_id: "sess-fd-002",
    agent: "frontDesk",
    client_id: "client-abc",
  };
  try {
    const result = await handleInboundSms({
      fromPhone: "+19497849726",
      toPhone: "+19499973915",
      messageText: "Be there in 5",
    });
    assert.equal(result.ok, true);
    if (!result.ok) throw new Error("expected ok");
    assert.equal(result.sessionId, "sess-fd-002");

    const insert = sbInsertCalls[0];
    assert.equal(insert.table, "front_desk_messages");
    assert.equal(insert.row.session_id, "sess-fd-002");
    assert.equal(insert.row.role, "human");
    assert.equal(insert.row.author, "Nikki (human)");

    const update = sbUpdateCalls[0];
    assert.equal(update.table, "front_desk_sessions");
    assert.equal(update.patch.human_takeover, true);
  } finally {
    mockMapping = saved;
  }
});

test("known sender (care): uses care_messages and human_takeover", async () => {
  resetCalls();
  const saved = mockMapping;
  mockMapping = {
    from_phone: "+19497849726",
    to_phone: "+19499973915",
    session_id: "sess-care-003",
    agent: "care",
    client_id: "client-abc",
  };
  try {
    await handleInboundSms({
      fromPhone: "+19497849726",
      toPhone: "+19499973915",
      messageText: "On my way",
    });
    assert.equal(sbInsertCalls[0].table, "care_messages");
    assert.equal(sbUpdateCalls[0].table, "care_sessions");
    assert.equal(sbUpdateCalls[0].patch.human_takeover, true);
  } finally {
    mockMapping = saved;
  }
});

test("unknown sender: returns no_mapping, zero DB writes", async () => {
  resetCalls();
  const saved = mockMapping;
  mockMapping = null;
  try {
    const result = await handleInboundSms({
      fromPhone: "+10000000000",
      toPhone: "+19499973915",
      messageText: "spam",
    });
    assert.equal(result.ok, false);
    if (result.ok) throw new Error("expected not ok");
    assert.equal(result.reason, "no_mapping");
    assert.equal(sbInsertCalls.length, 0);
    assert.equal(sbUpdateCalls.length, 0);
  } finally {
    mockMapping = saved;
  }
});

test("empty message body is stored as '(empty)'", async () => {
  resetCalls();
  await handleInboundSms({
    fromPhone: "+19497849726",
    toPhone: "+19499973915",
    messageText: "   ", // whitespace only
  });
  assert.equal(sbInsertCalls[0].row.content, "(empty)");
});
