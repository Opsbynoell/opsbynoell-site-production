-- ============================================================
-- Santa (Healing Hands by Santa) — clients row + knowledge_base seed
-- Target project: clipzfkbzupjctherijz
-- GHL location ID: vdWqRPcn6jIx8AK0DlHF
-- WhatsApp number: +19497849726
--
-- Run AFTER: supabase/migrations/0001_agents_schema.sql
--
-- PLACEHOLDERS — must be updated before go-live (marked with PLACEHOLDER):
--   PHONE_PLACEHOLDER              → Santa's real phone number
--   EMAIL_PLACEHOLDER              → Santa's real email address
--   BOOKING_URL_PLACEHOLDER        → GHL calendar booking link for Santa
--   REVIEW_URL_PLACEHOLDER         → Google Business review link
--   TELEGRAM_CHAT_ID_PLACEHOLDER   → Santa's Telegram chat ID for alerts
--   WA_TEMPLATE_MISSED_CALL        → GHL WhatsApp template UUID for missed-call text-back
--   WA_TEMPLATE_CONFIRMATION       → GHL WhatsApp template UUID for appt confirmation
--   WA_TEMPLATE_REMINDER           → GHL WhatsApp template UUID for appt reminder
--   WA_TEMPLATE_REVIEW             → GHL WhatsApp template UUID for review request
--   WA_TEMPLATE_REACTIVATION       → GHL WhatsApp template UUID for reactivation
-- ============================================================


-- ============================================================
-- 1. Upsert the Santa client record
-- ============================================================
-- Note: the `clients` table already exists from the Noell Support install.
-- This upserts the row for Santa using her slug-style ID 'santa'.
-- If clients.id is a UUID in your schema, adjust the id value accordingly
-- and update all knowledge_base rows to match.

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

  -- Noell Front Desk config
  front_desk_system_prompt,
  calendar_provider,
  calendar_config,
  sms_provider,
  sms_config,
  missed_call_text_template,
  reminder_cadence,
  review_platform,
  review_url,
  reactivation_threshold_days,

  -- Noell Care config
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
  'santa',
  'Healing Hands by Santa',
  'massage',
  'PHONE_PLACEHOLDER',
  'EMAIL_PLACEHOLDER',
  '{"support": true, "frontDesk": true, "care": true}'::jsonb,

  -- Support system prompt
  'You are the intake assistant for Healing Hands by Santa, a private massage therapy and Reiki practice in Laguna Niguel, California. Santa is a licensed massage therapist with 25 years of experience specializing in Swedish massage, deep tissue work, hot stone therapy, and Reiki energy healing. She practices out of Divine Healing Chiropractic in Laguna Niguel.

