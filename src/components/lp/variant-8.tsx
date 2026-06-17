"use client";

/**
 * Variant 8 — "Trust · On-Brand"
 *
 * Rebuild of Variation 8 from the Figma Make preview
 * (mono-vocal-40356019.figma.site): the V5 layout structure in the full
 * burgundy-on-white palette.
 *
 * Responsive: mobile-first single column that scales up to a multi-column
 * desktop layout (stats and features become 3-up grids, hero type grows).
 *
 * Motion mirrors the original's signature reveal — a fade + ~20px rise on an
 * ease-out curve — applied as a hero entrance and scroll-into-view reveals,
 * plus an animated path toggle and accordion. All motion respects the user's
 * reduced-motion preference via <MotionConfig reducedMotion="user">.
 *
 * Palette (sampled from the Figma render):
 *   burgundy   #7B2044   ink #101828   body #475569   muted #717182
 *   pink hair  #D9A8BC / #EAD3DF        hero wash #FDF4F7   cream #FAF6F1
 */

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, MotionConfig, type Variants } from "motion/react";
import {
  IconMessage,
  IconDeviceMobile,
  IconCalendarCheck,
  IconUsers,
  IconCpu,
  IconPhoneRinging,
  IconMessage2Bolt,
  IconShieldCheck,
  IconCircleCheck,
  IconChevronDown,
  IconArrowRight,
} from "@tabler/icons-react";

const BOOK_HREF = "/book";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE_OUT } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

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

/** Fade + rise on scroll into view (matches the original's reveal). */
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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, ease: EASE_OUT, delay }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Reveal className="mb-10 text-center md:mb-12">
      <h2 className="text-2xl font-bold tracking-tight text-[#101828] md:text-3xl lg:text-4xl">
        {children}
      </h2>
      <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#7B2044]" />
    </Reveal>
  );
}

