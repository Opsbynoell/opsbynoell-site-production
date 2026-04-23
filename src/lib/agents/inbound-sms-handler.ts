/**
 * Two-way SMS reply bridge — core handler logic.
 *
 * Extracted from the Next.js route so it can be unit-tested without
 * needing the Next.js runtime or a bundler.
 *
 * Phone semantics (CRITICAL):
 *   Outbound alert:  from = fromNumber (+19499973915)  →  to = alertSmsTo (+19497849726)
 *   Nikki's reply:   from = +19497849726               →  to = +19499973915
 *   Table key:       from_phone = alertSmsTo (the REPLIER)
 *                    to_phone   = fromNumber (the receiver / LC Phone)
 */

import { sbInsert, sbSelect, sbUpdate } from "./supabase";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SmsAlertSessionRow {
  from_phone: string;
  to_phone: string;
  session_id: string;
  agent: "support" | "frontDesk" | "care";
  client_id: string;
}

export interface InboundSmsPayload {
  /** Sender phone (E.164) — the owner / alertSmsTo. Maps to from_phone in table. */
  fromPhone: string;
  /**
   * Receiving LC Phone (E.164) — the fromNumber used for outbound. Maps to to_phone.
   * Optional: when absent the handler falls back to the most recent session row
   * matching from_phone (ORDER BY created_at DESC LIMIT 1). Safe because one owner
   * phone normally has only one active session at a time.
   */
  toPhone: string | null;
  /** The SMS body text sent by the owner. */
  messageText: string;
}

export type InboundSmsResult =
  | { ok: true; sessionId: string }
  | { ok: false; reason: string };

// ---------------------------------------------------------------------------
// Table routing
// ---------------------------------------------------------------------------

/**
 * Resolve the Supabase table names for a given agent kind.
 * Mirrors the logic in takeover/route.ts and message/route.ts.
 */
export function resolveTables(agent: string): {
  sessionsTable: string;
  messagesTable: string;
  humanTakeoverField: string;
  updatedAtField: string;
  sessionIdField: string;
} {
  switch (agent) {
    case "frontDesk":
      return {
        sessionsTable: "front_desk_sessions",
        messagesTable: "front_desk_messages",
        humanTakeoverField: "human_takeover",
        updatedAtField: "updated_at",
        sessionIdField: "session_id",
      };
    case "care":
      return {
        sessionsTable: "care_sessions",
        messagesTable: "care_messages",
        humanTakeoverField: "human_takeover",
        updatedAtField: "updated_at",
        sessionIdField: "session_id",
      };
    default:
      // "support" → chatSessions / chatMessages (legacy camelCase columns)
      return {
        sessionsTable: "chatSessions",
        messagesTable: "chatMessages",
        humanTakeoverField: "humanTakeover",
        updatedAtField: "updatedAt",
        sessionIdField: "sessionId",
      };
  }
}

// ---------------------------------------------------------------------------
// Core handler
// ---------------------------------------------------------------------------

/**
 * Handle an inbound owner SMS and route it into the visitor's session.
 *
 * Steps:
 *   1. Look up sms_alert_sessions by (from_phone, to_phone)
 *   2. If not found → return no-op (unknown sender)
 *   3. Insert a human message with author "Nikki (human)"
 *   4. Flip humanTakeover=true on the session
 */
export async function handleInboundSms(
  payload: InboundSmsPayload
): Promise<InboundSmsResult> {
  const { fromPhone, toPhone, messageText } = payload;

  // ── 1. Look up session mapping ───────────────────────────────────────────
  let mapping: SmsAlertSessionRow | null = null;
  try {
    if (toPhone) {
      // Exact match when toNumber is provided.
      const rows = await sbSelect<SmsAlertSessionRow>(
        "sms_alert_sessions",
        {
          from_phone: `eq.${fromPhone}`,
          to_phone:   `eq.${toPhone}`,
        },
        { limit: 1 }
      );
      mapping = rows[0] ?? null;
    } else {
      // toNumber was absent from the webhook — fall back to most recent session
      // for this sender. One owner phone normally has only one active session.
      console.info(
        `[inbound-sms] toPhone missing for ${fromPhone} — falling back to most recent session`
      );
      const rows = await sbSelect<SmsAlertSessionRow>(
        "sms_alert_sessions",
        {
          from_phone: `eq.${fromPhone}`,
        },
        { limit: 1, order: "created_at.desc" }
      );
      mapping = rows[0] ?? null;
    }
  } catch (err) {
    console.error("[inbound-sms] Supabase lookup failed:", err);
    return { ok: false, reason: "db_error" };
  }

  if (!mapping) {
    console.warn(
      `[inbound-sms] No session mapping for from=${fromPhone} to=${toPhone} — no-op`
    );
    return { ok: false, reason: "no_mapping" };
  }

  const { session_id, agent } = mapping;
  const text = messageText.trim() || "(empty)";

  console.info(
    `[inbound-sms] Reply from ${fromPhone} → session=${session_id} agent=${agent}: "${text.slice(0, 80)}"`
  );

  // ── 2. Resolve tables for the agent ──────────────────────────────────────
  const {
    sessionsTable,
    messagesTable,
    humanTakeoverField,
    updatedAtField,
    sessionIdField,
  } = resolveTables(agent);

  // ── 3. Insert message + flip takeover ────────────────────────────────────
  const messageRow: Record<string, unknown> = {
    [sessionIdField]: session_id,
    role: "human",
    content: text,
    author: "Nikki (human)",
  };

  const sessionPatch: Record<string, unknown> = {
    [humanTakeoverField]: true,
    [updatedAtField]: new Date().toISOString(),
  };

  try {
    await Promise.all([
      sbInsert(messagesTable, messageRow),
      sbUpdate(
        sessionsTable,
        { id: `eq.${session_id}` },
        sessionPatch
      ),
    ]);
  } catch (err) {
    console.error(
      `[inbound-sms] Failed to write message/takeover for session=${session_id}:`,
      err
    );
    return { ok: false, reason: "db_write_error" };
  }

  return { ok: true, sessionId: session_id };
}

// ---------------------------------------------------------------------------
// Payload extractor — normalises GHL/LC webhook variants
// ---------------------------------------------------------------------------

/**
 * Extract phones and message text from any GHL webhook body variant.
 *
 * GHL Conversations webhook (primary):
 *   { phone: "+1...", toNumber: "+1...", body: "..." }
 *
 * LC Workflow action (alternate):
 *   { from: "+1...", to: "+1...", message: "..." }
 */
export function extractInboundPayload(
  body: Record<string, unknown>
): { fromPhone: string; toPhone: string; messageText: string } | null {
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

  if (!fromPhone) return null;
  return { fromPhone, toPhone: toPhone ?? null, messageText };
}
