# Inbound Visitor-SMS Bridge

When a lead or customer texts a client's LC Phone number, this bridge:

1. Receives the inbound via a GHL webhook
2. Resolves which client owns the destination LC Phone
3. Stores the message in `front_desk_messages` and generates a reply via
   the shared runner (escalation rules, Telegram alert, owner SMS alert
   still fire normally)
4. Sends the bot's reply back to the visitor over the client's
   configured messaging integration (GHL SMS, GHL WhatsApp, or generic)

This is distinct from [`docs/two-way-sms.md`](./two-way-sms.md), which
handles the **owner's** reply to an alert SMS, not new inbound from
leads.

---

## Endpoint

```
POST /api/ghl/inbound-visitor-sms?secret=<GHL_WEBHOOK_SECRET>
```

Accepted request bodies (same aliases as the owner-reply route):

```json
{
  "phone":          "+17145550123",    // visitor / lead
  "toNumber":       "+19499973915",    // the client's LC Phone
  "body":           "hi, any openings today?",
  "contactId":      "<optional>",
  "conversationId": "<optional>"
}
```

LC workflow aliases `from` / `to` / `message` are also accepted.

---

## Client resolution

Each client that accepts inbound visitor SMS must have
`clients.sms_config.fromNumber` set to the LC Phone in E.164 format.
The route queries:

```
clients?sms_config->>fromNumber=eq.<toNumber>&active=eq.true
```

If no active client matches, the route returns `{ok:false,reason:"no_client_for_to_phone"}`
with HTTP 200 (so GHL does not retry-storm).

---

## Response shape

```json
{
  "ok": true,
  "sessionId": "<uuid>",
  "reply": "<bot reply text>",
  "replySent": true,
  "replyMessageId": "<provider message id>",
  "replyError": null,
  "escalated": false,
  "intent": "warm"
}
```

Non-2xx is avoided so GHL's retry logic does not loop.

---

## GHL dashboard / webhook config (still required)

These steps are NOT automated by the code — they must be performed in
the GHL dashboard before inbound visitor SMS will route to the bot:

1. **Automations → Workflows → New Workflow**
2. **Trigger:** *Customer Reply* → filter `Channel = SMS` and
   `Direction = Inbound` (the direction filter is **critical** — without
   it, outbound bot replies will loop back into the webhook)
3. **Action: Webhook**
   - Method: `POST`
   - URL: `https://www.opsbynoell.com/api/ghl/inbound-visitor-sms?secret=<GHL_WEBHOOK_SECRET>`
   - Body format: `application/json`
   - Body:
     ```json
     {
       "phone":          "{{contact.phone}}",
       "toNumber":       "{{message.to_number}}",
       "body":           "{{message.body}}",
       "contactId":      "{{contact.id}}",
       "conversationId": "{{conversation.id}}"
     }
     ```
4. Save and **Publish**.

**Important:** This workflow must be published per-client sub-account
(Healing Hands, Ops by Noell, etc.) — each has its own LC Phone. The
same `GHL_WEBHOOK_SECRET` can be reused across sub-accounts because the
route resolves the client from `toNumber`, not from the secret.

---

## Manual test plan

1. Confirm `clients.sms_config.fromNumber` is populated for the target client.
2. Text the client's LC Phone from a mobile device.
3. Expected: bot reply arrives via SMS, and a row appears in
   `front_desk_sessions` with `trigger_type = 'inbound_text'` and
   `channel = 'sms'`.
4. cURL smoke test:
   ```bash
   curl -s -X POST \
     "https://www.opsbynoell.com/api/ghl/inbound-visitor-sms?secret=<SECRET>" \
     -H "Content-Type: application/json" \
     -d '{
       "phone": "+17145550123",
       "toNumber": "+19499973915",
       "body": "test from curl"
     }' | jq .
   ```

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `{ok:false,reason:"unauthorized"}` | Wrong `?secret=` — mismatch between Vercel env var and webhook URL |
| `{ok:false,reason:"no_client_for_to_phone"}` | `clients.sms_config.fromNumber` is missing or a different number |
| `{ok:true,replySent:false,replyError:"empty_reply"}` | Bot returned no text (human_takeover or model refusal) |
| Bot replies show up in inbox but visitor never receives them | Outbound SMS integration mis-configured — check `sms_provider` + `sms_config` on the `clients` row |
| Webhook fires in a loop | Direction filter missing — add `Direction = Inbound` to the workflow trigger |
