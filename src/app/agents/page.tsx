import Link from "next/link";
import {
  IconBolt,
  IconPhoneCall,
  IconHeartHandshake,
  IconCheck,
  IconMinus,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { FAQ, type FaqItem } from "@/components/faq";
import { AgentsPageAnalytics } from "@/components/agents-page-analytics";
import { BookingCalendarEmbed } from "@/components/booking-calendar-embed";

import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  servicePageSchema,
} from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/agents",
  title: "Noell Agents, AI Operations for Service Businesses",
  description:
    "Three managed AI agents covering website chat, inbound calls, and existing client care. Done for you, live in 14 days.",
  ogTitle: "Noell Agents, AI Operations for Service Businesses",
  ogDescription:
    "Three managed AI agents covering website chat, calls and scheduling, and existing-client support. Works alongside any booking tool.",
  imageAlt:
    "Noell Agents. Three AI agents for service businesses.",
});

type Agent = {
  title: string;
  eyebrow: string;
  description: string;
  status: string;
  icon: React.ReactNode;
};

const agents: Agent[] = [
  {
    title: "Noell Support",
    eyebrow: "24/7 website chat",
    description: "Website chat + lead qualification, around the clock.",
    status: "status: online / 24/7",
    icon: <IconBolt size={22} />,
  },
  {
    title: "Noell Front Desk",
    eyebrow: "Calls + scheduling",
    description:
      "Answers calls, schedules, confirms, and sends reminders. Nothing gets missed.",
    status: "status: online / runs on your hours",
    icon: <IconPhoneCall size={22} />,
  },
  {
    title: "Noell Care",
    eyebrow: "Returning clients",
    description:
      "Recognizes returning clients and handles rebooks and service questions. Reactivation campaigns ship with System tier.",
    status: "status: online / returning clients",
    icon: <IconHeartHandshake size={22} />,
  },
];

const youGet = [
  "3 AI agents",
  "24/7 coverage",
  "SMS-enabled",
  "Works with any booking tool",
  "Done-for-you setup",
  "Live in 14 days",
];

const youDont = [
  "No PMS integration",
  "No platform migration",
  "No custom automation workflows",
  "No reactivation campaigns",
  "No dedicated account manager",
];

const agentsFaqs: FaqItem[] = [
  {
    id: "agents_cancel",
    group: "agents",
    question: "What happens if I cancel?",
    answer:
      "Month-to-month. No long-term contract. Cancel anytime with 30 days notice and we turn the agents off at the end of your current billing month.",
  },
  {
    id: "agents_upgrade_to_system",
    group: "agents",
    question: "Can I upgrade to the full system later?",
    answer:
      "Yes. If you move to System or Full Stack within the first 6 months, we credit your first month toward the new tier's setup. Ask about upgrade pricing on your onboarding call.",
  },
  {
    id: "agents_time_to_live",
    group: "agents",
    question: "How long until I'm live?",
    answer:
      "14 days on most agents-only installs. Done-for-you setup, we need your services, pricing, hours, and a couple of sample call/chat scenarios. A2P SMS registration runs in parallel on carrier timelines (usually 2–4 weeks); the agents handle chat and calls from day one, and SMS delivery switches on as soon as carriers approve.",
  },
  {
    id: "agents_booking_tools",
    group: "agents",
    question: "What booking tools do you work with?",
    answer:
      "Any of them. Noell Agents is designed to sit alongside your existing booking or practice management tool, not replace it, across dental, salon and spa, wellness, home services, and general scheduling platforms. Deep two-way integration (read availability, write confirmed bookings back) is part of The Noell System, not the agents-only tier. Tell us what you use on your intro call and we will confirm fit.",
  },
  {
    id: "agents_post_founder_rate",
    group: "agents",
    question: "Is there a contract or commitment?",
    answer:
      "Month-to-month. No annual contract required. You can cancel with 30 days notice at any time. Most clients stay because the agents pay for themselves within the first 60 days.",
  },
];

