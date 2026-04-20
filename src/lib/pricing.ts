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
      "One system. Ideal for solo practitioners who want to stop missing calls.",
    features: [
      "Missed Call Text-Back",
      "Appointment Confirmations",
      "1 Review Request Sequence",
      "Monthly Report",
      "Email Support",
    ],
    ctaLabel: "Start with Essentials",
    ctaHref: "/book",
    note: "+ $497 one-time setup",
  },
  {
    id: "growth",
    tier: "Growth",
    priceFrom: "$797",
    cadence: "/mo",
    tagline: "The full front desk system. Most popular for growing practices.",
    features: [
      "Everything in Essentials",
      "Noell Support AI Chat (24/7 booking)",
      "No-Show Recovery Sequences",
      "Google Review Automation",
      "Lead Pipeline Management",
      "Monthly Strategy Call",
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
    tagline: "Full system plus reactivation. For practices ready to scale.",
    features: [
      "Everything in Growth",
      "Reactivation Campaigns",
      "Multi-location Support",
      "Custom Reporting Dashboard",
      "Priority Support (same day)",
      "Quarterly Business Review",
    ],
    ctaLabel: "Book a scoping call",
    ctaHref: "/book",
    note: "+ $1,497 one-time setup",
  },
];
