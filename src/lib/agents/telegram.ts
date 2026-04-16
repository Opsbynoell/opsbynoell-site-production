/**
 * Telegram alert sender for operator notifications.
 *
 * Every escalation event from any agent goes through `sendTelegramAlert`.
 * Messages are formatted so the operator can see which agent triggered,
 * which client it was for, and the context of the conversation.
 */

import { env } from "./env";
import type { AgentKind } from "./types";

const AGENT_LABEL: Record<AgentKind, string> = {
  support: "Noell Support",
  frontDesk: "Noell Front Desk",
  care: "Noell Care",
};

export async function sendTelegramAlert({
  agent,
  businessName,
  chatId,
  message,
}: {
  agent: AgentKind;
  businessName: string;
  chatId?: string | null;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  const token = env.telegramBotToken();
  const target = chatId || env.telegramDefaultChatId();
  if (!token || !target) {
    // We still return ok=false so the caller can log it, but we do NOT
    // throw — a missing Telegram config should never 500 a user-facing
    // conversation.
    return { ok: false, error: "telegram not configured" };
  }
  const body =
    `*[${AGENT_LABEL[agent]}]* — ${businessName}\n\n${message}`.slice(0, 3900);
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: target,
          text: body,
          parse_mode: "Markdown",
        }),
      }
    );
    if (!res.ok) {
      return { ok: false, error: await res.text() };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
