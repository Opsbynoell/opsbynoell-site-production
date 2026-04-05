// ─── Services Page Content ──────────────────────────────────────────────────────
// Psychological job: Understanding
// Primary emotional outcome: Now I understand what they actually do.

import { CTA } from "@/lib/constants";

// ── Page Metadata ───────────────────────────────────────────────────────────────
export const servicesMeta = {
  title: "Services — Ops by Noell",
  description:
    "The 6 systems that keep leads moving and calendars full. Not one tool — the operational layer that catches missed opportunities and keeps your front desk from becoming the bottleneck.",
};

// ── Section 1: Hero-Lite Intro ──────────────────────────────────────────────────
// Psychological job: Immediate clarity on what this page and this company does
export const servicesHero = {
  headline: "The 6 systems that keep leads moving and calendars full.",
  subhead:
    "This is not one tool. It's the operational layer that catches missed opportunities, follows up faster, and keeps your front desk from becoming the bottleneck.",
  primaryCta: CTA.primary,
  secondaryCta: "See Pricing",
};

// ── Section 2: The 6 Systems ────────────────────────────────────────────────────
// Component: Bento Grid (or equivalent card system)
// Psychological job: Make the offer feel concrete and problem-matched
export const systemsSection = {
  headline: "You've seen the problem. Here's what fixes it.",
  systems: [
    {
      title: "Missed Call Recovery",
      body: "Instantly follow up when someone calls and nobody answers.",
      id: "missed-call-recovery",
    },
    {
      title: "Nova AI Chat",
      body: "Capture and qualify leads the moment they land on your site.",
      id: "nova-ai-chat",
      isNova: true, // Flag: purple accent treatment
    },
    {
      title: "Appointment Confirmation",
      body: "Automated reminders reduce no-shows before they hit your schedule.",
      id: "appointment-confirmation",
    },
    {
      title: "Review Generation",
      body: "Turn happy clients into fresh five-star proof without chasing them manually.",
      id: "review-generation",
    },
    {
      title: "Lead Pipeline Follow-Up",
      body: "Keep warm leads moving instead of losing them to silence.",
      id: "lead-pipeline",
    },
    {
      title: "Reactivation Campaigns",
      body: "Bring old leads and past clients back into the calendar.",
      id: "reactivation",
    },
  ],
};

// ── Section 3: How It Works ─────────────────────────────────────────────────────
// Psychological job: Reduce implementation fear — make the process feel simple
export const howItWorksSection = {
  headline: "Three steps. Then it runs while you work.",
  steps: [
    {
      number: "01",
      title: "Audit",
      body: "We look at missed calls, no-shows, follow-up gaps, and where revenue is slipping.",
    },
    {
      number: "02",
      title: "Build",
      body: "We install the systems, messaging, and automations that match how your business actually runs.",
    },
    {
      number: "03",
      title: "Run",
      body: "The system keeps working in the background while you focus on clients, staff, and growth.",
    },
  ],
  supportingLine: "No new hire required. No DIY setup headache.",
};

// ── Section 4: Dark CTA ─────────────────────────────────────────────────────────
export const servicesDarkCta = {
  headline: "See which systems you actually need.",
  subhead:
    "We'll map the leak points and show you the fastest path to fixing them.",
  primaryCta: CTA.primary,
};
