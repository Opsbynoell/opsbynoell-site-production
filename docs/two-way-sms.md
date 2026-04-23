# Two-Way SMS Reply Bridge

When an AI agent escalates a visitor conversation, the system sends an alert SMS to Nikki's phone. This doc explains how her reply gets routed back into the visitor's chat widget — pausing the AI and posting her reply as a human message.

---

## How it works

```
┌──────────────────────────────────────────────────────────────────────────┐
│ 1. Visitor sends message → AI escalates → outbound alert SMS             │
│                                                                          │
│    FROM: +19499973915  (LC Phone / fromNumber)                           │
│    TO:   +19497849726  (Nikki's cell / alertSmsTo)                       │
│    BODY: "New Noell Front Desk lead…\nOpen: https://…/sessions/UUID?…"   │
│                                                                          │
│    ✦ On send: upsert sms_alert_sessions                                  │
│      (from_phone=+19497849726, to_phone=+19499973915, session_id=UUID)   │
└──────────────────────────────────────────────────────────────────────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 2. Nikki replies "Heyyyyyy"                                              │
│                                                                          │
│    FROM: +19497849726  (Nikki — matches from_phone in table)             │
│    TO:   +19499973915  (LC Phone — matches to_phone in table)            │
└──────────────────────────────────────────────────────────────────────────┘
           │  GHL fires Conversations webhook
           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│ 3. POST /api/ghl/inbound-sms?secret=<GHL_WEBHOOK_SECRET>                │
│                                                                          │
│    • Look up sms_alert_sessions (from_phone, to_phone)                   │
│    • Insert chatMessages/front_desk_messages/care_messages row:          │
│        { role: "human", content: "Heyyyyyy", author: "Nikki (human)" }  │
│    • PATCH chatSessions / front_desk_sessions / care_sessions:           │
│        { humanTakeover: true }   (or human_takeover for newer tables)   │
│    • AI stops replying; Nikki's message appears in visitor widget        │
└──────────────────────────────────────────────────────────────────────────┘
```

**Phone semantics** (the most common two-way SMS bug):
The table key `(from_phone, to_phone)` is stored from the **replier's perspective** — `from_phone` is Nikki's cell (she will be replying), `to_phone` is the LC Phone that receives the reply. This matches exactly how the inbound webhook delivers the message.

---

## Vercel environment variable

| Variable | Description |
|---|---|
| `GHL_WEBHOOK_SECRET` | Shared secret for webhook auth. Pass as `?secret=` in the URL. |

Generate a value:
```sh
openssl rand -hex 32
```

Set it in Vercel: **Settings → Environment Variables → GHL_WEBHOOK_SECRET**.

Staging value (rotate after testing):
```
d5e727c0f14dc4844a2320052df8a3042e81fa5939fdb77f09e6ee0276ab4fb6
```

---

## Webhook URL

```
https://www.opsbynoell.com/api/ghl/inbound-sms?secret=<GHL_WEBHOOK_SECRET>
```

Replace `<GHL_WEBHOOK_SECRET>` with the exact value you set in Vercel.

---

## GHL automation setup (send to Nikki)

1. In your GHL sub-account, go to **Automations → Workflows**.
2. Click **+ New Workflow** → **Start from Scratch**.
3. **Trigger**: Customer Reply → filter on **Channel = SMS**.
4. **Action**: Webhook
   - Method: `POST`
   - URL: `https://www.opsbynoell.com/api/ghl/inbound-sms?secret=<GHL_WEBHOOK_SECRET>`
   - Body format: `application/json`
   - Body (paste as-is):
     ```json
     {
       "phone": "{{contact.phone}}",
       "toNumber": "{{message.to_number}}",
       "body": "{{message.body}}",
       "contactId": "{{contact.id}}",
       "conversationId": "{{conversation.id}}"
     }
     ```
5. Save and **Publish** the workflow.

> **Tip**: GHL's Conversations webhook can also be used instead of a workflow if you prefer — both `phone`/`toNumber`/`body` and `from`/`to`/`message` field names are accepted by the endpoint.

---

## Database migration

`supabase/migrations/0005_sms_alert_sessions.sql` creates the correlation table. Run it via the Supabase dashboard SQL editor or the CLI:

```sh
supabase db push
```

---

## Manual test plan

### 1. Pre-flight
- [ ] `GHL_WEBHOOK_SECRET` is set in Vercel (or `.env.local` for local dev).
- [ ] Migration `0005` applied to your Supabase project.
- [ ] GHL workflow is published.

### 2. Trigger an alert
1. Open the front-desk widget (or support widget) in a browser.
2. Send a message that triggers an escalation (e.g. "I want to book" or any keyword in the escalation rules).
3. Check Nikki's phone — she should receive an SMS with the inbox link.

### 3. Check sms_alert_sessions
In Supabase table editor, open `sms_alert_sessions`:
- You should see a row with `from_phone = <Nikki's cell>`, `to_phone = <LC Phone>`, and a valid `session_id`.

### 4. Reply
From Nikki's phone, reply to the alert SMS with "Heyyyyyy".

### 5. Verify widget + session
1. Open `https://www.opsbynoell.com/admin/sessions/<session_id>?agent=frontDesk` (or the agent matching the alert).
2. The message "Heyyyyyy" should appear with the author badge **"Nikki (human)"**.
3. The header badge should show **"Human"** (humanTakeover=true).
4. Sending another message from the visitor widget should be stored but **not receive an AI reply** (human takeover active).

### 6. cURL smoke test (no phone required)
```sh
curl -s -X POST \
  "https://www.opsbynoell.com/api/ghl/inbound-sms?secret=<GHL_WEBHOOK_SECRET>" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "<Nikki_cell>",
    "toNumber": "<LC_Phone>",
    "body": "Test reply from cURL"
  }' | jq .
```
Expected: `{ "ok": true, "sessionId": "..." }` (assuming a recent alert was sent).

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `{ "ok": false, "reason": "unauthorized" }` | Wrong `?secret=` value — check Vercel env var matches webhook URL |
| `{ "ok": true, "reason": "no_mapping" }` | No alert was sent to this phone pair recently, or `fromNumber` not set in `sms_config` |
| Message appears but AI keeps replying | `humanTakeover`/`human_takeover` column not being read — check table name and column for the agent |
| Double messages | GHL fired the workflow for the outbound alert AND the inbound reply — add a filter on the trigger: **Direction = Inbound** |
