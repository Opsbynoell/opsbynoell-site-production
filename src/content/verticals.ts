// ─── Verticals Page Content ──────────────────────────────────────────────────────
// Psychological job: Fit and self-identification
// Primary emotional outcome: This was built for exactly what I'm dealing with.

import { CTA } from "@/lib/constants";

// ── Page Metadata ───────────────────────────────────────────────────────────────
export const verticalsMeta = {
  title: "Who We Work With — Ops by Noell",
  description:
    "Ops by Noell builds operational systems for service businesses where speed, consistency, and follow-up directly affect revenue. See if your industry is a fit.",
};

// ── Section 1: Hero ─────────────────────────────────────────────────────────────
// Psychological job: Trigger immediate fit and self-recognition
export const verticalsHero = {
  eyebrow: "Who We Work With",
  headline: "If a missed call, slow reply, or forgotten follow-up costs you money, this was built for your kind of business.",
  subhead:
    "The details change by vertical. The pain does not. Someone reaches out, no one responds fast enough, follow-up slips, and the revenue never shows up.",
  primaryCta: CTA.primary,
};

// ── Section 2: Vertical Overview ────────────────────────────────────────────────
export const verticalsOverview = {
  headline: "Different businesses. Same leak.",
  subhead:
    "The surface problem changes — missed consults, lost calls, weak recalls, no-shows, stale lists. Underneath, it is the same thing: response, follow-up, and consistency breaking at the exact moment they matter.",
};

