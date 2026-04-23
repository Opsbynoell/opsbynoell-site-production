import Link from "next/link";
import {
  IconBolt,
  IconPhoneCall,
  IconHeartHandshake,
  IconCompass,
  IconTool,
  IconRocket,
} from "@tabler/icons-react";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";
import { SystemsPageAnalytics } from "@/components/systems-page-analytics";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, servicePageSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/systems",
  title:
    "The Noell System — One System. Three Agents. Managed End-to-End.",
  description:
    "The Noell system is a done-for-you front desk, intake, and retention layer for service businesses. Three managed agents run in the background, layered on top of the tools you already use. Audit, install, live in 14 days.",
});

type Agent = {
  title: string;
  handle: string;
  eyebrow: string;
  description: string;
  status: string;
  href: string;
  icon: React.ReactNode;
};

const agents: Agent[] = [
  {
    title: "Noell Support",
    handle: "@noell_support",
    eyebrow: "New prospect intake",
    description:
      "Website chat, lead qualification, contact capture, and triage to booking or your team.",
    status: "status: online / 24/7",
    href: "/noell-support",
    icon: <IconBolt size={22} />,
  },
  {
    title: "Noell Front Desk",
    handle: "@noell_frontdesk",
    eyebrow: "Operations layer",
    description:
      "Calls, scheduling, reminders, confirmations, reschedules, review capture, and reactivation.",
    status: "status: online / runs during hours",
    href: "/noell-front-desk",
    icon: <IconPhoneCall size={22} />,
  },
  {
    title: "Noell Care",
    handle: "@noell_care",
    eyebrow: "Existing client support",
    description:
      "Rebooking, service questions, and account help for existing clients. Keeps the front desk clear for new business.",
    status: "status: online / existing clients",
    href: "/noell-care",
    icon: <IconHeartHandshake size={22} />,
  },
];

type ProcessStep = {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
};

const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "Audit (Day 0)",
    description:
      "Free 30-minute call. We map where leads are falling through, whether you work with us or not.",
    icon: <IconCompass size={28} />,
  },
  {
    number: "02",
    title: "Install (Days 1–14)",
    description:
      "We write the copy, wire the integrations, register SMS, and train the agents on your business. You approve before go-live.",
    icon: <IconTool size={28} />,
  },
  {
    number: "03",
    title: "Live (Day 14+)",
    description:
      "The system runs. Monthly report. Ongoing tuning handled by our team. You focus on the business.",
    icon: <IconRocket size={28} />,
  },
];

const marqueeIntegrations = [
  "Dentrix",
  "Open Dental",
  "Mindbody",
  "Boulevard",
  "Vagaro",
  "ServiceTitan",
  "Housecall Pro",
];

