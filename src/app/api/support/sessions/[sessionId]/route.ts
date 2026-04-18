/**
 * GET /api/support/sessions/:sessionId
 *
 * Operator-view helper. Returns a single Support session plus its
 * message history and any recognized contact record.
 */

import { NextResponse } from "next/server";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<Response> {
  const { sessionId } = await params;
  const sessionRows = await sbSelect(
    "support_sessions",
    { id: `eq.${sessionId}` },
    { limit: 1 }
  );
  if (sessionRows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const session = sessionRows[0] as {
    id: string;
    contact_id: string | null;
  };
  const messages = await sbSelect(
    "support_messages",
    { session_id: `eq.${sessionId}` },
    { order: "created_at.asc", limit: 500 }
  );
  let contact = null;
  if (session.contact_id) {
    const c = await sbSelect(
      "client_contacts",
      { id: `eq.${session.contact_id}` },
      { limit: 1 }
    );
    contact = c[0] ?? null;
  }
  return NextResponse.json({ session, messages, contact });
}
