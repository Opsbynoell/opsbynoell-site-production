/**
 * POST /api/front-desk/reschedule
 *
 * Moves an appointment to a new time through the configured calendar
 * integration. Updates the stored row, cancels outstanding reminders
 * for the old time, and schedules fresh reminders for the new time.
 */

import { NextRequest, NextResponse } from "next/server";
import { getClientConfig } from "@/lib/agents/config";
import { getCalendarIntegration, getSmsIntegration } from "@/lib/agents/integrations/registry";
import {
  clientIdentity,
  hasClientAccess,
  rateLimit,
  rateLimitResponse,
  verifyAdminFromCookie,
} from "@/lib/agents/request-security";
import { sbInsert, sbSelect, sbUpdate } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize(
  req: Request,
  clientId: string
): Promise<{ ok: true } | { ok: false; response: Response }> {
  const expected = process.env.AGENT_ACTION_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (expected && auth === `Bearer ${expected}`) return { ok: true };
  const admin = await verifyAdminFromCookie(req);
  if (admin && hasClientAccess(admin, clientId)) return { ok: true };
  return {
    ok: false,
    response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  };
}

interface RescheduleBody {
  clientId: string;
  appointmentId: string;
  newTime: string; // ISO
}

function parseCadenceToken(token: string): number | null {
  const m = /^(\d+)(h|m|d)$/i.exec(token.trim());
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return m[2].toLowerCase() === "m" ? n : m[2].toLowerCase() === "h" ? n * 60 : n * 1440;
}

export async function POST(req: NextRequest): Promise<Response> {
  const rl = rateLimit(
    `front-desk-reschedule:${clientIdentity(req)}`,
    20,
    60_000
  );
  if (!rl.ok) return rateLimitResponse(rl.retryAfterMs);

  let body: RescheduleBody;
  try {
    body = (await req.json()) as RescheduleBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body.clientId || !body.appointmentId || !body.newTime) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const newTime = new Date(body.newTime);
  if (isNaN(newTime.getTime())) {
    return NextResponse.json({ error: "invalid newTime" }, { status: 400 });
  }

  const authz = await authorize(req, body.clientId);
  if (!authz.ok) return authz.response;

  const cfg = await getClientConfig(body.clientId);
  const calendar = getCalendarIntegration(cfg);

  // Resolve the row in our table, filtering by client_id so an
  // attacker cannot move *another* client's appointment by ID.
  const rows = await sbSelect<{
    id: string;
    external_calendar_id: string | null;
    visitor_phone: string | null;
    service_type: string | null;
    client_id: string;
  }>(
    "appointments",
    {
      id: `eq.${body.appointmentId}`,
      client_id: `eq.${body.clientId}`,
    },
    { limit: 1 }
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: "appointment not found" }, { status: 404 });
  }
  const row = rows[0];
  const externalId = row.external_calendar_id ?? row.id;

  await calendar.rescheduleAppointment(externalId, newTime);
  await sbUpdate(
    "appointments",
    { id: `eq.${row.id}` },
    { scheduled_at: newTime.toISOString(), status: "rescheduled" }
  );

  // Cancel outstanding pending reminders, re-queue fresh ones.
  await sbUpdate(
    "reminders",
    { appointment_id: `eq.${row.id}`, status: "eq.pending" },
    { status: "cancelled" }
  );
  const cadence = cfg.reminderCadence ?? ["24h", "2h"];
  for (const token of cadence) {
    const minutesBefore = parseCadenceToken(token);
    if (minutesBefore === null) continue;
    const due = new Date(newTime.getTime() - minutesBefore * 60 * 1000);
    await sbInsert("reminders", {
      appointment_id: row.id,
      type: token === "24h" || token === "2h" ? `reminder_${token}` : "custom",
      scheduled_for: due.toISOString(),
      status: "pending",
    });
  }

  // Courtesy SMS confirming the move.
  if (row.visitor_phone) {
    try {
      const sms = getSmsIntegration(cfg);
      const when = newTime.toLocaleString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
      await sms.sendSMS(
        row.visitor_phone,
        `Got you moved to ${when} for ${row.service_type ?? "your appointment"}. See you then.`
      );
    } catch {
      // Non-fatal.
    }
  }

  return NextResponse.json({ ok: true, appointmentId: row.id });
}
