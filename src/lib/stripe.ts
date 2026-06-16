/**
 * Stripe server-side client.
 *
 * Import this only from server-side code (API routes, Server Components).
 * Never import from client components — it would expose the secret key.
 */
import Stripe from "stripe";

function getStripeSecretKey(): string {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Missing STRIPE_SECRET_KEY environment variable. Set it in Vercel project settings."
    );
  }
  return key;
}

// Singleton pattern — reuse across hot reloads in dev
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(getStripeSecretKey(), {
      apiVersion: "2026-04-22.dahlia",
      typescript: true,
    });
  }
  return _stripe;
}

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET ?? "";

// ─────────────────────────────────────────────────────────────────────────────
// Product / Price catalog
// Maps plan IDs to Stripe Price IDs (set via env vars so you can swap
// test vs live prices without code changes).
// ─────────────────────────────────────────────────────────────────────────────
export interface StripePlan {
  id: string;
  name: string;
  description: string;
  priceId: string;        // Stripe Price ID (from env)
  amountCents: number;    // Display amount (launch price where applicable)
  standardAmountCents?: number; // Standard price before launch discount
  interval: "month" | "year" | "one_time";
  isLaunchPrice?: boolean;
  category?: "service" | "b2b" | "addon";
  setupFeeAmountCents?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Service track
// ─────────────────────────────────────────────────────────────────────────────

export const SERVICE_PLANS: StripePlan[] = [
  {
    id: "signal",
    name: "Noell System — Signal",
    description:
      "All three agents: Noell Support (24/7 chat + lead capture), Noell Front Desk (calls, scheduling, reminders), and Noell Care (returning clients). Works alongside any booking tool.",
    priceId: process.env.STRIPE_PRICE_SIGNAL ?? "",
    amountCents: 39700,
    standardAmountCents: 49700,
    interval: "month",
    isLaunchPrice: true,
    category: "service",
  },
  {
    id: "system",
    name: "Noell System — System",
    description:
      "Everything in Signal, plus deep two-way PMS/booking integration, reactivation campaigns, no-show recovery, Google review automation, and the full Noell Ops Dashboard.",
    priceId: process.env.STRIPE_PRICE_SYSTEM ?? "",
    amountCents: 89700,
    standardAmountCents: 109700,
    interval: "month",
    isLaunchPrice: true,
    category: "service",
  },
  {
    id: "full_stack",
    name: "Noell System — Full Stack",
    description:
      "Everything in System, plus a full website build or redesign, the Noell Ops CRM, click-through audit, custom automation workflows, and a dedicated ops partner.",
    priceId: process.env.STRIPE_PRICE_FULL_STACK ?? "",
    amountCents: 149700,
    interval: "month",
    category: "service",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// B2B track
// ─────────────────────────────────────────────────────────────────────────────

export const B2B_PLANS: StripePlan[] = [
  {
    id: "b2b_inbound",
    name: "B2B — Inbound",
    description:
      "Noell Inbound: AI lead qualification and intake, ICP scoring, routing. B2B Pipeline Dashboard and weekly report.",
    priceId: process.env.STRIPE_PRICE_B2B_INBOUND ?? "",
    amountCents: 49700,
    standardAmountCents: 59700,
    interval: "month",
    isLaunchPrice: true,
    category: "b2b",
  },
  {
    id: "b2b_pipeline",
    name: "B2B — Pipeline",
    description:
      "Everything in Inbound, plus Noell Pipeline (demo scheduling, follow-up, stalled-deal nudges), Noell Account (health touchpoints, renewals, upsell), and the PCI signal layer.",
    priceId: process.env.STRIPE_PRICE_B2B_PIPELINE ?? "",
    amountCents: 119700,
    interval: "month",
    category: "b2b",
  },
  {
    id: "b2b_full_stack",
    name: "B2B — Full Stack",
    description:
      "Everything in Pipeline, plus Digital Presence Architecture, AI-Optimized GTM Strategy, website build, the full Noell Ops CRM, custom ICP research, and a dedicated pipeline partner.",
    priceId: process.env.STRIPE_PRICE_B2B_FULL_STACK ?? "",
    amountCents: 249700,
    interval: "month",
    category: "b2b",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Build Your Own Stack — add-ons
// ─────────────────────────────────────────────────────────────────────────────

export const ADDON_PLANS: StripePlan[] = [
  // Digital Infrastructure
  {
    id: "addon_tech_stack_audit",
    name: "Tech Stack Audit + Cleanup",
    description: "Audit disconnected tools and build a single source of truth.",
    priceId: process.env.STRIPE_PRICE_ADDON_TECH_STACK_AUDIT ?? "",
    amountCents: 29700,
    interval: "one_time",
    category: "addon",
  },
  {
    id: "addon_crm_pipeline_setup",
    name: "CRM + Pipeline Setup",
    description: "CRM and pipeline buildout with ongoing management.",
    priceId: process.env.STRIPE_PRICE_ADDON_CRM_SETUP ?? "",
    amountCents: 19700,
    setupFeeAmountCents: 49700,
    interval: "month",
    category: "addon",
  },
  {
    id: "addon_workflow_automation",
    name: "Workflow Automation (3/qtr)",
    description: "Three custom automation workflows per quarter.",
    priceId: process.env.STRIPE_PRICE_ADDON_WORKFLOW_AUTOMATION ?? "",
    amountCents: 29700,
    interval: "month",
    category: "addon",
  },
  {
    id: "addon_unified_analytics",
    name: "Unified Analytics Dashboard",
    description: "Consolidated analytics across all channels.",
    priceId: process.env.STRIPE_PRICE_ADDON_UNIFIED_ANALYTICS ?? "",
    amountCents: 19700,
    interval: "month",
    category: "addon",
  },
  // Online Presence
  {
    id: "addon_seo_audit",
    name: "Technical SEO Audit",
    description: "Full technical SEO audit with actionable fixes.",
    priceId: process.env.STRIPE_PRICE_ADDON_SEO_AUDIT ?? "",
    amountCents: 49700,
    interval: "one_time",
    category: "addon",
  },
  {
    id: "addon_local_seo",
    name: "Local SEO Management",
    description: "Ongoing local search optimization and management.",
    priceId: process.env.STRIPE_PRICE_ADDON_LOCAL_SEO ?? "",
    amountCents: 29700,
    interval: "month",
    category: "addon",
  },
  {
    id: "addon_content_engine",
    name: "SEO Content Engine (4 posts/mo)",
    description: "Four SEO-optimized blog posts per month.",
    priceId: process.env.STRIPE_PRICE_ADDON_CONTENT_ENGINE ?? "",
    amountCents: 49700,
    interval: "month",
    category: "addon",
  },
  {
    id: "addon_site_performance",
    name: "Website Performance Optimization",
    description: "Ongoing site speed, Core Web Vitals, and UX tuning.",
    priceId: process.env.STRIPE_PRICE_ADDON_SITE_PERF ?? "",
    amountCents: 29700,
    interval: "month",
    category: "addon",
  },
  // Social Media
  {
    id: "addon_content_calendar",
    name: "Content Calendar + Scheduling",
    description: "Monthly content calendar with scheduled posting across platforms.",
    priceId: process.env.STRIPE_PRICE_ADDON_CONTENT_CALENDAR ?? "",
    amountCents: 29700,
    interval: "month",
    category: "addon",
  },
  {
    id: "addon_video_scripts",
    name: "Short-Form Video Scripts (4/mo)",
    description: "Four short-form video scripts per month.",
    priceId: process.env.STRIPE_PRICE_ADDON_VIDEO_SCRIPTS ?? "",
    amountCents: 19700,
    interval: "month",
    category: "addon",
  },
  {
    id: "addon_social_listening",
    name: "Social Listening + Engagement",
    description: "Monitor mentions, respond to comments, engage strategically.",
    priceId: process.env.STRIPE_PRICE_ADDON_SOCIAL_LISTENING ?? "",
    amountCents: 19700,
    interval: "month",
    category: "addon",
  },
  {
    id: "addon_linkedin_outreach",
    name: "LinkedIn B2B Outreach",
    description: "Managed LinkedIn outreach campaigns for B2B pipeline.",
    priceId: process.env.STRIPE_PRICE_ADDON_LINKEDIN ?? "",
    amountCents: 49700,
    interval: "month",
    category: "addon",
  },
  // Brand Kit + Visual Identity
  {
    id: "addon_brand_audit",
    name: "Brand Audit",
    description: "Full brand audit: positioning, visual identity, voice consistency.",
    priceId: process.env.STRIPE_PRICE_ADDON_BRAND_AUDIT ?? "",
    amountCents: 29700,
    interval: "one_time",
    category: "addon",
  },
  {
    id: "addon_brand_kit",
    name: "Full Brand Kit Build",
    description: "Logo, color system, typography, brand guidelines document.",
    priceId: process.env.STRIPE_PRICE_ADDON_BRAND_KIT ?? "",
    amountCents: 99700,
    interval: "one_time",
    category: "addon",
  },
  {
    id: "addon_voice_guide",
    name: "Copywriting Voice Guide",
    description: "Documented brand voice and messaging framework.",
    priceId: process.env.STRIPE_PRICE_ADDON_VOICE_GUIDE ?? "",
    amountCents: 49700,
    interval: "one_time",
    category: "addon",
  },
  {
    id: "addon_visual_templates",
    name: "Visual Templates (social, email, decks)",
    description: "Branded templates for social posts, emails, and presentations.",
    priceId: process.env.STRIPE_PRICE_ADDON_VISUAL_TEMPLATES ?? "",
    amountCents: 29700,
    interval: "one_time",
    category: "addon",
  },
  // Psychology + Conversion
  {
    id: "addon_conversion_copy",
    name: "Conversion Copy Rewrite",
    description: "Full website copy rewrite optimized for conversion.",
    priceId: process.env.STRIPE_PRICE_ADDON_CONVERSION_COPY ?? "",
    amountCents: 99700,
    interval: "one_time",
    category: "addon",
  },
  {
    id: "addon_funnel_build",
    name: "Full Funnel Design + Build",
    description: "End-to-end sales funnel: landing pages, email sequences, conversion tracking.",
    priceId: process.env.STRIPE_PRICE_ADDON_FUNNEL_BUILD ?? "",
    amountCents: 149700,
    interval: "one_time",
    category: "addon",
  },
  {
    id: "addon_nurture_sequence",
    name: "7-Email Nurture Sequence",
    description: "Seven-email nurture sequence written and deployed.",
    priceId: process.env.STRIPE_PRICE_ADDON_NURTURE_SEQ ?? "",
    amountCents: 49700,
    interval: "one_time",
    category: "addon",
  },
  {
    id: "addon_offer_workshop",
    name: "Offer Positioning Workshop (90 min)",
    description: "Live 90-minute workshop to nail your offer, messaging, and positioning.",
    priceId: process.env.STRIPE_PRICE_ADDON_OFFER_WORKSHOP ?? "",
    amountCents: 49700,
    interval: "one_time",
    category: "addon",
  },
  // Operational Systems
  {
    id: "addon_sop_docs",
    name: "SOP Documentation (5 processes)",
    description: "Document five core business processes as standard operating procedures.",
    priceId: process.env.STRIPE_PRICE_ADDON_SOP_DOCS ?? "",
    amountCents: 49700,
    interval: "one_time",
    category: "addon",
  },
  {
    id: "addon_client_onboarding",
    name: "Client Onboarding System",
    description: "Automated client onboarding workflow and welcome sequence.",
    priceId: process.env.STRIPE_PRICE_ADDON_CLIENT_ONBOARDING ?? "",
    amountCents: 69700,
    interval: "one_time",
    category: "addon",
  },
  {
    id: "addon_kpi_dashboard",
    name: "Automated Reporting + KPI Dashboard",
    description: "Live KPI dashboard with automated weekly/monthly reporting.",
    priceId: process.env.STRIPE_PRICE_ADDON_KPI_DASHBOARD ?? "",
    amountCents: 19700,
    interval: "month",
    category: "addon",
  },
  {
    id: "addon_team_playbook",
    name: "Team Playbook",
    description: "Comprehensive team playbook covering roles, workflows, and escalation paths.",
    priceId: process.env.STRIPE_PRICE_ADDON_TEAM_PLAYBOOK ?? "",
    amountCents: 49700,
    interval: "one_time",
    category: "addon",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Combined catalog
// ─────────────────────────────────────────────────────────────────────────────

export const STRIPE_PLANS: StripePlan[] = [
  ...SERVICE_PLANS,
  ...B2B_PLANS,
  ...ADDON_PLANS,
];

// Legacy plan ID aliases — maps old IDs from in-flight Stripe sessions to
// current plans so existing checkouts and webhooks don't break.
const LEGACY_ALIASES: Record<string, string> = {
  agents_founding: "signal",
  agents_standard: "signal",
  essentials: "signal",
  growth: "system",
  custom_ops: "full_stack",
  b2b_prospect: "b2b_inbound",
};

export function getPlanById(planId: string): StripePlan | undefined {
  const canonical = LEGACY_ALIASES[planId] ?? planId;
  return STRIPE_PLANS.find((p) => p.id === canonical);
}
