import {
  IconPhoneCall,
  IconCalendarEvent,
  IconCircleCheck,
  IconBellRinging,
  IconCalendarTime,
  IconStar,
  IconRefresh,
} from "@tabler/icons-react";
import Link from "next/link";
import { AdHero } from "@/components/ad-hero";
import { Features3 } from "@/components/features3";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, servicePageSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/noell-front-desk",
  title: "Noell Front Desk — Operations Layer",
  description:
    "Noell Front Desk is the operations layer of the Noell system. Calls, scheduling, confirmations, reminders, reschedules, review capture, and reactivation. Everything a receptionist handles, managed for you.",
});

const frontDeskCapabilities = [
  {
    icon: <IconPhoneCall size={22} />,
    title: "Calls",
    description:
      "Missed-call recovery, call routing, and post-call follow-up. Every phone touchpoint is handled in seconds, not hours.",
  },
  {
    icon: <IconCalendarEvent size={22} />,
    title: "Scheduling",
    description:
      "Smart booking logic across your services, providers, and hours. Prospects book themselves into the right slot without thinking.",
  },
  {
    icon: <IconCircleCheck size={22} />,
    title: "Confirmations",
    description:
      "Instant booking confirmations on the right channel (SMS, email, or both) so clients know it's locked in.",
  },
  {
    icon: <IconBellRinging size={22} />,
    title: "Reminders",
    description:
      "Automated reminder cadence sized to your vertical. The gentle nudge that keeps no-shows from happening in the first place.",
  },
  {
    icon: <IconCalendarTime size={22} />,
    title: "Reschedules",
    description:
      "When a client needs to move, they can, without a phone call. The system protects your calendar and keeps the appointment alive.",
  },
  {
    icon: <IconStar size={22} />,
    title: "Review capture",
    description:
      "Post-visit review requests with filter routing, so the happy clients land on Google and the unhappy ones reach you first.",
  },
  {
    icon: <IconRefresh size={22} />,
    title: "Reactivation",
    description:
      "Dormant clients get a warm, on-brand invitation to come back. Your existing list is a pipeline, not an archive.",
  },
];

const frontDeskFaqs = [
  {
    question: "Is this month-to-month or contract?",
    answer:
      "Month-to-month. No long-term contracts. Cancel anytime with 30 days notice.",
  },
  {
    question: "Why a setup fee?",
    answer:
      "The setup fee covers installation, copy calibration for your voice, system integration, and two rounds of tuning before go-live. It's one-time, disclosed up front, and included in the audit conversation.",
  },
  {
    question: "Do prices increase over time?",
    answer:
      "Existing clients are grandfathered into their signup price. Any future pricing changes only apply to new accounts.",
  },
  {
    question: "Is Noell Front Desk replacing my receptionist?",
    answer:
      "Noell Front Desk handles the operational workload a receptionist runs: calls, scheduling, confirmations, reminders, reschedules, review capture, and reactivation. It does not replace the human relationship. Most practices pair it with a lightly-loaded human who only handles the edge cases.",
  },
  {
    question: "How does this work with Noell Support?",
    answer:
      "Noell Support is the entry layer for new prospects. Noell Front Desk is the operations layer for everything after that. They share the same Noell system, so a prospect caught by Noell Support hands off cleanly into scheduling, reminders, and the rest of the lifecycle.",
  },
  {
    question: "Does it integrate with my current booking tool?",
    answer:
      "Yes. We layer the Noell system on top of the major scheduling and practice management platforms and extend them with smart booking logic, reminders, reschedules, review capture, and reactivation.",
  },
  {
    question: "What does \"managed\" actually mean?",
    answer:
      "We monitor the automations weekly, tune the copy and cadence, handle escalations, and give you a simple monthly report. You don't touch the dashboard unless you want to.",
  },
  {
    question: "How long until it's live?",
    answer:
      "Most practices are fully live within 14 days of signing. Install is handled by us, you do not configure the system yourself. We migrate existing contacts, write the copy, and train the workflows in your voice.",
  },
];

const frontDeskScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-charcoal/70 font-medium">
          Noell Front Desk · Live
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-charcoal/70">
        today
      </span>
    </div>

    {/* Confirmation */}
    <div className="bg-white rounded-2xl p-3 mx-1 border border-warm-border/60 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-wine/85 font-medium">
        Booking confirmed
      </p>
      <p className="text-sm text-charcoal font-medium mt-0.5">
        Saturday · 2:00 PM
      </p>
      <p className="text-[11px] text-charcoal/70">Deep tissue · 60 min</p>
    </div>

    {/* Reminder */}
    <div className="bg-cream-dark rounded-2xl p-3 mx-1 mt-2 border border-warm-border/60 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-wine/85 font-medium">
        Reminder sent
      </p>
      <p className="text-[11px] text-charcoal/80 mt-1 leading-snug">
        &ldquo;Looking forward to seeing you tomorrow at 2pm. Reply R to
        reschedule.&rdquo;
      </p>
    </div>

    {/* Review capture */}
    <div className="bg-wine rounded-2xl p-3 mx-1 mt-2 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-cream/70 font-medium">
        Review captured
      </p>
      <p className="font-serif text-2xl font-bold text-cream mt-0.5">+1 ★★★★★</p>
      <p className="text-[11px] text-cream/60">routed to Google · 6 today</p>
    </div>
  </div>
);

