/**
 * Tests for the inbound-visitor-SMS bridge (pure logic).
 *
 * Covers:
 *   - extractInboundVisitorPayload           — normalises GHL + LC webhook shapes
 *   - findClientIdByInboundToPhone           — resolves client by sms_config.fromNumber
 *   - findClientIdByLocationId               — resolves client by sms_config.locationId
 *   - findSoleActiveSmsClient                — single-tenant fallback
 *   - resolveClientForInboundVisitorSms      — priority chain (toPhone → locationId → sole)
 *   - isOwnNumberLoop                        — loop guard
 *   - buildOutboundVisitorReplyPayload       — shape of the outbound send
 *   - dispatchVisitorReply                   — fail-soft around the SMS integration
 */

import { strict as assert } from "node:assert";
import { mock, test } from "node:test";

// ── Supabase mocks ─────────────────────────────────────────────────────────

const sbSelectCalls: Array<{
  table: string;
  params: Record<string, unknown>;
  options: Record<string, unknown> | undefined;
}> = [];

// Per-call queue of rows — each call to sbSelect("clients", ...) pops the
// next entry so we can script the priority-chain tests precisely.
let mockClientRowQueue: Array<Array<Record<string, unknown>>> = [];

mock.module("./supabase.ts", {
  namedExports: {
    sbSelect: async (
      table: string,
      params: Record<string, unknown>,
      options?: Record<string, unknown>
    ) => {
      sbSelectCalls.push({ table, params, options });
      if (table === "clients") {
        return mockClientRowQueue.shift() ?? [];
      }
      return [];
    },
    sbInsert: async (_t: string, row: Record<string, unknown>) => ({
      id: "x",
      ...row,
    }),
    sbUpdate: async () => [],
    sbUpsert: async () => ({}),
  },
});

const {
  extractInboundVisitorPayload,
  findClientIdByInboundToPhone,
  findClientIdByLocationId,
  findSoleActiveSmsClient,
  resolveClientForInboundVisitorSms,
  isOwnNumberLoop,
  buildOutboundVisitorReplyPayload,
  dispatchVisitorReply,
} = await import("./inbound-visitor-sms-handler.ts");

import type { ClientConfig, MessagingIntegration } from "./types.ts";

function resetMocks() {
  sbSelectCalls.length = 0;
  mockClientRowQueue = [];
}

// ── extractInboundVisitorPayload ───────────────────────────────────────────

test("extractInboundVisitorPayload: GHL Conversations shape with toNumber", () => {
  const p = extractInboundVisitorPayload({
    phone: "+17145550123",
    toNumber: "+19499973915",
    body: "hi, do you have any openings today?",
    contactId: "ghl_contact_123",
    conversationId: "ghl_conv_456",
  });
  assert.ok(p);
  assert.equal(p.fromPhone, "+17145550123");
  assert.equal(p.toPhone, "+19499973915");
  assert.equal(p.messageText, "hi, do you have any openings today?");
  assert.equal(p.contactId, "ghl_contact_123");
  assert.equal(p.conversationId, "ghl_conv_456");
});

test("extractInboundVisitorPayload: LC workflow aliases", () => {
  const p = extractInboundVisitorPayload({
    from: "+17145550123",
    to: "+19499973915",
    message: "alias form",
  });
  assert.ok(p);
  assert.equal(p.fromPhone, "+17145550123");
  assert.equal(p.toPhone, "+19499973915");
  assert.equal(p.messageText, "alias form");
  assert.equal(p.contactId, undefined);
  assert.equal(p.conversationId, undefined);
});

test("extractInboundVisitorPayload: accepts snake_case id aliases", () => {
  const p = extractInboundVisitorPayload({
    phone: "+17145550123",
    toNumber: "+19499973915",
    body: "hi",
    contact_id: "c_123",
    conversation_id: "conv_456",
  });
  assert.ok(p);
  assert.equal(p.contactId, "c_123");
  assert.equal(p.conversationId, "conv_456");
});

test("extractInboundVisitorPayload: null when fromPhone missing", () => {
  assert.equal(
    extractInboundVisitorPayload({ toNumber: "+19499973915", body: "x" }),
    null
  );
});

