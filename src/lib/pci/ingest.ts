/**
 * PCI v1 — ingestion & manual signal-generation.
 *
 * Reads existing agent domain tables (front_desk_sessions, care_sessions,
 * appointments, client_contacts, reactivation_campaigns, review_requests,
 * reminders) and produces:
 *
 *   1. `customer_events` rows that normalize the operational history
 *      into the PCI stream.
 *   2. `customer_signals` rows derived from the pure rule functions in
 *      `rules.ts`.
 *
 * This module is the **manual / operator-triggered** path. No cron is
 * wired here — it runs when an authorized admin asks for it. No outbound
 * messages are sent and no GHL handoff is invoked. The execution layer
 * stays on its own seam (see `handoff.ts`).
 *
 * Every generator function supports `dryRun` — it returns the drafts
 * that *would* be written without touching the database. The calling
 * API route surfaces that option to the admin UI so the operator can
 * preview before committing.
 *
 * Scoping: each generator takes an explicit `client_ids` allowlist. The
 * API route must derive this from the admin session (accessibleClients
 * for non-super-admins). Passing `null` scans all clients — only super
 * admins should be able to do that.
 */

import { recordEvent } from "./events";
import {
  evalLapsedClient,
  evalMissedCallUnbooked,
  evalNoShowRisk,
  evalRebookDue,
  evalReviewReady,
  evalWarmLeadRisk,
} from "./rules";
import { upsertSignalFromDraft } from "./signals";
import { sbSelect } from "../agents/supabase";
import type {
  AgentSource,
  CustomerEventType,
  SignalDraft,
  SignalType,
} from "./types";

// ───────────────────────────────────────────────────────────────────
// Row shapes (narrow — only the columns each mapper actually reads)
// ───────────────────────────────────────────────────────────────────

export interface FrontDeskSessionRow {
  id: string;
  client_id: string;
  trigger_type: string;
  intent: "hot" | "warm" | "low" | "unknown" | null;
  visitor_phone: string | null;
  visitor_email: string | null;
  appointment_id: string | null;
  created_at: string;
}

export interface CareSessionRow {
  id: string;
  client_id: string;
  contact_id: string | null;
  trigger_type: string;
  intent: "hot" | "warm" | "low" | "unknown" | null;
  created_at: string;
}

export interface AppointmentRow {
  id: string;
  client_id: string;
  visitor_phone: string | null;
  visitor_email: string | null;
  scheduled_at: string;
  status: string;
  service_type: string | null;
  updated_at: string;
}

export interface ReminderRow {
  appointment_id: string;
  type: string;
  status: string;
  sent_at: string | null;
}

export interface ReviewRequestRow {
  appointment_id: string;
  status: string;
}

export interface ClientContactRow {
  id: string;
  client_id: string;
  phone: string | null;
  email: string | null;
  last_visit_at: string | null;
  usual_rebook_cadence_days: number | null;
}

export interface ReactivationCampaignRow {
  contact_id: string | null;
  status: string;
}

// ───────────────────────────────────────────────────────────────────
// Event mapping helpers (pure)
// ───────────────────────────────────────────────────────────────────

interface EventDraft {
  client_id: string;
  event_type: CustomerEventType;
  event_source: string;
  agent_source: AgentSource | null;
  session_id?: string | null;
  appointment_id?: string | null;
  contact_id?: string | null;
  occurred_at: string;
  metadata: Record<string, unknown>;
  channel?: string | null;
}

/**
 * Map a front_desk_sessions row into the event it corresponds to. Pure
 * — no DB reads, no writes. Returns null when the row should not emit
 * an event.
 */
export function frontDeskSessionToEvent(
  row: FrontDeskSessionRow
): EventDraft | null {
  if (row.trigger_type === "missed_call") {
    return {
      client_id: row.client_id,
      event_type: "missed_call",
      event_source: "front_desk_sessions",
      agent_source: "front_desk",
      session_id: row.id,
      appointment_id: row.appointment_id,
      occurred_at: row.created_at,
      metadata: {
        trigger_type: row.trigger_type,
        visitor_phone: row.visitor_phone,
      },
      channel: "voice",
    };
  }
  if (row.intent === "hot" || row.intent === "warm") {
    return {
      client_id: row.client_id,
      event_type: "lead_intent_detected",
      event_source: "front_desk_sessions",
      agent_source: "front_desk",
      session_id: row.id,
      appointment_id: row.appointment_id,
      occurred_at: row.created_at,
      metadata: { intent: row.intent, trigger_type: row.trigger_type },
    };
  }
  return null;
}

