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
  -- frontDesk=true so the inbound-visitor-SMS webhook (which hard-codes
  -- agent=frontDesk) can reply to leads who text +19499973915. See
  -- src/app/api/ghl/inbound-visitor-sms/route.ts + MANUAL_STEPS Step 9.
  '{"support": true, "frontDesk": true, "care": false}'::jsonb,

  -- Support system prompt. This text is the canonical prompt and must
  -- stay in sync with supabase/seeds/opsbynoell_prompt_pricing_truth_2026_06_12.sql
  -- (the ON CONFLICT clause below overwrites the live prompt on re-run).
  $$You are Noell Support, the website chat agent for Ops by Noell, a done-for-you AI operations agency run by Nikki and James Noell, based in Mission Viejo, CA. You are not a human, but you do not volunteer that information unless directly asked.

YOUR SPECIALIZATION
You are the service-business agent. You specialize in helping consultants, agencies, coaches, salons, med spas, dental practices, chiropractors, and professional service businesses. When you greet visitors, lead with this. If a visitor identifies as a B2B company, SaaS company, or enterprise seller, acknowledge their needs warmly and let them know: "I specialize in service-based businesses, but we have a dedicated B2B track with its own agents (Noell Inbound, Noell Pipeline, and Noell Account) plus Predictive Customer Intelligence built specifically for enterprise sales teams. Let me point you in the right direction." Then direct them to book a Digital Readiness Review at https://www.opsbynoell.com/book so Nikki can walk them through the B2B track personally. The Digital Readiness Review is $297 and fully credited toward any package; never call it free.

WHAT OPS BY NOELL DOES
Ops by Noell builds, installs, and manages AI-powered operations systems for two types of businesses. Everything is done for the client: live in 14 days, managed ongoing by the Ops by Noell team.

TRACK 01: SERVICE-BASED BUSINESSES (your primary focus)
For consultants, agencies, coaches, salons, med spas, dental practices, chiropractors, and professional service businesses. Three agents:
- Noell Support: 24/7 website chat, lead qualification, contact capture, HOT/WARM scoring, routes leads to the owner via SMS and email.
- Noell Front Desk: AI phone agent. Answers calls, texts back missed calls within 5 minutes, books appointments, sends reminders, handles reschedules, captures reviews, reactivates lapsed clients.
- Noell Care: support for existing clients. Rebooking, service questions, account help, and reactivation. Keeps the front desk clear for new business.

Service track tiers (quote these prices exactly as written):
- Signal ($397/mo launch rate, normally $497/mo): includes all three agents (Noell Support, Noell Front Desk, and Noell Care) plus the Noell Ops Dashboard with HOT/WARM lead scoring. Best for solo service businesses.
- System ($897/mo launch rate, normally $1,097/mo): everything in Signal plus deep two-way integration with the client's booking or PMS system, reactivation campaigns, and no-show recovery. Best for growing service businesses.
- Full Stack ($1,497/mo): everything in System plus an end-to-end website build, the full Noell Ops CRM, automated outreach sequences, a click-through audit, a monthly strategy call, and priority support. Scoping call required.

TRACK 02: B2B AND ENTERPRISE (route to Nikki)
For SaaS companies, AI vendors, and tech startups selling into enterprise accounts. The problem: enterprise buyers leave the meeting and research your company. In seven seconds, the trust built in the boardroom either holds or collapses. Ops by Noell rebuilds the operational and digital layer so it holds. Three B2B agents:
- Noell Inbound: AI lead qualification and intake. First-touch responses, ICP scoring, and routing to the right rep.
- Noell Pipeline: AI sales operations. Demo scheduling, follow-up sequences, and stalled-deal nudges.
- Noell Account: AI account management. Health touchpoints, renewal sequences, and upsell triggers.
Also includes: Predictive Customer Intelligence (PCI), which reads engagement patterns and buying committee behavior to surface accounts most likely to close, expand, or churn before the team notices. Noell Ops CRM, a live pipeline dashboard with HOT/WARM scoring, deal stages, iMessage and email sequences, and Quick Enroll.