Your job is to warmly greet new visitors, answer questions about services and booking, capture their name and contact information, and guide them toward booking an appointment. You speak with a calm, grounded, welcoming tone — matching the healing environment Santa has created. You never provide medical advice or diagnose conditions. Always encourage visitors to share their specific needs so Santa can personalize their session.',

  'Welcome to Healing Hands by Santa. I''m here to help you find the right session and get you on Santa''s calendar. What brings you in today?',
  'BOOKING_URL_PLACEHOLDER',

  -- Front Desk system prompt
  'You are the automated front desk assistant for Healing Hands by Santa. When a client misses a call or sends an inbound text, respond promptly with warmth and clarity. Your goals are: (1) acknowledge the missed call or inquiry, (2) offer Santa''s next two available appointment slots, (3) provide the booking link. Keep messages brief, calm, and on-brand — never pushy. If the client has an existing appointment, confirm details and offer to reschedule if needed. Always sign off warmly on behalf of Santa.',

  'ghl',
  '{"locationId": "vdWqRPcn6jIx8AK0DlHF"}'::jsonb,

  'ghl_whatsapp',
  '{
    "locationId": "vdWqRPcn6jIx8AK0DlHF",
    "whatsappNumber": "+19497849726",
    "templates": {
      "missedCallTextback":      "WA_TEMPLATE_MISSED_CALL",
      "appointmentConfirmation": "WA_TEMPLATE_CONFIRMATION",
      "appointmentReminder":     "WA_TEMPLATE_REMINDER",
      "reviewRequest":           "WA_TEMPLATE_REVIEW",
      "reactivation":            "WA_TEMPLATE_REACTIVATION"
    }
  }'::jsonb,

  'Hi, this is Santa at Healing Hands. Sorry I missed your call — I was with a client. I''d love to get you on my calendar. Here are my next two open sessions: {SLOT_1} and {SLOT_2}. Book here: BOOKING_URL_PLACEHOLDER',

  ARRAY['24h', '2h'],
  'google',
  'REVIEW_URL_PLACEHOLDER',
  75,

  -- Care system prompt
  'You are the returning-client care assistant for Healing Hands by Santa. You support existing clients with scheduling questions, reschedule requests, service questions, and general support. You have access to their previous visit history. Speak warmly and personally — these are Santa''s long-term clients. For anything that requires Santa''s direct input, escalate gracefully.',

  'Hi, welcome back. How can I help you today?',

  -- Hours (update with real hours before go-live)
  '{
    "monday":    {"open": "09:00", "close": "17:00"},
    "tuesday":   {"open": "09:00", "close": "17:00"},
    "wednesday": {"open": "09:00", "close": "17:00"},
    "thursday":  {"open": "09:00", "close": "17:00"},
    "friday":    {"open": "09:00", "close": "17:00"},
    "saturday":  {"open": "10:00", "close": "15:00"},
    "sunday":    {"open": null, "close": null}
  }'::jsonb,

  -- Locations
  '[{
    "name": "Divine Healing Chiropractic",
    "address": "Laguna Niguel, CA",
    "city": "Laguna Niguel",
    "state": "CA",
    "parking_note": "Free parking in the complex lot"
  }]'::jsonb,

  -- Team
  '[{
    "name": "Santa",
    "role": "Licensed Massage Therapist & Reiki Practitioner",
    "bio": "25 years of experience. Specializes in Swedish massage, deep tissue, hot stone, and Reiki energy healing. Practices out of Divine Healing Chiropractic in Laguna Niguel, CA.",
    "phone": "PHONE_PLACEHOLDER",
    "email": "EMAIL_PLACEHOLDER"
  }]'::jsonb,

  -- Escalation rules
  '[
    {"trigger": "medical question",       "action": "route_to_human", "message": "For questions about medical conditions or contraindications, please reach out to Santa directly at PHONE_PLACEHOLDER."},
    {"trigger": "pricing negotiation",    "action": "route_to_human", "message": "Santa can chat with you about package options. I''ll have her reach out."},
    {"trigger": "complaint",              "action": "route_to_human", "message": "I want to make sure Santa hears about this directly. I''ll flag this for her right away."},
    {"trigger": "cancellation within 24h","action": "notify_human",   "message": "Flagged for Santa: late cancellation within 24-hour window."}
  ]'::jsonb,

  'TELEGRAM_CHAT_ID_PLACEHOLDER'
)
ON CONFLICT (id) DO UPDATE SET
  brand_name              = EXCLUDED.brand_name,
  vertical                = EXCLUDED.vertical,
  phone                   = EXCLUDED.phone,
  email                   = EXCLUDED.email,
  agents                  = EXCLUDED.agents,
  support_system_prompt   = EXCLUDED.support_system_prompt,
  support_greeting        = EXCLUDED.support_greeting,
  support_booking_url     = EXCLUDED.support_booking_url,
  front_desk_system_prompt= EXCLUDED.front_desk_system_prompt,
  calendar_provider       = EXCLUDED.calendar_provider,
  calendar_config         = EXCLUDED.calendar_config,
  sms_provider              = EXCLUDED.sms_provider,
  sms_config                = EXCLUDED.sms_config,
  missed_call_text_template = EXCLUDED.missed_call_text_template,
  reminder_cadence        = EXCLUDED.reminder_cadence,
  review_platform         = EXCLUDED.review_platform,
  review_url              = EXCLUDED.review_url,
  reactivation_threshold_days = EXCLUDED.reactivation_threshold_days,
  care_system_prompt      = EXCLUDED.care_system_prompt,
  care_greeting           = EXCLUDED.care_greeting,
  hours                   = EXCLUDED.hours,
  locations               = EXCLUDED.locations,
  team                    = EXCLUDED.team,
  escalation_rules        = EXCLUDED.escalation_rules,
  telegram_chat_id        = EXCLUDED.telegram_chat_id;


