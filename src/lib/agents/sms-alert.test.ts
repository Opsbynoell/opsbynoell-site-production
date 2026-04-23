import { strict as assert } from "node:assert";
import { mock, test } from "node:test";
import type { ClientConfig } from "./types";

let sendSMS: (to: string, body: string) => Promise<{ messageId: string }> =
  async () => ({ messageId: "default" });
const calls: Array<[string, string]> = [];

mock.module("./integrations/registry.ts", {
  namedExports: {
    getSmsIntegration: () => ({
      sendSMS: async (to: string, body: string) => {
        calls.push([to, body]);
        return sendSMS(to, body);
      },
    }),
  },
});

const { sendOwnerSmsAlert } = await import("./sms-alert.ts");

const baseCfg = (smsConfig: Record<string, unknown> = {}): ClientConfig =>
  ({
    clientId: "c1",
    businessName: "Biz",
    vertical: "internal",
    agents: { support: true, frontDesk: false, care: false },
    smsProvider: "ghl",
    smsConfig,
    active: true,
  }) as unknown as ClientConfig;

test("returns no_alert_sms_to when alertSmsTo missing", async () => {
  calls.length = 0;
  const r = await sendOwnerSmsAlert({ cfg: baseCfg(), message: "hi" });
  assert.deepEqual(r, { ok: false, error: "no_alert_sms_to" });
  assert.equal(calls.length, 0);
});

test("calls sendSMS with the configured to and message", async () => {
  calls.length = 0;
  sendSMS = async () => ({ messageId: "mX" });
  const r = await sendOwnerSmsAlert({
    cfg: baseCfg({ alertSmsTo: "+15551230000" }),
    message: "lead!",
  });
  assert.deepEqual(r, { ok: true, messageId: "mX" });
  assert.deepEqual(calls, [["+15551230000", "lead!"]]);
});

test("returns ok:false when sendSMS throws (does not re-throw)", async () => {
  calls.length = 0;
  sendSMS = async () => {
    throw new Error("boom");
  };
  const r = await sendOwnerSmsAlert({
    cfg: baseCfg({ alertSmsTo: "+15551230000" }),
    message: "x",
  });
  assert.deepEqual(r, { ok: false, error: "boom" });
});