export function careSessionToEvent(row: CareSessionRow): EventDraft | null {
  if (row.intent === "hot" || row.intent === "warm") {
    return {
      client_id: row.client_id,
      event_type: "lead_intent_detected",
      event_source: "care_sessions",
      agent_source: "care",
      session_id: row.id,
      contact_id: row.contact_id,
      occurred_at: row.created_at,
      metadata: { intent: row.intent, trigger_type: row.trigger_type },
    };
  }
  return null;
}

/**
 * Map an appointment row into whichever event (if any) reflects its
 * current status. `booked` always fires; `confirmed`, `completed`,
 * `canceled` fire when status matches.
 */
export function appointmentToEvents(row: AppointmentRow): EventDraft[] {
  const out: EventDraft[] = [];
  const base = {
    client_id: row.client_id,
    event_source: "appointments",
    agent_source: "front_desk" as AgentSource,
    appointment_id: row.id,
    metadata: {
      status: row.status,
      scheduled_at: row.scheduled_at,
      service_type: row.service_type,
    },
  };
  // Booked — always present as long as the appointment exists.
  out.push({
    ...base,
    event_type: "appointment_booked",
    occurred_at: row.updated_at,
  });
  if (row.status === "confirmed" || row.status === "reminded") {
    out.push({
      ...base,
      event_type: "appointment_confirmed",
      occurred_at: row.updated_at,
    });
  } else if (row.status === "completed") {
    out.push({
      ...base,
      event_type: "appointment_completed",
      occurred_at: row.updated_at,
    });
  } else if (row.status === "cancelled") {
    out.push({
      ...base,
      event_type: "appointment_canceled",
      occurred_at: row.updated_at,
    });
  }
  return out;
}

// ───────────────────────────────────────────────────────────────────
// Rule wiring (pure)
// ───────────────────────────────────────────────────────────────────

/**
 * Which rules we support in v1 manual generation. Exposed so the API
 * route and admin UI can restrict what a caller requests.
 */
export const SUPPORTED_RULES = [
  "warm_lead_risk",
  "missed_call_unbooked",
  "no_show_risk",
  "rebook_due",
  "lapsed_client",
  "review_ready",
] as const satisfies readonly SignalType[];

export type SupportedRule = (typeof SUPPORTED_RULES)[number];

export function isSupportedRule(v: string): v is SupportedRule {
  return (SUPPORTED_RULES as readonly string[]).includes(v);
}

/**
 * Drive a warm-lead-risk draft from a front-desk session row. Pure.
 */
export function warmLeadDraftFromFrontDesk(
  row: FrontDeskSessionRow,
  contactId: string | null,
  now: Date
): SignalDraft | null {
  return evalWarmLeadRisk({
    client_id: row.client_id,
    contact_id: contactId,
    session_id: row.id,
    agent_source: "front_desk",
    intent: row.intent,
    started_at: row.created_at,
    appointment_booked: row.appointment_id !== null,
    now,
  });
}

/**
 * Drive a warm-lead-risk draft from a care session row. Pure.
 */
export function warmLeadDraftFromCare(
  row: CareSessionRow,
  now: Date
): SignalDraft | null {
  return evalWarmLeadRisk({
    client_id: row.client_id,
    contact_id: row.contact_id,
    session_id: row.id,
    agent_source: "care",
    intent: row.intent,
    started_at: row.created_at,
    // Care sessions don't carry appointment_id directly — treat as not
    // booked for the purposes of this rule. A future iteration can
    // cross-check against appointments.visitor_phone / care_sessions.contact_id.
    appointment_booked: false,
    now,
  });
}

export function missedCallDraftFromFrontDesk(
  row: FrontDeskSessionRow,
  contactId: string | null,
  now: Date
): SignalDraft | null {
  return evalMissedCallUnbooked({
    client_id: row.client_id,
    contact_id: contactId,
    session_id: row.id,
    trigger_type: row.trigger_type,
    has_linked_appointment: row.appointment_id !== null,
    started_at: row.created_at,
    now,
  });
}

