/**
 * PUT    /api/admin/knowledge/:id   — update a KB entry
 * DELETE /api/admin/knowledge/:id   — hard-delete a KB entry
 *
 * Authenticated via admin session cookie. Verifies that the caller has
 * access to the entry's client_id before mutating.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";
import { sbDelete, sbSelect, sbUpdate } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_CATEGORIES = [
  "services",
  "faq",
  "location",
  "policies",
  "team",
] as const;

interface KbRow {
  id: string;
  client_id: string;
}

async function authorize(
  req: NextRequest,
  id: string
): Promise<
  | { ok: true; clientId: string }
  | { ok: false; status: number; error: string }
> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = await verifyToken(token);
  if (!payload) return { ok: false, status: 401, error: "Unauthorized" };

  const rows = await sbSelect<KbRow>(
    "knowledge_base",
    { id: `eq.${id}` },
    { limit: 1 }
  );
  if (rows.length === 0)
    return { ok: false, status: 404, error: "entry not found" };

  const clientId = rows[0].client_id;
  const allowed =
    payload.isSuperAdmin || payload.accessibleClients.includes(clientId);
  if (!allowed) return { ok: false, status: 403, error: "Forbidden" };
  return { ok: true, clientId };
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const auth = await authorize(req, id);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof body.category === "string") {
    if (
      !VALID_CATEGORIES.includes(
        body.category as (typeof VALID_CATEGORIES)[number]
      )
    ) {
      return NextResponse.json(
        { error: `category must be one of ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }
    updates.category = body.category;
  }
  if (typeof body.question === "string") {
    if (body.question.length > 500) {
      return NextResponse.json(
        { error: "question too long (max 500)" },
        { status: 400 }
      );
    }
    updates.question = body.question;
  }
  if (typeof body.answer === "string") {
    if (body.answer.length > 4000) {
      return NextResponse.json(
        { error: "answer too long (max 4000)" },
        { status: 400 }
      );
    }
    updates.answer = body.answer;
  }
  if (Array.isArray(body.keywords)) {
    updates.keywords = body.keywords
      .filter((k): k is string => typeof k === "string")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean)
      .slice(0, 30);
  }
  if (typeof body.active === "boolean") {
    updates.active = body.active;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "no updates supplied" }, { status: 400 });
  }
  // Bump updated_at
  updates.updated_at = new Date().toISOString();

  const rows = await sbUpdate("knowledge_base", { id: `eq.${id}` }, updates);
  return NextResponse.json({ entry: rows[0] ?? null });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const auth = await authorize(req, id);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await sbDelete("knowledge_base", { id: `eq.${id}` });
  return NextResponse.json({ ok: true });
}
