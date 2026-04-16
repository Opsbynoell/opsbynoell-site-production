-- Ops by Noell — Agents schema (Front Desk + Care + shared client config)
--
-- Target project: clipzfkbzupjctherijz (same project that already hosts
-- Noell Support tables: chatSessions, chatMessages, chatLeads, users,
-- clients). This migration extends the existing project — it does not
-- replace anything.
--
-- Naming convention: the existing Noell Support tables use camelCase.
-- We follow that convention here for consistency.

-- =============================================================
-- 1. Extend the existing `clients` table
-- =============================================================
-- The `clients` table already exists for Noell Support. We add
-- per-agent configuration columns and the pluggable integration
-- provider columns. IF NOT EXISTS keeps this idempotent across
-- re-runs during onboarding.

alter table if exists public.clients
  add column if not exists vertical text,
  add column if not exists agents jsonb not null default '{"support": true, "frontDesk": false, "care": false}'::jsonb,

  -- Noell Support (existing behavior, but surfacing here for clarity)
  add column if not exists support_system_prompt text,
  add column if not exists support_greeting text,
  add column if not exists support_booking_url text,

  -- Noell Front Desk
  add column if not exists front_desk_system_prompt text,
  add column if not exists calendar_provider text check (calendar_provider in ('ghl','generic','calendly','acuity') or calendar_provider is null),
  add column if not exists calendar_config jsonb not null default '{}'::jsonb,
  add column if not exists sms_provider text check (sms_provider in ('ghl','twilio','generic') or sms_provider is null),
  add column if not exists sms_config jsonb not null default '{}'::jsonb,
  add column if not exists missed_call_text_template text,
  add column if not exists reminder_cadence text[] not null default array['24h','2h'],
  add column if not exists review_platform text check (review_platform in ('google','yelp','custom') or review_platform is null),
  add column if not exists review_url text,
  add column if not exists reactivation_threshold_days int not null default 60,

  -- Noell Care
  add column if not exists care_system_prompt text,
  add column if not exists care_greeting text,

  -- Shared / branding
  add column if not exists brand_name text,
  add column if not exists phone text,
  add column if not exists email text,
  add column if not exists hours jsonb not null default '{}'::jsonb,
  add column if not exists locations jsonb not null default '[]'::jsonb,
  add column if not exists team jsonb not null default '[]'::jsonb,
  add column if not exists escalation_rules jsonb not null default '[]'::jsonb,
  add column if not exists telegram_chat_id text;


-- =============================================================
-- 2. Noell Front Desk
-- =============================================================

create table if not exists public.front_desk_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  trigger_type text not null check (trigger_type in (
    'missed_call','inbound_text','inbound_chat',
    'scheduled_reminder','review_request','reactivation'
  )),
  channel text not null check (channel in ('sms','chat','voice')),
  visitor_name text,
  visitor_phone text,
  visitor_email text,
  visitor_ip text,
  visitor_location text,
  appointment_id uuid,
  human_takeover boolean not null default false,
  unread_count int not null default 0,
  notes text,
  intent text check (intent in ('hot','warm','low','unknown') or intent is null),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists front_desk_sessions_client_idx
  on public.front_desk_sessions(client_id, created_at desc);
create index if not exists front_desk_sessions_phone_idx
  on public.front_desk_sessions(visitor_phone);
create index if not exists front_desk_sessions_active_idx
  on public.front_desk_sessions(client_id) where resolved_at is null;

create table if not exists public.front_desk_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.front_desk_sessions(id) on delete cascade,
  role text not null check (role in ('visitor','bot','human','system')),
  content text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists front_desk_messages_session_idx
  on public.front_desk_messages(session_id, created_at);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  session_id uuid references public.front_desk_sessions(id) on delete set null,
  visitor_name text,
  visitor_phone text,
  visitor_email text,
  service_type text,
  scheduled_at timestamptz not null,
  duration_minutes int,
  status text not null default 'confirmed' check (status in (
    'confirmed','reminded','completed','no_show','rescheduled','cancelled'
  )),
  calendar_provider text,
  external_calendar_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointments_client_idx
  on public.appointments(client_id, scheduled_at);
create index if not exists appointments_status_idx
  on public.appointments(status, scheduled_at);
create index if not exists appointments_phone_idx
  on public.appointments(visitor_phone);

-- Link session → appointment after creation
alter table public.front_desk_sessions
  drop constraint if exists front_desk_sessions_appointment_fk;
alter table public.front_desk_sessions
  add constraint front_desk_sessions_appointment_fk
    foreign key (appointment_id) references public.appointments(id) on delete set null;

