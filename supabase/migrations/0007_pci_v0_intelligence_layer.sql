-- ============================================================
-- 0007_pci_v0_intelligence_layer.sql
--
-- Predictive Customer Intelligence (PCI) v0 — durable schema.
--
-- Adds the intelligence layer on top of the existing agent tables.
-- PCI is the shared layer behind Noell Support, Noell Front Desk, and
-- Noell Care. It normalizes operational actions into `customer_events`,
-- derives durable `customer_signals`, rolls into `weekly_intelligence_briefs`,
-- and enriches `client_contacts` with follow-up context.
--
-- Public-facing site copy must NEVER mention this schema, the backend
-- stack, or the intelligence/execution split. See docs/PCI.md.
--
-- This migration is reviewable only. Do NOT apply to production until
-- a separate deploy window covers the application side and RLS posture
-- on the existing tables.
--
-- Run AFTER: 0006_admin_invite_tokens.sql / 0006_admin_password_resets.sql
-- Idempotent — safe to re-run.
-- ============================================================


-- ============================================================
-- 1. customer_events — normalized event stream
-- ============================================================
--
-- One row per operationally meaningful thing that happened across any
-- of the three agents. Keeps the raw operational history needed for
-- signal derivation without hard-coding every agent table into rule
-- logic. The `session_id` is intentionally unconstrained (not a FK)
-- because it can point to any of support_sessions / front_desk_sessions
-- / care_sessions / chatSessions depending on agent_source.

