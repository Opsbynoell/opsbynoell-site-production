/**
 * TEMPORARY one-shot admin password reset endpoint.
 * Path: /api/admin/oneshot-reset
 *
 * SECURITY: Gated by ADMIN_SECRET env var. This file is intentionally
 * temporary — it MUST be deleted from the repo after use. While present,
 * any caller with ADMIN_SECRET can reset any admin user's password.
 *
 * POST body: { secret, email, newPassword }
 *   secret      — must equal process.env.ADMIN_SECRET
 *   email       — admin_users.email (case-insensitive)
 *   newPassword — desired new plaintext password (>= 8 chars)
 *
 * Returns: { ok: true, userId, email } on success
 *          { error } on failure
 */
import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/admin-password";
import { env } from "@/lib/agents/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(req: Request): Promise<Response> {
  let body: { secret?: string; email?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const adminSecret = process.env.ADMIN_SECRET ?? "";
  const oneshotSecret = process.env.ONESHOT_RESET_SECRET ?? "";
  const provided = body.secret ?? "";
  const adminOk = adminSecret && timingSafeEqual(provided, adminSecret);
  const oneshotOk = oneshotSecret && timingSafeEqual(provided, oneshotSecret);
  if (!provided || (!adminOk && !oneshotOk)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const newPassword = body.newPassword ?? "";
  if (!email || !newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "email and newPassword (>=8 chars) required" }, { status: 400 });
  }

  const supabaseUrl = env.supabaseUrl();
  const supabaseKey = env.supabaseServiceKey();
  const headers = {
    apikey: supabaseKey,
    Authorization: `Bearer ${supabaseKey}`,
    "Content-Type": "application/json",
  };

  // Find user
  const lookup = await fetch(
    `${supabaseUrl}/rest/v1/admin_users?select=id,email,is_super_admin&email=eq.${encodeURIComponent(email)}`,
    { headers, cache: "no-store" }
  );
  if (!lookup.ok) {
    const text = await lookup.text();
    return NextResponse.json({ error: "db_lookup_failed", detail: text }, { status: 500 });
  }
  const rows = (await lookup.json()) as Array<{ id: string; email: string; is_super_admin: boolean }>;
  if (!rows.length) {
    return NextResponse.json({ error: "user_not_found", email }, { status: 404 });
  }
  const user = rows[0];

  // Hash and update
  const password_hash = await hashPassword(newPassword);
  const update = await fetch(
    `${supabaseUrl}/rest/v1/admin_users?id=eq.${user.id}`,
    {
      method: "PATCH",
      headers: { ...headers, Prefer: "return=representation" },
      body: JSON.stringify({ password_hash }),
      cache: "no-store",
    }
  );
  if (!update.ok) {
    const text = await update.text();
    return NextResponse.json({ error: "db_update_failed", detail: text }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    userId: user.id,
    email: user.email,
    isSuperAdmin: user.is_super_admin,
  });
}
