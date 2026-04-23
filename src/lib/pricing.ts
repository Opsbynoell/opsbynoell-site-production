export type TierId = "essentials" | "growth" | "custom_ops";

export interface PricingTier {
  id: TierId;
  tier: string;
  priceFrom: string;
  cadence: string;
  tagline: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  isHighlighted?: boolean;
  note: string;
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "essentials",
    tier: "Essentials",
    priceFrom: "$197",
    cadence: "/mo",
    tagline:
      "The operations layer plus SMS-led automations. No AI agents at this tier. Ideal for solo practitioners who want the system running but don't yet need AI handling calls or chat.",
    features: [
      "Operations layer (CRM, booking calendar, forms) under your brand",
      "Missed-call text-back automation",
      "Appointment confirmations",
      "1 review request sequence",
      "Email support",
    ],
    ctaLabel: "Start with Essentials",
    ctaHref: "/book",
    note: "Not included: three AI agents, two-way booking-system integration, no-show recovery, Predictive Customer Intelligence. + $497 one-time setup",
  },
  {
    id: "growth",
    tier: "Growth",
    priceFrom: "$797",
    cadence: "/mo",
    tagline:
      "The full system. Operations layer plus all three AI agents, installed around your booking system. Built for practices ready to run everything through one layer.",
    features: [
      "Everything in Essentials",
      "All three AI agents (Noell Support, Front Desk, Care)",
      "Two-way integration with your booking system",
      "Full email + SMS marketing workflows",
      "Funnels + landing pages",
      "Reputation dashboard with review automation",
      "No-show recovery sequences",
      "Predictive Customer Intelligence signals (rolling in)",
      "Priority support",
    ],
    ctaLabel: "Get Growth",
    ctaHref: "/book",
    isHighlighted: true,
    note: "Most popular · + $997 one-time setup",
  },
  {
    id: "custom_ops",
    tier: "Custom Ops",
    priceFrom: "$1,497",
    cadence: "/mo",
    tagline:
      "The full system for multi-location practices and operators running reactivation at scale.",
    features: [
      "Everything in Growth",
      "Multi-location sync",
      "Reactivation campaigns (win back lapsed clients)",
      "Predictive Customer Intelligence, full rollout as it ships",
      "Dedicated account manager",
      "Custom reporting + analytics",
      "Client mobile app under your brand",
      "White-glove onboarding",
    ],
    ctaLabel: "Book a scoping call",
    ctaHref: "/book",
    note: "+ $1,497 one-time setup",
  },
];
