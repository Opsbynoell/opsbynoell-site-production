/**
 * Tests for PCI v1 ingestion:
 *   1. Pure mappers from agent rows → EventDraft / SignalDraft
 *   2. generateSignals() with mocked sbSelect/sbInsert — the DB-backed
 *      runner's scoping, dryRun behavior, and duplicate handling
 *
 * The mock strategy matches the pattern used in
 * admin-invite-handler.test.ts: mock the supabase module *before*
 * importing the module under test, then re-import fresh state per test.
 */

import { strict as assert } from "node:assert";
import { mock, test } from "node:test";

// ── DB stubs shared across tests ───────────────────────────────────

type SelectCall = { table: string; params: Record<string, unknown> };
type InsertCall = { table: string; row: Record<string, unknown> };

const selectCalls: SelectCall[] = [];
const insertCalls: InsertCall[] = [];

// Script each sbSelect call by table → next-rows-to-return.
let selectQueue: Array<{ table: string; rows: unknown[] }> = [];

mock.module("../agents/supabase.ts", {
  namedExports: {
    sbSelect: async (table: string, params: Record<string, unknown>) => {
      selectCalls.push({ table, params });
      // Find the first queued response for this table.
      const idx = selectQueue.findIndex((q) => q.table === table);
      if (idx >= 0) {
        const [hit] = selectQueue.splice(idx, 1);
        return hit.rows;
      }
      return [];
    },
    sbInsert: async (table: string, row: Record<string, unknown>) => {
      insertCalls.push({ table, row });
      return { id: `row-${insertCalls.length}`, ...row };
    },
    sbUpdate: async () => [],
    sbUpsert: async () => ({}),
    sbRpc: async () => ({}),
  },
});

// Module under test (after mocks wired).
const {
  frontDeskSessionToEvent,
  careSessionToEvent,
  appointmentToEvents,
  warmLeadDraftFromFrontDesk,
  missedCallDraftFromFrontDesk,
  noShowDraftFromAppointment,
  reviewReadyDraftFromAppointment,
  rebookDraftFromContact,
  lapsedDraftFromContact,
  isSupportedRule,
  SUPPORTED_RULES,
  generateSignals,
} = await import("./ingest.ts");

const NOW = new Date("2026-04-24T12:00:00Z");
const hoursAgo = (h: number) =>
  new Date(NOW.getTime() - h * 60 * 60 * 1000).toISOString();
const daysAgo = (d: number) =>
  new Date(NOW.getTime() - d * 24 * 60 * 60 * 1000).toISOString();
const hoursFromNow = (h: number) =>
  new Date(NOW.getTime() + h * 60 * 60 * 1000).toISOString();

function resetCalls() {
  selectCalls.length = 0;
  insertCalls.length = 0;
  selectQueue = [];
}

// ──────────────────────────────────────────────────────────────────
// 1. Pure mapping tests
// ──────────────────────────────────────────────────────────────────

test("frontDeskSessionToEvent: missed_call → missed_call event", () => {
  const ev = frontDeskSessionToEvent({
    id: "sess-1",
    client_id: "c1",
    trigger_type: "missed_call",
    intent: null,
    visitor_phone: "+15551230000",
    visitor_email: null,
    appointment_id: null,
    created_at: hoursAgo(2),
  });
  assert.ok(ev);
  assert.equal(ev.event_type, "missed_call");
  assert.equal(ev.event_source, "front_desk_sessions");
  assert.equal(ev.agent_source, "front_desk");
  assert.equal(ev.session_id, "sess-1");
  assert.equal(ev.channel, "voice");
});

test("frontDeskSessionToEvent: hot intent non-missed-call → lead_intent_detected", () => {
  const ev = frontDeskSessionToEvent({
    id: "sess-2",
    client_id: "c1",
    trigger_type: "inbound_chat",
    intent: "hot",
    visitor_phone: null,
    visitor_email: null,
    appointment_id: null,
    created_at: hoursAgo(1),
  });
  assert.ok(ev);
  assert.equal(ev.event_type, "lead_intent_detected");
});

