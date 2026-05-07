/**
 * POST /api/admin/clients/create-portal-user
 *
 * Creates a client_portal_users record for a newly provisioned client.
 * Returns the temporary password so the admin can share it with the client.
 */
import { NextResponse } from "next/server";
import { sbUpsert } from "@/lib/agents/supabase";
import { hashPassword } from "@/lib/admin-password";
import crypto from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function generateTempPassword(): string {
  // 12-character alphanumeric password
  return crypto.randomBytes(9).toString("base64url").slice(0, 12);
}

export async function POST(req: Request): Promise<Response> {
  const isSuperAdmin = req.headers.get("x-admin-is-super") === "1";
  if (!isSuperAdmin) {
    return NextResponse.json({ error: "Super admin required." }, { status: 403 });
  }

  const body = await req.json() as {
    submissionId: string;
    email: string;
    name: string;
    clientId: string;
  };

  const { email, name, clientId } = body;

  if (!email || !clientId) {
    return NextResponse.json({ error: "email and clientId required" }, { status: 400 });
  }

  const tempPassword = generateTempPassword();
  const passwordHash = await hashPassword(tempPassword);

  await sbUpsert(
    "client_portal_users",
    {
      client_id: clientId,
      email: email.toLowerCase().trim(),
      password_hash: passwordHash,
      name: name || null,
      is_owner: true,
      updated_at: new Date().toISOString(),
    },
    "email"
  );

  return NextResponse.json({ email, tempPassword });
}
