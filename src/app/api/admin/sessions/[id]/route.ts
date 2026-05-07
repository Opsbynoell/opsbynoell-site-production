/**
 * GET /api/admin/sessions/[id]?agent=support|frontDesk|care
 *
 * Returns a single session with its full message thread,
 * plus any linked appointment (Front Desk) or contact record (Care).
 */

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

async function fetchJson<T>(url: string): Promise<T | null> {
  const res = await fetch(url, {
    headers: supabaseHeaders(),
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) ? data[0] ?? null : data;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const authPayload = readAdminHeaders(req);
  if (!authPayload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const agent = req.nextUrl.searchParams.get("agent") ?? "support";

  const sessionTable =
    agent === "frontDesk"
      ? "front_desk_sessions"
      : agent === "care"
        ? "care_sessions"
        : "support_sessions";

  const messagesTable =
    agent === "frontDesk"
      ? "front_desk_messages"
      : agent === "care"
        ? "care_messages"
        : "support_messages";

  try {
    const [session, messages] = await Promise.all([
      fetchJson<Record<string, unknown>>(
        `${restUrl(sessionTable)}?id=eq.${id}&select=*`
      ),
      fetch(
        `${restUrl(messagesTable)}?session_id=eq.${id}&sessionId=eq.${id}&order=created_at.asc,createdAt.asc&select=*`,
        { headers: supabaseHeaders(), cache: "no-store" }
      )
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
    ]);

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    // Access check for non-super-admins
    const sessionClientId =
      ((session.client_id ?? session.clientId) as string | null) ?? "";
    if (!hasClientAccess(authPayload, sessionClientId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Normalize session
    const norm = {
      ...session,
      visitor_name: session.visitor_name ?? session.visitorName,
      visitor_phone: session.visitor_phone ?? session.visitorPhone,
      visitor_email: session.visitor_email ?? session.visitorEmail,
      human_takeover: session.human_takeover ?? session.humanTakeover,
      unread_count: session.unread_count ?? session.unreadCount,
      created_at: session.created_at ?? session.createdAt,
      updated_at: session.updated_at ?? session.updatedAt,
    };

    // Normalize messages
    const normalizedMessages = (messages as Record<string, unknown>[]).map(
      (m) => ({
        ...m,
        session_id: m.session_id ?? m.sessionId,
        created_at: m.created_at ?? m.createdAt,
      })
    );

    // Fetch linked appointment (Front Desk only)
    const rawSession = session as Record<string, unknown>;
    let appointment = null;
    if (agent === "frontDesk" && rawSession.appointment_id) {
      appointment = await fetchJson<Record<string, unknown>>(
        `${restUrl("appointments")}?id=eq.${rawSession.appointment_id}&select=*`
      );
    }

    // Fetch linked contact (Care only)
    let contact = null;
    if (agent === "care" && rawSession.contact_id) {
      contact = await fetchJson<Record<string, unknown>>(
        `${restUrl("client_contacts")}?id=eq.${rawSession.contact_id}&select=*`
      );
    }

    // Mark as read
    if ((norm.unread_count as number) > 0) {
      fetch(`${restUrl(sessionTable)}?id=eq.${id}`, {
        method: "PATCH",
        headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify({ unread_count: 0, unreadCount: 0 }),
      }).catch(() => {});
    }

    return NextResponse.json({
      session: norm,
      messages: normalizedMessages,
      appointment,
      contact,
    });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