CREATE TABLE IF NOT EXISTS public.customer_events (
  id                       uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                text        NOT NULL,
  contact_id               uuid        NULL REFERENCES public.client_contacts(id) ON DELETE SET NULL,
  event_type               text        NOT NULL,
  event_source             text        NOT NULL,
  agent_source             text        NULL CHECK (agent_source IN ('support', 'front_desk', 'care') OR agent_source IS NULL),
  session_id               uuid        NULL,
  appointment_id           uuid        NULL REFERENCES public.appointments(id) ON DELETE SET NULL,
  conversation_message_id  uuid        NULL,
  service_interest         text        NULL,
  channel                  text        NULL,
  occurred_at              timestamptz NOT NULL DEFAULT now(),
  metadata                 jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at               timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS customer_events_client_time_idx
  ON public.customer_events (client_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS customer_events_contact_time_idx
  ON public.customer_events (contact_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS customer_events_type_time_idx
  ON public.customer_events (event_type, occurred_at DESC);

CREATE INDEX IF NOT EXISTS customer_events_appointment_idx
  ON public.customer_events (appointment_id);

CREATE INDEX IF NOT EXISTS customer_events_session_idx
  ON public.customer_events (session_id);


-- ============================================================
-- 2. customer_signals — active/historical intelligence
-- ============================================================
--
-- A signal is "someone needs attention next, and here is why." The
-- service-role agent backend creates and resolves these. GHL is the
-- execution layer — a separate sync path reads open signals and
-- applies tags/tasks/workflows.

CREATE TABLE IF NOT EXISTS public.customer_signals (
  id                 uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id          text           NOT NULL,
  contact_id         uuid           NULL REFERENCES public.client_contacts(id) ON DELETE SET NULL,
  signal_type        text           NOT NULL,
  severity           text           NOT NULL DEFAULT 'medium'
                                    CHECK (severity IN ('low', 'medium', 'high', 'urgent')),
  confidence         numeric(4,3)   NOT NULL DEFAULT 0.700
                                    CHECK (confidence >= 0 AND confidence <= 1),
  status             text           NOT NULL DEFAULT 'open'
                                    CHECK (status IN ('open', 'in_progress', 'resolved', 'dismissed', 'expired')),
  reason             text           NOT NULL,
  recommended_action text           NOT NULL,
  estimated_value    numeric(12,2)  NULL,
  source_event_ids   uuid[]         NOT NULL DEFAULT '{}',
  source_table       text           NULL,
  source_record_id   uuid           NULL,
  expires_at         timestamptz    NULL,
  created_at         timestamptz    NOT NULL DEFAULT now(),
  updated_at         timestamptz    NOT NULL DEFAULT now(),
  resolved_at        timestamptz    NULL
);

CREATE INDEX IF NOT EXISTS customer_signals_open_client_idx
  ON public.customer_signals (client_id, status, severity, created_at DESC);

CREATE INDEX IF NOT EXISTS customer_signals_contact_idx
  ON public.customer_signals (contact_id, created_at DESC);

CREATE INDEX IF NOT EXISTS customer_signals_type_idx
  ON public.customer_signals (signal_type, status, created_at DESC);

-- Partial unique indexes: prevent duplicate open signals from piling up
-- on repeated rule runs. Two keys are needed because Postgres unique
-- indexes treat NULLs as distinct by default — without the NULL-safe
-- second index, contact-less signals (slow_week_fill, owner_followup
-- without an attached contact) could be inserted repeatedly.
--
-- We use COALESCE-based expression indexes (portable across all
-- supported Postgres versions) instead of `NULLS NOT DISTINCT` (PG 15+
-- only) so this migration stays compatible with older targets. The
-- zero-UUID sentinel is safe: `gen_random_uuid()` never produces it,
-- so no real row can collide with the NULL-coalesced value.

-- Primary key: one open/in-progress signal per (client, contact, type)
-- when contact is known. Matches the contract in openSignalFor().
-- Scoped to contact_id IS NOT NULL so the NULL-contact case is handled
-- by the secondary index below (distinct sources must stay separate).
CREATE UNIQUE INDEX IF NOT EXISTS customer_signals_open_unique_idx
  ON public.customer_signals (client_id, contact_id, signal_type)
  WHERE status IN ('open', 'in_progress') AND contact_id IS NOT NULL;

-- Secondary key: when contact_id IS NULL, dedupe on
-- (client, type, source_record_id) so distinct contactless signals
-- attached to different sessions/appointments (e.g. owner_followup
-- for unrelated escalations) remain separate, while repeated rule
-- runs for the same source are collapsed. NULL source_record_id
-- coalesces to a zero-UUID sentinel so fully-unattached contactless
-- signals (one per client+type) are also deduped — gen_random_uuid()
-- never produces the sentinel, so real rows cannot collide with it.
CREATE UNIQUE INDEX IF NOT EXISTS customer_signals_open_unique_no_contact_idx
  ON public.customer_signals (
    client_id,
    signal_type,
    COALESCE(source_record_id, '00000000-0000-0000-0000-000000000000'::uuid)
  )
  WHERE status IN ('open', 'in_progress') AND contact_id IS NULL;

-- Keep updated_at fresh. set_updated_at() already exists (see
-- 0001_agents_schema.sql).
DROP TRIGGER IF EXISTS customer_signals_set_updated_at ON public.customer_signals;
CREATE TRIGGER customer_signals_set_updated_at
  BEFORE UPDATE ON public.customer_signals
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 3. weekly_intelligence_briefs — rollup for owner-facing brief
-- ============================================================

CREATE TABLE IF NOT EXISTS public.weekly_intelligence_briefs (
  id                           uuid           PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id                    text           NOT NULL,
  week_start                   date           NOT NULL,
  week_end                     date           NOT NULL,
  missed_calls_recovered       integer        NOT NULL DEFAULT 0,
  missed_calls_unbooked        integer        NOT NULL DEFAULT 0,
  hot_leads_at_risk            integer        NOT NULL DEFAULT 0,
  appointments_unconfirmed     integer        NOT NULL DEFAULT 0,
  likely_no_show_count         integer        NOT NULL DEFAULT 0,
  clients_due_to_rebook        integer        NOT NULL DEFAULT 0,
  lapsed_clients_flagged       integer        NOT NULL DEFAULT 0,
  reviews_requested            integer        NOT NULL DEFAULT 0,
  reviews_captured             integer        NOT NULL DEFAULT 0,
  estimated_revenue_recovered  numeric(12,2)  NULL,
  estimated_revenue_at_risk    numeric(12,2)  NULL,
  recommended_actions          jsonb          NOT NULL DEFAULT '[]'::jsonb,
  summary                      text           NULL,
  created_at                   timestamptz    NOT NULL DEFAULT now(),
  UNIQUE (client_id, week_start, week_end)
);

CREATE INDEX IF NOT EXISTS weekly_intelligence_briefs_client_week_idx
  ON public.weekly_intelligence_briefs (client_id, week_start DESC);


-- ============================================================
-- 4. client_contacts enrichment
-- ============================================================

ALTER TABLE public.client_contacts
  ADD COLUMN IF NOT EXISTS usual_rebook_cadence_days integer,
  ADD COLUMN IF NOT EXISTS last_service_booked       text,
  ADD COLUMN IF NOT EXISTS last_inbound_intent       text,
  ADD COLUMN IF NOT EXISTS last_contacted_at         timestamptz,
  ADD COLUMN IF NOT EXISTS last_review_status        text,
  ADD COLUMN IF NOT EXISTS risk_summary              text,
  ADD COLUMN IF NOT EXISTS next_best_follow_up       text,
  ADD COLUMN IF NOT EXISTS next_best_follow_up_at    timestamptz;


-- ============================================================
-- 5. Unindexed-foreign-key advisories flagged by Supabase
-- ============================================================
--
-- PCI rules query across these FKs frequently. The advisory was open
-- before PCI; adding the indexes here so PCI's cross-table lookups
-- don't do seq scans.

CREATE INDEX IF NOT EXISTS appointments_session_id_idx
  ON public.appointments (session_id);

CREATE INDEX IF NOT EXISTS front_desk_sessions_appointment_id_idx
  ON public.front_desk_sessions (appointment_id);

CREATE INDEX IF NOT EXISTS reminders_appointment_id_idx
  ON public.reminders (appointment_id);

CREATE INDEX IF NOT EXISTS review_requests_appointment_id_idx
  ON public.review_requests (appointment_id);


-- ============================================================
-- 6. RLS — default deny, service-role bypass
-- ============================================================
--
-- PCI tables are service-role only. The agent backend (API routes in
-- src/app/api/**) uses SUPABASE_SERVICE_ROLE_KEY and bypasses RLS. No
-- anon/authenticated client should ever touch these tables directly.
-- Enable RLS and create explicit "deny all" policies so the Supabase
-- advisor does not flag these tables the way it did for 0001.

ALTER TABLE public.customer_events             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_signals            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_intelligence_briefs  ENABLE ROW LEVEL SECURITY;

-- customer_events
DROP POLICY IF EXISTS customer_events_deny_anon ON public.customer_events;
CREATE POLICY customer_events_deny_anon
  ON public.customer_events
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- customer_signals
DROP POLICY IF EXISTS customer_signals_deny_anon ON public.customer_signals;
CREATE POLICY customer_signals_deny_anon
  ON public.customer_signals
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- weekly_intelligence_briefs
DROP POLICY IF EXISTS weekly_intelligence_briefs_deny_anon ON public.weekly_intelligence_briefs;
CREATE POLICY weekly_intelligence_briefs_deny_anon
  ON public.weekly_intelligence_briefs
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);


-- ============================================================
-- 7. Down-migration reference (manual, do NOT auto-run)
-- ============================================================
--
-- To roll back this migration, run the statements below against the
-- target project. They are commented out so this file stays idempotent
-- and safe to apply; they exist here so the rollback is reviewable.
--
--   DROP TABLE IF EXISTS public.weekly_intelligence_briefs;
--   DROP TABLE IF EXISTS public.customer_signals;
--   DROP TABLE IF EXISTS public.customer_events;
--   ALTER TABLE public.client_contacts
--     DROP COLUMN IF EXISTS usual_rebook_cadence_days,
--     DROP COLUMN IF EXISTS last_service_booked,
--     DROP COLUMN IF EXISTS last_inbound_intent,
--     DROP COLUMN IF EXISTS last_contacted_at,
--     DROP COLUMN IF EXISTS last_review_status,
--     DROP COLUMN IF EXISTS risk_summary,
--     DROP COLUMN IF EXISTS next_best_follow_up,
--     DROP COLUMN IF EXISTS next_best_follow_up_at;
--   DROP INDEX IF EXISTS public.appointments_session_id_idx;
--   DROP INDEX IF EXISTS public.front_desk_sessions_appointment_id_idx;
--   DROP INDEX IF EXISTS public.reminders_appointment_id_idx;
--   DROP INDEX IF EXISTS public.review_requests_appointment_id_idx;
