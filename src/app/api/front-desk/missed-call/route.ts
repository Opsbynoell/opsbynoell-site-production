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

import { NextResponse } from "next/server";
import { getClientConfig } from "@/lib/agents/config";
import { getSmsIntegration } from "@/lib/agents/integrations/registry";
import { sbInsert } from "@/lib/agents/supabase";
import { sendTelegramAlert } from "@/lib/agents/telegram";
import type { MissedCallPayload } from "@/lib/agents/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function renderTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}

export async function POST(req: Request): Promise<Response> {
  let body: MissedCallPayload;
  try {
    body = (await req.json()) as MissedCallPayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.clientId || !body.from) {
    return NextResponse.json(
      { error: "clientId and from are required" },
      { status: 400 }
    );
  }

  const cfg = await getClientConfig(body.clientId);
  if (!cfg.active || !cfg.agents.frontDesk) {
    return NextResponse.json(
      { error: "front desk not enabled for this client" },
      { status: 403 }
    );
  }

  const session = await sbInsert<{ id: string }>("front_desk_sessions", {
    client_id: body.clientId,
    trigger_type: "missed_call",
    channel: "sms",
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
    await sms.sendSMS(body.from, text);
    await sbInsert("front_desk_messages", {
      session_id: session.id,
      role: "bot",
      content: text,
      metadata: { trigger: "missed_call" },
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
