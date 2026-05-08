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
import { AgentsFoundingCta } from "@/components/agents-founding-cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  servicePageSchema,
} from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/agents",
  title: "Noell Agents — AI Operations for Service Businesses",
  description:
    "Three managed AI agents covering website chat, calls and scheduling, and existing-client support. Works alongside your booking tool. Founding rate $197/mo, locked for your first 12 months.",
  ogTitle: "Noell Agents — AI Operations for Service Businesses",
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
    eyebrow: "Existing clients",
    description:
      "Handles rebooks and service questions for clients already in your book.",
    status: "status: online / existing clients",
    icon: <IconHeartHandshake size={22} />,
  },
];

const youGet = [
  "3 AI agents",
  "24/7 coverage",
  "SMS-enabled",
  "Works with any booking tool",
  "Light onboarding",
  "Live in under a week",
];

const youDont = [
  "No PMS integration",
  "No platform migration",
  "No managed install",
  "No reactivation campaigns",
  "No dedicated account manager",
];

const agentsFaqs: FaqItem[] = [
  {
    id: "agents_cancel",
    group: "agents",
    question: "What happens if I cancel?",
    answer:
      "Month-to-month. No long-term contract. Cancel anytime with 30 days notice — we turn the agents off at the end of your current billing month. If you cancel inside the first 30 days before you've produced your written testimonial, the founding rate offer doesn't transfer to a future re-subscribe.",
  },
  {
    id: "agents_upgrade_to_system",
    group: "agents",
    question: "Can I upgrade to the full system later?",
    answer:
      "Yes. If you move to Growth or Custom Ops within the first 6 months, we credit one month of agents toward Growth setup ($197) or two months toward Custom Ops setup ($394). The founding rate applies to Noell Agents specifically — the full system has its own pricing.",
  },
  {
    id: "agents_time_to_live",
    group: "agents",
    question: "How long until I'm live?",
    answer:
      "Under a week on most agents-only installs. Light onboarding — we need your services, pricing, hours, and a couple of sample call/chat scenarios. A2P SMS registration runs in parallel on carrier timelines (usually 2–4 weeks); the agents handle chat and calls from day one, and SMS delivery switches on as soon as carriers approve.",
  },
  {
    id: "agents_booking_tools",
    group: "agents",
    question: "What booking tools do you work with?",
    answer:
      "Any of them. Noell Agents is designed to sit alongside your existing booking or practice management tool, not replace it — across dental, salon and spa, wellness, home services, and general scheduling platforms. Deep two-way integration (read availability, write confirmed bookings back) is part of The Noell System, not the agents-only tier. Tell us what you use on your intro call and we will confirm fit.",
  },
  {
    id: "agents_post_founder_rate",
    group: "agents",
    question: "What happens after the 12-month founding rate ends?",
    answer:
      "Your rate rolls to the standard Noell Agents price at that time (currently $297/mo). We give 60 days notice before the renewal date so you can decide to continue, upgrade, or cancel. Founding clients who complete a full case study during their term get an additional 3 months at $197 before the rollover — 15 months total at the founding rate.",
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

      {/* Urgency strip */}
      <div className="w-full bg-wine text-cream">
        <div className="max-w-7xl mx-auto px-4 h-9 flex items-center justify-center">
          <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.28em] text-center">
            10 founding spots &middot; $197/mo locked 12 months &middot; first come, first served
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-8 mx-auto flex-col items-center justify-center pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.35)] via-[rgba(240,224,214,0.60)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-wine mb-5">
          The AI layer
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-tight">
          Three agents.{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            Working quietly, in the background.
          </span>
        </h1>
        <p className="relative z-20 mt-6 max-w-2xl text-center text-charcoal/75 text-base md:text-lg leading-relaxed">
          Noell Support handles website chat. Noell Front Desk never misses a
          call. Noell Care takes rebooks and service questions. Works alongside
          the booking tool you already use.
        </p>

        <div className="relative z-20 mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto items-stretch sm:items-center justify-center px-4">
          <AgentsFoundingCta
            variant="primary"
            className="w-full sm:w-auto h-12 px-7"
          >
            Claim your founding spot
          </AgentsFoundingCta>
          <Link
            href="#whats-included"
            className="inline-flex items-center justify-center text-sm font-medium text-wine hover:text-wine-dark tap-target px-3"
          >
            See what&apos;s included <span className="ml-1.5">&rarr;</span>
          </Link>
        </div>

        <p className="relative z-20 mt-6 max-w-xl text-center text-xs italic text-muted-strong">
          Founding rate locked 12 months &middot; 10 spots only &middot; $297/mo after
        </p>
      </section>

      {/* Three agents */}
      <section
        id="whats-included"
        className="w-full py-16 md:py-20 px-4 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine mb-4">
              the agents
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              What&apos;s included.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <div
                key={agent.title}
                className={cn(
                  "relative rounded-[22px] border border-warm-border bg-white",
                  "p-7 md:p-8",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-wine/10 text-wine flex items-center justify-center">
                    {agent.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-mono text-charcoal/70">
                      0{index + 1}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-wine/85 mb-1">
                  {agent.eyebrow}
                </p>
                <h3 className="font-serif text-2xl font-semibold text-charcoal mb-3">
                  {agent.title}
                </h3>
                <p className="text-sm text-charcoal/80 leading-relaxed">
                  {agent.description}
                </p>
                <div className="mt-6 pt-4 border-t border-warm-border">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/70">
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
          <div className="rounded-[22px] border border-warm-border bg-white p-7 md:p-8">
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-5">
              You get
            </h3>
            <ul className="space-y-3">
              {youGet.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-wine text-cream flex items-center justify-center">
                    <IconCheck size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm md:text-base text-charcoal/85 leading-snug">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[22px] border border-warm-border bg-cream-dark/40 p-7 md:p-8">
            <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-5">
              You don&apos;t get
            </h3>
            <ul className="space-y-3">
              {youDont.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-wine/15 text-wine/80 flex items-center justify-center">
                    <IconMinus size={12} strokeWidth={3} />
                  </span>
                  <span className="text-sm md:text-base text-charcoal/75 leading-snug">
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
            className="text-wine hover:text-wine-dark underline underline-offset-4 decoration-wine/30"
          >
            See The Noell System &rarr;
          </Link>
        </p>
      </section>

      {/* Pricing block */}
      <section className="w-full py-12 md:py-16 px-4">
        <div className="max-w-xl mx-auto">
          <div className="relative rounded-[26px] border border-wine/25 bg-cream p-8 md:p-10 text-center shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine mb-4">
              Noell agents &middot; founding rate
            </p>
            <p className="font-serif text-2xl text-charcoal/70 line-through decoration-charcoal/55 mb-1">
              $297/mo
            </p>
            <p className="font-serif text-5xl md:text-6xl font-bold text-wine leading-none">
              $197<span className="text-2xl md:text-3xl font-normal">/mo</span>
            </p>
            <p className="text-xs text-muted-strong mt-4 mb-8">
              Founding rate &middot; Locked 12 months &middot; 10 spots only
            </p>
            <AgentsFoundingCta
              variant="primary"
              className="w-full h-12 px-7"
            >
              Claim your founding spot
            </AgentsFoundingCta>
          </div>
        </div>
      </section>

      {/* What we ask in return */}
      <section className="w-full py-16 md:py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine mb-4">
              the trade
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              What we ask in return.
            </h2>
          </div>

          <ul className="space-y-5">
            <li className="rounded-[18px] border border-warm-border bg-white p-5 md:p-6">
              <p className="font-serif text-lg md:text-xl text-charcoal italic leading-snug">
                A short written testimonial after 30 days.
              </p>
            </li>
            <li className="rounded-[18px] border border-warm-border bg-white p-5 md:p-6">
              <p className="font-serif text-lg md:text-xl text-charcoal italic leading-snug">
                One 15-minute reference call with a future prospect.
              </p>
            </li>
            <li className="rounded-[18px] border border-warm-border bg-white p-5 md:p-6">
              <p className="font-serif text-lg md:text-xl text-charcoal italic leading-snug">
                Optional: a full case study — in exchange, 3 additional months at the founding rate (15 months total).
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Condensed FAQ */}
      <FAQ
        eyebrow="Before you claim a spot"
        headlineStart="Quick"
        headlineAccent="answers."
        body="Five questions we get most often on the agents-only offer. If yours isn't here, chat with Noell Support — she has the answers too."
        faqs={agentsFaqs}
      />

      {/* Final CTA */}
      <section className="w-full px-4 my-16 md:my-20">
        <div className="max-w-5xl mx-auto rounded-[32px] bg-cream-dark/70 border border-warm-border px-6 py-14 md:py-20 text-center">
          <p className="font-serif italic text-xl md:text-3xl text-charcoal leading-snug">
            First 10 clients. $197/mo, locked for 12 months.
          </p>
          <div className="mt-8 flex justify-center">
            <AgentsFoundingCta
              variant="primary"
              className="h-12 px-8"
            >
              Claim your founding spot
            </AgentsFoundingCta>
          </div>
          <p className="mt-6 text-xs italic text-muted-strong">
            Founding rate locked 12 months &middot; 10 spots only &middot; $297/mo after
          </p>
        </div>
      </section>
    </div>
  );
}
