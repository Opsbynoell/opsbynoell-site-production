/**
 * POST /api/admin/clients/provision
 * Marks an onboarding submission as provisioned and links it to a client_id.
 */
import { NextResponse } from "next/server";
import { sbUpdate } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request): Promise<Response> {
  const isSuperAdmin = req.headers.get("x-admin-is-super") === "1";
  if (!isSuperAdmin) {
    return NextResponse.json({ error: "Super admin required." }, { status: 403 });
  }

  const body = await req.json() as { submissionId: string; clientId?: string };
  const { submissionId, clientId } = body;

  if (!submissionId) {
    return NextResponse.json({ error: "submissionId required" }, { status: 400 });
  }

  await sbUpdate(
    "onboarding_submissions",
    { id: `eq.${submissionId}` },
    {
      provisioned: true,
      provisioned_at: new Date().toISOString(),
      ...(clientId ? { client_id: clientId } : {}),
    }
  );

  return NextResponse.json({ success: true });
}
