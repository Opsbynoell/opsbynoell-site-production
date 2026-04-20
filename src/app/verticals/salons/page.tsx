import type { Metadata } from "next";
import Link from "next/link";
import {
  IconScissors,
  IconCalendarRepeat,
  IconUsers,
  IconArmchair2,
} from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Features3 } from "@/components/features3";
import { VerticalCaseStudyPlaceholder } from "@/components/vertical-case-study";
import { localBusinessSchema } from "@/lib/schema";
import { FAQ } from "@/components/faq";
import { VerticalPricingSection } from "@/components/pricing";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ops by Noell for Salons | AI Front Desk for Hair and Color Salons",
  description:
    "Every chair is a P&L. Ops by Noell protects rebook rate, catches missed calls before they walk next door, and keeps chair utilization climbing without adding front desk work.",
};

const salonStats = [
  {
    value: "68%",
    label: "Rebook",
    detail: "is the industry median, top chairs run 85%+",
  },
  {
    value: "$220",
    label: "Per chair",
    detail: "lost every missed call at an average ticket",
  },
  {
    value: "12m",
    label: "Window",
    detail: "before a caller tries the salon down the block",
  },
];

type Concern = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  worry: string;
  answer: string;
};

const salonConcerns: Concern[] = [
  {
    icon: <IconArmchair2 size={22} />,
    tag: "Chair utilization",
    title: "Every chair is its own P&L.",
    worry:
      "Open slots on a senior stylist's column cost four times what they cost on a junior's. But by Thursday afternoon, the front desk is already triaging the week and the high-ticket columns stay the ones bleeding revenue.",
    answer:
      "The Noell system reads availability by stylist and by service, then routes inbound inquiries and rebook nudges to the columns that need filling most. The front desk stops gambling with the schedule.",
  },
  {
    icon: <IconCalendarRepeat size={22} />,
    tag: "Rebook mechanics",
    title: "Rebook rate is retention. Not follow-up.",
    worry:
      "The rebook conversation at the chair is the single highest-leverage moment in a salon visit and the one most commonly dropped. A missed rebook turns a client into someone you have to win back on marketing spend.",
    answer:
      "Every service type has a rebook window baked into the system: six weeks for color, four for haircuts, custom for extensions and treatments. The reminder lands at the exact moment the client is thinking about their roots, not two days after she already rebooked somewhere else.",
  },
  {
    icon: <IconUsers size={22} />,
    tag: "Per-stylist revenue",
    title: "Stylists are revenue centers. Treat them like it.",
    worry:
      "A great stylist fills her column on word of mouth alone and leaves when she feels the salon is not protecting her pipeline. Fair rebooking, fair call routing, and consistent review capture are how a column stays loyal to the chair.",
    answer:
      "Call routing, review requests, and rebook nudges are split per stylist, so every column gets its fair share of the inbound flow. Reports are per-stylist, so you can see exactly who is growing and who needs support.",
  },
];

const salonCapabilities = [
  {
    icon: <IconScissors size={28} />,
    number: "01",
    title: "Missed-call recovery, by chair",
    description:
      "When a call goes unanswered, Noell Front Desk texts back within seconds with that stylist's next availability, not a generic slot.",
    points: [
      "Stylist-aware availability",
      "Service type captured",
      "Booking lands on the right column",
    ],
  },
  {
    icon: <IconCalendarRepeat size={28} />,
    number: "02",
    title: "Rebook cadence per service",
    description:
      "Every service has its own rebook window. Color is not haircut. Extensions are not treatments. The system books the nudge at the right moment for each.",
    points: [
      "Service-specific rebook windows",
      "Personal tone per client",
      "Self-serve reschedule",
    ],
  },
  {
    icon: <IconUsers size={28} />,
    number: "03",
    title: "Per-stylist reputation",
    description:
      "Post-visit reviews captured per stylist, with filtering so the unhappy ones reach the owner first, not Google.",
    points: [
      "Review capture by column",
      "Filter and route",
      "Monthly per-stylist report",
    ],
  },
];