export default function SystemsPage() {
  return (
    <div>
      <JsonLd
        data={[
          servicePageSchema({
            name: "The Noell System",
            description:
              "Done-for-you operations layer that catches missed calls, handles scheduling, and protects retention for service businesses.",
            path: "/systems",
            serviceType: "Managed AI front desk and operations",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Noell System", path: "/systems" },
          ]),
        ]}
        id="systems"
      />
      <SystemsPageAnalytics />

      {/* Hero */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-8 mx-auto flex-col items-center justify-center pt-24 md:pt-28 pb-12 md:pb-16 px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.35)] via-[rgba(240,224,214,0.60)] to-[rgba(250,246,241,1)]">
        <div className="relative z-20 flex items-center gap-2 mb-6">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/60">
            the noell system / what it is
          </p>
        </div>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-tight">
          One system. Three agents.{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            Managed end-to-end.
          </span>
        </h1>
        <p className="relative z-20 mt-6 max-w-2xl text-center text-charcoal/75 text-base md:text-lg leading-relaxed">
          The Noell system is a done-for-you front desk, intake, and retention
          engine for service businesses. Three agents run in the background.
          You run the business.
        </p>
        <div className="relative z-20 mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-wine text-cream font-medium hover:bg-wine-dark transition-colors"
          >
            Get Your Free Audit
          </Link>
          <Link
            href="/noell-support"
            className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-white/70 border border-warm-border text-charcoal font-medium hover:bg-white transition-colors"
          >
            Talk to Noell Support first
          </Link>
        </div>
      </section>

      {/* Three agents card grid */}
      <section className="w-full py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine mb-4">
              the noell system / agent roster
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Three agents.{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                One system.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <Link
                key={agent.handle}
                href={agent.href}
                className={cn(
                  "group relative rounded-[22px] border border-warm-border bg-white",
                  "p-7 md:p-8 transition-all duration-200",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]",
                  "hover:-translate-y-1 hover:shadow-[0px_44px_24px_0px_rgba(28,25,23,0.06),0px_18px_18px_0px_rgba(28,25,23,0.08),0px_6px_10px_0px_rgba(28,25,23,0.06)]"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-wine/10 text-wine flex items-center justify-center">
                    {agent.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-mono text-charcoal/40">
                      0{index + 1}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-wine/70 mb-1">
                  {agent.eyebrow}
                </p>
                <h3 className="font-serif text-2xl font-semibold text-charcoal mb-1">
                  {agent.title}
                </h3>
                <p className="font-mono text-[10px] text-charcoal/40 mb-3">
                  {agent.handle}
                </p>
                <p className="text-sm text-charcoal/80 leading-relaxed">
                  {agent.description}
                </p>
                <div className="mt-6 pt-4 border-t border-warm-border flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
                    {agent.status}
                  </p>
                  <p className="text-xs text-wine font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                    Learn more &rarr;
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How the install works */}
      <section className="w-full py-16 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine mb-4">
              audit &rarr; install &rarr; live
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              From a 30-minute call to a live system{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                in 14 days.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {processSteps.map((step) => (
              <div
                key={step.number}
                className={cn(
                  "relative rounded-[22px] border border-warm-border bg-white",
                  "p-7 md:p-8",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-wine/10 text-wine flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-mono text-charcoal/30">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-charcoal/75 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations band */}
      <section className="w-full max-w-7xl mx-auto rounded-3xl bg-charcoal px-6 py-20 md:py-24 my-10 md:my-16">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-blush mb-4">
            integrates on top / does not replace
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
            The Noell system layers on top of{" "}
            <span className="italic text-wine-light">
              the tools you already run.
            </span>
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {marqueeIntegrations.map((tool) => (
              <div
                key={tool}
                className="rounded-[14px] border border-white/10 bg-white/[0.04] px-4 py-5 text-center"
              >
                <p className="font-serif text-lg text-cream">{tool}</p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-cream/40 mt-1">
                  supported
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-cream/60 mt-8 max-w-2xl mx-auto leading-relaxed">
            Also supported: Dentrix Ascend, Eaglesoft, Curve Dental, Denticon,
            Booker, Jobber, and most vertical-standard tools. If yours isn&apos;t
            listed, the audit tells us whether it&apos;s supported.
          </p>
          <p className="text-center text-xs text-cream/50 mt-6 max-w-2xl mx-auto leading-relaxed">
            Deep two-way integration (read availability, write bookings back)
            is available on Growth and Custom Ops. Essentials uses SMS/text
            automations that work alongside any existing booking tool.{" "}
            <Link
              href="/pricing"
              className="underline underline-offset-4 decoration-cream/30 hover:text-cream"
            >
              See how it scales with your tier
            </Link>
            .
          </p>
        </div>
      </section>

      <CTA
        eyebrow="See how it layers on"
        headlineStart="See how it layers on"
        headlineAccent="your business."
        body="A 30-minute audit gives you a clear map of what's leaking, whether you work with us or not. No pitch. No pressure."
        primaryCta={{ label: "Book Your Free Audit", href: "/book" }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · No contracts · Live in 14 days"
      />
    </div>
  );
}
