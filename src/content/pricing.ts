// ─── Pricing Page Content ───────────────────────────────────────────────────────
// Psychological job: Decision clarity
// Primary emotional outcome: I know where I fit and what I'm paying for.

import { CTA } from "@/lib/constants";

// ── Page Metadata ───────────────────────────────────────────────────────────────
export const pricingMeta = {
  title: "Pricing — Ops by Noell",
  description:
    "Simple pricing for fixing the leaks that cost you clients. Choose the level of support based on how much you want automated — from missed-call recovery to a full front-desk system.",
};

// ── Section 1: Hero-Lite Intro ──────────────────────────────────────────────────
export const pricingHero = {
  headline: "Simple pricing for fixing the leaks that cost you clients.",
  subhead:
    "Choose the level of support based on how much you want automated — from missed-call recovery to a full front-desk system.",
  supportingLine: "The cost of the problem is usually higher than the monthly fee.",
  primaryCta: CTA.pricing,
};

// ── Section 2: Pricing Grid ─────────────────────────────────────────────────────
// Component: Pricing Section
// Psychological job: Starter should feel like the obvious right fit
export const pricingGrid = {
  headline: "Choose your starting point.",
  tiers: [
    {
      id: "entry",
      name: "Entry",
      monthlyPrice: 197,
      setupFee: 497,
      bestFor: "Businesses that need one urgent leak fixed first.",
      isPopular: false,
      features: [
        "Missed call text-back system",
        "Basic lead recovery",
        "Fastest way to stop silent revenue loss",
      ],
      cta: CTA.entryTier,
    },
    {
      id: "starter",
      name: "Starter",
      monthlyPrice: 797,
      setupFee: 997,
      bestFor: "Owners who want the no-show and follow-up problem handled end to end.",
      isPopular: true,
      features: [
        "Missed call recovery",
        "Booking and reminder workflows",
        "Review generation",
        "Lead follow-up system",
        "Nova included",
      ],
      cta: CTA.starterTier,
    },
    {
      id: "growth",
      name: "Growth",
      monthlyPrice: 1497,
      setupFee: 1497,
      bestFor: "Businesses ready to automate the full client journey and scale with confidence.",
      isPopular: false,
      features: [
        "Everything in Starter",
        "Full-stack automation",
        "AI voice receptionist",
        "Higher-touch workflow support",
      ],
      cta: CTA.growthTier,
    },
  ],
};

// ── Section 3: Nova Standalone Note ────────────────────────────────────────────
// Psychological job: Prevent confusion — clearly distinguish Nova standalone vs full system
// Note: Purple accent treatment applies to this section (Nova-related)
export const novaStandaloneNote = {
  headline: "Need Nova only?",
  options: [
    {
      label: "Nova Standalone",
      monthlyPrice: 197,
      setupFee: 497,
      description:
        "Best if you want an AI front-line chat experience without the full automation stack.",
    },
    {
      label: "Full System",
      monthlyPrice: 797,
      setupFee: 997,
      description:
        "Includes Nova plus reminders, follow-up, missed-call recovery, and review workflows.",
    },
  ],
  cta: CTA.nova,
};

// ── Section 4: FAQ ──────────────────────────────────────────────────────────────
// (Also exported from src/content/faq.ts for use across pages)
export const pricingFaq = [
  {
    question: "What's included in setup?",
    answer:
      "Setup covers implementation, configuration, messaging logic, and the core systems needed for the package you choose.",
  },
  {
    question: "How long does implementation take?",
    answer:
      "Most systems can be installed quickly, and some businesses start seeing improvement within the first two weeks.",
  },
  {
    question: "Do I need a new CRM?",
    answer:
      "Not always. We build around your current workflow whenever possible and recommend changes only when they materially improve the result.",
  },
  {
    question: "Is Nova included?",
    answer: "Nova is included in Starter and Growth, and it's also available as a standalone offer.",
  },
  {
    question: "Is this done-for-you?",
    answer:
      "Yes. We build and manage the system with you so you're not left trying to piece it together alone.",
  },
];

// ── Section 5: Dark CTA ─────────────────────────────────────────────────────────
export const pricingDarkCta = {
  headline: "Not sure which tier fits?",
  subhead:
    "We'll show you the right starting point based on where you're losing the most revenue.",
  primaryCta: CTA.pricing,
};
