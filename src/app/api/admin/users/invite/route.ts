/**
 * POST /api/admin/users/invite
 *
 * Super-admin only. Thin wrapper around handleAdminInvite.
 *
 * Body:
 *   {
 *     email: string,
 *     isSuperAdmin?: boolean,
 *     accessibleClients?: string[]
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";
import { handleAdminInvite } from "@/lib/admin-invite-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function originOf(req: NextRequest): string {
  const fromEnv = process.env.PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  const fromHeader = req.headers.get("origin");
  if (fromHeader) return fromHeader.replace(/\/$/, "");
  return `${req.nextUrl.protocol}//${req.nextUrl.host}`;
}

export async function POST(req: NextRequest): Promise<Response> {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  const auth = await verifyToken(cookie);

  let body: {
    email?: string;
    isSuperAdmin?: boolean;
    accessibleClients?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const origin = originOf(req);
  const result = await handleAdminInvite({
    callerIsSuperAdmin: !!auth?.isSuperAdmin,
    email: body.email,
    isSuperAdmin: body.isSuperAdmin,
    accessibleClients: body.accessibleClients,
    buildInviteUrl: (token) =>
      `${origin}/admin/accept-invite?token=${encodeURIComponent(token)}`,
  });

  return NextResponse.json(result.body, { status: result.status });
}
