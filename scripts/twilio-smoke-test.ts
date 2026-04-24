#!/usr/bin/env tsx
/**
 * Twilio smoke test — sends one SMS to verify the A2P swap is live.
 *
 * Recommended (Messaging Service / A2P 10DLC):
 *   TWILIO_ACCOUNT_SID=AC... \
 *   TWILIO_AUTH_TOKEN=...  (or TWILIO_API_KEY_SID + TWILIO_API_KEY_SECRET) \
 *   TWILIO_MESSAGING_SERVICE_SID=MG... \
 *     npm run twilio:smoke -- +19491234567
 *
 * Fallback (single FROM number):
 *   TWILIO_ACCOUNT_SID=... TWILIO_AUTH_TOKEN=... TWILIO_FROM_NUMBER=+1... \
 *     npm run twilio:smoke -- +19491234567
 *
 * Exits 0 on success (prints the message SID), 1 on failure.
 */

export {};

const sid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const token = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const from = process.env.TWILIO_FROM_NUMBER;
const to = process.argv[2];

if (!sid) {
  console.error("Missing TWILIO_ACCOUNT_SID.");
  process.exit(1);
}
const authUser = apiKeySid ?? sid;
const authPass = apiKeySid ? apiKeySecret : token;
if (!authPass) {
  console.error(
    "Missing auth — set TWILIO_API_KEY_SID + TWILIO_API_KEY_SECRET (preferred) or TWILIO_AUTH_TOKEN."
  );
  process.exit(1);
}
if (!messagingServiceSid && !from) {
  console.error(
    "Missing sender — set TWILIO_MESSAGING_SERVICE_SID (recommended) or TWILIO_FROM_NUMBER."
  );
  process.exit(1);
}
if (!to) {
  console.error("Usage: tsx scripts/twilio-smoke-test.ts <+E164_TARGET_NUMBER>");
  process.exit(1);
}

const body =
  "Ops by Noell Twilio smoke test — if you received this, the A2P swap is live. Reply STOP to opt out, HELP for help.";

const params = new URLSearchParams({ To: to, Body: body });
if (messagingServiceSid) {
  params.set("MessagingServiceSid", messagingServiceSid);
  console.log(`Sending via MessagingServiceSid=${messagingServiceSid}`);
} else if (from) {
  params.set("From", from);
  console.log(`Sending via From=${from}`);
}

const res = await fetch(
  `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
  {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${authUser}:${authPass}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  }
);

if (!res.ok) {
  console.error(`Twilio send failed: ${res.status} ${await res.text()}`);
  process.exit(1);
}

const data = (await res.json()) as { sid: string; status?: string };
console.log(`OK — message SID: ${data.sid} (status=${data.status ?? "queued"})`);
process.exit(0);
