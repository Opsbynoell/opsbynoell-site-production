/**
 * Owner SMS alert sender.
 *
 * Sends a qualified-lead SMS to the owner via whatever SMS provider the
 * client is configured for (GHL LC Phone, Twilio, etc.). Destination
 * number is read from `cfg.smsConfig.alertSmsTo` (E.164).
 *
 * Fails soft: a missing alertSmsTo or a send failure logs a warning and
 * returns `{ ok: false }` so a visitor-facing chat request never 500s
 * because the operator-notification channel is down.
 *
 * Two-way reply bridge
 * --------------------
 * When optional `sessionContext` is provided, a successful send upserts
 * a row into `sms_alert_sessions` so the inbound-SMS webhook can
 * correlate an owner reply back to the originating visitor session.
 *
 * Phone semantics:
 *   outbound:  from=cfg.smsConfig.fromNumber  →  to=cfg.smsConfig.alertSmsTo
 *   inbound reply:  from=alertSmsTo  →  to=fromNumber
 * So we store (from_phone=alertSmsTo, to_phone=fromNumber) as the PK —
 * matching exactly how GHL delivers the reply to our inbound webhook.
 */

import { getSmsIntegration } from "./integrations/registry";
import { sbUpsert } from "./supabase";
import type { AgentKind, ClientConfig } from "./types";

export interface SmsAlertSessionContext {
  sessionId: string;
  agent: AgentKind;
}

export async function sendOwnerSmsAlert(params: {
  cfg: ClientConfig;
  message: string;
  /** When supplied the send is correlated to a session for reply routing. */
  sessionContext?: SmsAlertSessionContext;
}): Promise<{ ok: boolean; error?: string; messageId?: string }> {
  const to = (params.cfg.smsConfig?.alertSmsTo as string | undefined) ?? undefined;
  if (!to) {
    console.warn(
      `[sms-alert] No alertSmsTo configured for client=${params.cfg.clientId} — SMS alert skipped`
    );
    return { ok: false, error: "no_alert_sms_to" };
  }
  try {
    const sms = getSmsIntegration(params.cfg);
    const { messageId } = await sms.sendSMS(to, params.message);

    // Two-way reply bridge: persist the session mapping so the inbound
    // webhook can correlate a reply back to this session.
    //
    // from_phone = alertSmsTo (the owner's number — this is who will reply)
    // to_phone   = fromNumber (the LC Phone number that receives the reply)
    //
    // We upsert rather than insert so repeated alerts for the same
    // owner↔number pair (one per session at most, because that is how the
    // PK works) always point to the most-recent session.
    if (params.sessionContext) {
      const fromNumber = params.cfg.smsConfig?.fromNumber as string | undefined;
      if (fromNumber) {
        // Fire-and-forget — a mapping failure must never block the alert.
        void sbUpsert(
          "sms_alert_sessions",
          {
            from_phone: to,         // Nikki's cell (will be inbound `from`)
            to_phone:   fromNumber, // LC Phone     (will be inbound `to`)
            session_id: params.sessionContext.sessionId,
            agent:      params.sessionContext.agent,
            client_id:  params.cfg.clientId,
            created_at: new Date().toISOString(),
          },
          "from_phone,to_phone"
        ).catch((err: unknown) => {
          console.error(
            `[sms-alert] failed to upsert sms_alert_sessions for session=${params.sessionContext!.sessionId}:`,
            err instanceof Error ? err.message : err
          );
        });
      } else {
        console.warn(
          `[sms-alert] sessionContext supplied but smsConfig.fromNumber is missing — reply routing skipped for client=${params.cfg.clientId}`
        );
      }
    }

    return { ok: true, messageId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error(
      `[sms-alert] send failed for client=${params.cfg.clientId}:`,
      message
    );
    return { ok: false, error: message };
  }
}
