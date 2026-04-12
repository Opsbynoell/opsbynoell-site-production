# Ops by Noell — Branch Review Shots

Screenshots captured from branch `claude/fix-website-pages-xwdnR` (commit `20eef1a`) using headless Chromium at 1440×900.

## How to view

Open `docs/review-shots/index.html` directly in a browser for a scrollable review page with a table of contents. Or open the PNG files directly.

## Contents

### Homepage
- `home-hero.png` — Recognition hero (wine gradient, serif headline, iPhone mockup)
- `home-features.png` — Logo cloud + features stats
- `home-tension.png` — Features stats + dark tension band
- `home-pricing.png` — Relief capabilities + pricing tiers
- `home-testimonials.png` — Pricing tail + orbiting testimonials
- `home-faq-cta.png` — FAQ (expanded) + CTA
- `home-full.png` — Full page (~5500 chars visible text)

### /book
- `book-hero.png` — "Your free operations audit." hero
- `book-steps.png` — "Three steps. Done in 15 minutes."
- `book-embed.png` — iframe embed scaffold + after-steps
- `book-full.png` — Full page

### /nova
- `nova-hero.png` — Lilac hero with Nova chat mockup
- `nova-capabilities.png` — 6 capabilities grid
- `nova-does-doesnot.png` — Does / Does Not honesty band (Nova Front Desk callout)
- `nova-full.png` — Full page

### Nova chat widget
- `home-nova-open.png` — Homepage with Nova chat launcher clicked open (panel, starter chips, input)

## Capture conditions

- Viewport: 1440×900, deviceScaleFactor: 1
- Browser: Chromium 1194 (Playwright 1.56.1)
- Mode: headless, networkidle wait, 1500ms settle delay after navigation
- Server: `next dev -p 3457` on branch HEAD

## File size sanity (confirms non-blank renders)

| File | Size |
|---|---|
| home-hero.png | 288 KB |
| home-full.png | 1054 KB |
| book-hero.png | 108 KB |
| book-full.png | 355 KB |
| nova-hero.png | 298 KB |
| nova-full.png | 784 KB |
| home-nova-open.png | 335 KB |
