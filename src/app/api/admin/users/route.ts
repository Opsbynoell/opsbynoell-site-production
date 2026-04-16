/**
 * GET  /api/admin/users       — list all admin users (super admin only)
 * POST /api/admin/users       — create a new admin user (super admin only)
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, hashPassword, COOKIE_NAME } from "@/lib/admin-auth";
import { env } from "@/lib/agents/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function supabaseHeaders() {
  const key = env.supabaseServiceKey();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}
function restUrl(path: string) {
  return `${env.supabaseUrl()}/rest/v1/${path}`;
}

async function requireSuperAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = await verifyToken(token);
  if (!payload) return null;
  if (!payload.isSuperAdmin) return null;
  return payload;
}

// GET /api/admin/users
export async function GET(req: NextRequest): Promise<Response> {
  const auth = await requireSuperAdmin(req);
  if (!auth) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const usersRes = await fetch(
    `${restUrl("users")}?select=id,email,is_super_admin,created_at&email=not.is.null&order=created_at.asc`,
    { headers: supabaseHeaders(), cache: "no-store" }
  );
  if (!usersRes.ok) {
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }
  const users = await usersRes.json();

  // Fetch accessible clients for each user
  const ucRes = await fetch(
    `${restUrl("user_clients")}?select=user_id,client_id`,
    { headers: supabaseHeaders(), cache: "no-store" }
  );
  const allUC = ucRes.ok ? (await ucRes.json() as { user_id: string; client_id: string }[]) : [];

  const ucMap: Record<string, string[]> = {};
  for (const row of allUC) {
    ucMap[row.user_id] = ucMap[row.user_id] ?? [];
    ucMap[row.user_id].push(row.client_id);
  }

  const result = (users as { id: string; email: string; is_super_admin: boolean; created_at: string }[])
    .map((u) => ({
      ...u,
      accessible_clients: ucMap[u.id] ?? [],
    }));

  return NextResponse.json({ users: result });
}

// POST /api/admin/users
export async function POST(req: NextRequest): Promise<Response> {
  const auth = await requireSuperAdmin(req);
  if (!auth) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    email?: string;
    password?: string;
    isSuperAdmin?: boolean;
    accessibleClients?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const { email, password, isSuperAdmin = false, accessibleClients = [] } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "email and password required" }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);

  const createRes = await fetch(restUrl("users"), {
    method: "POST",
    headers: { ...supabaseHeaders(), Prefer: "return=representation" },
    body: JSON.stringify({
      email: email.toLowerCase(),
      password_hash: passwordHash,
      is_super_admin: isSuperAdmin,
    }),
  });
  if (!createRes.ok) {
    const err = await createRes.text();
    if (err.includes("unique") || err.includes("duplicate")) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
  const [newUser] = await createRes.json() as [{ id: string }];

  // Insert user_clients rows
  if (!isSuperAdmin && accessibleClients.length > 0) {
    const rows = accessibleClients.map((c) => ({
      user_id: newUser.id,
      client_id: c,
    }));
    await fetch(restUrl("user_clients"), {
      method: "POST",
      headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
      body: JSON.stringify(rows),
    });
  }

  return NextResponse.json({ ok: true, userId: newUser.id }, { status: 201 });
}
