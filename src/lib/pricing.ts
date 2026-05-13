export type TierId =
  | "signal"
  | "system"
  | "full_stack"
  | "b2b_prospect"
  | "b2b_pipeline"
  | "b2b_full_stack";

export type TrackId = "service" | "b2b";

export interface PricingTier {
  id: TierId;
  track: TrackId;
  planId: string;
  tier: string;
  standardPrice: string;
  launchPrice?: string;
  cadence: string;
  bestFor?: string;
  summary?: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  useCheckout?: boolean;
  isHighlighted?: boolean;
  note: string;
}

export const SERVICE_TIERS: PricingTier[] = [
  {
    id: "signal",
    track: "service",
    planId: "signal",
    tier: "Signal",
    standardPrice: "$497",
    launchPrice: "$397",
    cadence: "/mo",
    bestFor: "Solo service businesses who want to stop missing leads",
    summary: "Your first agent. The one that never misses.",
    tagline:
      "Noell Support answers every website visitor, captures leads, and scores them HOT or WARM before you ever see them. Live in 5 business days.",
    features: [
      "Noell Support — 24/7 AI chat agent on your website",
      "Lead Intelligence Dashboard (HOT/WARM scoring, conversation threads)",
      "Monthly performance report",
      "Initial setup and onboarding (done for you)",
      "1 monthly check-in call (30 min)",
    ],
    ctaLabel: "Get Started",
    ctaHref: "/book",
    useCheckout: false,
    note: "Month-to-month. Cancel anytime. Setup included.",
  },
  {
    id: "system",
    track: "service",
    planId: "system",
    tier: "System",
    standardPrice: "$1,097",
    launchPrice: "$897",
    cadence: "/mo",
    bestFor: "Growing service businesses who want full coverage",
    summary: "Three agents. One system. Nothing falls through.",
    tagline:
      "All three agents running together — chat, phone, and reactivation — with a unified dashboard showing every lead, call, and recovered client.",
    features: [
      "Everything in Signal",
      "Noell Front Desk — AI phone agent, answers calls and books appointments",
      "Noell Care — AI reactivation, wins back lapsed clients via SMS and email",
      "Full Lead Intelligence Dashboard (all three agents, unified view)",
      "Bi-weekly check-in calls (30 min each)",
      "Quarterly site audit (conversion, copy, UX)",
    ],
    ctaLabel: "Get Started",
    ctaHref: "/book",
    useCheckout: false,
    isHighlighted: true,
    note: "Month-to-month. Cancel anytime. Setup included.",
  },
  {
    id: "full_stack",
    track: "service",
    planId: "full_stack",
    tier: "Full Stack",
    standardPrice: "$1,497",
    cadence: "/mo",
    bestFor: "Established service businesses who want Noell to run their ops",
    summary: "We run it. You grow it.",
    tagline:
      "The complete done-for-you operations layer: three agents, full site build, Noell Ops CRM, click-through audit, and a dedicated ops partner.",
    features: [
      "Everything in System",
      "End-to-end website build or redesign (done for you)",
      "Noell Ops CRM — live B2B pipeline, contact scoring, iMessage + email sequences, all under your brand",
      "Automated outreach sequences (Day 0 iMessage, Day 2 email, Day 5 follow-up — done for you)",
      "HOT/WARM contact scoring visible in your dashboard in real time",
      "Click-through audit (full funnel analysis and conversion fixes)",
      "Monthly strategy call (60 min)",
      "Priority support (same-day response)",
      "Custom automation workflows (up to 3 per quarter)",
    ],
    ctaLabel: "Book a scoping call",
    ctaHref: "/book",
    useCheckout: false,
    note: "Scoping call required. Setup included. Priority onboarding.",
  },
];

export const B2B_TIERS: PricingTier[] = [
  {
    id: "b2b_prospect",
    track: "b2b",
    planId: "b2b_prospect",
    tier: "Prospect",
    standardPrice: "$597",
    launchPrice: "$497",
    cadence: "/mo",
    bestFor: "B2B companies who want to stop losing warm leads",
    summary: "Your first B2B agent. Finds the right companies. Starts the conversation.",
    tagline:
      "Noell Prospect researches your ICP, identifies target accounts, and sends first-touch sequences that sound like they came from your team.",
    features: [
      "Noell Prospect — AI outreach agent (ICP research, first-touch sequences)",
      "B2B Pipeline Dashboard (deal stages, ICP scores, account tracking)",
      "Monthly pipeline report",
      "Initial setup and onboarding (done for you, 7 business days)",
      "1 monthly check-in call (30 min)",
    ],
    ctaLabel: "Start with Digital Readiness Review",
    ctaHref: "/book",
    useCheckout: false,
    note: "Month-to-month. Cancel anytime. Setup included.",
  },
  {
    id: "b2b_pipeline",
    track: "b2b",
    planId: "b2b_pipeline",
    tier: "Pipeline",
    standardPrice: "$1,197",
    cadence: "/mo",
    bestFor: "B2B companies who want a full top-to-mid funnel system",
    summary: "Three agents. Full funnel. Fewer stalled deals.",
    tagline:
      "Prospect, qualify, and nurture — three agents working the full funnel while you focus on closing. PCI signal layer included.",
    features: [
      "Everything in Prospect",
      "Noell Qualify — AI qualification agent (scores leads, routes to sales)",
      "Noell Nurture — AI nurture agent (keeps warm leads engaged between calls)",
      "Full B2B Pipeline Dashboard (all three agents, unified view)",
      "iMessage + email outreach sequences (automated, done for you)",
      "PCI signal layer (Prospect-Company-Intent data integration)",
      "Bi-weekly check-in calls",
      "Quarterly ICP refinement session",
    ],
    ctaLabel: "Start with Digital Readiness Review",
    ctaHref: "/book",
    useCheckout: false,
    isHighlighted: true,
    note: "Month-to-month. Cancel anytime. Setup included.",
  },
  {
    id: "b2b_full_stack",
    track: "b2b",
    planId: "b2b_full_stack",
    tier: "Full Stack",
    standardPrice: "$2,497",
    cadence: "/mo",
    bestFor: "B2B companies who want Noell to own their pipeline ops",
    summary: "We build the machine. You close the deals.",
    tagline:
      "The complete B2B ops layer: three agents, PCI, digital presence architecture, website build, Noell Ops CRM, and a dedicated pipeline partner.",
    features: [
      "Everything in Pipeline",
      "Digital presence architecture (LinkedIn, website, content alignment)",
      "End-to-end website build optimized for B2B conversion",
      "Noell Ops CRM — live pipeline dashboard, contact scoring, iMessage + email sequences, email templates with open tracking",
      "Quick Enroll — add any contact to an active outreach sequence in one click from the dashboard",
      "Custom ICP research and account list build (up to 100 accounts per quarter)",
      "Monthly strategy call (90 min)",
      "Priority support (same-day response)",
      "Custom automation workflows (up to 5 per quarter)",
    ],
    ctaLabel: "Book a scoping call",
    ctaHref: "/book",
    useCheckout: false,
    note: "Scoping call required. Setup included. Dedicated ops partner.",
  },
];

// Combined export for components that render all tiers
export const PRICING_TIERS: PricingTier[] = [...SERVICE_TIERS, ...B2B_TIERS];
