/**
 * GET /api/client/sessions
 *
 * Returns recent agent sessions for the client's inbox view.
 * Protected by proxy.ts middleware.
 *
 * Query params:
 *   agent: "support" | "frontDesk" | "care" | "all" (default: "all")
 *   limit: number (default: 50)
 *   resolved: "true" | "false" | "all" (default: "all")
 */
import { NextResponse } from "next/server";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Session {
  id: string;
  client_id: string;
  visitor_name: string | null;
  visitor_phone: string | null;
  visitor_email: string | null;
  last_message?: string | null;
  intent?: string | null;
  trigger_type?: string | null;
  resolved_at: string | null;
  human_takeover?: boolean;
  created_at: string;
  updated_at: string;
}

export async function GET(req: Request): Promise<Response> {
  const clientId = req.headers.get("x-client-id");
  if (!clientId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const agentFilter = url.searchParams.get("agent") ?? "all";
  const limit = Math.min(parseInt(url.searchParams.get("limit") ?? "50", 10), 200);
  const resolvedFilter = url.searchParams.get("resolved") ?? "all";

  const baseFilter: Record<string, string> = {
    client_id: `eq.${clientId}`,
  };
  if (resolvedFilter === "false") {
    baseFilter["resolved_at"] = "is.null";
  } else if (resolvedFilter === "true") {
    baseFilter["resolved_at"] = "not.is.null";
  }

  const fetchAgent = async (
    table: string,
    agentLabel: string
  ): Promise<(Session & { agent: string })[]> => {
    try {
      const rows = await sbSelect<Session>(table, baseFilter, {
        limit,
        order: "updated_at.desc",
      });
      return rows.map((r) => ({ ...r, agent: agentLabel }));
    } catch {
      return [];
    }
  };

  let sessions: (Session & { agent: string })[] = [];

  if (agentFilter === "all" || agentFilter === "support") {
    const rows = await fetchAgent("support_sessions", "support");
    sessions = [...sessions, ...rows];
  }
  if (agentFilter === "all" || agentFilter === "frontDesk") {
    const rows = await fetchAgent("front_desk_sessions", "frontDesk");
    sessions = [...sessions, ...rows];
  }
  if (agentFilter === "all" || agentFilter === "care") {
    const rows = await fetchAgent("care_sessions", "care");
    sessions = [...sessions, ...rows];
  }

  // Sort combined results by updated_at desc
  sessions.sort(
    (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );

  return NextResponse.json({ sessions: sessions.slice(0, limit) });
}
