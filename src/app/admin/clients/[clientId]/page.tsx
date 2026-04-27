/**
 * Owner dashboard for a single client.
 *
 * Mobile-first, single-column. Server-rendered (no client-side polling).
 * Sections:
 *   1. Header strip (business name, phone, status, last activity)
 *   2. Today's stats (3 cards): missed calls auto-replied, active conversations, appointments today
 *   3. This week's stats (3 cards): same metrics, weekly window in Pacific time
 *   4. Recent missed calls (last 10)
 *   5. Recent care nudges (last 10)
 *   6. Active conversations (any session with messages in last 48h, not resolved)
 *
 * Auth: relies on the admin proxy (src/proxy.ts) which redirects to /admin/login
 * when no valid cookie. We additionally enforce that the caller can access this
 * client_id by reading the cookie payload here. Super admins see everything.
 */

import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { COOKIE_NAME, verifyToken } from "@/lib/admin-auth";
import { sbSelect } from "@/lib/agents/supabase";
import { getClientConfig } from "@/lib/agents/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface FrontDeskSessionRow {
  id: string;
  client_id: string;
  trigger_type: string | null;
  visitor_name: string | null;
  visitor_phone: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

interface FrontDeskMessageRow {
  id: string;
  session_id: string;
  role: string;
  content: string;
  created_at: string;
}

interface CareSessionRow {
  id: string;
  client_id: string;
  trigger_type: string | null;
  visitor_name: string | null;
  visitor_phone: string | null;
  last_visit_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

interface CareMessageRow {
  id: string;
  session_id: string;
  role: string;
  content: string;
  created_at: string;
}

interface SupportSessionRow {
  id: string;
  client_id: string;
  visitor_name: string | null;
  visitor_phone: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

interface AppointmentRow {
  id: string;
  client_id: string;
  scheduled_at: string;
  status: string;
  created_at: string;
}

// ---------------------------------------------------------------------------
// Pacific-time week / day boundaries.
//
// We avoid pulling in a tz library by formatting "now" through Intl with the
// America/Los_Angeles timezone, then constructing UTC timestamps that
// correspond to local midnight. Good enough for dashboard windows.
// ---------------------------------------------------------------------------

function pacificStartOfDay(now: Date): Date {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const part = (t: string) => Number(fmt.find((p) => p.type === t)?.value ?? "0");
  // Local-LA time as if it were UTC, minus its offset, gives the real UTC moment
  const asUTC = Date.UTC(
    part("year"),
    part("month") - 1,
    part("day"),
    0,
    0,
    0,
  );
  // Compute the offset between LA-local clock and UTC at this instant:
  const laClock = Date.UTC(
    part("year"),
    part("month") - 1,
    part("day"),
    part("hour"),
    part("minute"),
    part("second"),
  );
  const offsetMs = laClock - now.getTime();
  // Local LA midnight expressed as a real UTC instant:
  return new Date(asUTC - offsetMs);
}

function pacificStartOfWeek(now: Date): Date {
  const startOfDay = pacificStartOfDay(now);
  // Compute LA day-of-week
  const dayName = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    weekday: "short",
  }).format(now);
  const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  const dow = map[dayName] ?? 0;
  return new Date(startOfDay.getTime() - dow * 24 * 60 * 60 * 1000);
}

// ---------------------------------------------------------------------------
// Safe table fetchers — return [] on any error so a missing table degrades to
// an empty state rather than a 500.
// ---------------------------------------------------------------------------

