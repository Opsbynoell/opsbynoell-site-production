"use client";

/**
 * Internal PCI dashboard — open signals by severity.
 *
 * Protected by middleware (src/proxy.ts) like the rest of /admin.
 * This is an internal operator view only. Do not link to it from
 * public navigation.
 */

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SignalSeverity = "low" | "medium" | "high" | "urgent";
type SignalStatus = "open" | "in_progress" | "resolved" | "dismissed" | "expired";

interface Signal {
  id: string;
  client_id: string;
  contact_id: string | null;
  signal_type: string;
  severity: SignalSeverity;
  confidence: number;
  status: SignalStatus;
  reason: string;
  recommended_action: string;
  estimated_value: number | null;
  created_at: string;
  updated_at: string;
}

interface MeResponse {
  authenticated: boolean;
  email?: string;
  isSuperAdmin?: boolean;
  accessibleClients?: string[];
}

const SIGNAL_TYPES = [
  "warm_lead_risk",
  "missed_call_unbooked",
  "no_show_risk",
  "rebook_due",
  "lapsed_client",
  "review_ready",
  "owner_followup_needed",
  "slow_week_fill",
] as const;

type SignalTypeFilter = "all" | (typeof SIGNAL_TYPES)[number];

const SEVERITY_ORDER: Record<SignalSeverity, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const SEVERITY_COLORS: Record<SignalSeverity, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-charcoal/10 text-charcoal/60",
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

function prettyType(t: string): string {
  return t.replaceAll("_", " ");
}

interface GenerateRuleResult {
  rule: string;
  scanned: number;
  drafts: number;
  created: number;
  skipped_existing: number;
  events_written: number;
}

interface GenerateResponse {
  dryRun: boolean;
  now: string;
  results: GenerateRuleResult[];
  totals: {
    scanned: number;
    drafts: number;
    created: number;
    skipped_existing: number;
    events_written: number;
  };
}

