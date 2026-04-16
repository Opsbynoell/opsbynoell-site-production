/**
 * POST /api/front-desk/schedule
 *
 * Books an appointment through the configured calendar integration and
 * writes a row into `appointments`. Creates the standard reminder
 * sequence based on `clients.reminder_cadence`. Sends a confirmation
 * SMS. Returns the new appointmentId.
 *
 * Body:
 *   {
 *     clientId: string,
 *     sessionId?: string,
 *     clientName: string,
 *     clientPhone: string,
 *     clientEmail?: string,
 *     serviceType: string,
 *     scheduledAt: string (ISO),
 *     durationMinutes?: number,
 *     notes?: string
 *   }
 */

import { NextResponse } from "next/server";
import { getClientConfig } from "@/lib/agents/config";
import {
  getCalendarIntegration,
  getSmsIntegration,
} from "@/lib/agents/integrations/registry";
import { sbInsert, sbUpdate } from "@/lib/agents/supabase";
import { sendTelegramAlert } from "@/lib/agents/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ScheduleBody {
  clientId: string;
  sessionId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceType: string;
  scheduledAt: string;
  durationMinutes?: number;
  notes?: string;
}

function parseCadenceToken(token: string): number | null {
  // "24h" -> 24 * 60 minutes; "2h" -> 120; "30m" -> 30; "1d" -> 1440
  const m = /^(\d+)(h|m|d)$/i.exec(token.trim());
  if (!m) return null;
  const n = parseInt(m[1], 10);
  switch (m[2].toLowerCase()) {
    case "m":
      return n;
    case "h":
      return n * 60;
    case "d":
      return n * 60 * 24;
  }
  return null;
}

export async function POST(req: Request): Promise<Response> {
  let body: ScheduleBody;
  try {
    body = (await req.json()) as ScheduleBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (
    !body.clientId ||
    !body.clientName ||
    !body.clientPhone ||
    !body.serviceType ||
    !body.scheduledAt
  ) {
    return NextResponse.json(
      { error: "missing required fields" },
      { status: 400 }
    );
  }

  const cfg = await getClientConfig(body.clientId);
  if (!cfg.active || !cfg.agents.frontDesk) {
    return NextResponse.json(
      { error: "front desk not enabled" },
      { status: 403 }
    );
  }

  const scheduledAt = new Date(body.scheduledAt);
  if (isNaN(scheduledAt.getTime())) {
    return NextResponse.json(
      { error: "invalid scheduledAt" },
      { status: 400 }
    );
  }

  // 1. Push to the integration.
  const calendar = getCalendarIntegration(cfg);
  const booking = await calendar.createAppointment({
    clientName: body.clientName,
    clientPhone: body.clientPhone,
    clientEmail: body.clientEmail,
    serviceType: body.serviceType,
    scheduledAt,
    durationMinutes: body.durationMinutes,
    notes: body.notes,
  });

  // 2. Persist to our `appointments` table. For GHL the external id
  //    is the same as the integration's appointmentId; for generic it
  //    is our own uuid.
  const isGeneric = (cfg.calendarProvider ?? "generic") === "generic";
  const appt = isGeneric
    ? // Generic already inserted the row via Supabase; look it up.
      { id: booking.appointmentId }
    : await sbInsert<{ id: string }>("appointments", {
        client_id: body.clientId,
        session_id: body.sessionId,
        visitor_name: body.clientName,
        visitor_phone: body.clientPhone,
        visitor_email: body.clientEmail,
        service_type: body.serviceType,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: body.durationMinutes,
        status: "confirmed",
        calendar_provider: cfg.calendarProvider,
        external_calendar_id: booking.externalId ?? booking.appointmentId,
        notes: body.notes,
      });

  // For the generic path, GenericCalendar inserted the row without a
  // session_id. Set it now.
  if (isGeneric && body.sessionId) {
    await sbUpdate(
      "appointments",
      { id: `eq.${appt.id}` },
      { session_id: body.sessionId }
    );
  }

  // Link the session back to the appointment (both paths).
  if (body.sessionId) {
    await sbUpdate(
      "front_desk_sessions",
      { id: `eq.${body.sessionId}` },
      { appointment_id: appt.id }
    );
  }

  // 3. Schedule reminders.
  const cadence = cfg.reminderCadence ?? ["24h", "2h"];
  for (const token of cadence) {
    const minutesBefore = parseCadenceToken(token);
    if (minutesBefore === null) continue;
    const due = new Date(scheduledAt.getTime() - minutesBefore * 60 * 1000);
    await sbInsert("reminders", {
      appointment_id: appt.id,
      type: token === "24h" || token === "2h" ? `reminder_${token}` : "custom",
      scheduled_for: due.toISOString(),
      status: "pending",
    });
  }

  // 4. Send confirmation SMS.
  try {
    const sms = getSmsIntegration(cfg);
    const when = scheduledAt.toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
    await sms.sendSMS(
      body.clientPhone,
      `You're all set for ${body.serviceType} on ${when} at ${cfg.businessName}. Reply R to reschedule.`
    );
  } catch {
    // Don't fail the booking if SMS fails; the reminder runner will retry later.
  }

  // 5. Alert operator (warm, not urgent).
  await sendTelegramAlert({
    agent: "frontDesk",
    businessName: cfg.businessName,
    chatId: cfg.telegramChatId,
    message: `New booking: ${body.clientName} · ${body.serviceType} · ${scheduledAt.toISOString()}`,
  });

  return NextResponse.json({
    appointmentId: appt.id,
    externalId: booking.externalId ?? null,
    confirmationUrl: booking.confirmationUrl ?? null,
  });
}
