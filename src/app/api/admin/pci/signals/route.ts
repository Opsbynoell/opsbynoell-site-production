/**
 * GET /api/admin/pci/signals
 *
 * Returns open/in-progress PCI signals scoped to the caller's
 * accessible clients (super admins see all).
 *
 * Internal only — the intelligence layer is not exposed to public site
 * copy or to unauthenticated requests. See docs/PCI.md.
 *
 * Query params:
 *   ?type=<signal_type>    optional filter
 *   ?clientId=<id>         super admin only
 *   ?limit=<n>             default 200
 */

import { NextRequest, NextResponse } from "next/server";

import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";
import { listOpenSignals } from "@/lib/pci/signals";
import { SIGNAL_TYPES, type SignalType } from "@/lib/pci/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<Response> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = await verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl;
  const typeParam = url.searchParams.get("type");
  const signal_type =
    typeParam && (SIGNAL_TYPES as readonly string[]).includes(typeParam)
      ? (typeParam as SignalType)
      : undefined;

  const clientIdParam = url.searchParams.get("clientId");
  const limitRaw = url.searchParams.get("limit");
  const limit = limitRaw ? Math.min(Math.max(parseInt(limitRaw, 10) || 0, 1), 500) : 200;

  // Same scoping rule as /api/admin/sessions:
  //   - super admin + no clientId → null (no filter)
  //   - super admin + clientId    → single-element filter
  //   - non-super-admin           → always scoped to accessibleClients
  let client_ids: string[] | null;
  if (payload.isSuperAdmin) {
    client_ids = clientIdParam ? [clientIdParam] : null;
  } else {
    client_ids = payload.accessibleClients;
  }

  try {
    const signals = await listOpenSignals({ client_ids, signal_type, limit });
    return NextResponse.json({ signals });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message },
      { status: 500 }
    );
  }
}
