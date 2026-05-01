/**
 * POST /api/support/message
 *
 * Conversation endpoint for Noell Support (new prospects on the
 * website). Before the runner fires, we:
 *   1. Look up the sender in `client_contacts` so the agent can greet
 *      them by name if they've come back.
 *   2. Query the knowledge base for relevant entries based on the
 *      visitor's message and pass them in as runtime context.
 *
 * The runner then takes over — same Claude turn logic as Care and
 * Front Desk, just a different system prompt (loaded from
 * agents/support/) and a different table pair.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  formatKnowledgeContext,
  queryKnowledgeBase,
} from "@/lib/agents/knowledge-base";
import {
  clientIdentity,
  invalidRequestResponse,
  isOriginAllowed,
  rateLimit,
  rateLimitResponse,
  validatePublicMessagePayload,
} from "@/lib/agents/request-security";
import { runTurn } from "@/lib/agents/runner";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PER_IP_LIMIT = 30;
const PER_IP_WINDOW_MS = 60_000;

interface ContactRow {
  id: string;
  name: string | null;
  phone: string | null;
  email: string | null;
  last_visit_at: string | null;
  visit_count: number;
  preferred_service: string | null;
  vip: boolean;
  notes: string | null;
}

async function lookupContact(
  clientId: string,
  phone?: string,
  email?: string
): Promise<ContactRow | null> {
  if (phone) {
    const rows = await sbSelect<ContactRow>(
      "client_contacts",
      { client_id: `eq.${clientId}`, phone: `eq.${phone}` },
      { limit: 1 }
    );
    if (rows.length > 0) return rows[0];
  }
  if (email) {
    const rows = await sbSelect<ContactRow>(
      "client_contacts",
      { client_id: `eq.${clientId}`, email: `eq.${email}` },
      { limit: 1 }
    );
    if (rows.length > 0) return rows[0];
  }
  return null;
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ error: "Forbidden origin" }, { status: 403 });
  }

  const rl = rateLimit(
    `support:${clientIdentity(req)}`,
    PER_IP_LIMIT,
    PER_IP_WINDOW_MS
  );
  if (!rl.ok) return rateLimitResponse(rl.retryAfterMs);

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return invalidRequestResponse();
  }
  // Single fail-closed gate. Anything malformed (missing clientId,
  // missing/empty message, bogus channel, bad `from` shape) returns an
  // opaque 400 BEFORE contact lookup, knowledge-base query, runTurn, DB
  // writes, model calls, or fanout. Legitimate widget POSTs are
  // unaffected.
  const validated = validatePublicMessagePayload(raw);
  if (!validated.ok) return invalidRequestResponse();
  const payload = validated.payload;

  try {
    const contact = await lookupContact(
      payload.clientId,
      payload.from.phone,
      payload.from.email
    );
    const kbHits = await queryKnowledgeBase(payload.clientId, payload.message);

    const runtimeContext = [
      contact
        ? `Recognized contact: ${contact.name ?? "(no name on file)"}` +
          (contact.last_visit_at
            ? ` · last visit ${contact.last_visit_at}`
            : "") +
          (contact.visit_count
            ? ` · ${contact.visit_count} visits total`
            : "") +
          (contact.preferred_service
            ? ` · usual service: ${contact.preferred_service}`
            : "") +
          (contact.vip ? " · VIP" : "") +
          (contact.notes ? ` · notes: ${contact.notes}` : "")
        : "Contact is not recognized in `client_contacts`. Treat as a new prospect.",
      formatKnowledgeContext(kbHits),
    ].join("\n\n");

    const result = await runTurn({
      agent: "support",
      payload: { ...payload, agent: "support" },
      tables: { sessions: "support_sessions", messages: "support_messages" },
      defaultTriggerType:
        payload.channel === "sms" ? "sms" : "website_chat",
      runtimeContext,
      audit: {
        route: "/api/support/message",
        extra: { kbHits: kbHits.length },
      },
    });
    return NextResponse.json({ ...result, recognizedContactId: contact?.id ?? null });
  } catch (e) {
    // Never reflect raw error text to unauthenticated callers.
    console.error("[support/message] handler failed:", e);
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500 }
    );
  }
}