test("extractInboundVisitorPayload: canonical GHL shape without toNumber is accepted", () => {
  // GHL rejects {{message.to_number}} in some workflow triggers, so the
  // webhook body will commonly arrive with just `phone` + `body`. The
  // client must be resolved downstream via locationId or the
  // single-tenant fallback.
  const p = extractInboundVisitorPayload({
    phone: "+17145550123",
    body: "hi",
  });
  assert.ok(p);
  assert.equal(p.fromPhone, "+17145550123");
  assert.equal(p.toPhone, undefined);
  assert.equal(p.locationId, undefined);
});

test("extractInboundVisitorPayload: accepts locationId (camel or snake case)", () => {
  const p1 = extractInboundVisitorPayload({
    phone: "+17145550123",
    body: "hi",
    locationId: "vdWqRPcn6jIx8AK0DlHF",
  });
  assert.equal(p1?.locationId, "vdWqRPcn6jIx8AK0DlHF");

  const p2 = extractInboundVisitorPayload({
    phone: "+17145550123",
    body: "hi",
    location_id: "vdWqRPcn6jIx8AK0DlHF",
  });
  assert.equal(p2?.locationId, "vdWqRPcn6jIx8AK0DlHF");
});

test("extractInboundVisitorPayload: messageText defaults to empty string", () => {
  const p = extractInboundVisitorPayload({
    phone: "+17145550123",
    toNumber: "+19499973915",
  });
  assert.ok(p);
  assert.equal(p.messageText, "");
});

// ── findClientIdByInboundToPhone ───────────────────────────────────────────

test("findClientIdByInboundToPhone: queries by sms_config->>fromNumber and active=true", async () => {
  resetMocks();
  mockClientRowQueue = [
    [{ client_id: "santa", sms_config: { fromNumber: "+19499973915" } }],
  ];

  const id = await findClientIdByInboundToPhone("+19499973915");
  assert.equal(id, "santa");

  assert.equal(sbSelectCalls.length, 1);
  const call = sbSelectCalls[0];
  assert.equal(call.table, "clients");
  const params = call.params as Record<string, string>;
  assert.equal(params["sms_config->>fromNumber"], "eq.+19499973915");
  assert.equal(params.active, "eq.true");
  assert.equal((call.options as { limit?: number }).limit, 1);
});

test("findClientIdByInboundToPhone: returns null when no client matches", async () => {
  resetMocks();
  mockClientRowQueue = [[]];
  const id = await findClientIdByInboundToPhone("+10000000000");
  assert.equal(id, null);
});

// ── findClientIdByLocationId ───────────────────────────────────────────────

test("findClientIdByLocationId: resolves via sms_config.locationId", async () => {
  resetMocks();
  mockClientRowQueue = [
    [{ client_id: "santa", sms_config: { locationId: "loc_abc" } }],
  ];

  const id = await findClientIdByLocationId("loc_abc");
  assert.equal(id, "santa");

  const params = sbSelectCalls[0].params as Record<string, string>;
  assert.equal(params["sms_config->>locationId"], "eq.loc_abc");
  assert.equal(params.active, "eq.true");
});

test("findClientIdByLocationId: throws when two active clients share a locationId", async () => {
  resetMocks();
  mockClientRowQueue = [
    [
      { client_id: "santa", sms_config: { locationId: "loc_shared" } },
      { client_id: "opsbynoell", sms_config: { locationId: "loc_shared" } },
    ],
  ];
  await assert.rejects(
    () => findClientIdByLocationId("loc_shared"),
    /multiple active clients share sms_config.locationId/
  );
});

// ── findSoleActiveSmsClient ────────────────────────────────────────────────

test("findSoleActiveSmsClient: returns ok when exactly one active client has fromNumber", async () => {
  resetMocks();
  mockClientRowQueue = [
    [{ client_id: "santa", sms_config: { fromNumber: "+19499973915" } }],
  ];
  const r = await findSoleActiveSmsClient();
  assert.equal(r.kind, "ok");
  if (r.kind === "ok") {
    assert.equal(r.clientId, "santa");
    assert.equal(r.fromNumber, "+19499973915");
  }
});

