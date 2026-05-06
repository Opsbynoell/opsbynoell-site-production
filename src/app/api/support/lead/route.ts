/**
 * POST /api/support/lead
 *
 * Lightweight fallback for the support chat widget when the primary
 * agent backend is unavailable. Captures name + email + (optional)
 * message and emails the operator inbox via Resend. Does NOT touch
 * Supabase so it stays up even when the agent DB is degraded.
 */

import { NextRequest, NextResponse } from "next/server";
import { sendAgentEmailAlert } from "@/lib/agents/email-alert";
import {
  clientIdentity,
  isOriginAllowed,
  rateLimit,
  rateLimitResponse,
} from "@/lib/agents/request-security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PER_IP_LIMIT = 10;
const PER_IP_WINDOW_MS = 60_000;

function clean(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(req: NextRequest): Promise<Response> {
  if (!isOriginAllowed(req)) {
    return NextResponse.json({ ok: false, error: "Forbidden origin" }, { status: 403 });
  }

  const rl = rateLimit(
    `support-lead:${clientIdentity(req)}`,
    PER_IP_LIMIT,
    PER_IP_WINDOW_MS
  );
  if (!rl.ok) return rateLimitResponse(rl.retryAfterMs);

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad JSON." }, { status: 400 });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const message = clean(body.message, 1000);

  if (!name || !email) {
    return NextResponse.json({ ok: false, error: "Missing field." }, { status: 400 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 400 });
  }

  const subject = `New support-chat lead: ${name}`;
  const text = [
    `New lead captured from the Noell Support chat widget fallback.`,
    ``,
    `Name: ${name}`,
    `Email: ${email}`,
    message ? `\nMessage:\n${message}` : ``,
  ]
    .filter(Boolean)
    .join("\n");

  const alert = await sendAgentEmailAlert({ subject, text });
  if (!alert.ok) {
    console.warn("[support/lead] email alert skipped:", alert.error);
    // Still return ok so the visitor sees confirmation — we have the
    // attempt logged on the server side.
  }

  return NextResponse.json({ ok: true });
}
