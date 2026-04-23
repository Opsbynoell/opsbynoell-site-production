/**
 * POST /api/ghl/inbound-sms
 *
 * Inbound SMS webhook — bridges owner replies from the LC Phone number
 * back into the visitor's chat session as a human message and flips
 * humanTakeover=true so the AI pauses.
 *
 * Auth
 * ----
 * A shared secret is passed as a query param:
 *   ?secret=<GHL_WEBHOOK_SECRET>
 *
 * Set GHL_WEBHOOK_SECRET in Vercel. Generate a value with:
 *   openssl rand -hex 32
 *
 * GHL Conversations webhook body (typical shape):
 * {
 *   type: "InboundMessage",
 *   phone: "+19497849726",      // sender (owner) — from_phone in our table
 *   toNumber: "+19499973915",   // receiving LC Phone — to_phone in our table
 *   body: "Heyyyyyy",
 *   ...
 * }
 *
 * Also accepts `from`/`to`/`message` field aliases for LC workflow actions.
 *
 * See src/lib/agents/inbound-sms-handler.ts for the routing logic.
 * See docs/two-way-sms.md for GHL setup instructions.
 */

import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/agents/env";
import {
  extractInboundPayload,
  handleInboundSms,
} from "@/lib/agents/inbound-sms-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<Response> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const expectedSecret = env.ghlWebhookSecret();
  const providedSecret = req.nextUrl.searchParams.get("secret");

  if (!expectedSecret || providedSecret !== expectedSecret) {
    console.warn("[inbound-sms] Rejected request — bad or missing secret");
    // Return 200 so the caller does not retry. Auth failures should not
    // cause GHL to queue up dozens of retries.
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 200 });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let rawBody: Record<string, unknown>;
  try {
    rawBody = (await req.json()) as Record<string, unknown>;
  } catch {
    console.warn("[inbound-sms] Could not parse JSON body");
    return NextResponse.json({ ok: false, reason: "bad_json" }, { status: 200 });
  }

  const payload = extractInboundPayload(rawBody);
  if (!payload) {
    console.warn("[inbound-sms] Missing from/to phone in payload", rawBody);
    return NextResponse.json(
      { ok: false, reason: "missing_phones" },
      { status: 200 }
    );
  }

  // ── Handle ────────────────────────────────────────────────────────────────
  const result = await handleInboundSms(payload);

  if (!result.ok && result.reason === "db_error") {
    return NextResponse.json(result, { status: 200 });
  }

  return NextResponse.json(result, { status: 200 });
}
