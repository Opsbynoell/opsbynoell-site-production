import { NextResponse } from "next/server";
import {
  checkLegacyPassword,
  createToken,
  verifyPassword,
  COOKIE_NAME,
} from "@/lib/admin-auth";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface UserRow {
  id: string;
  email: string | null;
  password_hash: string | null;
  is_super_admin: boolean;
}

interface UserClientRow {
  client_id: string;
}

export async function POST(req: Request): Promise<Response> {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { email, password } = body;
  if (!password) {
    return NextResponse.json({ error: "password required" }, { status: 400 });
  }

  // ------------------------------------------------------------------
  // Path 1: DB-backed email + password
  // ------------------------------------------------------------------
  if (email) {
    let user: UserRow | null = null;
    let accessibleClients: string[] = [];

    try {
      const rows = await sbSelect<UserRow>(
        "users",
        { email: `eq.${email.toLowerCase()}` },
        { limit: 1 }
      );
      user = rows[0] ?? null;
    } catch {
      // DB unavailable — fall through to legacy
    }

    if (user && user.password_hash) {
      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      if (!user.is_super_admin) {
        try {
          const clientRows = await sbSelect<UserClientRow>(
            "user_clients",
            { user_id: `eq.${user.id}` },
            { limit: 500 }
          );
          accessibleClients = clientRows.map((r) => r.client_id);
        } catch {
          accessibleClients = [];
        }
      }

      const token = await createToken({
        userId: user.id,
        email: user.email ?? email,
        isSuperAdmin: user.is_super_admin,
        accessibleClients,
      });

      const res = NextResponse.json({ ok: true, isSuperAdmin: user.is_super_admin });
      res.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60,
        path: "/",
      });
      return res;
    }

    // Email provided but user not found in DB — reject (don't fall to legacy)
    if (user === null) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
  }

  // ------------------------------------------------------------------
  // Path 2: Legacy ADMIN_PASSWORD fallback (no email field, password only)
  // ------------------------------------------------------------------
  if (!email && checkLegacyPassword(password)) {
    const token = await createToken({
      userId: "legacy",
      email: "admin@opsbynoell.com",
      isSuperAdmin: true,
      accessibleClients: [],
    });
    const res = NextResponse.json({ ok: true, isSuperAdmin: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
