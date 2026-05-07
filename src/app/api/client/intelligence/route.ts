/**
 * GET /api/client/intelligence
 *
 * Returns Predictive Customer Intelligence signals for the client.
 * Protected by proxy.ts middleware.
 *
 * Query params:
 *   status: "open" | "resolved" | "all" (default: "open")
 *   severity: "urgent" | "high" | "medium" | "low" | "all" (default: "all")
 *   limit: number (default: 50)
 */
import { NextResponse } from "next/server";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface PciSignal {
  id: string;
  client_id: string;
  contact_id: string | null;
  signal_type: string;
  severity: "low" | "medium" | "high" | "urgent";
  confidence: number;
  status: "open" | "in_progress" | "resolved" | "dismissed" | "expired";
  reason: string;
  recommended_action: string;
  estimated_value: number | null;
  created_at: string;
  updated_at: string;
}

interface ClientContact {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
}

const SIGNAL_LABELS: Record<string, string> = {
  warm_lead_risk: "Warm Lead at Risk",
  missed_call_unbooked: "Missed Call — Not Yet Booked",
  no_show_risk: "No-Show Risk",
  rebook_due: "Rebook Due",
  lapsed_client: "Lapsed Client",
  review_ready: "Ready for Review Request",
  owner_followup_needed: "Owner Follow-Up Needed",
  slow_week_fill: "Slow Week — Fill Opportunity",
};

const SIGNAL_DESCRIPTIONS: Record<string, string> = {
  warm_lead_risk: "A lead engaged recently but has not booked. Window is closing.",
  missed_call_unbooked: "A missed call was auto-replied but no appointment was made.",
  no_show_risk: "An upcoming appointment has risk signals for no-show.",
  rebook_due: "A client is due for their next appointment based on visit history.",
  lapsed_client: "A client has not visited in longer than their typical interval.",
  review_ready: "A recent positive experience is a good moment to request a review.",
  owner_followup_needed: "A conversation needs a personal touch from you.",
  slow_week_fill: "Your calendar has open slots this week that could be filled.",
};

export async function GET(req: Request): Promise<Response> {
  const clientId = req.headers.get("x-client-id");
  if (!clientId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const statusFilter = url.searchParams.get("status") ?? "open";
  const severityFilter = url.searchParams.get("severity") ?? "all";
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10), 200);

  const filter: Record<string, string> = {
    client_id: `eq.${clientId}`,
  };

  if (statusFilter !== "all") {
    filter["status"] = `eq.${statusFilter}`;
  }
  if (severityFilter !== "all") {
    filter["severity"] = `eq.${severityFilter}`;
  }

  let signals: PciSignal[] = [];
  try {
    signals = await sbSelect<PciSignal>("customer_signals", filter, {
      limit,
      order: "created_at.desc",
    });
  } catch (err) {
    console.error("[client/intelligence] Failed to fetch signals:", err);
    return NextResponse.json({ signals: [], contacts: {} });
  }

  // Fetch contact details for signals that have a contact_id
  const contactIds = [...new Set(signals.map((s) => s.contact_id).filter(Boolean))] as string[];
  const contactMap: Record<string, ClientContact> = {};

  if (contactIds.length > 0) {
    try {
      // Fetch up to 100 contacts in one call using in filter
      const contacts = await sbSelect<ClientContact>(
        "client_contacts",
        { id: `in.(${contactIds.join(",")})` },
        { limit: 100 }
      );
      for (const c of contacts) {
        contactMap[c.id] = c;
      }
    } catch {
      // Non-critical
    }
  }

  // Enrich signals with labels and descriptions
  const enriched = signals.map((s) => ({
    ...s,
    label: SIGNAL_LABELS[s.signal_type] ?? s.signal_type.replaceAll("_", " "),
    description: SIGNAL_DESCRIPTIONS[s.signal_type] ?? s.reason,
    contact: s.contact_id ? (contactMap[s.contact_id] ?? null) : null,
  }));

  // Summary stats
  const summary = {
    total: signals.length,
    urgent: signals.filter((s) => s.severity === "urgent").length,
    high: signals.filter((s) => s.severity === "high").length,
    medium: signals.filter((s) => s.severity === "medium").length,
    low: signals.filter((s) => s.severity === "low").length,
    estimatedRecoveryValue: signals.reduce(
      (sum, s) => sum + (s.estimated_value ?? 0),
      0
    ),
  };

  return NextResponse.json({ signals: enriched, summary });
}
