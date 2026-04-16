-- ============================================================
-- 0002_admin_users.sql
--
-- Seeds the two initial admin users for the multi-tenant system.
--
-- Run AFTER: supabase/migrations/0002_multi_tenant_admin.sql
--
-- Passwords (change immediately after first login):
--   Nikki:  NoellAdmin2026!
--   Santa:  HealingHands2026!
--
-- Hash format: pbkdf2:100000:SHA-256:<salt_hex>:<hash_hex>
-- Generated with Web Crypto PBKDF2-SHA256, 100k iterations.
-- ============================================================


-- ============================================================
-- 1. Nikki (super admin — sees all clients)
-- ============================================================

INSERT INTO public.users (
  email,
  password_hash,
  is_super_admin
)
VALUES (
  'nikkidowdell@gmail.com',
  'pbkdf2:100000:SHA-256:9f2674ea16901828058c5a623d49fa3a:5cfacb5f2bc0d99d49e78484472badce8e7df234eefcc33050816e9448993233',
  true
)
ON CONFLICT (email) DO UPDATE SET
  password_hash  = EXCLUDED.password_hash,
  is_super_admin = EXCLUDED.is_super_admin;


-- ============================================================
-- 2. Santa (scoped to client_id = 'santa')
-- ============================================================
-- Santa can log in and see Front Desk + Care sessions for her own practice.
-- She does NOT see Noell Support or other clients.

INSERT INTO public.users (
  email,
  password_hash,
  is_super_admin
)
VALUES (
  'EMAIL_PLACEHOLDER',
  'pbkdf2:100000:SHA-256:5791da67a9b77b5ebe5f78973cfccfbc:9380380cbc4a103cffd36da7e748e032f70b86ff666d2e9123d29ff6f96d9077',
  false
)
ON CONFLICT (email) DO UPDATE SET
  password_hash  = EXCLUDED.password_hash,
  is_super_admin = EXCLUDED.is_super_admin;

-- Wire Santa's user to her client_id
INSERT INTO public.user_clients (user_id, client_id)
SELECT u.id, 'santa'
FROM public.users u
WHERE u.email = 'EMAIL_PLACEHOLDER'
ON CONFLICT (user_id, client_id) DO NOTHING;


-- ============================================================
-- Verify:
--   SELECT email, is_super_admin FROM users WHERE email IS NOT NULL;
--   SELECT u.email, uc.client_id FROM users u
--     JOIN user_clients uc ON uc.user_id = u.id;
-- ============================================================
