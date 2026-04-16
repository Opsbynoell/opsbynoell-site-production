/**
 * GET /api/cron/review-requests
 *
 * Runs hourly. Finds completed appointments that have not yet had a
 * review request sent, sends one, and marks it.
 */

import { NextResponse } from "next/server";
import { getClientConfig } from "@/lib/agents/config";
import { assertCron } from "@/lib/agents/cron-auth";
import { getSmsIntegration } from "@/lib/agents/integrations/registry";
import { sbInsert, sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface AppointmentRow {
  id: string;
  client_id: string;
  visitor_name: string | null;
  visitor_phone: string | null;
  service_type: string | null;
  scheduled_at: string;
  status: string;
}

export async function GET(req: Request): Promise<Response> {
  try {
    assertCron(req);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Find appointments marked completed in the last 48h.
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const completed = await sbSelect<AppointmentRow>(
    "appointments",
    {
      status: "eq.completed",
      updated_at: `gte.${since}`,
    },
    { limit: 100, order: "updated_at.asc" }
  );

  const results: Array<{ appointmentId: string; sent: boolean; error?: string }> = [];

  for (const appt of completed) {
    // Skip if a pending/sent request already exists.
    const existing = await sbSelect(
      "review_requests",
      { appointment_id: `eq.${appt.id}` },
      { limit: 1 }
    );
    if (existing.length > 0) continue;

    try {
      const cfg = await getClientConfig(appt.client_id);
      if (!cfg.reviewUrl || !appt.visitor_phone) {
        await sbInsert("review_requests", {
          appointment_id: appt.id,
          client_id: appt.client_id,
          visitor_name: appt.visitor_name,
          visitor_phone: appt.visitor_phone,
          platform: cfg.reviewPlatform,
          review_url: cfg.reviewUrl,
          status: "skipped",
        });
        continue;
      }
      const firstName = appt.visitor_name?.split(" ")[0] ?? "there";
      const body = `Hey ${firstName} — hope your ${appt.service_type ?? "visit"} at ${cfg.businessName} went well. When you have a sec, would you mind leaving a quick review? Means a lot to a small team like ours. ${cfg.reviewUrl}`;
      const sms = getSmsIntegration(cfg);
      await sms.sendSMS(appt.visitor_phone, body);
      await sbInsert("review_requests", {
        appointment_id: appt.id,
        client_id: appt.client_id,
        visitor_name: appt.visitor_name,
        visitor_phone: appt.visitor_phone,
        platform: cfg.reviewPlatform,
        review_url: cfg.reviewUrl,
        sent_at: new Date().toISOString(),
        status: "sent",
      });
      results.push({ appointmentId: appt.id, sent: true });
    } catch (e) {
      results.push({
        appointmentId: appt.id,
        sent: false,
        error: (e as Error).message,
      });
    }
  }

  return NextResponse.json({ processed: results.length, results });
}
