/**
 * PCI v0 signal rules — deterministic, pure functions.
 *
 * Each rule takes the minimum inputs it needs and returns either a
 * SignalDraft or null. These are side-effect free; persistence is
 * handled separately in src/lib/pci/signals.ts so these functions stay
 * trivially testable.
 *
 * Rules reflect the spec in
 * /home/user/workspace/ops-by-noell-predictive-customer-intelligence-mvp-spec.md
 * and the PCI v0 schema in supabase/migrations/0007_pci_v0_intelligence_layer.sql.
 */

import type {
  AgentSource,
  SignalDraft,
  SignalSeverity,
} from "./types";

// ------------------------------------------------------------------
// Thresholds
// ------------------------------------------------------------------
// Tunable per deployment; keep as named constants so the intent is
// obvious in rule bodies. Any change here should be reflected in docs.

export const PCI_DEFAULTS = {
  /** Warm lead with no appointment booked after this window → at-risk. */
  warmLeadFollowupHours: 24,
  /** Missed call with no appointment booked after this window → unbooked. */
  missedCallUnbookedHours: 4,
  /** Window before appointment within which it must be confirmed. */
  noShowConfirmationHours: 24,
  /** Default reactivation threshold if client config has none. */
  defaultReactivationThresholdDays: 60,
  /** Window after completed appointment in which a review is "ready". */
  reviewReadyWindowDays: 7,
  /** Lead value defaults used as a rough estimated_value prior. */
  warmLeadValueUsd: 150,
  missedCallValueUsd: 120,
} as const;

// ------------------------------------------------------------------
// Input shapes (narrow, rule-specific — not full DB rows)
// ------------------------------------------------------------------

export interface WarmLeadInput {
  client_id: string;
  contact_id: string | null;
  session_id: string;
  agent_source: AgentSource;
  intent: "hot" | "warm" | "low" | "unknown" | null;
  started_at: string;
  appointment_booked: boolean;
  service_interest?: string | null;
  now?: Date;
}

export interface MissedCallInput {
  client_id: string;
  contact_id: string | null;
  session_id: string;
  trigger_type: string;
  has_linked_appointment: boolean;
  started_at: string;
  now?: Date;
}

export interface NoShowInput {
  client_id: string;
  contact_id: string | null;
  appointment_id: string;
  status: string | null;
  scheduled_at: string;
  confirmation_received: boolean;
  reminder_sent: boolean;
  service_value_usd?: number | null;
  now?: Date;
}

export interface RebookDueInput {
  client_id: string;
  contact_id: string;
  last_visit_at: string | null;
  usual_rebook_cadence_days: number | null;
  future_appointment_exists: boolean;
  now?: Date;
}

export interface LapsedClientInput {
  client_id: string;
  contact_id: string;
  last_visit_at: string | null;
  reactivation_threshold_days: number | null;
  in_active_reactivation: boolean;
  now?: Date;
}

export interface ReviewReadyInput {
  client_id: string;
  contact_id: string | null;
  appointment_id: string;
  completed_at: string;
  has_negative_signal: boolean;
  review_already_sent: boolean;
  now?: Date;
}

export interface OwnerFollowupInput {
  client_id: string;
  contact_id: string | null;
  session_id: string | null;
  appointment_id?: string | null;
  /** One of the escalation reasons. */
  reason:
    | "human_takeover"
    | "vip_contact"
    | "negative_sentiment"
    | "repeated_cancellation"
    | "high_value_inquiry"
    | "low_confidence_answer";
  context: string;
}

// ------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------

function hoursBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60);
}

function daysBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24);
}

// ------------------------------------------------------------------
// Rules
// ------------------------------------------------------------------

/**
 * warm_lead_risk — a hot/warm lead with no appointment booked inside
 * the follow-up window.
 */
