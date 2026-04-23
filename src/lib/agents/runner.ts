/**
 * Shared conversation runner used by Front Desk and Care API routes.
 *
 * One function, two agents. The runner:
 *   1. Loads the session (or creates a new one)
 *   2. Persists the visitor's message
 *   3. Builds the system prompt (soul + identity + bootstrap + config +
 *      runtime context)
 *   4. Pulls the conversation history from Supabase and asks Claude
 *      for a reply
 *   5. Classifies intent, checks escalation rules
 *   6. Persists the assistant reply
 *   7. Fires a Telegram alert if escalation triggered
 *   8. Returns the reply to the caller
 *
 * The "sessions table" and "messages table" names are injected so the
 * same function serves both front-desk and care data.
 */

import { classifyIntent, claudeComplete } from "./claude";
import { getClientConfig } from "./config";
import { sendAgentEmailAlert } from "./email-alert";
import { buildSystemPrompt } from "./prompts";
import { sendOwnerSmsAlert } from "./sms-alert";
import { sbInsert, sbSelect, sbUpdate } from "./supabase";
import { sendTelegramAlert } from "./telegram";
import type {
  AgentKind,
  AgentMessagePayload,
  AgentMessageResponse,
  Channel,
  ChatMessage,
  Intent,
} from "./types";

interface RunnerTables {
  sessions: string; // "front_desk_sessions" | "care_sessions"
  messages: string; // "front_desk_messages" | "care_messages"
}

/**
 * In-process rate-limit map for every-turn SMS alerts.
 *
 * Keyed by session id, value is the epoch-ms of the last shadow-SMS send.
 * This is intentionally memory-only: serverless instances recycle, which
 * is fine — worst case a cold instance sends one extra SMS per session.
 * Use sms_config.everyTurnRateLimitMs to tune (default 60_000).
 */
const shadowSmsLastAlert = new Map<string, number>();

/**
 * Build a deep-link to the agent inbox page for a session.
 *
 * The inbox UI lives at /admin/sessions/[id]?agent=<kind>. Auth is
 * handled in-app — if Nikki's browser session is expired the admin
 * login page catches her and bounces back after sign-in.
 *
 * Base URL order: sms_config.inboxBaseUrl → NEXT_PUBLIC_SITE_URL env
 * → hard-coded production default. Keeps preview deployments and
 * local dev flexible without touching code.
 */
function buildInboxUrl(sessionId: string, agent: AgentKind): string {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.opsbynoell.com";
  return `${base}/admin/sessions/${sessionId}?agent=${agent}`;
}

interface SessionRow {
  id: string;
  client_id: string;
  human_takeover: boolean;
  trigger_type: string;
  channel: Channel;
  visitor_name: string | null;
  visitor_phone: string | null;
  visitor_email: string | null;
  notes: string | null;
}

interface MessageRow {
  role: "visitor" | "bot" | "human" | "system";
  content: string;
  created_at: string;
}

async function loadOrCreateSession(
  payload: AgentMessagePayload,
  tables: RunnerTables,
  triggerType: string
): Promise<SessionRow> {
  if (payload.sessionId) {
    const rows = await sbSelect<SessionRow>(
      tables.sessions,
      { id: `eq.${payload.sessionId}` },
      { limit: 1 }
    );
    if (rows.length > 0) return rows[0];
  }
  return sbInsert<SessionRow>(tables.sessions, {
    client_id: payload.clientId,
    trigger_type: triggerType,
    channel: payload.channel,
    visitor_name: payload.from.name,
    visitor_phone: payload.from.phone,
    visitor_email: payload.from.email,
    visitor_ip: payload.from.ip,
  });
}

function toChatHistory(rows: MessageRow[]): ChatMessage[] {
  return rows.map((r) => ({
    role: r.role,
    content: r.content,
    timestamp: r.created_at,
  }));
}

function checkEscalationKeywords(
  text: string,
  rules?: { match: string[]; reason: string }[]
): string | null {
  if (!rules) return null;
  const lower = text.toLowerCase();
  for (const r of rules) {
    if (r.match.some((m) => lower.includes(m.toLowerCase()))) {
      return r.reason;
    }
  }
  return null;
}