test("frontDeskSessionToEvent: low intent non-missed-call → null", () => {
  const ev = frontDeskSessionToEvent({
    id: "sess-3",
    client_id: "c1",
    trigger_type: "inbound_text",
    intent: "low",
    visitor_phone: null,
    visitor_email: null,
    appointment_id: null,
    created_at: hoursAgo(1),
  });
  assert.equal(ev, null);
});

test("careSessionToEvent: warm intent → lead_intent_detected", () => {
  const ev = careSessionToEvent({
    id: "care-1",
    client_id: "c1",
    contact_id: "contact-1",
    trigger_type: "website_chat",
    intent: "warm",
    created_at: hoursAgo(5),
  });
  assert.ok(ev);
  assert.equal(ev.event_type, "lead_intent_detected");
  assert.equal(ev.agent_source, "care");
  assert.equal(ev.contact_id, "contact-1");
});

test("appointmentToEvents: confirmed appt emits booked + confirmed", () => {
  const events = appointmentToEvents({
    id: "appt-1",
    client_id: "c1",
    visitor_phone: null,
    visitor_email: null,
    scheduled_at: hoursFromNow(10),
    status: "confirmed",
    service_type: null,
    updated_at: hoursAgo(1),
  });
  const types = events.map((e) => e.event_type).sort();
  assert.deepEqual(types, ["appointment_booked", "appointment_confirmed"]);
});

test("appointmentToEvents: completed appt emits booked + completed", () => {
  const events = appointmentToEvents({
    id: "appt-2",
    client_id: "c1",
    visitor_phone: null,
    visitor_email: null,
    scheduled_at: hoursAgo(24),
    status: "completed",
    service_type: null,
    updated_at: hoursAgo(23),
  });
  const types = events.map((e) => e.event_type).sort();
  assert.deepEqual(types, ["appointment_booked", "appointment_completed"]);
});

test("warmLeadDraftFromFrontDesk: hot w/ no booking past window → draft", () => {
  const draft = warmLeadDraftFromFrontDesk(
    {
      id: "sess-1",
      client_id: "c1",
      trigger_type: "inbound_chat",
      intent: "hot",
      visitor_phone: null,
      visitor_email: null,
      appointment_id: null,
      created_at: hoursAgo(30),
    },
    "contact-1",
    NOW
  );
  assert.ok(draft);
  assert.equal(draft.signal_type, "warm_lead_risk");
  assert.equal(draft.severity, "high");
  assert.equal(draft.contact_id, "contact-1");
  assert.equal(draft.source_table, "front_desk_sessions");
});

test("warmLeadDraftFromFrontDesk: booking present → null", () => {
  const draft = warmLeadDraftFromFrontDesk(
    {
      id: "sess-1",
      client_id: "c1",
      trigger_type: "inbound_chat",
      intent: "hot",
      visitor_phone: null,
      visitor_email: null,
      appointment_id: "appt-1",
      created_at: hoursAgo(30),
    },
    null,
    NOW
  );
  assert.equal(draft, null);
});

test("missedCallDraftFromFrontDesk: unbooked past window → draft", () => {
  const draft = missedCallDraftFromFrontDesk(
    {
      id: "sess-1",
      client_id: "c1",
      trigger_type: "missed_call",
      intent: null,
      visitor_phone: null,
      visitor_email: null,
      appointment_id: null,
      created_at: hoursAgo(6),
    },
    null,
    NOW
  );
  assert.ok(draft);
  assert.equal(draft.signal_type, "missed_call_unbooked");
});

test("noShowDraftFromAppointment: unconfirmed appt in window → draft", () => {
  const draft = noShowDraftFromAppointment(
    {
      id: "appt-1",
      client_id: "c1",
      visitor_phone: null,
      visitor_email: null,
      scheduled_at: hoursFromNow(6),
      status: "pending",
      service_type: null,
      updated_at: hoursAgo(1),
    },
    null,
    false,
    NOW
  );
  assert.ok(draft);
  assert.equal(draft.signal_type, "no_show_risk");
});