async function safeSelect<T>(
  table: string,
  params: Record<string, string | number | boolean | undefined>,
  options: { select?: string; limit?: number; order?: string } = {},
): Promise<T[]> {
  try {
    return await sbSelect<T>(table, params, options);
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function relativeTime(ts: string | null | undefined): string {
  if (!ts) return "—";
  const diff = Date.now() - new Date(ts).getTime();
  if (Number.isNaN(diff)) return "—";
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function lastFour(phone: string | null | undefined): string {
  if (!phone) return "—";
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return `••${digits.slice(-4)}`;
}

function truncate(s: string | null | undefined, n: number): string {
  if (!s) return "—";
  if (s.length <= n) return s;
  return s.slice(0, n).trimEnd() + "…";
}

function daysBetween(from: string | null | undefined, to: Date): string {
  if (!from) return "—";
  const t = new Date(from).getTime();
  if (Number.isNaN(t)) return "—";
  const d = Math.floor((to.getTime() - t) / (1000 * 60 * 60 * 24));
  return `${d}d`;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ClientDashboardPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  // Auth: the proxy already redirected unauthenticated users, but we still
  // need to verify here to learn whether this admin can see *this* client.
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const payload = await verifyToken(token);
  if (!payload) {
    redirect(`/admin/login?next=${encodeURIComponent(`/admin/clients/${clientId}`)}`);
  }
  const canAccess =
    payload.isSuperAdmin || payload.accessibleClients.includes(clientId);
  if (!canAccess) {
    notFound();
  }

  // Client config — gracefully fall back to a stub if the row is missing.
  let cfg: Awaited<ReturnType<typeof getClientConfig>> | null = null;
  try {
    cfg = await getClientConfig(clientId);
  } catch {
    cfg = null;
  }

  const now = new Date();
  const dayStart = pacificStartOfDay(now);
  const weekStart = pacificStartOfWeek(now);
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  // Run all data queries in parallel.
  const [
    frontDeskRecent,
    frontDeskMessages,
    careRecent,
    careMessages,
    supportRecent,
    apptsToday,
    apptsThisWeek,
  ] = await Promise.all([
    safeSelect<FrontDeskSessionRow>(
      "front_desk_sessions",
      {
        client_id: `eq.${clientId}`,
        created_at: `gte.${weekStart.toISOString()}`,
      },
      { select: "*", limit: 200, order: "created_at.desc" },
    ),
    safeSelect<FrontDeskMessageRow>(
      "front_desk_messages",
      { created_at: `gte.${weekStart.toISOString()}` },
      { select: "*", limit: 1000, order: "created_at.desc" },
    ),
    safeSelect<CareSessionRow>(
      "care_sessions",
      {
        client_id: `eq.${clientId}`,
        created_at: `gte.${weekStart.toISOString()}`,
      },
      { select: "*", limit: 200, order: "created_at.desc" },
    ),
    safeSelect<CareMessageRow>(
      "care_messages",
      { created_at: `gte.${weekStart.toISOString()}` },
      { select: "*", limit: 1000, order: "created_at.desc" },
    ),
    safeSelect<SupportSessionRow>(
      "support_sessions",
      {
        client_id: `eq.${clientId}`,
        created_at: `gte.${weekStart.toISOString()}`,
      },
      { select: "*", limit: 100, order: "created_at.desc" },
    ),
    safeSelect<AppointmentRow>(
      "appointments",
      {
        client_id: `eq.${clientId}`,
        scheduled_at: `gte.${dayStart.toISOString()}`,
      },
      { select: "*", limit: 200, order: "scheduled_at.asc" },
    ),
    safeSelect<AppointmentRow>(
      "appointments",
      {
        client_id: `eq.${clientId}`,
        created_at: `gte.${weekStart.toISOString()}`,
      },
      { select: "*", limit: 500, order: "created_at.desc" },
    ),
  ]);

  // --- Index messages per session for quick lookup ---
  const fdMessagesBySession = new Map<string, FrontDeskMessageRow[]>();
  for (const m of frontDeskMessages) {
    const arr = fdMessagesBySession.get(m.session_id) ?? [];
    arr.push(m);
    fdMessagesBySession.set(m.session_id, arr);
  }
  const careMessagesBySession = new Map<string, CareMessageRow[]>();
  for (const m of careMessages) {
    const arr = careMessagesBySession.get(m.session_id) ?? [];
    arr.push(m);
    careMessagesBySession.set(m.session_id, arr);
  }

  // --- Stats ---
  const missedCallsToday = frontDeskRecent.filter(
    (s) =>
      s.trigger_type === "missed_call" &&
      new Date(s.created_at) >= dayStart,
  );
  const missedCallsWeek = frontDeskRecent.filter(
    (s) => s.trigger_type === "missed_call",
  );

  type TaggedSession =
    | { agent: "frontDesk"; row: FrontDeskSessionRow }
    | { agent: "care"; row: CareSessionRow }
    | { agent: "support"; row: SupportSessionRow };

  const allRecentSessions: TaggedSession[] = [
    ...frontDeskRecent.map((row) => ({ agent: "frontDesk" as const, row })),
    ...careRecent.map((row) => ({ agent: "care" as const, row })),
    ...supportRecent.map((row) => ({ agent: "support" as const, row })),
  ];
  const activeConvosNow = allRecentSessions.filter(({ row: s }) => {
    if (s.resolved_at) return false;
    const updated = new Date(s.updated_at).getTime();
    return updated >= fortyEightHoursAgo.getTime();
  });
  const activeConvosWeek = allRecentSessions.filter(
    ({ row: s }) => !s.resolved_at,
  );

  const apptsBookedToday = apptsToday.filter(
    (a) => new Date(a.scheduled_at) >= dayStart && a.status !== "cancelled",
  );
  const apptsBookedWeek = apptsThisWeek.filter(
    (a) =>
      new Date(a.created_at) >= weekStart && a.status !== "cancelled",
  );

  // --- Last activity timestamp across all agents ---
  const lastActivityTs = allRecentSessions
    .map(({ row: s }) => new Date(s.updated_at).getTime())
    .filter((t) => !Number.isNaN(t))
    .sort((a, b) => b - a)[0];

  // --- Recent missed calls (last 10, with reply context) ---
  const recentMissedCalls = frontDeskRecent
    .filter((s) => s.trigger_type === "missed_call")
    .slice(0, 10)
    .map((s) => {
      const msgs = (fdMessagesBySession.get(s.id) ?? []).sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      const firstBot = msgs.find((m) => m.role === "bot" || m.role === "assistant");
      const visitorReplied = msgs.some(
        (m) => m.role === "visitor" || m.role === "user",
      );
      const apptForSession = apptsThisWeek.find(
        (a) =>
          a.client_id === clientId &&
          new Date(a.created_at) >= new Date(s.created_at),
      );
      return {
        id: s.id,
        phone: s.visitor_phone,
        createdAt: s.created_at,
        firstReply: firstBot?.content ?? null,
        visitorReplied,
        booked: Boolean(apptForSession),
      };
    });

  // --- Recent care nudges (last 10) ---
  const recentCareNudges = careRecent.slice(0, 10).map((s) => {
    const msgs = (careMessagesBySession.get(s.id) ?? []).sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
    const firstBot = msgs.find((m) => m.role === "bot" || m.role === "assistant");
    const visitorReplied = msgs.some(
      (m) => m.role === "visitor" || m.role === "user",
    );
    const booked = apptsThisWeek.some(
      (a) =>
        a.client_id === clientId &&
        new Date(a.created_at) >= new Date(s.created_at) &&
        a.status !== "cancelled",
    );
    return {
      id: s.id,
      name: s.visitor_name,
      phone: s.visitor_phone,
      lastVisit: s.last_visit_at,
      nudgeSent: firstBot?.created_at ?? s.created_at,
      visitorReplied,
      booked,
    };
  });

  // --- Active conversations (last 48h, not resolved) ---
  const activeConversations = allRecentSessions
    .filter(({ row: s }) => {
      if (s.resolved_at) return false;
      return new Date(s.updated_at).getTime() >= fortyEightHoursAgo.getTime();
    })
    .sort(
      (a, b) =>
        new Date(b.row.updated_at).getTime() -
        new Date(a.row.updated_at).getTime(),
    )
    .slice(0, 15)
    .map(({ agent, row: s }) => ({
      id: s.id,
      agent,
      name: s.visitor_name,
      phone: s.visitor_phone,
      updatedAt: s.updated_at,
    }));

  // A2P pending banner
  const a2pPending = cfg?.smsConfig?.pendingA2P === true;

  const businessName =
    cfg?.businessName ?? clientId.charAt(0).toUpperCase() + clientId.slice(1);
  const phone = cfg?.phone ?? null;
  const isActive = cfg?.active ?? true;

  return (
    <div className="min-h-screen bg-cream pb-12">
      {/* Top bar — stripped down version of the existing admin top bar */}
      <header className="bg-white border-b border-warm-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Link
            href="/admin"
            className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40 hover:text-charcoal shrink-0"
          >
            ← Inbox
          </Link>
          <span className="font-serif text-base sm:text-lg font-semibold text-charcoal truncate">
            {businessName}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
              isActive
                ? "bg-emerald-100 text-emerald-700"
                : "bg-charcoal/5 text-charcoal/50"
            }`}
          >
            {isActive ? "Active" : "Paused"}
          </span>
        </div>
      </header>

      {a2pPending && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 text-xs text-amber-900 flex items-center justify-between gap-3">
          <span>
            <strong>A2P pending.</strong> SMS replies may be delayed until
            registration completes.
          </span>
          <Link
            href="#a2p-status"
            className="underline shrink-0 font-medium"
          >
            Check status
          </Link>
        </div>
      )}

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 space-y-6">
        {/* Header strip detail */}
        <section className="bg-white rounded-2xl shadow-sm border border-warm-border p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-charcoal/40">
                Phone
              </p>
              <p className="text-sm text-charcoal mt-0.5">
                {phone ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-charcoal/40">
                Last activity
              </p>
              <p className="text-sm text-charcoal mt-0.5">
                {lastActivityTs
                  ? relativeTime(new Date(lastActivityTs).toISOString())
                  : "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Today */}
        <Section title="Today">
          <StatGrid>
            <StatCard
              value={missedCallsToday.length}
              label="Missed calls auto-replied"
            />
            <StatCard
              value={activeConvosNow.length}
              label="Conversations active"
            />
            <StatCard
              value={apptsBookedToday.length}
              label="Appointments booked"
            />
          </StatGrid>
        </Section>

        {/* This week */}
        <Section title="This week">
          <StatGrid>
            <StatCard
              value={missedCallsWeek.length}
              label="Missed calls auto-replied"
            />
            <StatCard
              value={activeConvosWeek.length}
              label="Conversations open"
            />
            <StatCard
              value={apptsBookedWeek.length}
              label="Appointments booked"
            />
          </StatGrid>
        </Section>

        {/* Recent missed calls */}
        <Section title="Recent missed calls">
          {recentMissedCalls.length === 0 ? (
            <EmptyRow text="No missed calls in the last 7 days." />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-warm-border overflow-hidden">
              {recentMissedCalls.map((c, i) => (
                <div
                  key={c.id}
                  className={`px-4 py-3 ${
                    i > 0 ? "border-t border-warm-border" : ""
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="font-mono text-sm text-charcoal">
                      {lastFour(c.phone)}
                    </span>
                    <span className="text-[10px] text-charcoal/40 shrink-0">
                      {relativeTime(c.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/60 mb-1.5">
                    {truncate(c.firstReply, 80)}
                  </p>
                  <div className="flex gap-1.5">
                    <Pill
                      tone={c.visitorReplied ? "good" : "muted"}
                      label={c.visitorReplied ? "Replied" : "No reply"}
                    />
                    <Pill
                      tone={c.booked ? "good" : "muted"}
                      label={c.booked ? "Booked" : "Not booked"}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Recent care nudges */}
        <Section title="Recent care nudges">
          {recentCareNudges.length === 0 ? (
            <EmptyRow text="No care nudges in the last 7 days." />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-warm-border overflow-hidden">
              {recentCareNudges.map((c, i) => (
                <div
                  key={c.id}
                  className={`px-4 py-3 ${
                    i > 0 ? "border-t border-warm-border" : ""
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-sm text-charcoal truncate">
                      {c.name ?? lastFour(c.phone)}
                    </span>
                    <span className="text-[10px] text-charcoal/40 shrink-0">
                      {relativeTime(c.nudgeSent)}
                    </span>
                  </div>
                  <p className="text-xs text-charcoal/60 mb-1.5">
                    Last visit: {c.lastVisit
                      ? `${daysBetween(c.lastVisit, now)} ago`
                      : "—"}
                  </p>
                  <div className="flex gap-1.5">
                    <Pill
                      tone={c.visitorReplied ? "good" : "muted"}
                      label={c.visitorReplied ? "Replied" : "No reply"}
                    />
                    <Pill
                      tone={c.booked ? "good" : "muted"}
                      label={c.booked ? "Rebooked" : "Not booked"}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Active conversations */}
        <Section title="Active conversations">
          {activeConversations.length === 0 ? (
            <EmptyRow text="No active conversations in the last 48 hours." />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-warm-border overflow-hidden">
              {activeConversations.map((c, i) => (
                <Link
                  key={`${c.agent}-${c.id}`}
                  href={`/admin/clients/${clientId}/sessions/${c.id}?agent=${c.agent}`}
                  className={`flex items-center justify-between gap-3 px-4 py-3 hover:bg-cream/60 transition-colors ${
                    i > 0 ? "border-t border-warm-border" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm text-charcoal truncate">
                        {c.name ?? lastFour(c.phone)}
                      </span>
                      <AgentPill agent={c.agent} />
                    </div>
                    <p className="text-[10px] text-charcoal/40">
                      {relativeTime(c.updatedAt)}
                    </p>
                  </div>
                  <span className="text-charcoal/30 text-lg shrink-0">›</span>
                </Link>
              ))}
            </div>
          )}
        </Section>
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Presentation building blocks
// ---------------------------------------------------------------------------

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-[10px] font-mono uppercase tracking-widest text-charcoal/40 mb-2 px-1">
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-3 gap-2 sm:gap-3">{children}</div>;
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-warm-border p-4 sm:p-5">
      <p className="text-3xl sm:text-4xl font-serif font-semibold text-charcoal leading-none">
        {value}
      </p>
      <p className="text-[10px] sm:text-[11px] text-charcoal/50 mt-2 leading-tight">
        {label}
      </p>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-warm-border px-4 py-6 text-center text-xs text-charcoal/40">
      {text}
    </div>
  );
}

function Pill({
  tone,
  label,
}: {
  tone: "good" | "muted" | "warn";
  label: string;
}) {
  const cls =
    tone === "good"
      ? "bg-emerald-100 text-emerald-700"
      : tone === "warn"
        ? "bg-amber-100 text-amber-700"
        : "bg-charcoal/5 text-charcoal/50";
  return (
    <span
      className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${cls}`}
    >
      {label}
    </span>
  );
}

function AgentPill({ agent }: { agent: "frontDesk" | "care" | "support" }) {
  const label =
    agent === "frontDesk"
      ? "Front Desk"
      : agent === "care"
        ? "Care"
        : "Support";
  const cls =
    agent === "frontDesk"
      ? "bg-wine/10 text-wine"
      : agent === "care"
        ? "bg-emerald-100 text-emerald-700"
        : "bg-[#7C5CFC]/10 text-[#7C5CFC]";
  return (
    <span
      className={`shrink-0 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${cls}`}
    >
      {label}
    </span>
  );
}
