import Link from "next/link";
import {
  IconPhoneCall,
  IconCalendarEvent,
  IconShieldLock,
  IconUsersGroup,
  IconBolt,
  IconCircleCheck,
  IconRefresh,
  IconStethoscope,
} from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Features3 } from "@/components/features3";
import { VerticalCaseStudyPlaceholder } from "@/components/vertical-case-study";
import {
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
  servicePageSchema,
} from "@/lib/schema";
import { FAQ } from "@/components/faq";
import { VerticalPricingSection } from "@/components/pricing";
import { VerticalAgentsCallout } from "@/components/vertical-agents-callout";
import { PredictiveIntelligenceVerticalExample } from "@/components/predictive-intelligence";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/verticals/dental",
  title: "AI Front Desk for Dental Offices",
  description:
    "A done-for-you AI front desk for dental practices. Catch every new patient call in under 60 seconds, reactivate unscheduled treatment, and stop losing chair time to missed calls. Installed around your booking system.",
});

const dentalStats = [
  {
    value: "<60s",
    label: "New patient",
    detail: "callback time on missed calls",
  },
  {
    value: "38%",
    label: "Unscheduled",
    detail: "treatment typically recoverable",
  },
  {
    value: "24/7",
    label: "Coverage",
    detail: "new patient intake, after hours included",
  },
  {
    value: "14d",
    label: "Live",
    detail: "on top of your existing PMS",
  },
];

type DentalConcern = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  worry: string;
  answer: string;
};

const dentalConcerns: DentalConcern[] = [
  {
    icon: <IconCalendarEvent size={22} />,
    tag: "PMS integration",
    title: "It layers on top of your PMS. You do not replace anything.",
    worry:
      "Most dental offices are running an established practice management system. Rip-and-replace is a non-starter and you have already invested years of clinical data, templates, and staff training into your current system.",
    answer:
      "The Noell system sits in front of your PMS. We read availability out of your practice management software, push confirmed bookings back in, and leave your clinical workflow alone. Your hygiene schedule, perio tracking, and insurance routing stay exactly where they are.",
  },
  {
    icon: <IconShieldLock size={22} />,
    tag: "Patient communication",
    title: "Built around how dental offices already talk to patients.",
    worry:
      "Anything that touches patient communication needs to feel appropriate for a clinical setting. A tone that works for a salon does not work when a patient is asking about a crown, a root canal consult, or an emergency after hours.",
    answer:
      "Every outbound message is written in your office's voice, reviewed before install, and limited to operational content: appointment confirmations, reminders, reschedule links, new patient intake, and review requests. Clinical questions always route to a human at your practice. We do not give clinical advice, ever.",
  },
  {
    icon: <IconUsersGroup size={22} />,
    tag: "Front desk cost",
    title: "Your front desk stops being the bottleneck.",
    worry:
      "A full-time front desk hire is $45,000 to $65,000 a year in most markets, plus benefits, plus training time, plus the turnover every 18 months. And the job keeps getting bigger: insurance, verification, new patient intake, reminders, rebook calls, review requests.",
    answer:
      "The Noell system takes the repeatable work off your front desk so your existing team can focus on the patient in the chair. Missed-call recovery, appointment confirmations, reminders, reschedules, and review capture all run in the background. Your front desk handles the 10 percent that actually needs a human.",
  },
  {
    icon: <IconBolt size={22} />,
    tag: "Callback speed",
    title: "New patient calls get returned in under 60 seconds.",
    worry:
      "The average dental office takes over an hour to return a new patient call. By then the patient has called the next office on Google. You paid for that click, that SEO, that referral, and you lost the appointment at the callback step.",
    answer:
      "When a new patient call goes unanswered, Noell Front Desk sends an on-brand text in under 60 seconds with your booking link and the next two available new patient slots. Most patients book themselves before they would have called anyone else.",
  },
];

const pmsCategories = [
  { label: "Server-based PMS", caption: "on-premise" },
  { label: "Cloud PMS", caption: "browser-based" },
  { label: "Multi-location DSO platforms", caption: "enterprise" },
  { label: "Imaging-integrated PMS", caption: "clinical-stack" },
  { label: "Insurance-first PMS", caption: "billing-stack" },
  { label: "Custom & legacy systems", caption: "case-by-case" },
];

const dentalCapabilities = [
  {
    icon: <IconPhoneCall size={28} />,
    number: "01",
    title: "New patient callbacks, handled",
    description:
      "Every missed new patient call triggers a text in under 60 seconds with a warm message and two available slots. They book before they open another tab.",
    points: [
      "Under 60 second response",
      "New patient slots surfaced automatically",
      "Booking lands back in your PMS",
    ],
  },
  {
    icon: <IconRefresh size={28} />,
    number: "02",
    title: "Unscheduled treatment, reactivated",
    description:
      "Patients with diagnosed treatment that never got on the books get a friendly, non-pushy nudge on the right cadence. Recall and hygiene gaps close on their own.",
    points: [
      "Diagnosed-but-unscheduled outreach",
      "6-month hygiene recall coverage",
      "Warm, clinical tone reviewed by your team",
    ],
  },
  {
    icon: <IconCircleCheck size={28} />,
    number: "03",
    title: "Confirmations and reminders, dialed in",
    description:
      "Multi-channel confirmations and reminders sized to your practice. The cadence that actually keeps no-shows from happening, not the generic one the PMS ships with.",
    points: [
      "SMS and email, patient preference honored",
      "Smart reminder cadence per service",
      "Self-serve reschedule to protect the slot",
    ],
  },
];

