import Link from "next/link";
import {
  IconCalendarEvent,
  IconPhoneCall,
  IconHeartHandshake,
  IconBolt,
  IconCheck,
  IconArrowRight,
} from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { FAQ, type FaqItem } from "@/components/faq";
import CTA from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, servicePageSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  path: "/for-service-businesses",
  title: "AI Operations for Service-Based Businesses",
  description:
    "You deliver exceptional work. Ops by Noell makes sure your digital presence and front desk reflect it. Done-for-you AI operations for consultants, agencies, coaches, and professional service businesses.",
  ogTitle: "Your work is excellent. Your front desk should say so.",
  ogDescription:
    "Done-for-you AI operations for service businesses. Catch every missed call, follow up instantly, and stop losing clients to competitors who just look more polished.",
});

type SignalCard = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  body: string;
};

const signals: SignalCard[] = [
  {
    icon: <IconPhoneCall size={20} />,
    tag: "Missed call",
    title: "The call went to voicemail. They booked someone else.",
    body: "A prospect called during a client session. No one answered. No text went out. By the time you saw the missed call, they had already moved on. That is not a lead problem. That is a front desk problem.",
  },
  {
    icon: <IconCalendarEvent size={20} />,
    tag: "No follow-up",
    title: "They filled out the form. You never heard from them again.",
    body: "The inquiry came in on a Saturday. You were with family. By Monday it felt awkward to follow up. They assumed you were not interested. You lost a client you never knew you had.",
  },
  {
    icon: <IconHeartHandshake size={20} />,
    tag: "Quiet client",
    title: "A great client stopped booking. You never knew why.",
    body: "They loved the work. Life got busy. No one reached out. No reminder. No check-in. They found someone else, not because they wanted to, but because no one made it easy to come back.",
  },
];

type SystemCard = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  href: string;
};

const systems: SystemCard[] = [
  {
    eyebrow: "Noell Support",
    title: "24/7 website chat and lead intake",
    description:
      "Every inquiry that lands on your site gets a real response, around the clock. Noell Support qualifies the lead, captures contact information, and routes them to booking or your team. No more Saturday morning inbox surprises.",
    bullets: [
      "24/7 website chat coverage",
      "Lead qualification and contact capture",
      "Routing to booking or your team",
      "Trained on your services, pricing, and voice",
    ],
    href: "/noell-support",
  },
  {
    eyebrow: "Noell Front Desk",
    title: "Calls, scheduling, and follow-up",
    description:
      "Your phone gets answered. Every time. Noell Front Desk handles inbound calls, books appointments, sends confirmations, and follows up on no-shows. Built around the scheduling tool you already use.",
    bullets: [
      "Inbound call answering and booking",
      "Appointment confirmations and reminders",
      "Missed-call recovery via SMS",
      "Works with your existing booking system",
    ],
    href: "/noell-front-desk",
  },
  {
    eyebrow: "Noell Care",
    title: "Existing client retention and rebooking",
    description:
      "The clients already in your book are your most valuable asset. Noell Care handles rebooking requests, service questions, and proactive outreach to clients who have gone quiet. Retention on autopilot.",
    bullets: [
      "Rebooking requests and scheduling",
      "Proactive outreach to lapsed clients",
      "Service and account questions",
      "Review capture after visits",
    ],
    href: "/noell-care",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Revenue Signal Report",
    description:
      "We start with a free 30-minute working session. We audit your current front desk, identify where leads and revenue are slipping out, and tell you exactly what we found. No pitch. No deck.",
  },
  {
    number: "02",
    title: "Strategic Brief",
    description:
      "We deliver a written brief that maps every finding to a business outcome. You know what is broken, what it is costing you, and what the fix looks like before any work begins.",
  },
  {
    number: "03",
    title: "System Build",
    description:
      "We build and install the system around the tools you already use. Copy written in your voice, integrations wired, agents trained. You approve before anything goes live.",
  },
  {
    number: "04",
    title: "Ongoing Operations",
    description:
      "We run it. Monthly reporting, ongoing tuning, and account management handled by our team. You stay focused on the client in front of you.",
  },
];

