/**
 * POST /api/front-desk/missed-call
 *
 * Triggered by the client's phone system (GHL, Twilio webhook, or other)
 * when a call goes unanswered. We:
 *   1. Create a `front_desk_sessions` row (trigger_type = missed_call)
 *   2. Render the client's missed-call SMS template
 *   3. Send the SMS through the configured SMS integration
 *   4. Fire a Telegram alert for the operator
 *   5. Return the sessionId so the phone system can correlate later
 *
 * The conversation that follows is handled by
 * POST /api/front-desk/message.
 */

import { NextRequest, NextResponse } from "next/server";
import { getClientConfig } from "@/lib/agents/config";
import { getSmsIntegration } from "@/lib/agents/integrations/registry";
import {
  type AdminContext,
  clientIdentity,
  hasClientAccess,
  rateLimit,
  rateLimitResponse,
  verifyAdminFromCookie,
} from "@/lib/agents/request-security";
import { sbInsert } from "@/lib/agents/supabase";
import { sendTelegramAlert } from "@/lib/agents/telegram";
import type { MissedCallPayload, TemplateParams } from "@/lib/agents/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Missed-call is triggered by the client's phone system (GHL/Twilio
 * webhook). That traffic authenticates with AGENT_ACTION_SECRET —
 * admins with client access may also call this directly for manual
 * textbacks. Auth runs BEFORE body parse / DB writes / SMS dispatch
 * so unauth probes get 401, not 400.
 */
type AuthResult =
  | { ok: true; admin: AdminContext | null; mode: "bearer" | "admin" }
  | { ok: false; response: Response };

async function preauthorize(req: Request): Promise<AuthResult> {
  const expected = process.env.AGENT_ACTION_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (expected && auth === `Bearer ${expected}`) {
    return { ok: true, admin: null, mode: "bearer" };
  }
  const admin = await verifyAdminFromCookie(req);
  if (admin) return { ok: true, admin, mode: "admin" };
  return {
    ok: false,
    response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  };
}

function renderTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export async function POST(req: NextRequest): Promise<Response> {
  const rl = rateLimit(
    `front-desk-missed:${clientIdentity(req)}`,
    60,
    60_000
  );
  if (!rl.ok) return rateLimitResponse(rl.retryAfterMs);

  // Auth FIRST — before body parse / field validation / DB or provider calls.
  const authz = await preauthorize(req);
  if (!authz.ok) return authz.response;

  let body: MissedCallPayload;
  try {
    body = (await req.json()) as MissedCallPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || !body.clientId || !body.from) {
    return NextResponse.json(
      { error: "clientId and from are required" },
      { status: 400 }
    );
  }

  if (authz.mode === "admin" && authz.admin && !hasClientAccess(authz.admin, body.clientId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const cfg = await getClientConfig(body.clientId);
  if (!cfg.active || !cfg.agents.frontDesk) {
    return NextResponse.json(
      { error: "front desk not enabled for this client" },
      { status: 403 }
    );
  }

  const isWhatsApp = cfg.smsProvider === "ghl_whatsapp";
  const session = await sbInsert<{ id: string }>("front_desk_sessions", {
    client_id: body.clientId,
    trigger_type: "missed_call",
    channel: isWhatsApp ? "whatsapp" : "sms",
    visitor_name: body.contactName,
    visitor_phone: body.from,
    notes: body.callSid ? `callSid=${body.callSid}` : null,
  });

  const template =
    cfg.missedCallTextTemplate ??
    "Hey — this is the front desk at {businessName}, we just saw your call come in. Were you hoping to get on the books, or was there something quick I can answer? Either way I'm here.";
  const text = renderTemplate(template, {
    businessName: cfg.businessName,
    brandName: cfg.brandName ?? cfg.businessName,
    firstName: body.contactName?.split(" ")[0] ?? "",
  });

  let smsError: string | undefined;
  try {
    const sms = getSmsIntegration(cfg);
    // For WhatsApp providers, prefer sendTemplate if a template ID is configured.
    // Falls back to free-form sendSMS automatically if templateId is empty
    // (e.g. before Meta approval).
    if (sms.isWhatsApp && sms.sendTemplate) {
      const templateId =
        (cfg.smsConfig?.templates as Record<string, string> | undefined)
          ?.missedCallTextback ?? "";
      const params: TemplateParams = {
        BODY: {
          params: [
            cfg.brandName ?? cfg.businessName,
            body.contactName?.split(" ")[0] ?? "",
          ],
        },
      };
      await sms.sendTemplate(body.from, templateId, params);
    } else {
      await sms.sendSMS(body.from, text);
    }
    await sbInsert("front_desk_messages", {
      session_id: session.id,
      role: "bot",
      content: text,
      metadata: { trigger: "missed_call", channel: isWhatsApp ? "whatsapp" : "sms" },
    });
  } catch (e) {
    smsError = (e as Error).message;
  }

  await sendTelegramAlert({
    agent: "frontDesk",
    businessName: cfg.businessName,
    chatId: cfg.telegramChatId,
    message:
      `Missed call from ${body.from}\n` +
      `Session: ${session.id}\n` +
      (smsError
        ? `SMS FAILED: ${smsError}`
        : "Text-back sent · awaiting reply"),
  });

  return NextResponse.json({
    sessionId: session.id,
    smsSent: !smsError,
    smsError,
  });
}
