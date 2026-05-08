# Manual Steps — Ops by Noell Marketing Site

Everything in this repo deploys automatically via Vercel + GitHub push.  
The items below require manual action in external dashboards.

---

## Step 1 — Supabase: Apply the agents schema migration

**Project:** `clipzfkbzupjctherijz`  
**Dashboard:** https://supabase.com/dashboard/project/clipzfkbzupjctherijz/sql/new

Open the SQL editor and run the contents of:

```
supabase/migrations/0001_agents_schema.sql
```

This is idempotent (uses `IF NOT EXISTS` and `IF NOT EXISTS` column adds).  
Safe to re-run if you're unsure whether it has been applied.

**Verify:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN (
    'front_desk_sessions', 'front_desk_messages', 'appointments',
    'care_sessions', 'care_messages', 'knowledge_base', 'client_contacts'
  );
```
Should return 7 rows.

---

## Step 2 — Supabase: Seed Santa's client record + knowledge base

After Step 1 is confirmed, run:

```
supabase/seeds/santa_seed.sql
```

Before running, fill in the placeholders at the top of the file:

| Placeholder | Replace with |
|---|---|
| `PHONE_PLACEHOLDER` | Santa's real phone number |
| `santa@healinghandsbysanta.com` | Santa's real email |
| `BOOKING_URL_PLACEHOLDER` | GHL calendar booking URL for Santa |
| `REVIEW_URL_PLACEHOLDER` | Google Business review link |
| `TELEGRAM_CHAT_ID_PLACEHOLDER` | Santa's Telegram chat ID for alert routing |

**Verify:**
```sql
SELECT brand_name, vertical, phone, email FROM clients WHERE id = 'santa';
SELECT category, count(*) FROM knowledge_base WHERE client_id = 'santa' GROUP BY category;
```
Should return 1 client row and 5 category rows (services 8, faq 8, location 3, policies 3, team 3 = 25 total).

---

## Step 3 — Vercel: Set environment variables

**Project:** `opsbynoell-marketing-preview` (or production project — whichever is deploying the marketing site)  
**Dashboard:** https://vercel.com/dashboard → project → Settings → Environment Variables

Add all of these. Set scope to **Production + Preview + Development** unless noted.

| Variable | Value | Notes |
|---|---|---|
| `SUPABASE_URL` | `https://clipzfkbzupjctherijz.supabase.co` | |
| `SUPABASE_SERVICE_ROLE_KEY` | *(from Supabase dashboard → Settings → API)* | Service role key, not anon key |
| `ANTHROPIC_API_KEY` | *(your Anthropic API key)* | |
| `CRON_SECRET` | `8e419828aaed5017675155c4320e7b31967dbd397096a18c502a54ba4eb15b01` | Used to authenticate cron job calls |
| `ADMIN_PASSWORD` | *(choose a strong password)* | Used to log into /admin |
| `ADMIN_SECRET` | *(choose a random 32+ char secret)* | Used to sign admin session tokens |
| `GHL_API_KEY` | *(GoHighLevel API key)* | Used for GHL integration routes |
| ~~`NEXT_PUBLIC_BOOKING_URL`~~ | **DEFERRED.** Not used. `/book` is manual-scheduling only until a real scheduler is verified end to end. | The /book page now ships a request-a-working-call form (writes to `book_requests` in Supabase, notifies via Resend). Do not set this var. |

**~~How to find `NEXT_PUBLIC_BOOKING_URL`~~ (deferred):**  
GHL → Calendars → [Audit calendar] → Share → Embed code → copy the iframe `src` URL (the widget URL, not the API endpoint). It will look like `https://api.leadconnectorhq.com/widget/booking/...` or similar. Do **not** paste the full `<iframe>` tag — only the URL inside the `src` attribute.

---

## Step 4 — Redeploy

After setting env vars, trigger a redeploy:

1. Go to Vercel dashboard → project → Deployments
2. Click the three dots on the latest deployment → Redeploy
3. Wait for build to complete (usually 1-2 minutes)

Or push any commit to trigger an automatic deploy.

---

## Step 5 — Supabase: Apply multi-tenant admin migrations

Run these two scripts in order in the SQL editor.

**5a.** `supabase/migrations/0002_multi_tenant_admin.sql`
Adds `is_super_admin` to the users table and fixes the `sms_provider` constraint for `ghl_whatsapp`. Already applied — safe to re-run (idempotent).

**5b.** `supabase/migrations/0003_admin_users_table.sql`
Creates `public.admin_users` (separate from Supabase Auth) and recreates `user_clients` with the correct FK.

**Verify after 5b:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('admin_users', 'user_clients');
-- Should return 2 rows

