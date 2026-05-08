"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  IconBolt,
  IconPhoneCall,
  IconHeartHandshake,
  IconArrowLeft,
  IconRefresh,
} from "@tabler/icons-react";

type AgentKind = "support" | "frontDesk" | "care";
type Filter = "all" | AgentKind;
type ResolvedFilter = "all" | "open" | "resolved";

interface Session {
  id: string;
  client_id: string;
  agent: AgentKind;
  visitor_name: string | null;
  visitor_phone: string | null;
  visitor_email: string | null;
  last_message: string | null;
  intent: string | null;
  trigger_type: string | null;
  human_takeover: boolean;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

const AGENT_LABELS: Record<AgentKind, string> = {
  support: "Noell Support",
  frontDesk: "Front Desk",
  care: "Noell Care",
};

const AGENT_COLORS: Record<AgentKind, string> = {
  support: "bg-[#7C5CFC]/10 text-[#7C5CFC]",
  frontDesk: "bg-wine/10 text-wine",
  care: "bg-emerald-100 text-emerald-700",
};

const FILTER_TABS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "support", label: "Noell Support" },
  { value: "frontDesk", label: "Front Desk" },
  { value: "care", label: "Care" },
];

function relativeTime(ts: string): string {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ClientInboxPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [resolvedFilter, setResolvedFilter] = useState<ResolvedFilter>("open");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSessions = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      else setRefreshing(true);
      try {
        const params = new URLSearchParams({
          agent: filter,
          resolved: resolvedFilter === "all" ? "all" : resolvedFilter === "resolved" ? "true" : "false",
          limit: "100",
        });
        const res = await fetch(`/api/client/sessions?${params}`);
        if (res.status === 401) {
          router.replace("/client/login");
          return;
        }
        if (res.ok) {
          const d = await res.json();
          setSessions(d.sessions ?? []);
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filter, resolvedFilter, router]
  );

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const open = sessions.filter((s) => !s.resolved_at);
  const resolved = sessions.filter((s) => !!s.resolved_at);
  const displayed = resolvedFilter === "open" ? open : resolvedFilter === "resolved" ? resolved : sessions;

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
            <span className="text-sm font-semibold text-charcoal">Agent Inbox</span>
          </div>
          <button
            onClick={() => fetchSessions(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-xs text-charcoal/60 hover:text-charcoal transition disabled:opacity-50"
          >
            <IconRefresh size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="flex gap-1 bg-white rounded-[10px] border border-warm-border p-1">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-medium transition ${
                  filter === tab.value
                    ? "bg-charcoal text-white"
                    : "text-charcoal/70 hover:bg-warm-border/40"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-white rounded-[10px] border border-warm-border p-1">
            {(["open", "resolved", "all"] as ResolvedFilter[]).map((v) => (
              <button
                key={v}
                onClick={() => setResolvedFilter(v)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-medium capitalize transition ${
                  resolvedFilter === v
                    ? "bg-charcoal text-white"
                    : "text-charcoal/70 hover:bg-warm-border/40"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <p className="text-xs text-charcoal/50 sm:ml-auto">
            {displayed.length} conversation{displayed.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Session list */}
        <div className="bg-white rounded-[20px] border border-warm-border overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-6 h-6 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <div className="w-10 h-10 rounded-full bg-warm-border/60 flex items-center justify-center mb-3">
                <IconBolt size={18} className="text-charcoal/40" />
              </div>
              <p className="text-sm font-medium text-charcoal/60">No conversations yet</p>
              <p className="text-xs text-charcoal/40 mt-1">
                Your agents will show activity here as they work.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-warm-border">
              {displayed.map((s) => {
                const display = s.visitor_name ?? s.visitor_phone ?? s.visitor_email ?? "Unknown visitor";
                const AgentIcon =
                  s.agent === "support"
                    ? IconBolt
                    : s.agent === "frontDesk"
                    ? IconPhoneCall
                    : IconHeartHandshake;

                return (
                  <div
                    key={`${s.agent}-${s.id}`}
                    className="px-6 py-4 flex gap-4 items-start hover:bg-[#f8f4f0]/60 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-warm-border flex items-center justify-center text-charcoal/70 font-semibold text-sm shrink-0">
                      {(display[0] ?? "?").toUpperCase()}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="font-medium text-sm text-charcoal truncate">
                            {display}
                          </span>
                          <span
                            className={`shrink-0 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                              AGENT_COLORS[s.agent]
                            }`}
                          >
                            {AGENT_LABELS[s.agent]}
                          </span>
                          {s.intent && s.intent !== "unknown" && (
                            <span
                              className={`shrink-0 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-mono ${
                                s.intent === "hot"
                                  ? "bg-red-100 text-red-600"
                                  : s.intent === "warm"
                                  ? "bg-orange-100 text-orange-600"
                                  : "bg-charcoal/5 text-charcoal/70"
                              }`}
                            >
                              {s.intent}
                            </span>
                          )}
                        </div>
                        <span className="shrink-0 text-[10px] text-charcoal/50">
                          {relativeTime(s.updated_at)}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal/60 truncate">
                        {s.trigger_type && (
                          <span className="text-charcoal/50 mr-1">[{s.trigger_type}]</span>
                        )}
                        {s.last_message ?? "No messages yet"}
                      </p>
                      {s.resolved_at && (
                        <p className="text-[10px] text-emerald-600 mt-0.5">
                          Resolved {relativeTime(s.resolved_at)}
                        </p>
                      )}
                    </div>

                    {/* Agent icon */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${AGENT_COLORS[s.agent]}`}>
                      <AgentIcon size={13} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
