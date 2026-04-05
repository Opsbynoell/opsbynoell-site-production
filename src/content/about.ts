// ─── About Page Content ─────────────────────────────────────────────────────────
// Psychological job: Human trust
// Primary emotional outcome: These are real people with taste, care, and competence.

import { CTA } from "@/lib/constants";

// ── Page Metadata ───────────────────────────────────────────────────────────────
export const aboutMeta = {
  title: "About — Ops by Noell",
  description:
    "Ops by Noell was built for service businesses that are strong at the craft but stretched thin in the follow-up, front-desk, and operational layers that quietly affect revenue every day.",
};

// ── Section 1: Founder Story ────────────────────────────────────────────────────
// Psychological job: Feel human and specific immediately
export const founderStory = {
  headline: "We built this for the business owner carrying too much.",
  subhead:
    "Ops by Noell was built for service businesses that are strong at the craft but stretched thin in the follow-up, front-desk, and operational layers that quietly affect revenue every day.",
  paragraphs: [
    "You shouldn't have to choose between doing great work and running a system that keeps up with every missed call, reminder, review, and lead.",
    "We built this to make the business feel lighter, more controlled, and more consistent — without forcing owners to become software operators.",
  ],
};

// ── Section 2: Why Ops by Noell ─────────────────────────────────────────────────
// Psychological job: Add clear, concrete trust reasons — not fluffy claims
export const whyOpsSection = {
  headline: "Why people choose Ops by Noell",
  cards: [
    {
      title: "Done-for-you, not DIY",
      body: "We help implement the system, not just recommend tools.",
    },
    {
      title: "Built for service businesses",
      body: "Everything is shaped around local businesses where response time and consistency matter.",
    },
    {
      title: "Human-first systems",
      body: "The goal is not more automation for its own sake. It's better client experience with less owner stress.",
    },
    {
      title: "Measured by real outcomes",
      body: "More booked clients. Fewer no-shows. Better reviews. Less follow-up chaos.",
    },
  ],
};

// ── Section 3: Founder Image Placeholder ───────────────────────────────────────
// Psychological job: Put a face to the brand — trust through visibility
export const founderImageBlock = {
  captionHeadline: "Meet the Noells",
  captionBody:
    "Real people building systems for real businesses that don't have time to waste.",
  // Placeholder — swap with actual image path when photography is available
  imageSrc: null as string | null,
  imageAlt: "The Noells — founders of Ops by Noell",
};

// ── Section 4: Dark CTA ─────────────────────────────────────────────────────────
export const aboutDarkCta = {
  headline: "Ready to see what this could look like in your business?",
  subhead: "We'll show you where the leak is and what the right first fix looks like.",
  primaryCta: CTA.primary,
};
