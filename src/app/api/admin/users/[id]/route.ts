/**
 * PATCH  /api/admin/users/[id]   — update user (password, isSuperAdmin, accessibleClients)
 * DELETE /api/admin/users/[id]   — delete user
 *
 * Both require super admin. A super admin cannot delete themselves.
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

// PATCH /api/admin/users/[id]
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const auth = await requireSuperAdmin(req);
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  let body: {
    password?: string;
    isSuperAdmin?: boolean;
    accessibleClients?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (body.password) {
    patch.password_hash = await hashPassword(body.password);
  }
  if (typeof body.isSuperAdmin === "boolean") {
    patch.is_super_admin = body.isSuperAdmin;
  }

  if (Object.keys(patch).length > 0) {
    const patchRes = await fetch(`${restUrl("users")}?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
      body: JSON.stringify(patch),
    });
    if (!patchRes.ok) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
  }

  // Replace accessible clients if provided
  if (body.accessibleClients !== undefined) {
    // Delete existing
    await fetch(`${restUrl("user_clients")}?user_id=eq.${id}`, {
      method: "DELETE",
      headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
    });
    // Re-insert
    if (body.accessibleClients.length > 0) {
      const rows = body.accessibleClients.map((c) => ({
        user_id: id,
        client_id: c,
      }));
      await fetch(restUrl("user_clients"), {
        method: "POST",
        headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
        body: JSON.stringify(rows),
      });
    }
  }

  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/users/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  const auth = await requireSuperAdmin(req);
  if (!auth) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;

  if (auth.userId === id) {
    return NextResponse.json(
      { error: "Cannot delete your own account" },
      { status: 400 }
    );
  }

  const delRes = await fetch(`${restUrl("users")}?id=eq.${id}`, {
    method: "DELETE",
    headers: { ...supabaseHeaders(), Prefer: "return=minimal" },
  });
  if (!delRes.ok) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
