/**
 * POST /api/twilio/inbound-sms
 *
 * Twilio inbound SMS webhook — bridges OWNER replies on the A2P-registered
 * Twilio number back into the originating visitor session.
 *
 * Replaces /api/ghl/inbound-sms once the SMS provider is flipped from
 * GHL LC Phone to Twilio. Same downstream handler, different transport.
 *
 * Auth — Twilio request signature
 * --------------------------------
 * Twilio signs every webhook with HMAC-SHA1(authToken, fullUrl + sortedFormParams)
 * and sends the result as `X-Twilio-Signature`. We validate this rather
 * than using a query-param shared secret. The signing token is the auth
 * token of the account that owns the Messaging Service. Required env:
 *
 *   TWILIO_AUTH_TOKEN           — used for signature validation
 *   TWILIO_INBOUND_PUBLIC_URL   — the public URL Twilio is calling, exactly
 *                                 as configured in the Messaging Service.
 *                                 Set to the production canonical URL so
 *                                 preview deploys do not silently mismatch
 *                                 (e.g. https://www.opsbynoell.com/api/twilio/inbound-sms)
 *
 * Twilio webhook body (application/x-www-form-urlencoded):
 *   From:   "+19497849726"   — sender (owner) — from_phone in our table
 *   To:     "+19499973915"   — receiving Twilio number — to_phone
 *   Body:   "Heyyyyyy"
 *   MessageSid, MessagingServiceSid, AccountSid, ...
 *
 * Returns an empty TwiML response (200) so Twilio does not auto-reply.
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/agents/env";
import {
  extractInboundPayload,
  handleInboundSms,
} from "@/lib/agents/inbound-sms-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TWIML_OK =
  '<?xml version="1.0" encoding="UTF-8"?><Response></Response>';

const twimlResponse = (status = 200): Response =>
  new Response(TWIML_OK, {
    status,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });

/**
 * Validate Twilio's request signature.
 *
 * Algorithm: HMAC-SHA1 of `url + sorted(key+value).join("")`, base64 encoded,
 * compared in constant time against `X-Twilio-Signature`.
 */
function validateTwilioSignature(
  authToken: string,
  url: string,
  params: URLSearchParams,
  headerSig: string | null
): boolean {
  if (!headerSig) return false;
  const sortedKeys = [...params.keys()].sort();
  let data = url;
  for (const k of sortedKeys) {
    data += k + (params.get(k) ?? "");
  }
  const expected = createHmac("sha1", authToken).update(data).digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(headerSig);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: NextRequest): Promise<Response> {
  const authToken = env.twilioAuthToken();
  const publicUrl = process.env.TWILIO_INBOUND_PUBLIC_URL;

  if (!authToken || !publicUrl) {
    console.error(
      "[twilio-inbound] Missing TWILIO_AUTH_TOKEN or TWILIO_INBOUND_PUBLIC_URL"
    );
    // Return 200 TwiML so Twilio does not retry against a misconfigured deploy.
    return twimlResponse(200);
  }

  // Read the raw form body so we can both validate and parse it.
  const rawBody = await req.text();
  const params = new URLSearchParams(rawBody);

  const headerSig = req.headers.get("x-twilio-signature");
  const valid = validateTwilioSignature(authToken, publicUrl, params, headerSig);

  if (!valid) {
    console.warn(
      "[twilio-inbound] Rejected — invalid signature",
      { headerSig, publicUrl }
    );
    return twimlResponse(200);
  }

  // Translate Twilio's payload into our generic inbound shape.
  const generic = {
    from: params.get("From") ?? undefined,
    to: params.get("To") ?? undefined,
    body: params.get("Body") ?? undefined,
    messageId: params.get("MessageSid") ?? undefined,
  };

  const payload = extractInboundPayload(generic);
  if (!payload) {
    console.warn("[twilio-inbound] Missing from phone in payload", generic);
    return twimlResponse(200);
  }

  await handleInboundSms(payload);

  // Always 200 with empty TwiML — auto-reply happens via the outbound code path.
  return twimlResponse(200);
}

// Twilio sends form-encoded; reject anything else explicitly.
export async function GET(): Promise<Response> {
  return NextResponse.json(
    {
      ok: true,
      hint: "POST application/x-www-form-urlencoded from Twilio webhook only",
    },
    { status: 200 }
  );
}
