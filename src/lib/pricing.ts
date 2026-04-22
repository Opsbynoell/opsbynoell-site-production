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
      "Full platform access (CRM, calendars, basic marketing) with SMS-led automations. No AI agents at this tier. Ideal for solo practitioners who want the full operations stack but don't yet need AI handling calls or chat.",
    features: [
      "Full white-labeled platform (CRM, booking calendar, forms)",
      "Missed-call text-back automation",
      "Appointment confirmations",
      "1 review request sequence",
      "Email support",
    ],
    ctaLabel: "Start with Essentials",
    ctaHref: "/book",
    note: "Not included: three AI agents, two-way PMS integration, no-show recovery. + $497 one-time setup",
  },
  {
    id: "growth",
    tier: "Growth",
    priceFrom: "$797",
    cadence: "/mo",
    tagline:
      "The full system. Platform + all three AI agents + two-way integration with your PMS. Built for practices ready to run everything through one layer.",
    features: [
      "Everything in Essentials",
      "All three AI agents (Noell Support, Front Desk, Care)",
      "Two-way PMS integration (Dentrix, Eaglesoft, Curve, Mindbody, etc.)",
      "Full email + SMS marketing platform",
      "Funnels + landing pages",
      "Reputation dashboard with review automation",
      "No-show recovery sequences",
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
      "Dedicated account manager",
      "Custom reporting + analytics",
      "Client mobile app (white-labeled)",
      "White-glove onboarding",
    ],
    ctaLabel: "Book a scoping call",
    ctaHref: "/book",
    note: "+ $1,497 one-time setup",
  },
];
