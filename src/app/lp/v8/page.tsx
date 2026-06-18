"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { BookingCalendarEmbed } from "@/components/booking-calendar-embed";
import { trackAuditCtaClick } from "@/lib/analytics";

/* Variant 8 — light/blush landing, faithful rebuild of the Claude design.
   Standalone (the /lp/* route skips the global dark shell).
   Palette: cream #FBF3EE / blush #FBEEE9 / white cards, ink #20131C,
   mauve #6E5B66 / #9A8089, wine #8B2A42 / #6B1A2E / #B5415E. */

const EASE = [0.22, 1, 0.36, 1] as const;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const features = [
  {
    title: "Answers your phone",
    body: "AI picks up every call with your custom greeting, answers common questions, and books appointments directly into your calendar.",
    icon: (
      <path d="M3 5a2 2 0 012-2h2.6a1 1 0 01.95.68l1.2 3.6a1 1 0 01-.27 1.06l-1.6 1.4a13 13 0 006.1 6.1l1.4-1.6a1 1 0 011.06-.27l3.6 1.2a1 1 0 01.68.95V19a2 2 0 01-2 2A16 16 0 013 5z" />
    ),
  },
  {
    title: "Texts back missed calls",
    body: "Instantly sends a personalized SMS to anyone who calls, turning silent hang-ups into booked appointments.",
    icon: <path d="M21 11.5a8.4 8.4 0 01-9 8.4L3 21l1.1-3.6A8.4 8.4 0 1121 11.5z" />,
  },
  {
    title: "Fills cancellations",
    body: "Reaches out to your waitlist the moment a spot opens, so your schedule stays full without you lifting a finger.",
    icon: <path d="M8 2v3M16 2v3M3 9h18M5 5h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zM9 14l2 2 4-4" />,
  },
  {
    title: "Reactivates lapsed clients",
    body: "Spots clients who have gone quiet and sends a warm, on-brand check-in before they book somewhere else.",
    icon: <path d="M12 21s-7-4.4-9.2-8.4A5 5 0 0112 6a5 5 0 019.2 6.6C19 16.6 12 21 12 21z" />,
  },
];

const steps = [
  { n: "1", when: "Day 1 – 3", title: "We map your front desk", body: "We audit every way a call, text, or web inquiry reaches you today, and exactly where it leaks." },
  { n: "2", when: "Day 4 – 10", title: "We build and train", body: "We set up call forwarding, train the AI on your services and policies, and connect your calendar." },
  { n: "3", when: "Day 11 – 14", title: "We go live with you", body: "We test together, refine the voice, and switch it on. You start catching every call." },
];

const testimonials = [
  { quote: "I was losing leads every week because I could not answer the phone during appointments. Now every call gets a response within minutes. My booking rate went up noticeably in the first month.", initials: "S", name: "Santa", role: "Massage Therapist · Laguna Niguel" },
  { quote: "The setup was painless. They built everything around my existing booking system. I did not have to change a single tool. It just works.", initials: "C", name: "Service Business Owner", role: "Salon Owner" },
];

const faqs = [
  { q: "How quickly can you get this live?", a: "Most practices are live within 14 days. We handle the entire setup: call forwarding, AI training on your services and policies, calendar integration, and testing." },
  { q: "What if the AI says something wrong?", a: "We train it on your exact services, policies, and tone, then test it with you before launch. You can review and adjust anything, and a real person is always reachable for anything sensitive." },
  { q: "Do I need to change my phone number?", a: "No. We forward your existing number, so nothing changes for your clients. Your number stays yours." },
  { q: "What does the free audit include?", a: "A focused review of where calls, texts, and inquiries slip through today, with a clear estimate of the revenue it is costing you. No pitch, no obligation." },
];

