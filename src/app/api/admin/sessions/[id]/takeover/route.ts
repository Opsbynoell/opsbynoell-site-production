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
  const { agent } = await req.json().catch(() => ({ agent: "support" }));

  const table =
    agent === "frontDesk"
      ? "front_desk_sessions"
      : agent === "care"
        ? "care_sessions"
        : "support_sessions";

  const sessionClientId = await fetchSessionClientId(table, id);
  if (!sessionClientId) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }
  if (!hasClientAccess(authPayload, sessionClientId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // All current tables use snake_case column names
  const patch = { human_takeover: true };

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
