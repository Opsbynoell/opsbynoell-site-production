# Predictive Customer Intelligence (PCI) — internal

Internal engineering reference. **Do not link from public pages or marketing copy.** The public site must never mention the backend stack, the intelligence/execution split, or any of the table/tag names in this document.

PCI is the shared intelligence layer behind Noell Support, Noell Front Desk, and Noell Care. It normalizes operational events, derives durable signals, rolls them into weekly briefs, and hands execution off to the CRM/automation layer via a narrow seam.

## Layering

| Layer | Where it lives | Job |
|---|---|---|
| Agent event sources | `support_sessions`/`support_messages`, `front_desk_sessions`/`front_desk_messages`, `care_sessions`/`care_messages`, plus `appointments`, `reminders`, `review_requests`, `reactivation_campaigns`, `chatLeads` | Write their own domain tables. **PCI does not replace them.** |
| Event stream | `customer_events` | Normalized operational history across all three agents. |
| Signal store | `customer_signals` | "Who needs attention next, and why." |
| Rollup | `weekly_intelligence_briefs` | Owner-facing weekly summary. |
| Enrichment | `client_contacts` (new columns) | Cached follow-up context per contact. |
| Handoff | `src/lib/pci/handoff.ts` | Applies tag/task/workflow in the execution layer. **v0 is a stub.** |

## Schema

See `supabase/migrations/0007_pci_v0_intelligence_layer.sql`. Key properties:

- All three new tables have **RLS enabled** with an explicit deny-all policy for `anon` + `authenticated`. The agent backend uses the service-role key and bypasses RLS.
- `customer_signals` has a **partial unique index** on `(client_id, contact_id, signal_type) WHERE status IN ('open', 'in_progress')`. Rule runs cannot create duplicate open signals for the same contact. A companion index covers the `contact_id IS NULL` case.
- The 0007 migration also adds indexes for the unindexed foreign keys Supabase's performance advisor flagged: `appointments.session_id`, `front_desk_sessions.appointment_id`, `reminders.appointment_id`, `review_requests.appointment_id`.
- Column shapes match the MVP spec in `/home/user/workspace/ops-by-noell-predictive-customer-intelligence-mvp-spec.md`.

### Event types

Authoritative list lives in `src/lib/pci/types.ts` under `CUSTOMER_EVENT_TYPES`. Adding a new type: update that tuple, then update the rule consumer that should read it.

### Signal taxonomy

| Signal type | Trigger (summary) | GHL tag |
|---|---|---|
| `warm_lead_risk` | Hot/warm lead with no booking past follow-up window | `pci_hot_lead` |
| `missed_call_unbooked` | Missed-call session with no appointment past window | `pci_missed_call_unbooked` |
| `no_show_risk` | Unconfirmed appointment inside the confirmation window | `pci_no_show_risk` |
| `rebook_due` | Past usual rebook cadence with no future appointment | `pci_rebook_due` |
| `lapsed_client` | Past client's reactivation threshold with no active campaign | `pci_lapsed_client` |
| `review_ready` | Completed appointment, no negative signal, no request sent | `pci_review_ready` |
| `owner_followup_needed` | Human takeover / VIP / negative sentiment / repeated cancel / high-value / low-confidence | `pci_owner_followup` |
| `slow_week_fill` | Reserved for v2 vertical logic | `pci_slow_week_fill` |

## Application-layer code

```
src/lib/pci/
├── types.ts      — type enums and shared interfaces
├── rules.ts      — pure deterministic signal rules (no I/O)
├── rules.test.ts — rule-boundary tests (node --test)
├── events.ts     — recordEvent() and event readers
├── signals.ts    — upsertSignalFromDraft() with duplicate control
└── handoff.ts    — typed seam to the execution layer (v0 is a stub)

src/app/api/admin/pci/signals/route.ts — internal read API
src/app/admin/pci/page.tsx             — internal dashboard
```

### Where rules should run

- **Synchronous triggers**: call `recordEvent()` and (optionally) the matching rule function from the agent handler at the moment the underlying action happens (e.g. `evalMissedCallUnbooked` when a front-desk session is created with `trigger_type = 'missed_call'`).
- **Scheduled scan**: a cron-driven route (see `src/app/api/cron/`) should re-run time-based rules (`warm_lead_risk`, `missed_call_unbooked` after the window elapses, `no_show_risk` inside 24h, `rebook_due`, `lapsed_client`, `review_ready` after completion). v0 ships the rule primitives; wiring the cron job is v1.
- Rule functions are pure — the `now` field is injectable so scheduled runs can be tested against fixed clocks.

### Duplicate control

`upsertSignalFromDraft()` reads `openSignalFor()` first and short-circuits when an open row already exists. The partial unique index in the migration is a belt-and-suspenders — any race that slips past the read will be caught at insert time.

## Handoff to the execution layer

The intelligence layer (this codebase + Supabase) is authoritative for signal state. The execution layer (CRM/automation) applies tags, creates tasks, and drives SMS/email sequences.

`src/lib/pci/handoff.ts` defines the typed seam. **v0 returns the tag that would be applied but does not call out.** v1 will wire this to `src/lib/agents/integrations/ghl.ts` using each client's stored `calendar_config` / `sms_config` to resolve the right destination.

Signal lifecycle:

1. Rule produces a `SignalDraft`.
2. `upsertSignalFromDraft()` writes it (or returns the existing open row).
3. A separate process calls `handoffToExecution(signal)` and records the `external_ref` back onto the signal.
4. When execution resolves the situation (booking made, review left, contact reactivated), the corresponding event is written and the signal moves to `resolved`.

## Internal dashboard

`/admin/pci` lists open signals. It is protected by the same middleware as the rest of `/admin` (`src/proxy.ts`) and is scoped to the caller's `accessibleClients`. Super admins see everything and can filter by client. This is an **operator view**, not a client-facing product — PCI v3 is when a client-facing dashboard ships.

## Public copy policy

Public pages may describe what PCI *does* for the business (revenue leaks, warm leads going cold, unconfirmed appointments, rebooks, review moments, lapsed clients). They must **never** mention:

- The database, Supabase, PostgREST, RLS, or any schema names
- GHL / GoHighLevel / CRM backend / automation stack / white-label platform
- "Machine learning" or "guaranteed prediction"
- Clinical / medical risk scoring, diagnosis, patient analytics, or HIPAA decisioning

Framing must stay operational: booking behavior, follow-up timing, confirmation, rebooking cadence, review timing, communication.

## Production deploy — still needs approval

The `0007_pci_v0_intelligence_layer.sql` migration is **not yet applied** to the production Supabase project (`clipzfkbzupjctherijz`). It is idempotent and the commented rollback at the bottom is the reverse path, but applying it needs an explicit deploy window. The pre-existing RLS-without-policy advisories on `clients`, the three session/message pairs, `client_contacts`, `appointments`, `reminders`, `review_requests`, `reactivation_campaigns`, `chatLeads`, and admin tables are **out of scope for this PR** — they should be addressed before PCI becomes production-critical, but they predate this work.

## v1 / v2 / v3 — what's deferred

- **v1**: cron wiring for scheduled rule scans; real GHL handoff in `handoff.ts`; `weekly_intelligence_briefs` generator; owner notifications for urgent signals.
- **v2**: vertical-specific rule modules (massage rebook cadence, med spa consult follow-through, dental recall/hygiene, salon rebooking, HVAC urgency).
- **v3**: client-facing dashboard, cross-account benchmarks, service-level opportunity scoring, exportable briefs.