export async function runTurn({
  agent,
  payload,
  tables,
  defaultTriggerType,
  runtimeContext,
}: {
  agent: AgentKind;
  payload: AgentMessagePayload;
  tables: RunnerTables;
  defaultTriggerType: string;
  /** Optional per-turn extra context (e.g. KB hits for Care). */
  runtimeContext?: string;
}): Promise<AgentMessageResponse> {
  const cfg = await getClientConfig(payload.clientId);
  if (!cfg.active) {
    throw new Error(`Client ${payload.clientId} is not active`);
  }
  if (!cfg.agents[agent]) {
    throw new Error(
      `Agent "${agent}" is not enabled for client ${payload.clientId}`
    );
  }

  const session = await loadOrCreateSession(
    payload,
    tables,
    defaultTriggerType
  );

  // Persist the visitor message.
  await sbInsert(tables.messages, {
    session_id: session.id,
    role: "visitor",
    content: payload.message,
  });

  // If a human has taken over, don't reply — just store and return.
  if (session.human_takeover) {
    await sbUpdate(
      tables.sessions,
      { id: `eq.${session.id}` },
      { unread_count: 0 }
    );
    return {
      sessionId: session.id,
      reply: "",
      intent: "unknown",
      escalated: false,
    };
  }

  // Pull the last 30 messages for context.
  const history = await sbSelect<MessageRow>(
    tables.messages,
    { session_id: `eq.${session.id}` },
    { limit: 30, order: "created_at.asc" }
  );

  const systemPrompt = buildSystemPrompt({
    kind: agent,
    cfg,
    runtimeContext:
      [
        runtimeContext,
        session.visitor_name ? `Visitor name: ${session.visitor_name}` : null,
        session.visitor_phone
          ? `Visitor phone: ${session.visitor_phone}`
          : null,
        `Session trigger: ${session.trigger_type}`,
        `Channel: ${session.channel}`,
      ]
        .filter(Boolean)
        .join("\n") || undefined,
  });

  const messages = toChatHistory(history).map((m) => ({
    role: m.role === "visitor" ? ("user" as const) : ("assistant" as const),
    content: m.content,
  }));

  // If the last message isn't from the visitor (rare race), ensure we
  // at least end on user.
  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    messages.push({ role: "user", content: payload.message });
  }

  const ai = await claudeComplete({
    system: systemPrompt,
    messages,
    maxTokens: 500,
    temperature: 0.7,
  });

  // Classify and check escalation.
  const classification = await classifyIntent(
    payload.message,
    `Agent: ${agent}. Business: ${cfg.businessName}.`
  );
  const keywordReason = checkEscalationKeywords(
    payload.message,
    cfg.escalationRules
  );
  const escalated = classification.escalate || Boolean(keywordReason);
  const intent: Intent = classification.intent;

  // Every-turn SMS alert — fires on every visitor message (not just escalations).
  // Useful during early testing so the operator can jump into the inbox live.
  // Gated behind sms_config.everyTurnSms === true. Skips if the turn is already
  // being escalated (the escalation SMS below will fire with richer context).
  // Rate-limited to one SMS per session per SHADOW_SMS_RATE_LIMIT_MS (default 60s)
  // to prevent spam loops from rapid-fire messages.
  const everyTurnEnabled = Boolean(cfg.smsConfig?.everyTurnSms);
  if (everyTurnEnabled && !escalated) {
    const rateLimitMs = Number(
      cfg.smsConfig?.everyTurnRateLimitMs ?? 60_000
    );
    const lastAlertAt = shadowSmsLastAlert.get(session.id) ?? 0;
    const now = Date.now();
    if (now - lastAlertAt >= rateLimitMs) {
      shadowSmsLastAlert.set(session.id, now);
      const who =
        session.visitor_name ??
        session.visitor_phone ??
        session.visitor_email ??
        "anon visitor";
      const snippet = payload.message
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 140);
      const inboxUrl = buildInboxUrl(session.id, agent);
      const shadowBody =
        `Chat turn (${cfg.businessName})\n` +
        `From: ${who}\n` +
        `"${snippet}"\n` +
        `Open: ${inboxUrl}`;
      // Fire-and-forget — do not block the reply.
      void sendOwnerSmsAlert({
        cfg,
        message: shadowBody,
        sessionContext: { sessionId: session.id, agent },
      });
    }
  }

  // Persist the assistant reply.
  await sbInsert(tables.messages, {
    session_id: session.id,
    role: "bot",
    content: ai.text,
    metadata: {
      intent,
      escalated,
      usage: ai.usage,
    },
  });

  await sbUpdate(
    tables.sessions,
    { id: `eq.${session.id}` },
    { intent, updated_at: new Date().toISOString() }
  );

  if (escalated) {
    const AGENT_LABEL: Record<typeof agent, string> = {
      support: "Noell Support",
      frontDesk: "Noell Front Desk",
      care: "Noell Care",
    };
    const reason = keywordReason ?? classification.reason ?? "classifier";
    const visitor =
      session.visitor_phone ?? session.visitor_name ?? "visitor";
    const alertText =
      `Escalation from ${visitor}\n` +
      `Reason: ${reason}\n` +
      `Session: ${session.id}\n` +
      `Last message: "${payload.message}"`;

    const agentLabel = AGENT_LABEL[agent];
    const inboxUrl = buildInboxUrl(session.id, agent);
    const smsAlertBody =
      `New ${agentLabel} lead (${cfg.businessName})\n` +
      `${session.visitor_name ?? "Unknown"} — ${session.visitor_phone ?? session.visitor_email ?? "no contact"}\n` +
      `Why: ${reason}\n` +
      `Open: ${inboxUrl}`;

    await Promise.all([
      sendTelegramAlert({
        agent,
        businessName: cfg.businessName,
        chatId: cfg.telegramChatId,
        message: alertText,
      }),
      sendAgentEmailAlert({
        subject: `New ${agentLabel} lead — ${session.visitor_name ?? "Unknown"}`,
        text:
          `New ${agentLabel} lead\n\n` +
          `Name: ${session.visitor_name ?? "Unknown"}\n` +
          `Business: ${cfg.businessName}${cfg.vertical ? ` (${cfg.vertical})` : ""}\n` +
          `Problem: ${reason}\n` +
          `Contact: ${session.visitor_email ?? "—"} / ${session.visitor_phone ?? "—"}\n` +
          `Next step: discovery call\n\n` +
          `Open inbox: ${inboxUrl}\n\n` +
          `Conversation snippet:\n${payload.message.slice(0, 500)}`,
      }),
      sendOwnerSmsAlert({
        cfg,
        message: smsAlertBody,
        sessionContext: { sessionId: session.id, agent },
      }),
    ]);
  }

  return {
    sessionId: session.id,
    reply: ai.text,
    intent,
    escalated,
  };
}
