/**
 * Tests for the pure TwiML builders that drive
 * /api/front-desk/inbound-call and /api/front-desk/whisper.
 *
 * Lives in src/lib/agents/voice/ so it runs under the project's standard
 * `npm test` glob without needing to import `next/server`.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";
import {
  buildInboundCallTwiml,
  buildWhisperTwiml,
  formatPhoneForSpeech,
  resolveCallerId,
  type VoiceRouting,
} from "./twiml.ts";

const baseTargets = [
  { number: "+19497849726", timeoutSeconds: 20 },
  { number: "+19493030798", timeoutSeconds: 20 },
];

// resolveCallerId

test("resolveCallerId: default mode (twilio_number) prefers twilioNumber when set", () => {
  const id = resolveCallerId(
    { ringTargets: [], twilioNumber: "+19499196118" } as VoiceRouting,
    "+15551112222"
  );
  assert.equal(id, "+19499196118");
});

test("resolveCallerId: twilio_number falls back to inbound when twilioNumber missing", () => {
  const id = resolveCallerId(
    { ringTargets: [], callerIdMode: "twilio_number" } as VoiceRouting,
    "+15551112222"
  );
  assert.equal(id, "+15551112222");
});

test("resolveCallerId: original mode returns inbound caller", () => {
  const id = resolveCallerId(
    {
      ringTargets: [],
      callerIdMode: "original",
      twilioNumber: "+19499196118",
    } as VoiceRouting,
    "+15551112222"
  );
  assert.equal(id, "+15551112222");
});

test("resolveCallerId: original mode with no inbound returns null", () => {
  const id = resolveCallerId(
    { ringTargets: [], callerIdMode: "original" } as VoiceRouting,
    ""
  );
  assert.equal(id, null);
});

test("resolveCallerId: twilio_number with neither set returns null", () => {
  const id = resolveCallerId(
    { ringTargets: [], callerIdMode: "twilio_number" } as VoiceRouting,
    ""
  );
  assert.equal(id, null);
});

// buildInboundCallTwiml - simultaneous

test("simultaneous: callerIdMode twilio_number + twilioNumber set -> Dial callerId is the Twilio number", () => {
  const xml = buildInboundCallTwiml(
    {
      ringTargets: baseTargets,
      ringMode: "simultaneous",
      whisperEnabled: true,
      callerIdMode: "twilio_number",
      twilioNumber: "+19499196118",
    },
    "santa",
    "https://www.opsbynoell.com",
    "+15551112222"
  );
  assert.match(xml, /<Dial[^>]+callerId="\+19499196118"/);
  // Customer number (inboundFrom) does NOT become the dial callerId.
  assert.equal(
    /callerId="\+15551112222"/.test(xml),
    false,
    "must not use customer number as callerId in twilio_number mode"
  );
});

test("simultaneous: whisper URL on each <Number> includes &caller= encoded inbound From", () => {
  const xml = buildInboundCallTwiml(
    {
      ringTargets: baseTargets,
      ringMode: "simultaneous",
      whisperEnabled: true,
      callerIdMode: "twilio_number",
      twilioNumber: "+19499196118",
    },
    "santa",
    "https://www.opsbynoell.com",
    "+15551112222"
  );
  // %2B = "+" encoded
  const expected =
    "https://www.opsbynoell.com/api/front-desk/whisper?clientId=santa&amp;caller=%2B15551112222";
  assert.ok(
    xml.includes(`url="${expected}"`),
    `whisper URL with encoded caller missing. Got XML:\n${xml}`
  );
  // Both <Number> children must carry the whisper URL.
  const matches = xml.match(/<Number url=/g) ?? [];
  assert.equal(matches.length, 2);
});

test("simultaneous: callerIdMode original -> Dial callerId is the customer number", () => {
  const xml = buildInboundCallTwiml(
    {
      ringTargets: baseTargets,
      ringMode: "simultaneous",
      whisperEnabled: false,
      callerIdMode: "original",
      twilioNumber: "+19499196118",
    },
    "santa",
    "https://www.opsbynoell.com",
    "+15551112222"
  );
  assert.match(xml, /<Dial[^>]+callerId="\+15551112222"/);
});

test("simultaneous: whisperEnabled=false -> <Number> has no url attribute", () => {
  const xml = buildInboundCallTwiml(
    {
      ringTargets: baseTargets,
      ringMode: "simultaneous",
      whisperEnabled: false,
      callerIdMode: "twilio_number",
      twilioNumber: "+19499196118",
    },
    "santa",
    "https://www.opsbynoell.com",
    "+15551112222"
  );
  assert.equal(/<Number url=/.test(xml), false);
});

// buildInboundCallTwiml - sequential (legacy behavior)

test("sequential: no callerIdMode set -> Dial has no callerId attribute (today's opsbynoell behavior)", () => {
  const xml = buildInboundCallTwiml(
    {
      ringTargets: baseTargets,
    },
    "opsbynoell",
    "https://www.opsbynoell.com",
    "+15551112222"
  );
  // Expect no callerId on either Dial.
  assert.equal(
    /callerId=/.test(xml),
    false,
    "sequential default must not emit callerId attr"
  );
  // And we must still produce one <Dial> per target.
  const dials = xml.match(/<Dial /g) ?? [];
  assert.equal(dials.length, baseTargets.length);
});

test("sequential: callerIdMode twilio_number + twilioNumber set -> per-leg callerId applied", () => {
  const xml = buildInboundCallTwiml(
    {
      ringTargets: baseTargets,
      callerIdMode: "twilio_number",
      twilioNumber: "+19499196118",
    },
    "client-x",
    "https://www.opsbynoell.com",
    "+15551112222"
  );
  const dials = xml.match(/<Dial[^>]+>/g) ?? [];
  assert.equal(dials.length, 2);
  for (const d of dials) {
    assert.match(d, /callerId="\+19499196118"/);
  }
});

test("sequential: callerIdMode twilio_number with NO twilioNumber -> no callerId (back-compat for opsbynoell)", () => {
  const xml = buildInboundCallTwiml(
    {
      ringTargets: baseTargets,
      callerIdMode: "twilio_number",
    },
    "opsbynoell",
    "https://www.opsbynoell.com",
    "+15551112222"
  );
  assert.equal(/callerId=/.test(xml), false);
});

test("default mode (no callerIdMode set) for opsbynoell with no twilioNumber -> no callerId (today's behavior preserved)", () => {
  const xml = buildInboundCallTwiml(
    {
      ringTargets: [{ number: "+19497849726", timeoutSeconds: 15 }],
      // No callerIdMode, no twilioNumber, no ringMode
    },
    "opsbynoell",
    "https://www.opsbynoell.com",
    "+15551112222"
  );
  assert.equal(/callerId=/.test(xml), false);
  // Single sequential dial as before.
  const dials = xml.match(/<Dial /g) ?? [];
  assert.equal(dials.length, 1);
});

// formatPhoneForSpeech

test("formatPhoneForSpeech: E.164 +1 number -> dash-separated digits with leading 1", () => {
  assert.equal(
    formatPhoneForSpeech("+19495551234"),
    "1-9-4-9-5-5-5-1-2-3-4"
  );
});

test("formatPhoneForSpeech: 10-digit raw -> dash-separated 10 digits", () => {
  assert.equal(
    formatPhoneForSpeech("9495551234"),
    "9-4-9-5-5-5-1-2-3-4"
  );
});

test("formatPhoneForSpeech: pretty-printed -> stripped and dashed", () => {
  assert.equal(
    formatPhoneForSpeech("(949) 555-1234"),
    "9-4-9-5-5-5-1-2-3-4"
  );
});

test("formatPhoneForSpeech: null -> null", () => {
  assert.equal(formatPhoneForSpeech(null), null);
});

test("formatPhoneForSpeech: empty -> null", () => {
  assert.equal(formatPhoneForSpeech(""), null);
});

test("formatPhoneForSpeech: short or junk -> null", () => {
  assert.equal(formatPhoneForSpeech("1234"), null);
  assert.equal(formatPhoneForSpeech("abc"), null);
  assert.equal(formatPhoneForSpeech("+44 20"), null);
});

// buildWhisperTwiml

test("whisper: with caller -> 'Incoming call for X from D-D-D...'", () => {
  const xml = buildWhisperTwiml({
    brandName: "Healing Hands by Santa",
    caller: "+19495551234",
    confirmAction:
      "https://www.opsbynoell.com/api/front-desk/whisper-confirm?clientId=santa",
  });
  assert.match(
    xml,
    /Incoming call for Healing Hands by Santa from 1-9-4-9-5-5-5-1-2-3-4\. Press 1 to accept\./
  );
});

test("whisper: missing caller -> falls back to no-readback prompt", () => {
  const xml = buildWhisperTwiml({
    brandName: "Healing Hands by Santa",
    caller: null,
    confirmAction:
      "https://www.opsbynoell.com/api/front-desk/whisper-confirm?clientId=santa",
  });
  assert.match(
    xml,
    /Incoming call for Healing Hands by Santa\. Press 1 to accept\./
  );
  assert.equal(/from /.test(xml), false);
});

test("whisper: malformed caller (too short) -> falls back to no-readback prompt", () => {
  const xml = buildWhisperTwiml({
    brandName: "Healing Hands by Santa",
    caller: "+44 20",
    confirmAction:
      "https://www.opsbynoell.com/api/front-desk/whisper-confirm?clientId=santa",
  });
  assert.match(
    xml,
    /Incoming call for Healing Hands by Santa\. Press 1 to accept\./
  );
  assert.equal(/from /.test(xml), false);
});

test("whisper: <Gather> action and <Hangup/> fallback are present", () => {
  const xml = buildWhisperTwiml({
    brandName: "Foo",
    caller: "+19495551234",
    confirmAction: "https://example.com/x",
  });
  assert.match(xml, /<Gather numDigits="1" timeout="10" action="https:\/\/example\.com\/x"/);
  assert.match(xml, /<Hangup\/>/);
});

test("whisper: brand name with XML special chars is escaped", () => {
  const xml = buildWhisperTwiml({
    brandName: "Mom & Pop's",
    caller: null,
    confirmAction: "https://example.com/x",
  });
  assert.match(xml, /Mom &amp; Pop&apos;s/);
});
