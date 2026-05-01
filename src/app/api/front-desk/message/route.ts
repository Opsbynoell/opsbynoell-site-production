/**
 * POST /api/front-desk/message
 *
 * The main conversation endpoint for Noell Front Desk. Accepts a
 * visitor message (from SMS webhook or chat widget), runs a Claude
 * turn via the shared runner, and returns the reply.
 *
 * Public endpoint — guarded by:
 *   - Origin allowlist for browser requests (widgets on approved hosts)
 *   - Per-IP fixed-window rate limit
 *   - Per-request message length clamp (Claude spend guard)
 */

import { NextRequest, NextResponse } from "next/server";
import { runTurn } from "@/lib/agents/runner";
import {
  clampPublicMessage,
  clientIdentity,
  isOriginAllowed,
  rateLimit,
  rateLimitResponse,
} from "@/lib/agents/request-security";
import type { AgentMessagePayload } from "@/lib/agents/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Conservative ceiling: roughly one message every couple of seconds
// from any single IP. Widgets that exceed this hit a 429 and back off.
const PER_IP_LIMIT = 30;
const PER_IP_WINDOW_MS = 60_000;

export async function POST(req: NextRequest): Promise<Response> {
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  const rl = rateLimit(
    `frontDesk:${clientIdentity(req)}`,
    PER_IP_LIMIT,
    PER_IP_WINDOW_MS
  );
  if (!rl.ok) return rateLimitResponse(rl.retryAfterMs);

  let payload: AgentMessagePayload;
  try {
    payload = (await req.json()) as AgentMessagePayload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  // Defensive: a probe with `{}` or a bad shape must not blow up the
  // route inside runTurn (which leaked `Cannot read properties of
  // undefined (reading 'name')` to unauthenticated probes). Coerce
  // `from` to an object before any downstream code reads it.
  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }
  if (!payload.clientId || !payload.message) {
    return NextResponse.json(
      { error: "clientId and message are required" },
      { status: 400 }
    );
  }
  if (!payload.from || typeof payload.from !== "object") {
    payload.from = {};
  }
  payload.message = clampPublicMessage(payload.message);
  if (!payload.message) {
    return NextResponse.json({ error: "empty message" }, { status: 400 });
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
      audit: { route: "/api/front-desk/message" },
    });
    return NextResponse.json(result);
  } catch (e) {
    // Never reflect raw error text — internal messages leak
    // implementation details (stack-shape strings, table names, etc.).
    // Log server-side; return an opaque 500.
    console.error("[front-desk/message] runTurn failed:", e);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}
