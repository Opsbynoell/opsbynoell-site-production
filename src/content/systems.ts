// ─── Systems Page Content ────────────────────────────────────────────────────────
// Psychological job: Depth and concreteness
// Primary emotional outcome: I understand exactly what they build and how it works.
// Note: This replaces /services. Platform names are NOT mentioned publicly.

import { CTA } from "@/lib/constants";

// ── Page Metadata ───────────────────────────────────────────────────────────────
export const systemsMeta = {
  title: "Systems — Ops by Noell",
  description:
    "The operational systems that keep leads from slipping, calendars full, and follow-up consistent. Built, installed, and managed for service businesses.",
};

// ── Section 1: Hero ─────────────────────────────────────────────────────────────
// Psychological job: Immediate clarity — this page is about what we actually build
export const systemsHero = {
  eyebrow: "What We Build",
  headline: "The money is not leaking because you need more leads. It is leaking in the moments after someone reaches out.",
  subhead:
    "Missed calls. Delayed replies. No-shows. Follow-up that depends on memory. These are the quiet leaks that cost service businesses real money — and these are the systems that close them.",
  primaryCta: CTA.primary,
  secondaryCta: CTA.seePricing,
};

// ── Section 2: Core Systems Overview ────────────────────────────────────────────
// Psychological job: Make the offer feel complete and concrete immediately
export const coreSystemsOverview = {
  headline: "Every leak has a pattern. Every pattern needs a system.",
  subhead:
    "Most businesses do not need more software. They need the right systems running at the right moments — so leads get answered, appointments get confirmed, reviews get asked for, and follow-up actually happens.",
};

// ── Section 3: System Buckets ────────────────────────────────────────────────────
// Component: Bento Grid
// Psychological job: Let visitors scan and self-sort by their most urgent problem
export const systemBuckets = [
  {
    id: "lead-capture",
    title: "Lead Capture Systems",
    body: "When someone reaches out, the system catches them before silence does.",
    urgencyLine: "Most leads decide within 5 minutes.",
    icon: "capture",
  },
  {
    id: "front-desk-booking",
    title: "Front Desk & Booking Systems",
    body: "When the front desk gets stretched thin, the booking system keeps the day from falling apart.",
    urgencyLine: "Inconsistent front-desk processes quietly lose revenue.",
    icon: "desk",
  },
  {
    id: "follow-up",
    title: "Follow-Up Systems",
    body: "When follow-up depends on memory, revenue gets missed. The system keeps the conversation moving.",
    urgencyLine: "Most businesses follow up once. The system follows up properly.",
    icon: "followup",
  },
  {
    id: "reputation",
    title: "Reputation Systems",
    body: "When happy clients leave without leaving a review, your proof disappears. The system asks at the right moment.",
    urgencyLine: "Reviews compound. Most businesses let them slip.",
    icon: "reputation",
  },
  {
    id: "reactivation",
    title: "Reactivation Systems",
    body: "When old leads and past clients go quiet, the system brings them back before they are gone for good.",
    urgencyLine: "Your best new client is already in your contact list.",
    icon: "reactivation",
  },
  {
    id: "sales-payment",
    title: "Sales & Payment Systems",
    body: "When someone is ready to book or pay, the system makes sure friction does not kill the sale.",
    urgencyLine: "Friction at the close is a system problem, not a people problem.",
    icon: "payment",
  },
  {
    id: "nova-ai",
    title: "Nova AI Systems",
    isNova: true,
    body: "When you cannot answer first, Nova does — so the conversation keeps moving instead of disappearing.",
    urgencyLine: "First response speed is the biggest predictor of conversion.",
    icon: "nova",
  },
  {
    id: "client-os",
    title: "Client Operating System",
    body: "When everything is patched together, the business feels heavier than it should. The operating system makes it all run like one connected experience.",
    urgencyLine: "Individual fixes help. A connected system compounds.",
    icon: "os",
    isFeatured: true,
  },
];