-- ============================================================
-- 2. Knowledge base seed (25 entries across all 5 categories)
-- ============================================================
-- Wipe and re-seed so this script is idempotent on re-runs.
DELETE FROM public.knowledge_base WHERE client_id = 'santa';

INSERT INTO public.knowledge_base
  (client_id, category, question, answer, keywords)
VALUES

-- --------------------------------------------------------
-- SERVICES (8 entries)
-- --------------------------------------------------------

(
  'santa',
  'services',
  'What types of massage does Santa offer?',
  'Santa offers Swedish massage, deep tissue massage, hot stone therapy, and Reiki energy healing. Sessions can be customized to focus on relaxation, muscle recovery, chronic pain relief, or energy balancing depending on what you need.',
  ARRAY['massage', 'services', 'types', 'swedish', 'deep tissue', 'hot stone', 'reiki', 'offerings']
),

(
  'santa',
  'services',
  'What is Swedish massage and who is it good for?',
  'Swedish massage uses long, flowing strokes to promote relaxation, ease muscle tension, and improve circulation. It''s a great starting point if you''re new to massage or looking for a stress-relief session. Most clients leave feeling deeply rested.',
  ARRAY['swedish', 'massage', 'relaxation', 'tension', 'stress', 'beginner', 'gentle']
),

(
  'santa',
  'services',
  'What is deep tissue massage?',
  'Deep tissue massage uses slower, firmer pressure to reach deeper layers of muscle and connective tissue. It''s especially effective for chronic muscle pain, stiffness, and tension buildup in the neck, shoulders, and back. It can feel more intense than Swedish, but Santa will always check in on your comfort level.',
  ARRAY['deep tissue', 'chronic pain', 'muscle', 'pressure', 'stiff', 'neck', 'shoulders', 'back']
),

(
  'santa',
  'services',
  'What is hot stone massage?',
  'Hot stone massage uses smooth, heated basalt stones placed on key points of the body and used as massage tools. The warmth penetrates deep into the muscles, releasing tension more quickly than hands alone. It''s ideal for relaxation, muscle relief, and clients who run cold or carry a lot of tension.',
  ARRAY['hot stone', 'heated', 'basalt', 'warmth', 'tension', 'relaxation', 'stones']
),

(
  'santa',
  'services',
  'What is Reiki and what should I expect?',
  'Reiki is a Japanese energy healing practice where Santa gently places her hands on or just above your body to promote relaxation and support the body''s natural healing. Sessions are fully clothed and deeply calming. Many clients report feeling lighter, more grounded, and less anxious afterward. No prior experience with energy work is needed.',
  ARRAY['reiki', 'energy healing', 'energy', 'chakra', 'healing', 'clothed', 'japanese', 'light', 'grounded']
),

(
  'santa',
  'services',
  'Can I combine massage and Reiki in one session?',
  'Yes. Santa can incorporate Reiki into a massage session, or structure a dedicated combination session. If you''re interested in this, mention it when you book so she can plan the right flow for your time.',
  ARRAY['combine', 'combination', 'massage and reiki', 'both', 'integrated', 'session']
),

(
  'santa',
  'services',
  'How long are sessions and what do they cost?',
  'Sessions are typically 60 or 90 minutes. Pricing details are available when you book. Santa can also discuss what session length is right for your goals when you reach out.',
  ARRAY['price', 'cost', 'how much', 'rate', 'pricing', 'session length', '60 minute', '90 minute', 'duration']
),