export function evalWarmLeadRisk(input: WarmLeadInput): SignalDraft | null {
  if (input.appointment_booked) return null;
  if (input.intent !== "hot" && input.intent !== "warm") return null;

  const now = input.now ?? new Date();
  const hours = hoursBetween(now, new Date(input.started_at));
  if (hours < PCI_DEFAULTS.warmLeadFollowupHours) return null;

  const severity: SignalSeverity = input.intent === "hot" ? "high" : "medium";
  const confidence = input.intent === "hot" ? 0.85 : 0.7;

  return {
    client_id: input.client_id,
    contact_id: input.contact_id,
    signal_type: "warm_lead_risk",
    severity,
    confidence,
    reason:
      `${input.intent === "hot" ? "Hot" : "Warm"} lead from ${input.agent_source} ` +
      `started ${hours.toFixed(0)}h ago with no booking` +
      (input.service_interest ? ` (interest: ${input.service_interest})` : "") +
      ".",
    recommended_action:
      "Send warm follow-up; create owner task if high-value service interest.",
    estimated_value: PCI_DEFAULTS.warmLeadValueUsd,
    source_table: `${input.agent_source}_sessions`,
    source_record_id: input.session_id,
  };
}

/**
 * missed_call_unbooked — front-desk missed-call session that has not
 * produced an appointment after the configured window.
 */
export function evalMissedCallUnbooked(
  input: MissedCallInput
): SignalDraft | null {
  if (input.trigger_type !== "missed_call") return null;
  if (input.has_linked_appointment) return null;

  const now = input.now ?? new Date();
  const hours = hoursBetween(now, new Date(input.started_at));
  if (hours < PCI_DEFAULTS.missedCallUnbookedHours) return null;

  return {
    client_id: input.client_id,
    contact_id: input.contact_id,
    signal_type: "missed_call_unbooked",
    severity: "high",
    confidence: 0.8,
    reason: `Missed call ${hours.toFixed(0)}h ago with no appointment booked.`,
    recommended_action: "Send second follow-up or create owner task.",
    estimated_value: PCI_DEFAULTS.missedCallValueUsd,
    source_table: "front_desk_sessions",
    source_record_id: input.session_id,
  };
}

/**
 * no_show_risk — upcoming appointment with no confirmation received.
 * Escalates severity when the appointment is higher-value.
 */
export function evalNoShowRisk(input: NoShowInput): SignalDraft | null {
  if (input.status === "canceled" || input.status === "completed") return null;
  if (input.confirmation_received) return null;

  const now = input.now ?? new Date();
  const scheduled = new Date(input.scheduled_at);
  const hoursUntil = (scheduled.getTime() - now.getTime()) / (1000 * 60 * 60);

  // Only act inside the confirmation window and before the appointment.
  if (hoursUntil < 0 || hoursUntil > PCI_DEFAULTS.noShowConfirmationHours) {
    return null;
  }

  const highValue = (input.service_value_usd ?? 0) >= 250;
  const severity: SignalSeverity = highValue ? "urgent" : "high";

  return {
    client_id: input.client_id,
    contact_id: input.contact_id,
    signal_type: "no_show_risk",
    severity,
    confidence: input.reminder_sent ? 0.65 : 0.8,
    reason:
      `Appointment in ${hoursUntil.toFixed(1)}h is not confirmed` +
      (input.reminder_sent ? " despite reminder." : "; no reminder sent."),
    recommended_action:
      highValue
        ? "Send confirmation reminder and escalate to owner — high-value service."
        : "Send confirmation reminder.",
    estimated_value: input.service_value_usd ?? null,
    source_table: "appointments",
    source_record_id: input.appointment_id,
  };
}

/**
 * rebook_due — a returning client past their usual rebook cadence with
 * no future appointment on the books.
 */
