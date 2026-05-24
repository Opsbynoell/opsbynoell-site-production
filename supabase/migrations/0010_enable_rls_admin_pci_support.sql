-- 0010_enable_rls_admin_pci_support.sql
--
-- Enable Row Level Security on tables created before RLS was the default.
-- The service-role key bypasses RLS, so all server-side code keeps working.
-- The anon/publishable key gets a default-deny.
--
-- Audit context: these tables hold password hashes, invite tokens, reset tokens,
-- and conversation transcripts. If the anon key is ever exposed (or PostgREST
-- config drifts), they should NOT be readable via the public API.
--
-- Idempotent. Safe to re-run.

-- ─── Admin auth tables ───────────────────────────────────────────────────────
alter table if exists public.admin_users              enable row level security;
alter table if exists public.user_clients             enable row level security;
alter table if exists public.admin_invite_tokens      enable row level security;
alter table if exists public.admin_password_resets    enable row level security;

-- ─── Support / SMS alert sessions ────────────────────────────────────────────
alter table if exists public.support_sessions         enable row level security;
alter table if exists public.support_messages         enable row level security;
alter table if exists public.sms_alert_sessions       enable row level security;

-- ─── PCI v0 intelligence layer ───────────────────────────────────────────────
alter table if exists public.customer_events            enable row level security;
alter table if exists public.customer_signals           enable row level security;
alter table if exists public.weekly_intelligence_briefs enable row level security;

-- ─── Default-deny policies ───────────────────────────────────────────────────
-- These ensure that even with RLS enabled, the anon role cannot read or write
-- unless an explicit policy is added later. The service role bypasses RLS, so
-- application code is unaffected.
do $$
declare
  t text;
begin
  for t in select unnest(array[
    'admin_users',
    'user_clients',
    'admin_invite_tokens',
    'admin_password_resets',
    'support_sessions',
    'support_messages',
    'sms_alert_sessions',
    'customer_events',
    'customer_signals',
    'weekly_intelligence_briefs'
  ]) loop
    -- Drop any pre-existing policy with the same name so this migration is idempotent.
    execute format('drop policy if exists deny_all_anon on public.%I', t);
    execute format(
      'create policy deny_all_anon on public.%I as restrictive for all to anon using (false) with check (false)',
      t
    );
  end loop;
end $$;
