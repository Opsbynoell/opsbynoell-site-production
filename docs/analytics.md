# Conversion analytics

This site instruments the marketing funnel from the first CTA impression
through to the `/book` audit request. The goal is to be able to answer, from
the analytics tool, questions like:

- How many audit CTA clicks came from the homepage hero vs. the final CTA band?
- Which vertical pages convert best into audit requests?
- Which comparison page drives the most audit-CTA clicks?
- What fraction of pricing-tier clicks convert into `/book` views?

## Provider assumption

The only analytics provider currently wired up is **Meta Pixel**
(`src/components/meta-pixel.tsx`). It is enabled when
`NEXT_PUBLIC_META_PIXEL_ID` is set. All events described here route through
`trackMetaCustomEvent` (and, for the core `audit_cta_click` / worksheet
events, also through the Meta standard `Contact` / `Lead` events for
compatibility with existing Pixel audiences).

Helpers live in:

- `src/lib/analytics.ts` — conversion event names + `trackConversion` +
  `trackAuditCtaClick` convenience wrapper. Use these rather than importing
  `trackMetaCustomEvent` directly.
- `src/lib/meta-pixel-track.ts` — low-level Meta Pixel adapter.

Every helper no-ops safely when the pixel script hasn't loaded.

## Adding a second analytics provider

All conversion events are centralized in `trackConversion` in
`src/lib/analytics.ts`. To add GA4, PostHog, Segment, etc., forward the
same `(eventName, context)` call into their SDK inside `trackConversion` —
one file change, no component edits required.

Alternatively, every primary CTA in the app carries DOM attributes:

- `data-event="<event_name>"`
- `data-source-page="<source_page>"`
- `data-source-section="<source_section>"`

A future provider can attach one delegated click listener on `document` that
filters on `target.closest("[data-event]")`, reads the three attributes, and
emits its own event — no per-component changes. This is the low-risk hook
for trying a new provider without modifying JS call sites.

## Event map

Event names are declared in `ConversionEvents` in `src/lib/analytics.ts`.
Do not hardcode event-name strings in components — import the constant.

### Conversion events

| Event name | Fires when | Important params |
| --- | --- | --- |
| `audit_cta_click` | A CTA whose destination is `/book` is clicked. | `source_page`, `source_section`, `destination`, `cta_label` |
| `audit_page_view` | The `/book` page mounts (funnel-entry marker). | `source_page: "book"` |
| `audit_exit_intent_shown` | The desktop exit-intent modal on `/book` opens. | `source_page: "book"`, `source_section: "book_exit_intent"` |
| `audit_worksheet_request` | The exit-intent worksheet email form submits successfully. | — |
| `booking_fallback_email_click` | The manual-scheduling email CTA on `/book` is clicked (the fallback shown when no live scheduler URL is configured). | `source_page: "book"` |
| `tier_card_click` | A pricing tier CTA is clicked anywhere on the site. Already emitted pre-this-pass. | `tier`, `source_page` |
| `vertical_pricing_shown` | The vertical pricing section scrolls into view. Emitted by `VerticalPricingSection`. | `vertical` |
| `vertical_card_click` | A vertical card on `/verticals` is clicked. | `source_page`, `source_section`, `vertical` |
| `agents_founding_cta_click` | The Noell Agents founding member CTA is clicked. Emits `InitiateCheckout` too. | — |
| `comparison_audit_cta_click` | Reserved for a comparison-specific CTA distinct from the default audit CTA. Not yet emitted; the current comparison CTA uses `audit_cta_click` with `source_page: "compare_*"`. | — |
| `faq_open` | An FAQ accordion item opens. Emitted by `FAQ`. | `question` |

### Standard Meta events (compatibility)

`trackConversion` also emits the following standard events so existing
Pixel audiences keep working:

| Standard event | Fires alongside |
| --- | --- |
| `Contact` | Every `audit_cta_click` |
| `Lead` | `audit_worksheet_request` and existing booking-confirmation postMessage handler |
| `InitiateCheckout` | `agents_founding_cta_click` (in `agents-founding-cta.tsx`) |
| `ViewContent` | `/agents` page view (in `agents-page-analytics.tsx`) |
| `PageView` | Every client-side navigation (in `meta-pixel.tsx`) |

## Source attribution taxonomy

### `source_page` values

One per top-level page. Values live in the `SourcePage` type in
`src/lib/analytics.ts`.

`home`, `pricing`, `book`, `agents`, `systems`, `about`, `contact`, `roi`,
`noell_support`, `noell_front_desk`, `noell_care`,
`verticals_index`, `verticals_{dental|med_spas|salons|massage|estheticians|hvac}`,
`compare_index`, `compare_{my_ai_front_desk|podium|ai_front_desk_alternatives|diy_ai_receptionist|human_answering_services|local_business_messaging_platforms}`,
`case_studies`, `resources`, `navbar`, `footer`, `global_chat`.

### `source_section` values

The within-page region where the click originated. Values live in the
`SourceSection` type.

`hero`, `final_cta`, `pick_your_path`, `systems_grid`, `pricing_cards`,
`pricing_tier_cta`, `comparison_cta`, `vertical_card`,
`vertical_agents_callout`, `navbar_primary`, `navbar_mobile`, `footer`,
`faq_exit`, `book_exit_intent`, `booking_fallback`, `booking_embed`,
`audit_request_soft_exit`, `founding_cta`.

## Data attributes on CTAs

Primary CTAs expose stable DOM attributes even when they aren't wrapped in
a JS click handler. This gives any analytics provider a single delegated
listener to work with:

- `data-event` — the event name (matches the constants in
  `ConversionEvents`).
- `data-source-page` — one of the `SourcePage` values above.
- `data-source-section` — one of the `SourceSection` values above.

Also used for richer segmentation:

- `data-vertical` — on vertical cards (`/verticals`), the vertical slug.
- `data-agent` — on agent cards on the homepage, the agent handle.

These attributes are cheap and render-only — they do not affect visuals,
SEO, or accessibility.

## TODO / follow-ups

- Wire a server-side Meta Conversions API (CAPI) sender for the
  high-intent events (`audit_cta_click`, `audit_worksheet_request`,
  booking-confirmation `Lead`). The current pixel-only path loses
  events to iOS 14+ / ad-blockers.
- Add GA4 alongside Meta Pixel for session-level journey analysis.
  Hook point is `trackConversion` in `src/lib/analytics.ts`.
- Consider a top-of-file `"use client";` sweep to be sure every event
  call site is in a client boundary — today every site of the helper
  lives in `"use client"` components already.
- Once a real scheduler URL is configured via `NEXT_PUBLIC_BOOKING_URL`,
  confirm the scheduler posts a recognizable `message` payload so the
  existing `BookingLeadTracker` fires `Lead` on confirmed bookings.

## How to verify events fire (Meta Pixel)

1. Install the Meta Pixel Helper browser extension.
2. Set `NEXT_PUBLIC_META_PIXEL_ID` in `.env.local`.
3. Run `npm run dev`, open the homepage, and click any audit CTA.
4. The helper should show `PageView` on load, then `Contact` +
   `audit_cta_click` on click, with the `source_page` and
   `source_section` params visible in the event payload.
