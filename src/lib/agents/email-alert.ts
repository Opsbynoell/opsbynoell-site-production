/**
 * Email alert sender for operator notifications (interim).
 *
 * Used in parallel with `sendTelegramAlert` while Twilio SMS is still
 * waiting on A2P 10DLC campaign approval. Once SMS is live, Nikki can
 * decide whether to keep email, swap to SMS, or keep both.
 *
 * Fails soft: a missing `RESEND_API_KEY` logs a warning and returns
 * `{ ok: false }` rather than throwing, so a visitor-facing request
 * never 500s because the operator-notification channel is down.
 */

import { Resend } from "resend";
import { env } from "./env";

const resend = env.resendApiKey() ? new Resend(env.resendApiKey()!) : null;

export async function sendAgentEmailAlert(params: {
  subject: string;
  text: string;
  toEmail?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!resend) {
    console.warn("[email-alert] Resend not configured — alert skipped");
    return { ok: false, error: "resend_not_configured" };
  }

  try {
    await resend.emails.send({
      from: env.resendFromEmail(),
      to: params.toEmail ?? env.alertToEmail(),
      subject: params.subject,
      text: params.text,
    });
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    console.error("[email-alert] send failed:", message);
    return { ok: false, error: message };
  }
}
