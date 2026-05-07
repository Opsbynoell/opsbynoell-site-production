"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconBolt,
  IconPhoneCall,
  IconHeartHandshake,
  IconBrain,
  IconInbox,
  IconTrendingUp,
  IconAlertTriangle,
  IconCalendar,
  IconUsers,
  IconLogout,
  IconChevronRight,
  IconStar,
} from "@tabler/icons-react";

interface MeResponse {
  authenticated: boolean;
  clientId?: string;
  email?: string;
  name?: string;
  subscription?: {
    planId: string;
    status: string;
    amountCents: number;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
  } | null;
}

interface StatsResponse {
  overview: {
    missedCallsRecovered: number;
    missedCallsThisWeek: number;
    activeConversations: number;
    appointmentsToday: number;
    appointmentsThisWeek: number;
    hotLeads: number;
    hotLeadsThisWeek: number;
    totalConversations30d: number;
  };
  pci: {
    totalOpenSignals: number;
    urgentSignals: number;
    highSignals: number;
    estimatedRecoveryValue: number;
    topSignals: {
      id: string;
      type: string;
      severity: string;
      estimatedValue: number | null;
      createdAt: string;
    }[];
  };
}

const PLAN_LABELS: Record<string, string> = {
  agents_founding: "Noell Agents — Founding Rate",
  agents_standard: "Noell Agents",
  essentials: "Noell System — Essentials",
  growth: "Noell System — Growth",
  custom_ops: "Noell System — Custom Ops",
};

const SEVERITY_COLORS: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-charcoal/10 text-charcoal/70",
};

