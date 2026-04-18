#!/usr/bin/env tsx
/**
 * Twilio smoke test — sends one SMS to verify the A2P swap is live.
 *
 * Usage:
 *   TWILIO_ACCOUNT_SID=AC... TWILIO_AUTH_TOKEN=... TWILIO_FROM_NUMBER=+1... \
 *     npm run twilio:smoke -- +19491234567
 *
 * Exits 0 on success (prints the message SID), 1 on failure.
 */

export {};

const sid = process.env.TWILIO_ACCOUNT_SID;
const token = process.env.TWILIO_AUTH_TOKEN;
const from = process.env.TWILIO_FROM_NUMBER;
const to = process.argv[2];

if (!sid || !token || !from) {
  console.error("Missing TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, or TWILIO_FROM_NUMBER.");
  process.exit(1);
}
if (!to) {
  console.error("Usage: tsx scripts/twilio-smoke-test.ts <+E164_TARGET_NUMBER>");
  process.exit(1);
}

const body =
  "Ops by Noell Twilio smoke test — if you received this, the A2P swap is live. STOP to opt out, HELP for help.";

const res = await fetch(
  `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
  {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ To: to, From: from, Body: body }),
  }
);

if (!res.ok) {
  console.error(`Twilio send failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}

const data = (await res.json()) as { sid: string };
console.log(`OK — message SID: ${data.sid}`);
process.exit(0);