export default function NoellFrontDeskPage() {
  return (
    <div>
      <JsonLd
        data={[
          servicePageSchema({
            name: "Noell Front Desk — Operations Layer",
            description:
              "Operations layer of the Noell system: calls, scheduling, confirmations, reminders, reschedules, review capture, and reactivation.",
            path: "/noell-front-desk",
            serviceType: "Managed AI front desk",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Noell Front Desk", path: "/noell-front-desk" },
          ]),
        ]}
        id="noell-front-desk"
      />
      <AdHero
        page="frontDesk"
        variant="wine"
        defaultEyebrow="Noell Front Desk · Operations layer"
        defaultHeadlineLine1Start="The operations"
        defaultHeadlineLine1Accent="layer."
        defaultHeadlineLine2Start="Everything a"
        defaultHeadlineLine2Accent="receptionist handles."
        defaultBody="Noell Front Desk runs the operational workload of your business: calls, scheduling, confirmations, reminders, reschedules, review capture, and reactivation. The Noell system, doing the quiet work."
        primaryCta={{ label: "Get Your Free Audit", href: "/book" }}
        secondaryCta={{ label: "See the capabilities", href: "#capabilities" }}
        mockScreen={frontDeskScreen}
        priceSignal={
          <>
            Starts at $197/mo.{" "}
            <Link href="/pricing" className="underline underline-offset-4 decoration-charcoal/55 hover:text-charcoal">
              See all tiers.
            </Link>
          </>
        }
        sourcePage="front-desk"
      />

      {/* 7 capabilities */}
      <section id="capabilities" className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              What Noell Front Desk runs
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Seven operational touchpoints,{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                handled end to end.
              </span>
            </h2>
            <p className="mt-5 text-charcoal/70 max-w-xl mx-auto">
              Everything a receptionist handles, running quietly in the
              background, covered by the Noell system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {frontDeskCapabilities.map((cap, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[17px] border border-warm-border bg-white p-6",
                  "shadow-[0px_15px_15px_0px_rgba(28,25,23,0.04),0px_4px_8px_0px_rgba(28,25,23,0.04)]"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-wine/10 text-wine flex items-center justify-center">
                    {cap.icon}
                  </div>
                  <span className="text-[10px] font-mono text-charcoal/70">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-charcoal mb-1.5">
                  {cap.title}
                </h3>
                <p className="text-sm text-charcoal/70 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it fits with the rest of the Noell system */}
      <Features3
        accent="wine"
        eyebrow="How it layers in"
        headlineStart="The operations layer of"
        headlineAccent="the Noell system."
        body="Noell Front Desk sits between Noell Support and Noell Care, covering everything a receptionist handles."
        capabilities={[
          {
            icon: <IconPhoneCall size={28} />,
            number: "01",
            title: "Catch the call, catch the client",
            description:
              "Missed-call recovery texts, smart routing, and human handoff keep every call from becoming lost revenue.",
            points: [
              "Missed-call text-back",
              "Call routing by service",
              "Escalation with context",
            ],
          },
          {
            icon: <IconCalendarEvent size={28} />,
            number: "02",
            title: "Scheduling that doesn't drop the ball",
            description:
              "Smart booking logic, confirmations, reminders, and reschedules keep your calendar full without anyone babysitting it.",
            points: [
              "Smart booking logic",
              "Automatic confirmations",
              "Reminder cadence",
              "Self-serve reschedules",
            ],
          },
          {
            icon: <IconStar size={28} />,
            number: "03",
            title: "Reviews and reactivation on autopilot",
            description:
              "After the visit, the system captures the review and keeps dormant clients engaged, so your pipeline doesn't go quiet.",
            points: [
              "Review capture + routing",
              "Reactivation workflows",
              "Managed + monitored by us",
            ],
          },
        ]}
      />

      <FAQ
        eyebrow="Front Desk questions"
        headlineStart="Straight"
        headlineAccent="answers."
        body="What people ask before they hand over the operations layer."
        faqs={frontDeskFaqs}
      />

      <CTA
        eyebrow="The first step"
        headlineStart="See exactly where"
        headlineAccent="leads are falling through."
        body="No pitch. No pressure. A 30-minute audit that gives you a clear map of what's leaking, whether you work with us or not."
        trustLine="Free 30-minute audit · No contracts required · Live in 14 days"
      />
    </div>
  );
}
