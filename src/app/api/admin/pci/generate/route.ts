/**
 * POST /api/admin/pci/generate
 *
 * Operator-triggered PCI signal generation. Reads existing agent
 * domain tables and upserts `customer_events` + `customer_signals` via
 * the pure rule functions. This is the **manual** path — no cron is
 * wired, no outbound messages are sent, no GHL handoff is invoked.
 *
 * Authorization:
 *   - Caller must have a valid admin session cookie (verifyToken).
 *   - Non-super-admins are scoped to their `accessibleClients`.
 *   - Super admins may pass `clientIds` explicitly; omitting scans all.
 *
 * Body (JSON, all optional):
 *   {
 *     "dryRun": boolean,                 // default: true (safe default)
 *     "rules":   SupportedRule[],        // subset of SUPPORTED_RULES
 *     "clientIds": string[],             // super-admin only
 *     "limit":    number                 // 1..500, default 200
 *   }
 *
 * The actual logic lives in src/lib/pci/generate-handler.ts so it is
 * testable without NextRequest/NextResponse. This file is a thin
 * adapter.
 */

import { NextRequest, NextResponse } from "next/server";

import { verifyToken, COOKIE_NAME } from "@/lib/admin-auth";
import { handleGenerate } from "@/lib/pci/generate-handler";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<Response> {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const session = await verifyToken(token);

  let body: unknown = null;
  try {
    const raw = await req.text();
    if (raw.trim().length > 0) body = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  try {
    const result = await handleGenerate({ session, body });
    return NextResponse.json(result.body, { status: result.status });
  } catch (e) {
    console.error("[admin/pci/generate] failed:", e);
    return NextResponse.json(
      { error: "Signal generation failed." },
      { status: 500 }
    );
  }
}