const dentalFaqs = [
  {
    question: "Does this replace my dental practice management system?",
    answer:
      "No. The Noell system layers on top of your existing PMS. Your clinical charting, perio tracking, insurance, and treatment plans stay where they are. We handle the communication layer and the scheduling touchpoints. Tell us what you run on your audit call and we will confirm fit.",
  },
  {
    question: "Is this HIPAA safe?",
    answer:
      "The Noell system only handles operational messaging: appointment confirmations, reminders, new patient intake, reschedule links, and review requests. We do not store clinical records, diagnoses, or treatment plans, and we do not send PHI in outbound messages. A BAA is available for practices that require one. Any clinical question from a patient is routed to a human at your office.",
  },
  {
    question: "What about insurance verification and benefits?",
    answer:
      "Insurance verification stays with your team. The Noell system is not an insurance platform. What we do is make sure the new patient gets on the schedule first, so your front desk has something to verify, rather than chasing a lead that never called back.",
  },
  {
    question: "Will patients know they are texting an AI?",
    answer:
      "The opening message is written in your office's voice and is clear that messages are automated. When a patient needs to talk to a human, they do, immediately. We are not trying to impersonate your team. We are trying to stop letting calls fall through while they are with a patient.",
  },
  {
    question: "How much front desk time does this save?",
    answer:
      "Most practices report four to eight hours per week returned to the front desk once the system is fully live. That usually shows up as shorter morning huddles, fewer end-of-day rebook calls, and a front desk team that can actually look up when a patient walks in.",
  },
  {
    question: "How long does install take on a dental PMS?",
    answer:
      "Most dental practices are fully live within 14 days of signing. Install is handled by us. We map your services, hygiene recall rules, and new patient flow into the system, write the copy in your voice, and layer it on top of your PMS without touching your clinical setup.",
  },
];

const dentalScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-charcoal/70 font-medium">
          Noell Front Desk, Dental
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/70">
        09:42
      </span>
    </div>

    {/* New patient callback card */}
    <div className="bg-white rounded-2xl p-3 mx-1 border border-warm-border/60 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-wine/85 font-medium">
            New patient, missed call
          </p>
          <p className="text-sm text-charcoal font-medium mt-0.5">
            Rebecca K.
          </p>
          <p className="text-[11px] text-charcoal/70">
            Callback sent, 42s
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blush text-wine">
          under 60s
        </span>
      </div>
      <div className="mt-2 bg-cream-dark rounded-lg p-2 text-[11px] text-charcoal/80 leading-snug">
        Hi Rebecca, thanks for calling Dr. Lin's office. We can get you in
        Thursday 8:30 or Friday 11:00 for your new patient exam. Which works?
      </div>
    </div>

    {/* Unscheduled treatment reactivation */}
    <div className="bg-wine rounded-2xl p-3 mx-1 mt-2 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-cream/70 font-medium">
        Unscheduled treatment, this month
      </p>
      <p className="font-serif text-3xl font-bold text-cream mt-0.5">
        $14,200
      </p>
      <p className="text-[11px] text-cream/60">rebooked from diagnosed-but-unscheduled recall</p>
    </div>

    {/* Hygiene recall card */}
    <div className="bg-blush-light rounded-2xl p-3 mx-1 mt-2 border border-wine/10 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-wine/85 font-medium">
            Hygiene recall, confirmed
          </p>
          <p className="text-sm text-charcoal font-medium mt-0.5">
            Thursday · 2:00 PM
          </p>
          <p className="text-[11px] text-charcoal/70">
            6-month cleaning · Hygienist: Maya
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-wine text-cream">
          booked
        </span>
      </div>
    </div>
  </div>
);

