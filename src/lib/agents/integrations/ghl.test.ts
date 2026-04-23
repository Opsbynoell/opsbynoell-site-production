import { strict as assert } from "node:assert";
import { test } from "node:test";
import { GhlSms } from "./ghl.ts";

type FetchArgs = [string, RequestInit | undefined];

function installFetchMock(
  responses: Array<{ ok: boolean; status?: number; json: unknown; text?: string }>
): { calls: FetchArgs[]; restore: () => void } {
  const calls: FetchArgs[] = [];
  const original = globalThis.fetch;
  let i = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globalThis.fetch = (async (url: string, init?: RequestInit) => {
    calls.push([url, init]);
    const r = responses[i++];
    if (!r) throw new Error(`no mock response for call ${i}`);
    return {
      ok: r.ok,
      status: r.status ?? (r.ok ? 200 : 500),
      json: async () => r.json,
      text: async () => r.text ?? JSON.stringify(r.json),
    } as Response;
  }) as typeof fetch;
  return {
    calls,
    restore: () => {
      globalThis.fetch = original;
    },
  };
}

test("GhlSms: fast path uses alertContactId + toNumber/fromNumber, no upsert", async () => {
  const mock = installFetchMock([
    { ok: true, json: { messageId: "msg_fast_1" } },
  ]);
  try {
    const sms = new GhlSms({
      locationId: "loc_1",
      apiKey: "pit-test",
      alertContactId: "contact_1",
      fromNumber: "+19499973915",
    });
    const res = await sms.sendSMS("+19497849726", "hello");
    assert.equal(res.messageId, "msg_fast_1");
    assert.equal(mock.calls.length, 1);
    const [url, init] = mock.calls[0];
    assert.match(url, /\/conversations\/messages$/);
    const body = JSON.parse(String(init?.body ?? "{}"));
    assert.equal(body.type, "SMS");
    assert.equal(body.contactId, "contact_1");
    assert.equal(body.toNumber, "+19497849726");
    assert.equal(body.fromNumber, "+19499973915");
    assert.equal(body.message, "hello");
  } finally {
    mock.restore();
  }
});

test("GhlSms: legacy path upserts then sends when alertContactId missing", async () => {
  const mock = installFetchMock([
    { ok: true, json: { contact: { id: "c_upserted" } } },
    { ok: true, json: { messageId: "msg_legacy_1" } },
  ]);
  try {
    const sms = new GhlSms({ locationId: "loc_1", apiKey: "pit-test" });
    const res = await sms.sendSMS("+15550001111", "hi there");
    assert.equal(res.messageId, "msg_legacy_1");
    assert.equal(mock.calls.length, 2);
    assert.match(mock.calls[0][0], /\/contacts\/upsert$/);
    assert.match(mock.calls[1][0], /\/conversations\/messages$/);
    const send = JSON.parse(String(mock.calls[1][1]?.body ?? "{}"));
    assert.equal(send.contactId, "c_upserted");
    assert.equal(send.type, "SMS");
    // legacy path does NOT set toNumber/fromNumber
    assert.equal(send.toNumber, undefined);
    assert.equal(send.fromNumber, undefined);
  } finally {
    mock.restore();
  }
});

test("GhlSms: fast path requires BOTH alertContactId and fromNumber", async () => {
  // Only alertContactId provided → should fall back to legacy (upsert) path
  const mock = installFetchMock([
    { ok: true, json: { contact: { id: "c_up" } } },
    { ok: true, json: { messageId: "msg_fallback" } },
  ]);
  try {
    const sms = new GhlSms({
      locationId: "loc_1",
      apiKey: "pit-test",
      alertContactId: "contact_1",
      // fromNumber intentionally omitted
    });
    const res = await sms.sendSMS("+15550002222", "test");
    assert.equal(res.messageId, "msg_fallback");
    assert.equal(mock.calls.length, 2, "should have fallen back to upsert + send");
  } finally {
    mock.restore();
  }
});

test("GhlSms: throws on fast-path send failure", async () => {
  const mock = installFetchMock([
    { ok: false, status: 422, json: { message: "boom" }, text: "boom" },
  ]);
  try {
    const sms = new GhlSms({
      locationId: "loc_1",
      apiKey: "pit-test",
      alertContactId: "contact_1",
      fromNumber: "+19499973915",
    });
    await assert.rejects(
      () => sms.sendSMS("+19497849726", "x"),
      /ghl sms send failed: 422/
    );
  } finally {
    mock.restore();
  }
});
