"use client";
/**
 * /upgrade - Client component for the upgrade landing page.
 * Targets: Rosie AI, Goodcall, My AI Front Desk users who hit the ceiling.
 * Uses native opsbynoell.com components: Hero, FAQ, CTA.
 * UTM: utm_source=upgrade-landing&utm_medium=cta&utm_campaign=outgrown
 */

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { IconCheck } from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { FAQ, type FaqItem } from "@/components/faq";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";

// Scroll reveal helper
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.55s cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 0.55s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// Calendly inline embed
function CalendlyEmbed() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);
  return (
    <div
      className="calendly-inline-widget"
      data-url="https://calendly.com/opsbynoell/30-minute-meeting-clone?hide_event_type_details=1&hide_gdpr_banner=1&text_color=ffffff&primary_color=8B2A42&background_color=1F1219"
      style={{ minWidth: 320, height: 700 }}
    />
  );
}

// Audio demo player
function AudioDemo() {
  return (
    <div className="w-full max-w-xl mx-auto mt-6">
      <div className="rounded-[22px] bg-[#271520] border border-white/10 p-5 shadow-[0px_4px_8px_0px_rgba(28,25,23,0.08)]">
        <p className="text-[10px] uppercase tracking-[0.2em] text-cream/60 mb-3 text-center">
          Hear Nova · Noell Front Desk AI · Live demo call
        </p>
        <audio
          controls
          preload="none"
          className="w-full"
          style={{ accentColor: "#8B2A42", colorScheme: "dark" }}
        >
          <source src="/noell-demo-call.mp3" type="audio/mpeg" />
          Your browser does not support audio playback.
        </audio>
        <p className="text-[10px] text-cream/40 text-center mt-2">
          AI-generated demo · Nova (Noell Front Desk AI) + caller · Not a real client call
        </p>
      </div>
    </div>
  );
}

// Comparison table data
const COMPETITORS = [
  { name: "Rosie AI", price: "$50-$150/mo", setup: "DIY", integration: "Basic webhook", voice: "Good", support: "Self-serve" },
  { name: "Goodcall", price: "$49-$99/mo", setup: "DIY", integration: "Limited", voice: "Robotic lag", support: "Self-serve" },
  { name: "My AI Front Desk", price: "$65-$97/mo", setup: "DIY", integration: "Zapier required", voice: "Good", support: "Email only" },
  { name: "Smith.ai", price: "$285-$750/mo", setup: "Assisted", integration: "Good", voice: "Human + AI", support: "Live agents" },
];

const NOELL = { name: "Ops by Noell", price: "$397-$897/mo", setup: "Done for you", integration: "Native CRM", voice: "Human-quality AI", support: "Managed team" };

// Pain points
const PAIN_POINTS = [
  {
    number: "01",
    title: "\"Native integration\" meant building a Zapier workflow yourself.",
    desc: "My AI Front Desk's top complaint. You were sold native CRM integration. What you got was a Zapier template and a support ticket. Ops by Noell connects directly. No middleware, no DIY.",
    label: "My AI Front Desk users",
  },
  {
    number: "02",
    title: "The voice sounds robotic. Callers hang up.",
    desc: "Goodcall's top complaint is noticeable latency and a synthetic feel. When callers sense they are talking to a machine, they disengage. Noell Front Desk uses human-quality voice models tuned to your business.",
    label: "Goodcall users",
  },
  {
    number: "03",
    title: "You hit the customization ceiling.",
    desc: "Rosie AI is excellent for voicemail replacement. But when you need multi-step booking flows, deposit capture, or reactivation sequences, there is no path forward. Ops by Noell builds exactly what your business needs.",
    label: "Rosie AI users",
  },
  {
    number: "04",
    title: "Inconsistent quality. Different agent every time.",
    desc: "Smith.ai's biggest complaint is that quality varies by human agent. An AI system is consistent by design. Same voice, same accuracy, same response time on every call. No training lag, no bad days.",
    label: "Smith.ai users",
  },
];

// Testimonials
const TESTIMONIALS = [
  {
    quote: "I used to dread Mondays because there would always be gaps I didn't expect. Now I open my calendar and it's just full. The reminders go out and people show up. I don't think about it anymore.",
    author: "Santa E.",
    role: "Licensed Massage Therapist · Laguna Niguel, CA",
    result: "$960 recovered in 14 days",
  },
  {
    quote: "We tried Rosie first. It was fine for answering calls but we couldn't get it to connect to our booking software the way we needed. Ops by Noell had it wired in a week and we haven't touched it since.",
    author: "Marcus T.",
    role: "Owner, Precision Auto Detailing",
    result: "Zero setup headaches",
  },
  {
    quote: "The voice quality was the first thing our clients noticed. Two people asked if they'd spoken to someone on our team. That's exactly what we wanted.",
    author: "Priya K.",
    role: "Director, Bloom Wellness Studio",
    result: "Clients can't tell it's AI",
  },
];

