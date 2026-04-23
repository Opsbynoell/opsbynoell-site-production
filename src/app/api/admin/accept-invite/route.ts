/**
 * Public invite-acceptance endpoint (no login required).
 *
 *   GET  /api/admin/accept-invite?token=…   → validate + return email
 *   POST /api/admin/accept-invite            → set password, mark used
 *
 * A token is valid if it exists, is not used, and has not expired.
 * On successful POST the invite row's used_at is set and the admin
 * user's password_hash is populated.
 */

import { NextRequest, NextResponse } from "next/server";
import { sbSelect, sbUpdate } from "@/lib/agents/supabase";
import { hashInviteToken } from "@/lib/admin-invite-token";
import { hashPassword } from "@/lib/admin-password";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface InviteRow {
  id: string;
  user_id: string;
  expires_at: string;
  used_at: string | null;
}

interface UserRow {
  id: string;
  email: string;
  password_hash: string | null;
}

async function lookupInvite(
  token: string
): Promise<
  | { ok: true; invite: InviteRow; user: UserRow }
  | { ok: false; status: number; error: string }
> {
  if (!token || typeof token !== "string") {
    return { ok: false, status: 400, error: "Missing invite token." };
  }

  const tokenHash = await hashInviteToken(token);

  let invite: InviteRow | null = null;
  try {
    const rows = await sbSelect<InviteRow>(
      "admin_invite_tokens",
      { token_hash: `eq.${tokenHash}` },
      { limit: 1 }
    );
    invite = rows[0] ?? null;
  } catch {
    return { ok: false, status: 500, error: "Could not verify invite." };
  }

  if (!invite) {
    return { ok: false, status: 400, error: "This invite link is invalid." };
  }
  if (invite.used_at) {
    return {
      ok: false,
      status: 400,
      error: "This invite link has already been used.",
    };
  }
  if (new Date(invite.expires_at).getTime() <= Date.now()) {
    return { ok: false, status: 400, error: "This invite link has expired." };
  }

  let user: UserRow | null = null;
  try {
    const rows = await sbSelect<UserRow>(
      "admin_users",
      { id: `eq.${invite.user_id}` },
      { limit: 1 }
    );
    user = rows[0] ?? null;
  } catch {
    return { ok: false, status: 500, error: "Could not verify invite." };
  }

  if (!user) {
    return { ok: false, status: 400, error: "This invite link is invalid." };
  }

  return { ok: true, invite, user };
}

export async function GET(req: NextRequest): Promise<Response> {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  const result = await lookupInvite(token);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ ok: true, email: result.user.email });
}

export async function POST(req: NextRequest): Promise<Response> {
  let body: { token?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const token = body.token ?? "";
  const password = body.password ?? "";
  if (!password || password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const result = await lookupInvite(token);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const passwordHash = await hashPassword(password);

  try {
    await sbUpdate(
      "admin_users",
      { id: `eq.${result.user.id}` },
      { password_hash: passwordHash }
    );
  } catch {
    return NextResponse.json({ error: "Could not set password." }, { status: 500 });
  }

  try {
    await sbUpdate(
      "admin_invite_tokens",
      { id: `eq.${result.invite.id}` },
      { used_at: new Date().toISOString() }
    );
  } catch {
    // Password was set but token wasn't marked used. The expires_at check
    // will still retire the token within 48 hours.
  }

  return NextResponse.json({ ok: true, email: result.user.email });
}