test("findSoleActiveSmsClient: ambiguous when multiple clients configured", async () => {
  resetMocks();
  mockClientRowQueue = [
    [
      { client_id: "santa", sms_config: { fromNumber: "+19499973915" } },
      { client_id: "opsbynoell", sms_config: { fromNumber: "+19495550000" } },
    ],
  ];
  const r = await findSoleActiveSmsClient();
  assert.equal(r.kind, "ambiguous");
  if (r.kind === "ambiguous") {
    assert.deepEqual(r.candidates.sort(), ["opsbynoell", "santa"]);
  }
});

test("findSoleActiveSmsClient: none when no clients configured", async () => {
  resetMocks();
  mockClientRowQueue = [[]];
  const r = await findSoleActiveSmsClient();
  assert.equal(r.kind, "none");
});

// ── resolveClientForInboundVisitorSms ──────────────────────────────────────

test("resolveClientForInboundVisitorSms: prefers toPhone when it resolves", async () => {
  resetMocks();
  mockClientRowQueue = [
    // toPhone lookup → santa
    [{ client_id: "santa", sms_config: { fromNumber: "+19499973915" } }],
  ];
  const r = await resolveClientForInboundVisitorSms({
    toPhone: "+19499973915",
    locationId: "loc_abc",
  });
  assert.equal(r.kind, "ok");
  if (r.kind === "ok") {
    assert.equal(r.clientId, "santa");
    assert.equal(r.via, "toPhone");
  }
  // Only the toPhone query should have fired — locationId never consulted.
  assert.equal(sbSelectCalls.length, 1);
});

test("resolveClientForInboundVisitorSms: falls back to locationId when toPhone misses", async () => {
  resetMocks();
  mockClientRowQueue = [
    [], // toPhone miss
    [{ client_id: "santa", sms_config: { locationId: "loc_abc" } }], // locationId hit
  ];
  const r = await resolveClientForInboundVisitorSms({
    toPhone: "+10000000000",
    locationId: "loc_abc",
  });
  assert.equal(r.kind, "ok");
  if (r.kind === "ok") {
    assert.equal(r.clientId, "santa");
    assert.equal(r.via, "locationId");
  }
});

test("resolveClientForInboundVisitorSms: falls back to sole active client when neither toPhone nor locationId supplied", async () => {
  resetMocks();
  mockClientRowQueue = [
    // No toPhone query (not provided). No locationId query. Sole-client query only.
    [{ client_id: "santa", sms_config: { fromNumber: "+19499973915" } }],
  ];
  const r = await resolveClientForInboundVisitorSms({});
  assert.equal(r.kind, "ok");
  if (r.kind === "ok") {
    assert.equal(r.clientId, "santa");
    assert.equal(r.via, "sole");
  }
  assert.equal(sbSelectCalls.length, 1);
});

test("resolveClientForInboundVisitorSms: returns ambiguous when the sole-fallback would match multiple clients", async () => {
  resetMocks();
  mockClientRowQueue = [
    [
      { client_id: "santa", sms_config: { fromNumber: "+19499973915" } },
      { client_id: "opsbynoell", sms_config: { fromNumber: "+19495550000" } },
    ],
  ];
  const r = await resolveClientForInboundVisitorSms({});
  assert.equal(r.kind, "ambiguous");
  if (r.kind === "ambiguous") {
    assert.deepEqual(r.candidates.sort(), ["opsbynoell", "santa"]);
  }
});

test("resolveClientForInboundVisitorSms: returns none when no strategy resolves", async () => {
  resetMocks();
  mockClientRowQueue = [
    [], // toPhone miss
    [], // locationId miss
    [], // no sole client
  ];
  const r = await resolveClientForInboundVisitorSms({
    toPhone: "+10000000000",
    locationId: "loc_nope",
  });
  assert.equal(r.kind, "none");
});

// ── isOwnNumberLoop ────────────────────────────────────────────────────────

const stubCfg: ClientConfig = {
  clientId: "santa",
  businessName: "Healing Hands by Santa",
  vertical: "massage",
  agents: { support: false, frontDesk: true, care: false },
  active: true,
  smsConfig: { fromNumber: "+19499973915" },
};