// FAQ data
const upgradeFaqs: FaqItem[] = [
  {
    id: "upgrade-different",
    question: "What makes Ops by Noell different from Rosie AI or Goodcall?",
    answer: "Rosie AI and Goodcall are self-serve tools. You configure them, you maintain them, and when something breaks you fix it. Ops by Noell is a done-for-you managed service. We build the system, connect it to your CRM natively, and our team monitors and tunes it every month. You do not touch a dashboard unless you want to.",
  },
  {
    id: "upgrade-crm",
    question: "Do I need to build a Zapier workflow to connect my CRM?",
    answer: "No. Native CRM integration is included in every install. We connect directly to your existing booking software or CRM. No Zapier, no middleware, no DIY. If you have tried My AI Front Desk and discovered that 'native integration' meant building a Zapier workflow yourself, this is the fix.",
  },
  {
    id: "upgrade-voice",
    question: "Will my callers know they are talking to an AI?",
    answer: "Most do not. We use human-quality voice models and tune the persona specifically for your business. Your tone, your service names, your booking flow. Clients regularly ask if they just spoke to someone on your team. That is the goal.",
  },
  {
    id: "upgrade-billing",
    question: "Are there annual contracts or cancellation fees?",
    answer: "No. Every engagement is month-to-month. No cancellation fees, no retention calls, no fine print. We also notify you before any usage limits are reached so there are never surprise charges at the end of the month. If you are not thrilled in the first 30 days, we refund you.",
  },
  {
    id: "upgrade-timeline",
    question: "How long until the system is live?",
    answer: "Most service business installs are live within 14 days. That includes building the AI persona, connecting your CRM, configuring your booking flow, and running a live test before we hand it over. You are not handed a login and left to figure it out.",
  },
];

