# Environment Variables

Vercel-scoped environment variables used by the Ops by Noell marketing site
and its agent backend. Set each in the Vercel project for the listed scopes
(Production / Preview / Development) unless a section says otherwise.

The canonical reader for these is `src/lib/agents/env.ts` — any new variable
should be plumbed through there rather than read from `process.env` directly.

## Twilio (Ops by Noell SMS)

Required in Vercel for the opsbynoell client's SMS to work:

- TWILIO_ACCOUNT_SID — from https://console.twilio.com (Account SID, starts with "AC")
- TWILIO_AUTH_TOKEN  — from https://console.twilio.com (Auth Token, rotate if leaked)
- TWILIO_FROM_NUMBER — your purchased A2P-registered number in E.164 format, e.g. "+19499991234"

Scope: Production, Preview, Development.

After setting these, also update in Supabase:
- `clients.phone` for slug=opsbynoell → set to TWILIO_FROM_NUMBER
- `clients.locations[0].phone` → same
- `clients.escalation_rules.qualifiedLead.smsTo` → Nikki's personal cell in E.164
