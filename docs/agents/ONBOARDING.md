# Noell Agents — Onboarding & Deployment

This document is the runbook for standing up a new client on the Noell
agent system and for deploying the platform itself.

## 1. Platform deployment (one-time, already done)

1. **Supabase** — project `clipzfkbzupjctherijz` already hosts Noell
   Support. Apply the migration below to add Front Desk and Care
   tables:

   ```
   psql "$SUPABASE_CONNECTION_STRING" \
     -f supabase/migrations/0001_agents_schema.sql
   ```

   Or paste it into the Supabase SQL editor.

2. **Vercel** — the existing project (the same one hosting
   `opsbynoell.com`) handles all agent API routes. Configure these env
   vars (see `.env.example`):

   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`
   - `ANTHROPIC_API_KEY`
   - `TELEGRAM_BOT_TOKEN`, `TELEGRAM_DEFAULT_CHAT_ID`
   - `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`
     (only if any client uses the generic SMS path)
   - `GHL_API_KEY` (only if any client uses GHL)
   - `CRON_SECRET`

3. **Cron jobs** — `vercel.json` registers three crons:
   - `/api/cron/reminders` every 5 minutes
   - `/api/cron/review-requests` hourly
   - `/api/cron/reactivations` once a day at 14:00 UTC

## 2. Onboarding a new client

Nikki runs this flow for each new client. It takes ~30 minutes for the
interview plus ~15 minutes for provisioning.

### Step 1 — Interview

Collect, at minimum:

- Business name, vertical, phone, email
- Hours (per weekday)
- Location(s): address, parking notes, arrival notes
- Team roster: names, roles, specialties
- Services: name, duration, description, price range (optional)
- FAQ (10-20 questions the front desk hears most)
- Policies: cancellation, late arrival, no-show, insurance, payment
- Review platform + review URL
- Missed-call text-back preference (use default or custom)
- Reactivation threshold (use default 60 days or custom)
- Telegram chat id for their dedicated alerts channel
- Which agents are active for them (support / frontDesk / care)
- Calendar integration choice: ghl / generic / calendly / acuity
  - if ghl: location id, calendar id, API key (if per-location)
  - if generic: working hours by weekday (we default from `hours`)
- SMS integration choice: ghl / twilio / generic

### Step 2 — Insert the clients row

```sql
insert into public.clients (
  client_id, business_name, vertical, active,
  agents,
  support_system_prompt, support_greeting, support_booking_url,
  front_desk_system_prompt,
  calendar_provider, calendar_config,
  sms_provider, sms_config,
  missed_call_text_template,
  reminder_cadence,
  review_platform, review_url,
  reactivation_threshold_days,
  care_system_prompt, care_greeting,
  phone, email,
  hours, locations, team, escalation_rules,
  telegram_chat_id,
  services
)
values (
  'santa-massage', 'Santa Massage', 'massage', true,
  '{"support": true, "frontDesk": true, "care": true}'::jsonb,
  null, 'Hi! What can I help you with?', 'https://example.com/book',
  null,
  'ghl', '{"locationId":"vdWqRPcn6jIx8AK0DlHF","calendarId":"..."}'::jsonb,
  'ghl', '{"locationId":"vdWqRPcn6jIx8AK0DlHF"}'::jsonb,
  null,
  array['24h','2h'],
  'google', 'https://g.page/r/xxxx/review',
  60,
  null, null,
  '949-555-1234', 'hello@santamassage.com',
  '{"mon":"10-6","tue":"10-6","wed":"10-6","thu":"10-8","fri":"10-8","sat":"9-5"}'::jsonb,
  '[{"label":"Studio","address":"123 Main St, Costa Mesa CA"}]'::jsonb,
  '[{"name":"Maya","specialties":["deep tissue","prenatal"]}]'::jsonb,
  '[{"match":["lawsuit","attorney","refund"],"reason":"legal/refund"}]'::jsonb,
  '-100123456789',
  '[{"name":"Deep Tissue 60","durationMinutes":60,"priceRange":"$110"}]'::jsonb
);
```

### Step 3 — Populate the knowledge base (for Care)

Use the admin or `POST /api/care/knowledge`:

```bash
curl -X POST https://opsbynoell.com/api/care/knowledge \
  -H 'content-type: application/json' \
  -d '{
    "clientId":"santa-massage",
    "category":"services",
    "question":"Do you offer deep tissue?",
    "answer":"Yes — 60 and 90 minute options. Usually with Maya.",
    "keywords":["deep tissue","massage","maya"]
  }'
```

Seed the client's existing contact list into `client_contacts` so Care
can recognize returning visitors:

```sql
insert into public.client_contacts (client_id, name, phone, email, last_visit_at, visit_count, preferred_service)
values ('santa-massage', 'Sarah Diaz', '+19495551212', 'sarah@example.com',
        '2026-03-12T18:00:00Z', 8, 'Deep Tissue 60');
```

### Step 4 — Wire up the phone system webhook

The missed-call webhook from the client's phone system (GHL, Twilio,
or other) must POST to:

```
POST https://opsbynoell.com/api/front-desk/missed-call
Content-Type: application/json

{
  "clientId": "santa-massage",
  "from": "+19495551212",
  "to": "+19495550000",
  "callSid": "CA..."
}
```

### Step 5 — Wire up the website chat widget

For the marketing-style demo widget, no action needed — the
`AgentRouter` picks a widget based on path. For a real client site,
they install a small script tag (widget bundle build is tracked
separately):

```html
<script src="https://opsbynoell.com/widget.js"
        data-client-id="santa-massage"
        data-agent="auto"></script>
```

Auto routes to Support for unknown visitors, Care for recognized
ones.

### Step 6 — Smoke test

- POST `/api/front-desk/missed-call` with a test phone — SMS lands,
  Telegram alert fires, session row visible in Supabase.
- POST `/api/front-desk/message` with a follow-up reply — Claude
  responds, message rows persist, classifier tags intent.
- POST `/api/care/message` with a known contact's phone + a service
  question — KB hit is injected, reply answers from KB.
- Hit `/api/cron/reminders` with `Authorization: Bearer <CRON_SECRET>` —
  should return `{ processed: 0, results: [] }` if no appointments are
  scheduled yet.

## 3. What Nikki touches vs. what the client touches

- **Nikki:** interview, SQL inserts, KB seeding, webhook wiring, smoke
  test. No settings UI required.
- **Client:** nothing. They see the Telegram alerts and can take over
  any live conversation, but they never configure anything themselves.

## 4. Adding a new calendar provider (future)

To add Calendly, Acuity, Vagaro, etc.:

1. Implement `CalendarIntegration` (and `SMSIntegration` if needed) in
   a new file under `src/lib/agents/integrations/`.
2. Register it in `src/lib/agents/integrations/registry.ts`.
3. Add the provider string to the `calendar_provider` CHECK constraint
   in Supabase.
4. Ship. No agent logic changes.