SELECT column_name FROM information_schema.columns
WHERE table_name = 'admin_users';
-- Should show: id, email, password_hash, is_super_admin, created_at, updated_at
```

---

## Step 6 — Supabase: Seed admin users

```
supabase/seeds/0002_admin_users.sql
```

This creates:
- **Nikki** (`hello@opsbynoell.com`) — super admin, sees all clients
- **Santa** (`santa@healinghandsbysanta.com`) — scoped to `client_id = 'santa'`

Temp passwords:
| User | Temp password |
|---|---|
| Nikki | `NoellAdmin2026!` |
| Santa | `HealingHands2026!` |

**Change these immediately after first login** via the Users page (`/admin/users`).

**Verify:**
```sql
SELECT email, is_super_admin FROM admin_users;
SELECT u.email, uc.client_id FROM admin_users u
  JOIN user_clients uc ON uc.user_id = u.id;
```

---

## Step 7 — Smoke test the admin dashboard

Navigate to:

```
https://www.opsbynoell.com/admin/login
```

1. Log in with `hello@opsbynoell.com` + `NoellAdmin2026!`
2. Should land on the inbox showing all three agent tabs
3. Super admin badge + email should appear in the header top-right
4. "Users" link in the header → opens `/admin/users`
5. Create/edit/delete a test user to confirm the management UI works
6. Log out → log in as Santa with her temp password
7. Santa should only see Front Desk + Care sessions for `client_id = 'santa'`
8. Santa should NOT see the "Noell Support" tab sessions

**Legacy ADMIN_PASSWORD still works** (no email field needed) for backward compatibility during transition.

**If you see a 500 on `/admin/login`:** env vars (`ADMIN_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`) are likely not set — confirm and redeploy.

---

## Step 8 — GHL WhatsApp templates for Santa

**GHL location:** `vdWqRPcn6jIx8AK0DlHF`  
**WhatsApp Business number:** `+19497849726`

WhatsApp Business templates must be created in GHL and approved by Meta before outbound sends work.  
Until approval the system falls back automatically to free-form SMS.

### 6a. Create the templates in GHL

Go to Santa's GHL sub-account → **Settings → WhatsApp → Templates → New Template**  
Create all five templates below. Set category to **UTILITY** for all of them.

---

**Template name:** `healing_hands_missed_call`  
**Body text:**
```
Hi {{1}}, this is {{2}} at Healing Hands. Sorry I missed your call — I was with a client. I'd love to get you on my calendar: {{3}}
```
Variables: `{{1}}` = first name, `{{2}}` = "Santa", `{{3}}` = booking URL

---

**Template name:** `healing_hands_appt_confirmation`  
**Body text:**
```
Hi {{1}}, you're confirmed with Santa on {{2}} for {{3}}. Reply R to reschedule or C to confirm. See you then!
```
Variables: `{{1}}` = first name, `{{2}}` = date/time, `{{3}}` = service

---

**Template name:** `healing_hands_appt_reminder`  
**Body text:**
```
Hey {{1}} — quick reminder you're on the books {{2}} for {{3}} with Santa. Reply R if anything comes up.
```
Variables: `{{1}}` = first name, `{{2}}` = "tomorrow at 2pm" / "today at 2pm", `{{3}}` = service

---

**Template name:** `healing_hands_review_request`  
**Body text:**
```
Hi {{1}}, thank you for coming in today. If you have a moment, a Google review means the world to a small practice like mine: {{2}} — Santa
```
Variables: `{{1}}` = first name, `{{2}}` = Google review URL

---

**Template name:** `healing_hands_reactivation`  
**Body text:**
```
Hi {{1}}, it's been a while and I'd love to see you back in for an appointment. I have openings this week: {{2}} — Santa
```
Variables: `{{1}}` = first name, `{{2}}` = booking URL

---

### 6b. After Meta approves the templates

Once Meta approves each template, GHL assigns it an internal UUID (visible in Settings → WhatsApp → Templates).  
Copy each UUID and update the `sms_config.templates` JSON in the `santa` clients row:

```sql
UPDATE public.clients
SET sms_config = sms_config || jsonb_build_object(
  'templates', jsonb_build_object(
    'missedCallTextback',      '<GHL_UUID_FOR_healing_hands_missed_call>',
    'appointmentConfirmation', '<GHL_UUID_FOR_healing_hands_appt_confirmation>',
    'appointmentReminder',     '<GHL_UUID_FOR_healing_hands_appt_reminder>',
    'reviewRequest',           '<GHL_UUID_FOR_healing_hands_review_request>',
    'reactivation',            '<GHL_UUID_FOR_healing_hands_reactivation>'
  )
)
WHERE id = 'santa';
```

Until these are filled in, the system sends free-form WhatsApp messages (works within 24-hour session windows).

### 6c. Smoke test after template IDs are set

```bash
curl -X POST https://www.opsbynoell.com/api/front-desk/missed-call \
  -H "Content-Type: application/json" \
  -d '{"clientId":"santa","from":"+17145551234","contactName":"Test User"}'