test("isOwnNumberLoop: true when visitor phone equals our own LC Phone", () => {
  assert.equal(isOwnNumberLoop(stubCfg, "+19499973915"), true);
});

test("isOwnNumberLoop: false for a normal visitor phone", () => {
  assert.equal(isOwnNumberLoop(stubCfg, "+17145550123"), false);
});

test("isOwnNumberLoop: false when fromNumber is not configured", () => {
  const cfg: ClientConfig = { ...stubCfg, smsConfig: {} };
  assert.equal(isOwnNumberLoop(cfg, "+17145550123"), false);
});

// ── buildOutboundVisitorReplyPayload ───────────────────────────────────────

test("buildOutboundVisitorReplyPayload: returns to/body/agent/sessionId/clientId", () => {
  const out = buildOutboundVisitorReplyPayload({
    cfg: stubCfg,
    agent: "frontDesk",
    sessionId: "sess-xyz",
    visitorPhone: "+17145550123",
    replyText: "Hi! Yes, I have 2pm open today.",
  });
  assert.deepEqual(out, {
    to: "+17145550123",
    body: "Hi! Yes, I have 2pm open today.",
    agent: "frontDesk",
    sessionId: "sess-xyz",
    clientId: "santa",
  });
});

test("buildOutboundVisitorReplyPayload: trims whitespace around reply text", () => {
  const out = buildOutboundVisitorReplyPayload({
    cfg: stubCfg,
    agent: "frontDesk",
    sessionId: "sess-xyz",
    visitorPhone: "+17145550123",
    replyText: "   hello  \n",
  });
  assert.equal(out.body, "hello");
});

test("buildOutboundVisitorReplyPayload: empty reply becomes empty body (caller must skip)", () => {
  const out = buildOutboundVisitorReplyPayload({
    cfg: stubCfg,
    agent: "frontDesk",
    sessionId: "sess-xyz",
    visitorPhone: "+17145550123",
    replyText: "",
  });
  assert.equal(out.body, "");
});

// ── dispatchVisitorReply ───────────────────────────────────────────────────

function stubSms(behavior: {
  sendSMS: (to: string, body: string) => Promise<{ messageId: string }>;
}): MessagingIntegration {
  return {
    sendSMS: behavior.sendSMS,
  };
}

test("dispatchVisitorReply: returns sent:true with messageId on success", async () => {
  const calls: Array<{ to: string; body: string }> = [];
  const sms = stubSms({
    sendSMS: async (to, body) => {
      calls.push({ to, body });
      return { messageId: "msg_sent_1" };
    },
  });
  const r = await dispatchVisitorReply(
    {
      to: "+17145550123",
      body: "hi!",
      agent: "frontDesk",
      sessionId: "sess-1",
      clientId: "santa",
    },
    stubCfg,
    { getSms: () => sms }
  );
  assert.equal(r.sent, true);
  assert.equal(r.messageId, "msg_sent_1");
  assert.equal(calls.length, 1);
  assert.equal(calls[0].to, "+17145550123");
  assert.equal(calls[0].body, "hi!");
});

test("dispatchVisitorReply: empty body short-circuits with empty_reply", async () => {
  let called = false;
  const sms = stubSms({
    sendSMS: async () => {
      called = true;
      return { messageId: "should_not_happen" };
    },
  });
  const r = await dispatchVisitorReply(
    {
      to: "+17145550123",
      body: "",
      agent: "frontDesk",
      sessionId: "sess-1",
      clientId: "santa",
    },
    stubCfg,
    { getSms: () => sms }
  );
  assert.equal(r.sent, false);
  assert.equal(r.error, "empty_reply");
  assert.equal(called, false, "sendSMS must NOT be called when body is empty");
});

test("dispatchVisitorReply: fails soft when sendSMS throws", async () => {
  const sms = stubSms({
    sendSMS: async () => {
      throw new Error("ghl sms send failed: 422 boom");
    },
  });
  const r = await dispatchVisitorReply(
    {
      to: "+17145550123",
      body: "hi",
      agent: "frontDesk",
      sessionId: "sess-1",
      clientId: "santa",
    },
    stubCfg,
    { getSms: () => sms }
  );
  assert.equal(r.sent, false);
  assert.match(r.error ?? "", /422 boom/);
});