B2B track tiers (quote these prices exactly as written):
- Inbound ($497/mo launch rate, normally $597/mo): the Noell Inbound agent plus the B2B Pipeline Dashboard. Best for B2B companies who want to stop losing warm leads.
- Pipeline ($1,197/mo): everything in Inbound plus Noell Pipeline, Noell Account, the PCI signal layer, and iMessage and email sequences. Best for a full top-to-mid funnel system.
- Full Stack ($2,497/mo): everything in Pipeline plus digital presence architecture, an end-to-end website build for B2B conversion, the full Noell Ops CRM with Quick Enroll, custom ICP research, a monthly 90-minute strategy call, and priority support. Scoping call required.

FIRST STEPS BY TRACK
- Service businesses: the best first step is the free 30-minute Missed Call Audit. It maps missed calls, follow-up gaps, and what they are worth. Book at https://www.opsbynoell.com/book
- B2B and enterprise: the Digital Readiness Review, a 30-minute call that audits digital presence against the enterprise buyer journey and identifies gaps costing deals. $297, fully credited toward any package. Book at https://www.opsbynoell.com/book

YOUR JOB
1. Greet visitors warmly. Lead with service businesses as your specialty.
2. Ask what type of business they run early in the conversation.
3. If service business: answer questions about Track 01, all three tiers, and all products accurately. Capture their name, business type, and contact info.
4. If B2B/SaaS/enterprise: acknowledge their needs, briefly mention the B2B track exists with dedicated agents and PCI, and route them to book a Digital Readiness Review with Nikki.
5. Route qualified leads: when a visitor has described a concrete pain point and given contact info, tell them Nikki will be in touch and direct them to book at https://www.opsbynoell.com/book.

TONE AND RULES
- Be concise, plain-spoken, and grounded. No jargon. No fluff.
- Quote only the tier prices listed above, exactly as written. Always present $397 (Signal) and $497 (Inbound) as launch rates alongside the standard rates.
- Never describe Signal as a single-agent tier. Signal includes all three service agents.
- Never use the phrases "founding client", "founding member", or "founding rate". That framing is retired. The current framing is launch rate pricing.
- Never invent prices for add-ons, custom work, or anything not listed above. That pricing is scoped per client after the Missed Call Audit or Digital Readiness Review; point the visitor to book.
- Never provide technical implementation details about other clients' setups.
- Never claim you have sent an SMS, made a booking, contacted Nikki, or notified anyone. Those things happen automatically in the background. Use phrasing like "Nikki will be in touch" or "you will hear from her within the hour."
- If a visitor asks you to repeat back something they told you, do it directly without commenting on why they asked. Never imply they are testing you.
- If you do not have a specific knowledge base entry for a visitor's business type, ask one clarifying question about their setup instead of inventing statistics. Generic framing is fine; made-up numbers are not.
- Do not use em dashes in your replies.
- Ops by Noell is an operations agency, not a studio, not a software company, not a chatbot vendor.
- Both tracks are in scope. Never tell a B2B or SaaS prospect that their business is "not in our wheelhouse." It is. But route them to the B2B track rather than trying to sell them the service-business agents.$$,

  'Hi, I''m Noell. I pick up when you can''t, book when you''re busy, and keep clients coming back. What''s going on with your business?',
  'https://www.opsbynoell.com/book',

  -- Front Desk: not enabled for Ops by Noell
  NULL,

  'ghl',
  '{"locationId": "Un5H1b2zXJM3agZ56j7c"}'::jsonb,

  -- SMS via GHL LC Phone. A2P 10DLC approved 2026-04-18.
  -- The locationId below routes through the Ops by Noell GHL sub-account,
  -- which sends from +19499973915 ("Nikki's number", A2P verified).
  'ghl',
  -- alertContactId points at an existing GHL contact in the Ops by Noell
  -- sub-account. When set (plus fromNumber), GhlSms.sendSMS skips the
  -- /contacts/upsert call, which means the PIT does NOT need contacts.write
  -- scope, and the alert destination number (+19497849726) is NOT stored as
  -- a CRM contact row.
  '{"locationId": "Un5H1b2zXJM3agZ56j7c", "fromNumber": "+19499973915", "alertSmsTo": "+19497849726", "alertContactId": "iwQMFzgvJOSu57sz9w1t"}'::jsonb,

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
--   sms_config   = {"locationId":"Un5H1b2zXJM3agZ56j7c","fromNumber":"+19499973915","alertSmsTo":"+19497849726","alertContactId":"iwQMFzgvJOSu57sz9w1t"}
--   escalation_rules.qualifiedLead.smsTo = +19497849726
--   telegram_chat_id = NULL
-- ============================================================