export function noShowDraftFromAppointment(
  row: AppointmentRow,
  contactId: string | null,
  reminderSent: boolean,
  now: Date
): SignalDraft | null {
  return evalNoShowRisk({
    client_id: row.client_id,
    contact_id: contactId,
    appointment_id: row.id,
    status: row.status,
    scheduled_at: row.scheduled_at,
    // Domain note: `status in ('confirmed','reminded')` means the visitor
    // has acknowledged / been reminded. PCI's rule-level input is
    // confirmation_received — use 'reminded' OR 'confirmed' as evidence.
    confirmation_received: row.status === "confirmed" || row.status === "reminded",
    reminder_sent: reminderSent,
    now,
  });
}

export function reviewReadyDraftFromAppointment(
  row: AppointmentRow,
  contactId: string | null,
  reviewAlreadySent: boolean,
  now: Date
): SignalDraft | null {
  return evalReviewReady({
    client_id: row.client_id,
    contact_id: contactId,
    appointment_id: row.id,
    completed_at: row.updated_at,
    // v1: we don't surface a negative-sentiment flag yet — treat as
    // absent so the rule still fires; v2 will wire care_messages
    // sentiment markers.
    has_negative_signal: false,
    review_already_sent: reviewAlreadySent,
    now,
  });
}

export function rebookDraftFromContact(
  row: ClientContactRow,
  futureAppointmentExists: boolean,
  now: Date
): SignalDraft | null {
  return evalRebookDue({
    client_id: row.client_id,
    contact_id: row.id,
    last_visit_at: row.last_visit_at,
    usual_rebook_cadence_days: row.usual_rebook_cadence_days,
    future_appointment_exists: futureAppointmentExists,
    now,
  });
}

export function lapsedDraftFromContact(
  row: ClientContactRow,
  reactivationThresholdDays: number | null,
  inActiveReactivation: boolean,
  now: Date
): SignalDraft | null {
  return evalLapsedClient({
    client_id: row.client_id,
    contact_id: row.id,
    last_visit_at: row.last_visit_at,
    reactivation_threshold_days: reactivationThresholdDays,
    in_active_reactivation: inActiveReactivation,
    now,
  });
}

// ───────────────────────────────────────────────────────────────────
// Generation runner (DB-backed)
// ───────────────────────────────────────────────────────────────────

export interface GenerateOptions {
  /** Allowlist of client_id values to scan. `null` = all clients (super admin). */
  client_ids: string[] | null;
  /** Which rules to execute. Defaults to all SUPPORTED_RULES. */
  rules?: readonly SupportedRule[];
  /** Max source rows per rule, per scan. Keeps one operator click bounded. */
  limit?: number;
  /** Clock injection for tests. */
  now?: Date;
  /**
   * Dry run — returns the would-be signal drafts and event counts without
   * writing anything. Default false.
   */
  dryRun?: boolean;
}

export interface RuleResult {
  rule: SupportedRule;
  scanned: number;
  drafts: number;
  created: number;
  skipped_existing: number;
  events_written: number;
}

export interface GenerateResult {
  dryRun: boolean;
  now: string;
  results: RuleResult[];
  totals: {
    scanned: number;
    drafts: number;
    created: number;
    skipped_existing: number;
    events_written: number;
  };
}

/**
 * Run the requested rules against existing records and persist any new
 * signals (unless dryRun). The caller is responsible for passing the
 * correct `client_ids` scope for the admin session.
 *
 * Generator-level errors are caught so one rule failing does not stop
 * the rest — individual rule scans will surface non-zero `scanned` with
 * zero `drafts` if a query fails. The result always returns even on
 * partial failure; logs are emitted via console.warn for observability.
 */
export async function generateSignals(
  opts: GenerateOptions
): Promise<GenerateResult> {
  const now = opts.now ?? new Date();
  const limit = opts.limit ?? 200;
  const rules = opts.rules ?? SUPPORTED_RULES;
  const dryRun = opts.dryRun ?? false;

  const results: RuleResult[] = [];
  for (const rule of rules) {
    const r = await runRule(rule, opts.client_ids, limit, now, dryRun);
    results.push(r);
  }

  const totals = results.reduce(
    (acc, r) => ({
      scanned: acc.scanned + r.scanned,
      drafts: acc.drafts + r.drafts,
      created: acc.created + r.created,
      skipped_existing: acc.skipped_existing + r.skipped_existing,
      events_written: acc.events_written + r.events_written,
    }),
    { scanned: 0, drafts: 0, created: 0, skipped_existing: 0, events_written: 0 }
  );

  return { dryRun, now: now.toISOString(), results, totals };
}

