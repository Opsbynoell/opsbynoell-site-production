import Link from "next/link";
import {
  IconCalendarEvent,
  IconBolt,
  IconSparkles,
  IconMessage2,
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
  path: "/verticals/med-spas",
  title: "AI Front Desk for Med Spas",
  description:
    "Warm intent cools off quietly. Ops by Noell catches med spa consult inquiries in seconds without degrading your premium positioning. Built for aesthetic and wellness practices.",
});

const medSpaStats = [
  {
    value: "72h",
    label: "Window",
    detail: "between inquiry and losing the consult",
  },
  {
    value: "3x",
    label: "Conversion",
    detail: "higher when the first reply is inside an hour",
  },
  {
    value: "<90s",
    label: "Reply",
    detail: "on consult inquiries, after-hours included",
  },
];

type Concern = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  worry: string;
  answer: string;
};

const medSpaConcerns: Concern[] = [
  {
    icon: <IconSparkles size={22} />,
    tag: "Warm intent",
    title: "Warm intent cools off quietly.",
    worry:
      "A new client finds you, reads your reviews, pictures the treatment, and messages you. Twenty minutes later she has opened two other tabs. By the next morning she has booked somewhere else and you never knew she was warm.",
    answer:
      "Noell Support replies in under ninety seconds with a message written in your brand's voice. No pushy close, no discount bait. Enough information to hold the intent until your consult coordinator can take it from there.",
  },
  {
    icon: <IconMessage2 size={22} />,
    tag: "Premium tone",
    title: "Automation that does not sound automated.",
    worry:
      "A generic chatbot tone is a tax on the brand. Clients who are spending $1,200 on a package can tell within two messages whether your practice feels curated or mass-market.",
    answer:
      "Every message is written with you during install. We hold the tone. No exclamation points, no emojis, no bait language. The system should feel like your best front-desk lead, not a discount salon.",
  },
  {
    icon: <IconCalendarEvent size={22} />,
    tag: "Consult conversion",
    title: "Consults protected, not pushed.",
    worry:
      "The gap between consult booking and consult showing is where revenue evaporates. Reminders that feel like nagging train clients to ignore them. Reminders that feel thoughtful get them in the door.",
    answer:
      "Consult reminder cadence is sized to your average booking-to-show window, by service. Pre-visit prep in the message, not a barrage. Self-serve reschedule when life happens, before the slot goes dark.",
  },
];

const medSpaCapabilities = [
  {
    icon: <IconBolt size={28} />,
    number: "01",
    title: "Instant consult reply",
    description:
      "Inquiries land on your site or DMs and get a brand-voice reply in under ninety seconds. Warm intent stays warm until your coordinator picks it up.",
    points: [
      "Under 90 second reply",
      "Written in your tone",
      "Routed to the coordinator who handles that service",
    ],
  },
  {
    icon: <IconCalendarEvent size={28} />,
    number: "02",
    title: "Consult-to-show protection",
    description:
      "Show rates hold by pairing thoughtful reminders with self-serve reschedule, so a scheduling conflict does not become a lost booking.",
    points: [
      "Reminder cadence per service",
      "Pre-visit prep notes",
      "Self-serve reschedule, quietly",
    ],
  },
  {
    icon: <IconSparkles size={28} />,
    number: "03",
    title: "Package and follow-up",
    description:
      "Post-treatment follow-up, review capture, and package-series pacing run in the background. Clients feel cared for, not marketed to.",
    points: [
      "Post-treatment check-ins",
      "Series pacing reminders",
      "Reputation capture, filtered",
    ],
  },
];

const medSpaFaqs = [
  {
    question: "Will this make my med spa sound like a chain?",
    answer:
      "The opposite. Most automation templates are written for volume businesses, so they read as volume-business automation. We write every message with you during install and hold the tone: curated, quiet, no discount bait. If it would not land on your Instagram grid, it does not go out in a message.",
  },
  {
    question:
      "What about HIPAA for messages from clients asking about injectables?",
    answer:
      "Operational messaging only. Noell Support handles inquiry intake, appointment booking, reminders, and review capture. Anything that touches a clinical or medication question routes immediately to a licensed provider or your consult coordinator. No PHI in outbound messages. BAA available if your practice requires one.",
  },
  {
    question: "How does this work with my existing booking software?",
    answer:
      "It layers on top. We read availability from your current scheduler (Boulevard, Mangomint, Vagaro, Mindbody, Square, and others) and push confirmed bookings back in. Your clinical records, pricing tiers, and package structure stay exactly where they are.",
  },
  {
    question: "Does it handle inquiries from Instagram and paid ads?",
    answer:
      "Yes. Noell Support covers the inquiries you are already paying to generate. Website chat, SMS from missed calls, and DMs from Instagram all route through the same intake flow and land in your coordinator's queue in one place.",
  },
];

const medSpaScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-charcoal/70 font-medium">
          Noell Support, Med Spa
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
        consult desk
      </span>
    </div>

    <div className="bg-white rounded-2xl p-3 mx-1 border border-warm-border/60 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-wine/70 font-medium">
            New inquiry, Botox
          </p>
          <p className="text-sm text-charcoal font-medium mt-0.5">Jasmine R.</p>
          <p className="text-[11px] text-charcoal/50">Replied in 58s</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blush text-wine">
          warm
        </span>
      </div>
      <div className="mt-2 bg-cream-dark rounded-lg p-2 text-[11px] text-charcoal/80 leading-snug">
        Hi Jasmine, thanks for reaching out. We have consult openings Thursday
        11:00 and Friday 2:30 with Dr. Mara. Which feels easier?
      </div>
    </div>

    <div className="bg-wine rounded-2xl p-3 mx-1 mt-2 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-cream/70 font-medium">
        Consult booked
      </p>
      <p className="font-serif text-2xl font-bold text-cream mt-0.5">
        Fri · 2:30 PM
      </p>
      <p className="text-[11px] text-cream/60">
        Aesthetic consult, 45 min · Dr. Mara
      </p>
    </div>
  </div>
);

export default function MedSpasVerticalPage() {
  return (
    <div>
      <JsonLd
        data={[
          servicePageSchema({
            name: "AI front desk for med spas",
            description:
              "Done-for-you AI front desk for med spas and aesthetic practices. Catches consult inquiries, holds warm intent, and protects premium positioning.",
            path: "/verticals/med-spas",
            vertical: "med spas",
          }),
          localBusinessSchema("med spas"),
          faqPageSchema(medSpaFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Verticals", path: "/verticals" },
            { name: "Med Spas", path: "/verticals/med-spas" },
          ]),
        ]}
        id="vertical-med-spas"
      />
      <Hero
        eyebrow="Ops by Noell for Med Spas"
        headlineLine1Start="Warm intent"
        headlineLine1Accent="cools off quietly."
        headlineLine2Start="So do your"
        headlineLine2Accent="consult bookings."
        body="A done-for-you AI front desk for aesthetic and wellness practices. Every inquiry gets a brand-voice reply in under ninety seconds. Your consult calendar fills without the tone shifting into hard sell."
        footnote="Built for injectables, laser, aesthetic, and wellness practices running Boulevard, Mangomint, Vagaro, Mindbody, or Square."
        primaryCta={{ label: "Get Your Free Med Spa Audit", href: "/book" }}
        secondaryCta={{ label: "See how it protects the tone", href: "#med-spa-concerns" }}
        mockScreen={medSpaScreen}
      />

      <VerticalAgentsCallout />

      <Features
        eyebrow="What med spas see"
        headlineStart="Warm stays warm"
        headlineAccent="for longer."
        body="The numbers that move when the first reply is on time and on tone."
        stats={medSpaStats}
      />

      <section id="med-spa-concerns" className="w-full py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
                med spa worries / answered
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Three things every med spa owner asks{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                before saying yes.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {medSpaConcerns.map((c, i) => (
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

      <VerticalCaseStudyPlaceholder vertical="med spa" />

      <Features3
        eyebrow="What changes"
        headlineStart="Three moves"
        headlineAccent="that hold the consult."
        body="Not a feature list. The three touchpoints that decide whether warm intent becomes a booked consult."
        capabilities={medSpaCapabilities}
      />

      <PredictiveIntelligenceVerticalExample vertical="med-spas" />

      <VerticalPricingSection
        vertical="med_spas"
        auditPhrase="spa audit"
        sourcePage="verticals_med_spas"
      />

      <FAQ
        eyebrow="Med spa questions"
        headlineStart="The questions"
        headlineAccent="your front desk gets asked."
        body="Straight answers, no sales theater."
        faqs={medSpaFaqs}
      />

      <section className="w-full px-4 my-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/50 mb-3">
            run a different kind of practice?
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
        eyebrow="For med spas"
        headlineStart="Get a free audit"
        headlineAccent="of your consult flow."
        body="A 30-minute review of your inquiry reply time, consult-to-show rate, and package follow-up cadence. You walk away with a map of what is leaking and how a Noell install would catch it."
        primaryCta={{ label: "Book Your Free Med Spa Audit", href: "/book" }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · Live on your stack in 14 days · No contracts"
        sourcePage="verticals_med_spas"
      />
    </div>
  );
}
