/**
 * POST /api/ghl/inbound-visitor-sms
 *
 * Inbound SMS bridge for LEADS / CUSTOMERS texting a client's LC Phone
 * number. Distinct from /api/ghl/inbound-sms, which handles the OWNER's
 * reply to an alert SMS.
 *
 * Flow
 * ----
 *   1. Visitor sends SMS to client's LC Phone (e.g. +1 949-997-3915)
 *   2. GHL Conversations webhook POSTs the inbound event to this route
 *      with ?secret=<GHL_WEBHOOK_SECRET>
 *   3. We resolve the client by matching the `toNumber` against
 *      `clients.sms_config.fromNumber`
 *   4. runTurn() stores the visitor message in front_desk_messages,
 *      generates a Claude reply, and applies escalation rules
 *   5. If the reply is non-empty and human_takeover is off, we send the
 *      reply back to the visitor over the client's configured SMS
 *      integration
 *
 * Auth
 * ----
 * Shared secret ?secret=<GHL_WEBHOOK_SECRET> — same scheme as
 * /api/ghl/inbound-sms. Configure the value in Vercel.
 *
 * Webhook body (either shape accepted):
 *   GHL Conversations:  { phone, toNumber, body, contactId?, conversationId? }
 *   LC workflow:        { from, to, message }
 *
 * Deploy-side config required
 * ---------------------------
 *   - `GHL_WEBHOOK_SECRET` env var set in Vercel
 *   - Each client that accepts inbound visitor SMS must have
 *     `clients.sms_config.fromNumber` populated with the LC Phone in E.164
 *   - A GHL workflow or Conversations webhook configured to POST to this
 *     route when a NEW inbound SMS arrives on the client's LC Phone —
 *     filtered to Direction = Inbound so outbound sends do not loop back
 *
 * This route is intentionally thin — all the logic lives in
 * src/lib/agents/inbound-visitor-sms-handler.ts (unit-tested).
 */

import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/agents/env";
import { getClientConfig } from "@/lib/agents/config";
import {
  buildOutboundVisitorReplyPayload,
  dispatchVisitorReply,
  extractInboundVisitorPayload,
  findClientIdByInboundToPhone,
} from "@/lib/agents/inbound-visitor-sms-handler";
import { getSmsIntegration } from "@/lib/agents/integrations/registry";
import { runTurn } from "@/lib/agents/runner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<Response> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const expectedSecret = env.ghlWebhookSecret();
  const providedSecret = req.nextUrl.searchParams.get("secret");

  if (!expectedSecret || providedSecret !== expectedSecret) {
    console.warn("[inbound-visitor-sms] rejected — bad or missing secret");
    // 200 so GHL does not retry storm on auth misconfig.
    return NextResponse.json(
      { ok: false, reason: "unauthorized" },
      { status: 200 }
    );
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let rawBody: Record<string, unknown>;
  try {
    rawBody = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, reason: "bad_json" },
      { status: 200 }
    );
  }

  const payload = extractInboundVisitorPayload(rawBody);
  if (!payload) {
    console.warn(
      "[inbound-visitor-sms] missing phones in payload — ignoring",
      rawBody
    );
    return NextResponse.json(
      { ok: false, reason: "missing_phones" },
      { status: 200 }
    );
  }

  // ── Resolve client by LC Phone (toNumber) ─────────────────────────────────
  let clientId: string | null;
  try {
    clientId = await findClientIdByInboundToPhone(payload.toPhone);
  } catch (err) {
    console.error("[inbound-visitor-sms] client lookup failed:", err);
    return NextResponse.json(
      { ok: false, reason: "db_error" },
      { status: 200 }
    );
  }
  if (!clientId) {
    console.warn(
      `[inbound-visitor-sms] no client configured for toPhone=${payload.toPhone} — ignoring`
    );
    return NextResponse.json(
      { ok: false, reason: "no_client_for_to_phone" },
      { status: 200 }
    );
  }

  // ── Generate the reply via the shared runner ──────────────────────────────
  let runResult;
  try {
    runResult = await runTurn({
      agent: "frontDesk",
      payload: {
        clientId,
        agent: "frontDesk",
        channel: "sms",
        from: { phone: payload.fromPhone },
        message: payload.messageText,
      },
      tables: {
        sessions: "front_desk_sessions",
        messages: "front_desk_messages",
      },
      defaultTriggerType: "inbound_text",
    });
  } catch (err) {
    console.error("[inbound-visitor-sms] runTurn failed:", err);
    return NextResponse.json(
      { ok: false, reason: "run_turn_failed" },
      { status: 200 }
    );
  }

  // ── Dispatch outbound reply (when appropriate) ────────────────────────────
  const cfg = await getClientConfig(clientId);
  const out = buildOutboundVisitorReplyPayload({
    cfg,
    agent: "frontDesk",
    sessionId: runResult.sessionId,
    visitorPhone: payload.fromPhone,
    replyText: runResult.reply,
  });

  // An empty reply means human_takeover was on OR the model produced no
  // text. Either way — do not send anything back.
  const dispatch = out.body
    ? await dispatchVisitorReply(out, cfg, { getSms: getSmsIntegration })
    : { sent: false, error: "empty_reply" as const };

  return NextResponse.json(
    {
      ok: true,
      sessionId: runResult.sessionId,
      reply: runResult.reply,
      replySent: dispatch.sent,
      replyMessageId: dispatch.messageId,
      replyError: dispatch.error,
      escalated: runResult.escalated,
      intent: runResult.intent,
    },
    { status: 200 }
  );
}