create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  type text not null check (type in ('confirmation','reminder_24h','reminder_2h','custom')),
  scheduled_for timestamptz not null,
  sent_at timestamptz,
  status text not null default 'pending' check (status in ('pending','sent','failed','cancelled')),
  last_error text,
  created_at timestamptz not null default now()
);

create index if not exists reminders_due_idx
  on public.reminders(scheduled_for) where status = 'pending';

create table if not exists public.review_requests (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references public.appointments(id) on delete cascade,
  client_id text not null,
  visitor_name text,
  visitor_phone text,
  sent_at timestamptz,
  platform text check (platform in ('google','yelp','custom')),
  review_url text,
  status text not null default 'pending' check (status in ('pending','sent','completed','skipped')),
  created_at timestamptz not null default now()
);

create index if not exists review_requests_due_idx
  on public.review_requests(client_id) where status = 'pending';

create table if not exists public.reactivation_campaigns (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  contact_id uuid,
  contact_name text,
  contact_phone text,
  contact_email text,
  last_visit_at timestamptz,
  reactivation_sent_at timestamptz,
  status text not null default 'pending' check (status in ('pending','sent','responded','rebooked','declined')),
  created_at timestamptz not null default now()
);

create index if not exists reactivation_campaigns_client_idx
  on public.reactivation_campaigns(client_id, status);


-- =============================================================
-- 3. Noell Care
-- =============================================================

create table if not exists public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  name text,
  phone text,
  email text,
  last_visit_at timestamptz,
  visit_count int not null default 0,
  preferred_service text,
  vip boolean not null default false,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists client_contacts_phone_uq
  on public.client_contacts(client_id, phone) where phone is not null;
create unique index if not exists client_contacts_email_uq
  on public.client_contacts(client_id, email) where email is not null;
create index if not exists client_contacts_lookup_idx
  on public.client_contacts(client_id);

create table if not exists public.care_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  contact_id uuid references public.client_contacts(id) on delete set null,
  trigger_type text not null check (trigger_type in (
    'website_chat','sms','returning_visitor','handoff_from_support','handoff_from_front_desk'
  )),
  channel text not null check (channel in ('sms','chat')),
  visitor_name text,
  visitor_phone text,
  visitor_email text,
  visitor_ip text,
  visitor_location text,
  human_takeover boolean not null default false,
  unread_count int not null default 0,
  notes text,
  intent text check (intent in ('hot','warm','low','unknown') or intent is null),
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists care_sessions_client_idx
  on public.care_sessions(client_id, created_at desc);
create index if not exists care_sessions_contact_idx
  on public.care_sessions(contact_id);

create table if not exists public.care_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.care_sessions(id) on delete cascade,
  role text not null check (role in ('visitor','bot','human','system')),
  content text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists care_messages_session_idx
  on public.care_messages(session_id, created_at);

create table if not exists public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  client_id text not null,
  category text not null check (category in ('services','faq','location','policies','team')),
  question text not null,
  answer text not null,
  keywords text[] not null default array[]::text[],
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists knowledge_base_client_idx
  on public.knowledge_base(client_id, category) where active = true;
-- Text search for matching visitor questions to KB entries.
create index if not exists knowledge_base_tsv_idx
  on public.knowledge_base
  using gin (to_tsvector('english', question || ' ' || answer || ' ' || array_to_string(keywords, ' ')));


-- =============================================================
-- 4. Updated-at triggers
-- =============================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  t text;
begin
  foreach t in array array[
    'front_desk_sessions','appointments','client_contacts',
    'care_sessions','knowledge_base'
  ] loop
    execute format($f$
      drop trigger if exists %1$s_set_updated_at on public.%1$s;
      create trigger %1$s_set_updated_at
        before update on public.%1$s
        for each row execute function public.set_updated_at();
    $f$, t);
  end loop;
end $$;


-- =============================================================
-- 5. RLS (off for service-role backend, on for anon-blocked reads)
-- =============================================================

alter table public.front_desk_sessions    enable row level security;
alter table public.front_desk_messages    enable row level security;
alter table public.appointments           enable row level security;
alter table public.reminders              enable row level security;
alter table public.review_requests        enable row level security;
alter table public.reactivation_campaigns enable row level security;
alter table public.client_contacts        enable row level security;
alter table public.care_sessions          enable row level security;
alter table public.care_messages          enable row level security;
alter table public.knowledge_base         enable row level security;

-- No public policies are created. All backend access uses the service
-- role key which bypasses RLS. The operator dashboard authenticates
-- server-side and fetches via service role. The widget never talks to
-- Supabase directly.
