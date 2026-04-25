"use client";

/**
 * Admin: Agent Config
 *
 * Two tabs:
 *  - Prompt: edit the support / front-desk / care system prompts and the
 *    support greeting + booking URL for a single client.
 *  - Knowledge Base: list, add, edit, deactivate, and delete KB entries
 *    for that client. The agent retrieves these per-turn at runtime.
 *
 * Auth: gated by /api/admin/me. Non-super-admins are auto-scoped to a
 * single client (their first accessibleClient). Super admins get a
 * client picker.
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "prompt" | "kb";

interface MeResponse {
  authenticated: boolean;
  email?: string;
  isSuperAdmin?: boolean;
  accessibleClients?: string[];
}

interface ClientConfig {
  client_id: string;
  business_name: string;
  support_system_prompt: string | null;
  support_greeting: string | null;
  support_booking_url: string | null;
  front_desk_system_prompt: string | null;
  care_system_prompt: string | null;
  care_greeting: string | null;
}

interface KbEntry {
  id: string;
  client_id: string;
  category: "services" | "faq" | "location" | "policies" | "team";
  question: string;
  answer: string;
  keywords: string[];
  active: boolean;
  created_at: string;
  updated_at: string;
}

const KB_CATEGORIES: KbEntry["category"][] = [
  "services",
  "faq",
  "location",
  "policies",
  "team",
];

const PROMPT_FIELDS: {
  key: keyof Pick<
    ClientConfig,
    | "support_system_prompt"
    | "support_greeting"
    | "support_booking_url"
    | "front_desk_system_prompt"
    | "care_system_prompt"
    | "care_greeting"
  >;
  label: string;
  hint: string;
  rows: number;
  type?: "text" | "textarea";
}[] = [
  {
    key: "support_greeting",
    label: "Support — first message",
    hint: "The very first message visitors see when they open the chat. Keep under ~140 chars.",
    rows: 2,
  },
  {
    key: "support_booking_url",
    label: "Support — booking URL",
    hint: "Where the agent sends qualified prospects to book. Must include https://",
    rows: 1,
    type: "text",
  },
  {
    key: "support_system_prompt",
    label: "Support — system prompt",
    hint: "The personality, voice, conversion playbook, and escalation triggers. ~12k char max.",
    rows: 18,
  },
  {
    key: "front_desk_system_prompt",
    label: "Front Desk — system prompt",
    hint: "Used for SMS-triggered Front Desk conversations. Leave blank to use the agent default.",
    rows: 12,
  },
  {
    key: "care_greeting",
    label: "Care — first message",
    hint: "First text returning clients see when Care reaches out.",
    rows: 2,
  },
  {
    key: "care_system_prompt",
    label: "Care — system prompt",
    hint: "Used for returning-client rebooking and follow-up. Leave blank to use the agent default.",
    rows: 12,
  },
];

export default function AgentConfigPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [clientId, setClientId] = useState<string>("");
  const [tab, setTab] = useState<Tab>("prompt");

  // Bootstrapping
  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d: MeResponse) => {
        if (!d.authenticated) {
          router.replace("/admin/login");
          return;
        }
        setMe(d);
        // Pick a default client to edit.
        if (d.isSuperAdmin) {
          setClientId("opsbynoell");
        } else if (d.accessibleClients && d.accessibleClients.length > 0) {
          setClientId(d.accessibleClients[0]);
        }
      })
      .catch(() => router.replace("/admin/login"));
  }, [router]);

  if (!me) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Top bar — matches /admin layout */}
      <header className="bg-white border-b border-warm-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <a
            href="/admin"
            className="font-serif text-lg font-semibold text-charcoal hover:text-wine transition-colors"
          >
            Ops by Noell
          </a>
          <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
            Agent Config
          </span>
        </div>
        <div className="flex items-center gap-4">
          {me.email && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-charcoal/50">{me.email}</span>
              {me.isSuperAdmin && (
                <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-wine/10 text-wine">
                  super admin
                </span>
              )}
            </div>
          )}
          <a
            href="/admin"
            className="text-xs text-charcoal/40 hover:text-charcoal transition-colors"
          >
            Inbox
          </a>
          <a
            href="/admin/pci"
            className="text-xs text-charcoal/40 hover:text-charcoal transition-colors"
          >
            Intelligence
          </a>
        </div>
      </header>

      {/* Tabs + client picker */}
      <div className="bg-white border-b border-warm-border px-6 flex items-center justify-between shrink-0">
        <div className="flex gap-1">
          <TabButton active={tab === "prompt"} onClick={() => setTab("prompt")}>
            Prompt
          </TabButton>
          <TabButton active={tab === "kb"} onClick={() => setTab("kb")}>
            Knowledge Base
          </TabButton>
        </div>

        {me.isSuperAdmin ? (
          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value.trim())}
            placeholder="client_id (e.g. opsbynoell)"
            className="text-xs bg-cream border border-warm-border rounded-lg px-2 py-1.5 text-charcoal focus:outline-none focus:border-wine/50 w-48"
          />
        ) : (
          <span className="text-xs text-charcoal/50">
            Editing: <span className="font-mono">{clientId}</span>
          </span>
        )}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto bg-[#f8f4f0]">
        {!clientId ? (
          <div className="text-center py-16">
            <p className="text-sm text-charcoal/50">
              Enter a client_id above to start editing.
            </p>
          </div>
        ) : tab === "prompt" ? (
          <PromptTab clientId={clientId} />
        ) : (
          <KbTab clientId={clientId} />
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-3 py-2.5 text-xs font-medium transition-colors ${
        active
          ? "text-wine border-b-2 border-wine -mb-px"
          : "text-charcoal/50 hover:text-charcoal"
      }`}
    >
      {children}
    </button>
  );
}

// ===================================================================
// Prompt tab
// ===================================================================

function PromptTab({ clientId }: { clientId: string }) {
  const [config, setConfig] = useState<ClientConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [dirty, setDirty] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/agent-config?clientId=${encodeURIComponent(clientId)}`
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? `HTTP ${res.status}`);
        setConfig(null);
        return;
      }
      const data = await res.json();
      setConfig(data.client);
      setDirty({});
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    void load();
  }, [load]);

  const merged: Record<string, string> = useMemo(() => {
    const out: Record<string, string> = {
      support_system_prompt: "",
      support_greeting: "",
      support_booking_url: "",
      front_desk_system_prompt: "",
      care_system_prompt: "",
      care_greeting: "",
    };
    if (!config) return out;
    out.support_system_prompt =
      dirty.support_system_prompt ?? config.support_system_prompt ?? "";
    out.support_greeting = dirty.support_greeting ?? config.support_greeting ?? "";
    out.support_booking_url =
      dirty.support_booking_url ?? config.support_booking_url ?? "";
    out.front_desk_system_prompt =
      dirty.front_desk_system_prompt ?? config.front_desk_system_prompt ?? "";
    out.care_system_prompt =
      dirty.care_system_prompt ?? config.care_system_prompt ?? "";
    out.care_greeting = dirty.care_greeting ?? config.care_greeting ?? "";
    return out;
  }, [config, dirty]);

  const hasChanges = Object.keys(dirty).length > 0;

  async function handleSave() {
    if (!hasChanges) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/agent-config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, ...dirty }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? `HTTP ${res.status}`);
        return;
      }
      setSavedAt(Date.now());
      await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }
  if (error && !config) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <p className="text-sm text-red-600">Could not load client: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
      {config && (
        <p className="text-xs text-charcoal/50">
          Editing <span className="font-mono">{config.client_id}</span> ·{" "}
          {config.business_name}
        </p>
      )}

      {PROMPT_FIELDS.map((f) => (
        <div key={f.key} className="bg-white border border-warm-border rounded-xl p-5">
          <label className="block text-sm font-medium text-charcoal mb-1">
            {f.label}
          </label>
          <p className="text-[11px] text-charcoal/50 mb-3">{f.hint}</p>
          {f.type === "text" ? (
            <input
              value={merged[f.key]}
              onChange={(e) =>
                setDirty((d) => ({ ...d, [f.key]: e.target.value }))
              }
              className="w-full text-sm font-mono bg-cream border border-warm-border rounded-lg px-3 py-2 text-charcoal focus:outline-none focus:border-wine/50"
            />
          ) : (
            <textarea
              value={merged[f.key]}
              onChange={(e) =>
                setDirty((d) => ({ ...d, [f.key]: e.target.value }))
              }
              rows={f.rows}
              className="w-full text-sm font-mono bg-cream border border-warm-border rounded-lg px-3 py-2 text-charcoal focus:outline-none focus:border-wine/50 resize-y"
            />
          )}
          <div className="flex justify-between items-center mt-2">
            <span className="text-[10px] text-charcoal/40">
              {merged[f.key].length} chars
            </span>
            {dirty[f.key] !== undefined && (
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-700">
                unsaved
              </span>
            )}
          </div>
        </div>
      ))}

      {/* Sticky save bar */}
      <div className="sticky bottom-0 -mx-6 px-6 py-4 bg-cream border-t border-warm-border flex items-center justify-between">
        <div className="text-xs">
          {error && <span className="text-red-600">{error}</span>}
          {!error && savedAt && (
            <span className="text-emerald-700">
              Saved {new Date(savedAt).toLocaleTimeString()}
            </span>
          )}
          {!error && !savedAt && hasChanges && (
            <span className="text-amber-700">
              {Object.keys(dirty).length} unsaved change
              {Object.keys(dirty).length === 1 ? "" : "s"}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setDirty({});
              setSavedAt(null);
            }}
            disabled={!hasChanges || saving}
            className="px-3 py-2 text-xs font-medium text-charcoal/60 hover:text-charcoal disabled:opacity-40"
          >
            Discard
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className="px-4 py-2 text-xs font-medium bg-wine text-white rounded-lg hover:bg-wine/90 disabled:opacity-40 transition-colors"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// Knowledge Base tab
// ===================================================================

