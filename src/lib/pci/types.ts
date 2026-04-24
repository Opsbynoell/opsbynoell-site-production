/**
 * Predictive Customer Intelligence (PCI) — shared type definitions.
 *
 * These mirror the database schema introduced in
 * supabase/migrations/0007_pci_v0_intelligence_layer.sql.
 *
 * Internal use only. Never surface these strings in public copy.
 */

export type AgentSource = "support" | "front_desk" | "care";

/**
 * Normalized event types written to `customer_events`. This list is the
 * authoritative enumeration used by rule code. If you add a value here,
 * update docs/PCI.md and the rule consumers.
 */
export const CUSTOMER_EVENT_TYPES = [
  "support_chat_started",
  "lead_intent_detected",
  "form_submitted",
  "missed_call",
  "front_desk_reply_sent",
  "appointment_requested",
  "appointment_booked",
  "appointment_confirmed",
  "appointment_unconfirmed",
  "appointment_canceled",
  "appointment_completed",
  "review_requested",
  "review_completed",
  "reactivation_sent",
  "reactivation_responded",
  "care_handoff",
  "owner_escalation",
] as const;

export type CustomerEventType = (typeof CUSTOMER_EVENT_TYPES)[number];

export interface CustomerEvent {
  id: string;
  client_id: string;
  contact_id: string | null;
  event_type: CustomerEventType;
  event_source: string;
  agent_source: AgentSource | null;
  session_id: string | null;
  appointment_id: string | null;
  conversation_message_id: string | null;
  service_interest: string | null;
  channel: string | null;
  occurred_at: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

/**
 * Signal taxonomy. Each value maps 1:1 to a GHL tag (see docs/PCI.md
 * for the handoff table) and to a rule in src/lib/pci/rules.ts.
 */
export const SIGNAL_TYPES = [
  "warm_lead_risk",
  "missed_call_unbooked",
  "no_show_risk",
  "rebook_due",
  "lapsed_client",
  "review_ready",
  "owner_followup_needed",
  "slow_week_fill",
] as const;

export type SignalType = (typeof SIGNAL_TYPES)[number];

export const SIGNAL_SEVERITIES = ["low", "medium", "high", "urgent"] as const;
export type SignalSeverity = (typeof SIGNAL_SEVERITIES)[number];

export const SIGNAL_STATUSES = [
  "open",
  "in_progress",
  "resolved",
  "dismissed",
  "expired",
] as const;
export type SignalStatus = (typeof SIGNAL_STATUSES)[number];

export interface CustomerSignal {
  id: string;
  client_id: string;
  contact_id: string | null;
  signal_type: SignalType;
  severity: SignalSeverity;
  /** 0..1, three-decimal precision in the DB. */
  confidence: number;
  status: SignalStatus;
  reason: string;
  recommended_action: string;
  estimated_value: number | null;
  source_event_ids: string[];
  source_table: string | null;
  source_record_id: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

/**
 * The draft shape rule code produces before it is persisted. Omits
 * server-generated columns (id, timestamps, status) and confirms the
 * fields the rule must fill in.
 */
export interface SignalDraft {
  client_id: string;
  contact_id: string | null;
  signal_type: SignalType;
  severity: SignalSeverity;
  confidence: number;
  reason: string;
  recommended_action: string;
  estimated_value?: number | null;
  source_event_ids?: string[];
  source_table?: string | null;
  source_record_id?: string | null;
  expires_at?: string | null;
}

export interface WeeklyIntelligenceBrief {
  id: string;
  client_id: string;
  week_start: string;
  week_end: string;
  missed_calls_recovered: number;
  missed_calls_unbooked: number;
  hot_leads_at_risk: number;
  appointments_unconfirmed: number;
  likely_no_show_count: number;
  clients_due_to_rebook: number;
  lapsed_clients_flagged: number;
  reviews_requested: number;
  reviews_captured: number;
  estimated_revenue_recovered: number | null;
  estimated_revenue_at_risk: number | null;
  recommended_actions: Array<Record<string, unknown>>;
  summary: string | null;
  created_at: string;
}

/**
 * GHL tag used to route execution for a given signal. These are the
 * only strings that should ever leave the intelligence layer toward the
 * execution layer. Public copy must not mention them.
 */
export const SIGNAL_GHL_TAG: Record<SignalType, string> = {
  warm_lead_risk: "pci_hot_lead",
  missed_call_unbooked: "pci_missed_call_unbooked",
  no_show_risk: "pci_no_show_risk",
  rebook_due: "pci_rebook_due",
  lapsed_client: "pci_lapsed_client",
  review_ready: "pci_review_ready",
  owner_followup_needed: "pci_owner_followup",
  slow_week_fill: "pci_slow_week_fill",
};
