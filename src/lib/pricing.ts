export type TierId = "essentials" | "growth" | "custom_ops";

export interface PricingTier {
  id: TierId;
  planId: string;
  tier: string;
  priceFrom: string;
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

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "essentials",
    planId: "essentials",
    tier: "Essentials",
    priceFrom: "$197",
    cadence: "/mo",
    bestFor: "Best for businesses that want the full system, done for them",
    summary: "Full system. Onboarding. Support. Live in 14 days.",
    tagline:
      "Best when you need the operating layer in place before adding agents. The foundation layer for businesses that are not ready for managed intelligence yet.",
    features: [
      "Operations layer (CRM, booking calendar, forms) under your brand",
      "Missed-call text-back automation",
      "Appointment confirmations",
      "1 review request sequence",
      "Email support",
    ],
    ctaLabel: "Start with Essentials",
    ctaHref: "",
    useCheckout: true,
    note: "Essentials does not include AI agents or PCI. + $497 one-time setup",
  },
  {
    id: "growth",
    planId: "growth",
    tier: "Growth",
    priceFrom: "$797",
    cadence: "/mo",
    tagline:
      "The full recovery system: operations layer, three agents, no-show recovery, reputation workflows, and Predictive Customer Intelligence signals as they roll out.",
    features: [
      "Everything in Essentials",
      "All three AI agents (Noell Support, Front Desk, Care)",
      "Read integration with your booking system",
      "Full email + SMS marketing workflows",
      "Funnels + landing pages",
      "Reputation dashboard with review automation",
      "No-show recovery sequences",
      "Predictive Customer Intelligence signals (rolling in)",
      "Priority support",
    ],
    ctaLabel: "Start with Growth",
    ctaHref: "",
    useCheckout: true,
    isHighlighted: true,
    note: "Recommended for revenue recovery · Built for businesses that want to recover missed calls, rebookings, no-shows, and lapsed-client revenue from one managed system. + $997 one-time setup",
  },
  {
    id: "custom_ops",
    planId: "custom_ops",
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
    useCheckout: false,
    note: "+ $1,497 one-time setup",
  },
];
