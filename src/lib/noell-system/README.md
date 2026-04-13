# Noell System Foundation

A templatable, multi-agent foundation for the Noell product system. Three
agents cover the full client lifecycle for a service business:

- **Noell Support** — new-prospect intake (website chat, qualification, handoff)
- **Noell Front Desk** — operations (calls, scheduling, reminders, reviews, reactivation)
- **Noell Care** — existing-client support (rebooking, account, quick how-tos)

All three share one runtime. Per-agent behavior is config, not code.

---

## Architecture

```
src/lib/noell-system/
├── types.ts                  # All types (AgentConfig, ClientConfig, VerticalConfig, ...)
├── core.ts                   # Runtime: intent matching, escalation, capture, state machine
├── agents/
│   ├── index.ts              # Registry of all agents
│   ├── support.ts            # Noell Support config
│   ├── front-desk.ts         # Noell Front Desk config
│   └── care.ts               # Noell Care config
├── clients/
│   └── default.ts            # Default client (Ops by Noell marketing site)
├── verticals/
│   └── presets.ts            # Vertical defaults (massage, med_spa, salon, dental, esthetics, generic)
└── README.md

src/components/
├── noell-chat.tsx            # Generic agent-agnostic chat widget
└── nova-chat.tsx             # Thin wrapper that mounts Support+defaultClient
```

### Composition model

```
+----------------------+
|   AgentRuntime       |
|                      |
|  agent    : Support  |  <- agent-specific identity, intents, scope, follow-ups
|  client   : Acme     |  <- tenant data (business name, booking URL, team, webhooks)
|  vertical : massage  |  <- defaults for the business type
+----------------------+
          |
          v
+----------------------+
|  core.step(...)      |  <- deterministic reducer, UI-agnostic
+----------------------+
          |
          v
+----------------------+
|  <NoellChat/> view    |  <- mounts any agent; zero business logic inside
+----------------------+
```

The UI never hardcodes an agent's name, color, intents, or scripts. Swap
`agent={supportAgent}` for `agent={frontDeskAgent}` and you have a
different assistant running the same widget.

---

## What is shared (the "foundation")

- **Conversation primitives** (`Message`, `Stage`, `MessageFrom`)
- **Intent matcher** (`core.matchIntent`) — deterministic v1, swap for LLM later
- **Escalation evaluator** (`core.evaluateEscalation`)
- **Capture parser** (`core.parseCapture`) — extracts name/phone/email
- **Token interpolation** (`{{businessName}}`, `{{bookingUrl}}`, captured fields)
- **State machine** (`core.step`) — stage transitions, turn counting
- **Follow-up rule schema** — SMS/email cadences keyed to conversation events
- **Knowledge source schema**
- **Routing targets** (`booking_link` / `human` / `workflow` / `knowledge_base`)
- **UI chrome** (launcher, panel, bubbles, typing indicator, input)

## What is agent-specific

Each `AgentConfig` declares:

