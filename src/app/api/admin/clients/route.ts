/**
 * GET /api/admin/clients
 * Returns onboarding submissions and all Stripe customers for the admin clients page.
 */
import { NextResponse } from "next/server";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
  const isSuperAdmin = req.headers.get("x-admin-is-super") === "1";
  if (!isSuperAdmin) {
    return NextResponse.json({ error: "Super admin required." }, { status: 403 });
  }

  const [onboardingSubmissions, customers] = await Promise.all([
    sbSelect("onboarding_submissions", {}, { limit: 200, order: "created_at.desc" }).catch(() => []),
    sbSelect("customers", {}, { limit: 200, order: "created_at.desc" }).catch(() => []),
  ]);

  return NextResponse.json({ onboardingSubmissions, customers });
}
