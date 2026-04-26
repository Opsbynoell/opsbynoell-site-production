/**
 * PUT /api/care/knowledge/:id   — update a KB entry
 * DELETE /api/care/knowledge/:id — deactivate a KB entry (soft delete)
 *
 * Both require an authenticated admin with access to the entry's
 * owning client. KB rows are fed into the agent system prompt as
 * authoritative context, so uncontrolled mutations are a
 * prompt-injection / data-integrity risk.
 */

import { NextResponse } from "next/server";
import {
  hasClientAccess,
  verifyAdminFromCookie,
} from "@/lib/agents/request-security";
import { sbSelect, sbUpdate } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function resolveEntryClientId(id: string): Promise<string | null> {
  const rows = await sbSelect<{ client_id: string }>(
    "knowledge_base",
    { id: `eq.${id}` },
    { limit: 1, select: "client_id" }
  );
  return rows[0]?.client_id ?? null;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const auth = await verifyAdminFromCookie(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const clientId = await resolveEntryClientId(id);
  if (!clientId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!hasClientAccess(auth, clientId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json()) as Record<string, unknown>;
  const allowed: Record<string, unknown> = {};
  for (const key of ["category", "question", "answer", "keywords", "active"]) {
    if (key in body) allowed[key] = body[key];
  }
  allowed.updated_by = auth.email;
  const rows = await sbUpdate("knowledge_base", { id: `eq.${id}` }, allowed);
  return NextResponse.json({ entry: rows[0] ?? null });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const auth = await verifyAdminFromCookie(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const clientId = await resolveEntryClientId(id);
  if (!clientId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (!hasClientAccess(auth, clientId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await sbUpdate(
    "knowledge_base",
    { id: `eq.${id}` },
    { active: false, updated_by: auth.email }
  );
  return NextResponse.json({ ok: true });
}
