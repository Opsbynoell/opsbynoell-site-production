/**
 * Core type definitions for the Noell system.
 *
 * This file is the contract shared by all agents (Support, Front Desk, Care),
 * all clients (tenant installs), and all verticals (defaults per business type).
 *
 * The guiding rule when adding types: if a piece of behavior varies per agent,
 * per client, or per vertical, it belongs in config — never hardcoded in
 * the runtime or UI layers.
 */

// ---------------------------------------------------------------------------
// Conversation primitives
// ---------------------------------------------------------------------------

export type MessageFrom = "agent" | "visitor" | "system";

export type Message = {
  from: MessageFrom;
  text: string;
  timestamp?: string;
  /** Optional structured metadata (e.g. routing destination, captured fields) */
  meta?: Record<string, unknown>;
};

/**
 * Conversation stage. Each agent declares which stages it supports.
 *
 * - intro:     agent has greeted, visitor hasn't engaged yet.
 * - qualified: visitor expressed a handled intent; next message is contact capture.
 * - captured:  contact info received; routed/handed off.
 * - escalated: out of scope; flagged for human.
 * - resolved:  agent self-resolved (e.g. Care answered a quick question).
 */
export type Stage =
  | "intro"
  | "qualified"
  | "captured"
  | "escalated"
  | "resolved";

// ---------------------------------------------------------------------------
// Intent + routing + escalation
// ---------------------------------------------------------------------------

export type IntentHandler = {
  /** Canonical intent key, e.g. "booking_intent" or "reschedule_existing". */
  intent: string;
  /** Lowercased phrases that trigger this intent (starter chips + keyword seeds). */
  matchers: string[];
  /** Scripted agent responses, pushed in order with typing delays. */
  responses: Message[];
  /** Stage to advance to after responses push. Defaults to no change. */
  nextStage?: Stage;
  /** If true, treat the visitor's next message as contact capture. */
  capture?: boolean;
  /** Optional routing decision to emit at end of flow. */
  route?: RouteTarget;
};

export type RouteTarget =
  | { kind: "booking_link" }
  | { kind: "human"; role: "owner" | "front_desk" | "support" | "care" }
  | { kind: "workflow"; workflowKey: string }
  | { kind: "knowledge_base"; sourceKey: string };

export type EscalationRule = {
  /** What triggers escalation. */
  trigger:
    | "out_of_scope"          // unmatched input after N attempts
    | "human_requested"        // visitor asks for a person
    | "unresolved_after_n"     // agent couldn't answer after N turns
    | "keyword";               // specific keyword in visitor input
  keywords?: string[];
  /** Attempts before escalation fires (for unresolved_after_n). */
  afterTurns?: number;
  /** What to tell the visitor when escalating. */
  message: string;
  /** Who picks up. */
  handoffTarget: RouteTarget;
};

// ---------------------------------------------------------------------------
// Knowledge + follow-up
// ---------------------------------------------------------------------------

export type KnowledgeSource = {
  key: string;
  label: string;
  /** Seed questions that map to this source. */
  questions: string[];
  /**
   * Templated answer. May include {{tokens}} that resolve from ClientConfig
   * (e.g. "{{businessName}}", "{{hours}}", "{{phone}}").
   */
  answerTemplate: string;
};

export type FollowUpRule = {
  trigger: "capture" | "resolved" | "escalated";
  channel: "sms" | "email" | "none";
  /** Delay before the follow-up fires. */
  delayMinutes?: number;
  /** Templated message body. Uses {{tokens}} from ClientConfig + capture. */
  template: string;
};

// ---------------------------------------------------------------------------
// Agent identity + config
// ---------------------------------------------------------------------------

export type AgentId = "support" | "front_desk" | "care";

export type AgentIdentity = {
  id: AgentId;
  /** Display name, e.g. "Noell Support". */
  displayName: string;
  /** One-line persona. Used in chat header subtitle and scope reminders. */
  persona: string;
  /** Short eyebrow copy for UI ("New prospect intake"). */
  eyebrow: string;
  /** Accent color token resolved by the client/theme layer. */
  launcherColor: "lilac" | "wine" | "blush";
  /** Avatar glyph (single character). */
  initial: string;
  /** Explicit scope. Rendered in /product pages and used as honesty guardrails. */
  scope: {
    does: string[];
    doesNot: string[];
  };
};

export type AgentConfig = {
  identity: AgentIdentity;
  /** First message(s) the agent emits on open. */
  greeting: Message;
  /** Quick-reply chips shown before the first visitor message. */
  starterChips: string[];
  /** Intent handlers (matched by chip text or keyword). */
  intents: IntentHandler[];
  /** Messages pushed after a successful contact capture. */
  captureResponse: Message[];
  /** Fallback pushed when no intent matches and no escalation fires. */
  fallbackResponse: Message[];
  /** Rules that route the conversation to a human or workflow. */
  escalationRules: EscalationRule[];
  /** Knowledge sources the agent can answer from. */
  knowledgeSources: KnowledgeSource[];
  /** Post-conversation follow-ups. */
  followUpRules: FollowUpRule[];
  /** Stages this agent can enter. Support doesn't use "resolved"; Care does. */
  stages: Stage[];
};

// ---------------------------------------------------------------------------
// Client (tenant) + vertical config
// ---------------------------------------------------------------------------

export type VerticalKey =
  | "massage"
  | "med_spa"
  | "salon"
  | "dental"
  | "esthetics"
  | "generic";

export type VerticalConfig = {
  key: VerticalKey;
  label: string;
  /** Common services offered in this vertical. */
  commonServices: string[];
  /** Qualifying questions tuned to this vertical. */
  qualifyingQuestions: string[];
  /** Starter chip presets tuned to this vertical. Overrides agent defaults when set. */
  starterChipPresets?: Partial<Record<AgentId, string[]>>;
  /** Reminder cadence appropriate for this vertical (free text; human-readable). */
  reminderCadence?: string;
};

export type BrandTokens = {
  primary: string;
  accent: string;
};

export type ClientConfig = {
  clientId: string;
  businessName: string;
  vertical: VerticalKey;
  /** Public booking URL used in booking-link handoffs. */
  bookingUrl: string;
  phone?: string;
  email?: string;
  hours?: string;
  /** Services offered by this specific client (narrower than vertical defaults). */
  services?: string[];
  /** Team members used for routing ("route to Sam for med spa bookings"). */
  team?: { name: string; role: string }[];
  /** Optional brand color overrides. */
  brandOverrides?: Partial<BrandTokens>;
  /** Webhook endpoints for external systems. */
  webhooks?: {
    onCapture?: string;
    onEscalate?: string;
    onResolved?: string;
  };
};

// ---------------------------------------------------------------------------
// Runtime bundle passed to the generic chat widget
// ---------------------------------------------------------------------------

export type AgentRuntime = {
  agent: AgentConfig;
  client: ClientConfig;
  vertical: VerticalConfig;
};