const workCopy: Record<"team" | "full", string> = {
  team: "When you're with a client, on a break, or after hours, the AI picks up, answers questions, and books the appointment. Your team stays in control. Nothing slips through.",
  full: "The AI runs your whole front desk — answering, texting back, booking, and following up — so every call, text, and missed call is handled, even when no one is available.",
};

export default function V8Page() {
  const [work, setWork] = useState<"team" | "full">("team");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [calls, setCalls] = useState(20);
  const [ticket, setTicket] = useState(150);

  const monthly = Math.round(calls * 4.33 * ticket * 0.4);
  const fmt = (n: number) => "$" + n.toLocaleString("en-US");
  const signalPay = monthly > 0 ? (397 / monthly).toFixed(1) : "—";
  const systemPay = monthly > 0 ? (897 / monthly).toFixed(1) : "—";

  const audit = (section: Parameters<typeof trackAuditCtaClick>[1]) =>
    trackAuditCtaClick("home", section, { destination: "/book" });

  return (
    <div className="min-h-screen bg-[#FBF3EE] text-[#20131C] font-sans antialiased">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-[#F0D9D2] bg-[#FBF3EE]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <span className="font-serif text-xl font-semibold">
            Ops <span className="text-[#8B2A42]">by Noell</span>
          </span>
          <Link href="/book" onClick={() => audit("navbar_primary")} className="rounded-full border border-[#8B2A42]/40 px-4 py-2 text-sm font-medium text-[#8B2A42] transition-colors hover:bg-[#8B2A42] hover:text-white">
            Book a Call
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 pt-12 pb-10 text-center">
        <Reveal>
          <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8B2A42]">
            Done-for-you AI front desk · Orange County
          </p>
          <h1 className="mx-auto mt-5 max-w-[16ch] font-serif text-[2.1rem] font-semibold leading-[1.1] tracking-tight md:text-5xl">
            While you&apos;re with a client,{" "}
            <span className="italic text-[#8B2A42]">who&apos;s picking up?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[#6E5B66]">
            Every missed call is a client who already booked somewhere else. We
            install an AI front desk that answers, follows up, and fills your
            calendar.{" "}
            <span className="font-semibold text-[#20131C]">Live in 14 days.</span>
          </p>
        </Reveal>

        {/* 3-step flow visual with ambient float */}
        <motion.div
          className="mx-auto mt-9 flex max-w-md items-stretch justify-center gap-2"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <FlowCard label="Missed call">
            <div className="flex flex-col items-center gap-1.5">
              <span className="h-1.5 w-9 rounded-full bg-[#22C55E]" />
              <span className="h-1.5 w-12 rounded-full bg-[#E7C9C1]" />
              <span className="h-1.5 w-8 rounded-full bg-[#E7C9C1]" />
            </div>
          </FlowCard>
          <Connector />
          <FlowCard label="Texts back" accent>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B2A42] text-xs font-bold text-white">AI</span>
          </FlowCard>
          <Connector />
          <FlowCard label="Booked">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBEEE9] text-[#8B2A42]">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </FlowCard>
        </motion.div>

        {/* Work-with-us toggle */}
        <Reveal delay={0.05}>
          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9A8089]">
            How would you like to work with us?
          </p>
          <div className="mx-auto mt-4 grid max-w-md grid-cols-2 gap-3">
            {(["team", "full"] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setWork(k)}
                className={`rounded-2xl px-4 py-4 text-sm font-semibold transition-all ${
                  work === k
                    ? "border border-[#8B2A42] bg-[#8B2A42] text-white shadow-[0_6px_18px_-4px_rgba(139,42,66,0.35)]"
                    : "border border-[#EAD3CB] bg-white text-[#20131C] hover:border-[#8B2A42]/40"
                }`}
              >
                {k === "team" ? "Alongside your team" : "Full AI front desk"}
              </button>
            ))}
          </div>
          <motion.p key={work} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-[#6E5B66]">
            {workCopy[work]}
          </motion.p>
        </Reveal>
      </section>

      {/* Proof card + CTA */}
      <section className="px-5 pb-12">
        <Reveal className="mx-auto max-w-md">
          <div className="rounded-3xl border border-[#EAD3CB] bg-white p-7 text-center shadow-[0_12px_34px_-14px_rgba(32,19,28,0.16)]">
            <p className="font-serif text-5xl font-semibold text-[#8B2A42]">$2,560</p>
            <p className="mt-1 text-sm text-[#6E5B66]">recovered in 30 days</p>
            <p className="my-4 text-[#B5415E]">&#9670;</p>
            <p className="font-semibold">Healing Hands by Santa</p>
            <p className="text-sm italic text-[#9A8089]">Laguna Niguel</p>
          </div>
          <Link href="/book" onClick={() => audit("offer")} className="mt-6 block w-full rounded-2xl bg-[#8B2A42] px-6 py-4 text-center text-base font-semibold text-white shadow-[0_10px_26px_-8px_rgba(139,42,66,0.45)] transition-colors hover:bg-[#6B1A2E]">
            Get Your Free Front Desk Audit
          </Link>
          <p className="mt-3 text-center text-xs text-[#9A8089]">
            HIPAA Compliant&nbsp;&nbsp;·&nbsp;&nbsp;Free. No pitch. Zero obligation.
          </p>
        </Reveal>
      </section>

      {/* Trust row */}
      <section className="border-y border-[#F0D9D2] bg-white px-5 py-7">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center text-[13px] text-[#6E5B66] md:flex-row md:justify-center md:gap-7">
          {["Salons, med spas, dental, HVAC", "Live in 14 days", "Month-to-month, no contracts", "Built around the tools you use"].map((t, i) => (
            <span key={t} className="flex items-center gap-3 md:gap-7">
              {i > 0 && <span className="hidden text-[#E0C4BC] md:inline">·</span>}
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Pain band */}
      <section className="bg-[#FBEEE9] px-5 py-14">
        <Reveal className="mx-auto max-w-md text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B2A42]">The quiet revenue leak</p>
          <h2 className="mt-3 font-serif text-[1.85rem] font-semibold">The cost of <span className="italic text-[#8B2A42]">silence.</span></h2>
        </Reveal>
        <div className="mx-auto mt-7 max-w-md space-y-3">
          {[
            { s: "70%", l: "of missed calls never leave a voicemail" },
            { s: "$60", l: "average cost per inbound lead" },
            { s: "5 min", l: "before a lead goes cold" },
          ].map((x, i) => (
            <Reveal key={x.s} delay={i * 0.06}>
              <div className="flex items-center gap-4 rounded-2xl border-l-4 border-[#8B2A42] bg-[#FDF6F2] px-5 py-4 text-left">
                <span className="font-serif text-3xl font-semibold text-[#8B2A42]">{x.s}</span>
                <span className="text-[15px] leading-snug text-[#6E5B66]">{x.l}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ROI estimator */}
      <section className="px-5 py-14">
        <Reveal className="mx-auto max-w-md text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9A8089]">60-second estimator</p>
          <h2 className="mt-3 font-serif text-[1.85rem] font-semibold">How much is your front desk <span className="italic text-[#8B2A42]">costing you?</span></h2>
        </Reveal>
        <Reveal className="mx-auto mt-7 max-w-md">
          <div className="rounded-3xl border border-[#EAD3CB] bg-white p-6 shadow-[0_12px_34px_-16px_rgba(32,19,28,0.14)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9A8089]">ROI calculator</p>
            <h3 className="mt-1 font-serif text-xl font-semibold">What could this recover for you?</h3>

            <label className="mt-5 block text-sm text-[#6E5B66]">
              Missed calls per week: <span className="font-semibold text-[#20131C]">{calls}</span>
              <input type="range" min={0} max={50} value={calls} onChange={(e) => setCalls(+e.target.value)} className="mt-2 w-full accent-[#8B2A42]" />
              <span className="flex justify-between text-[11px] text-[#9A8089]"><span>0</span><span>50</span></span>
            </label>
            <label className="mt-4 block text-sm text-[#6E5B66]">
              Average ticket value: <span className="font-semibold text-[#20131C]">${ticket}</span>
              <input type="range" min={25} max={1000} step={25} value={ticket} onChange={(e) => setTicket(+e.target.value)} className="mt-2 w-full accent-[#8B2A42]" />
              <span className="flex justify-between text-[11px] text-[#9A8089]"><span>$25</span><span>$1,000</span></span>
            </label>

            <div className="mt-5 border-t border-[#F0D9D2] pt-5">
              <p className="text-[11px] uppercase tracking-widest text-[#9A8089]">You&apos;re likely losing</p>
              <p className="font-serif text-4xl font-semibold text-[#8B2A42]">{fmt(monthly)}<span className="ml-2 font-sans text-base font-normal text-[#9A8089]">/month</span></p>
              <p className="mt-3 text-sm text-[#6E5B66]">Signal ($397/mo) pays for itself in {signalPay} months. System ($897/mo) pays for itself in {systemPay} months.</p>
              <p className="mt-4 text-xs leading-relaxed text-[#9A8089]">Conservative model. Assumes a 40% recovery rate on missed calls. Your actual recovery depends on call volume, timing, and offer.</p>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Features */}
      <section className="bg-white px-5 py-14">
        <Reveal className="mx-auto max-w-md text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B2A42]">Done-for-you operations</p>
          <h2 className="mt-3 font-serif text-[1.85rem] font-semibold">Everything <span className="italic text-[#8B2A42]">managed for you.</span></h2>
        </Reveal>
        <div className="mx-auto mt-8 max-w-md space-y-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.05}>
              <div className="rounded-3xl border border-[#F0DAD3] bg-[#FBEEE9] px-6 py-8 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F6E2DC] text-[#8B2A42]">
                  <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                </span>
                <h3 className="mt-4 font-serif text-xl font-semibold italic">{f.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6E5B66]">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="bg-[#FBEEE9] px-5 py-14">
        <Reveal className="mx-auto max-w-md text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B2A42]">From signed to live</p>
          <h2 className="mt-3 font-serif text-[1.85rem] font-semibold">Live in <span className="italic text-[#8B2A42]">14 days.</span></h2>
        </Reveal>
        <div className="mx-auto mt-8 max-w-md space-y-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="rounded-3xl border border-[#EAD3CB] bg-white p-6 shadow-[0_8px_22px_-14px_rgba(32,19,28,0.12)]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B2A42] font-serif text-lg italic text-white">{s.n}</span>
                <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[#8B2A42]">{s.when}</p>
                <h3 className="mt-1 font-serif text-xl font-semibold italic">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#6E5B66]">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white px-5 py-14">
        <Reveal className="mx-auto max-w-md text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B2A42]">Real results</p>
          <h2 className="mt-3 font-serif text-[1.85rem] font-semibold">What owners <span className="italic text-[#8B2A42]">tell us.</span></h2>
        </Reveal>
        <div className="mx-auto mt-8 max-w-md space-y-4">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <div className="rounded-3xl border border-[#F0DAD3] bg-[#FBEEE9] p-6">
                <p className="text-[15px] italic leading-relaxed text-[#4A3A44]">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B2A42] text-sm font-bold text-white">{t.initials}</span>
                  <span>
                    <span className="block text-sm font-semibold">{t.name}</span>
                    <span className="block text-[13px] text-[#9A8089]">{t.role}</span>
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FBEEE9] px-5 py-14">
        <Reveal className="mx-auto max-w-md text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B2A42]">Before you book</p>
          <h2 className="mt-3 font-serif text-[1.85rem] font-semibold">Frequently <span className="italic text-[#8B2A42]">asked.</span></h2>
        </Reveal>
        <div className="mx-auto mt-8 max-w-md space-y-3">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 0.04}>
              <div className="overflow-hidden rounded-2xl border border-[#EAD3CB] bg-white">
                <button type="button" onClick={() => setOpenFaq(openFaq === i ? null : i)} className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
                  <span className="font-semibold">{f.q}</span>
                  <span className={`text-[#8B2A42] transition-transform ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <p className="px-5 pb-5 text-[15px] leading-relaxed text-[#6E5B66]">{f.a}</p>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section className="bg-white px-5 py-14">
        <Reveal className="mx-auto max-w-md text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B2A42]">Free · No pitch · No deck</p>
          <h2 className="mt-3 font-serif text-[1.85rem] font-semibold">Get your free Front Desk Audit.</h2>
          <p className="mx-auto mt-4 max-w-sm text-[15px] leading-relaxed text-[#6E5B66]">
            Tell us where your front desk is leaking. We reply within one business
            day with a clear map of where you are losing revenue and what it is
            worth. Whether you work with us or not.
          </p>
        </Reveal>
        <div className="mx-auto mt-7 max-w-md overflow-hidden rounded-3xl border border-[#EAD3CB] bg-white p-2 shadow-[0_12px_34px_-16px_rgba(32,19,28,0.14)]">
          <BookingCalendarEmbed id="v8-booking" />
        </div>
      </section>

      {/* Dark CTA band */}
      <section className="px-5 pb-14">
        <Reveal className="mx-auto max-w-md">
          <div className="rounded-3xl bg-gradient-to-b from-[#8B2A42] to-[#5A1F30] px-7 py-10 text-center text-[#F7E5DF]">
            <h2 className="font-serif text-2xl font-semibold text-white">Ready to recover lost revenue?</h2>
            <p className="mx-auto mt-3 max-w-sm text-[14px] leading-relaxed text-[#F4DAD5]">
              Get a free analysis of your missed-call patterns and see exactly how
              much you can recover. No pitch, no commitment.
            </p>
            <Link href="/book" onClick={() => audit("final")} className="mt-6 block w-full rounded-2xl bg-white px-6 py-4 text-base font-semibold text-[#8B2A42] transition-colors hover:bg-[#FBEEE9]">
              Book Your Free Missed Call Audit
            </Link>
            <p className="mt-3 text-xs text-[#E7C9C1]">15-minute call · No credit card · No obligation</p>
          </div>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#F0D9D2] bg-[#FBF3EE] px-5 py-10">
        <div className="mx-auto max-w-md">
          <span className="font-serif text-lg font-semibold">Ops <span className="text-[#8B2A42]">by Noell</span></span>
          <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-[#6E5B66]">
            AI-powered operations for service businesses. Built, installed, and
            managed end-to-end.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#EAD3CB] bg-white px-3 py-2">
            <span className="flex gap-0.5 text-[#E0A43B]">{"★★★★★"}</span>
            <span className="text-[12px] font-semibold">5.0, rated by clients</span>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-[#9A8089]">
            © 2026 Ops by Noell · Mission Viejo, CA · Done for you. Managed
            end-to-end.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FlowCard({ children, label, accent = false }: { children: React.ReactNode; label: string; accent?: boolean }) {
  return (
    <div className={`flex flex-1 flex-col items-center justify-center rounded-2xl border bg-white px-3 py-4 ${accent ? "border-[#8B2A42]/30" : "border-[#EAD3CB]"}`}>
      {children}
      <span className="mt-3 block text-[10px] font-medium uppercase tracking-wide text-[#9A8089]">{label}</span>
    </div>
  );
}

function Connector() {
  return (
    <div className="flex items-center">
      <span className="h-px w-3 bg-[#E0C4BC]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#B5415E]" />
      <span className="h-px w-3 bg-[#E0C4BC]" />
    </div>
  );
}
