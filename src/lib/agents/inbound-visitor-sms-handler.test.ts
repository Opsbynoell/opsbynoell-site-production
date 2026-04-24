/**
 * Tests for the inbound-visitor-SMS bridge (pure logic).
 *
 * Covers:
 *   - extractInboundVisitorPayload  — normalises GHL + LC webhook shapes
 *   - findClientIdByInboundToPhone  — resolves client by sms_config.fromNumber
 *   - buildOutboundVisitorReplyPayload — shape of the outbound send
 *   - dispatchVisitorReply  — fail-soft around the SMS integration
 */

import { strict as assert } from "node:assert";
import { mock, test } from "node:test";

// ── Supabase mocks ─────────────────────────────────────────────────────────

const sbSelectCalls: Array<{
  table: string;
  params: Record<string, unknown>;
  options: Record<string, unknown> | undefined;
}> = [];

let mockClientRows: Array<Record<string, unknown>> = [];

mock.module("./supabase.ts", {
  namedExports: {
    sbSelect: async (
      table: string,
      params: Record<string, unknown>,
      options?: Record<string, unknown>
    ) => {
      sbSelectCalls.push({ table, params, options });
      if (table === "clients") return mockClientRows;
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
  buildOutboundVisitorReplyPayload,
  dispatchVisitorReply,
} = await import("./inbound-visitor-sms-handler.ts");

import type { ClientConfig, MessagingIntegration } from "./types.ts";

// ── extractInboundVisitorPayload ───────────────────────────────────────────

test("extractInboundVisitorPayload: GHL Conversations shape", () => {
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

test("extractInboundVisitorPayload: null when toPhone missing", () => {
  // Unlike owner-reply (which can fall back to recent session), visitor-SMS
  // routing REQUIRES the destination to locate the client.
  assert.equal(
    extractInboundVisitorPayload({ phone: "+17145550123", body: "x" }),
    null
  );
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
  sbSelectCalls.length = 0;
  mockClientRows = [
    { client_id: "santa", sms_config: { fromNumber: "+19499973915" } },
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
  sbSelectCalls.length = 0;
  mockClientRows = [];
  const id = await findClientIdByInboundToPhone("+10000000000");
  assert.equal(id, null);
});

// ── buildOutboundVisitorReplyPayload ───────────────────────────────────────

const stubCfg: ClientConfig = {
  clientId: "santa",
  businessName: "Healing Hands by Santa",
  vertical: "massage",
  agents: { support: false, frontDesk: true, care: false },
  active: true,
};

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