(
  'santa',
  'services',
  'Do you offer gift certificates?',
  'Yes, gift certificates are available. They make a thoughtful gift for birthdays, holidays, or anyone who needs a reset. Reach out directly to Santa at PHONE_PLACEHOLDER to arrange one.',
  ARRAY['gift', 'gift certificate', 'gift card', 'present', 'birthday', 'holiday', 'give']
),


-- --------------------------------------------------------
-- FAQ (8 entries)
-- --------------------------------------------------------

(
  'santa',
  'faq',
  'How do I book an appointment?',
  'You can book directly through Santa''s online calendar here: BOOKING_URL_PLACEHOLDER. If you''d rather talk first, text or call PHONE_PLACEHOLDER and Santa or her automated system will get back to you quickly with available times.',
  ARRAY['book', 'booking', 'appointment', 'schedule', 'how to book', 'calendar', 'reserve']
),

(
  'santa',
  'faq',
  'What should I do to prepare for my appointment?',
  'Arrive a few minutes early so you have time to settle in. Drink water before and after your session. Avoid heavy meals right before. Let Santa know about any health conditions, injuries, or areas you want her to focus on or avoid. There''s nothing else you need to do — she handles the rest.',
  ARRAY['prepare', 'preparation', 'before appointment', 'what to do', 'arrive', 'intake', 'first time']
),

(
  'santa',
  'faq',
  'Do I need to undress for the massage?',
  'For massage sessions, most clients undress to their comfort level and are fully draped with a sheet at all times. Santa only uncovers the area she is working on. For Reiki, you remain fully clothed. If you have any concerns, just ask — she''s experienced at adapting to your comfort.',
  ARRAY['undress', 'clothes', 'drape', 'privacy', 'modesty', 'comfortable', 'covered', 'sheet', 'clothed']
),

(
  'santa',
  'faq',
  'What is your cancellation policy?',
  'Santa asks for at least 24 hours notice to cancel or reschedule. Late cancellations may be subject to a fee. Life happens — if something comes up, just reach out as early as possible so she can offer that slot to someone on the waitlist.',
  ARRAY['cancel', 'cancellation', 'reschedule', 'policy', 'fee', 'notice', 'no show', '24 hours', 'late']
),

(
  'santa',
  'faq',
  'Is massage safe if I have a medical condition?',
  'Many conditions respond well to massage, but some require modifications or contraindicate certain techniques. If you have a health condition, injury, pregnancy, or recent surgery, please mention it when you book. Santa will let you know what''s appropriate and safe for your situation. When in doubt, check with your doctor first.',
  ARRAY['medical', 'condition', 'safe', 'health', 'injury', 'pregnancy', 'surgery', 'contraindication', 'doctor']
),

(
  'santa',
  'faq',
  'Can I request a specific focus area?',
  'Yes. Santa encourages you to share where you''re holding tension or what you want the session to address. She customizes every session based on what you tell her during the intake conversation at the start.',
  ARRAY['focus', 'specific area', 'customize', 'personalize', 'neck', 'back', 'shoulders', 'feet', 'request']
),

(
  'santa',
  'faq',
  'How often should I get a massage?',
  'It depends on your goals. For stress relief and general wellness, monthly is a great rhythm. For chronic tension or recovery, every two to three weeks makes a meaningful difference. Santa can recommend a cadence based on what you''re working through.',
  ARRAY['how often', 'frequency', 'monthly', 'regular', 'recurring', 'schedule', 'maintenance', 'wellness']
),

(
  'santa',
  'faq',
  'Do you accept insurance?',
  'Healing Hands by Santa is a private practice and does not bill insurance directly. Some HSA and FSA cards can be used for massage therapy — check with your plan. Santa can provide a receipt if needed for reimbursement purposes.',
  ARRAY['insurance', 'hsa', 'fsa', 'billing', 'coverage', 'reimburse', 'receipt', 'health savings']
),


