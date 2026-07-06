# Launch Fixes Report — Mobile Perf + A11y Audit

**Branch:** `claude/opsbynoell-mobile-perf-tymwwe`
**Date:** 2026-07-06
**Scope:** Incremental, minimum-change fixes from a mobile Lighthouse + a11y audit of the live site. No rewrites/refactors. Desktop layout, GHL booking iframe, `form_embed.js`, and the 880px/550px breakpoints preserved.

---

## Summary

The most important finding is that **the current codebase (`main`/this branch) already implements essentially all 13 audit items** — the audit was run against an **older, stale production deployment**. Concrete proof: every element the audit named by selector (`div#obz-root`, `input#calls-input`, `input#ticket-input`, `a.footer-link`, the `stcdn.leadconnectorhq.com/_preview/…` script, the `unpkg.com/@tabler/icons-webfont` stylesheet) **exists nowhere in the current source**. The current app is a Next.js 16 build that uses tree‑shaken `@tabler/icons-react` (no webfont), production LeadConnector URLs (no `_preview`), a working `lg:hidden` hamburger, `<label>`-wrapped ROI inputs, a titled booking iframe, per‑page meta descriptions, and a single `<main>` landmark via `ConditionalShell`.

So the **single biggest launch action is to deploy this branch/`main` to production** — that alone resolves the launch‑critical audit findings. On top of that, I closed the genuine remaining gaps in code (static‑asset cache headers, tap‑target sizing to 48px, footer‑disclaimer contrast, a few nested `<main>` landmarks on secondary pages, one missing image dimension) and verified the whole surface end‑to‑end in a headless Chromium at 390px + axe‑core.

