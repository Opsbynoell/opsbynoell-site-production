/**
 * Inbound visitor-SMS bridge — core handler logic.
 *
 * Distinct from inbound-sms-handler.ts:
 *   - inbound-sms-handler      — owner replies to alert SMS (Nikki → LC Phone)
 *   - inbound-visitor-sms      — a lead / customer texts the LC Phone (new or
 *                                existing conversation)
 *
 * On each inbound visitor SMS we:
 *   1. Resolve which client owns the LC Phone. Resolution tries in order:
 *        a. `toPhone` matches `clients.sms_config->>fromNumber`
 *        b. `locationId` matches `clients.sms_config->>locationId`
 *        c. exactly one active client has a `sms_config.fromNumber`
 *           configured (single-tenant fallback — safe for the current
 *           one-tenant-per-LC-Phone install; explicitly errors out when
 *           multiple clients would match)
 *   2. Call runTurn() to persist the visitor message and generate a reply
 *   3. If human_takeover is on OR the reply is empty, skip the outbound
 *   4. Otherwise, send the bot's reply back to the visitor via the
 *      configured messaging integration
 *
 * This module stays pure — no Next.js imports — so it can be unit tested
 * with mocks for Supabase / the messaging integration.
 */

import { sbSelect } from "./supabase";
import type { AgentKind, ClientConfig, MessagingIntegration } from "./types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface InboundVisitorSmsPayload {
  /** The visitor / lead phone number (E.164). */
  fromPhone: string;
  /**
   * The LC Phone number that received the SMS (E.164) — preferred way to
   * resolve the client. Optional because GHL rejects `{{message.to_number}}`
   * in some workflow triggers; in that case we fall back to `locationId`
   * or the single-client shortcut.
   */
  toPhone?: string;
  /** Optional GHL locationId — used as a fallback for client resolution. */
  locationId?: string;
  /** Message body as sent by the visitor. */
  messageText: string;
  /** Optional GHL contact id, when the webhook supplies it. */
  contactId?: string;
  /** Optional GHL conversation id, when the webhook supplies it. */
  conversationId?: string;
}

export interface OutboundVisitorSmsPayload {
  /** E.164 visitor destination. */
  to: string;
  /** Rendered reply text. */
  body: string;
  /** Agent kind — drives logging + downstream analytics. */
  agent: AgentKind;
  /** Session id for observability. */
  sessionId: string;
  /** Client id the send belongs to. */
  clientId: string;
}

export type InboundVisitorSmsResult =
  | {
      ok: true;
      sessionId: string;
      /** The bot reply text (or empty when human_takeover suppressed it). */
      reply: string;
      /** True if the reply was actually dispatched over SMS. */
      replySent: boolean;
      /** Optional upstream provider message id for the outbound SMS. */
      replyMessageId?: string;
      /** Populated when the outbound send failed but message was stored. */
      replyError?: string;
    }
  | { ok: false; reason: string };

// ---------------------------------------------------------------------------
// Payload extraction
// ---------------------------------------------------------------------------

/**
 * Normalise a GHL / LeadConnector Conversations webhook body into the
 * shape we need.
 *
 * GHL Conversations webhook (canonical — no toNumber required):
 *   { phone, body, contactId?, conversationId?, locationId? }
 *
 * Legacy / richer shapes (still supported):
 *   { phone, toNumber, body, contactId?, conversationId? }
 *   { from, to, message }                       // LC workflow aliases
 *
 * Returns null when the visitor phone is missing — we can't do anything
 * without knowing who texted in.
 */
export function extractInboundVisitorPayload(
  body: Record<string, unknown>
): InboundVisitorSmsPayload | null {
  const fromPhone =
    (body.phone as string | undefined) ??
    (body.from as string | undefined) ??
    null;

  const toPhone =
    (body.toNumber as string | undefined) ??
    (body.to_number as string | undefined) ??
    (body.to as string | undefined) ??
    undefined;

  const locationId =
    (body.locationId as string | undefined) ??
    (body.location_id as string | undefined) ??
    undefined;

  const messageText =
    (body.body as string | undefined) ??
    (body.message as string | undefined) ??
    "";

  const contactId =
    (body.contactId as string | undefined) ??
    (body.contact_id as string | undefined) ??
    undefined;

  const conversationId =
    (body.conversationId as string | undefined) ??
    (body.conversation_id as string | undefined) ??
    undefined;

  if (!fromPhone) return null;
  return {
    fromPhone,
    toPhone: toPhone || undefined,
    locationId: locationId || undefined,
    messageText,
    contactId,
    conversationId,
  };
}

// ---------------------------------------------------------------------------
// Client resolution
// ---------------------------------------------------------------------------

interface ClientSmsIndexRow {
  client_id: string;
  sms_config: Record<string, unknown> | null;
}

/**
 * Find a client whose `sms_config.fromNumber` matches the destination phone
 * number. PostgREST JSONB filter syntax: `sms_config->>fromNumber=eq.<E.164>`.
 *
 * Returns the `client_id` of the first match, or null when no client is
 * configured for that LC Phone.
 */
export async function findClientIdByInboundToPhone(
  toPhone: string
): Promise<string | null> {
  const rows = await sbSelect<ClientSmsIndexRow>(
    "clients",
    { "sms_config->>fromNumber": `eq.${toPhone}`, active: "eq.true" },
    { limit: 1, select: "client_id,sms_config" }
  );
  return rows[0]?.client_id ?? null;
}

/**
 * Fallback resolver — match on `sms_config.locationId` (the GHL location
 * that owns the LC Phone). Used when the webhook payload omits `toNumber`
 * but supplies `locationId` instead (either explicitly in the body or
 * via the LC `{{location.id}}` merge field).
 */
