"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconBrain,
  IconArrowLeft,
  IconRefresh,
  IconAlertTriangle,
  IconTrendingUp,
  IconUsers,
  IconCalendar,
  IconStar,
  IconPhoneCall,
  IconClock,
} from "@tabler/icons-react";

type Severity = "urgent" | "high" | "medium" | "low";
type SeverityFilter = "all" | Severity;

interface Signal {
  id: string;
  signal_type: string;
  severity: Severity;
  confidence: number;
  status: string;
  reason: string;
  recommended_action: string;
  estimated_value: number | null;
  label: string;
  description: string;
  contact: {
    id: string;
    name: string | null;
    phone: string | null;
    email: string | null;
  } | null;
  created_at: string;
}

interface Summary {
  total: number;
  urgent: number;
  high: number;
  medium: number;
  low: number;
  estimatedRecoveryValue: number;
}

const SEVERITY_COLORS: Record<Severity, string> = {
  urgent: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  low: "bg-charcoal/5 text-charcoal/70 border-charcoal/10",
};

const SEVERITY_DOT: Record<Severity, string> = {
  urgent: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-amber-500",
  low: "bg-charcoal/30",
};

const SIGNAL_ICONS: Record<string, React.ReactNode> = {
  warm_lead_risk: <IconTrendingUp size={16} />,
  missed_call_unbooked: <IconPhoneCall size={16} />,
  no_show_risk: <IconAlertTriangle size={16} />,
  rebook_due: <IconCalendar size={16} />,
  lapsed_client: <IconUsers size={16} />,
  review_ready: <IconStar size={16} />,
  owner_followup_needed: <IconClock size={16} />,
  slow_week_fill: <IconCalendar size={16} />,
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

export default function ClientIntelligencePage() {
  const router = useRouter();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSignals = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const params = new URLSearchParams({
          status: "open",
          severity: severityFilter,
          limit: "100",
        });
        const res = await fetch(`/api/client/intelligence?${params}`);
        if (res.status === 401) {
          router.replace("/client/login");
          return;
        }
        if (res.ok) {
          const d = await res.json();
          setSignals(d.signals ?? []);
          setSummary(d.summary ?? null);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [severityFilter, router]
  );

  useEffect(() => {
    fetchSignals();
  }, [fetchSignals]);

  return (
    <div className="min-h-screen bg-[#f8f4f0]">
      {/* Top nav */}
      <header className="bg-white border-b border-warm-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/client/dashboard"
              className="flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal transition"
            >
              <IconArrowLeft size={14} />
              Dashboard
            </Link>
            <span className="text-charcoal/30">/</span>
            <span className="text-sm font-semibold text-charcoal">Intelligence</span>
          </div>
          <button
            onClick={() => fetchSignals(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal transition disabled:opacity-50"
          >
            <IconRefresh size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <IconBrain size={16} className="text-amber-700" />
            </div>
            <h1 className="font-serif text-2xl font-semibold text-charcoal">
              Predictive Intelligence
            </h1>
          </div>
          <p className="text-sm text-charcoal/60">
            Your agents are watching for revenue opportunities and risks. Act on these signals to recover revenue and keep clients coming back.
          </p>
        </div>

        {/* Summary cards */}
        {summary && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="sm:col-span-2 bg-white rounded-[16px] border border-warm-border p-4">
              <p className="text-[11px] text-charcoal/60 font-medium mb-1">Estimated Recovery Value</p>
              <p className="font-serif text-3xl font-semibold text-charcoal">
                ${summary.estimatedRecoveryValue.toLocaleString()}
              </p>
              <p className="text-[10px] text-charcoal/50 mt-0.5">from {summary.total} open signals</p>
            </div>
            {(["urgent", "high", "medium", "low"] as Severity[]).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev === severityFilter ? "all" : sev)}
                className={`bg-white rounded-[16px] border p-4 text-left transition hover:-translate-y-0.5 ${
                  severityFilter === sev ? "border-charcoal/30 shadow-sm" : "border-warm-border"
                }`}
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`w-2 h-2 rounded-full ${SEVERITY_DOT[sev]}`} />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-charcoal/60 capitalize">
                    {sev}
                  </span>
                </div>
                <p className="font-serif text-2xl font-semibold text-charcoal">
                  {summary[sev]}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Severity filter */}
        <div className="flex gap-1 bg-white rounded-[10px] border border-warm-border p-1 w-fit">
          {(["all", "urgent", "high", "medium", "low"] as SeverityFilter[]).map((v) => (
            <button
              key={v}
              onClick={() => setSeverityFilter(v)}
              className={`px-3 py-1.5 rounded-[8px] text-xs font-medium capitalize transition ${
                severityFilter === v
                  ? "bg-charcoal text-white"
                  : "text-charcoal/70 hover:bg-warm-border/40"
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        {/* Signal list */}
        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
            </div>
          ) : signals.length === 0 ? (
            <div className="bg-white rounded-[20px] border border-warm-border flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-3">
                <IconBrain size={18} className="text-emerald-700" />
              </div>
              <p className="text-sm font-medium text-charcoal/60">All clear</p>
              <p className="text-xs text-charcoal/40 mt-1">
                No open signals right now. Your agents are watching.
              </p>
            </div>
          ) : (
            signals.map((signal) => (
              <div
                key={signal.id}
                className="bg-white rounded-[16px] border border-warm-border p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                        SEVERITY_COLORS[signal.severity]
                      }`}
                    >
                      {SIGNAL_ICONS[signal.signal_type] ?? <IconAlertTriangle size={16} />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="text-sm font-semibold text-charcoal">
                          {signal.label}
                        </p>
                        <span
                          className={`text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full border ${
                            SEVERITY_COLORS[signal.severity]
                          }`}
                        >
                          {signal.severity}
                        </span>
                        {signal.confidence > 0 && (
                          <span className="text-[9px] font-mono text-charcoal/50">
                            {Math.round(signal.confidence * 100)}% confidence
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-charcoal/70 leading-relaxed">
                        {signal.description}
                      </p>
                      {signal.contact && (
                        <div className="mt-2 flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-warm-border flex items-center justify-center text-[9px] font-semibold text-charcoal/70">
                            {(signal.contact.name ?? signal.contact.phone ?? "?")[0].toUpperCase()}
                          </div>
                          <span className="text-xs text-charcoal/60">
                            {signal.contact.name ?? signal.contact.phone ?? signal.contact.email ?? "Unknown contact"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {signal.estimated_value && signal.estimated_value > 0 && (
                      <span className="text-sm font-semibold text-emerald-700">
                        ${signal.estimated_value.toLocaleString()}
                      </span>
                    )}
                    <span className="text-[10px] text-charcoal/50">
                      {relativeTime(signal.created_at)}
                    </span>
                  </div>
                </div>

                {/* Recommended action */}
                {signal.recommended_action && (
                  <div className="mt-4 pt-4 border-t border-warm-border">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-charcoal/50 mb-1">
                      Recommended action
                    </p>
                    <p className="text-xs text-charcoal/80 leading-relaxed">
                      {signal.recommended_action}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
