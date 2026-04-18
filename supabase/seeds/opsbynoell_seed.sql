-- ============================================================
-- Ops by Noell — clients row (internal support agent)
-- Target project: clipzfkbzupjctherijz
-- GHL location ID: Un5H1b2zXJM3agZ56j7c
-- SMS provider: Twilio (standalone account, post-A2P 10DLC approval)
--
-- Run AFTER:
--   supabase/migrations/0001_agents_schema.sql
--   supabase/migrations/0002_multi_tenant_admin.sql
--
-- PLACEHOLDERS — must be updated before go-live:
--   PHONE_PLACEHOLDER — replace with the purchased Twilio A2P number
--                      (E.164, e.g. +19499991234). Used in:
--                        - clients.phone
--                        - clients.locations[0].phone
--                        - clients.escalation_rules.qualifiedLead.smsTo
--                          (set this one to Nikki's personal cell, NOT
--                          the Twilio number)
--
-- Notes:
--   - Ops by Noell only runs the Support tier on its own marketing site.
--     Front Desk and Care are products sold to reseller clients, not used
--     internally.
--   - sms_provider='twilio' — SMS sends go through the standalone Twilio
--     account configured via TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN /
--     TWILIO_FROM_NUMBER env vars (see docs/ENV_VARS.md).
--   - sms_config.from is informational only; TwilioSms reads the real
--     From number from env at send-time.
-- ============================================================


INSERT INTO public.clients (
  id,
  brand_name,
  vertical,
  phone,
  email,
  agents,

  -- Noell Support config
  support_system_prompt,
  support_greeting,
  support_booking_url,

  -- Noell Front Desk config (unused for Ops by Noell)
  front_desk_system_prompt,
  calendar_provider,
  calendar_config,
  sms_provider,
  sms_config,
  missed_call_text_template,
  review_platform,
  review_url,
  reactivation_threshold_days,

  -- Noell Care config (unused for Ops by Noell)
  care_system_prompt,
  care_greeting,

  -- Business metadata
  hours,
  locations,
  team,
  escalation_rules,
  telegram_chat_id
)
VALUES (
  'opsbynoell',
  'Ops by Noell',
  'internal',
  'PHONE_PLACEHOLDER',
  'hello@opsbynoell.com',
  '{"support": true, "frontDesk": false, "care": false}'::jsonb,

  -- Support system prompt (fallback — v2 prompt file not present at seed-write time)
  'You are the Support agent for Ops by Noell, a small automation agency run by Nikki. Ops by Noell sells three tiers of AI-powered agents to service businesses: Noell Support (website chat + lead capture), Noell Front Desk (24/7 missed-call text-back + booking), and Noell Care (returning-client scheduling and follow-up).

Your job is to (1) greet visitors warmly, (2) answer questions about the three tiers and what each one does, (3) capture the visitor''s name, business, and contact info, and (4) route qualified leads to the contact form at https://www.opsbynoell.com/contact. When a lead is clearly qualified (they run a service business, they''ve described a concrete pain point, and they''ve given contact info), escalate to Nikki via SMS and email using the escalation rules configured on this client.

Be concise, plain-spoken, and grounded. Never invent pricing. If asked about cost, explain that Nikki scopes pricing per-client after a short intake and point them to the contact form. Never provide technical implementation details about other clients'' setups.',

  'Hi — I''m Noell Support. I help with questions about the Noell Support, Front Desk, and Care tiers, and I can route you straight to Nikki. What can I help with?',
  'https://www.opsbynoell.com/book',

  -- Front Desk: not enabled for Ops by Noell
  NULL,

  'ghl',
  '{"locationId": "Un5H1b2zXJM3agZ56j7c"}'::jsonb,

  -- KEY CHANGE: Twilio (standalone account) instead of GHL LC Phone.
  -- The actual From number is read from TWILIO_FROM_NUMBER env at send-time;
  -- the JSON below is informational so operators can see the source.
  'twilio',
  '{"from": "env:TWILIO_FROM_NUMBER"}'::jsonb,

  NULL,            -- missed_call_text_template (Front Desk not in use)
  'google',
  NULL,            -- review_url (not in use yet)
  NULL,            -- reactivation_threshold_days (Care not in use)

  NULL,            -- care_system_prompt
  NULL,            -- care_greeting

  '{}'::jsonb,     -- hours (internal agency, no public hours)

  -- Locations: iPostal1 mailing address (NEVER use 14 Quinn Way publicly)
  '[{
    "name": "Ops by Noell HQ",
    "address": "23710 El Toro Road #1086, Lake Forest, CA 92630",
    "phone": "PHONE_PLACEHOLDER"
  }]'::jsonb,

  '[{"name": "Nikki", "role": "Founder"}]'::jsonb,

  -- Escalation rules: qualified leads alert Nikki via SMS + email.
  -- Replace PHONE_PLACEHOLDER with Nikki's personal cell in E.164 post-Twilio setup.
  '{
    "qualifiedLead": {
      "smsTo":   "PHONE_PLACEHOLDER",
      "emailTo": "hello@opsbynoell.com"
    }
  }'::jsonb,

  NULL             -- telegram_chat_id (not in use)
)
ON CONFLICT (id) DO UPDATE SET
  brand_name                  = EXCLUDED.brand_name,
  vertical                    = EXCLUDED.vertical,
  phone                       = EXCLUDED.phone,
  email                       = EXCLUDED.email,
  agents                      = EXCLUDED.agents,
  support_system_prompt       = EXCLUDED.support_system_prompt,
  support_greeting            = EXCLUDED.support_greeting,
  support_booking_url         = EXCLUDED.support_booking_url,
  front_desk_system_prompt    = EXCLUDED.front_desk_system_prompt,
  calendar_provider           = EXCLUDED.calendar_provider,
  calendar_config             = EXCLUDED.calendar_config,
  sms_provider                = EXCLUDED.sms_provider,
  sms_config                  = EXCLUDED.sms_config,
  missed_call_text_template   = EXCLUDED.missed_call_text_template,
  review_platform             = EXCLUDED.review_platform,
  review_url                  = EXCLUDED.review_url,
  reactivation_threshold_days = EXCLUDED.reactivation_threshold_days,
  care_system_prompt          = EXCLUDED.care_system_prompt,
  care_greeting               = EXCLUDED.care_greeting,
  hours                       = EXCLUDED.hours,
  locations                   = EXCLUDED.locations,
  team                        = EXCLUDED.team,
  escalation_rules            = EXCLUDED.escalation_rules,
  telegram_chat_id            = EXCLUDED.telegram_chat_id;


-- ============================================================
-- Verify with:
--   SELECT id, brand_name, sms_provider, sms_config
--   FROM clients WHERE id = 'opsbynoell';
-- ============================================================
