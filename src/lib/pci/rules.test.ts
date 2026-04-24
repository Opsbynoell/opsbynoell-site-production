/**
 * PCI v0 signal-rule unit tests.
 *
 * Pure functions, no mocks required. The goal is to pin the rule
 * boundaries so a future edit that silently changes firing behavior
 * trips a test.
 */

import { strict as assert } from "node:assert";
import { test } from "node:test";

import {
  PCI_DEFAULTS,
  evalLapsedClient,
  evalMissedCallUnbooked,
  evalNoShowRisk,
  evalOwnerFollowup,
  evalRebookDue,
  evalReviewReady,
  evalWarmLeadRisk,
} from "./rules";

const NOW = new Date("2026-04-24T12:00:00Z");

function hoursAgo(h: number): string {
  return new Date(NOW.getTime() - h * 60 * 60 * 1000).toISOString();
}
function daysAgo(d: number): string {
  return new Date(NOW.getTime() - d * 24 * 60 * 60 * 1000).toISOString();
}
function hoursFromNow(h: number): string {
  return new Date(NOW.getTime() + h * 60 * 60 * 1000).toISOString();
}

// ──────────────────────────────────────────────────────────────────
// warm_lead_risk
// ──────────────────────────────────────────────────────────────────

test("warm_lead_risk: hot lead past follow-up window fires as high severity", () => {
  const draft = evalWarmLeadRisk({
    client_id: "c1",
    contact_id: "contact-1",
    session_id: "sess-1",
    agent_source: "support",
    intent: "hot",
    started_at: hoursAgo(PCI_DEFAULTS.warmLeadFollowupHours + 1),
    appointment_booked: false,
    now: NOW,
  });
  assert.ok(draft);
  assert.equal(draft.signal_type, "warm_lead_risk");
  assert.equal(draft.severity, "high");
  assert.equal(draft.source_table, "support_sessions");
});

test("warm_lead_risk: warm lead still inside window does not fire", () => {
  const draft = evalWarmLeadRisk({
    client_id: "c1",
    contact_id: null,
    session_id: "sess-1",
    agent_source: "front_desk",
    intent: "warm",
    started_at: hoursAgo(1),
    appointment_booked: false,
    now: NOW,
  });
  assert.equal(draft, null);
});

test("warm_lead_risk: skipped when an appointment was booked", () => {
  const draft = evalWarmLeadRisk({
    client_id: "c1",
    contact_id: null,
    session_id: "sess-1",
    agent_source: "support",
    intent: "hot",
    started_at: hoursAgo(48),
    appointment_booked: true,
    now: NOW,
  });
  assert.equal(draft, null);
});

// ──────────────────────────────────────────────────────────────────
// missed_call_unbooked
// ──────────────────────────────────────────────────────────────────

test("missed_call_unbooked: fires when no linked appointment past window", () => {
  const draft = evalMissedCallUnbooked({
    client_id: "c1",
    contact_id: null,
    session_id: "s1",
    trigger_type: "missed_call",
    has_linked_appointment: false,
    started_at: hoursAgo(PCI_DEFAULTS.missedCallUnbookedHours + 0.5),
    now: NOW,
  });
  assert.ok(draft);
  assert.equal(draft.signal_type, "missed_call_unbooked");
  assert.equal(draft.severity, "high");
});

test("missed_call_unbooked: skipped when session has an appointment", () => {
  const draft = evalMissedCallUnbooked({
    client_id: "c1",
    contact_id: null,
    session_id: "s1",
    trigger_type: "missed_call",
    has_linked_appointment: true,
    started_at: hoursAgo(24),
    now: NOW,
  });
  assert.equal(draft, null);
});

test("missed_call_unbooked: ignores non-missed-call triggers", () => {
  const draft = evalMissedCallUnbooked({
    client_id: "c1",
    contact_id: null,
    session_id: "s1",
    trigger_type: "inbound_text",
    has_linked_appointment: false,
    started_at: hoursAgo(24),
    now: NOW,
  });
  assert.equal(draft, null);
});

// ──────────────────────────────────────────────────────────────────
// no_show_risk
// ──────────────────────────────────────────────────────────────────

test("no_show_risk: unconfirmed high-value appointment inside window is urgent", () => {
  const draft = evalNoShowRisk({
    client_id: "c1",
    contact_id: "contact-2",
    appointment_id: "appt-1",
    status: "scheduled",
    scheduled_at: hoursFromNow(6),
    confirmation_received: false,
    reminder_sent: false,
    service_value_usd: 400,
    now: NOW,
  });
  assert.ok(draft);
  assert.equal(draft.severity, "urgent");
});