export function UpgradePageClient() {
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      {/* Sticky Book Now Bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            key="sticky-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="fixed bottom-0 inset-x-0 z-50 flex justify-center px-4 pb-4"
          >
            <div
              className="w-full max-w-xl flex items-center justify-between gap-4 rounded-[16px] px-5 py-3.5 border border-white/10"
              style={{
                background: "rgba(31,18,25,0.95)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 -2px 24px rgba(139,42,66,0.18), 0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              <div className="hidden sm:block">
                <p className="text-[11px] uppercase tracking-[0.2em] text-cream/60 leading-none mb-0.5">
                  Free Revenue Signal Report
                </p>
                <p className="text-sm text-cream/70">
                  Find out what your front desk is missing.
                </p>
              </div>
              <Link
                href="#book"
                className="shrink-0 h-10 px-6 rounded-[8px] text-sm font-medium text-cream transition duration-200 hover:-translate-y-0.5 inline-flex items-center justify-center no-underline w-full sm:w-auto"
                style={{
                  background: "linear-gradient(181deg, #8B4D5E 18.12%, #5A1F30 99.57%)",
                  boxShadow: "0px 4px 8px 0px rgba(90,31,48,0.18), 0px 0px 0px 1px rgba(90,31,48,0.12), 0px 1px 1px 2px rgba(255,255,255,0.28) inset",
                }}
                onClick={() => setShowStickyBar(false)}
              >
                Book Your Free Audit
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <Hero
        headlineLine1Start="You have outgrown your"
        headlineLine1Accent=""
        headlineLine2Start=""
        headlineLine2Accent="basic AI front desk."
        headlineLine2Smaller={false}
        body="Rosie AI and Goodcall are fine for voicemail replacement. When you need real CRM integration, a voice that sounds human, and a team that manages it for you, there is only one option."
        footnote="Built for service businesses that have already tried the basic tools and need more."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See the comparison", href: "#comparison" }}
        showProofBar={true}
      />

      {/* Audio Demo */}
      <section className="w-full px-4 pb-16">
        <Reveal>
          <AudioDemo />
        </Reveal>
      </section>

      {/* Pain Points */}
      <section className="w-full py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
                The Problem
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
                Four complaints every basic{" "}
                <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                  AI tool user has.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            {PAIN_POINTS.map((p, i) => (
              <Reveal key={p.number} delay={i * 80}>
                <div className="group relative flex flex-col rounded-[22px] bg-[#271520] p-8 md:p-10 border border-wine/20 hover:border-wine/40 transition-all duration-300 h-full shadow-[0px_4px_8px_0px_rgba(28,25,23,0.05),0px_15px_15px_0px_rgba(28,25,23,0.04)]">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-wine/85 mb-3">
                    {p.number}
                  </p>
                  <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-4 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-cream/75 leading-relaxed mb-6 flex-1">
                    {p.desc}
                  </p>
                  <div className="text-[11px] uppercase tracking-[0.08em] text-cream/50">
                    Common: {p.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="comparison" className="w-full py-16 md:py-24 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
                The Honest Comparison
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight mb-4">
                How the tools actually{" "}
                <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                  stack up.
                </span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="overflow-x-auto rounded-[22px] border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-[#271520]">
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-cream/60 font-medium">Tool</th>
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-cream/60 font-medium">Price</th>
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-cream/60 font-medium">Setup</th>
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-cream/60 font-medium">Integration</th>
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-cream/60 font-medium">Voice</th>
                    <th className="text-left px-5 py-4 text-[11px] uppercase tracking-[0.2em] text-cream/60 font-medium">Support</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITORS.map((c, i) => (
                    <tr key={c.name} className={cn("border-b border-white/5", i % 2 === 0 ? "bg-[#1F1219]" : "bg-[#271520]/50")}>
                      <td className="px-5 py-4 text-cream/80 font-medium">{c.name}</td>
                      <td className="px-5 py-4 text-cream/60">{c.price}</td>
                      <td className="px-5 py-4 text-cream/60">{c.setup}</td>
                      <td className="px-5 py-4 text-cream/60">{c.integration}</td>
                      <td className="px-5 py-4 text-cream/60">{c.voice}</td>
                      <td className="px-5 py-4 text-cream/60">{c.support}</td>
                    </tr>
                  ))}
                  {/* Noell row - highlighted */}
                  <tr className="bg-wine/10 border-t-2 border-wine/30">
                    <td className="px-5 py-4 font-semibold text-cream">{NOELL.name}</td>
                    <td className="px-5 py-4 text-cream">{NOELL.price}</td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-wine font-medium">
                        <IconCheck size={14} /> {NOELL.setup}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-wine font-medium">
                        <IconCheck size={14} /> {NOELL.integration}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-wine font-medium">
                        <IconCheck size={14} /> {NOELL.voice}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 text-wine font-medium">
                        <IconCheck size={14} /> {NOELL.support}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full py-16 md:py-24 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12">
              <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
                From the field
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
                What businesses say after{" "}
                <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                  they upgrade.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.author} delay={i * 80}>
                <div className="flex flex-col rounded-[22px] bg-[#271520] p-8 border border-white/10 h-full shadow-[0px_4px_8px_0px_rgba(28,25,23,0.05)]">
                  <blockquote className="text-cream/80 leading-relaxed italic mb-6 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div>
                    <p className="text-sm font-semibold text-cream">{t.author}</p>
                    <p className="text-[11px] text-cream/50 mt-0.5">{t.role}</p>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-wine mt-3">{t.result}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Billing Guarantee */}
      <section className="w-full py-12 px-4 border-t border-white/10">
        <Reveal>
          <div className="max-w-2xl mx-auto rounded-[22px] bg-[#271520] border border-wine/20 p-8 md:p-10 text-center shadow-[0px_4px_8px_0px_rgba(28,25,23,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">Our Guarantee</p>
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-4 leading-snug">
              Month-to-month. No surprises. 30-day refund.
            </h3>
            <p className="text-cream/70 leading-relaxed mb-6">
              No annual contracts. No cancellation fees. No surprise overages. We notify you before any usage limits are reached. If you are not thrilled in the first 30 days, we refund you. No questions asked.
            </p>
            <div className="grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
              {[
                { label: "Month-to-month", sub: "Cancel anytime" },
                { label: "30-day refund", sub: "If it is not a fit" },
                { label: "Zero overages", sub: "We notify you first" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <p className="text-sm font-semibold text-cream">{item.label}</p>
                  <p className="text-[11px] text-cream/50 mt-1">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Inline Calendly Booking */}
      <section id="book" className="w-full py-16 md:py-24 px-4 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
                Book Your Free Audit
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight mb-4">
                Pick a time.{" "}
                <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                  We will take it from there.
                </span>
              </h2>
              <p className="text-cream/70 max-w-md mx-auto">
                No pitch. No pressure. You will leave with a clear map of what is leaking and what it is worth.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="rounded-[22px] overflow-hidden border border-white/10 shadow-[0px_4px_8px_0px_rgba(28,25,23,0.08)]">
              <CalendlyEmbed />
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        eyebrow="Common Questions"
        headlineStart="Straight answers."
        headlineAccent="No pitch."
        body="Real questions from businesses that have tried the basic tools and are ready for more."
        faqs={upgradeFaqs}
      />

      {/* Final CTA */}
      <CTA
        eyebrow="The First Step"
        headlineStart="Find out what your operations"
        headlineAccent="are missing."
        body="We map the leaks in your front desk and follow-up system. You will know what is being missed, what it may be worth, and whether Ops by Noell is the right fit."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See How It Works", href: "/systems" }}
        trustLine="No pitch. No pressure. If it is not a fit, we will say so."
        sourcePage="upgrade"
        sourceSection="final_cta"
      />
    </div>
  );
}
