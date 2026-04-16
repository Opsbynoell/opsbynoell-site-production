import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";
import { env } from "@/lib/agents/env";

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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!(await verifyToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Access check is handled at the session detail level; message trusts the caller.

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
        : "chatMessages";

  const sessionTable =
    agent === "frontDesk"
      ? "front_desk_sessions"
      : agent === "care"
        ? "care_sessions"
        : "chatSessions";

  const messageRow =
    messagesTable === "chatMessages"
      ? { sessionId: id, role: "human", content }
      : { session_id: id, role: "human", content };

  const sessionPatch =
    sessionTable === "chatSessions"
      ? { humanTakeover: true, updatedAt: new Date().toISOString() }
      : { human_takeover: true, updated_at: new Date().toISOString() };

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
