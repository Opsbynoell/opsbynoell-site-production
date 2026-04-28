"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type AgentKind = "support" | "frontDesk" | "care";

interface Message {
  id: string;
  session_id: string;
  role: "user" | "assistant" | "human" | "system";
  content: string;
  created_at: string;
  /** Optional author label — set to "Nikki (human)" for SMS-bridged replies. */
  author?: string | null;
}

interface Session {
  id: string;
  agent: AgentKind;
  visitor_name: string | null;
  visitor_phone: string | null;
  visitor_email: string | null;
  human_takeover: boolean;
  resolved_at: string | null;
  intent: string | null;
  trigger_type: string | null;
  created_at: string;
  updated_at: string;
}

interface Appointment {
  id: string;
  service: string | null;
  scheduled_at: string | null;
  status: string | null;
  notes: string | null;
}

interface Contact {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  last_visit_at: string | null;
  visit_count: number | null;
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

function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function formatDate(ts: string): string {
  const d = new Date(ts);
  const today = new Date();
  if (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function SessionDetailInner({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agent = (searchParams.get("agent") ?? "support") as AgentKind;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [takingOver, setTakingOver] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Resolve params
  useEffect(() => {
    params.then((p) => setSessionId(p.id));
  }, [params]);

  const fetchSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      const res = await fetch(
        `/api/admin/sessions/${sessionId}?agent=${agent}`
      );
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) {
        setError("Failed to load session");
        return;
      }
      const data = await res.json();
      if (data.session) setSession(data.session);
      if (data.messages) setMessages(data.messages);
      if (data.appointment) setAppointment(data.appointment);
      if (data.contact) setContact(data.contact);
    } catch {
      setError("Connection error");
    } finally {
      setLoading(false);
    }
  }, [sessionId, agent, router]);