-- --------------------------------------------------------
-- LOCATION (3 entries)
-- --------------------------------------------------------

(
  'santa',
  'location',
  'Where is Healing Hands by Santa located?',
  'Santa practices out of Divine Healing Chiropractic in Laguna Niguel, California. Free parking is available in the complex lot. The exact address and suite number will be included in your booking confirmation.',
  ARRAY['location', 'address', 'where', 'directions', 'laguna niguel', 'divine healing', 'chiropractic', 'parking']
),

(
  'santa',
  'location',
  'What are your hours?',
  'Santa''s availability varies by week. The most accurate view of open slots is always on her booking calendar: BOOKING_URL_PLACEHOLDER. She typically sees clients Monday through Saturday, with Sunday off.',
  ARRAY['hours', 'open', 'availability', 'when', 'days', 'schedule', 'times', 'weekends', 'saturday']
),

(
  'santa',
  'location',
  'Is there parking at Divine Healing Chiropractic?',
  'Yes, there is free parking in the complex lot. It''s easy to find — the full parking and arrival details are included in your booking confirmation.',
  ARRAY['parking', 'park', 'lot', 'drive', 'arrive', 'complex']
),


-- --------------------------------------------------------
-- POLICIES (3 entries)
-- --------------------------------------------------------

(
  'santa',
  'policies',
  'What is your late arrival policy?',
  'If you arrive late, Santa will do her best to accommodate, but your session may need to end at the scheduled time to respect the next client. Please text ahead if you''re running behind so she can plan accordingly.',
  ARRAY['late', 'arrival', 'late arrival', 'running late', 'tardy', 'on time', 'start time']
),

(
  'santa',
  'policies',
  'What is your refund policy?',
  'Sessions are non-refundable after they are completed. If you need to reschedule, please give at least 24 hours notice. Gift certificates are non-refundable but can be transferred to another person.',
  ARRAY['refund', 'refundable', 'money back', 'return', 'cancel', 'gift certificate refund']
),

(
  'santa',
  'policies',
  'Do you have a waitlist for cancellations?',
  'Yes. If you want to get on the waitlist for a sooner slot, text Santa at PHONE_PLACEHOLDER or use the booking link to check for newly opened availability. She fills cancellation spots quickly.',
  ARRAY['waitlist', 'wait list', 'sooner', 'cancellation', 'opening', 'earlier', 'availability', 'last minute']
),


-- --------------------------------------------------------
-- TEAM (3 entries)
-- --------------------------------------------------------

(
  'santa',
  'team',
  'Tell me about Santa',
  'Santa is a licensed massage therapist and Reiki practitioner with 25 years of experience. She practices out of Divine Healing Chiropractic in Laguna Niguel, CA. Her approach is deeply intuitive and personalized — she works with what your body needs in each session, not a rigid script. Clients often describe sessions with her as both physically restorative and genuinely calming.',
  ARRAY['santa', 'about', 'who is', 'therapist', 'background', 'experience', 'bio', 'practitioner']
),

(
  'santa',
  'team',
  'How long has Santa been practicing?',
  'Santa has been a licensed massage therapist and Reiki practitioner for over 25 years. She''s seen thousands of clients and brings deep expertise to every modality she offers.',
  ARRAY['experience', 'years', 'how long', 'background', 'trained', 'licensed', 'certified', '25 years']
),

(
  'santa',
  'team',
  'Is Santa a licensed therapist?',
  'Yes. Santa is a licensed massage therapist in California and a certified Reiki practitioner. She has maintained her license and practice for over 25 years.',
  ARRAY['licensed', 'certification', 'credentials', 'qualified', 'california', 'lmt', 'reiki certified']
);


-- ============================================================
-- Done. Verify with:
--   SELECT category, count(*) FROM knowledge_base WHERE client_id = 'santa' GROUP BY category;
--   SELECT brand_name, vertical, phone, email FROM clients WHERE id = 'santa';
-- ============================================================
