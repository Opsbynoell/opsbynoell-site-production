/**
 * GET /api/client/stats
 *
 * Returns aggregated stats for the client's dashboard overview.
 * Protected by proxy.ts middleware.
 */
import { NextResponse } from "next/server";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FrontDeskSession {
  id: string;
  trigger_type: string | null;
  resolved_at: string | null;
  created_at: string;
}

interface SupportSession {
  id: string;
  intent: string | null;
  resolved_at: string | null;
  created_at: string;
}

interface CareSession {
  id: string;
  resolved_at: string | null;
  created_at: string;
}

interface Appointment {
  id: string;
  status: string | null;
  appointment_at: string | null;
  created_at: string;
}

interface PciSignal {
  id: string;
  signal_type: string;
  severity: string;
  status: string;
  estimated_value: number | null;
  created_at: string;
}

export async function GET(req: Request): Promise<Response> {
  const clientId = req.headers.get("x-client-id");
  if (!clientId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOf7DaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOf30DaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [frontDeskSessions, supportSessions, careSessions, appointments, pciSignals] =
    await Promise.allSettled([
      sbSelect<FrontDeskSession>(
        "front_desk_sessions",
        { client_id: `eq.${clientId}`, created_at: `gte.${startOf30DaysAgo.toISOString()}` },
        { limit: 500 }
      ),
      sbSelect<SupportSession>(
        "support_sessions",
        { client_id: `eq.${clientId}`, created_at: `gte.${startOf30DaysAgo.toISOString()}` },
        { limit: 500 }
      ),
      sbSelect<CareSession>(
        "care_sessions",
        { client_id: `eq.${clientId}`, created_at: `gte.${startOf30DaysAgo.toISOString()}` },
        { limit: 500 }
      ),
      sbSelect<Appointment>(
        "appointments",
        { client_id: `eq.${clientId}`, created_at: `gte.${startOf30DaysAgo.toISOString()}` },
        { limit: 500 }
      ),
      sbSelect<PciSignal>(
        "customer_signals",
        { client_id: `eq.${clientId}`, status: "eq.open" },
        { limit: 100, order: "created_at.desc" }
      ),
    ]);

  const fd = frontDeskSessions.status === "fulfilled" ? frontDeskSessions.value : [];
  const support = supportSessions.status === "fulfilled" ? supportSessions.value : [];
  const care = careSessions.status === "fulfilled" ? careSessions.value : [];
  const appts = appointments.status === "fulfilled" ? appointments.value : [];
  const signals = pciSignals.status === "fulfilled" ? pciSignals.value : [];

  // Missed calls = front desk sessions triggered by missed_call
  const missedCallsTotal = fd.filter((s) => s.trigger_type === "missed_call").length;
  const missedCallsThisWeek = fd.filter(
    (s) =>
      s.trigger_type === "missed_call" &&
      new Date(s.created_at) >= startOf7DaysAgo
  ).length;

  // Active conversations = unresolved sessions in last 48h
  const cutoff48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const activeConversations = [
    ...fd.filter((s) => !s.resolved_at && new Date(s.created_at) >= cutoff48h),
    ...support.filter((s) => !s.resolved_at && new Date(s.created_at) >= cutoff48h),
    ...care.filter((s) => !s.resolved_at && new Date(s.created_at) >= cutoff48h),
  ].length;

  // Appointments booked this week
  const appointmentsThisWeek = appts.filter(
    (a) => new Date(a.created_at) >= startOf7DaysAgo
  ).length;

  // Appointments today
  const appointmentsToday = appts.filter(
    (a) => a.appointment_at && new Date(a.appointment_at) >= startOfToday
  ).length;

  // Hot leads (support sessions with intent=hot)
  const hotLeads = support.filter((s) => s.intent === "hot").length;
  const hotLeadsThisWeek = support.filter(
    (s) => s.intent === "hot" && new Date(s.created_at) >= startOf7DaysAgo
  ).length;

  // PCI signal summary
  const urgentSignals = signals.filter((s) => s.severity === "urgent").length;
  const highSignals = signals.filter((s) => s.severity === "high").length;
  const totalOpenSignals = signals.length;
  const estimatedRecoveryValue = signals.reduce(
    (sum, s) => sum + (s.estimated_value ?? 0),
    0
  );

  // Total conversations last 30 days
  const totalConversations30d = fd.length + support.length + care.length;

  return NextResponse.json({
    period: "last_30_days",
    overview: {
      missedCallsRecovered: missedCallsTotal,
      missedCallsThisWeek,
      activeConversations,
      appointmentsToday,
      appointmentsThisWeek,
      hotLeads,
      hotLeadsThisWeek,
      totalConversations30d,
    },
    pci: {
      totalOpenSignals,
      urgentSignals,
      highSignals,
      estimatedRecoveryValue,
      topSignals: signals.slice(0, 5).map((s) => ({
        id: s.id,
        type: s.signal_type,
        severity: s.severity,
        estimatedValue: s.estimated_value,
        createdAt: s.created_at,
      })),
    },
  });
}
