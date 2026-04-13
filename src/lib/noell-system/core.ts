/**
 * Core runtime for the Noell system.
 *
 * Intentionally UI-agnostic. This module exposes:
 *   - intent matching (map visitor input → IntentHandler)
 *   - escalation evaluation (decide when to hand off to a human)
 *   - token interpolation ({{businessName}}, {{bookingUrl}}, etc.)
 *   - a reducer-style conversation step function
 *
 * The generic chat widget (components/noell-chat.tsx) drives state + timing;
 * this module decides what happens given a message.
 */

import type {
  AgentConfig,
  ClientConfig,
  IntentHandler,
  Message,
  Stage,
  RouteTarget,
  EscalationRule,
} from "./types";

// ---------------------------------------------------------------------------
// Token interpolation
// ---------------------------------------------------------------------------

/**
 * Resolve {{token}} placeholders in a string using ClientConfig + ad-hoc fields.
 *
 * Supported tokens: businessName, bookingUrl, phone, email, hours, and any
 * keys passed in `extra` (e.g. capturedName, capturedPhone).
 */
export function interpolate(
  template: string,
  client: ClientConfig,
  extra: Record<string, string> = {}
): string {
  const bag: Record<string, string> = {
    businessName: client.businessName,
    bookingUrl: client.bookingUrl,
    phone: client.phone ?? "",
    email: client.email ?? "",
    hours: client.hours ?? "",
    ...extra,
  };
  return template.replace(/\{\{(\w+)\}\}/g, (_m, key) => bag[key] ?? "");
}

export function interpolateMessage(
  msg: Message,
  client: ClientConfig,
  extra: Record<string, string> = {}
): Message {
  return { ...msg, text: interpolate(msg.text, client, extra) };
}

// ---------------------------------------------------------------------------
// Intent matching
// ---------------------------------------------------------------------------

/**
 * Deterministic, script-based matcher. For v1 we match on lowercased exact
 * phrase OR substring keyword. Swap to an LLM classifier later by replacing
 * this function only — nothing else changes.
 */
