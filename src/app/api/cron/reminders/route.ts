/**
 * GET /api/cron/reminders
 *
 * Fires every 5 minutes via Vercel cron. Finds reminders whose
 * `scheduled_for` is in the past and `status` is pending, sends each
 * one through the configured SMS integration, and updates the row.
 *
 * Batch size is small on purpose — reminder storms are a smell; if we
 * see one, we want to alert on it rather than silently burst.
 */

import { NextResponse } from "next/server";
import { getClientConfig } from "@/lib/agents/config";
import { assertCron } from "@/lib/agents/cron-auth";
import { getSmsIntegration } from "@/lib/agents/integrations/registry";
import { sbSelect, sbUpdate } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ReminderRow {
  id: string;
  appointment_id: string;
  type: string;
  scheduled_for: string;
}

interface AppointmentRow {
  id: string;
  client_id: string;
  visitor_name: string | null;
  visitor_phone: string | null;
  service_type: string | null;
  scheduled_at: string;
  status: string;
}

function renderReminderBody(
  type: string,
  appt: AppointmentRow,
  businessName: string
): string {
  const when = new Date(appt.scheduled_at).toLocaleString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  const firstName = appt.visitor_name?.split(" ")[0] ?? "there";
  if (type === "reminder_24h") {
    return `Hey ${firstName} — quick reminder you're on the books tomorrow (${when}) for ${appt.service_type ?? "your appointment"} at ${businessName}. Reply C to confirm or R to reschedule.`;
  }
  if (type === "reminder_2h") {
    return `Hey ${firstName} — see you in a couple hours at ${when} for ${appt.service_type ?? "your appointment"}. Reply R if anything comes up.`;
  }
  return `Reminder: ${appt.service_type ?? "appointment"} at ${when} with ${businessName}.`;
}

export async function GET(req: Request): Promise<Response> {
  try {
    assertCron(req);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const now = new Date().toISOString();
  const due = await sbSelect<ReminderRow>(
    "reminders",
    { status: "eq.pending", scheduled_for: `lte.${now}` },
    { limit: 50, order: "scheduled_for.asc" }
  );

  const results: Array<{ id: string; sent: boolean; error?: string }> = [];

  for (const rem of due) {
    try {
      const apptRows = await sbSelect<AppointmentRow>(
        "appointments",
        { id: `eq.${rem.appointment_id}` },
        { limit: 1 }
      );
      if (apptRows.length === 0) {
        await sbUpdate(
          "reminders",
          { id: `eq.${rem.id}` },
          { status: "failed", last_error: "appointment missing" }
        );
        results.push({ id: rem.id, sent: false, error: "appt missing" });
        continue;
      }
      const appt = apptRows[0];
      if (
        appt.status === "cancelled" ||
        appt.status === "completed" ||
        appt.status === "no_show"
      ) {
        await sbUpdate(
          "reminders",
          { id: `eq.${rem.id}` },
          { status: "cancelled", last_error: `appt status ${appt.status}` }
        );
        continue;
      }
      if (!appt.visitor_phone) {
        await sbUpdate(
          "reminders",
          { id: `eq.${rem.id}` },
          { status: "failed", last_error: "no phone" }
        );
        continue;
      }
      const cfg = await getClientConfig(appt.client_id);
      const sms = getSmsIntegration(cfg);
      await sms.sendSMS(
        appt.visitor_phone,
        renderReminderBody(rem.type, appt, cfg.businessName)
      );
      await sbUpdate(
        "reminders",
        { id: `eq.${rem.id}` },
        { status: "sent", sent_at: new Date().toISOString() }
      );
      await sbUpdate(
        "appointments",
        { id: `eq.${appt.id}` },
        { status: "reminded" }
      );
      results.push({ id: rem.id, sent: true });
    } catch (e) {
      await sbUpdate(
        "reminders",
        { id: `eq.${rem.id}` },
        { status: "failed", last_error: (e as Error).message }
      );
      results.push({ id: rem.id, sent: false, error: (e as Error).message });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
