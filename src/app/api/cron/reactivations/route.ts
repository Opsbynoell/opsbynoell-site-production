/**
 * GET /api/cron/reactivations
 *
 * Runs daily. For every active client with Front Desk enabled, looks
 * at `client_contacts` for anyone whose `last_visit_at` exceeds the
 * client's `reactivation_threshold_days` and who has not already been
 * queued for reactivation. Creates one campaign row per contact and
 * sends the reactivation SMS.
 *
 * Intentionally conservative: max 20 contacts per client per run to
 * avoid bulk-SMS carrier flags.
 */

import { NextResponse } from "next/server";
import { getClientConfig } from "@/lib/agents/config";
import { assertCron } from "@/lib/agents/cron-auth";
import { getSmsIntegration } from "@/lib/agents/integrations/registry";
import { sbInsert, sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ClientRow {
  client_id: string;
  reactivation_threshold_days: number;
}

interface ContactRow {
  id: string;
  client_id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  last_visit_at: string | null;
}

export async function GET(req: Request): Promise<Response> {
  try {
    assertCron(req);
  } catch {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const clients = await sbSelect<ClientRow>(
    "clients",
    { active: "eq.true", "agents->frontDesk": "eq.true" },
    { limit: 500 }
  );

  const processed: Array<{ clientId: string; queued: number }> = [];

  for (const c of clients) {
    const threshold = c.reactivation_threshold_days ?? 60;
    const cutoff = new Date(
      Date.now() - threshold * 24 * 60 * 60 * 1000
    ).toISOString();

    const stale = await sbSelect<ContactRow>(
      "client_contacts",
      {
        client_id: `eq.${c.client_id}`,
        last_visit_at: `lte.${cutoff}`,
      },
      { limit: 20, order: "last_visit_at.asc" }
    );

    let queued = 0;
    for (const contact of stale) {
      if (!contact.phone) continue;
      // Skip if a pending/sent campaign already exists for this contact.
      const existing = await sbSelect(
        "reactivation_campaigns",
        {
          client_id: `eq.${c.client_id}`,
          contact_id: `eq.${contact.id}`,
          status: "in.(pending,sent)",
        },
        { limit: 1 }
      );
      if (existing.length > 0) continue;

      try {
        const cfg = await getClientConfig(c.client_id);
        const firstName = contact.name?.split(" ")[0] ?? "there";
        const body = `Hey ${firstName} — it's been a minute since we've seen you at ${cfg.businessName}. We've got some openings this week if you'd like to come back in. No pressure either way, just wanted to reach out.`;
        const sms = getSmsIntegration(cfg);
        await sms.sendSMS(contact.phone, body);
        await sbInsert("reactivation_campaigns", {
          client_id: c.client_id,
          contact_id: contact.id,
          contact_name: contact.name,
          contact_phone: contact.phone,
          contact_email: contact.email,
          last_visit_at: contact.last_visit_at,
          reactivation_sent_at: new Date().toISOString(),
          status: "sent",
        });
        queued++;
      } catch {
        // Continue with the rest of the batch.
      }
    }
    processed.push({ clientId: c.client_id, queued });
  }

  return NextResponse.json({ clients: processed.length, processed });
}