test("no_show_risk: skipped when confirmation received", () => {
  const draft = evalNoShowRisk({
    client_id: "c1",
    contact_id: "contact-2",
    appointment_id: "appt-1",
    status: "scheduled",
    scheduled_at: hoursFromNow(6),
    confirmation_received: true,
    reminder_sent: true,
    now: NOW,
  });
  assert.equal(draft, null);
});

test("no_show_risk: skipped when appointment is already past", () => {
  const draft = evalNoShowRisk({
    client_id: "c1",
    contact_id: "contact-2",
    appointment_id: "appt-1",
    status: "scheduled",
    scheduled_at: hoursAgo(1),
    confirmation_received: false,
    reminder_sent: false,
    now: NOW,
  });
  assert.equal(draft, null);
});

// ──────────────────────────────────────────────────────────────────
// rebook_due
// ──────────────────────────────────────────────────────────────────

test("rebook_due: past cadence with no future appt fires", () => {
  const draft = evalRebookDue({
    client_id: "c1",
    contact_id: "contact-3",
    last_visit_at: daysAgo(50),
    usual_rebook_cadence_days: 30,
    future_appointment_exists: false,
    now: NOW,
  });
  assert.ok(draft);
  assert.equal(draft.signal_type, "rebook_due");
  assert.equal(draft.severity, "high");
});

test("rebook_due: skipped when future appointment exists", () => {
  const draft = evalRebookDue({
    client_id: "c1",
    contact_id: "contact-3",
    last_visit_at: daysAgo(50),
    usual_rebook_cadence_days: 30,
    future_appointment_exists: true,
    now: NOW,
  });
  assert.equal(draft, null);
});

// ──────────────────────────────────────────────────────────────────
// lapsed_client
// ──────────────────────────────────────────────────────────────────

test("lapsed_client: past threshold fires at medium severity", () => {
  const draft = evalLapsedClient({
    client_id: "c1",
    contact_id: "contact-4",
    last_visit_at: daysAgo(120),
    reactivation_threshold_days: 60,
    in_active_reactivation: false,
    now: NOW,
  });
  assert.ok(draft);
  assert.equal(draft.severity, "medium");
});

test("lapsed_client: skipped when reactivation already active", () => {
  const draft = evalLapsedClient({
    client_id: "c1",
    contact_id: "contact-4",
    last_visit_at: daysAgo(120),
    reactivation_threshold_days: 60,
    in_active_reactivation: true,
    now: NOW,
  });
  assert.equal(draft, null);
});

// ──────────────────────────────────────────────────────────────────
// review_ready
// ──────────────────────────────────────────────────────────────────

test("review_ready: completed appointment with no negative signal fires", () => {
  const draft = evalReviewReady({
    client_id: "c1",
    contact_id: "contact-5",
    appointment_id: "appt-2",
    completed_at: daysAgo(2),
    has_negative_signal: false,
    review_already_sent: false,
    now: NOW,
  });
  assert.ok(draft);
  assert.equal(draft.signal_type, "review_ready");
});

test("review_ready: skipped when negative signal present", () => {
  const draft = evalReviewReady({
    client_id: "c1",
    contact_id: "contact-5",
    appointment_id: "appt-2",
    completed_at: daysAgo(2),
    has_negative_signal: true,
    review_already_sent: false,
    now: NOW,
  });
  assert.equal(draft, null);
});

test("review_ready: skipped past the review window", () => {
  const draft = evalReviewReady({
    client_id: "c1",
    contact_id: "contact-5",
    appointment_id: "appt-2",
    completed_at: daysAgo(PCI_DEFAULTS.reviewReadyWindowDays + 1),
    has_negative_signal: false,
    review_already_sent: false,
    now: NOW,
  });
  assert.equal(draft, null);
});

// ──────────────────────────────────────────────────────────────────
// owner_followup_needed
// ──────────────────────────────────────────────────────────────────

test("owner_followup_needed: negative sentiment produces urgent signal", () => {
  const draft = evalOwnerFollowup({
    client_id: "c1",
    contact_id: "contact-6",
    session_id: "s-9",
    reason: "negative_sentiment",
    context: "Visitor threatened to dispute charge",
  });
  assert.equal(draft.severity, "urgent");
  assert.equal(draft.signal_type, "owner_followup_needed");
});
