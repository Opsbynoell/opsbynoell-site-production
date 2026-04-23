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
 */

import { getSmsIntegration } from "./integrations/registry";
import type { ClientConfig } from "./types";

export async function sendOwnerSmsAlert(params: {
  cfg: ClientConfig;
  message: string;
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