export default function PciDashboard() {
  const router = useRouter();
  const [signals, setSignals] = useState<Signal[]>([]);
  const [typeFilter, setTypeFilter] = useState<SignalTypeFilter>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<MeResponse | null>(null);
  const [generating, setGenerating] = useState(false);
  const [lastGenerate, setLastGenerate] = useState<GenerateResponse | null>(null);
  const [generateError, setGenerateError] = useState("");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d: MeResponse) => {
        if (!d.authenticated) router.replace("/admin/login");
        else setMe(d);
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  const fetchSignals = useCallback(async () => {
    if (!me) return;
    try {
      const params = new URLSearchParams();
      if (typeFilter !== "all") params.set("type", typeFilter);
      if (me.isSuperAdmin && clientFilter !== "all") {
        params.set("clientId", clientFilter);
      }
      const url = `/api/admin/pci/signals${params.size ? "?" + params.toString() : ""}`;
      const res = await fetch(url);
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.signals) {
        const sorted = [...(data.signals as Signal[])].sort(
          (a, b) =>
            SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setSignals(sorted);
      }
      setError("");
    } catch {
      setError("Failed to load signals");
    } finally {
      setLoading(false);
    }
  }, [typeFilter, clientFilter, me, router]);

  useEffect(() => {
    if (!me) return;
    fetchSignals();
    const interval = setInterval(fetchSignals, 10_000);
    return () => clearInterval(interval);
  }, [fetchSignals, me]);

  const runGenerate = useCallback(
    async (dryRun: boolean) => {
      if (generating) return;
      setGenerating(true);
      setGenerateError("");
      try {
        const body: Record<string, unknown> = { dryRun };
        if (me?.isSuperAdmin && clientFilter !== "all") {
          body.clientIds = [clientFilter];
        }
        const res = await fetch("/api/admin/pci/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (res.status === 401) {
          router.replace("/admin/login");
          return;
        }
        const data = (await res.json()) as GenerateResponse | { error: string };
        if (!res.ok || "error" in data) {
          setGenerateError(
            "error" in data ? data.error : "Signal generation failed."
          );
          return;
        }
        setLastGenerate(data);
        // If we actually persisted, refresh the open-signals list.
        if (!dryRun) await fetchSignals();
      } catch {
        setGenerateError("Signal generation failed.");
      } finally {
        setGenerating(false);
      }
    },
    [generating, me, clientFilter, router, fetchSignals]
  );

  const clientIds = me?.isSuperAdmin
    ? Array.from(new Set(signals.map((s) => s.client_id))).sort()
    : [];

  const bySeverity = signals.reduce<Record<SignalSeverity, number>>(
    (acc, s) => {
      acc[s.severity] = (acc[s.severity] ?? 0) + 1;
      return acc;
    },
    { urgent: 0, high: 0, medium: 0, low: 0 }
  );

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b border-warm-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg font-semibold text-charcoal">
            Ops by Noell
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
            Intelligence · Open signals
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/admin"
            className="text-xs text-charcoal/50 hover:text-charcoal transition-colors"
          >
            ← Inbox
          </a>
          {me?.email && (
            <span className="text-xs text-charcoal/50">{me.email}</span>
          )}
        </div>
      </header>

      <div className="bg-white border-b border-warm-border px-6 py-3 flex items-center justify-between shrink-0 gap-4">
        <div className="flex gap-4 text-xs">
          {(["urgent", "high", "medium", "low"] as SignalSeverity[]).map((sev) => (
            <div key={sev} className="flex items-center gap-1.5">
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono uppercase ${SEVERITY_COLORS[sev]}`}
              >
                {sev}
              </span>
              <span className="text-charcoal/60">{bySeverity[sev]}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as SignalTypeFilter)}
            className="text-xs bg-cream border border-warm-border rounded-lg px-2 py-1.5 text-charcoal focus:outline-none focus:border-wine/50"
          >
            <option value="all">All types</option>
            {SIGNAL_TYPES.map((t) => (
              <option key={t} value={t}>
                {prettyType(t)}
              </option>
            ))}
          </select>

          {me?.isSuperAdmin && clientIds.length > 0 && (
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="text-xs bg-cream border border-warm-border rounded-lg px-2 py-1.5 text-charcoal focus:outline-none focus:border-wine/50"
            >
              <option value="all">All clients</option>
              {clientIds.map((id) => (
                <option key={id} value={id}>
                  {id}
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center gap-1.5 pl-2 border-l border-warm-border">
            <button
              type="button"
              onClick={() => runGenerate(true)}
              disabled={generating}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-warm-border bg-white hover:bg-cream text-charcoal disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Preview what signals would be created without writing to the database."
            >
              {generating ? "Scanning…" : "Preview (dry run)"}
            </button>
            <button
              type="button"
              onClick={() => runGenerate(false)}
              disabled={generating}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-wine text-white hover:bg-wine/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Run rules against existing records and persist new signals."
            >
              {generating ? "Generating…" : "Generate signals"}
            </button>
          </div>
        </div>
      </div>

      {(lastGenerate || generateError) && (
        <div className="bg-cream/60 border-b border-warm-border px-6 py-2 shrink-0 text-xs">
          {generateError ? (
            <p className="text-red-600">{generateError}</p>
          ) : lastGenerate ? (
            <div className="flex items-center gap-3 text-charcoal/70">
              <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
                {lastGenerate.dryRun ? "Dry run" : "Generated"}
              </span>
              <span>
                scanned <strong>{lastGenerate.totals.scanned}</strong>
              </span>
              <span>
                drafts <strong>{lastGenerate.totals.drafts}</strong>
              </span>
              <span>
                created <strong>{lastGenerate.totals.created}</strong>
              </span>
              <span>
                skipped{" "}
                <strong>{lastGenerate.totals.skipped_existing}</strong>
              </span>
              <span className="text-charcoal/40">
                events {lastGenerate.totals.events_written}
              </span>
              <div className="flex gap-2 ml-2 text-charcoal/50">
                {lastGenerate.results
                  .filter((r) => r.drafts > 0)
                  .map((r) => (
                    <span key={r.rule} className="font-mono text-[10px]">
                      {r.rule}:{r.drafts}
                    </span>
                  ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-500 py-8">{error}</p>
        ) : signals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-charcoal/50">No open signals.</p>
            <p className="text-xs text-charcoal/35 mt-1">
              Signals appear here as the intelligence layer generates them.
            </p>
          </div>
        ) : (
          <div>
            {signals.map((s) => (
              <div
                key={s.id}
                className="w-full text-left px-6 py-4 border-b border-warm-border hover:bg-cream/60 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`shrink-0 text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${SEVERITY_COLORS[s.severity]}`}
                    >
                      {s.severity}
                    </span>
                    <span className="font-medium text-sm text-charcoal truncate">
                      {prettyType(s.signal_type)}
                    </span>
                    {me?.isSuperAdmin && (
                      <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-charcoal/5 text-charcoal/50">
                        {s.client_id}
                      </span>
                    )}
                    <span className="shrink-0 text-[10px] font-mono text-charcoal/35">
                      conf {(s.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <span className="shrink-0 text-[10px] text-charcoal/40">
                    {relativeTime(s.created_at)}
                  </span>
                </div>

                <p className="text-xs text-charcoal/70 mb-1">{s.reason}</p>
                <p className="text-xs text-charcoal/50">
                  <span className="text-charcoal/35">→ </span>
                  {s.recommended_action}
                  {s.estimated_value !== null && (
                    <span className="ml-2 text-charcoal/35">
                      (est. ${s.estimated_value.toFixed(0)})
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