export async function findClientIdByLocationId(
  locationId: string
): Promise<string | null> {
  const rows = await sbSelect<ClientSmsIndexRow>(
    "clients",
    {
      "sms_config->>locationId": `eq.${locationId}`,
      active: "eq.true",
    },
    { limit: 2, select: "client_id,sms_config" }
  );
  if (rows.length === 0) return null;
  if (rows.length > 1) {
    // Two clients sharing a locationId is a config bug — refuse rather
    // than silently routing to the first row.
    throw new Error(
      `multiple active clients share sms_config.locationId=${locationId}`
    );
  }
  return rows[0].client_id;
}

/**
 * Last-resort resolver for the single-tenant case. Returns a `client_id`
 * only when there is EXACTLY ONE active client with a configured
 * `sms_config.fromNumber` — in other words, the resolution is
 * unambiguous. Returns `{ambiguous:true, candidates:[...]}` if more than
 * one would match, and `null` when none do.
 */
export async function findSoleActiveSmsClient(): Promise<
  | { kind: "ok"; clientId: string; fromNumber?: string }
  | { kind: "none" }
  | { kind: "ambiguous"; candidates: string[] }
> {
  const rows = await sbSelect<ClientSmsIndexRow>(
    "clients",
    {
      "sms_config->>fromNumber": "not.is.null",
      active: "eq.true",
    },
    { limit: 5, select: "client_id,sms_config" }
  );
  if (rows.length === 0) return { kind: "none" };
  if (rows.length > 1) {
    return { kind: "ambiguous", candidates: rows.map((r) => r.client_id) };
  }
  const fromNumber =
    (rows[0].sms_config?.fromNumber as string | undefined) ?? undefined;
  return { kind: "ok", clientId: rows[0].client_id, fromNumber };
}

export type ResolveClientResult =
  | { kind: "ok"; clientId: string; via: "toPhone" | "locationId" | "sole" }
  | { kind: "none" }
  | { kind: "ambiguous"; candidates: string[] };

/**
 * High-level client resolution — tries the strategies in order and
 * returns a tagged result the route can map onto response codes.
 *
 * Priority:
 *   1. toPhone → sms_config.fromNumber
 *   2. locationId → sms_config.locationId
 *   3. exactly one active client with sms_config.fromNumber set
 *
 * The `sole` fallback intentionally errors out if two or more clients
 * would match — that guarantees we never misroute a visitor message to
 * the wrong tenant.
 */
export async function resolveClientForInboundVisitorSms(input: {
  toPhone?: string;
  locationId?: string;
}): Promise<ResolveClientResult> {
  if (input.toPhone) {
    const id = await findClientIdByInboundToPhone(input.toPhone);
    if (id) return { kind: "ok", clientId: id, via: "toPhone" };
  }

  if (input.locationId) {
    const id = await findClientIdByLocationId(input.locationId);
    if (id) return { kind: "ok", clientId: id, via: "locationId" };
  }

  const sole = await findSoleActiveSmsClient();
  if (sole.kind === "ok") {
    return { kind: "ok", clientId: sole.clientId, via: "sole" };
  }
  if (sole.kind === "ambiguous") {
    return { kind: "ambiguous", candidates: sole.candidates };
  }
  return { kind: "none" };
}

// ---------------------------------------------------------------------------
// Outbound payload construction
// ---------------------------------------------------------------------------

/**
 * Build the outbound-reply payload that would be handed to the messaging
 * integration. Extracted as a pure function so tests can assert the exact
 * shape without touching fetch / network.
 */
export function buildOutboundVisitorReplyPayload(params: {
  cfg: ClientConfig;
  agent: AgentKind;
  sessionId: string;
  visitorPhone: string;
  replyText: string;
}): OutboundVisitorSmsPayload {
  const body = (params.replyText ?? "").trim();
  return {
    to: params.visitorPhone,
    body,
    agent: params.agent,
    sessionId: params.sessionId,
    clientId: params.cfg.clientId,
  };
}

// ---------------------------------------------------------------------------
// Loop-guard — refuse to reply when fromPhone equals our own LC Phone.
// ---------------------------------------------------------------------------

/**
 * Returns true when the inbound `fromPhone` matches the client's own
 * `sms_config.fromNumber` — which would mean either GHL looped an
 * outbound send back into the webhook OR someone mis-wired the payload.
 * Either way, we must not reply.
 */
export function isOwnNumberLoop(
  cfg: ClientConfig,
  fromPhone: string
): boolean {
  const ownNumber =
    ((cfg.smsConfig ?? {}) as Record<string, unknown>).fromNumber ?? undefined;
  if (!ownNumber) return false;
  return String(ownNumber) === fromPhone;
}

// ---------------------------------------------------------------------------
// Dispatch helper — send the bot's reply over the configured channel.
// ---------------------------------------------------------------------------

export interface DispatchDeps {
  /** Factory — returns the messaging integration for a client. Injected for testing. */
  getSms(cfg: ClientConfig): MessagingIntegration;
}

/**
 * Send the outbound reply to the visitor. Fails soft — any error is
 * returned in `replyError` so the caller can persist a record of it
 * without propagating a 500 to GHL (which would cause retry storms).
 */
export async function dispatchVisitorReply(
  out: OutboundVisitorSmsPayload,
  cfg: ClientConfig,
  deps: DispatchDeps
): Promise<{ sent: boolean; messageId?: string; error?: string }> {
  if (!out.body) {
    return { sent: false, error: "empty_reply" };
  }
  try {
    const sms = deps.getSms(cfg);
    const { messageId } = await sms.sendSMS(out.to, out.body);
    return { sent: true, messageId };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[inbound-visitor-sms] outbound reply failed for session=${out.sessionId}:`,
      message
    );
    return { sent: false, error: message };
  }
}
