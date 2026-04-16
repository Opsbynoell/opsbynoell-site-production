/**
 * POST /api/front-desk/message
 *
 * The main conversation endpoint for Noell Front Desk. Accepts a
 * visitor message (from SMS webhook or chat widget), runs a Claude
 * turn via the shared runner, and returns the reply.
 */

import { NextResponse } from "next/server";
import { runTurn } from "@/lib/agents/runner";
import type { AgentMessagePayload } from "@/lib/agents/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  let payload: AgentMessagePayload;
  try {
    payload = (await req.json()) as AgentMessagePayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!payload.clientId || !payload.message) {
    return NextResponse.json(
      { error: "clientId and message are required" },
      { status: 400 }
    );
  }
  try {
    const result = await runTurn({
      agent: "frontDesk",
      payload: { ...payload, agent: "frontDesk" },
      tables: {
        sessions: "front_desk_sessions",
        messages: "front_desk_messages",
      },
      defaultTriggerType: payload.channel === "sms" ? "inbound_text" : "inbound_chat",
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
