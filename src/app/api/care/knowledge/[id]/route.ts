/**
 * PUT /api/care/knowledge/:id   — update a KB entry
 * DELETE /api/care/knowledge/:id — deactivate a KB entry (soft delete)
 */

import { NextResponse } from "next/server";
import { sbUpdate } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  const body = (await req.json()) as Record<string, unknown>;
  const allowed: Record<string, unknown> = {};
  for (const key of ["category", "question", "answer", "keywords", "active"]) {
    if (key in body) allowed[key] = body[key];
  }
  const rows = await sbUpdate("knowledge_base", { id: `eq.${id}` }, allowed);
  return NextResponse.json({ entry: rows[0] ?? null });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const { id } = await params;
  await sbUpdate("knowledge_base", { id: `eq.${id}` }, { active: false });
  return NextResponse.json({ ok: true });
}
