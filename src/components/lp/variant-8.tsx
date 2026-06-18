"use client";

/**
 * Variant 8 — "Trust · On-Brand"
 *
 * Rebuild of Variation 8 from the Figma Make preview
 * (mono-vocal-40356019.figma.site): burgundy-on-white palette and copy.
 *
 * The original Figma frame is mobile-only, so mobile mirrors it while desktop
 * is a purpose-built "bold SaaS" landing page: an animated live-call device
 * mockup in the hero, a trust strip, alternating section bands, a two-column
 * FAQ, a full-bleed CTA, and a footer.
 *
 * Motion (motion/react) mirrors the original's framer-motion technique:
 * staggered fade + rise reveals (ease-out) and a count-up on the proof stat
 * ($0 → $2,560 over ~2.2s — matching the original). Everything degrades safely
 * under prefers-reduced-motion (fully visible, no movement).
 *
 * Palette (sampled from the Figma render):
 *   burgundy #7B2044   ink #101828   body #475569   muted #717182
 *   pink hair #D9A8BC / #EAD3DF   hero wash #FDF4F7   cream #FAF6F1
 */

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useInView,
  animate,
  type Variants,
} from "motion/react";
import {
  IconUsers,
  IconCpu,
  IconPhoneRinging,
  IconMessage2Bolt,
  IconCalendarCheck,
  IconShieldCheck,
  IconCircleCheck,
  IconChevronDown,
  IconArrowRight,
  IconStarFilled,
  IconCheck,
} from "@tabler/icons-react";

const BOOK_HREF = "/book";
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const trustedBy = [
  "Med Spas",
  "Dental",
  "Salons",
  "Massage",
  "Chiropractic",
  "Estheticians",
];

const stats = [
  { figure: "70%", label: "of missed calls never leave a voicemail" },
  { figure: "$60", label: "average cost per inbound lead" },
  { figure: "5 min", label: "before a lead goes cold" },
];

const features = [
  {
    Icon: IconPhoneRinging,
    title: "Answers your phone",
    body: "AI picks up every call with your custom greeting, answers common questions, and books appointments directly into your calendar.",
  },
  {
    Icon: IconMessage2Bolt,
    title: "Texts back missed calls",
    body: "Instantly sends a personalized SMS to anyone who calls, converting silent hang-ups into booked appointments.",
  },
  {
    Icon: IconCalendarCheck,
    title: "Fills cancellations automatically",
    body: "Proactively reaches out to your waitlist when spots open up, so your schedule stays full without lifting a finger.",
  },
];

const faqs = [
  {
    q: "How quickly can you get this live?",
    a: "Most service-business installs are live within 14 days. Your free Missed Call Audit delivers findings in the first session, before anything is built.",
  },
  {
    q: "What if the AI says something wrong?",
    a: "It answers from a script you approve and only books inside the rules you set. Anything it is unsure about is handed to your team, and every call is logged so you can review it.",
  },
  {
    q: "Do I need to change my phone number?",
    a: "No. We forward your existing number, so callers reach the same line they always have. Nothing on your printed materials or listings has to change.",
  },
  {
    q: "What does the free audit include?",
    a: "A clear map of where calls are leaking, what those missed calls are worth each month, and exactly what the fix looks like. No pitch, no obligation.",
  },
];

const paths = {
  team: {
    Icon: IconUsers,
    label: "Alongside your team",
    body: "When you're with a client, on a break, or after hours — the AI picks up, answers questions, and books the appointment. Your team stays in control. Nothing slips through.",
  },
  full: {
    Icon: IconCpu,
    label: "Full AI front desk",
    body: "Hand the phones over entirely. The AI answers every call, follows up on every missed one, and books straight into your calendar — day or night, no front-desk staff required.",
  },
} as const;

