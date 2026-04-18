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

import { NextResponse } from "next/server";
import {
  formatKnowledgeContext,
  queryKnowledgeBase,
} from "@/lib/agents/knowledge-base";
import { runTurn } from "@/lib/agents/runner";
import { sbSelect } from "@/lib/agents/supabase";
import type { AgentMessagePayload } from "@/lib/agents/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

  try {
    const result = await runTurn({
      agent: "support",
      payload: { ...payload, agent: "support" },
      tables: { sessions: "support_sessions", messages: "support_messages" },
      defaultTriggerType:
        payload.channel === "sms" ? "sms" : "website_chat",
      runtimeContext,
    });
    return NextResponse.json({ ...result, recognizedContactId: contact?.id ?? null });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
