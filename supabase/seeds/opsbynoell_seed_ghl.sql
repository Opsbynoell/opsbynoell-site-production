-- ============================================================
-- Ops by Noell — clients row (internal support agent)
-- Target project: clipzfkbzupjctherijz
-- GHL location ID: Un5H1b2zXJM3agZ56j7c
-- SMS provider: GHL LC Phone (A2P 10DLC approved 2026-04-18)
--
-- APPLY THIS SEED. The sibling file opsbynoell_seed.twilio.pending.sql
-- is parked until a standalone Twilio account exists.
--
-- Run AFTER:
--   supabase/migrations/0001_agents_schema.sql
--   supabase/migrations/0002_multi_tenant_admin.sql
--
-- Numbers in this file:
--   +19499973915 — "Nikki's number" in GHL LC Phone (A2P verified).
--                  Used as the From number for outbound SMS from the
--                  Noell Support chat widget, and as the public
--                  business phone on the locations block.
--   +19497849726 — Business receiving line (Verizon, James Noell).
--                  All qualified-lead escalation SMS alerts go here.
--
-- Telegram is intentionally disabled (telegram_chat_id = NULL).
-- Qualified-lead alerts route: SMS -> +19497849726, email -> hello@opsbynoell.com.
--
-- sms_config.alertSmsTo is a LIVE field read by src/lib/agents/sms-alert.ts
-- at escalation time — it is no longer just stored for future use. When
-- the runner's escalation block fires, sendOwnerSmsAlert() reads this
-- value and dispatches the qualified-lead SMS via the configured GHL
-- LC Phone integration (in parallel with the Telegram + email alerts).
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
  '+19499973915',
  'hello@opsbynoell.com',
  '{"support": true, "frontDesk": false, "care": false}'::jsonb,

  -- Support system prompt
  'You are the Support agent for Ops by Noell, a small automation agency run by Nikki. Ops by Noell sells three tiers of AI-powered agents to service businesses: Noell Support (website chat + lead capture), Noell Front Desk (24/7 missed-call text-back + booking), and Noell Care (returning-client scheduling and follow-up).

Your job is to (1) greet visitors warmly, (2) answer questions about the three tiers and what each one does, (3) capture the visitor''s name, business, and contact info, and (4) route qualified leads to the contact form at https://www.opsbynoell.com/contact. When a lead is clearly qualified (they run a service business, they''ve described a concrete pain point, and they''ve given contact info), escalate to Nikki via SMS and email using the escalation rules configured on this client.

Be concise, plain-spoken, and grounded. Never invent pricing. If asked about cost, explain that Nikki scopes pricing per-client after a short intake and point them to the contact form. Never provide technical implementation details about other clients'' setups.',

  'Hi — I''m Noell Support. I help with questions about the Noell Support, Front Desk, and Care tiers, and I can route you straight to Nikki. What can I help with?',
  'https://www.opsbynoell.com/book',

  -- Front Desk: not enabled for Ops by Noell
  NULL,

  'ghl',
  '{"locationId": "Un5H1b2zXJM3agZ56j7c"}'::jsonb,

  -- SMS via GHL LC Phone. A2P 10DLC approved 2026-04-18.
  -- The locationId below routes through the Ops by Noell GHL sub-account,
  -- which sends from +19499973915 ("Nikki's number", A2P verified).
  'ghl',
  '{"locationId": "Un5H1b2zXJM3agZ56j7c", "fromNumber": "+19499973915"}'::jsonb,

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
    "phone": "+19499973915"
  }]'::jsonb,

  '[{"name": "Nikki", "role": "Founder"}]'::jsonb,

  -- Escalation rules: qualified leads alert the Ops by Noell business line
  -- (Verizon, James Noell) via SMS, plus email to hello@opsbynoell.com.
  -- Telegram is intentionally disabled.
  '{
    "qualifiedLead": {
      "smsTo":   "+19497849726",
      "emailTo": "hello@opsbynoell.com"
    }
  }'::jsonb,

  NULL             -- telegram_chat_id (disabled; alerts go via SMS + email)
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
--   SELECT id, brand_name, sms_provider, sms_config,
--          escalation_rules, telegram_chat_id
--   FROM clients WHERE id = 'opsbynoell';
--
-- Expected:
--   sms_provider = 'ghl'
--   sms_config   = {"locationId":"Un5H1b2zXJM3agZ56j7c","fromNumber":"+19499973915"}
--   escalation_rules.qualifiedLead.smsTo = +19497849726
--   telegram_chat_id = NULL
-- ============================================================