**Launch‑ready assessment:** The **code** is launch‑ready for the audited items and I verified them running. Two honest caveats before the 700‑lead send: (1) **it must actually be deployed** — I could not confirm the live site was updated (it 403s external fetches), and (2) there is a **broader, pre‑existing color‑contrast issue on the wine brand‑accent text** (site‑wide, beyond the audit's footer‑scoped item) that needs a brand/design decision. Neither is introduced by this work; both are flagged below.

---

## Commit(s)

- Branch: `claude/opsbynoell-mobile-perf-tymwwe` (HEAD commit hash reported in the PR / chat reply).
- A draft PR is opened for this branch.

**Changelog**
- `vercel.json` — add long‑lived `Cache-Control` headers for `/images/*` and static asset types (#6).
- `src/app/globals.css` — `.tap-target` min size 44px → **48px** (#11).
- `src/components/navbar.tsx` — mobile menu links + Resources toggle get `min-h-[48px]` and vertical centering so every menu item is ≥48px tap height (#11).
- `src/components/footer.tsx` — disclaimer `text-muted-strong/80` → `text-muted-strong` (removes opacity, one token); review‑badge subtitle `text-cream/50` → `text-cream/70` (#8).
- `src/components/add-ons-content.tsx`, `src/components/legal-page.tsx`, `src/app/founding/page.tsx`, `src/app/error.tsx`, `src/app/not-found.tsx` — inner `<main>` → `<div>` to avoid duplicate landmarks under `ConditionalShell`'s `<main>` (#12).
- `src/app/lp/service-businesses/page.tsx` — add explicit `width`/`height` to the raw logo `<img>` (#5).
- `LAUNCH-FIXES-REPORT.md` — this report.

---

## What I did (items 1–13)

**1. Mobile nav breakpoint / hamburger (LAUNCH‑CRITICAL).**
`src/components/navbar.tsx` already renders a two‑part nav: `DesktopNav` (`hidden lg:flex`) and `MobileNav` (`flex lg:hidden`), so below the `lg` breakpoint (1024px, which covers the audit's 880px) the desktop nav is hidden and a hamburger (`button[aria-controls="mobile-nav-menu"]`) is shown. The toggle menu contains all required links via existing hrefs: For Service Businesses, Pricing, About, and (under a Resources accordion) Smart Call & Client Insights, Case Studies, Compare, ROI Calculator, plus a Book CTA. The nav is `fixed top-2 z-50` (sticky + overlays content/iframe). I only *enhanced* tap sizing here (item 11).
**Plainly: did the hamburger/breakpoint actually get fixed?** In the current codebase, **yes — and I verified it running at 390px**: desktop nav container computes `display:none`, hamburger is visible at **48×48**, the menu opens on click, all 7 required links are reachable, and there is no horizontal overflow (scrollWidth 390 = innerWidth 390). At 1280px the desktop nav is `display:flex` and the mobile container is `display:none` (desktop unchanged). The audit's "no hamburger below 880px" reflects the **stale live deploy**, not this code.

**2. LeadConnector `/_preview/` (LAUNCH‑CRITICAL).**
**Plainly: was LeadConnector on a `/_preview/` path?** Not in the current code. Searched the whole repo and the server‑rendered HTML — there is **no `_preview`, no `stcdn.leadconnectorhq.com`** anywhere. The booking iframe points at production `https://api.leadconnectorhq.com/widget/booking/ko7eXb5zooItceadiV02` (`src/components/booking-calendar-embed.tsx:88`) and the auto‑resize script at production `https://link.msgsndr.com/js/form_embed.js` (`:103`). Verified in the rendered `/book` DOM: iframe `src` is production, no `_preview`. The audit's preview URL was on the **stale live deploy**; current build already resolves to production.

**3. Render‑blocking head resources (~4.5s).**
No third‑party render‑blocking CSS/JS in the head. Tabler icons are `@tabler/icons-react` React components bundled/tree‑shaken (no `unpkg` webfont). Fonts are self‑hosted and non‑blocking via `next/font/google` (Playfair + Inter, `display: swap`). Verified in served HTML: the only stylesheets are self‑hosted, hashed `/_next/static/chunks/*.css`; **no `unpkg`, no `icons-webfont`, no third‑party `<link rel=stylesheet>`**. Next.js already inlines/optimizes critical CSS for the route. No change needed — already satisfied by the current architecture.

**4. Lazy‑load third parties.**
- Booking: `BookingCalendarEmbed` injects neither the iframe nor `form_embed.js` until the container is within 200px of the viewport (IntersectionObserver), and the script uses `strategy="lazyOnload"` (`booking-calendar-embed.tsx:38‑56, 102‑105`).
- Chat: the marketing "chat" is a native React component (`agent-chat-widget.tsx`) — there is **no external GHL chat‑widget script** to defer.
- Facebook Pixel: `meta-pixel.tsx` injects `fbevents.js` from an inline base snippet loaded `strategy="afterInteractive"` (fires after hydration/first paint). gtag/GA4 is also `afterInteractive`. Verified: `fbevents.js` is **not** present as a blocking `<script src>` in the initial HTML. Already satisfied.

**5. Images: dimensions + next‑gen.**
`next/image` is used in 7 places (auto width/height + WebP/AVIF). Raw `<img>` audit: `pricing.tsx` already has `width/height` + `loading="lazy"`; `meta-pixel.tsx` is a 1×1 tracking pixel with `width/height="1"`; the `/lp/service-businesses` logo `<img>` was **missing dimensions — I added `width={140} height={28}`**. Note: the pricing dashboard screenshot is an external `files.manuscdn.com` PNG (has dimensions + lazy, but not WebP) — see Still Outstanding.

**6. Cache headers (593 KiB).**
Added a `headers` block to `vercel.json`: `/images/(.*)` and `png|jpg|jpeg|gif|svg|webp|avif|ico|woff|woff2` → `Cache-Control: public, max-age=31536000, stale-while-revalidate=86400`. (`/_next/static/*` is already served immutable by the platform.)

**7. Legacy JS/polyfills.**
Next.js 16 + default modern browserslist already targets modern browsers; there is no manual polyfill/transpile config to trim without risking compatibility. No safe controllable change — left as‑is (noted).

**8. Footer contrast (color‑contrast).**
`footer.tsx`: the disclaimer paragraph used `text-muted-strong/80` (opacity lowered contrast) → changed to the solid token `text-muted-strong` (`#C4A8A8`); the review‑badge subtitle `text-cream/50` → `text-cream/70`. **Measured via canvas pixel sampling (handles Tailwind's `lab()` output): all footer text is now ≥7.31:1** (subtitle 7.67:1, disclaimer/copyright 7.31:1, footer links 13.62:1) — well above AA 4.5:1, one color token.

**9. frame‑title.**
The booking iframe already has `title` (default `"Book Missed Call Audit Call"`, `booking-calendar-embed.tsx:99`). axe‑core: **no `frame-title` violation** on `/book`.

**10. label.**
The ROI calculator inputs are wrapped in `<label>` with visible text (`roi-calculator.tsx:27‑45, 46‑65`), which is a valid accessible association. axe‑core: **no `label` violation** on `/roi`; both inputs report as labelled. (The audit's `#calls-input`/`#ticket-input` IDs are from the stale build and don't exist here.)

**11. target‑size.**
`.tap-target` bumped 44px → 48px (applies to the hamburger, footer links, and all `Button` CTAs, which include `tap-target` in their base styles). Mobile menu items got `min-h-[48px]` + centering. Verified: hamburger 48×48; every open‑menu link ≥48px tall (was 40px).

**12. landmark‑one‑main.**
`ConditionalShell` wraps public page content in a single `<main id="main-content">`. I removed **duplicate/nested** `<main>` elements from components/pages that render under the shell (`add-ons-content`, `legal-page`, `founding`, `error`, `not-found`) by switching their inner `<main>`→`<div>` (identical classes, zero visual change). `/lp/*` pages get no shell `<main>`, so their components correctly keep their own single `<main>`. Verified: **exactly one `<main>` on every core page** (home, pricing, about, compare, case‑studies, smart‑call‑insights, roi, book) and on add‑ons/sms‑policy/founding; axe‑core reports **no `landmark-one-main` violations**.

**13. Meta description (SEO).**
Every audited page exports its own unique `metadata.description` (home, pricing, about, compare, case‑studies, `/predictive-customer-intelligence`, roi, for‑service‑businesses). Verified in served HTML (home description present and unique). The root layout also sets a sensible default + OpenGraph/Twitter.

---

## Before / after (measurable deltas)

| Item | Before (this branch) | After |
|---|---|---|
| `.tap-target` min size | 44px | **48px** |
| Mobile menu link height @390px | 40px (axe/measured) | **≥48px** |
| Hamburger tap size | 44×44 | **48×48** |
| Footer text contrast (worst) | disclaimer ~4–5:1 via opacity token | **7.31:1** (canvas‑measured) |
| Nested `<main>` on public pages | add‑ons, sms‑policy, founding, error, 404 had 2 mains | **1 `<main>` each** |
| Static asset `Cache-Control` | none in `vercel.json` | **max‑age 1yr + SWR** on images/fonts/icons |
| `/lp` logo `<img>` | no intrinsic dimensions | **`width/height` set** |
| axe `frame-title` / `label` / `landmark-one-main` | (already clean in code) | **0 violations, confirmed** |

Render‑blocking KiB / first‑paint deltas: **not independently measurable in this environment** — I could not run mobile Lighthouse against production here, and the live site 403s external fetches. What I *can* confirm is architectural: no third‑party render‑blocking CSS/JS in the head, third parties deferred, which is the mechanism behind the audit's ~4.5s render‑blocking figure.

---

## Verification I ran

- **Production build:** `pnpm run build` — **exit 0**, all routes compiled (including every edited page).
- **Ran the real app:** `pnpm start`, driven with headless Chromium (Playwright) at **390px** (iPhone‑ish) and 1280px.
- **Automated checks (15/15 meaningful pass):** desktop nav hidden @390 / visible @1280; hamburger visible + 48×48; menu opens; all 7 required links reachable; menu items ≥48px; no horizontal overflow; one `<main>`; `/book` iframe present with title and production (non‑preview) `src`; ROI inputs labelled.
- **Footer contrast:** canvas pixel‑sampling (defeats Tailwind `lab()` output) → worst 7.31:1 → PASS.
- **axe‑core** on 8 core pages for `color-contrast, label, frame-title, landmark-one-main, document-title, html-has-lang, image-alt, link-name, button-name`: **only `color-contrast` violations remain** (the wine‑accent issue below); `label`, `frame-title`, `landmark-one-main`, image‑alt, link/button‑name all clean.
- **Served‑HTML inspection:** no `_preview`, no `unpkg`, no tabler webfont, no third‑party stylesheet; `fbevents.js` not in initial HTML; production LeadConnector/msgsndr URLs.

**What I could NOT verify (be explicit):**
- **True 390px on a physical phone** — badge above the fold, calendar visually fitting, and hamburger open/close feel. I verified layout metrics and DOM in headless Chromium at 390px, **not** on a real device.
- **The live production site** — external fetch returns HTTP 403 (bot protection), so I could not confirm whether prod currently serves this code or the older audited build.
- **Booking end‑to‑end conversion** — I confirmed the GHL iframe injects and loads with a title on `/book`; I did **not** complete a real booking through GHL's calendar (third‑party flow).
- **Mobile Lighthouse numbers** — no way to run production Lighthouse here; render‑blocking/first‑paint deltas are argued architecturally, not measured.

---

## Still outstanding

**Launch blockers / must‑confirm before the 700‑lead send:**
1. **Deploy this branch to production and re‑audit the live URL.** The fixes live in code; the audit's failures match an older deploy. This is the single highest‑impact action and I cannot perform it.
2. **Real‑device 390px pass** — open the deployed site on an actual phone: badge above the fold, calendar fits, hamburger opens/closes, and a real "Book a Call" tap reveals the calendar.

**Needs a human/brand decision (pre‑existing, beyond the audit's stated items):**
3. **Site‑wide color‑contrast on the wine brand accent.** axe flags `color-contrast` on `text-wine` (`#8B2A42` ≈ 2.2:1 on the dark `#1F1219` background) and some low‑opacity cream hints (e.g. `text-cream/45`) across pages (home 13, pricing 61, smart‑call‑insights 36, others 3–8). The audit only scoped contrast to the **footer** (fixed). Darkening/adjusting the wine accent affects **desktop brand identity everywhere**, so I intentionally did **not** change it under the "minimum change / preserve desktop / don't refactor" rule. Recommend a deliberate pass on the wine token (or a dedicated accessible accent for small text) before relying on AA everywhere.

**Nice‑to‑haves:**
4. The pricing dashboard screenshot is an external `files.manuscdn.com` PNG — has dimensions + lazy load but isn't WebP/AVIF and isn't covered by the new cache headers (different host). Consider self‑hosting it through `next/image`.
5. Item 7 (legacy polyfills) — no safe controllable change under this stack; revisit only if bundle analysis shows a specific legacy chunk.

---

## Risk notes (watch after deploy)

- **Booking flow:** unchanged. The lazy‑load (IntersectionObserver + `lazyOnload`) and production URLs were already in place; I touched none of `booking-calendar-embed.tsx`. Still, smoke‑test a real booking post‑deploy.
- **Cache headers:** `/images/*` now cache for up to a year. Public images are **not content‑hashed**, so if someone replaces an image *in place* (same filename), users may see the old one until the SWR window/cache expires. Mitigation: rename on change or purge the Vercel cache. (Hashed `/_next` assets are unaffected.)
- **`<main>`→`<div>` swaps:** purely semantic; classes/visuals identical. Confirmed one `<main>` per page and HTTP 200 on all affected routes.
- **Tap‑target 48px + `min-h-[48px]` menu items:** slightly taller mobile menu rows and footer link rows. Verified no horizontal overflow at 390px and desktop nav unchanged; the mobile menu still fits within the viewport.
- **Third‑party loading order:** unchanged (afterInteractive/lazyOnload as before) — no new risk to GA4/Ads/Pixel attribution.
