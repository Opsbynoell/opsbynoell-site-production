/**
 * Claude API client (Messages API).
 *
 * We call the Anthropic HTTP API directly with fetch. No SDK import so
 * this stays bundle-light in Vercel serverless functions.
 *
 * Model default: claude-sonnet-4-20250514 (same as Noell Support).
 */

import { env } from "./env";

export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeResponse {
  text: string;
  stopReason: string;
  usage: { inputTokens: number; outputTokens: number };
}

interface AnthropicApiResponse {
  content: Array<{ type: string; text?: string }>;
  stop_reason: string;
  usage: { input_tokens: number; output_tokens: number };
}

export async function claudeComplete({
  system,
  messages,
  maxTokens = 1024,
  temperature = 0.7,
}: {
  system: string;
  messages: ClaudeMessage[];
  maxTokens?: number;
  temperature?: number;
}): Promise<ClaudeResponse> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": env.anthropicApiKey(),
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: env.anthropicModel(),
      max_tokens: maxTokens,
      temperature,
      system,
      messages,
    }),
  });
  if (!res.ok) {
    throw new Error(
      `claude api failed: ${res.status} ${await res.text()}`
    );
  }
  const data = (await res.json()) as AnthropicApiResponse;
  const text = data.content
    .filter((c) => c.type === "text")
    .map((c) => c.text ?? "")
    .join("");
  return {
    text,
    stopReason: data.stop_reason,
    usage: {
      inputTokens: data.usage.input_tokens,
      outputTokens: data.usage.output_tokens,
    },
  };
}

/**
 * Classifier — returns an intent bucket plus an escalation flag.
 * We call Claude with a small, deterministic prompt and parse the JSON
 * it returns. If parsing fails for any reason we fall back to
 * `unknown` rather than blowing up the request.
 */
export async function classifyIntent(
  lastVisitorMessage: string,
  context: string
): Promise<{
  intent: "hot" | "warm" | "low" | "unknown";
  escalate: boolean;
  reason: string;
}> {
  try {
    const r = await claudeComplete({
      system:
        "You classify the intent of a short message into exactly one of: hot, warm, low, unknown. " +
        "Return ONLY JSON of the form {\"intent\":\"hot|warm|low|unknown\",\"escalate\":true|false,\"reason\":\"...\"}. " +
        "hot = ready to book / buy / urgent. warm = interested, asking questions. low = idle / unclear / spam. " +
        "escalate=true if: explicit request for a human, complaint, legal/medical/safety concern, or anything you cannot answer. " +
        "No prose. Pure JSON.",
      messages: [
        {
          role: "user",
          content: `Context: ${context}\n\nMessage: ${lastVisitorMessage}`,
        },
      ],
      maxTokens: 120,
      temperature: 0,
    });
    const parsed = JSON.parse(r.text);
    return {
      intent: parsed.intent ?? "unknown",
      escalate: Boolean(parsed.escalate),
      reason: String(parsed.reason ?? ""),
    };
  } catch {
    return { intent: "unknown", escalate: false, reason: "" };
  }
}
