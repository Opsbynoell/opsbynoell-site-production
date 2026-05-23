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
      "Noell Support: 24/7 AI chat agent on your website",
      "Noell Ops Dashboard: HOT/WARM lead scoring, conversation threads, and lead source breakdown",
      "Real-time notification feed: alerted the moment a new lead comes in",
      "Weekly performance report delivered to your inbox every Monday",
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
      "All three agents running together with a unified dashboard showing every lead, call, recovered client, and outreach thread in one place.",
    features: [
      "Everything in Signal",
      "Noell Front Desk: AI phone agent, answers calls and books appointments",
      "Noell Care: AI reactivation, wins back lapsed clients via SMS and email",
      "Deep two-way PMS or booking integration (reads availability, writes confirmed bookings back)",
      "Full Noell Ops Dashboard: all three agents, unified lead and conversation view",
      "iMessage and email outreach sequences (automated, done for you)",
      "Analytics dashboard: website traffic, funnel performance, and weekly digest email",
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
      "The complete done-for-you operations layer: three agents, full site build, the full Noell Ops CRM, click-through audit, and a dedicated ops partner.",
    features: [
      "Everything in System",
      "End-to-end website build or redesign (done for you)",
      "Full Noell Ops CRM: live pipeline, contact scoring, iMessage and email sequences, email templates with open tracking, all under your brand",
      "Quick Enroll: add any contact to an active outreach sequence in one click from the dashboard",
      "HOT/WARM contact scoring visible in your dashboard in real time",
      "Analytics goals: set monthly targets for leads, demos, and revenue and track progress with live charts",
      "AI assistant built into the dashboard for instant ops support",
      "Automated weekly report email every Monday with lead counts, funnel performance, top pages, and goal progress",
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
    bestFor: "B2B and SaaS companies who want to stop losing warm leads",
    summary: "Your first B2B agent. Catches every inbound. Qualifies before it goes cold.",
    tagline:
      "Noell Inbound responds to every inbound inquiry in seconds, qualifies intent against your ICP, and routes the right prospects to the right rep.",
    features: [
      "Noell Inbound: AI lead qualification and intake (first-touch responses, ICP scoring, routing)",
      "B2B Pipeline Dashboard: deal stages, ICP scores, account tracking",
      "Real-time notification feed: alerted when a prospect replies or a sequence step completes",
      "Weekly pipeline report delivered to your inbox every Monday",
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
    bestFor: "B2B and SaaS companies who want a full top-to-mid funnel system",
    summary: "Three agents. Full funnel. Fewer stalled deals.",
    tagline:
      "Inbound, Pipeline, and Account: three agents working the full revenue cycle while your team focuses on closing. PCI signal layer included.",
    features: [
      "Everything in Prospect",
      "Noell Pipeline: AI sales operations (demo scheduling, follow-up sequences, stalled-deal nudges)",
      "Noell Account: AI account management (health touchpoints, renewal sequences, upsell triggers)",
      "Full B2B Pipeline Dashboard: all three agents, unified view",
      "iMessage and email outreach sequences (automated, done for you)",
      "Analytics dashboard: funnel performance, reply rates, and weekly digest email",
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
    bestFor: "B2B and SaaS companies who want Noell to own their pipeline ops",
    summary: "We build the machine. You close the deals.",
    tagline:
      "The complete B2B ops layer: three agents, PCI, digital presence architecture, website build, the full Noell Ops CRM, and a dedicated pipeline partner.",
    features: [
      "Everything in Pipeline",
      "Digital presence architecture (LinkedIn, website, content alignment)",
      "End-to-end website build optimized for B2B conversion",
      "Full Noell Ops CRM: live pipeline dashboard, contact scoring, iMessage and email sequences, email templates with open tracking",
      "Quick Enroll: add any contact to an active outreach sequence in one click from the dashboard",
      "Analytics goals: set monthly targets for pipeline metrics and track progress with live charts",
      "AI assistant built into the dashboard for instant ops support",
      "Automated weekly report email every Monday with pipeline counts, funnel performance, top pages, and goal progress",
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
