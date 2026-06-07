import Link from "next/link";
import {
  IconSearch,
  IconFileText,
  IconTool,
  IconRefresh,
  IconBolt,
  IconPhoneCall,
  IconHeartHandshake,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { FAQ, type FaqItem } from "@/components/faq";
import CTA from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, servicePageSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  path: "/how-it-works",
  title: "How It Works: From Audit to Live in 14 Days",
  description:
    "A simple four-step process: free Revenue Signal Report, strategic brief, system build, and ongoing operations. Done for you, live in 14 days.",
  ogTitle: "From a 30-minute call to a live front desk in 14 days.",
  ogDescription:
    "We audit your front desk, build the system around the tools you already use, and run it for you. No setup on your end. Live in 14 days.",
});

// ─── Data ────────────────────────────────────────────────────────────────────

type ProcessStep = {
  number: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  body: string;
  detail: string;
};

const processSteps: ProcessStep[] = [
  {
    number: "01",
    icon: <IconSearch size={22} />,
    eyebrow: "Day 0",
    title: "Revenue Signal Report",
    body: "A free 30-minute working session. We audit your current front desk, identify where leads and revenue are slipping out, and tell you exactly what we found.",
    detail: "No pitch. No deck. You leave with a clear map of what is leaking, what it may be worth, and whether Ops by Noell is the right fit. If it is not, we will say so.",
  },
  {
    number: "02",
    icon: <IconFileText size={22} />,
    eyebrow: "Days 1 to 3",
    title: "Strategic Brief",
    body: "We deliver a written brief that maps every finding to a business outcome. You know what is broken, what it is costing you, and what the fix looks like before any work begins.",
    detail: "The brief covers your booking flow, missed-call rate, follow-up gaps, and client retention patterns. You approve the scope before we build anything.",
  },
  {
    number: "03",
    icon: <IconTool size={22} />,
    eyebrow: "Days 4 to 14",
    title: "System Build",
    body: "We build and install the system around the tools you already use. Copy written in your voice, integrations wired, agents trained. You approve before anything goes live.",
    detail: "We handle the full install: SMS registration, booking integration, agent training, and two rounds of tuning. You do not configure anything yourself.",
  },
  {
    number: "04",
    icon: <IconRefresh size={22} />,
    eyebrow: "Day 14 onward",
    title: "Ongoing Operations",
    body: "We run it. Monthly reporting, ongoing tuning, and account management handled by our team. You stay focused on the client in front of you.",
    detail: "Weekly monitoring, monthly check-in calls, and quarterly audits are included in every tier. The system improves over time as we tune it to your business.",
  },
];

type AgentCard = {
  eyebrow: string;
  handle: string;
  title: string;
  body: string;
  status: string;
  bullets: string[];
  href: string;
  icon: React.ReactNode;
};

const agents: AgentCard[] = [
  {
    eyebrow: "New prospect intake",
    handle: "@noell_support",
    title: "Noell Support",
    body: "Website chat, lead qualification, contact capture, and triage to booking or your team. Responds to every inquiry the moment it comes in, 24 hours a day.",
    status: "Online / 24/7",
    bullets: [
      "24/7 website chat with instant response",
      "Lead qualification and contact capture",
      "Routing to booking or your team",
      "Trained on your services, pricing, and voice",
    ],
    href: "/noell-support",
    icon: <IconBolt size={20} />,
  },
  {
    eyebrow: "Operations layer",
    handle: "@noell_frontdesk",
    title: "Noell Front Desk",
    body: "Calls, scheduling, reminders, confirmations, reschedules, review capture, and reactivation. Missed call? A recovery text goes out within 5 minutes.",
    status: "Online / runs during hours",
    bullets: [
      "Inbound call answering and booking",
      "Appointment confirmations and reminders",
      "Missed-call recovery via SMS within 5 minutes",
      "Works with your existing booking system",
    ],
    href: "/noell-front-desk",
    icon: <IconPhoneCall size={20} />,
  },
  {
    eyebrow: "Existing client support",
    handle: "@noell_care",
    title: "Noell Care",
    body: "Rebooking, service questions, and account help for clients already in your system. Monitors your client book for gaps and sends proactive reactivation before they book elsewhere.",
    status: "Online / existing clients",
    bullets: [
      "Proactive outreach to lapsed clients",
      "Rebooking requests and scheduling",
      "Service and account questions handled",
      "Review capture after every visit",
    ],
    href: "/noell-care",
    icon: <IconHeartHandshake size={20} />,
  },
];

