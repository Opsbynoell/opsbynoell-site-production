import { NextRequest, NextResponse } from "next/server";
import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<Response> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    email: payload.email,
    isSuperAdmin: payload.isSuperAdmin,
    accessibleClients: payload.accessibleClients,
  });
}
