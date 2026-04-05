// ─── Nova Page Content ──────────────────────────────────────────────────────────
// Psychological job: Product differentiation
// Primary emotional outcome: Nova is useful, modern, and clearly different from the full system.
// Design note: Purple (#7C5CFC) is intentional here — this is a Nova section.

import { CTA } from "@/lib/constants";

// ── Page Metadata ───────────────────────────────────────────────────────────────
export const novaMeta = {
  title: "Nova AI — Ops by Noell",
  description:
    "Nova responds instantly, qualifies leads, handles common questions, and keeps the conversation moving while you're busy doing the actual work.",
};

// ── Section 1: Nova Spotlight ───────────────────────────────────────────────────
// Component: Hero Section (Nova variant — purple accent intentional)
// Psychological job: Make Nova feel useful and practical immediately
export const novaSpotlight = {
  headline: "The front-line AI that answers when you can't.",
  subhead:
    "Nova responds instantly, qualifies leads, handles common questions, and keeps the conversation moving while you're busy doing the actual work.",
  supportingLine: "Included in Starter and Growth. Also available standalone.",
  primaryCta: CTA.nova,
  secondaryCta: CTA.pricing,
};

// ── Section 2: Nova Features ────────────────────────────────────────────────────
// Component: Card grid
// Psychological job: Position Nova as a serious front-line system, not a toy
export const novaFeatures = {
  headline: "More than a chat widget. It's your first response layer.",
  cards: [
    {
      title: "Answers instantly",
      body: "No more losing leads because nobody got back fast enough.",
    },
    {
      title: "Qualifies leads",
      body: "Nova helps sort serious inquiries from casual questions so the next step is clear.",
    },
    {
      title: "Handles objections",
      body: "Common questions about services, pricing, and next steps get answered immediately.",
    },
    {
      title: "Captures details",
      body: "Contact info and lead context are collected while the conversation is still warm.",
    },
    {
      title: "Books appointments",
      body: "Nova helps move the right lead toward the right next step faster.",
    },
    {
      title: "Fits your workflow",
      body: "Built to work across web chat and other client-facing channels as the system evolves.",
    },
  ],
};

// ── Section 3: Nova vs Full System ──────────────────────────────────────────────
// Psychological job: Let visitors self-sort quickly — eliminate confusion between options
export const novaVsFullSystem = {
  headline: "Nova can stand alone. The full system goes further.",
  options: [
    {
      label: "Nova Standalone",
      monthlyPrice: 197,
      setupFee: 497,
      bestFor:
        "Best when you want an always-on first response layer that captures and qualifies leads.",
    },
    {
      label: "Full System",
      monthlyPrice: 797,
      setupFee: 997,
      bestFor:
        "Best when you want Nova plus missed-call recovery, reminders, follow-up, reviews, and operational consistency.",
    },
  ],
  cta: "See Pricing",
};

// ── Section 4: Nova FAQ ─────────────────────────────────────────────────────────
// Psychological job: Reduce AI skepticism and clarify practical fit
export const novaFaq = [
  {
    question: "Is Nova just a chatbot?",
    answer:
      "No. Nova is positioned as a front-line lead response layer built to qualify, guide, and move conversations forward.",
  },
  {
    question: "Can Nova book appointments?",
    answer:
      "It can help direct the right people toward the next step and support booking logic as part of the broader system.",
  },
  {
    question: "Does this replace my front desk?",
    answer:
      "No. It supports your team by handling speed, consistency, and first-response gaps.",
  },
  {
    question: "Is Nova included in other plans?",
    answer: "Yes. Nova is included in Starter and Growth.",
  },
];

// ── Section 5: Dark CTA ─────────────────────────────────────────────────────────
export const novaDarkCta = {
  headline: "Want Nova handling the first conversation for you?",
  subhead:
    "We'll show you where it fits and whether standalone or full system makes more sense.",
  primaryCta: CTA.pricing,
};
