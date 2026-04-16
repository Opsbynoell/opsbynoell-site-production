/**
 * GET /api/care/contact-lookup?clientId=...&phone=...&email=...
 *
 * Used by the Care widget (and by SMS inbound handlers) to determine
 * whether the incoming conversation is from a known client. If we have
 * the contact on file, the response includes name, last visit, usual
 * service, VIP flag. Otherwise the caller knows to greet the visitor
 * as new.
 */

import { NextResponse } from "next/server";
import { sbSelect } from "@/lib/agents/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request): Promise<Response> {
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
  const filter: Record<string, string> = { client_id: `eq.${clientId}` };
  if (phone) filter.phone = `eq.${phone}`;
  else if (email) filter.email = `eq.${email}`;
  const rows = await sbSelect("client_contacts", filter, { limit: 1 });
  return NextResponse.json({ contact: rows[0] ?? null });
}
