import type { Metadata } from "next";
import Link from "next/link";
import {
  IconSnowflake,
  IconRouter,
  IconAlarm,
  IconTool,
} from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Features3 } from "@/components/features3";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title:
    "Ops by Noell for HVAC | AI Front Desk for Residential HVAC Contractors",
  description:
    "The emergency call and the maintenance call do not belong in the same queue. Ops by Noell triages HVAC inbound by service type, dispatches the right tech in the right window, and handles the seasonal surge without turning your office into a call center.",
};

const hvacStats = [
  {
    value: "3x",
    label: "Volume",
    detail: "during a July or January heat/cold wave",
  },
  {
    value: "<90s",
    label: "Triage",
    detail: "from call in to service type classified",
  },
  {
    value: "24/7",
    label: "Emergency",
    detail: "coverage without an answering service",
  },
];

type Concern = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  worry: string;
  answer: string;
};

const hvacConcerns: Concern[] = [
  {
    icon: <IconAlarm size={22} />,
    tag: "Urgent routing",
    title: "The emergency call does not belong in the maintenance queue.",
    worry:
      "A no-heat call on a Tuesday night and a seasonal tune-up inquiry land in the same voicemail box. By morning, the urgent caller has already paid a competitor premium, and the tune-up is still sitting there waiting for a callback.",
    answer:
      "Noell Support triages by service type in the first reply: emergency no-heat or no-cool, scheduled repair, maintenance, or quote request. Emergencies route to the on-call tech in seconds. Everything else lands in the right queue with the right urgency.",
  },
  {
    icon: <IconSnowflake size={22} />,
    tag: "Seasonal surge",
    title: "July triple-volume does not care how your office is staffed.",
    worry:
      "First heat wave of the summer and the phone does not stop. Your dispatcher is drowning, the office staff is picking up calls they cannot answer, and the customers who should be priority are waiting behind tune-up requests.",
    answer:
      "During surge, Noell Support absorbs the flood. Every caller gets classified, captured, and placed in the right queue without waiting on hold. Emergencies surface to the top of the dispatcher's board. Maintenance bookings fill the back half of next week, not today.",
  },
  {
    icon: <IconTool size={22} />,
    tag: "Service-type triage",
    title: "Install, emergency, and maintenance are three different businesses.",
    worry:
      "Your install pipeline, your emergency service work, and your maintenance plan renewals all have different margins, different lead times, and different customer expectations. Treating them identically at intake leaks money on every side.",
    answer:
      "The intake flow asks the right question for each service type: system age for installs, symptom and timing for emergency, plan status for maintenance. The call lands in the right hands with the context the tech needs, not a generic ticket.",
  },
];

const hvacCapabilities = [
  {
    icon: <IconAlarm size={28} />,
    number: "01",
    title: "Emergency routing, seconds not hours",
    description:
      "No-heat, no-cool, and active-leak calls are classified in the first reply and sent straight to the on-call tech with the address, symptom, and contact.",
    points: [
      "Symptom and urgency captured",
      "Routed to on-call tech",
      "Customer stays informed in real time",
    ],
  },
  {
    icon: <IconRouter size={28} />,
    number: "02",
    title: "Service-type intake",
    description:
      "Install quotes, service calls, and maintenance renewals each have their own intake path. The right information gets captured up front so nothing bounces back to the office.",
    points: [
      "Separate flow per service type",
      "Required info captured before dispatch",
      "Handoff with full context",
    ],
  },
  {
    icon: <IconTool size={28} />,
    number: "03",
    title: "Maintenance retention",
    description:
      "Annual and biannual maintenance clients get renewal reminders on the right cadence, with self-serve scheduling when the HVAC season window opens.",
    points: [
      "Spring and fall renewal reminders",
      "Self-serve booking inside the window",
      "Route to preferred tech when possible",
    ],
  },
];

