// ─── Book Page Content ──────────────────────────────────────────────────────────
// Psychological job: Conversion
// Primary emotional outcome: This feels safe, useful, and worth doing.
// Design note: Keep this page sparse and calm. Calendar is the dominant action.
// Purple is absent from this page.

// ── Page Metadata ───────────────────────────────────────────────────────────────
export const bookMeta = {
  title: "Book a Free Audit — Ops by Noell",
  description:
    "A focused look at where leads, appointments, and follow-up are slipping. Not a pitch — a no-obligation conversation where you leave with clarity either way.",
};

// ── Section 1: Reassurance Intro ────────────────────────────────────────────────
// Psychological job: Reduce vulnerability around booking — explain clearly what this is
export const reassuranceIntro = {
  headline: "Let's look at what's actually leaking in your business.",
  subhead:
    "In this call, we'll walk through missed calls, no-shows, follow-up gaps, and what's realistically fixable based on how your business runs today.",
  reassuranceLine:
    "This is a no-pitch conversation. You'll leave with clarity either way.",
  trustLine: "If there's a simple fix, we'll show you. If there isn't, we'll tell you that too.",
};

// ── Section 2: Calendar Embed ────────────────────────────────────────────────────
// Psychological job: Make the action dominant and frictionless
export const calendarEmbed = {
  helperLine: "Pick a time that works for you.",
  stylingNote:
    "Keep this clean, calm, and visually dominant. No distractions around the calendar.",
  // Embed URL — to be configured with actual Calendly/Cal.com link
  embedUrl: null as string | null,
};

// ── Section 3: Reassurance Cards ────────────────────────────────────────────────
// Psychological job: Remove final objections without overloading the page
export const reassuranceCards = [
  {
    title: "What this call is",
    body: "A focused look at where leads, appointments, and follow-up are slipping.",
  },
  {
    title: "What you'll leave with",
    body: "A clearer view of what to fix first and what's possible for your business.",
  },
  {
    title: "What this call is not",
    body: "Not a hard sell. Not a pressure pitch. Just clarity.",
  },
];

// Testimonial line supporting the reassurance cards
export const callTestimonialLine =
  "Even the call itself should feel valuable.";
