/**
 * Inbound visitor-SMS bridge — core handler logic.
 *
 * Distinct from inbound-sms-handler.ts:
 *   - inbound-sms-handler      — owner replies to alert SMS (Nikki → LC Phone)
 *   - inbound-visitor-sms      — a lead / customer texts the LC Phone (new or
 *                                existing conversation)
 *
 * On each inbound visitor SMS we:
 *   1. Resolve which client owns the LC Phone (by `sms_config.fromNumber`)
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
  /** The LC Phone number that received the SMS (E.164) — used to resolve client. */
  toPhone: string;
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
 * GHL Conversations webhook (primary):
 *   { phone, toNumber, body, contactId?, conversationId? }
 *
 * LC workflow action (alternate aliases):
 *   { from, to, message }
 *
 * Returns null when either phone is missing — we can't route without both.
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
    (body.to as string | undefined) ??
    null;

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

  if (!fromPhone || !toPhone) return null;
  return { fromPhone, toPhone, messageText, contactId, conversationId };
}

// ---------------------------------------------------------------------------
// Client resolution by LC Phone number
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
 *
 * NOTE: We intentionally select by the narrow pair of fields rather than
 * pulling the full config — getClientConfig() will fetch + memoize the full
 * row afterwards.
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