const serviceFaqs: FaqItem[] = [
  {
    id: "sb_who_is_this_for",
    question: "What types of service businesses do you work with?",
    answer:
      "We work with consultants, agencies, coaches, freelancers, and professional service businesses where client relationships are the core of the business. If you deliver exceptional work but your front desk, follow-up, or digital presence is not keeping up, we are a fit.",
  },
  {
    id: "sb_existing_tools",
    question: "Do I need to replace my current booking or CRM tools?",
    answer:
      "No. We build around the tools you already use. The Ops by Noell system layers on top of your existing scheduling, CRM, or practice management software. No migration, no rip-and-replace.",
  },
  {
    id: "sb_timeline",
    question: "How long until the system is live?",
    answer:
      "Most installs are live within 14 days of signing. We handle the setup, copy, integrations, and agent training. You approve before anything goes live.",
  },
  {
    id: "sb_pricing",
    question: "What does it cost?",
    answer:
      "Pricing starts at $197/mo for Noell Agents (self-serve, three AI agents). The full done-for-you Noell System starts at $197/mo and scales based on the scope of your operation. We discuss fit and pricing on the free Revenue Signal Report call.",
  },
  {
    id: "sb_contract",
    question: "Is there a contract?",
    answer:
      "Month-to-month. No long-term contracts. Cancel anytime with 30 days notice. Your rate is locked at the price you signed up at for as long as you stay on that tier.",
  },
];