async function runRule(
  rule: SupportedRule,
  clientIds: string[] | null,
  limit: number,
  now: Date,
  dryRun: boolean
): Promise<RuleResult> {
  try {
    switch (rule) {
      case "warm_lead_risk":
        return await runWarmLead(clientIds, limit, now, dryRun);
      case "missed_call_unbooked":
        return await runMissedCall(clientIds, limit, now, dryRun);
      case "no_show_risk":
        return await runNoShow(clientIds, limit, now, dryRun);
      case "review_ready":
        return await runReviewReady(clientIds, limit, now, dryRun);
      case "rebook_due":
        return await runRebook(clientIds, limit, now, dryRun);
      case "lapsed_client":
        return await runLapsed(clientIds, limit, now, dryRun);
    }
  } catch (e) {
    console.warn(`[pci.generateSignals] rule ${rule} failed:`, e);
    return emptyResult(rule);
  }
}

function emptyResult(rule: SupportedRule): RuleResult {
  return {
    rule,
    scanned: 0,
    drafts: 0,
    created: 0,
    skipped_existing: 0,
    events_written: 0,
  };
}

function clientFilter(
  clientIds: string[] | null
): Record<string, string> | null {
  if (clientIds === null) return {};
  if (clientIds.length === 0) return null;
  return { client_id: `in.(${clientIds.map(encodeURIComponent).join(",")})` };
}

async function persistDraft(
  draft: SignalDraft,
  dryRun: boolean
): Promise<"created" | "existed"> {
  if (dryRun) return "existed";
  const { created } = await upsertSignalFromDraft(draft);
  return created ? "created" : "existed";
}

async function persistEvent(
  ev: EventDraft,
  dryRun: boolean
): Promise<boolean> {
  if (dryRun) return false;
  try {
    await recordEvent({
      client_id: ev.client_id,
      event_type: ev.event_type,
      event_source: ev.event_source,
      agent_source: ev.agent_source,
      session_id: ev.session_id ?? null,
      appointment_id: ev.appointment_id ?? null,
      contact_id: ev.contact_id ?? null,
      occurred_at: ev.occurred_at,
      metadata: ev.metadata,
      channel: ev.channel ?? null,
    });
    return true;
  } catch (e) {
    console.warn("[pci.generateSignals] event write failed:", e);
    return false;
  }
}

// ── per-rule runners ─────────────────────────────────────────────────

async function findContactIdByPhoneEmail(
  clientId: string,
  phone: string | null,
  email: string | null
): Promise<string | null> {
  if (phone) {
    const rows = await sbSelect<{ id: string }>(
      "client_contacts",
      { client_id: `eq.${clientId}`, phone: `eq.${phone}` },
      { limit: 1, select: "id" }
    );
    if (rows[0]?.id) return rows[0].id;
  }
  if (email) {
    const rows = await sbSelect<{ id: string }>(
      "client_contacts",
      { client_id: `eq.${clientId}`, email: `eq.${email}` },
      { limit: 1, select: "id" }
    );
    if (rows[0]?.id) return rows[0].id;
  }
  return null;
}

async function runWarmLead(
  clientIds: string[] | null,
  limit: number,
  now: Date,
  dryRun: boolean
): Promise<RuleResult> {
  const filter = clientFilter(clientIds);
  if (filter === null) return emptyResult("warm_lead_risk");

  const fdRows = await sbSelect<FrontDeskSessionRow>(
    "front_desk_sessions",
    { ...filter, intent: "in.(hot,warm)" },
    { order: "created_at.desc", limit }
  );
  const careRows = await sbSelect<CareSessionRow>(
    "care_sessions",
    { ...filter, intent: "in.(hot,warm)" },
    { order: "created_at.desc", limit }
  );

  let drafts = 0;
  let created = 0;
  let skipped = 0;
  let events = 0;

  for (const row of fdRows) {
    const contactId = await findContactIdByPhoneEmail(
      row.client_id,
      row.visitor_phone,
      row.visitor_email
    );
    const ev = frontDeskSessionToEvent(row);
    if (ev && (await persistEvent(ev, dryRun))) events++;

    const draft = warmLeadDraftFromFrontDesk(row, contactId, now);
    if (!draft) continue;
    drafts++;
    const outcome = await persistDraft(draft, dryRun);
    if (outcome === "created") created++;
    else skipped++;
  }
  for (const row of careRows) {
    const ev = careSessionToEvent(row);
    if (ev && (await persistEvent(ev, dryRun))) events++;
    const draft = warmLeadDraftFromCare(row, now);
    if (!draft) continue;
    drafts++;
    const outcome = await persistDraft(draft, dryRun);
    if (outcome === "created") created++;
    else skipped++;
  }

  return {
    rule: "warm_lead_risk",
    scanned: fdRows.length + careRows.length,
    drafts,
    created,
    skipped_existing: skipped,
    events_written: events,
  };
}

