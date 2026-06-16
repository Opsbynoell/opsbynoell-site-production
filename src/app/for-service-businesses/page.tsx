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
import { BookingCalendarEmbed } from "@/components/booking-calendar-embed";
import { ServiceBusinessesStickyCta } from "@/components/sb-sticky-mobile-cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, servicePageSchema, localBusinessSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  path: "/for-service-businesses",
  title: "AI Front Desk for Service-Based Businesses",
  description:
    "While you are with a client, someone else is answering your phone. Ops by Noell builds your AI front desk. Done for you, live in 14 days.",
  ogTitle: "While you are with a client, someone else is answering your phone.",
  ogDescription:
    "Every missed call is a client who called the next business on Google. Ops by Noell builds and runs your AI front desk. Done for you. Live in 14 days.",
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
    title: "You paid $60 for that lead. They heard your voicemail and called someone else.",
    body: "A prospect called during a client session. No one answered. No text went out. Noell Front Desk replies within 5 minutes, qualifies the lead, and routes them to booking. The competitor who answered got the job. You paid for the lead.",
  },
  {
    icon: <IconCalendarEvent size={20} />,
    tag: "No follow-up",
    title: "They filled out the form on Saturday. By Monday they had already booked somewhere else.",
    body: "The inquiry came in while you were with family. By Monday it felt awkward to follow up. Noell Support responds instantly, 24/7, captures their information, and routes them to booking before the weekend is over. No awkward Monday calls.",
  },
  {
    icon: <IconHeartHandshake size={20} />,
    tag: "Quiet client",
    title: "A great client stopped booking. You found out three months later.",
    body: "They loved the work. Life got busy. No one reached out. Noell Care monitors your client book for gaps and sends proactive reactivation messages before they find someone else. Retention handled. No manual outreach.",
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
    title: "Every inquiry answered. 24/7. Before they move on.",
    description:
      "Noell Support sits on your website and responds to every inquiry the moment it comes in. It qualifies the lead, captures their contact information, and routes them to booking or your team.",
    bullets: [
      "24/7 website chat with instant response",
      "Lead qualification and contact capture",
      "Routing to booking or your team",
      "Trained on your services, pricing, and voice",
    ],
    href: "/noell-support",
  },
  {
    eyebrow: "Noell Front Desk",
    title: "Your phone answered. Every call. Every time.",
    description:
      "Noell Front Desk handles inbound calls, books appointments, sends confirmations, and follows up on no-shows. Missed call? A recovery text goes out within 5 minutes. Built around the scheduling tool you already use. Nothing to replace.",
    bullets: [
      "Inbound call answering and booking",
      "Appointment confirmations and reminders",
      "Missed-call recovery via SMS within 5 minutes",
      "Works with your existing booking system",
    ],
    href: "/noell-front-desk",
  },
  {
    eyebrow: "Noell Care",
    title: "Lapsed clients reactivated before they book elsewhere.",
    description:
      "The clients already in your book are your most valuable asset. Noell Care monitors your client book for gaps, handles rebooking requests, and sends proactive reactivation messages to clients who have gone quiet. Retention on autopilot.",
    bullets: [
      "Proactive outreach to lapsed clients",
      "Rebooking requests and scheduling",
      "Service and account questions handled",
      "Review capture after every visit",
    ],
    href: "/noell-care",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Missed Call Audit",
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

const objections = [
  {
    question: "I already have a booking system.",
    answer:
      "We work around the tools you already use. No migration. No rip-and-replace. The system layers on top of your existing scheduling, CRM, or practice management software. Jane App, Mindbody, GHL, Vagaro, Square. We have seen them all.",
  },
  {
    question: "I am not a tech person.",
    answer:
      "That is exactly why this exists. You do not touch it. We configure the prompts, train the agents, wire the integrations, and run the monthly reporting. You approve it once and then you forget about it.",
  },
  {
    question: "I cannot afford a full-time receptionist.",
    answer:
      "You are not hiring one. You are getting a managed front desk that runs 24 hours a day, 7 days a week, for a fraction of the cost. No salary. No benefits. No turnover. No training. No Monday morning no-shows.",
  },
];

const serviceFaqs: FaqItem[] = [
  {
    id: "sb_who_is_this_for",
    question: "What types of service businesses do you work with?",
    answer:
      "Hair salons, barbershops, med spas, massage practices, dental offices, chiropractic clinics, aestheticians, nail studios, personal trainers, and any service business where the owner or team is hands-on with clients and cannot always answer the phone. If you deliver excellent work but your front desk, follow-up, or client retention is not keeping up, we are a fit.",
  },
  {
    id: "sb_existing_tools",
    question: "Do I need to replace my current booking or CRM tools?",
    answer:
      "No. We build around the tools you already use. The Ops by Noell system layers on top of your existing scheduling, CRM, or practice management software. No migration, no rip-and-replace. It is done-for-you operations: we handle the setup, the integrations, and the ongoing management.",
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
      "All three agents, Noell Support, Noell Front Desk, and Noell Care, are included from $397/mo (Signal tier, launch rate, normally $497). The System tier at $897/mo keeps the three agents and adds deep two-way integration with your booking or practice management software, reactivation campaigns, no-show recovery, and review automation. We discuss fit and pricing on the free Missed Call Audit call.",
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
      <JsonLd
        data={localBusinessSchema("service-based businesses including salons, med spas, dental offices, chiropractic practices, and massage therapists")}
        id="sb-localbusiness"
      />

      {/* ─── 1. HERO ──────────────────────────────────────────────────────── */}
      <Hero
        eyebrow="Done for you. Live in 14 days."
        headlineLine1Start="While you are with a client,"
        headlineLine1Accent=""
        headlineLine2Start="someone else is answering"
        headlineLine2Accent="your phone."
        headlineLine2Smaller={false}
        body="That someone works for your competitor. And they just booked your client. Ops by Noell builds and runs your AI front desk so nothing slips through. No software to learn. No staff to train. We handle it."
        footnote="Three AI agents. One complete front desk. Built around the tools you already use."
        primaryCta={{ label: "Get Your Free Missed Call Audit", href: "/book" }}
        secondaryCta={{ label: "See How It Works", href: "/systems" }}
        showProofBar={false}
      />

      {/* ─── 1.5 PAIN AGITATION ───────────────────────────────────────────── */}
      <section className="w-full px-4 py-14 md:py-20 border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-6">
            The trap every service business lives in
          </p>
          <div className="space-y-5 text-base md:text-lg text-cream/80 leading-relaxed">
            <p>
              You did not miss that call because you do not care. You missed it because you were doing the work. You were in the treatment room. You were mid-cut. You were finishing a filling. You were under a sink.
            </p>
            <p>
              That is the trap. The better you are at your job, the more often your phone goes unanswered. And the client on the other end does not wait. They scroll down. They call the next name on Google. They book. They move on.
            </p>
            <p>
              Most missed calls never leave a voicemail. They just disappear. No record. No callback. No second chance. You will never know how many clients you lost this month. That is what makes it so expensive. It is invisible.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { stat: "70%", label: "of missed calls never leave a voicemail" },
              { stat: "5 min", label: "is the window before a lead goes cold" },
              { stat: "78%", label: "of clients book with whoever responds first" },
            ].map((item) => (
              <div
                key={item.stat}
                className="rounded-[16px] bg-[#271520] border border-wine/20 p-5 text-center"
              >
                <p className="font-serif text-3xl font-semibold text-wine mb-2">{item.stat}</p>
                <p className="text-xs text-cream/60 leading-snug">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 2. THE REAL PROBLEM ──────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              The quiet revenue leak
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight max-w-3xl mx-auto">
              Your work is excellent.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                Your front desk is costing you clients.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-cream/75 max-w-2xl mx-auto leading-relaxed">
              You are not losing clients because your work is bad. You are losing them in the gaps between sessions. Here is what that looks like.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {signals.map((signal, i) => (
              <div
                key={i}
                className={cn(
                  "relative rounded-[22px] bg-[#271520] p-7 border border-wine/20 shadow-[0_0_0_1px_rgba(139,42,66,0.15),0_8px_32px_rgba(139,42,66,0.08)]",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-wine">{signal.icon}</span>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-wine/85 font-medium">
                    {signal.tag}
                  </p>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-semibold text-cream leading-snug mb-3">
                  {signal.title}
                </h3>
                <p className="text-sm text-cream/75 leading-relaxed">
                  {signal.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. PROOF BAND ────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-14 md:py-16 bg-[#301A26]">
        <div className="mx-auto max-w-2xl rounded-[22px] border border-white/10 bg-[#271520] p-7 md:p-10 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            Case study · Healing Hands by Santa · Laguna Niguel, CA
          </p>
          <p className="font-serif text-xl md:text-2xl text-cream leading-snug mb-5">
            Santa is a solo licensed massage therapist with 25 years of experience. She was losing clients every time she was in session. Her phone went quiet. No follow-up went out. Clients booked elsewhere. She did not change anything about how she works. She just stopped losing clients between sessions.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6 border-t border-white/10 pt-6">
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">4</p>
              <p className="text-[11px] text-cream/70 mt-1 uppercase tracking-wide">missed calls<br />recovered</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">$2,560</p>
              <p className="text-[11px] text-cream/70 mt-1 uppercase tracking-wide">recovered<br />in 30 days</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">75%</p>
              <p className="text-[11px] text-cream/70 mt-1 uppercase tracking-wide">fewer<br />no-shows</p>
            </div>
          </div>
          <blockquote className="border-l-2 border-wine/40 pl-4">
            <p className="text-sm md:text-base text-cream/80 italic leading-relaxed">
              "I used to dread Mondays because there would always be gaps I didn't expect. Now I open my calendar and it's just full. The reminders go out and people show up. I don't think about it anymore."
            </p>
            <footer className="mt-3 text-[11px] uppercase tracking-[0.2em] text-cream/80">
              Santa E. · Licensed Massage Therapist · Laguna Niguel CA
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ─── 3.5 MANAGED VS DIY DIFFERENTIATOR ───────────────────────────── */}
      <section className="w-full px-4 py-14 md:py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[22px] bg-[#1c1210] border border-wine/20 p-8 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              Why Ops by Noell is different
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream leading-snug mb-3">
              Not a tool you configure.
            </h2>
            <p className="text-base text-cream/70 leading-relaxed mb-7">
              Every other AI product makes you do the work. You configure the prompts. You train the AI on your business. You monitor the dashboard. You troubleshoot when it breaks. You figure out the integrations. That is a second job. This is not that.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-[16px] bg-[#271520] border border-white/10 p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-cream/40 mb-3">Other AI tools</p>
                <ul className="space-y-2.5">
                  {[
                    "You configure the prompts",
                    "You train the AI on your business",
                    "You monitor the dashboard",
                    "You troubleshoot when it breaks",
                    "You figure out the integrations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-cream/60">
                      <span className="text-cream/30 mt-0.5">&#x2715;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-[16px] bg-[#271520] border border-wine/30 p-6">
                <p className="text-[11px] uppercase tracking-[0.2em] text-wine mb-3">Ops by Noell</p>
                <ul className="space-y-2.5">
                  {[
                    "We write the copy in your voice",
                    "We build and train the agents",
                    "We wire the integrations",
                    "We run the monthly reporting",
                    "You approve. Then you forget about it.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-cream/80">
                      <span className="text-wine mt-0.5">&#x2713;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <p className="mt-6 text-sm text-cream/60 text-center">
              This is not a software subscription. It is a managed operations service.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 4. THE THREE SYSTEMS ─────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              What we build
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight max-w-3xl mx-auto">
              A done-for-you AI front desk.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                Built for service businesses.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-cream/75 max-w-2xl mx-auto leading-relaxed">
              Three AI agents. Installed and managed by our team. No hiring. No training. No turnover.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systems.map((system, i) => (
              <div
                key={i}
                className={cn(
                  "relative flex flex-col rounded-[22px] bg-[#271520] p-7 md:p-8 border border-wine/20 shadow-[0_0_0_1px_rgba(139,42,66,0.15),0_8px_32px_rgba(139,42,66,0.08)]",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-wine/85 font-medium mb-2">
                  {system.eyebrow}
                </p>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-cream mb-3 leading-snug">
                  {system.title}
                </h3>
                <p className="text-sm md:text-base text-cream/75 leading-relaxed mb-6">
                  {system.description}
                </p>
                <ul className="space-y-2 mb-7 flex-1">
                  {system.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <IconCheck size={14} className="text-wine shrink-0 mt-0.5" />
                      <span className="text-sm text-cream/80">{bullet}</span>
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
      <section className="w-full px-4 py-12 md:py-16 bg-[#301A26]">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[22px] bg-[#271520] border border-white/10 p-8 md:p-10 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-3">
                  Lead Intelligence Dashboard
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream leading-snug mb-4">
                  See every lead, conversation, and recovery in real time.
                </h2>
                <p className="text-cream/75 leading-relaxed mb-6">
                  Every client who contacts your business through Noell is tracked in a live dashboard. You see which leads are HOT, which are WARM, which agent handled them, and the full conversation thread. No guessing what the system is doing. No waiting for a monthly report.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "HOT and WARM lead scoring with priority signals",
                    "Full conversation threads from every agent",
                    "Conversion funnel from first contact to booked",
                    "Date range filtering: 7D, 30D, 90D, All Time",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-cream/80">
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
                <p className="text-[11px] text-cream/50 text-center">
                  Included in all Noell System tiers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. HOW IT STARTS ─────────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24 bg-[#301A26]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              The process
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              We do not send proposals.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                We run working sessions.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-cream/75 max-w-xl mx-auto leading-relaxed">
              No pitch. No deck. A direct conversation about what is broken and what it is costing you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "relative rounded-[22px] bg-[#271520] p-7 border border-wine/20 shadow-[0_0_0_1px_rgba(139,42,66,0.15),0_8px_32px_rgba(139,42,66,0.08)]",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-wine/60 mb-3">
                  {step.number}
                </p>
                <h3 className="font-serif text-xl font-semibold text-cream mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-cream/75 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5.5 OBJECTION HANDLING ───────────────────────────────────────── */}
      <section className="w-full px-4 py-14 md:py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              Before you ask
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream leading-snug">
              The three things every service business owner says first.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {objections.map((obj, i) => (
              <div
                key={i}
                className="rounded-[22px] bg-[#271520] border border-wine/20 p-7"
              >
                <p className="font-serif text-lg font-semibold text-cream leading-snug mb-3">
                  "{obj.question}"
                </p>
                <p className="text-sm text-cream/70 leading-relaxed">
                  {obj.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5.7 VERTICAL IDENTITY + MID-PAGE CTA ────────────────────── */}
      <section className="w-full px-4 py-12 md:py-16 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          {/* Vertical identity strip */}
          <div className="text-center mb-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-3">Built for your type of business</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Massage therapy",
                "Salon & spa",
                "Med spa",
                "Dental practice",
                "Chiropractic",
                "Home services",
                "Wellness & fitness",
                "Physical therapy",
              ].map((v) => (
                <span
                  key={v}
                  className="inline-block px-3 py-1.5 rounded-full border border-wine/25 bg-[#271520] text-xs text-cream/70"
                >
                  {v}
                </span>
              ))}
            </div>
            <p className="text-xs text-cream/45 mt-3">No migration. No rip-and-replace. We layer on top of the tools you already use.</p>
          </div>

          {/* Pricing strip — plainly visible, directly above the booking section */}
          <div className="rounded-[16px] border border-wine/30 bg-wine/10 px-5 py-3.5 text-center mb-4">
            <p className="text-sm md:text-base text-cream font-medium">
              All three agents from $397/mo.{" "}
              <span className="text-cream/65 font-normal">Launch rate, normally $497.</span>
            </p>
          </div>

          {/* Mid-page inline booking widget */}
          <div
            id="sb-booking-section"
            className="rounded-[22px] border border-wine/30 bg-[#271520] px-7 py-8 md:px-10 md:py-10 scroll-mt-20"
          >
            <div className="text-center mb-6">
              <p className="text-xs text-wine uppercase tracking-[0.22em] font-medium mb-2">The first step costs nothing</p>
              <p className="text-lg md:text-xl font-serif font-semibold text-cream leading-snug mb-2">
                Find out what your front desk is costing you.
              </p>
              <p className="text-sm text-cream/65 leading-relaxed max-w-xl mx-auto">
                Santa recovered $2,560 in 30 days without changing how she works. Pick a time below and we will audit your front desk on the call.
              </p>
            </div>
            <BookingCalendarEmbed
              id="sb-mid-page-booking"
              scriptStrategy="afterInteractive"
            />
            <p className="text-[11px] text-cream/40 text-center mt-4">Free · No pitch · Reply within one business day</p>
          </div>
        </div>
      </section>

      {/* ─── 6. FAQ ────────────────────────────────────────────────────────── */}
      <FAQ
        faqs={serviceFaqs}
        eyebrow="Questions"
        headlineStart="Straight"
        headlineAccent="answers."
        body="Real questions from service business owners before they request a Missed Call Audit."
      />

      {/* ─── 7. INTERNAL LINKS ─────────────────────────────────────────── */}
      <section className="w-full px-4 py-12 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-6 text-center">
            Further reading
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                href: "/resources/missed-call-recovery-for-service-businesses",
                label: "Missed-Call Recovery for Service Businesses",
                desc: "What happens to the calls you miss and how to get them back.",
              },
              {
                href: "/resources/missed-calls-to-missed-bookings",
                label: "Missed Calls to Missed Bookings",
                desc: "The data behind why unanswered calls become lost revenue.",
              },
              {
                href: "/resources/ai-front-desk-vs-answering-service",
                label: "AI Front Desk vs. Answering Service",
                desc: "How a managed AI system compares to a traditional answering service.",
              },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group rounded-[16px] bg-[#271520] border border-wine/15 p-5 hover:border-wine/40 transition-colors"
              >
                <p className="text-sm font-semibold text-cream group-hover:text-wine transition-colors leading-snug mb-2">
                  {link.label}
                </p>
                <p className="text-xs text-cream/55 leading-relaxed">{link.desc}</p>
                <p className="text-xs text-wine mt-3 flex items-center gap-1">
                  Read <IconArrowRight size={12} />
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. CTA ───────────────────────────────────────────────────────── */}
      <CTA
        eyebrow="The first step"
        headlineStart="Find out exactly what your front desk is"
        headlineAccent="costing you."
        body="In your free Missed Call Audit, we audit your front desk, missed call rate, and follow-up gaps. You leave with a clear number: what is leaking, what it is worth, and what the fix looks like. No pitch. No deck. Just the findings."
        trustLine="If it is not a fit, we will say so. No chase. No pressure."
        primaryCta={{ label: "Get Your Free Missed Call Audit", href: "/book" }}
        secondaryCta={{ label: "See Pricing", href: "/pricing" }}
        sourcePage="for_service_businesses"
        variant="calendar"
        calendarScriptStrategy="afterInteractive"
      />

      {/* Sticky mobile CTA — scrolls to the inline calendar section */}
      <ServiceBusinessesStickyCta />
    </div>
  );
}