const differentiators = [
  {
    title: "Done for you. Not done with you.",
    body: "Most software hands you a login and a help doc. We build the system, write the copy in your voice, wire the integrations, and run it. You do not touch the dashboard unless you want to.",
  },
  {
    title: "Built around the tools you already use.",
    body: "We do not ask you to switch booking systems, replace your CRM, or migrate your contacts. The Noell system layers on top of what you already run and makes it work better.",
  },
  {
    title: "Live in 14 days. Not 14 weeks.",
    body: "From the day you sign, the system is fully installed and running within two weeks. Most businesses see their first recovered lead before the end of the first month.",
  },
];

const faqs: FaqItem[] = [
  {
    question: "Do I need to do anything to set it up?",
    answer:
      "No. We handle the full install: SMS registration, booking integration, agent training, and two rounds of tuning before go-live. You approve the setup before anything goes live, but you do not configure it yourself.",
  },
  {
    question: "Do I need to replace my current booking software?",
    answer:
      "No. We integrate with the major scheduling and practice management platforms. The Noell system layers on top with missed-call recovery, reminders, and reactivation. Nothing gets replaced.",
  },
  {
    question: "What happens on the Revenue Signal Report call?",
    answer:
      "It is a 30-minute working session, not a sales call. We audit your current front desk, identify where leads and revenue are slipping out, and tell you exactly what we found. You leave with a clear map of what is leaking and what it may be worth, whether you work with us or not.",
  },
  {
    question: "How long does the build take?",
    answer:
      "Most businesses are fully live within 14 days of signing. The install is handled by our team. We migrate existing contacts, write the copy in your voice, and train the workflows before go-live.",
  },
  {
    question: "What does ongoing operations actually mean?",
    answer:
      "We monitor the automations weekly, tune the copy and cadence, handle escalations, and deliver a simple monthly report. You do not manage the system day to day. That is our job.",
  },
  {
    question: "Is there a contract?",
    answer:
      "Month-to-month. No long-term contracts. Cancel anytime with 30 days notice.",
  },
];

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  const jsonLd = [
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "How It Works", path: "/how-it-works" },
    ]),
    servicePageSchema({
      name: "How the Noell System Works",
      description:
        "A four-step process: free Revenue Signal Report, strategic brief, system build, and ongoing operations. Done for you, live in 14 days.",
      path: "/how-it-works",
    }),
    faqPageSchema(
      faqs.map((f) => ({ question: f.question, answer: f.answer }))
    ),
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <JsonLd data={jsonLd} />

      {/* HERO */}
      <Hero
        eyebrow="A systems agency · Ops by Noell"
        headlineLine1Start="From a 30-minute call to"
        headlineLine1Accent="a live front desk"
        headlineLine2Start="in"
        headlineLine2Accent="14 days."
        body="We audit your front desk, build the system around the tools you already use, and run it for you. No setup on your end. No software to learn."
        footnote="Done for you. Live in 14 days. Managed by our team."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See the agents", href: "#agents" }}
        showProofBar
        sourcePage="how_it_works"
        sourceSection="hero"
      />

      {/* PROCESS STEPS */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine mb-4">
              audit &rarr; brief &rarr; build &rarr; run
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              Four steps.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                One managed system.
              </span>
            </h2>
            <p className="mt-4 text-cream/70 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              We do not send proposals. We run working sessions. Here is exactly what happens from the first call to go-live.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className={cn(
                  "relative rounded-[22px] border border-white/10 bg-[#271520]",
                  "p-7 md:p-8",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-wine/10 text-wine flex items-center justify-center flex-shrink-0">
                      {step.icon}
                    </div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-wine/80">
                      {step.eyebrow}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-cream/40">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-cream mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-cream/80 leading-relaxed mb-3">
                  {step.body}
                </p>
                <p className="text-sm text-cream/55 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENTS */}
      <section
        id="agents"
        className="w-full max-w-7xl mx-auto rounded-3xl bg-charcoal px-6 py-20 md:py-24 my-10 md:my-16"
      >
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-blush mb-4">
            The Noell System / Agent Roster
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
            Three agents.{" "}
            <span className="italic text-wine-light">
              One system. Zero setup on your end.
            </span>
          </h2>
          <p className="mt-4 text-cream/70 text-base max-w-xl mx-auto leading-relaxed">
            Your leads get qualified instantly. Your phone gets answered. Your clients get taken care of. All running in the background while you work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {agents.map((agent) => (
            <Link
              key={agent.handle}
              href={agent.href}
              className="group relative flex flex-col rounded-[22px] border border-white/10 bg-[#271520] p-7 md:p-8 hover:border-wine/40 transition-all duration-300 shadow-[0px_4px_8px_0px_rgba(28,25,23,0.05),0px_15px_15px_0px_rgba(28,25,23,0.04)]"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-wine/10 text-wine flex items-center justify-center flex-shrink-0">
                  {agent.icon}
                </div>
                <div>
                  <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-wine/80">
                    {agent.eyebrow}
                  </p>
                  <p className="text-[10px] font-mono text-cream/40 mt-0.5">
                    {agent.handle}
                  </p>
                </div>
              </div>

              <h3 className="font-serif text-xl md:text-2xl font-semibold text-cream mb-3 leading-snug">
                {agent.title}
              </h3>
              <p className="text-sm text-cream/75 leading-relaxed mb-5 flex-1">
                {agent.body}
              </p>

              <ul className="space-y-2 mb-6">
                {agent.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2 text-sm text-cream/70">
                    <IconCheck size={14} className="text-wine mt-0.5 flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 inline-block" />
                  {agent.status}
                </span>
                <span className="flex items-center gap-1 text-wine text-sm font-medium group-hover:gap-2 transition-all">
                  Learn more <IconArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY WE'RE DIFFERENT */}
      <section className="w-full px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              The difference
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              Not software.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                A managed system.
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className="rounded-[22px] border border-white/10 bg-[#271520] p-7 md:p-8"
              >
                <h3 className="font-serif text-lg md:text-xl font-semibold text-cream mb-3 leading-snug">
                  {d.title}
                </h3>
                <p className="text-sm md:text-base text-cream/75 leading-relaxed">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF PULL-QUOTE */}
      <section className="w-full px-4 py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[22px] border border-wine/30 bg-[#271520] px-8 py-10 md:px-12 md:py-12 text-center">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine mb-6">
              Currently running
            </p>
            <blockquote className="font-serif text-xl md:text-2xl text-cream leading-relaxed italic mb-6 max-w-2xl mx-auto">
              &ldquo;I used to dread Mondays because there would always be gaps I did not expect. Now I open my calendar and it is just full. The reminders go out and people show up. I do not think about it anymore.&rdquo;
            </blockquote>
            <p className="text-sm text-cream/60 uppercase tracking-[0.18em]">
              Santa E. &middot; Licensed Massage Therapist &middot; Laguna Niguel, CA
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-8">
              {[
                { value: "4", label: "Missed calls recovered" },
                { value: "$960", label: "Recovered in 14 days" },
                { value: "75%", label: "Fewer no-shows" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-serif text-3xl md:text-4xl font-semibold text-cream">
                    {stat.value}
                  </p>
                  <p className="text-xs text-cream/55 uppercase tracking-[0.18em] mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Link
                href="/case-studies/santa-e"
                className="text-sm text-wine hover:text-wine-light underline underline-offset-4 decoration-wine/40 transition-colors"
              >
                Read the full case study &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        eyebrow="Questions"
        headlineStart="Common questions"
        headlineAccent="before you start."
        body="Real questions from service business owners before they request a Revenue Signal Report."
        faqs={faqs}
      />

      {/* CLOSING CTA */}
      <CTA
        eyebrow="The first step"
        headlineStart="See how it works for"
        headlineAccent="your business."
        body="A free 30-minute Revenue Signal Report gives you a clear map of what is leaking, what it may be worth, and which Ops by Noell track fits. Whether you work with us or not."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See pricing", href: "/pricing" }}
        trustLine="Free audit · Done-for-you setup · Live in 14 days · No contracts"
        sourcePage="how_it_works"
      />
    </div>
  );
}
