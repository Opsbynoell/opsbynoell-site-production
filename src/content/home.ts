// ─── Homepage Content ───────────────────────────────────────────────────────────
// Psychological job: Attention + trust
// Primary emotional outcome: They understand exactly what I'm dealing with.

import { CTA } from "@/lib/constants";

// ── Page Metadata ───────────────────────────────────────────────────────────────
export const homeMeta = {
  title: "Ops by Noell — Done-for-You Front Desk + Follow-Up System",
  description:
    "We build, install, and manage the system that catches missed calls, follows up instantly, and keeps your calendar full — so you can stay focused on the client in front of you.",
};

// ── Section 1: Hero ─────────────────────────────────────────────────────────────
// Component: Hero Section + Text Generate Effect
// Psychological job: Stop the scroll and create instant self-recognition
export const heroSection = {
  eyebrow: "Done-for-You Front Desk + Follow-Up System",
  headline: "By the time you call back, they've already booked somewhere else.",
  subhead:
    "We build, install, and manage the system that catches missed calls, follows up instantly, and keeps your calendar full — so you can stay focused on the client in front of you.",
  specificityLine:
    "Built for massage therapists, med spas, salons, dental offices, and estheticians.",
  primaryCta: CTA.primary,
  secondaryCta: CTA.secondary,
  microProof: "Case study: 4 no-shows a week to less than 1 in 14 days.",
  visualNote:
    "Human-centered image or founder/client-led composition — not a floating software mockup.",
};

// ── Section 2: Stats Bar ────────────────────────────────────────────────────────
// Component: Stats Section
// Psychological job: Turn attention into credibility
export const statsSection = {
  headline: "One system change can change the whole week.",
  supportingLine: "Real outcomes from a real service business.",
  stats: [
    { value: "$960", label: "Revenue recovered in 14 days" },
    { value: "40+", label: "Google reviews in 8 weeks" },
    { value: "<1", label: "No-shows per week" },
    { value: "14 days", label: "To get the system live" },
  ],
  closingLine: "From one practice. 14 days. One system change.",
};

// ── Section 3: Who This Is For ──────────────────────────────────────────────────
// Component: Bento Grid
// Psychological job: Trigger the "that's me" response
export const audienceSection = {
  headline: "If this feels familiar, this was built for you.",
  subhead:
    "We work with service businesses where speed, consistency, and follow-up directly affect revenue.",
  cards: [
    {
      title: "Massage Therapists",
      body: "You're in session when the phone rings. By the time you check it, the lead is gone.",
    },
    {
      title: "Med Spa Owners",
      body: "High-value leads don't wait. A delayed response can cost you the entire booking.",
    },
    {
      title: "Salon Owners",
      body: "You built this so you could do great work, not return voicemails at 9 PM.",
    },
    {
      title: "Dental Offices",
      body: "The front desk is overloaded, recalls are slipping, and no one has time to chase every lead.",
    },
  ],
};

// ── Section 4: The Real Problem ─────────────────────────────────────────────────
// Component: Sticky Scroll Reveal (if minimal) or two-column section
// Psychological job: Agitate the real problem and reframe it as operational
export const problemSection = {
  headline: "Your marketing is working. Your response time isn't.",
  subhead:
    "The problem usually isn't demand. It's what happens after someone reaches out.",
  slides: [
    {
      title: "Missed calls become missed revenue",
      body: "Someone finds you, calls you, gets no answer, and moves on before you ever have a chance to follow up.",
    },
    {
      title: "Follow-up slips when the day gets full",
      body: "You mean to text them back, confirm the appointment, or ask for the review — but client work always comes first.",
    },
    {
      title: "No-shows are usually a system problem",
      body: "If reminders are inconsistent and communication is reactive, no-shows stay high even when demand is strong.",
    },
  ],
  closingLine:
    "This isn't a marketing problem. It's an operations problem, and it's fixable without hiring anyone.",
};

// ── Section 5: Santa Case Study ─────────────────────────────────────────────────
// Component: Card Spotlight
// Psychological job: Proof — resolve early skepticism with a real before/after
export const caseStudySection = {
  eyebrow: "Proof",
  headline: "4 no-shows a week. Then almost none.",
  subhead:
    "Santa, a massage therapist in Laguna Niguel, went from zero digital infrastructure to a system that followed up, reminded clients, and protected her calendar.",
  before:
    "Missed calls, no-show stress, inconsistent reminders, and too much manual follow-up.",
  after:
    "Automated reminders, missed-call recovery, better reviews, and a calendar that felt under control again.",
  metrics: [
    "No-shows dropped from 4 per week to less than 1",
    "Revenue recovered in 14 days",
    "40+ Google reviews in 8 weeks",
  ],
  cta: CTA.caseStudy,
};

// ── Section 6: Founders ─────────────────────────────────────────────────────────
// Component: Simple two-column or clean cards block
// Psychological job: Deepen human trust, not add flash
export const foundersSection = {
  headline: "Built by the Noells. Designed for real businesses, not software demos.",
  subhead:
    "Ops by Noell exists for owners who are great at what they do but tired of losing revenue to broken follow-up, missed calls, and overwhelmed front desks.",
  valueCards: [
    {
      title: "Human first",
      body: "Systems should support the way real service businesses actually run.",
    },
    {
      title: "Done for you",
      body: "We don't hand you a pile of tools and wish you luck. We build and manage the system with you.",
    },
    {
      title: "Built for service businesses",
      body: "Everything is designed around local practices where speed and consistency matter.",
    },
    {
      title: "Measured by outcomes",
      body: "More booked clients. Fewer no-shows. Better reviews. Less stress.",
    },
  ],
};

// ── Section 7: Dark CTA ─────────────────────────────────────────────────────────
// Component: CTA Section (dark variant)
// Psychological job: Final low-friction action step
export const darkCtaSection = {
  headline: "Stop losing clients you never knew about.",
  subhead: "We'll show you exactly where the leak is and what to fix first.",
  primaryCta: CTA.primary,
  reassurance: "No-pitch conversation. Clear next steps.",
};
