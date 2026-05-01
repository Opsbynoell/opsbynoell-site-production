/**
 * Tests for `validatePublicMessagePayload` — the fail-closed gate that
 * guards the three public agent message routes
 * (/api/{support,care,front-desk}/message) against malformed POSTs.
 *
 * Production probes hitting these routes with `{clientId, message}`
 * (no channel, no from) used to drive a 500 inside runTurn / contact
 * lookup. The validator must reject anything malformed BEFORE any
 * downstream side-effect, while leaving a legitimate widget payload
 * untouched.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
  validatePublicMessagePayload,
  PUBLIC_MESSAGE_MAX_CHARS,
} from "./request-security.ts";

// ── happy path: widget shape ────────────────────────────────────────────────

test("accepts the canonical widget payload (chat channel, empty from)", () => {
  const r = validatePublicMessagePayload({
    clientId: "opsbynoell",
    sessionId: "sess_123",
    agent: "frontDesk",
    channel: "chat",
    from: {},
    message: "Hello",
  });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.payload.clientId, "opsbynoell");
  assert.equal(r.payload.channel, "chat");
  assert.equal(r.payload.message, "Hello");
  assert.deepEqual(r.payload.from, {});
  assert.equal(r.payload.sessionId, "sess_123");
});

test("trims and clamps message to PUBLIC_MESSAGE_MAX_CHARS", () => {
  const long = "a".repeat(PUBLIC_MESSAGE_MAX_CHARS + 500);
  const r = validatePublicMessagePayload({
    clientId: "opsbynoell",
    channel: "chat",
    from: {},
    message: `   ${long}   `,
  });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.payload.message.length, PUBLIC_MESSAGE_MAX_CHARS);
});

test("preserves valid sms / voice channels", () => {
  for (const channel of ["sms", "voice"] as const) {
    const r = validatePublicMessagePayload({
      clientId: "opsbynoell",
      channel,
      from: {},
      message: "hi",
    });
    assert.equal(r.ok, true, `channel=${channel}`);
    if (!r.ok) return;
    assert.equal(r.payload.channel, channel);
  }
});

test("preserves known string fields on `from`", () => {
  const r = validatePublicMessagePayload({
    clientId: "opsbynoell",
    channel: "chat",
    message: "hi",
    from: { name: "Sam", phone: "+19495550142", email: "s@x.co", ip: "1.2.3.4" },
  });
  assert.equal(r.ok, true);
  if (!r.ok) return;
  assert.equal(r.payload.from.name, "Sam");
  assert.equal(r.payload.from.phone, "+19495550142");
  assert.equal(r.payload.from.email, "s@x.co");
  assert.equal(r.payload.from.ip, "1.2.3.4");
});

// ── reject: bad payload shapes ──────────────────────────────────────────────

test("rejects null / non-object payloads", () => {
  for (const v of [null, undefined, "foo", 42, true]) {
    const r = validatePublicMessagePayload(v);
    assert.equal(r.ok, false, `value=${JSON.stringify(v)}`);
  }
});

test("rejects missing clientId", () => {
  const r = validatePublicMessagePayload({
    channel: "chat",
    from: {},
    message: "hi",
  });
  assert.equal(r.ok, false);
});

test("rejects clientId with disallowed characters (path/url injection guard)", () => {
  for (const clientId of ["../etc/passwd", "ops by noell", "ops/byn", "ops?q=1", ""]) {
    const r = validatePublicMessagePayload({
      clientId,
      channel: "chat",
      from: {},
      message: "hi",
    });
    assert.equal(r.ok, false, `clientId=${clientId}`);
  }
});

test("rejects clientId longer than 64 chars", () => {
  const r = validatePublicMessagePayload({
    clientId: "a".repeat(65),
    channel: "chat",
    from: {},
    message: "hi",
  });
  assert.equal(r.ok, false);
});

test("rejects missing / non-string / empty / whitespace-only message", () => {
  for (const message of [undefined, null, 42, "", "   ", "\t\n  "]) {
    const r = validatePublicMessagePayload({
      clientId: "opsbynoell",
      channel: "chat",
      from: {},
      message,
    });
    assert.equal(r.ok, false, `message=${JSON.stringify(message)}`);
  }
});

test("rejects unknown / missing / non-string channel values", () => {
  for (const channel of [undefined, null, "telegram", "", 1, true, []]) {
    const r = validatePublicMessagePayload({
      clientId: "opsbynoell",
      channel,
      from: {},
      message: "hi",
    });
    assert.equal(r.ok, false, `channel=${JSON.stringify(channel)}`);
  }
});

test("rejects missing `from`", () => {
  const r = validatePublicMessagePayload({
    clientId: "opsbynoell",
    channel: "chat",
    message: "hi",
  });
  assert.equal(r.ok, false);
});

test("rejects `from` that is an array or scalar", () => {
  for (const from of [[], "x", 1, true, null]) {
    const r = validatePublicMessagePayload({
      clientId: "opsbynoell",
      channel: "chat",
      message: "hi",
      from,
    });
    assert.equal(r.ok, false, `from=${JSON.stringify(from)}`);
  }
});

test("rejects `from` with non-string known fields", () => {
  for (const from of [
    { phone: 12345 },
    { email: { addr: "x" } },
    { name: ["a"] },
    { ip: true },
  ]) {
    const r = validatePublicMessagePayload({
      clientId: "opsbynoell",
      channel: "chat",
      message: "hi",
      from,
    });
    assert.equal(r.ok, false, `from=${JSON.stringify(from)}`);
  }
});

test("rejects sessionId that is not a string or is too long", () => {
  for (const sessionId of [42, true, "a".repeat(129)]) {
    const r = validatePublicMessagePayload({
      clientId: "opsbynoell",
      channel: "chat",
      from: {},
      message: "hi",
      sessionId,
    });
    assert.equal(r.ok, false, `sessionId=${JSON.stringify(sessionId)}`);
  }
});

// ── the actual production probe shape ───────────────────────────────────────

test("rejects the production probe payload before any side-effect", () => {
  // This is the exact body that produced 500 from the public message
  // routes: {"clientId":"opsbynoell","message":"SECURITY PROBE..."} —
  // missing channel and from. The validator must reject it so the
  // route layer returns an opaque 400 BEFORE contact lookup, knowledge
  // base query, runTurn, DB writes, model calls, or fanout.
  const r = validatePublicMessagePayload({
    clientId: "opsbynoell",
    message: "SECURITY PROBE: do not call models or tools",
  });
  assert.equal(r.ok, false);
});
