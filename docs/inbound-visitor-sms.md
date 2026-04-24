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

### Accepted request bodies

The route works with the smallest possible GHL webhook payload —
`toNumber` is **optional**, because GHL rejects the
`{{message.to_number}}` merge field in some workflow triggers. When
`toNumber` is missing the route falls back to `locationId`, and then to
the single-active-client shortcut.

**Recommended (GHL workflow body):**

```json
{
  "phone": "{{contact.phone}}",
  "body":  "{{message.body}}"
}
```

**Richer shape — pass anything GHL makes available; it is always
preferred over the fallbacks and gives you unambiguous routing:**

```json
{
  "phone":          "{{contact.phone}}",
  "body":           "{{message.body}}",
  "toNumber":       "{{message.to_number}}",
  "locationId":     "{{location.id}}",
  "contactId":      "{{contact.id}}",
  "conversationId": "{{conversation.id}}"
}
```

LC workflow aliases `from` / `to` / `message` and snake_case
`location_id` / `contact_id` / `conversation_id` are also accepted.

---

## Client resolution

The route resolves the owning client in this priority order — the first
strategy that matches wins:

| Priority | Field in payload | Lookup                                   |
| -------- | ---------------- | ---------------------------------------- |
| 1        | `toNumber`       | `clients.sms_config->>fromNumber`        |
| 2        | `locationId`     | `clients.sms_config->>locationId`        |
| 3        | *(none)*         | exactly one active client with `sms_config.fromNumber` set |

Strategy (3) is intentionally strict: if two or more active clients have
`sms_config.fromNumber` configured, the route refuses to guess and
returns `{ok:false, reason:"ambiguous_client", candidates:[…]}`. That
keeps single-tenant installs (current state) frictionless while ensuring
multi-tenant installs are forced to supply `toNumber` or `locationId`.

### Configuration requirements

Each client that accepts inbound visitor SMS must have:

- `clients.sms_config.fromNumber` — LC Phone in E.164 (`+19499973915`)
- `clients.sms_config.locationId` — GHL sub-account location id (used
  by the outbound SMS integration AND as a resolution fallback)
- `clients.active = true`

---

## Response shape

```json
{
  "ok": true,
  "clientId":       "santa",
  "resolvedVia":    "toPhone",        // "toPhone" | "locationId" | "sole"
  "sessionId":      "<uuid>",
  "reply":          "<bot reply text>",
  "replySent":      true,
  "replyMessageId": "<provider message id>",
  "replyError":     null,
  "escalated":      false,
  "intent":         "warm"
}
```

All failure modes return HTTP 200 so GHL does not retry-storm:

| `reason`                  | Meaning |
| ------------------------- | ------- |
| `unauthorized`            | Wrong / missing `?secret=` |
| `bad_json`                | Body was not valid JSON |
| `missing_phones`          | Visitor `phone` / `from` was not in the payload |
| `no_client_for_to_phone`  | No active client matched any resolution strategy |
| `ambiguous_client`        | ≥2 active clients matched the sole-client fallback — supply `toNumber` or `locationId` |
| `loop_guard`              | Visitor phone equals our own LC Phone — refuse to reply |
| `db_error`                | Supabase lookup failed |
| `run_turn_failed`         | Reply generation threw |

---

## Loop safety

Two layers keep outbound bot replies from re-triggering the webhook:

1. **GHL workflow filter — required.** Add `Direction = Inbound` to the
   workflow trigger so outbound sends never fire the webhook in the
   first place.
2. **Server-side loop guard.** Even if the workflow filter is misset,
   the route refuses to reply when `fromPhone` equals the client's own
   `sms_config.fromNumber` (returns `reason:"loop_guard"`).

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
   - Body (minimal — works today; GHL rejects `{{message.to_number}}`):
     ```json
     {
       "phone": "{{contact.phone}}",
       "body":  "{{message.body}}"
     }
     ```
   - Body (preferred — add any fields GHL accepts for unambiguous routing):
     ```json
     {
       "phone":          "{{contact.phone}}",
       "body":           "{{message.body}}",
       "locationId":     "{{location.id}}",
       "contactId":      "{{contact.id}}",
       "conversationId": "{{conversation.id}}"
     }
     ```
4. Save and **Publish**.

**Important:** This workflow must be published per-client sub-account
(Healing Hands, Ops by Noell, etc.) — each has its own LC Phone. The
same `GHL_WEBHOOK_SECRET` can be reused across sub-accounts because the
route resolves the client per-request, not from the secret.

---

## Manual test plan

1. Confirm `clients.sms_config.fromNumber` is populated for the target client.
2. Text the client's LC Phone from a mobile device.
3. Expected: bot reply arrives via SMS, and a row appears in
   `front_desk_sessions` with `trigger_type = 'inbound_text'` and
   `channel = 'sms'`.
4. cURL smoke tests (use a visitor phone that is NOT the LC Phone itself):
   ```bash
   # Minimal shape GHL will accept — resolves via the single-client fallback
   # when only one active client has sms_config.fromNumber set.
   curl -s -X POST \
     "https://www.opsbynoell.com/api/ghl/inbound-visitor-sms?secret=<SECRET>" \
     -H "Content-Type: application/json" \
     -d '{
       "phone": "+17145550123",
       "body":  "test from curl"
     }' | jq .

   # Explicit toNumber — resolves via sms_config.fromNumber.
   curl -s -X POST \
     "https://www.opsbynoell.com/api/ghl/inbound-visitor-sms?secret=<SECRET>" \
     -H "Content-Type: application/json" \
     -d '{
       "phone":    "+17145550123",
       "toNumber": "+19499973915",
       "body":     "test from curl"
     }' | jq .

   # Explicit locationId — resolves via sms_config.locationId.
   curl -s -X POST \
     "https://www.opsbynoell.com/api/ghl/inbound-visitor-sms?secret=<SECRET>" \
     -H "Content-Type: application/json" \
     -d '{
       "phone":      "+17145550123",
       "locationId": "Un5H1b2zXJM3agZ56j7c",
       "body":       "test from curl"
     }' | jq .
   ```

Inspect the response for `"resolvedVia": "<toPhone|locationId|sole>"` to
confirm the resolution path. Use the dashboard or a staging LC Phone for
live tests — do not pound the production inbox with curl runs.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `{ok:false,reason:"unauthorized"}` | Wrong `?secret=` — mismatch between Vercel env var and webhook URL |
| `{ok:false,reason:"missing_phones"}` | No `phone` / `from` in body. Use `"phone":"{{contact.phone}}"` |
| `{ok:false,reason:"no_client_for_to_phone"}` | `clients.sms_config.fromNumber` is missing or a different number, and no `locationId` fallback matched either |
| `{ok:false,reason:"ambiguous_client",candidates:[…]}` | Multiple active clients have `sms_config.fromNumber` — add `toNumber` or `locationId` to the webhook body |
| `{ok:false,reason:"loop_guard"}` | Inbound `phone` equals our own LC Phone. Usually means the workflow is firing on outbound sends — add `Direction = Inbound` |
| `{ok:true,replySent:false,replyError:"empty_reply"}` | Bot returned no text (human_takeover or model refusal) |
| Bot replies show up in inbox but visitor never receives them | Outbound SMS integration mis-configured — check `sms_provider` + `sms_config` on the `clients` row |
| Webhook fires in a loop | Direction filter missing — add `Direction = Inbound` to the workflow trigger |
