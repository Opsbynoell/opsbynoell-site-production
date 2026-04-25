/**
 * GET  /api/admin/knowledge?clientId=...   — list KB entries (incl. inactive)
 * POST /api/admin/knowledge                — create a KB entry
 *
 * Authenticated via admin session cookie. Non-super-admins are scoped to
 * their `accessibleClients`. Replaces the unauthenticated /api/care/knowledge
 * for admin-UI use; the /api/care/knowledge route remains for backwards
 * compatibility with any existing onboarding scripts.
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";
import { sbInsert, sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID_CATEGORIES = [
  "services",
  "faq",
  "location",
  "policies",
  "team",
] as const;
type Category = (typeof VALID_CATEGORIES)[number];

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
    return NextResponse.json({ error: "clientId required" }, { status: 400 });
  }
  if (!canAccess(payload.isSuperAdmin, payload.accessibleClients, clientId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const rows = await sbSelect(
    "knowledge_base",
    { client_id: `eq.${clientId}` },
    { limit: 500, order: "category.asc,question.asc" }
  );
  return NextResponse.json({ entries: rows });
}

export async function POST(req: NextRequest): Promise<Response> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    clientId?: string;
    category?: string;
    question?: string;
    answer?: string;
    keywords?: string[];
    active?: boolean;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { clientId, category, question, answer, keywords, active } = body;
  if (!clientId || !category || !question || !answer) {
    return NextResponse.json(
      { error: "clientId, category, question, answer are required" },
      { status: 400 }
    );
  }
  if (!canAccess(payload.isSuperAdmin, payload.accessibleClients, clientId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!VALID_CATEGORIES.includes(category as Category)) {
    return NextResponse.json(
      { error: `category must be one of ${VALID_CATEGORIES.join(", ")}` },
      { status: 400 }
    );
  }
  if (question.length > 500 || answer.length > 4000) {
    return NextResponse.json(
      { error: "question (max 500) or answer (max 4000) too long" },
      { status: 400 }
    );
  }

  const cleanKeywords = Array.isArray(keywords)
    ? keywords
        .filter((k) => typeof k === "string")
        .map((k) => k.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, 30)
    : [];

  const row = await sbInsert("knowledge_base", {
    client_id: clientId,
    category,
    question,
    answer,
    keywords: cleanKeywords,
    active: active ?? true,
  });
  return NextResponse.json({ entry: row });
}