  useEffect(() => {
    if (!sessionId) return;
    fetchSession();
    const interval = setInterval(fetchSession, 2000);
    return () => clearInterval(interval);
  }, [fetchSession, sessionId]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function handleTakeover() {
    if (!sessionId || takingOver) return;
    setTakingOver(true);
    try {
      await fetch(`/api/admin/sessions/${sessionId}/takeover`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent }),
      });
      await fetchSession();
    } finally {
      setTakingOver(false);
    }
  }

  async function handleSend() {
    const content = input.trim();
    if (!content || !sessionId || sending) return;
    setSending(true);
    setInput("");
    try {
      await fetch(`/api/admin/sessions/${sessionId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, agent }),
      });
      await fetchSession();
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const display =
    session?.visitor_name ??
    session?.visitor_phone ??
    session?.visitor_email ??
    "Unknown visitor";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f8f4f0]">
        <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#f8f4f0] gap-4">
        <p className="text-sm text-red-500">{error || "Session not found"}</p>
        <button
          onClick={() => router.push("/admin")}
          className="text-xs text-charcoal/70 hover:text-charcoal"
        >
          Back to inbox
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8f4f0]">
      {/* Main chat column */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-warm-border px-4 py-3 flex items-center gap-3 shrink-0">
          <button
            onClick={() => router.push("/admin")}
            className="text-charcoal/70 hover:text-charcoal transition-colors p-1 -ml-1"
            aria-label="Back"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 12L6 8l4-4" />
            </svg>
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-warm-border flex items-center justify-center text-charcoal/70 font-semibold text-xs shrink-0">
            {(display[0] ?? "?").toUpperCase()}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-charcoal truncate">
                {display}
              </span>
              <span
                className={`shrink-0 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${AGENT_COLORS[agent]}`}
              >
                {AGENT_LABELS[agent]}
              </span>
              {session.human_takeover && (
                <span className="shrink-0 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  Human
                </span>
              )}
              {session.intent && session.intent !== "unknown" && (
                <span
                  className={`shrink-0 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                    session.intent === "hot"
                      ? "bg-red-100 text-red-600"
                      : session.intent === "warm"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-charcoal/5 text-charcoal/70"
                  }`}
                >
                  {session.intent}
                </span>
              )}
            </div>
            <p className="text-[10px] text-charcoal/70">
              Started {formatDate(session.created_at)} at{" "}
              {formatTime(session.created_at)}
            </p>
          </div>

          {/* Take over button */}
          {!session.human_takeover && !session.resolved_at && (
            <button
              onClick={handleTakeover}
              disabled={takingOver}
              className="shrink-0 h-8 px-3 rounded-lg bg-wine text-cream text-xs font-medium hover:bg-wine/90 disabled:opacity-50 transition-colors"
            >
              {takingOver ? "Taking over..." : "Take over"}
            </button>
          )}
        </header>

        {/* Message thread */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-sm text-charcoal/70">No messages yet.</p>
            </div>
          ) : (
            <>
              {messages.map((msg, i) => {
                const isUser = msg.role === "user";
                const isHuman = msg.role === "human";
                const isBot = msg.role === "assistant";
                const showDate =
                  i === 0 ||
                  formatDate(messages[i - 1].created_at) !==
                    formatDate(msg.created_at);

                return (
                  <div key={msg.id ?? i}>
                    {showDate && (
                      <div className="flex items-center justify-center py-3">
                        <span className="text-[10px] text-charcoal/65 font-mono uppercase tracking-wider">
                          {formatDate(msg.created_at)}
                        </span>
                      </div>
                    )}
                    <div
                      className={`flex ${isUser ? "justify-start" : "justify-end"} mb-1`}
                    >
                      <div
                        className={`max-w-[72%] group flex flex-col ${isUser ? "items-start" : "items-end"}`}
                      >
                        {isHuman && (
                          <span className="text-[9px] font-mono uppercase tracking-wider text-charcoal/70 mb-0.5 px-1">
                            {msg.author ?? "You"}
                          </span>
                        )}
                        {isBot && (
                          <span className="text-[9px] font-mono uppercase tracking-wider text-charcoal/70 mb-0.5 px-1">
                            {AGENT_LABELS[agent]}
                          </span>
                        )}
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                            isUser
                              ? "bg-white text-charcoal rounded-tl-sm border border-warm-border"
                              : isHuman
                                ? "bg-charcoal text-white rounded-tr-sm"
                                : "bg-[#7C5CFC]/10 text-[#3D2430] rounded-tr-sm"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <span className="text-[9px] text-charcoal/70 mt-0.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input bar */}
        {!session.resolved_at && (
          <div className="bg-white border-t border-warm-border px-4 py-3 shrink-0">
            {!session.human_takeover && (
              <p className="text-[10px] text-charcoal/70 mb-2 font-mono">
                Sending a message will take over this conversation from the AI.
              </p>
            )}
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Enter to send, Shift+Enter for newline)"
                rows={1}
                className="flex-1 resize-none px-3.5 py-2.5 text-sm bg-cream rounded-xl border border-warm-border focus:outline-none focus:border-wine/50 text-charcoal placeholder:text-charcoal/65 max-h-32 overflow-y-auto"
                style={{ minHeight: "40px" }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="shrink-0 w-10 h-10 rounded-xl bg-wine text-cream flex items-center justify-center hover:bg-wine/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Send"
              >
                {sending ? (
                  <div className="w-3.5 h-3.5 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                ) : (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 7L2 2l2.5 5L2 12l10-5z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {session.resolved_at && (
          <div className="bg-white border-t border-warm-border px-4 py-3 shrink-0">
            <p className="text-xs text-center text-charcoal/70">
              This conversation was resolved on{" "}
              {formatDate(session.resolved_at)} at{" "}
              {formatTime(session.resolved_at)}.
            </p>
          </div>
        )}
      </div>

      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-white border-l border-warm-border overflow-y-auto flex flex-col">
        {/* Visitor info */}
        <div className="p-4 border-b border-warm-border">
          <p className="text-[10px] uppercase tracking-widest font-mono text-charcoal/70 mb-3">
            Visitor
          </p>
          <div className="space-y-2">
            {session.visitor_name && (
              <SidebarRow label="Name" value={session.visitor_name} />
            )}
            {session.visitor_phone && (
              <SidebarRow label="Phone" value={session.visitor_phone} />
            )}
            {session.visitor_email && (
              <SidebarRow label="Email" value={session.visitor_email} />
            )}
            {session.trigger_type && (
              <SidebarRow label="Trigger" value={session.trigger_type} />
            )}
          </div>
        </div>

        {/* Appointment details (Front Desk) */}
        {agent === "frontDesk" && appointment && (
          <div className="p-4 border-b border-warm-border">
            <p className="text-[10px] uppercase tracking-widest font-mono text-charcoal/70 mb-3">
              Appointment
            </p>
            <div className="space-y-2">
              {appointment.service && (
                <SidebarRow label="Service" value={appointment.service} />
              )}
              {appointment.scheduled_at && (
                <SidebarRow
                  label="Scheduled"
                  value={`${formatDate(appointment.scheduled_at)} at ${formatTime(appointment.scheduled_at)}`}
                />
              )}
              {appointment.status && (
                <SidebarRow label="Status" value={appointment.status} />
              )}
              {appointment.notes && (
                <SidebarRow label="Notes" value={appointment.notes} />
              )}
            </div>
          </div>
        )}

        {/* Contact details (Care) */}
        {agent === "care" && contact && (
          <div className="p-4 border-b border-warm-border">
            <p className="text-[10px] uppercase tracking-widest font-mono text-charcoal/70 mb-3">
              Client
            </p>
            <div className="space-y-2">
              {contact.name && (
                <SidebarRow label="Name" value={contact.name} />
              )}
              {contact.phone && (
                <SidebarRow label="Phone" value={contact.phone} />
              )}
              {contact.email && (
                <SidebarRow label="Email" value={contact.email} />
              )}
              {contact.last_visit_at && (
                <SidebarRow
                  label="Last visit"
                  value={formatDate(contact.last_visit_at)}
                />
              )}
              {contact.visit_count !== null &&
                contact.visit_count !== undefined && (
                  <SidebarRow
                    label="Total visits"
                    value={String(contact.visit_count)}
                  />
                )}
            </div>
          </div>
        )}

        {/* Session metadata */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-widest font-mono text-charcoal/70 mb-3">
            Session
          </p>
          <div className="space-y-2">
            <SidebarRow label="Agent" value={AGENT_LABELS[agent]} />
            <SidebarRow
              label="Status"
              value={
                session.resolved_at
                  ? "Resolved"
                  : session.human_takeover
                    ? "Human active"
                    : "AI active"
              }
            />
            {session.intent && session.intent !== "unknown" && (
              <SidebarRow label="Intent" value={session.intent} />
            )}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default function SessionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-[#f8f4f0]">
          <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
        </div>
      }
    >
      <SessionDetailInner params={params} />
    </Suspense>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-mono uppercase tracking-wider text-charcoal/65">
        {label}
      </span>
      <span className="text-xs text-charcoal/70 break-words">{value}</span>
    </div>
  );
}
