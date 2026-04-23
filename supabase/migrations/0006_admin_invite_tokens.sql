-- ============================================================
-- 0006_admin_invite_tokens.sql
--
-- Magic-link invite flow for admin users.
--
-- 1. Makes admin_users.password_hash nullable so an invited user
--    can exist in the table before they set their own password.
-- 2. Creates admin_invite_tokens to track unused / used invite
--    links. We store the SHA-256 hash of the token (never the
--    plaintext), same approach any password-reset flow should use.
--
-- Run AFTER: 0005_sms_alert_sessions.sql
-- Idempotent — safe to re-run.
-- ============================================================


-- ============================================================
-- 1. admin_users.password_hash → nullable
-- ============================================================

ALTER TABLE public.admin_users
  ALTER COLUMN password_hash DROP NOT NULL;


-- ============================================================
-- 2. admin_invite_tokens
-- ============================================================

CREATE TABLE IF NOT EXISTS public.admin_invite_tokens (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  token_hash  text        NOT NULL,
  user_id     uuid        NOT NULL REFERENCES public.admin_users(id) ON DELETE CASCADE,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_invite_tokens_token_hash_unique
  ON public.admin_invite_tokens (token_hash);

CREATE INDEX IF NOT EXISTS admin_invite_tokens_user_id_idx
  ON public.admin_invite_tokens (user_id);
