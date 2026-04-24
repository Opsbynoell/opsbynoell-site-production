"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

type AgentKind = "support" | "frontDesk" | "care";
type Filter = "all" | AgentKind;

interface Session {
  id: string;
  client_id: string | null;
  agent: AgentKind;
  visitor_name: string | null;
  visitor_phone: string | null;
  visitor_email: string | null;
  last_message: string | null;
  unread_count: number;
  human_takeover: boolean;
  resolved_at: string | null;
  intent: string | null;
  trigger_type: string | null;
  created_at: string;
  updated_at: string;
}

interface MeResponse {
  authenticated: boolean;
  email?: string;
  isSuperAdmin?: boolean;
  accessibleClients?: string[];
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

export default function AdminInbox() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [me, setMe] = useState<MeResponse | null>(null);

  // Fetch current user info once on mount
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d: MeResponse) => {
        if (!d.authenticated) {
          router.replace("/admin/login");
        } else {
          setMe(d);
        }
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  const fetchSessions = useCallback(async () => {
    if (!me) return;
    try {
      const params = new URLSearchParams();
      if (filter !== "all") params.set("agent", filter);
      // Super admins can filter by client; non-super-admins are auto-scoped
      if (me.isSuperAdmin && clientFilter !== "all") {
        params.set("clientId", clientFilter);
      }
      const url = `/api/admin/sessions${params.size ? "?" + params.toString() : ""}`;
      const res = await fetch(url);
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.sessions) setSessions(data.sessions);
    } catch {
      setError("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  }, [filter, clientFilter, me, router]);

  useEffect(() => {
    if (!me) return;
    fetchSessions();
    const interval = setInterval(fetchSessions, 2000);
    return () => clearInterval(interval);
  }, [fetchSessions, me]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  const active = sessions.filter((s) => !s.resolved_at);
  const resolved = sessions.filter((s) => s.resolved_at);
  const totalUnread = sessions.reduce((sum, s) => sum + (s.unread_count ?? 0), 0);

  // Collect unique client IDs seen in current sessions (for super admin filter)
  const clientIds = me?.isSuperAdmin
    ? Array.from(new Set(sessions.map((s) => s.client_id).filter(Boolean) as string[]))
    : [];

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar */}
      <header className="bg-white border-b border-warm-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg font-semibold text-charcoal">
            Ops by Noell
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
            Admin Inbox
          </span>
          {totalUnread > 0 && (
            <span className="w-5 h-5 rounded-full bg-wine text-white text-[10px] font-bold flex items-center justify-center">
              {totalUnread > 9 ? "9+" : totalUnread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {me?.email && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal/50">{me.email}</span>
              {me.isSuperAdmin && (
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-wine/10 text-wine">
                  super admin
                </span>
              )}
              {me.isSuperAdmin && (
                <a
                  href="/admin/users"
                  className="text-xs text-charcoal/40 hover:text-charcoal transition-colors ml-1"
                >
                  Users
                </a>
              )}
              <a
                href="/admin/pci"
                className="text-xs text-charcoal/40 hover:text-charcoal transition-colors"
              >
                Intelligence
              </a>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-xs text-charcoal/50 hover:text-charcoal transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Filter tabs + client filter */}
      <div className="bg-white border-b border-warm-border px-6 flex items-center justify-between shrink-0">
        <div className="flex gap-1">
          {FILTER_TABS.map((tab) => {
            const count =
              tab.value === "all"
                ? sessions.length
                : sessions.filter((s) => s.agent === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`relative px-3 py-2.5 text-xs font-medium transition-colors ${
                  filter === tab.value
                    ? "text-wine border-b-2 border-wine -mb-px"
                    : "text-charcoal/50 hover:text-charcoal"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span className="ml-1.5 text-[10px] text-charcoal/40">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Client filter — super admin only */}
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
      </div>

      {/* Session list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-center text-sm text-red-500 py-8">{error}</p>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-charcoal/50">No conversations yet.</p>
            <p className="text-xs text-charcoal/35 mt-1">
              Sessions will appear here as visitors chat.
            </p>
          </div>
        ) : (
          <div>
            {active.length > 0 && (
              <div>
                <p className="px-6 pt-4 pb-2 text-[10px] uppercase tracking-widest font-mono text-charcoal/40">
                  Active ({active.length})
                </p>
                {active.map((s) => (
                  <SessionCard key={`${s.agent}-${s.id}`} session={s} showClient={me?.isSuperAdmin ?? false} />
                ))}
              </div>
            )}
            {resolved.length > 0 && (
              <div>
                <p className="px-6 pt-4 pb-2 text-[10px] uppercase tracking-widest font-mono text-charcoal/40">
                  Resolved ({resolved.length})
                </p>
                {resolved.map((s) => (
                  <SessionCard key={`${s.agent}-${s.id}`} session={s} showClient={me?.isSuperAdmin ?? false} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionCard({
  session: s,
  showClient,
}: {
  session: Session;
  showClient: boolean;
}) {
  const router = useRouter();
  const display =
    s.visitor_name ??
    s.visitor_phone ??
    s.visitor_email ??
    "Unknown visitor";

  return (
    <button
      onClick={() =>
        router.push(`/admin/sessions/${s.id}?agent=${s.agent}`)
      }
      className="w-full text-left px-6 py-4 border-b border-warm-border hover:bg-cream/60 transition-colors flex gap-4 items-start"
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-warm-border flex items-center justify-center text-charcoal/50 font-semibold text-sm shrink-0">
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
            {showClient && s.client_id && (
              <span className="shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-charcoal/5 text-charcoal/50">
                {s.client_id}
              </span>
            )}
            {s.human_takeover && (
              <span className="shrink-0 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                Human
              </span>
            )}
          </div>
          <span className="shrink-0 text-[10px] text-charcoal/40">
            {relativeTime(s.updated_at)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-charcoal/60 truncate">
            {s.trigger_type ? (
              <span className="text-charcoal/40 mr-1">[{s.trigger_type}]</span>
            ) : null}
            {s.last_message ?? "No messages yet"}
          </p>
          {(s.unread_count ?? 0) > 0 && (
            <span className="shrink-0 w-4 h-4 rounded-full bg-wine text-white text-[9px] font-bold flex items-center justify-center">
              {s.unread_count}
            </span>
          )}
        </div>

        {s.intent && s.intent !== "unknown" && (
          <span
            className={`inline-block mt-1 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full font-mono ${
              s.intent === "hot"
                ? "bg-red-100 text-red-600"
                : s.intent === "warm"
                  ? "bg-orange-100 text-orange-600"
                  : "bg-charcoal/5 text-charcoal/40"
            }`}
          >
            {s.intent}
          </span>
        )}
      </div>
    </button>
  );
}
