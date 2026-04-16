/**
 * GET /api/care/knowledge?clientId=...       — list entries for a client
 * POST /api/care/knowledge                   — create an entry
 *
 * Used during onboarding (Nikki populates the KB per client) and from
 * the admin dashboard. Not exposed to the widget.
 */

import { NextResponse } from "next/server";
import { sbInsert, sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }
  const rows = await sbSelect(
    "knowledge_base",
    { client_id: `eq.${clientId}` },
    { limit: 500, order: "category.asc,question.asc" }
  );
  return NextResponse.json({ entries: rows });
}

export async function POST(req: Request): Promise<Response> {
  const body = (await req.json()) as {
    clientId: string;
    category: "services" | "faq" | "location" | "policies" | "team";
    question: string;
    answer: string;
    keywords?: string[];
    active?: boolean;
  };
  if (!body.clientId || !body.category || !body.question || !body.answer) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const row = await sbInsert("knowledge_base", {
    client_id: body.clientId,
    category: body.category,
    question: body.question,
    answer: body.answer,
    keywords: body.keywords ?? [],
    active: body.active ?? true,
  });
  return NextResponse.json({ entry: row });
}
