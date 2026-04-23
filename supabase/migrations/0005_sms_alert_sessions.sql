-- SMS Alert Sessions — two-way reply correlation table
--
-- When the system sends an owner-alert SMS we record which session it
-- came from. When the owner replies, the inbound webhook looks up this
-- table by (from_phone, to_phone) to find the session and post the
-- reply as a human message in the visitor's chat widget.
--
-- Phone number semantics (CRITICAL — read carefully):
--   The alert is sent:
--     from = smsConfig.fromNumber   (e.g. +19499973915, the A2P LC Phone)
--     to   = smsConfig.alertSmsTo   (e.g. +19497849726, Nikki's cell)
--
--   When Nikki replies, the inbound SMS arrives:
--     from = +19497849726  (Nikki's cell → the alertSmsTo)
--     to   = +19499973915  (the LC Phone number → the fromNumber)
--
--   So we index the table as:
--     from_phone = alertSmsTo   (who will be REPLYING inbound)
--     to_phone   = fromNumber   (which number receives the reply)
--
-- Target project: clipzfkbzupjctherijz

create table if not exists public.sms_alert_sessions (
  -- The phone number that SENDS the reply (owner / alertSmsTo).
  from_phone  text        not null,
  -- The LC Phone number that receives the reply (fromNumber used in outbound).
  to_phone    text        not null,
  -- The session to route the reply into.
  session_id  uuid        not null,
  -- Agent type so we can resolve the correct messages/sessions table.
  agent       text        not null check (agent in ('support', 'frontDesk', 'care')),
  -- Client for logging/debugging.
  client_id   text        not null,
  -- Timestamp of the last outbound alert (useful for staleness detection).
  created_at  timestamptz not null default now(),

  primary key (from_phone, to_phone)
);

-- Index is redundant with the PK but makes the query planner happy on
-- Supabase's PostgREST query path which uses filter params, not pk lookup.
create index if not exists sms_alert_sessions_phones_idx
  on public.sms_alert_sessions (from_phone, to_phone);