test("noShowDraftFromAppointment: confirmed appt → null", () => {
  const draft = noShowDraftFromAppointment(
    {
      id: "appt-1",
      client_id: "c1",
      visitor_phone: null,
      visitor_email: null,
      scheduled_at: hoursFromNow(6),
      status: "confirmed",
      service_type: null,
      updated_at: hoursAgo(1),
    },
    null,
    true,
    NOW
  );
  assert.equal(draft, null);
});

test("reviewReadyDraftFromAppointment: completed, no prior review → draft", () => {
  const draft = reviewReadyDraftFromAppointment(
    {
      id: "appt-1",
      client_id: "c1",
      visitor_phone: null,
      visitor_email: null,
      scheduled_at: hoursAgo(30),
      status: "completed",
      service_type: null,
      updated_at: daysAgo(2),
    },
    null,
    false,
    NOW
  );
  assert.ok(draft);
  assert.equal(draft.signal_type, "review_ready");
});

test("rebookDraftFromContact: past cadence → draft", () => {
  const draft = rebookDraftFromContact(
    {
      id: "contact-1",
      client_id: "c1",
      phone: "+1555",
      email: null,
      last_visit_at: daysAgo(50),
      usual_rebook_cadence_days: 30,
    },
    false,
    NOW
  );
  assert.ok(draft);
  assert.equal(draft.signal_type, "rebook_due");
});

test("lapsedDraftFromContact: past default threshold → draft", () => {
  const draft = lapsedDraftFromContact(
    {
      id: "contact-1",
      client_id: "c1",
      phone: "+1555",
      email: null,
      last_visit_at: daysAgo(90),
      usual_rebook_cadence_days: null,
    },
    60,
    false,
    NOW
  );
  assert.ok(draft);
  assert.equal(draft.signal_type, "lapsed_client");
});

test("isSupportedRule: accepts known, rejects unknown", () => {
  assert.ok(isSupportedRule("warm_lead_risk"));
  assert.ok(isSupportedRule("review_ready"));
  assert.ok(!isSupportedRule("bogus_rule"));
  assert.ok(!isSupportedRule("owner_followup_needed"));
});

test("SUPPORTED_RULES covers the v1 rule set", () => {
  assert.deepEqual([...SUPPORTED_RULES].sort(), [
    "lapsed_client",
    "missed_call_unbooked",
    "no_show_risk",
    "rebook_due",
    "review_ready",
    "warm_lead_risk",
  ]);
});

// ──────────────────────────────────────────────────────────────────
// 2. generateSignals() — DB-backed runner with mocked sbSelect
// ──────────────────────────────────────────────────────────────────

test("generateSignals: empty client_ids list short-circuits every rule", async () => {
  resetCalls();
  const result = await generateSignals({
    client_ids: [],
    rules: SUPPORTED_RULES,
    now: NOW,
    dryRun: true,
  });
  assert.equal(result.totals.scanned, 0);
  assert.equal(result.totals.drafts, 0);
  assert.equal(result.totals.created, 0);
  assert.equal(selectCalls.length, 0);
  assert.equal(insertCalls.length, 0);
});

test("generateSignals: dryRun=true does not insert even with firing drafts", async () => {
  resetCalls();
  // Queue the single SELECT that missed_call_unbooked will fire.
  selectQueue = [
    {
      table: "front_desk_sessions",
      rows: [
        {
          id: "sess-1",
          client_id: "c1",
          trigger_type: "missed_call",
          intent: null,
          visitor_phone: "+15551230000",
          visitor_email: null,
          appointment_id: null,
          created_at: hoursAgo(6),
        },
      ],
    },
    // findContactIdByPhoneEmail → no match
    { table: "client_contacts", rows: [] },
  ];

  const result = await generateSignals({
    client_ids: ["c1"],
    rules: ["missed_call_unbooked"],
    now: NOW,
    dryRun: true,
  });

  assert.equal(result.dryRun, true);
  assert.equal(result.results.length, 1);
  assert.equal(result.results[0].rule, "missed_call_unbooked");
  assert.equal(result.results[0].scanned, 1);
  assert.equal(result.results[0].drafts, 1);
  assert.equal(result.results[0].created, 0);
  assert.equal(
    insertCalls.length,
    0,
    "dryRun must never insert into the database"
  );
});