export default function DentalVerticalPage() {
  return (
    <div>
      <JsonLd
        data={[
          servicePageSchema({
            name: "AI front desk for dental offices",
            description:
              "Done-for-you AI front desk for dental practices. Catches missed calls, reactivates unscheduled treatment, handles confirmations and reminders.",
            path: "/verticals/dental",
            vertical: "dental practices",
          }),
          localBusinessSchema("dental practices"),
          faqPageSchema(dentalFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Verticals", path: "/verticals" },
            { name: "Dental Offices", path: "/verticals/dental" },
          ]),
        ]}
        id="vertical-dental"
      />
      <Hero
        eyebrow="Ops by Noell for Dental"
        headlineLine1Start="While you are with"
        headlineLine1Accent="the patient in the chair,"
        headlineLine2Start="the next one"
        headlineLine2Accent="is picking another office."
        body="A done-for-you AI front desk for dental practices. Catch every new patient call in under 60 seconds, reactivate unscheduled treatment, and stop losing chair time to missed calls. We layer on top of your existing dental practice management system. Your clinical workflow does not change."
        footnote="Built for general, family, cosmetic, and pediatric dental practices running any major practice management system."
        primaryCta={{ label: "Get Your Free Dental Audit", href: "/book" }}
        secondaryCta={{ label: "See how it layers on your PMS", href: "#layers-on-pms" }}
        mockScreen={dentalScreen}
        sourcePage="verticals_dental"
      />

      <VerticalAgentsCallout />

      {/* Dental-specific stats */}
      <Features
        eyebrow="What dental practices see"
        headlineStart="Every new patient call,"
        headlineAccent="answered."
        body="The numbers we watch on a live dental install. Real practices, real PMS, real weeks."
        stats={dentalStats}
      />

      {/* The four dental concerns, answered */}
      <section id="dental-concerns" className="w-full py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
                dental office worries / answered
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              The four things every dental office asks{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                before saying yes.
              </span>
            </h2>
            <p className="mt-5 text-charcoal/70 max-w-2xl mx-auto">
              We have had these conversations with dozens of dental office
              managers. The worries are specific to dental. The answers should
              be too.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {dentalConcerns.map((concern, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[22px] border border-warm-border bg-white p-7 md:p-8",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-wine/10 text-wine flex items-center justify-center">
                    {concern.icon}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/70">
                    {concern.tag}
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-3 leading-snug">
                  {concern.title}
                </h3>
                <p className="text-sm text-charcoal/70 leading-relaxed mb-4 border-l-2 border-warm-border pl-4 italic">
                  {concern.worry}
                </p>
                <p className="text-sm text-charcoal/80 leading-relaxed">
                  {concern.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Layers on PMS band */}
      <section
        id="layers-on-pms"
        className="w-full max-w-7xl mx-auto rounded-3xl bg-charcoal px-6 py-20 md:py-24 my-10 md:my-16"
      >
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IconStethoscope size={18} className="text-blush" />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-blush">
              integrates on top / does not replace
            </p>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
            Layers on top of the PMS{" "}
            <span className="italic text-wine-light">you already run.</span>
          </h2>
          <p className="mt-5 text-cream/60 max-w-xl mx-auto">
            Your clinical workflow does not change. Your front desk keeps
            using the same software they trained on. We layer the
            communication and scheduling side on top.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pmsCategories.map((cat) => (
              <div
                key={cat.label}
                className="rounded-[14px] border border-white/10 bg-white/[0.04] px-4 py-4 text-center"
              >
                <p className="font-serif text-base text-cream leading-snug">{cat.label}</p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-cream/60 mt-1">
                  {cat.caption}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-cream/65 mt-6 max-w-xl mx-auto">
            Not listed? We have likely worked around it. Most dental PMS
            platforms expose the hooks we need, and anything we cannot reach
            directly we bridge through the appointment and SMS layer.
          </p>
        </div>
      </section>

      <VerticalCaseStudyPlaceholder vertical="dental" />

      {/* Relief: what changes for a dental practice */}
      <Features3
        eyebrow="What changes, week one"
        headlineStart="The three things"
        headlineAccent="that close the gap."
        body="Not a 40-feature list. The three touchpoints that move the numbers in a dental practice."
        capabilities={dentalCapabilities}
      />

      <PredictiveIntelligenceVerticalExample vertical="dental" />

      <VerticalPricingSection
        vertical="dental"
        auditPhrase="dental audit"
        sourcePage="verticals_dental"
      />

      {/* Dental FAQ */}
      <FAQ
        eyebrow="Dental questions, answered"
        headlineStart="The real ones"
        headlineAccent="your office manager will ask."
        body="What every dental office asks before signing. Straight answers, no sales theater."
        faqs={dentalFaqs}
      />

      {/* Back to verticals index for discovery */}
      <section className="w-full px-4 my-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/70 mb-3">
            run a different kind of office?
          </p>
          <Link
            href="/verticals"
            className="text-sm text-wine hover:text-wine-dark underline underline-offset-4 decoration-wine/30"
          >
            See every vertical Ops by Noell is built for &rarr;
          </Link>
        </div>
      </section>

      {/* Close */}
      <CTA
        eyebrow="For dental practices"
        headlineStart="Get a free audit"
        headlineAccent="of your new patient flow."
        body="A 30-minute review of your missed-call flow, new patient response time, and hygiene recall gaps. You walk away with a map of what is leaking and exactly how a Noell install would catch it."
        primaryCta={{ label: "Book Your Free Dental Audit", href: "/book" }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · Live on your PMS in 14 days · No contracts"
        sourcePage="verticals_dental"
      />
    </div>
  );
}
