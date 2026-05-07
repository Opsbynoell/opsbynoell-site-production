/**
 * POST /api/client/login
 *
 * Authenticates a client portal user and sets a session cookie.
 * Body: { email: string, password: string }
 */
import { NextResponse } from "next/server";
import { createClientToken, CLIENT_COOKIE_NAME } from "@/lib/client-auth";
import { verifyPassword } from "@/lib/admin-password";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ClientPortalUser {
  id: string;
  client_id: string;
  email: string;
  password_hash: string;
  name: string | null;
}

export async function POST(req: Request): Promise<Response> {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required." }, { status: 400 });
  }

  let user: ClientPortalUser | null = null;
  try {
    const rows = await sbSelect<ClientPortalUser>(
      "client_portal_users",
      { email: `eq.${email.toLowerCase().trim()}` },
      { limit: 1 }
    );
    user = rows[0] ?? null;
  } catch (err) {
    console.error("[client-login] DB error:", err);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }

  if (!user) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = await createClientToken({
    userId: user.id,
    email: user.email,
    clientId: user.client_id,
    name: user.name ?? user.email,
  });

  const res = NextResponse.json({ ok: true, clientId: user.client_id });
  res.cookies.set(CLIENT_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return res;
}