export function Variant8Page() {
  const reduce = useReducedMotion();
  const [activePath, setActivePath] = useState<keyof typeof paths>("team");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const path = paths[activePath];

  return (
    <div className="min-h-screen w-full bg-white font-sans text-[#101828] antialiased">
      {/* ── Navbar ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-[#EFE3DA] bg-[#FAF6F1]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <Link href="/" className="leading-none" aria-label="Ops by Noell, home">
            <span className="font-serif text-2xl font-semibold text-[#7B2044] md:text-3xl">
              Ops
            </span>
            <span className="ml-1 font-serif text-sm italic text-[#7B2044]/70 md:text-base">
              by Noell
            </span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-semibold text-[#475569] lg:flex">
            <a href="#how" className="transition-colors hover:text-[#7B2044]">
              How it works
            </a>
            <a href="#features" className="transition-colors hover:text-[#7B2044]">
              What you get
            </a>
            <a href="#faq" className="transition-colors hover:text-[#7B2044]">
              FAQ
            </a>
          </nav>
          <Link
            href={BOOK_HREF}
            className="rounded-full bg-[#7B2044] px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#651838] md:px-5 md:py-2 md:text-sm"
          >
            Book a Call
          </Link>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-x-clip">
        {/* depth: soft radial glow + faint grid */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#FDF4F7] to-white" />
        <div className="pointer-events-none absolute -top-24 right-0 h-[36rem] w-[36rem] rounded-full bg-[#7B2044]/10 blur-3xl" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-6 pb-24 pt-14 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:pb-28 lg:pt-24">
          {/* Left: copy + CTA */}
          <motion.div
            initial={reduce ? false : "hidden"}
            animate="show"
            variants={stagger}
            className="relative text-center lg:text-left"
          >
            <motion.span
              variants={rise}
              className="inline-flex items-center gap-2 rounded-full border border-[#EAD3DF] bg-white/70 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#7B2044] shadow-sm backdrop-blur md:text-xs"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A]" />
              Done-for-you AI front desk · Orange County
            </motion.span>
            <motion.h1
              variants={rise}
              className="mx-auto mt-6 max-w-[16ch] text-[38px] font-bold leading-[1.04] tracking-tight sm:text-5xl lg:mx-0 lg:text-[68px]"
            >
              While you&apos;re with a client,{" "}
              <span className="text-[#7B2044]">who&apos;s picking up?</span>
            </motion.h1>
            <motion.p
              variants={rise}
              className="mx-auto mt-6 max-w-[46ch] text-base leading-relaxed text-[#475569] lg:mx-0 lg:text-lg"
            >
              An AI front desk that answers every call, texts back the ones you
              miss, and books appointments straight into your calendar — built,
              installed, and managed for you.
            </motion.p>
            <motion.div
              variants={rise}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
            >
              <Link
                href={BOOK_HREF}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7B2044] px-7 py-4 text-base font-bold text-white shadow-[0_12px_24px_-8px_rgba(123,32,68,0.5)] transition-colors hover:bg-[#651838] sm:w-auto"
              >
                Get Your Free Missed Call Audit
                <IconArrowRight className="h-5 w-5" stroke={2} />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-1.5 rounded-xl px-5 py-4 text-base font-bold text-[#7B2044] transition-colors hover:bg-[#7B2044]/5"
              >
                See how it works
              </a>
            </motion.div>
            <motion.div
              variants={rise}
              className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-[#717182] sm:text-sm lg:justify-start"
            >
              <span className="flex items-center gap-1.5">
                <IconShieldCheck className="h-4 w-4 text-[#7B2044]" stroke={1.8} />
                HIPAA Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <IconCircleCheck className="h-4 w-4 text-[#16A34A]" stroke={1.8} />
                Free. No pitch.
              </span>
              <span className="flex items-center gap-1">
                <span className="flex">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <IconStarFilled key={i} className="h-3.5 w-3.5 text-[#E0A500]" />
                  ))}
                </span>
                <span className="ml-1">Loved by local owners</span>
              </span>
            </motion.div>
          </motion.div>

          {/* Right: animated live-call device mockup */}
          <Reveal delay={reduce ? 0 : 0.15} className="relative">
            <LiveCallMockup />
          </Reveal>
        </div>
      </section>

      {/* ── Trust strip ────────────────────────────────────────────── */}
      <section className="border-y border-[#F1E4EB] bg-white px-6 py-7 md:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-x-8 gap-y-3 md:flex-row md:justify-between">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#717182]">
            Trusted by Orange County service businesses
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {trustedBy.map((t) => (
              <span
                key={t}
                className="text-sm font-semibold text-[#7B2044]/70"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Path selector ──────────────────────────────────────────── */}
      <section id="how" className="bg-white px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-2xl">
          <Reveal>
            <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#717182] md:text-xs">
              How would you like to work with us?
            </p>
            <div className="relative mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-[#EAD3DF] bg-[#FDF4F7] p-1.5">
              {(Object.keys(paths) as Array<keyof typeof paths>).map((key) => {
                const isActive = key === activePath;
                const { Icon, label } = paths[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActivePath(key)}
                    aria-pressed={isActive}
                    className={`relative flex items-center justify-center gap-1.5 rounded-xl px-3 py-3 text-center text-sm font-bold transition-colors ${
                      isActive ? "text-white" : "text-[#7B2044] hover:bg-white/60"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="pathPill"
                        className="absolute inset-0 rounded-xl bg-[#7B2044] shadow-sm"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      <Icon className="h-4 w-4 shrink-0" stroke={1.8} />
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="mt-6 min-h-[6rem] md:min-h-[5rem]">
              <AnimatePresence mode="wait">
                <motion.p
                  key={activePath}
                  initial={reduce ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                  className="mx-auto max-w-[48ch] text-center text-base leading-relaxed text-[#475569] md:text-lg"
                >
                  {path.body}
                </motion.p>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── The cost of missed calls ───────────────────────────────── */}
      <section className="border-y border-[#F1E4EB] bg-[#FDF4F7] px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="mb-12">
            <SectionHeading>The cost of missed calls</SectionHeading>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-7">
            {stats.map((s) => (
              <StaggerItem
                key={s.figure}
                className="flex items-center gap-5 rounded-2xl border border-[#D9A8BC] border-l-[5px] border-l-[#7B2044] bg-white p-6 md:flex-col md:items-start md:gap-3 md:p-8"
              >
                <p className="w-[5.5rem] shrink-0 text-[34px] font-bold leading-none text-[#7B2044] md:w-auto md:text-5xl">
                  {s.figure}
                </p>
                <p className="text-base leading-snug text-[#475569]">{s.label}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Everything managed for you ─────────────────────────────── */}
      <section id="features" className="bg-white px-6 py-16 md:px-8 md:py-24">
        <div className="mx-auto w-full max-w-6xl">
          <Reveal className="mb-12">
            <SectionHeading>Everything managed for you</SectionHeading>
          </Reveal>
          <StaggerGroup className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map(({ Icon, title, body }) => (
              <StaggerItem
                key={title}
                className="flex flex-col rounded-2xl border border-[#EAD3DF] bg-white p-8 text-center transition-shadow duration-200 hover:shadow-[0_16px_40px_-12px_rgba(123,32,68,0.18)]"
              >
                <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FDF4F7] text-[#7B2044]">
                  <Icon className="h-7 w-7" stroke={1.6} />
                </span>
                <h3 className="text-lg font-bold text-[#101828]">{title}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[#475569]">
                  {body}
                </p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* ── Frequently asked (two-column on desktop) ───────────────── */}
      <section
        id="faq"
        className="border-y border-[#F1E4EB] bg-[#FAF6F1] px-6 py-16 md:px-8 md:py-24"
      >
        <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal className="lg:sticky lg:top-28 lg:self-start">
            <div className="text-center lg:text-left">
              <div className="lg:hidden">
                <SectionHeading>Frequently asked</SectionHeading>
              </div>
              <div className="hidden lg:block">
                <SectionHeading align="left">Frequently asked</SectionHeading>
              </div>
              <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[#475569] lg:mx-0">
                Straight answers to what owners ask before they book. Still have a
                question?
              </p>
              <Link
                href={BOOK_HREF}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[#7B2044] underline-offset-4 hover:underline"
              >
                Ask us on a free call
                <IconArrowRight className="h-4 w-4" stroke={2} />
              </Link>
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((item, i) => {
              const isOpen = openFaq === i;
              const panelId = `v8-faq-panel-${i}`;
              const buttonId = `v8-faq-button-${i}`;
              return (
                <Reveal key={item.q} delay={reduce ? 0 : i * 0.05}>
                  <div className="overflow-hidden rounded-2xl border border-[#EAD3DF] bg-white">
                    <h3 className="m-0">
                      <button
                        type="button"
                        id={buttonId}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left md:px-6 md:py-5"
                      >
                        <span className="text-[15px] font-bold text-[#101828] md:text-base">
                          {item.q}
                        </span>
                        <motion.span
                          aria-hidden="true"
                          initial={false}
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="inline-flex shrink-0"
                        >
                          <IconChevronDown
                            className="h-5 w-5 text-[#7B2044]"
                            stroke={2}
                          />
                        </motion.span>
                      </button>
                    </h3>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key={panelId}
                          id={panelId}
                          role="region"
                          aria-labelledby={buttonId}
                          initial={reduce ? false : { height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 400, damping: 40 }}
                          className="overflow-hidden px-5 md:px-6"
                        >
                          <p className="pb-5 text-[14px] leading-relaxed text-[#475569] md:text-[15px]">
                            {item.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Closing CTA (full-bleed) ───────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#7B2044] px-6 py-20 md:px-8 md:py-28">
        <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <Reveal className="relative mx-auto w-full max-w-3xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
            <IconCircleCheck className="h-8 w-8 text-white" stroke={1.8} />
          </div>
          <h2 className="mx-auto mt-6 max-w-[20ch] text-3xl font-bold leading-[1.12] text-white md:text-5xl">
            Ready to recover lost revenue?
          </h2>
          <p className="mx-auto mt-5 max-w-[48ch] text-base leading-relaxed text-white/80 md:text-lg">
            Get a free analysis of your missed call patterns and see exactly how
            much you can recover — no pitch, no commitment.
          </p>
          <Link
            href={BOOK_HREF}
            className="mx-auto mt-8 inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-white px-7 py-4 text-base font-bold text-[#7B2044] shadow-lg transition-colors hover:bg-[#FDF4F7]"
          >
            Book Your Free Missed Call Audit
            <IconArrowRight className="h-5 w-5" stroke={2} />
          </Link>
          <p className="mt-4 text-xs text-white/70 md:text-sm">
            15-minute call · No credit card · No obligation
          </p>
        </Reveal>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="bg-[#FAF6F1] px-6 py-10 md:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
          <div>
            <span className="font-serif text-xl font-semibold text-[#7B2044]">
              Ops
            </span>
            <span className="ml-1 font-serif text-sm italic text-[#7B2044]/70">
              by Noell
            </span>
            <p className="mt-1 text-xs text-[#717182]">
              Done-for-you AI front desk · Orange County
            </p>
          </div>
          <div className="flex items-center gap-5 text-xs text-[#717182]">
            <Link href="/legal/privacy" className="hover:text-[#7B2044]">
              Privacy
            </Link>
            <Link href="/legal/terms" className="hover:text-[#7B2044]">
              Terms
            </Link>
            <span>© {new Date().getFullYear()} Ops by Noell</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────── Live-call mockup ─────────────────────────── */

function LiveCallMockup() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const show = reduce || inView;

  const captions = [
    { side: "in" as const, text: "Hi, do you have anything Tuesday afternoon?" },
    { side: "ai" as const, text: "Yes — 2:00 PM is open. I can book that for you now." },
  ];

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[22rem] pb-10">
      {/* phone shell */}
      <div className="rounded-[2.4rem] border border-[#EAD3DF] bg-white p-2.5 shadow-[0_40px_90px_-30px_rgba(123,32,68,0.45)]">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#FDF4F7] to-white p-5 pb-16">
          {/* notch */}
          <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-[#EAD3DF]" />

          {/* header */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7B2044]">
              Ops AI · Front Desk
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-[#16A34A]">
              <span className="relative flex h-2 w-2">
                {!reduce && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#16A34A]/60" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#16A34A]" />
              </span>
              Live
            </span>
          </div>

          {/* caller */}
          <div className="mt-5 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7B2044] text-sm font-bold text-white">
              HH
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-[#101828]">
                Healing Hands by Santa
              </p>
              <p className="text-xs text-[#717182]">
                Incoming call · Laguna Niguel
              </p>
            </div>
          </div>

          {/* waveform */}
          <div className="mt-5 flex h-10 items-center justify-center gap-[3px]">
            {Array.from({ length: 22 }).map((_, i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-[#7B2044]/70"
                style={{ height: 8 + ((i * 7) % 18) }}
                animate={
                  reduce ? undefined : { scaleY: [0.4, 1, 0.55, 0.9, 0.4] }
                }
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: (i % 6) * 0.08,
                }}
              />
            ))}
          </div>

          {/* captions */}
          <div className="mt-4 space-y-2">
            {captions.map((c, i) => (
              <motion.div
                key={i}
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={show ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: reduce ? 0 : 0.5 + i * 0.7, duration: 0.4, ease: EASE_OUT }}
                className={c.side === "ai" ? "flex justify-end" : "flex justify-start"}
              >
                <span
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-snug ${
                    c.side === "ai"
                      ? "rounded-br-sm bg-[#7B2044] text-white"
                      : "rounded-bl-sm bg-white text-[#475569] shadow-sm"
                  }`}
                >
                  {c.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* booked confirmation */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.9 }}
            animate={show ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: reduce ? 0 : 2.1, type: "spring", stiffness: 300, damping: 20 }}
            className="mt-4 flex items-center gap-2 rounded-xl border border-[#16A34A]/30 bg-[#16A34A]/10 px-3.5 py-2.5"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#16A34A] text-white">
              <IconCheck className="h-4 w-4" stroke={3} />
            </span>
            <span className="text-xs font-bold text-[#15803D]">
              Appointment booked · Tue 2:00 PM
            </span>
          </motion.div>
        </div>
      </div>

      {/* floating proof stat card */}
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 16 }}
        animate={show ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: reduce ? 0 : 0.9, duration: 0.5, ease: EASE_OUT }}
        className="absolute -bottom-1 left-1/2 w-[14rem] -translate-x-1/2 rounded-2xl border border-[#EAD3DF] bg-white/95 p-4 text-center shadow-[0_20px_50px_-20px_rgba(123,32,68,0.4)] backdrop-blur"
      >
        <CountUp
          to={2560}
          className="text-3xl font-bold leading-none text-[#7B2044]"
          start={show}
        />
        <p className="mt-1 text-[11px] font-semibold text-[#717182]">
          recovered in 30 days · Healing Hands by Santa
        </p>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────── Reusable helpers ─────────────────────────── */

/** Counts up to `to` when scrolled into view; final value under reduced motion. */
function CountUp({
  to,
  prefix = "$",
  className,
  start,
}: {
  to: number;
  prefix?: string;
  className?: string;
  start?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const ownInView = useInView(ref, { once: true, amount: 0.6 });
  const trigger = start ?? ownInView;
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const controls = animate(0, to, {
      duration: reduce ? 0 : 2.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [trigger, reduce, to]);

  return (
    <p
      ref={ref}
      className={className}
      aria-label={`${prefix}${to.toLocaleString("en-US")}`}
    >
      {prefix}
      {value.toLocaleString("en-US")}
    </p>
  );
}

/** Fade + rise on scroll-into-view; renders statically under reduced motion. */
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

function StaggerGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      variants={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} variants={rise}>
      {children}
    </motion.div>
  );
}

function SectionHeading({
  children,
  align = "center",
}: {
  children: React.ReactNode;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <h2 className="text-2xl font-bold tracking-tight text-[#101828] sm:text-3xl lg:text-4xl">
        {children}
      </h2>
      <div
        className={`mt-3 h-[3px] w-12 rounded-full bg-[#7B2044] ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
