/**
 * GET /api/care/contact-lookup?clientId=...&phone=...&email=...
 *
 * Returns the matching `client_contacts` row, if any. Used by admin
 * tooling and by server-to-server agent flows.
 *
 * Hardened pre-launch:
 *   - Requires either an authenticated admin (with client access) or
 *     the AGENT_ACTION_SECRET bearer token. The endpoint previously
 *     accepted unauthenticated traffic and allowed cross-client
 *     enumeration of PII (name, phone, email, VIP flag, notes).
 *   - Per-IP rate limit to slow any residual abuse path.
 *   - Requires clientId + exactly one of phone/email; the query is
 *     always scoped to the provided clientId.
 */

import { NextRequest, NextResponse } from "next/server";
import {
  clientIdentity,
  hasClientAccess,
  rateLimit,
  rateLimitResponse,
  verifyAdminFromCookie,
} from "@/lib/agents/request-security";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function authorize(
  req: Request,
  clientId: string
): Promise<{ ok: true } | { ok: false; response: Response }> {
  const expected = process.env.AGENT_ACTION_SECRET;
  const auth = req.headers.get("authorization") ?? "";
  if (expected && auth === `Bearer ${expected}`) return { ok: true };
  const admin = await verifyAdminFromCookie(req);
  if (admin && hasClientAccess(admin, clientId)) return { ok: true };
  return {
    ok: false,
    response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  const rl = rateLimit(
    `care-contact-lookup:${clientIdentity(req)}`,
    30,
    60_000
  );
  if (!rl.ok) return rateLimitResponse(rl.retryAfterMs);

  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");
  const phone = url.searchParams.get("phone") ?? undefined;
  const email = url.searchParams.get("email") ?? undefined;
  if (!clientId || (!phone && !email)) {
    return NextResponse.json(
      { error: "clientId plus one of phone/email required" },
      { status: 400 }
    );
  }

  const authz = await authorize(req, clientId);
  if (!authz.ok) return authz.response;

  const filter: Record<string, string> = { client_id: `eq.${clientId}` };
  if (phone) filter.phone = `eq.${phone}`;
  else if (email) filter.email = `eq.${email}`;
  const rows = await sbSelect("client_contacts", filter, { limit: 1 });
  return NextResponse.json({ contact: rows[0] ?? null });
}