// ── Section 4: Deep System Breakdown ────────────────────────────────────────────
// Psychological job: Give technically curious visitors the depth they need to trust
export const systemBreakdowns = [
  {
    id: "missed-call-recovery",
    title: "Missed Call Recovery",
    bucketId: "lead-capture",
    problem:
      "A potential client calls. Nobody answers. They hang up and call the next business on the list. You never know it happened.",
    solution:
      "The moment a call goes unanswered, an automated text goes out immediately — personal, direct, and timed to catch them before they move on.",
    outcome: "Leads recovered the same day they called, instead of never.",
    included: ["Starter", "Growth"],
  },
  {
    id: "appointment-confirmation",
    title: "Appointment Confirmation & Reminders",
    bucketId: "front-desk-booking",
    problem:
      "Appointments get forgotten. Clients no-show. Your day gets disrupted, your revenue drops, and you spend time rescheduling instead of working.",
    solution:
      "Automated confirmation sequences and reminder messages that go out at the right times — without your front desk doing anything manually.",
    outcome: "No-show rates drop significantly within the first two weeks.",
    included: ["Starter", "Growth"],
  },
  {
    id: "review-generation",
    title: "Review Generation",
    bucketId: "reputation",
    problem:
      "Happy clients mean to leave a review. They just never get around to it. Meanwhile, competitors are accumulating proof and you're not.",
    solution:
      "After every appointment, a review request goes out at the right moment, to the right platform, with the right message to get a response.",
    outcome: "Consistent five-star reviews without chasing clients manually.",
    included: ["Starter", "Growth"],
  },
  {
    id: "lead-pipeline",
    title: "Lead Pipeline Follow-Up",
    bucketId: "follow-up",
    problem:
      "Someone inquires, you respond once, they go quiet. Life gets busy. The lead sits in limbo and eventually books with someone else.",
    solution:
      "A structured follow-up sequence that keeps your business in front of warm leads at the right cadence — without feeling like spam.",
    outcome: "More leads converted without you personally tracking each one.",
    included: ["Starter", "Growth"],
  },
  {
    id: "reactivation",
    title: "Reactivation Campaigns",
    bucketId: "reactivation",
    problem:
      "You have a list of past clients and old leads. Most businesses never contact them systematically. That list is revenue sitting unused.",
    solution:
      "Targeted reactivation messages that go out to lapsed clients or cold leads at strategic moments — without sounding like a blast email.",
    outcome: "Dormant contacts convert back into booked appointments.",
    included: ["Growth"],
  },
];

// ── Section 5: Package Mapping ───────────────────────────────────────────────────
// Psychological job: Help visitors understand which package gives them which systems
export const packageMapping = {
  headline: "Which systems come with which package.",
  subhead: "Every package is built around the highest-impact fixes for your stage.",
  packages: [
    {
      name: "Entry",
      monthlyPrice: 197,
      setupFee: 497,
      focus: "One urgent fix first.",
      systems: ["Missed Call Recovery"],
      bestFor: "Businesses that need to stop the biggest single leak immediately.",
    },
    {
      name: "Starter",
      monthlyPrice: 797,
      setupFee: 997,
      focus: "Full front desk + follow-up layer.",
      systems: [
        "Missed Call Recovery",
        "Appointment Confirmation",
        "Review Generation",
        "Lead Pipeline Follow-Up",
        "Nova AI",
      ],
      bestFor: "Owners who want the no-show, follow-up, and review problems handled end to end.",
      isPopular: true,
    },
    {
      name: "Growth",
      monthlyPrice: 1497,
      setupFee: 1497,
      focus: "Full-stack automation + reactivation.",
      systems: [
        "Everything in Starter",
        "Reactivation Campaigns",
        "AI Voice Receptionist",
        "Higher-touch workflow support",
      ],
      bestFor: "Businesses ready to automate the full client journey and scale with confidence.",
    },
  ],
  cta: CTA.pricing,
  ctaNote: "Not sure which fits? We'll map it on the call.",
};

// ── Section 6: How It Works ─────────────────────────────────────────────────────
// Psychological job: Reduce implementation fear
export const systemsHowItWorks = {
  headline: "Three steps. Then it runs while you work.",
  steps: [
    {
      number: "01",
      title: "Audit",
      body: "We look at missed calls, no-shows, follow-up gaps, and where revenue is slipping — and map the clearest path forward.",
    },
    {
      number: "02",
      title: "Build",
      body: "We install the systems, configure the messaging, and build the automations that match how your business actually runs.",
    },
    {
      number: "03",
      title: "Run",
      body: "The system keeps working in the background. We monitor, tune, and adjust so you don't have to think about it.",
    },
  ],
  supportingLine: "No new hire required. No DIY setup headache.",
};

// ── Section 7: Dark CTA ─────────────────────────────────────────────────────────
export const systemsDarkCta = {
  headline: "See which systems you actually need.",
  subhead:
    "We'll map the leak points and show you the fastest path to fixing them.",
  primaryCta: CTA.primary,
  reassurance: "No-pitch conversation. Clear next steps.",
};