// ── Section 3: Vertical Breakdowns ──────────────────────────────────────────────
// Psychological job: Let visitors deeply identify with their specific situation
export const verticals = [
  {
    id: "med-spas",
    title: "Med Spas",
    eyebrow: "Medical Aesthetics",
    cardPain: "High-value leads do not wait. When consult inquiries sit too long, the booking disappears before your team ever gets to it.",
    corePain:
      "High-value leads don't wait. A Botox or filler inquiry that gets no response in the first hour is usually lost. The consult volume you could be doing isn't showing up because the lead follow-up isn't consistent.",
    specificPains: [
      "Leads who inquire and then go silent after one follow-up",
      "No-shows on high-value consult appointments",
      "Review volume that doesn't reflect client satisfaction",
      "Front desk stretched too thin to follow up properly",
    ],
    relevantSystems: [
      "Missed Call Recovery",
      "Lead Pipeline Follow-Up",
      "Appointment Confirmation",
      "Review Generation",
      "Nova AI",
    ],
    likelyOutcome:
      "More consults booked from the same inquiry volume. Fewer no-shows on premium appointments. Reviews that build social proof consistently.",
    packageFit: "Starter or Growth",
    caseStudyHint:
      "Med spa clients typically see the biggest return from lead follow-up and review generation combined.",
  },
  {
    id: "salons",
    title: "Salons",
    eyebrow: "Hair & Beauty",
    cardPain: "When the phone rings during a service and no one answers, the lead usually books somewhere else.",
    corePain:
      "You built this so you could do great work, not return voicemails at 9 PM. But the phone is still ringing while you're with a client, and those missed calls are walking out the door.",
    specificPains: [
      "Calls missed while stylists are in service",
      "Last-minute cancellations with no easy rebooking system",
      "Irregular reminder cadence leading to consistent no-shows",
      "Reviews slipping because nobody asks at the right moment",
    ],
    relevantSystems: [
      "Missed Call Recovery",
      "Appointment Confirmation",
      "Review Generation",
      "Reactivation Campaigns",
    ],
    likelyOutcome:
      "Fewer missed calls that go unanswered. No-show rate drops. Past clients reactivated to fill gaps in the schedule.",
    packageFit: "Entry or Starter",
    caseStudyHint:
      "Salon owners often start with missed call recovery and see immediate revenue recovery in the first two weeks.",
  },
  {
    id: "massage-therapists",
    title: "Massage Therapists",
    eyebrow: "Therapeutic & Wellness",
    cardPain: "You are in session when the call comes in. By the time you check it, the money is already gone.",
    corePain:
      "You're in session when the phone rings. By the time you check it, the lead is gone. And because you're a solo or small practice, every no-show directly hits your income.",
    specificPains: [
      "Calls missed during sessions with no auto-response",
      "No-show rates that stay high because reminders are inconsistent",
      "Clients who lapse between appointments with no reactivation",
      "Difficulty building a review volume that matches client trust",
    ],
    relevantSystems: [
      "Missed Call Recovery",
      "Appointment Confirmation",
      "Review Generation",
      "Lead Pipeline Follow-Up",
    ],
    likelyOutcome:
      "No-show rate drops measurably. Missed calls get followed up the same day. Review count grows without you having to ask manually.",
    packageFit: "Entry or Starter",
    caseStudyHint:
      "Santa, a massage therapist in Laguna Niguel, went from 4 no-shows per week to less than 1 — plus 40+ Google reviews in 8 weeks.",
  },
  {
    id: "dental-offices",
    title: "Dental Offices",
    eyebrow: "Dental & Oral Health",
    cardPain: "The front desk is overloaded, recalls slip, and patients who meant to come back quietly disappear.",
    corePain:
      "The front desk is overloaded, recalls are slipping, and no one has time to chase every lead or reactivation. The operational gap is in the follow-up — not the clinical work.",
    specificPains: [
      "Recall patients who don't come back without systematic outreach",
      "New patient leads that go cold after one contact attempt",
      "High volume of inbound calls that slip through during busy hours",
      "Review velocity that doesn't match patient satisfaction",
    ],
    relevantSystems: [
      "Missed Call Recovery",
      "Appointment Confirmation",
      "Review Generation",
      "Reactivation Campaigns",
      "Lead Pipeline Follow-Up",
      "Nova AI",
    ],
    likelyOutcome:
      "Recall rate improves. New patient conversion from inquiry increases. Front desk gets relief from manual follow-up tasks.",
    packageFit: "Starter or Growth",
    caseStudyHint:
      "Dental offices with active recall gaps often find reactivation campaigns alone recover significant monthly revenue.",
  },
  {
    id: "hvac",
    title: "HVAC",
    eyebrow: "Heating & Cooling",
    cardPain: "In busy season, the fastest callback wins. If the phone goes to voicemail, that job is usually gone.",
    corePain:
      "Demand is high in season, but leads call multiple contractors at once. The fastest callback wins. If your team is on a job and the phone goes to voicemail, that lead is gone.",
    specificPains: [
      "Inbound calls missed when techs are on-site",
      "Quote follow-up that relies on technicians or owners to remember",
      "Review volume that doesn't reflect job quality",
      "Off-season lead reactivation that never happens systematically",
    ],
    relevantSystems: [
      "Missed Call Recovery",
      "Lead Pipeline Follow-Up",
      "Review Generation",
      "Reactivation Campaigns",
    ],
    likelyOutcome:
      "Faster response to inbound leads. Quote follow-up handled without manual tracking. Off-season pipeline maintained through reactivation.",
    packageFit: "Starter",
    caseStudyHint:
      "In HVAC, speed of first response is the single highest-leverage improvement available.",
  },
  {
    id: "home-services",
    title: "Home Services",
    eyebrow: "Home & Property",
    cardPain: "When estimates, callbacks, and follow-up depend on memory, too many jobs fall through the cracks.",
    corePain:
      "Landscaping, cleaning, pest control, painting — businesses where the crew is working and the phone is ringing at the same time. Every missed call is a job that went to a competitor.",
    specificPains: [
      "Calls missed while crew is on-site",
      "Estimate follow-up that falls through when workload is high",
      "Repeat client reactivation that depends on clients remembering to call",
      "Reviews that don't accumulate despite consistent quality work",
    ],
    relevantSystems: [
      "Missed Call Recovery",
      "Lead Pipeline Follow-Up",
      "Review Generation",
      "Reactivation Campaigns",
    ],
    likelyOutcome:
      "More inbound leads converted. Repeat business rates improve through systematic reactivation. Review count builds over time.",
    packageFit: "Entry or Starter",
    caseStudyHint:
      "Home service businesses with strong reactivation programs often see 20–30% of monthly revenue come from past clients.",
  },
  {
    id: "pool-services",
    title: "Pool Services",
    eyebrow: "Pool & Outdoor",
    cardPain: "Seasonal spikes create chaos fast. Without systems, new inquiries and repeat-service opportunities get lost at the same time.",
    corePain:
      "Seasonal demand, recurring service routes, and new customer leads all happening at once. The operational chaos of spring startup is where revenue slips the most.",
    specificPains: [
      "New service inquiries that go unanswered during busy season",
      "Recurring client reactivation that depends on manual outreach",
      "Review generation that never becomes a consistent habit",
      "Estimate follow-up that gets lost in the workload",
    ],
    relevantSystems: [
      "Missed Call Recovery",
      "Lead Pipeline Follow-Up",
      "Reactivation Campaigns",
      "Review Generation",
    ],
    likelyOutcome:
      "Seasonal rush captures more leads. Reactivation fills slow periods. Review count grows without adding work.",
    packageFit: "Entry or Starter",
    caseStudyHint:
      "Pool service businesses see the highest return during seasonal transition periods when lead volume spikes.",
  },
];

// ── Section 4: Fit Check ────────────────────────────────────────────────────────
// Psychological job: Let visitors who aren't on the list still self-qualify
export const fitCheck = {
  headline: "Don't see your industry?",
  body: "If you run a service business where phone response time, follow-up consistency, and appointment reliability directly affect revenue — the systems work the same way.",
  cta: CTA.primary,
  ctaNote: "We'll tell you on the call whether we're the right fit.",
};

// ── Section 5: Dark CTA ─────────────────────────────────────────────────────────
export const verticalsDarkCta = {
  headline: "See how the system would work in your business.",
  subhead:
    "Tell us what you're dealing with and we'll show you exactly which systems address it.",
  primaryCta: CTA.primary,
  reassurance: "No-pitch conversation. We'll tell you if it's not a fit.",
};
