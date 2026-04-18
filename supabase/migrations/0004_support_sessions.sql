-- Noell Support session + message tables
--
-- The Noell Support API route (`src/app/api/support/message/route.ts`)
-- uses these two tables via the shared agents runner. They mirror the
-- Care/Front Desk session+message pair and are linked back to the
-- per-tenant `clients` row.
--
-- Target project: clipzfkbzupjctherijz (same project that already hosts
-- Noell Support tables from the initial schema).

create table if not exists public.support_sessions (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz,
  status text not null default 'active',
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists support_sessions_client_id_idx
  on public.support_sessions(client_id);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.support_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists support_messages_session_id_idx
  on public.support_messages(session_id);

create index if not exists support_messages_created_at_idx
  on public.support_messages(created_at);