async function runMissedCall(
  clientIds: string[] | null,
  limit: number,
  now: Date,
  dryRun: boolean
): Promise<RuleResult> {
  const filter = clientFilter(clientIds);
  if (filter === null) return emptyResult("missed_call_unbooked");

  const rows = await sbSelect<FrontDeskSessionRow>(
    "front_desk_sessions",
    { ...filter, trigger_type: "eq.missed_call", appointment_id: "is.null" },
    { order: "created_at.desc", limit }
  );

  let drafts = 0;
  let created = 0;
  let skipped = 0;
  let events = 0;

  for (const row of rows) {
    const contactId = await findContactIdByPhoneEmail(
      row.client_id,
      row.visitor_phone,
      row.visitor_email
    );
    const ev = frontDeskSessionToEvent(row);
    if (ev && (await persistEvent(ev, dryRun))) events++;

    const draft = missedCallDraftFromFrontDesk(row, contactId, now);
    if (!draft) continue;
    drafts++;
    const outcome = await persistDraft(draft, dryRun);
    if (outcome === "created") created++;
    else skipped++;
  }

  return {
    rule: "missed_call_unbooked",
    scanned: rows.length,
    drafts,
    created,
    skipped_existing: skipped,
    events_written: events,
  };
}

async function runNoShow(
  clientIds: string[] | null,
  limit: number,
  now: Date,
  dryRun: boolean
): Promise<RuleResult> {
  const filter = clientFilter(clientIds);
  if (filter === null) return emptyResult("no_show_risk");

  // Window: scheduled between now and now+24h and not cancelled/completed.
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const rows = await sbSelect<AppointmentRow>(
    "appointments",
    {
      ...filter,
      scheduled_at: `gte.${now.toISOString()}`,
      // Second constraint goes via a separate param — PostgREST supports
      // per-column comparator keys; for lte we inline as an "and" hack
      // using a second fetch filter. Instead we just filter in JS below.
    },
    { order: "scheduled_at.asc", limit }
  );

  let drafts = 0;
  let created = 0;
  let skipped = 0;
  let events = 0;

  for (const row of rows) {
    if (new Date(row.scheduled_at).getTime() > new Date(in24h).getTime()) continue;
    if (row.status === "cancelled" || row.status === "completed") continue;

    const reminders = await sbSelect<ReminderRow>(
      "reminders",
      { appointment_id: `eq.${row.id}`, status: "eq.sent" },
      { limit: 1, select: "appointment_id,type,status,sent_at" }
    );
    const reminderSent = reminders.length > 0;

    const contactId = await findContactIdByPhoneEmail(
      row.client_id,
      row.visitor_phone,
      row.visitor_email
    );

    for (const ev of appointmentToEvents(row)) {
      if (await persistEvent(ev, dryRun)) events++;
    }

    const draft = noShowDraftFromAppointment(row, contactId, reminderSent, now);
    if (!draft) continue;
    drafts++;
    const outcome = await persistDraft(draft, dryRun);
    if (outcome === "created") created++;
    else skipped++;
  }

  return {
    rule: "no_show_risk",
    scanned: rows.length,
    drafts,
    created,
    skipped_existing: skipped,
    events_written: events,
  };
}

async function runReviewReady(
  clientIds: string[] | null,
  limit: number,
  now: Date,
  dryRun: boolean
): Promise<RuleResult> {
  const filter = clientFilter(clientIds);
  if (filter === null) return emptyResult("review_ready");

  const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const rows = await sbSelect<AppointmentRow>(
    "appointments",
    {
      ...filter,
      status: "eq.completed",
      updated_at: `gte.${cutoff}`,
    },
    { order: "updated_at.desc", limit }
  );

  let drafts = 0;
  let created = 0;
  let skipped = 0;
  let events = 0;

  for (const row of rows) {
    const reviewReqs = await sbSelect<ReviewRequestRow>(
      "review_requests",
      {
        appointment_id: `eq.${row.id}`,
        status: "in.(sent,completed)",
      },
      { limit: 1, select: "appointment_id,status" }
    );
    const alreadySent = reviewReqs.length > 0;

    const contactId = await findContactIdByPhoneEmail(
      row.client_id,
      row.visitor_phone,
      row.visitor_email
    );

    for (const ev of appointmentToEvents(row)) {
      if (await persistEvent(ev, dryRun)) events++;
    }

    const draft = reviewReadyDraftFromAppointment(row, contactId, alreadySent, now);
    if (!draft) continue;
    drafts++;
    const outcome = await persistDraft(draft, dryRun);
    if (outcome === "created") created++;
    else skipped++;
  }

  return {
    rule: "review_ready",
    scanned: rows.length,
    drafts,
    created,
    skipped_existing: skipped,
    events_written: events,
  };
}