const hvacFaqs = [
  {
    question: "Does this replace our dispatcher?",
    answer:
      "No. The Noell system handles intake, classification, and first-response routing. Your dispatcher keeps dispatching. What changes is that they are not also the receptionist. They see the pre-classified board instead of a queue of mixed calls.",
  },
  {
    question: "What about after-hours emergency calls?",
    answer:
      "Noell Support covers after-hours. A no-heat call at 11pm gets classified as emergency, routed to your on-call tech with the address and symptom, and the customer gets a confirmation that someone is on the way. The answering-service gap closes.",
  },
  {
    question: "Does it work with ServiceTitan, Housecall Pro, or FieldEdge?",
    answer:
      "Yes. We layer on top of the FSM platforms residential HVAC contractors actually use: ServiceTitan, Housecall Pro, FieldEdge, Jobber, and similar. Your dispatch board and tech records stay where they are. We handle the communication and classification layer on top.",
  },
  {
    question: "How does it handle seasonal surge?",
    answer:
      "Surge is the whole point. During a heat wave or cold snap, inbound volume can triple overnight. The Noell system absorbs that volume without putting anyone on hold. Every caller gets a real reply in under ninety seconds, classified correctly, and placed in the right queue.",
  },
];

const hvacScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-charcoal/70 font-medium">
          Noell Front Desk, HVAC
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
        triage
      </span>
    </div>

    <div className="bg-white rounded-2xl p-3 mx-1 border border-warm-border/60 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-wine/70 font-medium">
            Emergency, no cool
          </p>
          <p className="text-sm text-charcoal font-medium mt-0.5">
            Parker residence
          </p>
          <p className="text-[11px] text-charcoal/50">
            Routed to Diego, on-call
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-wine text-cream">
          priority
        </span>
      </div>
      <div className="mt-2 bg-cream-dark rounded-lg p-2 text-[11px] text-charcoal/80 leading-snug">
        Got it, your AC went out around 2pm today. Diego is on call and can be
        there by 4:30. Address confirmed, ETA en route.
      </div>
    </div>

    <div className="bg-cream-dark rounded-2xl p-3 mx-1 mt-2 shadow-sm border border-warm-border">
      <p className="text-[10px] uppercase tracking-widest text-charcoal/60 font-medium">
        Maintenance renewal, scheduled
      </p>
      <p className="font-serif text-lg font-semibold text-charcoal mt-0.5">
        Tues · 9:00 AM
      </p>
      <p className="text-[11px] text-charcoal/50">
        Fall tune-up, plan client, Tech: Marcus
      </p>
    </div>
  </div>
);

export default function HvacVerticalPage() {
  return (
    <div>
      <Hero
        eyebrow="Ops by Noell for HVAC"
        headlineLine1Start="The emergency call"
        headlineLine1Accent="and the maintenance call"
        headlineLine2Start="do not belong"
        headlineLine2Accent="in the same queue."
        body="A done-for-you AI front desk for residential HVAC contractors. Every inbound call triaged by service type, emergency routing to the on-call tech in seconds, and seasonal surge absorbed without putting callers on hold."
        footnote="Built for residential HVAC contractors running ServiceTitan, Housecall Pro, FieldEdge, or Jobber."
        primaryCta={{ label: "Get Your Free HVAC Audit", href: "/book" }}
        secondaryCta={{
          label: "See how it triages the call",
          href: "#hvac-concerns",
        }}
        mockScreen={hvacScreen}
      />

      <Features
        eyebrow="What HVAC contractors see"
        headlineStart="Every call triaged."
        headlineAccent="Nothing on hold."
        body="Three numbers from residential HVAC installs, including the seasonal surge that breaks most office setups."
        stats={hvacStats}
      />

      <section id="hvac-concerns" className="w-full py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
                hvac intake / answered
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Three things every HVAC owner already knows{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                is broken on intake.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {hvacConcerns.map((c, i) => (
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

      <Features3
        eyebrow="What changes"
        headlineStart="Three moves"
        headlineAccent="that triage the inbound."
        body="Not a feature list. The three plays that keep emergency, service, and maintenance in the right queues."
        capabilities={hvacCapabilities}
      />

      <FAQ
        eyebrow="HVAC questions"
        headlineStart="The ones"
        headlineAccent="your office manager will ask."
        body="Real answers. Nothing dressed up."
        faqs={hvacFaqs}
      />

      <section className="w-full px-4 my-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/50 mb-3">
            run a different kind of trade?
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
        eyebrow="For HVAC contractors"
        headlineStart="Get a free audit"
        headlineAccent="of your intake flow."
        body="A 30-minute review of your emergency routing, service-type triage, and seasonal surge handling. You walk away with a map of what is slipping, whether you work with us or not."
        primaryCta={{ label: "Book Your Free HVAC Audit", href: "/book" }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · Live on your FSM in 14 days · No contracts"
      />
    </div>
  );
}
