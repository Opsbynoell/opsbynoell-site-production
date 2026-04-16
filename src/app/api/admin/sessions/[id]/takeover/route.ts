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
  // Access check is handled at the session detail level; takeover trusts the caller.

  const { id } = await params;
  const { agent } = await req.json().catch(() => ({ agent: "support" }));

  const table =
    agent === "frontDesk"
      ? "front_desk_sessions"
      : agent === "care"
        ? "care_sessions"
        : "chatSessions";

  const patch =
    table === "chatSessions"
      ? { humanTakeover: true }
      : { human_takeover: true };

  const res = await fetch(`${restUrl(table)}?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Failed to set takeover: ${res.status}` },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