async function runRebook(
  clientIds: string[] | null,
  limit: number,
  now: Date,
  dryRun: boolean
): Promise<RuleResult> {
  const filter = clientFilter(clientIds);
  if (filter === null) return emptyResult("rebook_due");

  const rows = await sbSelect<ClientContactRow>(
    "client_contacts",
    { ...filter, last_visit_at: "not.is.null" },
    { order: "last_visit_at.asc", limit }
  );

  let drafts = 0;
  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    // Look for any future appointment for this contact's phone/email.
    let futureExists = false;
    if (row.phone || row.email) {
      const params: Record<string, string> = {
        client_id: `eq.${row.client_id}`,
        scheduled_at: `gte.${now.toISOString()}`,
        status: "in.(confirmed,reminded)",
      };
      // PostgREST doesn't easily OR across columns — do two quick checks.
      if (row.phone) {
        const appts = await sbSelect<{ id: string }>(
          "appointments",
          { ...params, visitor_phone: `eq.${row.phone}` },
          { limit: 1, select: "id" }
        );
        if (appts.length > 0) futureExists = true;
      }
      if (!futureExists && row.email) {
        const appts = await sbSelect<{ id: string }>(
          "appointments",
          { ...params, visitor_email: `eq.${row.email}` },
          { limit: 1, select: "id" }
        );
        if (appts.length > 0) futureExists = true;
      }
    }

    const draft = rebookDraftFromContact(row, futureExists, now);
    if (!draft) continue;
    drafts++;
    const outcome = await persistDraft(draft, dryRun);
    if (outcome === "created") created++;
    else skipped++;
  }

  return {
    rule: "rebook_due",
    scanned: rows.length,
    drafts,
    created,
    skipped_existing: skipped,
    events_written: 0,
  };
}

async function runLapsed(
  clientIds: string[] | null,
  limit: number,
  now: Date,
  dryRun: boolean
): Promise<RuleResult> {
  const filter = clientFilter(clientIds);
  if (filter === null) return emptyResult("lapsed_client");

  const rows = await sbSelect<ClientContactRow>(
    "client_contacts",
    { ...filter, last_visit_at: "not.is.null" },
    { order: "last_visit_at.asc", limit }
  );

  // Fetch per-client reactivation_threshold_days in one pass.
  const clientIdSet = Array.from(new Set(rows.map((r) => r.client_id)));
  const thresholds = new Map<string, number | null>();
  if (clientIdSet.length > 0) {
    const clients = await sbSelect<{
      client_id: string;
      reactivation_threshold_days: number | null;
    }>(
      "clients",
      { client_id: `in.(${clientIdSet.map(encodeURIComponent).join(",")})` },
      { select: "client_id,reactivation_threshold_days", limit: 500 }
    );
    for (const c of clients) {
      thresholds.set(c.client_id, c.reactivation_threshold_days);
    }
  }

  let drafts = 0;
  let created = 0;
  let skipped = 0;

  for (const row of rows) {
    const active = await sbSelect<ReactivationCampaignRow>(
      "reactivation_campaigns",
      {
        client_id: `eq.${row.client_id}`,
        contact_id: `eq.${row.id}`,
        status: "in.(pending,sent)",
      },
      { limit: 1, select: "contact_id,status" }
    );
    const inActive = active.length > 0;
    const threshold = thresholds.get(row.client_id) ?? null;

    const draft = lapsedDraftFromContact(row, threshold, inActive, now);
    if (!draft) continue;
    drafts++;
    const outcome = await persistDraft(draft, dryRun);
    if (outcome === "created") created++;
    else skipped++;
  }

  return {
    rule: "lapsed_client",
    scanned: rows.length,
    drafts,
    created,
    skipped_existing: skipped,
    events_written: 0,
  };
}
