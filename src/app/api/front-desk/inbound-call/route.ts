/**
 * GET/POST /api/front-desk/inbound-call?clientId=santa
 *
 * Twilio Voice webhook. Returns TwiML built by
 * `src/lib/agents/voice/twiml.ts` so the heavy lifting (sequential vs
 * simultaneous ring, whisper URL plumbing, callerId resolution) lives
 * in a unit-testable pure module.
 *
 * Auth: optional Twilio request signature validation (set
 * TWILIO_AUTH_TOKEN to enable). Even unsigned, the route only emits
 * TwiML - no DB writes, no SMS sends.
 *
 * Caller ID modes (set per client via `voiceRouting.callerIdMode`):
 *   "twilio_number" (default) - operator's cell shows the client's
 *     Twilio number, so their saved contact name surfaces.
 *   "original" - operator's cell shows the customer's number (legacy).
 */

import { NextRequest, NextResponse } from "next/server";
import { getClientConfig } from "@/lib/agents/config";
import { validateTwilioSignature } from "@/lib/agents/twilio-signature";
import {
  buildInboundCallTwiml,
  type VoiceRouting,
} from "@/lib/agents/voice/twiml";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function twimlResponse(xml: string): Response {
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

async function readForm(req: NextRequest): Promise<URLSearchParams> {
  const ct = req.headers.get("content-type") ?? "";
  if (ct.includes("application/x-www-form-urlencoded")) {
    const text = await req.text();
    return new URLSearchParams(text);
  }
  return new URLSearchParams();
}

function pickClientId(url: URL, form: URLSearchParams): string | null {
  return url.searchParams.get("clientId") ?? form.get("clientId") ?? null;
}

async function handle(req: NextRequest): Promise<Response> {
  const url = new URL(req.url);
  const form =
    req.method === "POST" ? await readForm(req) : new URLSearchParams();

  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const sigHeader = req.headers.get("x-twilio-signature");
  if (authToken && sigHeader) {
    const publicUrl =
      (process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
        `${url.protocol}//${url.host}`) +
      url.pathname +
      url.search;
    const ok = validateTwilioSignature(authToken, publicUrl, form, sigHeader);
    if (!ok) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
    }
  }

  const clientId = pickClientId(url, form);
  if (!clientId) {
    return twimlResponse(
      `<?xml version="1.0" encoding="UTF-8"?>\n<Response><Say>Configuration error. Missing client identifier.</Say><Hangup/></Response>`
    );
  }

  let cfg;
  try {
    cfg = await getClientConfig(clientId);
  } catch {
    return twimlResponse(
      `<?xml version="1.0" encoding="UTF-8"?>\n<Response><Say>Configuration error. Unknown client.</Say><Hangup/></Response>`
    );
  }

  if (!cfg.active || !cfg.agents.frontDesk) {
    return twimlResponse(
      `<?xml version="1.0" encoding="UTF-8"?>\n<Response><Say>This number is not currently active.</Say><Hangup/></Response>`
    );
  }

  const routing = (cfg.smsConfig?.voiceRouting ?? {}) as VoiceRouting;
  if (!routing.ringTargets || routing.ringTargets.length === 0) {
    routing.ringTargets = [];
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    `${url.protocol}//${url.host}`;

  const inboundFrom =
    form.get("From") ?? url.searchParams.get("From") ?? "";

  const xml = buildInboundCallTwiml(routing, clientId, baseUrl, inboundFrom);
  return twimlResponse(xml);
}

export async function POST(req: NextRequest): Promise<Response> {
  return handle(req);
}

export async function GET(req: NextRequest): Promise<Response> {
  return handle(req);
}