export function matchIntent(
  input: string,
  agent: AgentConfig
): IntentHandler | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  // First pass: exact match
  for (const intent of agent.intents) {
    if (intent.matchers.some((m) => m.toLowerCase() === normalized)) {
      return intent;
    }
  }
  // Second pass: keyword inclusion
  for (const intent of agent.intents) {
    if (intent.matchers.some((m) => normalized.includes(m.toLowerCase()))) {
      return intent;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Escalation evaluation
// ---------------------------------------------------------------------------

export type EscalationContext = {
  unmatchedTurns: number;   // consecutive turns without an intent match
  lastVisitorInput: string;
  humanRequested: boolean;
};

export function evaluateEscalation(
  agent: AgentConfig,
  ctx: EscalationContext
): EscalationRule | null {
  const input = ctx.lastVisitorInput.toLowerCase();
  for (const rule of agent.escalationRules) {
    switch (rule.trigger) {
      case "human_requested":
        if (ctx.humanRequested) return rule;
        // Also detect common phrases
        if (/\b(human|person|someone real|talk to noell|talk to a human)\b/.test(input)) {
          return rule;
        }
        break;
      case "keyword":
        if (rule.keywords?.some((k) => input.includes(k.toLowerCase()))) {
          return rule;
        }
        break;
      case "unresolved_after_n":
        if (ctx.unmatchedTurns >= (rule.afterTurns ?? 2)) return rule;
        break;
      case "out_of_scope":
        if (ctx.unmatchedTurns >= 1) return rule;
        break;
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Conversation step: decide the next actions given visitor input + current state
// ---------------------------------------------------------------------------

export type ConversationState = {
  stage: Stage;
  unmatchedTurns: number;
  /** Captured fields accumulate here as the visitor answers. */
  captured: Record<string, string>;
};

export type ConversationStep = {
  /** Messages the agent should emit, in order. */
  agentResponses: Message[];
  /** State delta to apply after emitting responses. */
  nextState: ConversationState;
  /** Optional side-effect instruction for the host app. */
  sideEffect?:
    | { kind: "route"; target: RouteTarget }
    | { kind: "capture"; fields: Record<string, string> }
    | { kind: "escalate"; target: RouteTarget }
    | { kind: "none" };
};

/**
 * Advance the conversation by one visitor turn.
 *
 * This is deterministic and fully testable without mounting UI.
 */
export function step(params: {
  agent: AgentConfig;
  client: ClientConfig;
  state: ConversationState;
  visitorInput: string;
}): ConversationStep {
  const { agent, client, state, visitorInput } = params;

  // --- Capture branch: stage was awaiting contact info ----------------------
  if (state.stage === "qualified") {
    const captured = parseCapture(visitorInput);
    return {
      agentResponses: agent.captureResponse.map((m) =>
        interpolateMessage(m, client, captured)
      ),
      nextState: {
        ...state,
        stage: "captured",
        captured: { ...state.captured, ...captured },
        unmatchedTurns: 0,
      },
      sideEffect: { kind: "capture", fields: captured },
    };
  }

  // --- Intent match branch --------------------------------------------------
  const intent = matchIntent(visitorInput, agent);
  if (intent) {
    return {
      agentResponses: intent.responses.map((m) =>
        interpolateMessage(m, client)
      ),
      nextState: {
        ...state,
        stage: intent.nextStage ?? state.stage,
        unmatchedTurns: 0,
      },
      sideEffect: intent.route
        ? { kind: "route", target: intent.route }
        : { kind: "none" },
    };
  }

  // --- Escalation branch ----------------------------------------------------
  const escalation = evaluateEscalation(agent, {
    unmatchedTurns: state.unmatchedTurns + 1,
    lastVisitorInput: visitorInput,
    humanRequested: false,
  });
  if (escalation) {
    return {
      agentResponses: [
        {
          from: "agent",
          text: interpolate(escalation.message, client),
        },
      ],
      nextState: {
        ...state,
        stage: "escalated",
        unmatchedTurns: state.unmatchedTurns + 1,
      },
      sideEffect: { kind: "escalate", target: escalation.handoffTarget },
    };
  }

  // --- Fallback -------------------------------------------------------------
  return {
    agentResponses: agent.fallbackResponse.map((m) =>
      interpolateMessage(m, client)
    ),
    nextState: {
      ...state,
      unmatchedTurns: state.unmatchedTurns + 1,
    },
    sideEffect: { kind: "none" },
  };
}

// ---------------------------------------------------------------------------
// Capture parser
// ---------------------------------------------------------------------------

/**
 * Extract name + phone + email from a free-text capture message.
 *
 * V1 uses regex. Swap to an LLM extractor later by replacing this function only.
 */
export function parseCapture(input: string): Record<string, string> {
  const captured: Record<string, string> = {};
  const phoneMatch = input.match(
    /(\+?\d[\d\s().-]{7,}\d)/
  );
  if (phoneMatch) captured.capturedPhone = phoneMatch[1].trim();

  const emailMatch = input.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (emailMatch) captured.capturedEmail = emailMatch[0];

  // Naive name: leading tokens that aren't digits/emails
  const nameMatch = input
    .replace(phoneMatch?.[0] ?? "", "")
    .replace(emailMatch?.[0] ?? "", "")
    .trim()
    .match(/^([A-Za-z][A-Za-z\s'.-]{1,40})/);
  if (nameMatch) captured.capturedName = nameMatch[1].trim().replace(/[,.]$/, "");

  return captured;
}

// ---------------------------------------------------------------------------
// Initial state factory
// ---------------------------------------------------------------------------

export function initialState(): ConversationState {
  return { stage: "intro", unmatchedTurns: 0, captured: {} };
}
