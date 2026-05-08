import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/agents/env";
import {
  hasClientAccess,
  readAdminHeaders,
} from "@/lib/agents/request-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

async function fetchSessionClientId(
  table: string,
  id: string
): Promise<string | null> {
  const res = await fetch(
    `${restUrl(table)}?id=eq.${id}&select=client_id,clientId`,
    { headers: supabaseHeaders(), cache: "no-store" }
  );
  if (!res.ok) return null;
  const rows = (await res.json()) as Array<Record<string, unknown>>;
  if (!rows.length) return null;
  return (rows[0].client_id ?? rows[0].clientId ?? null) as string | null;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const authPayload = readAdminHeaders(req);
  if (!authPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { content, agent } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ error: "content required" }, { status: 400 });
  }

  const messagesTable =
    agent === "frontDesk"
      ? "front_desk_messages"
      : agent === "care"
        ? "care_messages"
        : "support_messages";

  const sessionTable =
    agent === "frontDesk"
      ? "front_desk_sessions"
      : agent === "care"
        ? "care_sessions"
        : "support_sessions";

  const sessionClientId = await fetchSessionClientId(sessionTable, id);
  if (!sessionClientId) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (!hasClientAccess(authPayload, sessionClientId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // All current tables use snake_case column names
  const messageRow = { session_id: id, role: "human", content };
  const sessionPatch = { human_takeover: true, updated_at: new Date().toISOString() };

  const [msgRes] = await Promise.all([
    fetch(restUrl(messagesTable), {
      method: "POST",
      headers: { ...supabaseHeaders(), Prefer: "return=representation" },
      body: JSON.stringify(messageRow),
    }),
    fetch(`${restUrl(sessionTable)}?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
      body: JSON.stringify(sessionPatch),
    }),
  ]);

  if (!msgRes.ok) {
    return NextResponse.json(
      { error: `Insert failed: ${msgRes.status}` },
      { status: 500 }
    );
  }

  const rows = await msgRes.json();
  return NextResponse.json({ message: rows[0] ?? null });
}