const salonFaqs = [
  {
    question: "Does this work with Vagaro, Boulevard, or Square Appointments?",
    answer:
      "Yes. The Noell system layers on top of the major salon booking platforms (Vagaro, Boulevard, Square, Mindbody, GlossGenius, and Fresha). Your staff keep using the software they already know. We handle the communication and reminder layer on top.",
  },
  {
    question: "Can each stylist have their own tone in messages?",
    answer:
      "Yes. During install, we can set per-stylist message tone for rebook nudges and review requests. A senior colorist with a boutique clientele does not sound like the new cutting-line hire, and the system respects that.",
  },
  {
    question: "How does this handle walk-ins?",
    answer:
      "Walk-ins are a different flow. The Noell system manages the inbound digital flow: missed calls, website chat, SMS, DMs. Your front desk keeps handling walk-ins the way they already do, with the system quietly working behind them on everything else.",
  },
  {
    question: "Will my clients feel over-messaged?",
    answer:
      "That is the single most common install question and the one we spend the most time tuning. Each client gets one touchpoint per visit cycle: a gentle rebook reminder at the service-specific window, a post-visit review ask, and nothing else unless the client has asked to hear from the salon directly.",
  },
];

const salonScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-charcoal/70 font-medium">
          Noell Front Desk, Salon
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
        by column
      </span>
    </div>

    <div className="bg-white rounded-2xl p-3 mx-1 border border-warm-border/60 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-wine/70 font-medium">
            Rebook nudge, color
          </p>
          <p className="text-sm text-charcoal font-medium mt-0.5">
            Ashley P. · Stylist: Mara
          </p>
          <p className="text-[11px] text-charcoal/50">6-week window, auto</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blush text-wine">
          booked
        </span>
      </div>
      <div className="mt-2 bg-cream-dark rounded-lg p-2 text-[11px] text-charcoal/80 leading-snug">
        Hi Ashley, Mara has openings Thursday 11:00 and Saturday 2:00 for your
        color refresh. Want me to hold one?
      </div>
    </div>

    <div className="bg-wine rounded-2xl p-3 mx-1 mt-2 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-cream/70 font-medium">
        Rebook rate, this month
      </p>
      <p className="font-serif text-3xl font-bold text-cream mt-0.5">81%</p>
      <p className="text-[11px] text-cream/60">up from 64 percent pre-install</p>
    </div>
  </div>
);

export default function SalonsVerticalPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema("salons")),
        }}
      />
      <Hero
        eyebrow="Ops by Noell for Salons"
        headlineLine1Start="Every chair"
        headlineLine1Accent="is a P&L."
        headlineLine2Start="Missed calls"
        headlineLine2Accent="close it early."
        body="A done-for-you AI front desk for hair and color salons. Rebook rate protected by column, missed calls routed to the right stylist, and chair utilization climbing without adding a front-desk hire."
        footnote="Built for full-service salons, color-specialist studios, and multi-stylist shops running Vagaro, Boulevard, Square, Mindbody, GlossGenius, or Fresha."
        primaryCta={{ label: "Get Your Free Salon Audit", href: "/book" }}
        secondaryCta={{
          label: "See how it protects rebook rate",
          href: "#salon-concerns",
        }}
        mockScreen={salonScreen}
      />

      <Features
        eyebrow="What salons see"
        headlineStart="Rebook rate climbs."
        headlineAccent="Empty columns fill."
        body="The three numbers that move when rebook cadence and missed-call flow run without the front desk babysitting them."
        stats={salonStats}
      />

      <section id="salon-concerns" className="w-full py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
                salon operations / answered
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Three things every salon owner is trying{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                to protect.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {salonConcerns.map((c, i) => (
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

      <VerticalCaseStudyPlaceholder vertical="salon" />

      <Features3
        eyebrow="What changes"
        headlineStart="Three moves"
        headlineAccent="that fill the chair."
        body="Not a feature list. The three plays that protect rebook rate and chair utilization."
        capabilities={salonCapabilities}
      />

      <VerticalPricingSection
        vertical="salons"
        auditPhrase="salon audit"
        sourcePage="verticals_salons"
      />

      <FAQ
        eyebrow="Salon questions"
        headlineStart="The ones"
        headlineAccent="your front desk gets asked."
        body="Real answers, nothing dressed up."
        faqs={salonFaqs}
      />

      <section className="w-full px-4 my-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/50 mb-3">
            run a different kind of shop?
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
        eyebrow="For salons"
        headlineStart="Get a free audit"
        headlineAccent="of your rebook flow."
        body="A 30-minute review of your rebook rate by service, missed-call recovery, and per-stylist communication split. You walk away with a map of what is leaking."
        primaryCta={{ label: "Book Your Free Salon Audit", href: "/book" }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · Live on your booking tool in 14 days · No contracts"
      />
    </div>
  );
}
