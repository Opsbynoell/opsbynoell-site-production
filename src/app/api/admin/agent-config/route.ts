/**
 * GET  /api/admin/agent-config?clientId=...   — fetch prompts/greetings for a client
 * PATCH /api/admin/agent-config               — update prompt/greeting fields
 *
 * Authenticated via the admin session cookie. Non-super-admins are
 * scoped to their `accessibleClients`. Super admins can read/write any
 * client.
 *
 * Allowed fields (any subset accepted on PATCH):
 *   - support_system_prompt   (text)
 *   - support_greeting        (text)
 *   - support_booking_url     (text)
 *   - front_desk_system_prompt (text)
 *   - care_system_prompt      (text)
 *   - care_greeting           (text)
 *
 * Other client columns are intentionally NOT writable here. Pricing,
 * SMS provider, etc. live elsewhere.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";
import { sbSelect, sbUpdate } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_FIELDS = [
  "support_system_prompt",
  "support_greeting",
  "support_booking_url",
  "front_desk_system_prompt",
  "care_system_prompt",
  "care_greeting",
] as const;

type AllowedField = (typeof ALLOWED_FIELDS)[number];

interface ClientRow {
  client_id: string;
  business_name: string;
  support_system_prompt: string | null;
  support_greeting: string | null;
  support_booking_url: string | null;
  front_desk_system_prompt: string | null;
  care_system_prompt: string | null;
  care_greeting: string | null;
}

function canAccess(
  isSuperAdmin: boolean,
  accessibleClients: string[],
  clientId: string
): boolean {
  if (isSuperAdmin) return true;
  return accessibleClients.includes(clientId);
}

export async function GET(req: NextRequest): Promise<Response> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = req.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json(
      { error: "clientId required" },
      { status: 400 }
    );
  }
  if (!canAccess(payload.isSuperAdmin, payload.accessibleClients, clientId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await sbSelect<ClientRow>(
    "clients",
    { client_id: `eq.${clientId}` },
    {
      limit: 1,
      // Only pull the editable + identifying fields
      select: [
        "client_id",
        "business_name",
        "support_system_prompt",
        "support_greeting",
        "support_booking_url",
        "front_desk_system_prompt",
        "care_system_prompt",
        "care_greeting",
      ].join(","),
    }
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: "client not found" }, { status: 404 });
  }
  return NextResponse.json({ client: rows[0] });
}

export async function PATCH(req: NextRequest): Promise<Response> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { clientId?: string } & Partial<Record<AllowedField, string>>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const clientId = body.clientId;
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }
  if (!canAccess(payload.isSuperAdmin, payload.accessibleClients, clientId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Whitelist: only copy keys that are in ALLOWED_FIELDS and have string values.
  const updates: Record<string, string> = {};
  for (const key of ALLOWED_FIELDS) {
    const v = body[key];
    if (typeof v === "string") {
      updates[key] = v;
    }
  }
  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "no editable fields supplied" },
      { status: 400 }
    );
  }

  // Hard cap on prompt length to prevent runaway tokens / paste-bombs.
  for (const key of [
    "support_system_prompt",
    "front_desk_system_prompt",
    "care_system_prompt",
  ] as const) {
    if (updates[key] && updates[key].length > 12000) {
      return NextResponse.json(
        { error: `${key} exceeds 12,000 character limit` },
        { status: 400 }
      );
    }
  }

  const rows = await sbUpdate<ClientRow>(
    "clients",
    { client_id: `eq.${clientId}` },
    updates
  );
  if (rows.length === 0) {
    return NextResponse.json({ error: "client not found" }, { status: 404 });
  }
  return NextResponse.json({ client: rows[0], updatedFields: Object.keys(updates) });
}
