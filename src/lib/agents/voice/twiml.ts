/**
 * Pure TwiML builders for the front-desk Voice routes.
 *
 * Lives outside the Next.js route handlers so it can be unit-tested
 * without importing `next/server`. The route in
 * src/app/api/front-desk/inbound-call/route.ts and
 * src/app/api/front-desk/whisper/route.ts both delegate here.
 */

export type RingTarget = {
  number: string;
  timeoutSeconds: number;
};

export type VoiceRouting = {
  ringTargets: RingTarget[];
  voicemailMaxLengthSeconds?: number;
  voicemailGreeting?: string;
  /** Default "twilio_number". See header docstring of the route. */
  callerIdMode?: "original" | "twilio_number";
  /** E.164 of the client's customer-facing Twilio number. */
  twilioNumber?: string;
  /** "sequential" (default) or "simultaneous". */
  ringMode?: "sequential" | "simultaneous";
  /** When true (simultaneous only), each leg gets a press-1 whisper. */
  whisperEnabled?: boolean;
};

export const DEFAULT_VOICEMAIL_GREETING =
  "Sorry we missed your call. Please leave a short message after the beep and we will text you right back.";

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function clampTimeout(t: number): number {
  return Math.max(5, Math.min(60, Math.floor(t)));
}

/**
 * Resolve which number to set as `callerId` on the operator's leg.
 *
 * Returns null when the dial should omit the attribute entirely
 * (= Twilio defaults to the inbound caller, today's behavior for any
 * client that has never set callerId).
 */
export function resolveCallerId(
  routing: VoiceRouting,
  inboundFrom: string
): string | null {
  const mode = routing.callerIdMode ?? "twilio_number";
  if (mode === "original") {
    return inboundFrom || null;
  }
  const tn = routing.twilioNumber?.trim();
  if (tn) return tn;
  return inboundFrom || null;
}

function callerIdAttr(callerId: string | null): string {
  return callerId ? ` callerId="${escapeXml(callerId)}"` : "";
}

function buildSequentialDials(
  routing: VoiceRouting,
  targets: RingTarget[],
  inboundFrom: string
): string {
  // Sequential preserves legacy behavior: only attach callerId when
  // the client has explicitly opted in via callerIdMode.
  let attr = "";
  if (
    routing.callerIdMode === "twilio_number" &&
    typeof routing.twilioNumber === "string" &&
    routing.twilioNumber.trim().length > 0
  ) {
    attr = callerIdAttr(routing.twilioNumber.trim());
  } else if (routing.callerIdMode === "original") {
    attr = callerIdAttr(inboundFrom || null);
  }
  return targets
    .map(
      (t) =>
        `  <Dial timeout="${clampTimeout(t.timeoutSeconds)}" answerOnBridge="true"${attr}>` +
        `<Number>${escapeXml(t.number)}</Number></Dial>`
    )
    .join("\n");
}

function buildSimultaneousDial(
  routing: VoiceRouting,
  targets: RingTarget[],
  baseUrl: string,
  clientId: string,
  inboundFrom: string,
  whisperEnabled: boolean
): string {
  const maxTimeout = clampTimeout(
    targets.reduce((m, t) => Math.max(m, t.timeoutSeconds || 0), 0) || 20
  );
  const callerId = resolveCallerId(routing, inboundFrom);
  const attr = callerIdAttr(callerId);

  // Whisper URL carries the customer's number so the whisper TwiML can
  // read it back to the operator before they press 1.
  const whisperUrl = whisperEnabled
    ? `${baseUrl}/api/front-desk/whisper?clientId=${encodeURIComponent(clientId)}` +
      (inboundFrom ? `&caller=${encodeURIComponent(inboundFrom)}` : "")
    : null;
  const whisperAttr = whisperUrl ? ` url="${escapeXml(whisperUrl)}"` : "";

  const numbers = targets
    .map((t) => `    <Number${whisperAttr}>${escapeXml(t.number)}</Number>`)
    .join("\n");
  return [
    `  <Dial timeout="${maxTimeout}" answerOnBridge="true"${attr}>`,
    numbers,
    `  </Dial>`,
  ].join("\n");
}

export function buildInboundCallTwiml(
  routing: VoiceRouting,
  clientId: string,
  baseUrl: string,
  inboundFrom: string
): string {
  const targets =
    Array.isArray(routing.ringTargets) && routing.ringTargets.length > 0
      ? routing.ringTargets
      : [];
  const vmAction = `${baseUrl}/api/front-desk/voicemail-complete?clientId=${encodeURIComponent(
    clientId
  )}&from=${encodeURIComponent(inboundFrom)}`;
  const vmMaxLen = routing.voicemailMaxLengthSeconds ?? 180;
  const greeting = routing.voicemailGreeting ?? DEFAULT_VOICEMAIL_GREETING;

  const ringMode =
    routing.ringMode === "simultaneous" ? "simultaneous" : "sequential";
  const whisperEnabled = routing.whisperEnabled === true;

  let dials = "";
  if (targets.length > 0) {
    dials =
      ringMode === "simultaneous"
        ? buildSimultaneousDial(
            routing,
            targets,
            baseUrl,
            clientId,
            inboundFrom,
            whisperEnabled
          )
        : buildSequentialDials(routing, targets, inboundFrom);
  }

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<Response>`,
    dials,
    `  <Say voice="Polly.Joanna">${escapeXml(greeting)}</Say>`,
    `  <Record action="${escapeXml(vmAction)}" method="POST" maxLength="${vmMaxLen}" playBeep="true" trim="trim-silence" timeout="5"/>`,
    `  <Say voice="Polly.Joanna">We did not receive a recording. Goodbye.</Say>`,
    `</Response>`,
  ]
    .filter((line) => line.length > 0)
    .join("\n");
}

/**
 * Format a phone number as dash-separated digits so a TTS engine speaks
 * each digit individually instead of as a cardinal number.
 *
 *   "+19495551234"  -> "1-9-4-9-5-5-5-1-2-3-4"
 *   "(949) 555-1234" -> "9-4-9-5-5-5-1-2-3-4"
 *
 * Returns null when fewer than 10 digits are present.
 */
export function formatPhoneForSpeech(e164: string | null): string | null {
  if (!e164) return null;
  const digits = e164.replace(/\D/g, "");
  if (digits.length < 10) return null;
  return digits.split("").join("-");
}

export function buildWhisperTwiml(params: {
  brandName: string;
  caller: string | null;
  confirmAction: string;
}): string {
  const spoken = formatPhoneForSpeech(params.caller);
  const prompt = spoken
    ? `Incoming call for ${params.brandName} from ${spoken}. Press 1 to accept.`
    : `Incoming call for ${params.brandName}. Press 1 to accept.`;
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<Response>`,
    `  <Gather numDigits="1" timeout="10" action="${escapeXml(params.confirmAction)}" method="POST">`,
    `    <Say voice="Polly.Joanna">${escapeXml(prompt)}</Say>`,
    `  </Gather>`,
    `  <Hangup/>`,
    `</Response>`,
  ].join("\n");
}
