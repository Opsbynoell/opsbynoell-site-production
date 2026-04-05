// ─── Brand Colors ──────────────────────────────────────────────────────────────
export const COLORS = {
  // Primary accent — used site-wide for CTAs, highlights, links
  coral: "#E8604C",
  // Secondary accent — Nova sections ONLY
  purple: "#7C5CFC",
  // Backgrounds
  white: "#FFFFFF",
  nearBlack: "#0F0F0F",       // Dark CTA band surface (not pure black)
  offWhite: "#FAFAF9",
  // Text
  textPrimary: "#1A1A1A",
  textSecondary: "#4A4A4A",
  textMuted: "#717171",
  // Borders
  borderLight: "#E8E8E8",
  borderSubtle: "#F0F0F0",
} as const;

// ─── Gradient Values ────────────────────────────────────────────────────────────
export const GRADIENTS = {
  // Hero section gradient — blush pink to soft lavender
  hero: "linear-gradient(135deg, #FFF0F5 0%, #EDE5FF 100%)",
  // Fallback options (in priority order)
  heroFallback1: "linear-gradient(135deg, #FFF0F3 0%, #FFE0E6 100%)",
  heroFallback2: "linear-gradient(135deg, #F5F0FF 0%, #EDE5FF 100%)",
  // Dark CTA band
  darkCtaBand: "#0F0F0F",
  // Subtle section tint
  sectionTint: "linear-gradient(180deg, #FAFAF9 0%, #FFFFFF 100%)",
} as const;

// ─── Typography ─────────────────────────────────────────────────────────────────
export const TYPOGRAPHY = {
  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  // Scale
  displayXl: "text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight",
  displayLg: "text-4xl md:text-5xl font-bold leading-tight tracking-tight",
  displayMd: "text-3xl md:text-4xl font-bold leading-snug",
  displaySm: "text-2xl md:text-3xl font-semibold leading-snug",
  headingLg: "text-xl md:text-2xl font-semibold leading-snug",
  headingMd: "text-lg md:text-xl font-semibold",
  bodyLg: "text-lg leading-relaxed",
  bodyMd: "text-base leading-relaxed",
  bodySm: "text-sm leading-relaxed",
  label: "text-xs font-semibold uppercase tracking-widest",
  eyebrow: "text-sm font-semibold uppercase tracking-widest",
} as const;

// ─── Route Map ──────────────────────────────────────────────────────────────────
export const ROUTES = {
  home: "/",
  services: "/services",
  pricing: "/pricing",
  nova: "/nova",
  about: "/about",
  book: "/book",
} as const;

export const ROUTE_REDIRECTS = {
  "/solutions": "/services",
  "/industries": "/services",
} as const;

// ─── Page Order ─────────────────────────────────────────────────────────────────
export const PAGE_ORDER = [
  ROUTES.home,
  ROUTES.services,
  ROUTES.pricing,
  ROUTES.nova,
  ROUTES.about,
  ROUTES.book,
] as const;

// ─── Site Metadata ──────────────────────────────────────────────────────────────
export const SITE_META = {
  name: "Ops by Noell",
  tagline: "Done-for-You Front Desk + Follow-Up System",
  description:
    "We build, install, and manage the system that catches missed calls, follows up instantly, and keeps your calendar full — so you can stay focused on the client in front of you.",
  url: "https://opsbynoell.com",
  locale: "en_US",
  twitterHandle: "@opsbynoell",
  ogImage: "/og-default.jpg",
} as const;

// ─── CTA Labels ─────────────────────────────────────────────────────────────────
export const CTA = {
  primary: "Get Your Free Audit",
  secondary: "See What You're Missing",
  pricing: "Book Your Free Audit",
  nova: "See Nova in Action",
  caseStudy: "See How It Works",
  bookingReassurance:
    "This is a no-pitch conversation. You'll leave with clarity either way.",
  // Tier-specific
  entryTier: "Start With Entry",
  starterTier: "Start With Starter",
  growthTier: "Start With Growth",
  novaStandalone: "See Nova in Action",
  seePricing: "See Pricing",
} as const;
