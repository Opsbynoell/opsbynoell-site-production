/**
 * GET /api/support/sessions/:sessionId
 *
 * Operator-view helper. Returns a single Support session plus its
 * message history and any recognized contact record.
 *
 * Admin-only: transcripts contain visitor PII. Requires an
 * authenticated admin with access to the session's client.
 */

import { NextResponse } from "next/server";
import {
  hasClientAccess,
  verifyAdminFromCookie,
} from "@/lib/agents/request-security";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
): Promise<Response> {
  const auth = await verifyAdminFromCookie(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    client_id: string;
    contact_id: string | null;
  };

  if (!hasClientAccess(auth, session.client_id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