- **Identity** (displayName, persona, eyebrow, launcher color, avatar initial)
- **Scope** (explicit `does` and `doesNot` — used for honesty guardrails + product pages)
- **Greeting message**
- **Starter chips**
- **Intents** (matchers, scripted responses, next stage, routing decision)
- **Capture response** (what to say once contact info is collected)
- **Fallback response** (no-intent-match path)
- **Escalation rules** (when + how to escalate, with agent-appropriate copy)
- **Knowledge sources** (what the agent can answer from)
- **Follow-up rules** (SMS/email templates keyed to `capture` / `resolved` / `escalated`)
- **Allowed stages** (Support doesn't use `resolved`; Care does)

## What changes per client (tenant)

`ClientConfig` holds:

- Business name + identifiers (`clientId`, `businessName`)
- Vertical key (`massage`, `med_spa`, `salon`, `dental`, `esthetics`, `generic`)
- Booking URL (the link the agents hand off to)
- Phone, email, hours, services, team members
- Brand overrides (if the client wants different accent colors)
- Webhook endpoints (`onCapture`, `onEscalate`, `onResolved`)

## What changes per vertical

`VerticalConfig` provides defaults a business type usually needs:

- Common services
- Qualifying questions tuned to that vertical
- Starter chip presets per agent (`support` / `care`; Front Desk isn't client-facing)
- Reminder cadence appropriate to the vertical

A vertical's presets *override* the agent's default starter chips when
present. This keeps the agents themselves small and lets new verticals
slot in without touching agent configs.

## What still depends on external systems

The runtime is deterministic and fully testable today, but for real
client installs these integrations must be wired:

| Dependency              | Used by        | Current state                                               |
| ----------------------- | -------------- | ----------------------------------------------------------- |
| Phone / SMS provider    | All agents     | Webhook placeholders in `ClientConfig.webhooks`             |
| Inbound call routing    | Front Desk     | Intent "missed_call_textback" exists; no provider wired yet |
| Scheduling platform     | Support, Front Desk, Care | Booking URL + routing target exist; no API calls wired     |
| Review platform         | Front Desk     | `review_capture` intent exists; no Google API wired         |
| CRM / contact store     | All agents     | `capture` side-effect exists; no destination wired          |
| Reactivation job queue  | Front Desk     | `reactivation` intent exists; no job runner wired           |
| LLM / classifier        | All agents     | `matchIntent` is keyword-based today; designed for swap     |
| Analytics               | All agents     | `onResolved` webhook placeholder exists                     |

---

## What is ready now

- ✅ Three fully structured agent configs (Support, Front Desk, Care)
- ✅ Shared core runtime (intent matching, escalation, capture, interpolation)
- ✅ Generic chat widget that mounts any agent
- ✅ Five verticals with presets + a generic fallback
- ✅ Default client config for the marketing site
- ✅ Marketing site continues to work (Support is still the live agent at `/`)
- ✅ Clear separation of concerns: UI has zero business logic, runtime has zero UI

## What still needs to be built for full production use

1. **Phone/SMS integration** — Twilio or equivalent for missed-call text-back and reminder cadences.
2. **Scheduler integration** — Calendly / Acuity / Vagaro API clients per client's tool.
3. **CRM write path** — Wire `onCapture` webhook to the client's contact store (GHL, HubSpot, or a Noell dashboard).
4. **Escalation delivery** — Slack / email / in-app notification so `onEscalate` actually reaches a human.
5. **Review platform integration** — Google Business Profile API for post-visit capture with filter routing.
6. **LLM classifier** — Replace `matchIntent` with an intent classifier + entity extractor. Interface stays the same.
7. **Knowledge retrieval** — Replace inline `answerTemplate` with a per-client knowledge base (FAQ + service notes).
8. **Reactivation job runner** — Cron / queue that identifies dormant clients and feeds the Front Desk intent.
9. **Tenant-aware routing** — Multi-client deployment will need a tenant resolver (subdomain or clientId cookie) to pick the right `ClientConfig` at request time.
10. **Admin UI** — The non-code edit path for operators: edit starter chips, tweak copy, adjust escalation keywords per client. Today those live in the TS configs.
11. **Observability** — Conversation logs, capture success rate, escalation rate per agent per client. Needed before claiming SLAs.
12. **Tests** — `core.step` is pure; unit tests for intent matching, capture parsing, escalation should land before the first paid install.

---

## How this can be reused for future clients

To install the Noell system at a new client:

1. **Add a `ClientConfig`** in `src/lib/noell-system/clients/<client-id>.ts`:
   ```ts
   export const acmeMassage: ClientConfig = {
     clientId: "acme-massage",
     businessName: "Acme Massage",
     vertical: "massage",
     bookingUrl: "https://acme-massage.com/book",
     phone: "+1-555-0100",
     email: "hello@acme.com",
     hours: "Tue–Sat, 10am–7pm",
     services: ["Deep tissue", "Swedish", "Prenatal"],
     team: [{ name: "Jess", role: "LMT" }],
     webhooks: {
       onCapture: "https://hooks.noell.dev/acme/capture",
       onEscalate: "https://hooks.noell.dev/acme/escalate",
     },
   };
   ```

2. **(Optional) Add a vertical preset** in `src/lib/noell-system/verticals/presets.ts`
   if the client's business type doesn't exist yet.

3. **Mount any of the three agents** against that client:
   ```tsx
   <NoellChat
     agent={supportAgent}
     client={acmeMassage}
     vertical={getVertical(acmeMassage.vertical)}
   />
   ```

4. **Wire webhooks + external integrations** per the "Production use" checklist
   above. The chat surface is ready; the backend is what varies per install.

### Zero-code client overrides
Most day-to-day tuning — booking URL, business name, team roster, hours —
is config-only. Copy tuning (starter chips, capture response, escalation
wording) is also config, and is the next candidate for a non-code admin UI.

### Per-vertical overrides
If every med spa client needs the same starter chips, set them on the
vertical preset. The runtime prefers vertical presets over agent defaults,
so clients inherit them automatically.

### Per-agent extension
Adding a fourth agent (e.g. "Noell Revenue" for upsell flows) is a single
file in `src/lib/noell-system/agents/` plus a registry entry. No runtime
or UI changes are required.