export function evalRebookDue(input: RebookDueInput): SignalDraft | null {
  if (input.future_appointment_exists) return null;
  if (!input.last_visit_at || !input.usual_rebook_cadence_days) return null;

  const now = input.now ?? new Date();
  const sinceLast = daysBetween(now, new Date(input.last_visit_at));
  if (sinceLast < input.usual_rebook_cadence_days) return null;

  const overdueDays = sinceLast - input.usual_rebook_cadence_days;

  // Only escalate severity if they're materially overdue.
  const severity: SignalSeverity = overdueDays > 14 ? "high" : "medium";
  const confidence = Math.min(0.9, 0.6 + overdueDays / 60);

  return {
    client_id: input.client_id,
    contact_id: input.contact_id,
    signal_type: "rebook_due",
    severity,
    confidence: Number(confidence.toFixed(3)),
    reason:
      `Last visit ${sinceLast.toFixed(0)}d ago exceeds ${input.usual_rebook_cadence_days}d ` +
      `rebook cadence (${overdueDays.toFixed(0)}d overdue).`,
    recommended_action: "Send warm rebooking message.",
    source_table: "client_contacts",
    source_record_id: input.contact_id,
  };
}

/**
 * lapsed_client — past the client's configured reactivation threshold
 * with no active reactivation campaign in flight.
 */
export function evalLapsedClient(
  input: LapsedClientInput
): SignalDraft | null {
  if (input.in_active_reactivation) return null;
  if (!input.last_visit_at) return null;

  const threshold =
    input.reactivation_threshold_days ??
    PCI_DEFAULTS.defaultReactivationThresholdDays;
  const now = input.now ?? new Date();
  const sinceLast = daysBetween(now, new Date(input.last_visit_at));
  if (sinceLast < threshold) return null;

  return {
    client_id: input.client_id,
    contact_id: input.contact_id,
    signal_type: "lapsed_client",
    severity: "medium",
    confidence: 0.75,
    reason:
      `No visit in ${sinceLast.toFixed(0)}d (threshold ${threshold}d) and no active reactivation.`,
    recommended_action: "Start reactivation sequence.",
    source_table: "client_contacts",
    source_record_id: input.contact_id,
  };
}

/**
 * review_ready — completed appointment with no negative signal and no
 * review request already sent.
 */
export function evalReviewReady(input: ReviewReadyInput): SignalDraft | null {
  if (input.has_negative_signal) return null;
  if (input.review_already_sent) return null;

  const now = input.now ?? new Date();
  const completed = new Date(input.completed_at);
  const days = daysBetween(now, completed);
  if (days > PCI_DEFAULTS.reviewReadyWindowDays) return null;

  return {
    client_id: input.client_id,
    contact_id: input.contact_id,
    signal_type: "review_ready",
    severity: "low",
    confidence: 0.9,
    reason: `Completed appointment ${days.toFixed(0)}d ago with no negative signal.`,
    recommended_action: "Send review request via preferred review platform.",
    source_table: "appointments",
    source_record_id: input.appointment_id,
  };
}

/**
 * owner_followup_needed — catch-all for situations that need a human
 * in the loop. Always produces a signal — caller is responsible for
 * only invoking when the escalation actually fired.
 */
export function evalOwnerFollowup(input: OwnerFollowupInput): SignalDraft {
  const severityByReason: Record<OwnerFollowupInput["reason"], SignalSeverity> = {
    human_takeover: "high",
    vip_contact: "high",
    negative_sentiment: "urgent",
    repeated_cancellation: "medium",
    high_value_inquiry: "high",
    low_confidence_answer: "medium",
  };

  return {
    client_id: input.client_id,
    contact_id: input.contact_id,
    signal_type: "owner_followup_needed",
    severity: severityByReason[input.reason],
    confidence: 0.95,
    reason: `Owner follow-up: ${input.reason.replaceAll("_", " ")} — ${input.context}`,
    recommended_action: "Create owner task with context summary.",
    source_table: input.appointment_id
      ? "appointments"
      : input.session_id
        ? "sessions"
        : null,
    source_record_id: input.appointment_id ?? input.session_id ?? null,
  };
}
