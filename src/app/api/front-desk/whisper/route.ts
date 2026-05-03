/**
 * GET/POST /api/front-desk/whisper?clientId=santa&caller=%2B19495551234
 *
 * Twilio fetches this URL on the called leg of a simultaneous-ring
 * <Dial> when the call is answered (via the <Number url="..."/>
 * attribute set by /api/front-desk/inbound-call). The caller hears
 * silence until one of the called legs presses 1; the rest hang up.
 *
 * TwiML body is built by `src/lib/agents/voice/twiml.ts` so prompt
 * shape and digit-by-digit phone formatting are unit-testable without
 * importing `next/server`.
 */

import { NextRequest } from "next/server";
import { getClientConfig } from "@/lib/agents/config";
import { buildWhisperTwiml } from "@/lib/agents/voice/twiml";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function twimlResponse(xml: string): Response {
  return new Response(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

function pickQuery(req: NextRequest, key: string): string | null {
  return new URL(req.url).searchParams.get(key);
}

async function handle(req: NextRequest): Promise<Response> {
  const clientId = pickQuery(req, "clientId");
  if (!clientId) {
    return twimlResponse(
      `<?xml version="1.0" encoding="UTF-8"?>\n<Response><Hangup/></Response>`
    );
  }

  let brandName = clientId;
  try {
    const cfg = await getClientConfig(clientId);
    brandName = cfg.brandName?.trim() || cfg.businessName?.trim() || clientId;
  } catch {
    // Fall back to the raw clientId for the prompt - never block the leg.
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    (() => {
      const u = new URL(req.url);
      return `${u.protocol}//${u.host}`;
    })();

  const confirmAction = `${baseUrl}/api/front-desk/whisper-confirm?clientId=${encodeURIComponent(
    clientId
  )}`;

  const xml = buildWhisperTwiml({
    brandName,
    caller: pickQuery(req, "caller"),
    confirmAction,
  });

  return twimlResponse(xml);
}

export async function POST(req: NextRequest): Promise<Response> {
  return handle(req);
}

export async function GET(req: NextRequest): Promise<Response> {
  return handle(req);
}