export default function AgentsPage() {
  return (
    <div>
      <JsonLd
        data={[
          servicePageSchema({
            name: "Noell Agents",
            description:
              "Three managed AI agents for service businesses: website chat, calls and scheduling, and existing-client support.",
            path: "/agents",
            serviceType: "AI operations for service businesses",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Noell Agents", path: "/agents" },
          ]),
          faqPageSchema(agentsFaqs),
        ]}
        id="agents"
      />
      <AgentsPageAnalytics />



      {/* Hero */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-8 mx-auto flex-col items-center justify-center pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.25)] via-[rgba(31,18,25,0.85)] to-[rgba(19,11,15,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-5">
          The AI layer
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-cream leading-tight">
          Three agents.{" "}
          <span className="italic bg-gradient-to-b from-[#D96B38] to-[#C45A2A] bg-clip-text text-transparent">
            Working quietly, in the background.
          </span>
        </h1>
        <p className="relative z-20 mt-6 max-w-2xl text-center text-cream/75 text-base md:text-lg leading-relaxed">
          Noell Support handles website chat. Noell Front Desk never misses a
          call. Noell Care handles returning clients (rebooks and questions).
          Works alongside the booking tool you already use.
        </p>

        <div className="relative z-20 mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center justify-center px-4">
          <Link
            href="/book"
            className="inline-flex items-center justify-center w-full sm:w-auto h-12 px-7 rounded-xl bg-gradient-to-r from-[#C45A2A] to-[#9A3A18] text-cream font-semibold text-sm hover:from-[#D96B38] hover:to-[#C45A2A] transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="#whats-included"
            className="inline-flex items-center justify-center text-sm font-medium text-[#C45A2A] hover:text-[#D96B38] tap-target px-3"
          >
            See what&apos;s included <span className="ml-1.5">&rarr;</span>
          </Link>
        </div>


      </section>

      {/* Three agents */}
      <section
        id="whats-included"
        className="w-full py-16 md:py-20 px-4 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-strong mb-4">
              the agents
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              What&apos;s included.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <div
                key={agent.title}
                className={cn(
                  "relative rounded-[22px] border border-white/10 bg-[#271520]",
                  "p-7 md:p-8",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#C45A2A]/10 text-[#C45A2A] flex items-center justify-center">
                    {agent.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-mono text-cream/70">
                      0{index + 1}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cream/60 mb-1">
                  {agent.eyebrow}
                </p>
                <h3 className="font-serif text-2xl font-semibold text-cream mb-3">
                  {agent.title}
                </h3>
                <p className="text-sm text-cream/80 leading-relaxed">
                  {agent.description}
                </p>
                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cream/70">
                    {agent.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get / what you don't */}
      <section className="w-full py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-[22px] border border-white/10 bg-[#271520] p-7 md:p-8">
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-cream mb-5">
              You get
            </h3>
            <ul className="space-y-3">
              {youGet.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#C45A2A] text-cream flex items-center justify-center">
                    <IconCheck size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm md:text-base text-cream/85 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[22px] border border-white/10 bg-[#301A26]/40 p-7 md:p-8">
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-cream mb-5">
              You don&apos;t get
            </h3>
            <ul className="space-y-3">
              {youDont.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[#C45A2A]/15 text-[#C45A2A]/80 flex items-center justify-center">
                    <IconMinus size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm md:text-base text-cream/75 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="text-center text-sm italic text-muted-strong mt-8 max-w-2xl mx-auto">
          Need the full operations platform?{" "}
          <Link
            href="/pricing"
            className="text-[#C45A2A] hover:text-[#D96B38] underline underline-offset-4 decoration-[#C45A2A]/30"
          >
            See The Noell System &rarr;
          </Link>
        </p>
      </section>

      {/* Pricing block */}
      <section className="w-full py-12 md:py-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="relative rounded-[26px] border border-wine/25 bg-[#1F1219] p-8 md:p-10 text-center shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-strong mb-4">
              Signal tier
            </p>
            <p className="font-serif text-5xl md:text-6xl font-bold text-cream leading-none">
              $397<span className="text-2xl md:text-3xl font-normal">/mo</span>
            </p>
            <p className="text-xs text-muted-strong mt-2">
              <span className="line-through">$497/mo</span> standard rate
            </p>
            <p className="text-xs text-muted-strong mt-4 mb-8">
              Live in 14 days.
            </p>
            <Link
              href="/book"
              className="inline-flex items-center justify-center w-full h-12 px-7 rounded-xl bg-gradient-to-r from-[#C45A2A] to-[#9A3A18] text-cream font-semibold text-sm hover:from-[#D96B38] hover:to-[#C45A2A] transition-colors"
            >
              Get Your Free Missed Call Audit
            </Link>
          </div>
        </div>
      </section>


      {/* Inline booking calendar */}
      <section className="w-full py-12 md:py-16 px-4">
        <div className="max-w-4xl mx-auto rounded-[22px] border border-wine/30 bg-[#271520] px-7 py-8 md:px-10 md:py-10">
          <div className="text-center mb-6">
            <p className="text-xs text-[#C45A2A] uppercase tracking-[0.22em] font-medium mb-2">
              The first step costs nothing
            </p>
            <p className="text-lg md:text-xl font-serif font-semibold text-cream leading-snug mb-2">
              Pick a time for your free Missed Call Audit.
            </p>
            <p className="text-sm text-cream/65 leading-relaxed max-w-xl mx-auto">
              We audit your front desk on the call and tell you whether the agents are the right fit. No pitch.
            </p>
          </div>
          <BookingCalendarEmbed id="agents-inline-booking" />
          <p className="text-[11px] text-cream/40 text-center mt-4">
            Free · No pitch · Reply within one business day
          </p>
        </div>
      </section>

      {/* Condensed FAQ */}
      <FAQ
        eyebrow="Before you claim a spot"
        headlineStart="Quick"
        headlineAccent="answers."
        body="Five questions we get most often on the agents-only offer. If yours isn't here, chat with Noell Support, she has the answers too."
        faqs={agentsFaqs}
      />

      {/* Final CTA */}
      <section className="w-full px-4 my-16 md:my-20">
        <div className="max-w-5xl mx-auto rounded-[32px] bg-[#301A26]/70 border border-white/10 px-6 py-14 md:py-20 text-center">
          <p className="font-serif italic text-xl md:text-3xl text-cream leading-snug">
            Starting at $397/mo.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/book"
              className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-gradient-to-r from-[#C45A2A] to-[#9A3A18] text-cream font-semibold text-sm hover:from-[#D96B38] hover:to-[#C45A2A] transition-colors"
            >
              Get Your Free Missed Call Audit
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