export default function ForServiceBusinessesPage() {
  return (
    <div>
      <JsonLd
        data={servicePageSchema({
          name: "Ops by Noell for Service-Based Businesses",
          description:
            "Done-for-you AI operations for service businesses. Catch every missed call, follow up instantly, and stop losing clients to competitors who just look more polished.",
          path: "/for-service-businesses",
        })}
        id="sb-service"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "For Service Businesses", path: "/for-service-businesses" },
        ])}
        id="sb-breadcrumb"
      />
      <JsonLd
        data={faqPageSchema(serviceFaqs)}
        id="sb-faq"
      />

      {/* ─── 1. HERO ──────────────────────────────────────────────────────── */}
      <Hero
        headlineLine1Start="Your work is excellent."
        headlineLine1Accent=""
        headlineLine2Start="Your front desk should"
        headlineLine2Accent="say so."
        headlineLine2Smaller={false}
        body="You built a service business on the quality of your work. Ops by Noell makes sure your front desk, follow-up, and digital presence reflect that quality, so you stop losing clients to competitors who just look more polished."
        footnote="Done for you. Built around the tools you already use. Live in 14 days."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See How It Works", href: "/systems" }}
        showProofBar={false}
      />

      {/* ─── 2. THE REAL PROBLEM ──────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              The quiet revenue leak
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight max-w-3xl mx-auto">
              You are not losing clients because your work is bad.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                You are losing them between sessions.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
              The gap between delivering excellent work and running a business that captures and retains every client is an operations problem. Here is what it looks like in practice.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {signals.map((signal, i) => (
              <div
                key={i}
                className={cn(
                  "relative rounded-[22px] bg-white p-7 border border-warm-border",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-wine">{signal.icon}</span>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-wine/85 font-medium">
                    {signal.tag}
                  </p>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-semibold text-charcoal leading-snug mb-3">
                  {signal.title}
                </h3>
                <p className="text-sm text-charcoal/75 leading-relaxed">
                  {signal.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. PROOF BAND ────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-14 md:py-16 bg-cream-dark">
        <div className="mx-auto max-w-2xl rounded-[22px] border border-warm-border bg-white p-7 md:p-10 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            Case study · Healing Hands by Santa · Laguna Niguel, CA
          </p>
          <p className="font-serif text-xl md:text-2xl text-charcoal leading-snug mb-5">
            Santa, a licensed massage therapist with 25 years of experience, was losing clients every time she was with a client. Her phone went quiet. No follow-up went out. Clients booked elsewhere.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">4</p>
              <p className="text-[11px] text-charcoal/70 mt-1 uppercase tracking-wide">missed calls<br />recovered</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">$960</p>
              <p className="text-[11px] text-charcoal/70 mt-1 uppercase tracking-wide">recovered<br />in 14 days</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">75%</p>
              <p className="text-[11px] text-charcoal/70 mt-1 uppercase tracking-wide">fewer<br />no-shows</p>
            </div>
          </div>
          <blockquote className="border-l-2 border-wine/40 pl-4">
            <p className="text-sm md:text-base text-charcoal/80 italic leading-relaxed">
              "I used to dread Mondays because there would always be gaps I didn't expect. Now I open my calendar and it's just full. The reminders go out and people show up. I don't think about it anymore."
            </p>
            <footer className="mt-3 text-[11px] uppercase tracking-[0.2em] text-charcoal/80">
              Santa E. · Licensed Massage Therapist · Laguna Niguel CA
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ─── 4. THE THREE SYSTEMS ─────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              What we build
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight max-w-3xl mx-auto">
              Three agents.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                One complete front desk.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
              Every Ops by Noell engagement is built around three AI agents that cover the full client lifecycle, from first contact to retention. Installed and managed by our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systems.map((system, i) => (
              <div
                key={i}
                className={cn(
                  "relative flex flex-col rounded-[22px] bg-white p-7 md:p-8 border border-warm-border",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-wine/85 font-medium mb-2">
                  {system.eyebrow}
                </p>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-3 leading-snug">
                  {system.title}
                </h3>
                <p className="text-sm md:text-base text-charcoal/75 leading-relaxed mb-6">
                  {system.description}
                </p>
                <ul className="space-y-2 mb-7 flex-1">
                  {system.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <IconCheck size={14} className="text-wine shrink-0 mt-0.5" />
                      <span className="text-sm text-charcoal/80">{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={system.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-wine hover:text-wine-dark transition-colors"
                >
                  Learn more <IconArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4.5 DASHBOARD CALLOUT ───────────────────────────────────────── */}
      <section className="w-full px-4 py-12 md:py-16 bg-cream-dark">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[22px] bg-white border border-warm-border p-8 md:p-10 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-3">
                  Lead Intelligence Dashboard
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal leading-snug mb-4">
                  See every lead, session, and conversation in one place.
                </h2>
                <p className="text-charcoal/75 leading-relaxed mb-6">
                  Every client who contacts your business through Noell is tracked in a live dashboard. Hot leads, warm leads, agent attribution, conversion funnel, and every conversation thread. You see exactly what Noell is doing and what it is recovering.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "HOT and WARM lead scoring with priority signals",
                    "Full conversation threads from every agent",
                    "Conversion funnel from first contact to booked",
                    "Date range filtering: 7D, 30D, 90D, All Time",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal/80">
                      <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-wine/10 text-wine flex items-center justify-center text-[10px] font-bold">
                        <IconCheck size={10} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-3 md:items-end">
                <div className="rounded-[16px] bg-[#1a0d12] px-6 py-5 text-center min-w-[180px]">
                  <p className="font-serif text-3xl font-semibold text-wine mb-1">Live</p>
                  <p className="text-[11px] text-white/60 uppercase tracking-wide">included with<br />every system</p>
                </div>
                <p className="text-[11px] text-charcoal/50 text-center">
                  Included in all Noell System tiers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. HOW IT STARTS ─────────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24 bg-cream-dark">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              The process
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              We do not send proposals.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                We run working sessions.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-charcoal/75 max-w-xl mx-auto leading-relaxed">
              Every engagement starts with a free Revenue Signal Report. No pitch. No deck. Just a direct conversation about what is broken and what it is costing you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "relative rounded-[22px] bg-white p-7 border border-warm-border",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-wine/60 mb-3">
                  {step.number}
                </p>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-charcoal/75 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 6. FAQ ───────────────────────────────────────────────────────── */}
      <FAQ
        faqs={serviceFaqs}
        eyebrow="Questions"
        headlineStart="Straight"
        headlineAccent="answers."
        body="Real questions from service business owners before they request a Revenue Signal Report."
      />

      {/* ─── 7. CTA ───────────────────────────────────────────────────────── */}
      <CTA
        eyebrow="The first step"
        headlineStart="Find the revenue your front desk is"
        headlineAccent="missing."
        body="In your free Revenue Signal Report, we map the leaks in your front desk, booking flow, and follow-up system. You will know what is being missed, what it may be worth, and which Ops by Noell track fits."
        trustLine="No pitch. No pressure. If it is not a fit, we will say so."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See Pricing", href: "/pricing" }}
        sourcePage="for_service_businesses"
      />
    </div>
  );
}