function KbTab({ clientId }: { clientId: string }) {
  const [entries, setEntries] = useState<KbEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<KbEntry | null>(null); // null = list mode
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/admin/knowledge?clientId=${encodeURIComponent(clientId)}`
      );
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? `HTTP ${res.status}`);
        return;
      }
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this entry? This can't be undone.")) return;
    const res = await fetch(`/api/admin/knowledge/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(`Delete failed: ${j.error ?? res.status}`);
      return;
    }
    await load();
  }

  async function handleToggleActive(entry: KbEntry) {
    const res = await fetch(`/api/admin/knowledge/${entry.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !entry.active }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      alert(`Update failed: ${j.error ?? res.status}`);
      return;
    }
    await load();
  }

  if (editing || creating) {
    return (
      <KbEditor
        clientId={clientId}
        entry={editing}
        onCancel={() => {
          setEditing(null);
          setCreating(false);
        }}
        onSaved={async () => {
          setEditing(null);
          setCreating(false);
          await load();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="w-5 h-5 border-2 border-wine/30 border-t-wine rounded-full animate-spin" />
      </div>
    );
  }

  // Group by category for the list view
  const grouped: Record<string, KbEntry[]> = {};
  for (const e of entries) {
    if (!grouped[e.category]) grouped[e.category] = [];
    grouped[e.category].push(e);
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-base font-semibold text-charcoal">Knowledge Base</h1>
          <p className="text-xs text-charcoal/50 mt-1">
            {entries.length} entries · injected into the agent at runtime when
            the visitor&apos;s message matches the keywords or content.
          </p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="px-4 py-2 text-xs font-medium bg-wine text-white rounded-lg hover:bg-wine/90 transition-colors"
        >
          + Add entry
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">{error}</p>
      )}

      {entries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-warm-border">
          <p className="text-sm text-charcoal/50">No entries yet.</p>
          <p className="text-xs text-charcoal/35 mt-1">
            Add the first one to start grounding the agent.
          </p>
        </div>
      ) : (
        KB_CATEGORIES.filter((c) => grouped[c]?.length).map((cat) => (
          <div key={cat} className="mb-6">
            <h2 className="text-[10px] uppercase tracking-widest font-mono text-charcoal/40 mb-2">
              {cat} ({grouped[cat].length})
            </h2>
            <div className="space-y-2">
              {grouped[cat].map((e) => (
                <div
                  key={e.id}
                  className={`bg-white border rounded-xl p-4 ${
                    e.active ? "border-warm-border" : "border-warm-border opacity-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal">
                        {e.question}
                      </p>
                      <p className="text-xs text-charcoal/60 mt-1 line-clamp-2">
                        {e.answer}
                      </p>
                      {e.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {e.keywords.map((k) => (
                            <span
                              key={k}
                              className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-charcoal/5 text-charcoal/50"
                            >
                              {k}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        onClick={() => setEditing(e)}
                        className="text-[11px] text-charcoal/60 hover:text-wine"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleActive(e)}
                        className="text-[11px] text-charcoal/60 hover:text-wine"
                      >
                        {e.active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => handleDelete(e.id)}
                        className="text-[11px] text-red-600/70 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

function KbEditor({
  clientId,
  entry,
  onCancel,
  onSaved,
}: {
  clientId: string;
  entry: KbEntry | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [category, setCategory] = useState<KbEntry["category"]>(
    entry?.category ?? "faq"
  );
  const [question, setQuestion] = useState(entry?.question ?? "");
  const [answer, setAnswer] = useState(entry?.answer ?? "");
  const [keywordsRaw, setKeywordsRaw] = useState(
    (entry?.keywords ?? []).join(", ")
  );
  const [active, setActive] = useState(entry?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const keywords = keywordsRaw
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    const body = { clientId, category, question, answer, keywords, active };
    const url = entry
      ? `/api/admin/knowledge/${entry.id}`
      : "/api/admin/knowledge";
    const method = entry ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j.error ?? `HTTP ${res.status}`);
        return;
      }
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto px-6 py-8 space-y-5"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold text-charcoal">
          {entry ? "Edit entry" : "New entry"}
        </h1>
        <button
          type="button"
          onClick={onCancel}
          className="text-xs text-charcoal/60 hover:text-charcoal"
        >
          Cancel
        </button>
      </div>

      <div className="bg-white border border-warm-border rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value as KbEntry["category"])
            }
            className="w-full text-sm bg-cream border border-warm-border rounded-lg px-3 py-2 text-charcoal focus:outline-none focus:border-wine/50"
          >
            {KB_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">
            Question
          </label>
          <p className="text-[11px] text-charcoal/50 mb-1.5">
            What might a visitor ask that should pull this entry?
          </p>
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
            maxLength={500}
            className="w-full text-sm bg-cream border border-warm-border rounded-lg px-3 py-2 text-charcoal focus:outline-none focus:border-wine/50"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">
            Answer
          </label>
          <p className="text-[11px] text-charcoal/50 mb-1.5">
            What the agent should know. Plain text. The agent will rephrase in
            its own voice — don&apos;t worry about exact wording.
          </p>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
            rows={6}
            maxLength={4000}
            className="w-full text-sm bg-cream border border-warm-border rounded-lg px-3 py-2 text-charcoal focus:outline-none focus:border-wine/50 resize-y"
          />
          <span className="text-[10px] text-charcoal/40">
            {answer.length} / 4000
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-charcoal mb-1">
            Keywords
          </label>
          <p className="text-[11px] text-charcoal/50 mb-1.5">
            Comma-separated, lowercase. Used for retrieval. 3–6 is plenty.
          </p>
          <input
            value={keywordsRaw}
            onChange={(e) => setKeywordsRaw(e.target.value)}
            placeholder="pricing, cost, monthly, fee"
            className="w-full text-sm font-mono bg-cream border border-warm-border rounded-lg px-3 py-2 text-charcoal focus:outline-none focus:border-wine/50"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-charcoal cursor-pointer">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="rounded border-warm-border"
          />
          Active (visible to the agent)
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-medium text-charcoal/60 hover:text-charcoal"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || !question.trim() || !answer.trim()}
          className="px-4 py-2 text-xs font-medium bg-wine text-white rounded-lg hover:bg-wine/90 disabled:opacity-40 transition-colors"
        >
          {saving ? "Saving..." : entry ? "Save changes" : "Create entry"}
        </button>
      </div>
    </form>
  );
}
