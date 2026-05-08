-- 0009_ecommerce_schema.sql
--
-- E-commerce layer: Stripe customers, subscriptions, and client portal users.
-- Idempotent. Safe to re-run.

-- ─────────────────────────────────────────────────────────────────────────────
-- customers: one row per Stripe customer (linked to a clients record)
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.customers (
  id              uuid        primary key default gen_random_uuid(),
  client_id       text        references public.clients(client_id) on delete set null,
  stripe_customer_id text     unique not null,
  email           text        not null,
  name            text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists customers_client_id_idx   on public.customers (client_id);
create index if not exists customers_email_idx        on public.customers (email);

alter table public.customers enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- subscriptions: tracks Stripe subscription status per customer
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.subscriptions (
  id                      uuid        primary key default gen_random_uuid(),
  customer_id             uuid        references public.customers(id) on delete cascade,
  stripe_subscription_id  text        unique not null,
  stripe_price_id         text        not null,
  plan_id                 text        not null, -- agents_founding | essentials | growth | custom_ops
  status                  text        not null default 'active',
  -- active | trialing | past_due | canceled | unpaid | incomplete
  amount_cents            integer     not null default 0,
  currency                text        not null default 'usd',
  interval                text        not null default 'month',
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean     not null default false,
  canceled_at             timestamptz,
  trial_end               timestamptz,
  metadata                jsonb       not null default '{}',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

create index if not exists subscriptions_customer_id_idx on public.subscriptions (customer_id);
create index if not exists subscriptions_status_idx      on public.subscriptions (status);

alter table public.subscriptions enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- client_portal_users: login credentials for the client-facing dashboard
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.client_portal_users (
  id            uuid        primary key default gen_random_uuid(),
  client_id     text        not null references public.clients(client_id) on delete cascade,
  email         text        not null unique,
  password_hash text        not null,
  name          text,
  is_owner      boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists client_portal_users_client_id_idx on public.client_portal_users (client_id);
create index if not exists client_portal_users_email_idx     on public.client_portal_users (email);

alter table public.client_portal_users enable row level security;

-- ─────────────────────────────────────────────────────────────────────────────
-- onboarding_submissions: captures post-purchase business setup info
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.onboarding_submissions (
  id                    uuid        primary key default gen_random_uuid(),
  stripe_session_id     text        unique not null,
  stripe_customer_id    text        not null,
  email                 text        not null,
  business_name         text        not null,
  owner_name            text        not null,
  phone                 text        not null,
  website               text,
  booking_tool          text,
  vertical              text,
  plan_id               text        not null,
  provisioned           boolean     not null default false,
  provisioned_at        timestamptz,
  client_id             text,
  created_at            timestamptz not null default now()
);

alter table public.onboarding_submissions enable row level security;