test("generateSignals: dryRun=false writes signals via upsert path", async () => {
  resetCalls();
  selectQueue = [
    {
      table: "front_desk_sessions",
      rows: [
        {
          id: "sess-1",
          client_id: "c1",
          trigger_type: "missed_call",
          intent: null,
          visitor_phone: null,
          visitor_email: null,
          appointment_id: null,
          created_at: hoursAgo(6),
        },
      ],
    },
    // upsertSignalFromDraft → openSignalFor does a select; return empty.
    { table: "customer_signals", rows: [] },
  ];

  const result = await generateSignals({
    client_ids: ["c1"],
    rules: ["missed_call_unbooked"],
    now: NOW,
    dryRun: false,
  });

  assert.equal(result.dryRun, false);
  assert.equal(result.results[0].drafts, 1);
  // We expect at least one event write and one signal insert when not dryRun.
  const signalInserts = insertCalls.filter((c) => c.table === "customer_signals");
  const eventInserts = insertCalls.filter((c) => c.table === "customer_events");
  assert.equal(signalInserts.length, 1);
  assert.equal(eventInserts.length, 1);
  assert.equal(result.results[0].created, 1);
});

test("generateSignals: scopes selects with client_id IN filter for non-null allowlist", async () => {
  resetCalls();
  selectQueue = [
    { table: "front_desk_sessions", rows: [] }, // missed_call
  ];

  await generateSignals({
    client_ids: ["c1", "c2"],
    rules: ["missed_call_unbooked"],
    now: NOW,
    dryRun: true,
  });

  // First select should target front_desk_sessions and carry the IN filter.
  const firstSelect = selectCalls[0];
  assert.ok(firstSelect);
  assert.equal(firstSelect.table, "front_desk_sessions");
  assert.equal(firstSelect.params.client_id, "in.(c1,c2)");
  assert.equal(firstSelect.params.trigger_type, "eq.missed_call");
});

test("generateSignals: null client_ids means no client filter (super admin)", async () => {
  resetCalls();
  selectQueue = [{ table: "front_desk_sessions", rows: [] }];

  await generateSignals({
    client_ids: null,
    rules: ["missed_call_unbooked"],
    now: NOW,
    dryRun: true,
  });

  const firstSelect = selectCalls[0];
  assert.ok(firstSelect);
  assert.equal(firstSelect.params.client_id, undefined);
});

test("generateSignals: existing open signal is counted as skipped_existing, not created", async () => {
  resetCalls();
  selectQueue = [
    {
      table: "front_desk_sessions",
      rows: [
        {
          id: "sess-1",
          client_id: "c1",
          trigger_type: "missed_call",
          intent: null,
          visitor_phone: null,
          visitor_email: null,
          appointment_id: null,
          created_at: hoursAgo(6),
        },
      ],
    },
    // upsertSignalFromDraft → openSignalFor returns an existing row.
    {
      table: "customer_signals",
      rows: [
        {
          id: "existing-1",
          client_id: "c1",
          contact_id: null,
          signal_type: "missed_call_unbooked",
          severity: "high",
          confidence: 0.8,
          status: "open",
          reason: "...",
          recommended_action: "...",
          estimated_value: 120,
          source_event_ids: [],
          source_table: "front_desk_sessions",
          source_record_id: "sess-1",
          expires_at: null,
          created_at: hoursAgo(5),
          updated_at: hoursAgo(5),
          resolved_at: null,
        },
      ],
    },
  ];

  const result = await generateSignals({
    client_ids: ["c1"],
    rules: ["missed_call_unbooked"],
    now: NOW,
    dryRun: false,
  });

  assert.equal(result.results[0].drafts, 1);
  assert.equal(result.results[0].created, 0);
  assert.equal(result.results[0].skipped_existing, 1);
  // No new customer_signals insert because an open one existed.
  const signalInserts = insertCalls.filter((c) => c.table === "customer_signals");
  assert.equal(signalInserts.length, 0);
});
