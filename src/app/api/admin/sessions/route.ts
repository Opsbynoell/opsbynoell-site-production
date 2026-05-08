/**
 * GET /api/admin/sessions
 *
 * Returns sessions from all four agents in a unified format,
 * sorted by last activity descending. Caller can pass ?agent=support|frontDesk|care
 * to filter, and ?clientId=<id> to filter by client (super admin only; non-super
 * admins are automatically scoped to their accessible clients).
 *
 * The legacy Noell Support agent uses camelCase column names (chatSessions).
 * The new Support agent uses snake_case (support_sessions) — this is where the
 * 57 warm lead sessions live.
 * Front Desk and Care use snake_case (new agent schema).
 * This route normalizes everything to snake_case.
 *
 * FIX (GTM item 6): Added support_sessions + support_messages to the query so
 * the 57 warm leads that were invisible in the admin inbox are now visible.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";
import { env } from "@/lib/agents/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type AgentFilter = "all" | "support" | "frontDesk" | "care" | "supportNew";

interface NormalizedSession {
  id: string;
  client_id: string | null;
  agent: "support" | "frontDesk" | "care";
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

function supabaseHeaders() {
  const key = env.supabaseServiceKey();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

function restUrl(path: string) {
  return `${env.supabaseUrl()}/rest/v1/${path}`;
}

async function fetchSessions(
  table: string,
  agent: "support" | "frontDesk" | "care",
  messagesTable: string,
  clientIds: string[] | null // null = no filter (super admin)
): Promise<NormalizedSession[]> {
  // Build client_id filter for snake_case tables
  let clientFilter = "";
  if (clientIds !== null && clientIds.length > 0) {
    const ids = clientIds.map(encodeURIComponent).join(",");
    // snake_case tables use client_id; camelCase legacy uses clientId
    const col = table === "chatSessions" ? "clientId" : "client_id";
    clientFilter = `&${col}=in.(${ids})`;
  } else if (clientIds !== null && clientIds.length === 0) {
    // No accessible clients — return empty
    return [];
  }

  const sessRes = await fetch(
    `${restUrl(table)}?select=*&order=updated_at.desc,updatedAt.desc&limit=200${clientFilter}`,
    { headers: supabaseHeaders(), cache: "no-store" }
  );
  if (!sessRes.ok) return [];
  const sessions = (await sessRes.json()) as Record<string, unknown>[];
  if (!sessions.length) return [];

  // Fetch latest message per session
  const msgRes = await fetch(
    `${restUrl(messagesTable)}?select=session_id,sessionId,content,role,created_at,createdAt&order=created_at.desc,createdAt.desc&limit=400`,
    { headers: supabaseHeaders(), cache: "no-store" }
  );
  const allMessages = msgRes.ok
    ? ((await msgRes.json()) as Record<string, unknown>[])
    : [];

  const lastMsg: Record<string, string> = {};
  for (const m of allMessages) {
    const sid = (m.session_id ?? m.sessionId) as string;
    if (!lastMsg[sid] && (m.role === "visitor" || m.role === "bot")) {
      lastMsg[sid] = m.content as string;
    }
  }

  return sessions.map((s) => ({
    id: s.id as string,
    client_id:
      ((s.client_id ?? s.clientId) as string | null) ?? null,
    agent,
    visitor_name: ((s.visitor_name ?? s.visitorName) as string) ?? null,
    visitor_phone: ((s.visitor_phone ?? s.visitorPhone) as string) ?? null,
    visitor_email: ((s.visitor_email ?? s.visitorEmail) as string) ?? null,
    last_message: lastMsg[s.id as string] ?? null,
    unread_count: ((s.unread_count ?? s.unreadCount) as number) ?? 0,
    human_takeover:
      ((s.human_takeover ?? s.humanTakeover) as boolean) ?? false,
    resolved_at: ((s.resolved_at ?? s.resolvedAt) as string) ?? null,
    intent: (s.intent as string) ?? null,
    trigger_type: (s.trigger_type as string) ?? null,
    created_at:
      ((s.created_at ?? s.createdAt) as string) ?? new Date().toISOString(),
    updated_at:
      ((s.updated_at ?? s.updatedAt) as string) ?? new Date().toISOString(),
  }));
}

export async function GET(req: NextRequest): Promise<Response> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const filter = (req.nextUrl.searchParams.get("agent") ?? "all") as AgentFilter;
  const clientIdParam = req.nextUrl.searchParams.get("clientId");

  // Determine client filter:
  // - Super admin with no ?clientId filter → see everything (null = no filter)
  // - Super admin with ?clientId → filter to that single client
  // - Non-super-admin → always scoped to their accessibleClients
  let clientFilter: string[] | null;
  if (payload.isSuperAdmin) {
    clientFilter = clientIdParam ? [clientIdParam] : null;
  } else {
    clientFilter = payload.accessibleClients;
  }

  // Non-super-admins don't see legacy Noell Support (chatSessions) — those are internal
  const showLegacySupport =
    (filter === "all" || filter === "support") && payload.isSuperAdmin;

  // support_sessions (new schema) — visible to all admins, scoped by client
  const showNewSupport = filter === "all" || filter === "support";

  try {
    const [legacySupport, newSupport, frontDesk, care] = await Promise.all([
      showLegacySupport
        ? fetchSessions("chatSessions", "support", "chatMessages", null)
        : Promise.resolve([]),
      showNewSupport
        ? fetchSessions("support_sessions", "support", "support_messages", clientFilter)
        : Promise.resolve([]),
      filter === "all" || filter === "frontDesk"
        ? fetchSessions("front_desk_sessions", "frontDesk", "front_desk_messages", clientFilter)
        : Promise.resolve([]),
      filter === "all" || filter === "care"
        ? fetchSessions("care_sessions", "care", "care_messages", clientFilter)
        : Promise.resolve([]),
    ]);

    // Deduplicate by id in case a session appears in both legacy and new tables
    const seen = new Set<string>();
    const all = [...legacySupport, ...newSupport, ...frontDesk, ...care]
      .filter((s) => {
        if (seen.has(s.id)) return false;
        seen.add(s.id);
        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

    return NextResponse.json({ sessions: all });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
