/**
 * GET /api/front-desk/sessions/:sessionId
 *
 * Operator-view helper. Returns a single Front Desk session plus its
 * full message history and the related appointment (if any).
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
    "front_desk_sessions",
    { id: `eq.${sessionId}` },
    { limit: 1 }
  );
  if (sessionRows.length === 0) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  const session = sessionRows[0] as {
    id: string;
    client_id: string;
    appointment_id: string | null;
  };

  if (!hasClientAccess(auth, session.client_id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const messages = await sbSelect(
    "front_desk_messages",
    { session_id: `eq.${sessionId}` },
    { order: "created_at.asc", limit: 500 }
  );
  let appointment = null;
  if (session.appointment_id) {
    const a = await sbSelect(
      "appointments",
      { id: `eq.${session.appointment_id}` },
      { limit: 1 }
    );
    appointment = a[0] ?? null;
  }
  return NextResponse.json({ session, messages, appointment });
}
