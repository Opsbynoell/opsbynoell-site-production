import Link from "next/link";
import {
  IconHeart,
  IconCalendarStats,
  IconCertificate,
  IconRefresh,
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
  path: "/verticals/estheticians",
  title: "AI Front Desk for Estheticians",
  description:
    "Retention-first, never pushy. Ops by Noell protects treatment plan adherence, keeps skincare routines on cadence, and holds your membership pipeline without making the tone shift into sales.",
});

const estheticianStats = [
  {
    value: "6wk",
    label: "Window",
    detail: "before facial results start to drift",
  },
  {
    value: "2.4x",
    label: "LTV",
    detail: "from treatment-plan clients vs. one-off bookings",
  },
  {
    value: "<90s",
    label: "Reply",
    detail: "on booking and routine questions",
  },
];

type Concern = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  worry: string;
  answer: string;
};

const estheticianConcerns: Concern[] = [
  {
    icon: <IconCertificate size={22} />,
    tag: "Treatment plan adherence",
    title: "The treatment plan is the product.",
    worry:
      "You built a six-visit plan for a reason. Visit three is where most clients drift off, and by the time they come back, the skin is back where they started and they think the treatment did not work.",
    answer:
      "The Noell system books the next visit in the plan from the chair, not from memory. A gentle reminder lands at the exact cadence window for the protocol, with context: where they are in the plan, what is next, and why timing matters.",
  },
  {
    icon: <IconRefresh size={22} />,
    tag: "Routine rebooking",
    title: "Skincare is a habit, not a purchase.",
    worry:
      "A great facial client who forgets to rebook becomes someone else's client inside of eight weeks. The miss is rarely about price. It is about the moment the client looks in the mirror, thinks about booking, gets distracted, and never opens the app.",
    answer:
      "Rebook nudges are sized to the treatment, not to a generic thirty-day window. Hydrafacial lands at four weeks, deep pore at six, routine facial at four to six based on the client's history. The nudge arrives at the moment of intent, not after it.",
  },
  {
    icon: <IconHeart size={22} />,
    tag: "Quiet retention",
    title: "Retention without the funnel voice.",
    worry:
      "Estheticians hate the funnel-language playbook. Your clients came to you because they wanted someone to care about their skin, not upsell them into a package. Anything that smells like a sales flow gets ignored, or worse, breaks the relationship.",
    answer:
      "Every message is written with you during install and reviewed against the tone of your own client notes. Quiet, curated, never pushy. The system does the remembering. You do the caring.",
  },
];

const estheticianCapabilities = [
  {
    icon: <IconCertificate size={28} />,
    number: "01",
    title: "Plan-aware rebooking",
    description:
      "Clients on a multi-visit plan get nudges that know where they are in the protocol. Visit three is a different message than visit one.",
    points: [
      "Per-protocol cadence",
      "Plan context in the message",
      "Self-serve reschedule inside the plan",
    ],
  },
  {
    icon: <IconRefresh size={28} />,
    number: "02",
    title: "Routine rebook cadence",
    description:
      "Treatment-specific rebook windows per client, so the nudge lands at the exact moment the skin is asking for the next visit.",
    points: [
      "Service-specific windows",
      "Tone matched to your voice",
      "One nudge per window",
    ],
  },
  {
    icon: <IconHeart size={28} />,
    number: "03",
    title: "Membership retention",
    description:
      "Monthly members who drift get a quiet check-in before the bill question becomes a cancellation. Held gently, not funneled.",
    points: [
      "Usage-aware check-ins",
      "Pause flow, not cancel flow",
      "Routed to you before churn",
    ],
  },
];

const estheticianFaqs = [
  {
    question: "Does it handle treatment plans and packages separately?",
    answer:
      "Yes. The Noell system can distinguish a client on a six-visit chemical peel plan from a monthly membership client from a one-off facial. Each gets its own cadence, tone, and rebook logic. We set the protocols with you during install.",
  },
  {
    question: "Will messages feel on-brand for a skincare practice?",
    answer:
      "Skincare brands live or die on tone. We write every outbound message with you and hold to the voice of your client notes and your IG captions. No discount language, no emojis, no urgency bait. The system should feel like you paying attention, not a funnel.",
  },
  {
    question: "How does this work with my product sales?",
    answer:
      "Retail is a separate flow. The Noell system focuses on service retention: rebooking, plan adherence, and membership support. If you want gentle post-visit suggestions tied to what a client used during their service, we can build that in. We do not run retail-push campaigns.",
  },
  {
    question: "What booking tools do you support?",
    answer:
      "We layer on top of the booking tools estheticians actually use: Boulevard, Vagaro, Square Appointments, Acuity, GlossGenius, Mindbody, and similar. Your clinical notes and treatment plan records stay in your current system.",
  },
];

const estheticianScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-charcoal/70 font-medium">
          Noell Front Desk, Skincare
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
        plan-aware
      </span>
    </div>

    <div className="bg-white rounded-2xl p-3 mx-1 border border-warm-border/60 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-wine/70 font-medium">
            Treatment plan, visit 4 of 6
          </p>
          <p className="text-sm text-charcoal font-medium mt-0.5">Lena K.</p>
          <p className="text-[11px] text-charcoal/50">
            Peel series, 4-week cadence
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blush text-wine">
          due
        </span>
      </div>
      <div className="mt-2 bg-cream-dark rounded-lg p-2 text-[11px] text-charcoal/80 leading-snug">
        Hi Lena, we are right at the window for visit 4 in your peel series.
        Thursday 10:00 or Saturday 1:00 with Ana. Want me to hold one?
      </div>
    </div>

    <div className="bg-wine rounded-2xl p-3 mx-1 mt-2 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-cream/70 font-medium">
        Plan adherence
      </p>
      <p className="font-serif text-3xl font-bold text-cream mt-0.5">92%</p>
      <p className="text-[11px] text-cream/60">
        of plan clients on cadence, trailing 90 days
      </p>
    </div>
  </div>
);

export default function EstheticiansVerticalPage() {
  return (
    <div>
      <JsonLd
        data={[
          servicePageSchema({
            name: "AI front desk for estheticians",
            description:
              "Done-for-you AI front desk for licensed estheticians and skincare studios. Retention-first cadence that protects treatment plan adherence.",
            path: "/verticals/estheticians",
            vertical: "esthetician studios",
          }),
          localBusinessSchema("esthetician studios"),
          faqPageSchema(estheticianFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Verticals", path: "/verticals" },
            { name: "Estheticians", path: "/verticals/estheticians" },
          ]),
        ]}
        id="vertical-estheticians"
      />
      <Hero
        eyebrow="Ops by Noell for Estheticians"
        headlineLine1Start="Your clients come back"
        headlineLine1Accent="for the skin."
        headlineLine2Start="The system keeps them"
        headlineLine2Accent="coming back for the routine."
        body="A done-for-you AI front desk for licensed estheticians and skincare studios. Treatment plans held on cadence, routine facials rebooked at the right window, membership quietly protected. All in a tone that sounds like you."
        footnote="Built for licensed estheticians, skincare studios, and membership-based practices running Boulevard, Vagaro, Square, Acuity, GlossGenius, or Mindbody."
        primaryCta={{ label: "Get Your Free Skincare Audit", href: "/book" }}
        secondaryCta={{
          label: "See how the plan stays on cadence",
          href: "#esthetician-concerns",
        }}
        mockScreen={estheticianScreen}
      />

      <VerticalAgentsCallout />

      <Features
        eyebrow="What estheticians see"
        headlineStart="Plans adhere."
        headlineAccent="Routines rebook."
        body="Three numbers that move when the treatment plan is held in the system, not in your head."
        stats={estheticianStats}
      />

      <section id="esthetician-concerns" className="w-full py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
                skincare retention / answered
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Three things every esthetician{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                already protects by hand.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {estheticianConcerns.map((c, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[22px] border border-warm-border bg-white p-7",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-wine/10 text-wine flex items-center justify-center">
                    {c.icon}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
                    {c.tag}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-3 leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm text-charcoal/60 leading-relaxed mb-4 border-l-2 border-warm-border pl-4 italic">
                  {c.worry}
                </p>
                <p className="text-sm text-charcoal/80 leading-relaxed">
                  {c.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VerticalCaseStudyPlaceholder vertical="esthetician" />

      <Features3
        eyebrow="What changes"
        headlineStart="Three moves"
        headlineAccent="that protect the routine."
        body="Not a feature list. The three plays that hold a skincare client to the plan without forcing the tone."
        capabilities={estheticianCapabilities}
      />

      <PredictiveIntelligenceVerticalExample vertical="estheticians" />

      <VerticalPricingSection
        vertical="estheticians"
        auditPhrase="skincare audit"
        sourcePage="verticals_estheticians"
      />

      <FAQ
        eyebrow="Skincare questions"
        headlineStart="The ones"
        headlineAccent="your clients would ask too."
        body="What estheticians ask before handing off their retention layer."
        faqs={estheticianFaqs}
      />

      <section className="w-full px-4 my-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/50 mb-3">
            run a different kind of studio?
          </p>
          <Link
            href="/verticals"
            className="text-sm text-wine hover:text-wine-dark underline underline-offset-4 decoration-wine/30"
          >
            See every vertical Ops by Noell is built for &rarr;
          </Link>
        </div>
      </section>

      <CTA
        eyebrow="For estheticians"
        headlineStart="Get a free audit"
        headlineAccent="of your retention layer."
        body="A 30-minute review of your plan adherence, routine rebook cadence, and membership churn signals. You walk away with a map of what is drifting."
        primaryCta={{
          label: "Book Your Free Skincare Audit",
          href: "/book",
        }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · Live on your booking tool in 14 days · No contracts"
      />
    </div>
  );
}