```

Expected: `{"sessionId":"...","smsSent":true,"smsError":null}`  
Check GHL Conversations for the contact `+17145551234` — should see a WhatsApp template message.

---

## Step 9 — Enable frontDesk for `opsbynoell` (inbound visitor-SMS bridge)

The `/api/ghl/inbound-visitor-sms` webhook always runs under `agent=frontDesk`
because the shared runner writes to `front_desk_sessions` / `front_desk_messages`.
The original `opsbynoell` seed set `agents.frontDesk = false`, which makes
`runTurn` abort with `agent_not_enabled` before any session row is written.

The seed file has been updated to `true`, but production rows are only
overwritten when the `opsbynoell_seed_ghl.sql` is re-run (the `ON CONFLICT
... DO UPDATE ... agents = EXCLUDED.agents` clause takes care of that).
If you don't want to re-run the full seed, patch just the one column:

```sql
UPDATE public.clients
SET agents = agents || '{"frontDesk": true}'::jsonb
WHERE id = 'opsbynoell';
```

Verify:

```sql
SELECT id, agents FROM public.clients WHERE id = 'opsbynoell';
```

Expected: `agents` JSON should contain `"frontDesk": true`.

Smoke test (without sending live SMS — dispatch fails soft and is visible
via `replyError` in the response):

```bash
curl -X POST "https://www.opsbynoell.com/api/ghl/inbound-visitor-sms?secret=$GHL_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+19497849726","body":"Controlled bridge test after frontDesk enable."}'
```

Expected response shape: `{"ok":true, "clientId":"opsbynoell", "sessionId":"...", ...}`.
A new row should appear in `public.front_desk_sessions` and two rows (visitor
+ bot) in `public.front_desk_messages`. If `ok:false` with
`reason:"agent_not_enabled"`, the DB update above has not been applied.

---

## What is already done (no action required)

- **Task 1 — Widget site-wide:** `AgentRouter` component in `src/app/layout.tsx` already renders the correct widget on every page. No changes needed.
- **Task 2 — Admin dashboard:** All files are written and deployed. Routes: `/admin/login`, `/admin` (inbox), `/admin/sessions/[id]` (conversation detail). API routes under `/api/admin/`.
- **Task 3 — UX fixes:**
  - FAQ accordion now allows multiple items open simultaneously
  - Verticals navbar item now has a hover/click dropdown with all 6 vertical links
- **Task 4 — Santa SQL:** Written at `supabase/seeds/santa_seed.sql` (run manually per Step 2)

---

## File reference

| File | Purpose |
|---|---|
| `supabase/migrations/0001_agents_schema.sql` | Main schema migration (run once) |
| `supabase/seeds/santa_seed.sql` | Santa client + knowledge base seed |
| `src/lib/admin-auth.ts` | Admin token creation/verification |
| `src/middleware.ts` | Protects `/admin/*` routes |
| `src/app/admin/login/page.tsx` | Login page |
| `src/app/admin/page.tsx` | Inbox (all 3 agents, 2s polling) |
| `src/app/admin/sessions/[id]/page.tsx` | Conversation detail + operator reply |
| `src/app/api/admin/sessions/route.ts` | GET sessions (all 3 tables normalized) |
| `src/app/api/admin/sessions/[id]/route.ts` | GET single session + messages |
| `src/app/api/admin/sessions/[id]/takeover/route.ts` | POST take over session |
| `src/app/api/admin/sessions/[id]/message/route.ts` | POST operator message |
| `src/components/faq.tsx` | Multi-open FAQ accordion (fixed) |
| `src/components/navbar.tsx` | Navbar with verticals dropdown (added) |


---

## PCI cron tier (per-client scheduled signal generation)

Two new Vercel crons run scheduled PCI signal generation:

- `/api/cron/pci-generate?tier=standard` fires daily at `0 8 * * *` UTC (1am Pacific).
- `/api/cron/pci-generate?tier=realtime` fires every 6 hours at `0 8,14,20,2 * * *` UTC (1am, 7am, 1pm, 7pm Pacific).

Both routes use the same `CRON_SECRET` Bearer auth as the existing crons (no new env var). To opt a client in, set `clients.pci_config.cronTier` in Supabase. See `cron_tier_supabase_sql.sql` at the repo root for the paste-ready SQL.

Tiers:

- `standard` runs once nightly.
- `realtime` runs four times daily.
- `disabled` or missing is skipped by both crons (default).

The admin client detail page surfaces the active tier as a read-only badge next to the Active/Paused pill.
