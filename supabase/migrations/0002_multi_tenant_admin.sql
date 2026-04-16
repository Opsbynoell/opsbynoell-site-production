-- ============================================================
-- 0002_multi_tenant_admin.sql
--
-- Adds multi-user, multi-tenant admin authentication on top of
-- the existing Noell Support schema.
--
-- What this does:
--   1. Extends the existing `users` table with admin auth columns
--   2. Creates `user_clients` join table (user ↔ client access)
--   3. Fixes the `sms_provider` check constraint to include 'ghl_whatsapp'
--
-- Idempotent — safe to re-run.
-- ============================================================


-- ============================================================
-- 1. Extend the existing `users` table
-- ============================================================
-- The `users` table already exists from the Noell Support install.
-- We add admin-specific columns. All IF NOT EXISTS so re-runs are safe.

ALTER TABLE IF EXISTS public.users
  ADD COLUMN IF NOT EXISTS email text,
  ADD COLUMN IF NOT EXISTS password_hash text,
  ADD COLUMN IF NOT EXISTS is_super_admin boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- Unique index on email (only for non-null emails, to allow legacy rows)
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
  ON public.users (email)
  WHERE email IS NOT NULL;


-- ============================================================
-- 2. user_clients join table
-- ============================================================
-- Maps admin users to the client sub-accounts they can access.
-- Super admins bypass this — the join table is only checked for
-- non-super-admin users.

CREATE TABLE IF NOT EXISTS public.user_clients (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  client_id  text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, client_id)
);

CREATE INDEX IF NOT EXISTS user_clients_user_id_idx ON public.user_clients (user_id);
CREATE INDEX IF NOT EXISTS user_clients_client_id_idx ON public.user_clients (client_id);


-- ============================================================
-- 3. Fix sms_provider check constraint to include 'ghl_whatsapp'
-- ============================================================
-- The original constraint in 0001 didn't include ghl_whatsapp.
-- DROP + re-add is the only way to change a check constraint in Postgres.

DO $$
BEGIN
  -- Remove old constraint if it exists (name may vary — try both)
  BEGIN
    ALTER TABLE public.clients DROP CONSTRAINT IF EXISTS clients_sms_provider_check;
  EXCEPTION WHEN others THEN NULL;
  END;
END $$;

ALTER TABLE public.clients
  ADD CONSTRAINT clients_sms_provider_check
  CHECK (
    sms_provider IN ('ghl', 'ghl_whatsapp', 'twilio', 'generic')
    OR sms_provider IS NULL
  );


-- ============================================================
-- 4. updated_at trigger helper (reused across tables)
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_set_updated_at ON public.users;
CREATE TRIGGER users_set_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