const SIGNAL_LABELS: Record<string, string> = {
  warm_lead_risk: "Warm Lead at Risk",
  missed_call_unbooked: "Missed Call — Not Booked",
  no_show_risk: "No-Show Risk",
  rebook_due: "Rebook Due",
  lapsed_client: "Lapsed Client",
  review_ready: "Ready for Review",
  owner_followup_needed: "Follow-Up Needed",
  slow_week_fill: "Slow Week — Fill Opportunity",
};

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ClientDashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [meRes, statsRes] = await Promise.all([
        fetch("/api/client/me"),
        fetch("/api/client/stats"),
      ]);
      if (!meRes.ok) {
        router.replace("/client/login");
        return;
      }
      const meData = await meRes.json();
      if (!meData.authenticated) {
        router.replace("/client/login");
        return;
      }
      setMe(meData);
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    } catch {
      router.replace("/client/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleLogout() {
    await fetch("/api/client/logout", { method: "POST" });
    router.replace("/client/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f4f0] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  const o = stats?.overview;
  const pci = stats?.pci;

  return (
    <div className="min-h-screen bg-[#f8f4f0]">
      {/* Top nav */}
      <header className="bg-white border-b border-warm-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-wine/10 flex items-center justify-center">
              <IconBolt size={14} className="text-wine" />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-charcoal/50">
                Ops by Noell
              </p>
              <p className="text-sm font-semibold text-charcoal leading-none">
                {me?.name ?? me?.email ?? "Dashboard"}
              </p>
            </div>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            <Link
              href="/client/dashboard"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal bg-warm-border/60"
            >
              Overview
            </Link>
            <Link
              href="/client/inbox"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal/70 hover:bg-warm-border/40 transition"
            >
              Inbox
            </Link>
            <Link
              href="/client/intelligence"
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-charcoal/70 hover:bg-warm-border/40 transition"
            >
              Intelligence
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal transition"
          >
            <IconLogout size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome + plan badge */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-charcoal">
              Good to see you.
            </h1>
            <p className="text-sm text-charcoal/60 mt-0.5">
              Here is what your agents have been doing.
            </p>
          </div>
          {me?.subscription && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-wine/10 border border-wine/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-wine">
                {PLAN_LABELS[me.subscription.planId] ?? me.subscription.planId}
              </span>
            </div>
          )}
        </div>

        {/* Agent status row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Noell Support", sublabel: "24/7 website chat", icon: <IconBolt size={16} />, color: "text-[#7C5CFC]", bg: "bg-[#7C5CFC]/10" },
            { label: "Front Desk", sublabel: "Calls + scheduling", icon: <IconPhoneCall size={16} />, color: "text-wine", bg: "bg-wine/10" },
            { label: "Noell Care", sublabel: "Existing clients", icon: <IconHeartHandshake size={16} />, color: "text-emerald-700", bg: "bg-emerald-100" },
          ].map((agent) => (
            <div
              key={agent.label}
              className="bg-white rounded-[16px] border border-warm-border p-4 flex flex-col gap-2"
            >
              <div className={`w-8 h-8 rounded-full ${agent.bg} flex items-center justify-center ${agent.color}`}>
                {agent.icon}
              </div>
              <div>
                <p className="text-xs font-semibold text-charcoal">{agent.label}</p>
                <p className="text-[10px] text-charcoal/60">{agent.sublabel}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-700">
                  Online
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Key metrics */}
        <div>
          <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-charcoal/50 mb-3">
            Last 30 days
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label="Missed calls recovered"
              value={o?.missedCallsRecovered ?? 0}
              sub={`${o?.missedCallsThisWeek ?? 0} this week`}
              icon={<IconPhoneCall size={16} className="text-wine" />}
            />
            <MetricCard
              label="Active conversations"
              value={o?.activeConversations ?? 0}
              sub="in last 48 hours"
              icon={<IconInbox size={16} className="text-[#7C5CFC]" />}
            />
            <MetricCard
              label="Appointments booked"
              value={o?.appointmentsThisWeek ?? 0}
              sub={`${o?.appointmentsToday ?? 0} today`}
              icon={<IconCalendar size={16} className="text-emerald-700" />}
            />
            <MetricCard
              label="Hot leads"
              value={o?.hotLeads ?? 0}
              sub={`${o?.hotLeadsThisWeek ?? 0} this week`}
              icon={<IconTrendingUp size={16} className="text-amber-600" />}
            />
          </div>
        </div>

        {/* PCI Intelligence preview */}
        {pci && pci.totalOpenSignals > 0 && (
          <div className="bg-white rounded-[20px] border border-warm-border overflow-hidden">
            <div className="px-6 py-4 border-b border-warm-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <IconBrain size={16} className="text-amber-700" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-charcoal">
                    Predictive Intelligence
                  </p>
                  <p className="text-[11px] text-charcoal/60">
                    {pci.totalOpenSignals} open signal{pci.totalOpenSignals !== 1 ? "s" : ""}
                    {pci.estimatedRecoveryValue > 0 &&
                      ` · $${pci.estimatedRecoveryValue.toLocaleString()} estimated recovery`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pci.urgentSignals > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                    {pci.urgentSignals} urgent
                  </span>
                )}
                {pci.highSignals > 0 && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                    {pci.highSignals} high
                  </span>
                )}
                <Link
                  href="/client/intelligence"
                  className="flex items-center gap-1 text-xs text-wine hover:underline"
                >
                  View all
                  <IconChevronRight size={12} />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-warm-border">
              {pci.topSignals.map((signal) => (
                <div
                  key={signal.id}
                  className="px-6 py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconAlertTriangle
                      size={14}
                      className={
                        signal.severity === "urgent"
                          ? "text-red-600 shrink-0"
                          : signal.severity === "high"
                          ? "text-orange-600 shrink-0"
                          : "text-amber-600 shrink-0"
                      }
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-charcoal font-medium truncate">
                        {SIGNAL_LABELS[signal.type] ?? signal.type.replaceAll("_", " ")}
                      </p>
                      <p className="text-[10px] text-charcoal/60">
                        {relativeTime(signal.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {signal.estimatedValue && signal.estimatedValue > 0 && (
                      <span className="text-xs text-emerald-700 font-medium">
                        ${signal.estimatedValue}
                      </span>
                    )}
                    <span
                      className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                        SEVERITY_COLORS[signal.severity] ?? "bg-charcoal/10 text-charcoal/70"
                      }`}
                    >
                      {signal.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickLink
            href="/client/inbox"
            icon={<IconInbox size={18} className="text-[#7C5CFC]" />}
            label="Agent Inbox"
            description="View all conversations from your agents."
          />
          <QuickLink
            href="/client/intelligence"
            icon={<IconBrain size={18} className="text-amber-700" />}
            label="Intelligence Signals"
            description="Clients at risk, rebooking opportunities, and more."
          />
          <QuickLink
            href="mailto:hello@opsbynoell.com"
            icon={<IconStar size={18} className="text-wine" />}
            label="Talk to Noell"
            description="Questions, upgrades, or anything else."
            external
          />
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-[16px] border border-warm-border p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] text-charcoal/60 font-medium leading-tight">{label}</p>
        {icon}
      </div>
      <p className="font-serif text-3xl font-semibold text-charcoal">{value.toLocaleString()}</p>
      <p className="text-[10px] text-charcoal/50 mt-0.5">{sub}</p>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
  description,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  external?: boolean;
}) {
  const cls =
    "bg-white rounded-[16px] border border-warm-border p-5 flex gap-4 items-start hover:shadow-sm hover:-translate-y-0.5 transition duration-200 group";

  const content = (
    <>
      <div className="w-9 h-9 rounded-full bg-[#f8f4f0] flex items-center justify-center shrink-0 group-hover:scale-105 transition">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold text-charcoal">{label}</p>
        <p className="text-xs text-charcoal/60 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </>
  );

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  );
}
