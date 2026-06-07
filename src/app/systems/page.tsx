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
  title: "The Noell System: Two Tracks, Six Agents",
  description:
    "Done-for-you AI operations for service businesses and B2B companies. Six managed agents across two tracks. Live in 14 days.",
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

const supportedCategories = [
  { label: "Dental practice management", caption: "PMS-layer" },
  { label: "Salon & spa booking", caption: "booking-layer" },
  { label: "Med spa & wellness scheduling", caption: "booking-layer" },
  { label: "Massage & solo wellness", caption: "booking-layer" },
  { label: "Chiropractic EHR", caption: "EHR-layer" },
  { label: "Home services field management", caption: "FSM-layer" },
  { label: "General scheduling tools", caption: "calendar-layer" },
  { label: "Custom & in-house systems", caption: "case-by-case" },
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
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-8 mx-auto flex-col items-center justify-center pt-24 md:pt-28 pb-12 md:pb-16 px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.25)] via-[rgba(31,18,25,0.85)] to-[rgba(19,11,15,1)]">
        <div className="relative z-20 flex items-center gap-2 mb-6">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/70">
            the noell system / what it is
          </p>
        </div>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-cream leading-tight">
          Two tracks. Six agents.{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            One operational standard.
          </span>
        </h1>
        <p className="relative z-20 mt-6 max-w-2xl text-center text-cream/75 text-base md:text-lg leading-relaxed">
          Six managed agents across two tracks. You run the business.
        </p>
        <div className="relative z-20 mt-10 flex flex-col sm:flex-row gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-wine text-cream font-medium hover:bg-wine-dark transition-colors"
          >
            Get Your Free Revenue Signal Report
          </Link>
          <Link
            href="/noell-support"
            className="inline-flex items-center justify-center h-12 px-7 rounded-full bg-[#271520]/70 border border-white/10 text-cream font-medium hover:bg-[#271520] transition-colors"
          >
            Talk to Noell Support first
          </Link>
        </div>
      </section>

      {/* Service Track agents */}
      <section className="w-full py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C45A2A]/10 border border-[#C45A2A]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C45A2A]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/70">Track 01 / Service Businesses</span>
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream leading-tight">
              Three agents for your{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                front desk and retention.
              </span>
            </h2>
            <p className="mt-3 text-cream/70 max-w-2xl leading-relaxed">
              Built for consultants, agencies, coaches, salons, med spas, dental practices, and professional service businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <Link
                key={agent.handle}
                href={agent.href}
                className={cn(
                  "group relative rounded-[22px] border border-white/10 bg-[#271520]",
                  "p-7 md:p-8 transition-all duration-200",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]",
                  "hover:-translate-y-1 hover:shadow-[0px_44px_24px_0px_rgba(28,25,23,0.06),0px_18px_18px_0px_rgba(28,25,23,0.08),0px_6px_10px_0px_rgba(28,25,23,0.06)]"
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
                <h3 className="font-serif text-2xl font-semibold text-cream mb-1">
                  {agent.title}
                </h3>
                <p className="font-mono text-[10px] text-cream/70 mb-3">
                  {agent.handle}
                </p>
                <p className="text-sm text-cream/80 leading-relaxed">
                  {agent.description}
                </p>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cream/70">
                    {agent.status}
                  </p>
                  <p className="text-xs text-[#C45A2A] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
                    Learn more &rarr;
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* B2B Track agents */
      <section className="w-full py-8 md:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-charcoal/8 border border-charcoal/15">
                <span className="w-1.5 h-1.5 rounded-full bg-charcoal" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/70">Track 02 / B2B & SaaS</span>
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream leading-tight">
              Three agents for your{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                pipeline and digital presence.
              </span>
            </h2>
            <p className="mt-3 text-cream/70 max-w-2xl leading-relaxed">
              Built for B2B and SaaS companies, AI vendors, and tech startups.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                handle: "@noell_pci",
                eyebrow: "Predictive intelligence",
                title: "Predictive Customer Intelligence",
                description: "Reads every signal in your pipeline and surfaces the accounts most likely to close, expand, or churn before your team notices the shift.",
                status: "status: online / continuous",
                href: "/predictive-customer-intelligence",
                index: 0,
              },
              {
                handle: "@noell_gtm",
                eyebrow: "Go-to-market strategy",
                title: "AI-Optimized GTM Strategy",
                description: "Maps your go-to-market motion to how B2B and SaaS buyers actually buy. Buying committee sequencing, trust signal architecture, and content alignment by stage.",
                status: "status: online / strategic layer",
                href: "/for-b2b",
                index: 1,
              },
              {
                handle: "@noell_dpa",
                eyebrow: "Digital presence",
                title: "Digital Presence Architecture",
                description: "Rebuilds the structural layer of your digital presence so every page, proof point, and trust signal holds up when procurement does their research without your sales team in the room.",
                status: "status: online / always-on",
                href: "/for-b2b",
                index: 2,
              },
            ].map((agent) => (
              <Link
                key={agent.handle}
                href={agent.href}
                className={cn(
                  "group relative rounded-[22px] border border-charcoal/10 bg-charcoal",
                  "p-7 md:p-8 transition-all duration-200",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.08),0px_15px_15px_0px_rgba(28,25,23,0.10),0px_4px_8px_0px_rgba(28,25,23,0.08)]",
                  "hover:-translate-y-1"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#C45A2A]/15 text-[#C45A2A] flex items-center justify-center">
                    <IconBolt size={22} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-[10px] font-mono text-cream/50">
                      0{agent.index + 1}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-cream/60 mb-1">
                  {agent.eyebrow}
                </p>
                <h3 className="font-serif text-2xl font-semibold text-cream mb-1">
                  {agent.title}
                </h3>
                <p className="font-mono text-[10px] text-cream/50 mb-3">
                  {agent.handle}
                </p>
                <p className="text-sm text-cream/75 leading-relaxed">
                  {agent.description}
                </p>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-cream/50">
                    {agent.status}
                  </p>
                  <p className="text-xs text-[#C45A2A] font-medium opacity-80 group-hover:opacity-100 transition-opacity">
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
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/60 mb-4">
              audit &rarr; install &rarr; live
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
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
                  "relative rounded-[22px] border border-white/10 bg-[#271520]",
                  "p-7 md:p-8",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-wine/10 text-wine flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-mono text-cream/70">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-cream mb-3 leading-snug">
                  {step.title}
                </h3>
                <p className="text-sm text-cream/75 leading-relaxed">
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
            {supportedCategories.map((cat) => (
              <div
                key={cat.label}
                className="rounded-[14px] border border-white/10 bg-[#271520]/[0.04] px-4 py-5 text-center"
              >
                <p className="font-serif text-base text-cream leading-snug">{cat.label}</p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-cream/60 mt-1">
                  {cat.caption}
                </p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-cream/60 mt-8 max-w-2xl mx-auto leading-relaxed">
            We work with most vertical-standard booking, PMS, EHR, and field
            service platforms. Tell us what you run on your audit call and we
            will confirm fit.
          </p>
          <p className="text-center text-xs text-cream/40 mt-4 max-w-2xl mx-auto leading-relaxed">
            Ops by Noell is an independent service provider and is not
            affiliated with, endorsed by, or a certified partner of any
            specific scheduling, practice management, or field service
            platform. All third-party brand names are the property of their
            respective owners.
          </p>
          <p className="text-center text-xs text-cream/65 mt-6 max-w-2xl mx-auto leading-relaxed">
            Deep two-way integration (read availability, write bookings back)
            is available on System and Full Stack. Signal uses SMS and chat
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
        eyebrow="The first step"
        headlineStart="See how it layers on"
        headlineAccent="your business."
        body="A 30-minute audit gives you a clear map of what's leaking, whether you work with us or not. No pitch. No pressure."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · No contracts · Live in 14 days"
        sourcePage="systems"
      />
    </div>
  );
}