export function Variant8Page() {
  const [activePath, setActivePath] = useState<keyof typeof paths>("team");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const path = paths[activePath];

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen w-full bg-white font-sans text-[#101828] antialiased">
        {/* ── Navbar ───────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 border-b border-[#EFE3DA] bg-[#FAF6F1]/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
            <Link href="/" className="leading-none" aria-label="Ops by Noell, home">
              <span className="font-serif text-2xl font-semibold text-[#7B2044] md:text-3xl">
                Ops
              </span>
              <span className="ml-1 font-serif text-sm italic text-[#7B2044]/70 md:text-base">
                by Noell
              </span>
            </Link>
            <Link
              href={BOOK_HREF}
              className="rounded-full border border-[#7B2044] px-4 py-1.5 text-xs font-bold text-[#7B2044] transition-colors hover:bg-[#7B2044] hover:text-white md:px-5 md:py-2 md:text-sm"
            >
              Book a Call
            </Link>
          </div>
        </header>

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-[#FDF4F7] to-white">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="mx-auto w-full max-w-3xl px-6 pb-14 pt-12 text-center md:pb-20 md:pt-20"
          >
            <motion.p
              variants={rise}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B2044] md:text-xs"
            >
              Done-for-you AI front desk · Orange County
            </motion.p>
            <motion.h1
              variants={rise}
              className="mx-auto mt-5 max-w-[20ch] text-[34px] font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl"
            >
              While you&apos;re with a client,{" "}
              <span className="text-[#7B2044]">who&apos;s picking up?</span>
            </motion.h1>

            {/* Illustration: chat → phone(AI) → calendar */}
            <motion.div
              variants={rise}
              className="mt-10 flex items-center justify-center gap-2 md:mt-12 md:gap-4"
            >
              <IconTile>
                <IconMessage className="h-7 w-7 md:h-9 md:w-9" stroke={1.6} />
              </IconTile>
              <Dashes />
              <IconTile className="relative">
                <IconDeviceMobile className="h-7 w-7 md:h-9 md:w-9" stroke={1.6} />
                <span className="absolute -right-1.5 -top-1.5 rounded-full bg-[#7B2044] px-1.5 py-0.5 text-[8px] font-bold text-white md:text-[9px]">
                  AI
                </span>
              </IconTile>
              <Dashes />
              <IconTile>
                <IconCalendarCheck className="h-7 w-7 md:h-9 md:w-9" stroke={1.6} />
              </IconTile>
            </motion.div>
            <motion.div variants={rise}>
              <Squiggle />
            </motion.div>
          </motion.div>
        </section>

        {/* ── Path selector ────────────────────────────────────────── */}
        <section className="px-6 pb-14 md:pb-20">
          <div className="mx-auto w-full max-w-xl">
            <Reveal>
              <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#717182] md:text-xs">
                How would you like to work with us?
              </p>

              <div className="relative mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#EAD3DF] bg-[#FDF4F7] p-1.5">
                {(Object.keys(paths) as Array<keyof typeof paths>).map((key) => {
                  const isActive = key === activePath;
                  const { Icon, label } = paths[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActivePath(key)}
                      aria-pressed={isActive}
                      className={`relative flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-center text-[13px] font-bold transition-colors md:text-sm ${
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

              <div className="mt-6 min-h-[5.5rem]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={activePath}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                    className="mx-auto max-w-[40ch] text-center text-[15px] leading-relaxed text-[#475569] md:text-base"
                  >
                    {path.body}
                  </motion.p>
                </AnimatePresence>
              </div>
            </Reveal>

            {/* Proof card */}
            <Reveal delay={0.05}>
              <div className="mt-6 rounded-2xl border border-[#D9A8BC] bg-white p-6 text-center shadow-[0_1px_2px_rgba(123,32,68,0.05)] md:p-8">
                <p className="text-[32px] font-bold leading-none text-[#7B2044] md:text-4xl">
                  $223
                </p>
                <p className="mt-2 text-sm font-semibold text-[#717182]">
                  recovered in 30 days
                </p>
                <div className="my-5 flex items-center justify-center gap-3">
                  <span className="h-px w-16 bg-[#EAD3DF]" />
                  <span className="text-xs text-[#D9A8BC]">✦</span>
                  <span className="h-px w-16 bg-[#EAD3DF]" />
                </div>
                <p className="text-base font-bold text-[#101828]">
                  Healing Hands by Santa
                </p>
                <p className="text-sm text-[#717182]">Laguna Niguel</p>
              </div>

              <Link
                href={BOOK_HREF}
                className="mt-5 flex w-full items-center justify-center rounded-xl bg-[#7B2044] px-6 py-4 text-base font-bold text-white transition-colors hover:bg-[#651838]"
              >
                Get Your Free Missed Call Audit
              </Link>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#717182] md:text-sm">
                <span className="flex items-center gap-1">
                  <IconShieldCheck className="h-4 w-4 text-[#7B2044]" stroke={1.8} />
                  HIPAA Compliant
                </span>
                <span className="text-[#D9A8BC]">·</span>
                <span className="flex items-center gap-1">
                  <IconCircleCheck className="h-4 w-4 text-[#16A34A]" stroke={1.8} />
                  Free. No pitch. Zero obligation.
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── The cost of missed calls ─────────────────────────────── */}
        <section className="border-t border-[#F1E4EB] px-6 py-14 md:py-20">
          <div className="mx-auto w-full max-w-5xl">
            <SectionHeading>The cost of missed calls</SectionHeading>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6"
            >
              {stats.map((s) => (
                <motion.div
                  key={s.figure}
                  variants={rise}
                  className="flex items-center gap-5 rounded-2xl border border-[#D9A8BC] border-l-[5px] border-l-[#7B2044] bg-white p-5 md:flex-col md:items-start md:gap-2 md:p-7"
                >
                  <p className="w-[5.5rem] shrink-0 text-[32px] font-bold leading-none text-[#7B2044] md:w-auto md:text-5xl">
                    {s.figure}
                  </p>
                  <p className="text-[15px] leading-snug text-[#475569] md:text-base">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Everything managed for you ───────────────────────────── */}
        <section className="border-t border-[#F1E4EB] px-6 py-14 md:py-20">
          <div className="mx-auto w-full max-w-5xl">
            <SectionHeading>Everything managed for you</SectionHeading>
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6"
            >
              {features.map(({ Icon, title, body }) => (
                <motion.div
                  key={title}
                  variants={rise}
                  className="rounded-2xl border border-[#EAD3DF] bg-white p-7 text-center transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(123,32,68,0.08)] md:flex md:flex-col"
                >
                  <Icon
                    className="mx-auto mb-4 h-10 w-10 text-[#7B2044]"
                    stroke={1.5}
                  />
                  <h3 className="text-lg font-bold text-[#101828]">{title}</h3>
                  <p className="mt-2.5 text-[15px] leading-relaxed text-[#475569]">
                    {body}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Frequently asked ─────────────────────────────────────── */}
        <section className="border-t border-[#F1E4EB] px-6 py-14 md:py-20">
          <div className="mx-auto w-full max-w-3xl">
            <SectionHeading>Frequently asked</SectionHeading>
            <div className="space-y-3">
              {faqs.map((item, i) => {
                const isOpen = openFaq === i;
                const panelId = `v8-faq-panel-${i}`;
                const buttonId = `v8-faq-button-${i}`;
                return (
                  <Reveal key={item.q}>
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
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
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

        {/* ── Closing CTA ──────────────────────────────────────────── */}
        <section className="px-6 pb-16 pt-2 md:pb-24">
          <Reveal className="mx-auto w-full max-w-3xl">
            <div className="rounded-3xl bg-[#7B2044] px-7 py-12 text-center md:px-16 md:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
                <IconCircleCheck className="h-8 w-8 text-white" stroke={1.8} />
              </div>
              <h2 className="mx-auto mt-6 max-w-[18ch] text-[28px] font-bold leading-[1.15] text-white md:text-4xl">
                Ready to recover lost revenue?
              </h2>
              <p className="mx-auto mt-4 max-w-[44ch] text-[15px] leading-relaxed text-white/80 md:text-lg">
                Get a free analysis of your missed call patterns and see exactly
                how much you can recover — no pitch, no commitment.
              </p>
              <Link
                href={BOOK_HREF}
                className="mx-auto mt-7 flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-base font-bold text-[#7B2044] transition-colors hover:bg-[#FDF4F7]"
              >
                Book Your Free Missed Call Audit
                <IconArrowRight className="h-5 w-5" stroke={2} />
              </Link>
              <p className="mt-4 text-xs text-white/70 md:text-sm">
                15-minute call · No credit card · No obligation
              </p>
            </div>
          </Reveal>
        </section>
      </div>
    </MotionConfig>
  );
}

function IconTile({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D9A8BC] bg-[#FDF4F7] text-[#7B2044] md:h-20 md:w-20 ${className}`}
    >
      {children}
    </div>
  );
}

function Dashes() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-[2px] w-1.5 rounded-full bg-[#D9A8BC] md:w-2.5" />
      ))}
    </span>
  );
}

function Squiggle() {
  return (
    <svg
      className="mx-auto mt-8 h-3 w-40 text-[#E7C3D2] md:mt-10 md:w-52"
      viewBox="0 0 160 12"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 6c10-6 20 6 30 0s20-6 30 0 20 6 30 0 20-6 30 0 20 6 28 0"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
