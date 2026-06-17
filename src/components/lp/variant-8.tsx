"use client";

/**
 * Variant 8 — "Trust · On-Brand"
 *
 * Faithful rebuild of Variation 8 from the Figma Make preview
 * (mono-vocal-40356019.figma.site): the V5 layout structure rendered in the
 * full burgundy-on-white palette. Designed mobile-first; on larger screens the
 * content sits in a centered phone-width column to preserve the original intent.
 *
 * Palette (sampled from the Figma render):
 *   burgundy   #7B2044   ink #101828   body #475569   muted #717182
 *   pink hair  #D9A8BC / #EAD3DF        hero wash #FDF4F7   cream #FAF6F1
 */

import { useState } from "react";
import Link from "next/link";
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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-bold text-[#101828] tracking-tight">
        {children}
      </h2>
      <div className="mx-auto mt-3 h-[3px] w-12 rounded-full bg-[#7B2044]" />
    </div>
  );
}

export function Variant8Page() {
  const [activePath, setActivePath] = useState<keyof typeof paths>("team");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const path = paths[activePath];

  return (
    <div className="min-h-screen w-full bg-white font-sans text-[#101828] antialiased">
      <div className="mx-auto w-full max-w-[440px]">
        {/* ── Navbar ─────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#EFE3DA] bg-[#FAF6F1]/95 px-5 py-3.5 backdrop-blur">
          <Link href="/" className="leading-none" aria-label="Ops by Noell, home">
            <span className="font-serif text-2xl font-semibold text-[#7B2044]">
              Ops
            </span>
            <span className="ml-1 font-serif text-sm italic text-[#7B2044]/70">
              by Noell
            </span>
          </Link>
          <Link
            href={BOOK_HREF}
            className="rounded-full border border-[#7B2044] px-4 py-1.5 text-xs font-bold text-[#7B2044] transition-colors hover:bg-[#7B2044] hover:text-white"
          >
            Book a Call
          </Link>
        </header>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="bg-gradient-to-b from-[#FDF4F7] to-white px-6 pb-12 pt-10 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#7B2044]">
            Done-for-you AI front desk · Orange County
          </p>
          <h1 className="mx-auto mt-5 max-w-[20ch] text-[34px] font-bold leading-[1.1] tracking-tight">
            While you&apos;re with a client,{" "}
            <span className="text-[#7B2044]">who&apos;s picking up?</span>
          </h1>

          {/* Illustration: chat → phone(AI) → calendar */}
          <div className="mt-9 flex items-center justify-center gap-2">
            <IconTile>
              <IconMessage className="h-7 w-7" stroke={1.6} />
            </IconTile>
            <Dashes />
            <IconTile className="relative">
              <IconDeviceMobile className="h-7 w-7" stroke={1.6} />
              <span className="absolute -right-1.5 -top-1.5 rounded-full bg-[#7B2044] px-1.5 py-0.5 text-[8px] font-bold text-white">
                AI
              </span>
            </IconTile>
            <Dashes />
            <IconTile>
              <IconCalendarCheck className="h-7 w-7" stroke={1.6} />
            </IconTile>
          </div>
          <Squiggle />
        </section>

        {/* ── Path selector ──────────────────────────────────────── */}
        <section className="px-6 pb-12">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#717182]">
            How would you like to work with us?
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-[#EAD3DF] bg-[#FDF4F7] p-1.5">
            {(Object.keys(paths) as Array<keyof typeof paths>).map((key) => {
              const isActive = key === activePath;
              const { Icon, label } = paths[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActivePath(key)}
                  aria-pressed={isActive}
                  className={`flex items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-center text-[13px] font-bold transition-colors ${
                    isActive
                      ? "bg-[#7B2044] text-white shadow-sm"
                      : "text-[#7B2044] hover:bg-white/60"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" stroke={1.8} />
                  {label}
                </button>
              );
            })}
          </div>

          <p className="mx-auto mt-6 max-w-[34ch] text-center text-[15px] leading-relaxed text-[#475569]">
            {path.body}
          </p>

          {/* Proof card */}
          <div className="mt-7 rounded-2xl border border-[#D9A8BC] bg-white p-6 text-center shadow-[0_1px_2px_rgba(123,32,68,0.05)]">
            <p className="text-[32px] font-bold leading-none text-[#7B2044]">$223</p>
            <p className="mt-2 text-sm font-semibold text-[#717182]">
              recovered in 30 days
            </p>
            <div className="my-5 flex items-center justify-center gap-3 text-[#D9A8BC]">
              <span className="h-px w-16 bg-[#EAD3DF]" />
              <span className="text-xs">✦</span>
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

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#717182]">
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
        </section>

        {/* ── The cost of missed calls ───────────────────────────── */}
        <section className="border-t border-[#F1E4EB] px-6 py-12">
          <SectionHeading>The cost of missed calls</SectionHeading>
          <div className="space-y-4">
            {stats.map((s) => (
              <div
                key={s.figure}
                className="flex items-center gap-5 rounded-2xl border border-[#D9A8BC] border-l-[5px] border-l-[#7B2044] bg-white p-5"
              >
                <p className="w-[5.5rem] shrink-0 text-[32px] font-bold leading-none text-[#7B2044]">
                  {s.figure}
                </p>
                <p className="text-[15px] leading-snug text-[#475569]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Everything managed for you ─────────────────────────── */}
        <section className="border-t border-[#F1E4EB] px-6 py-12">
          <SectionHeading>Everything managed for you</SectionHeading>
          <div className="space-y-5">
            {features.map(({ Icon, title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#EAD3DF] bg-white p-7 text-center"
              >
                <Icon
                  className="mx-auto mb-4 h-10 w-10 text-[#7B2044]"
                  stroke={1.5}
                />
                <h3 className="text-lg font-bold text-[#101828]">{title}</h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-[#475569]">
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Frequently asked ───────────────────────────────────── */}
        <section className="border-t border-[#F1E4EB] px-6 py-12">
          <SectionHeading>Frequently asked</SectionHeading>
          <div className="space-y-3">
            {faqs.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-2xl border border-[#EAD3DF] bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="text-[15px] font-bold text-[#101828]">
                      {item.q}
                    </span>
                    <IconChevronDown
                      className={`h-5 w-5 shrink-0 text-[#7B2044] transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      stroke={2}
                    />
                  </button>
                  {isOpen && (
                    <p className="px-5 pb-5 text-[14px] leading-relaxed text-[#475569]">
                      {item.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Closing CTA ────────────────────────────────────────── */}
        <section className="px-6 pb-16 pt-2">
          <div className="rounded-3xl bg-[#7B2044] px-7 py-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
              <IconCircleCheck className="h-8 w-8 text-white" stroke={1.8} />
            </div>
            <h2 className="mx-auto mt-6 max-w-[16ch] text-[28px] font-bold leading-[1.15] text-white">
              Ready to recover lost revenue?
            </h2>
            <p className="mx-auto mt-4 max-w-[34ch] text-[15px] leading-relaxed text-white/80">
              Get a free analysis of your missed call patterns and see exactly
              how much you can recover — no pitch, no commitment.
            </p>
            <Link
              href={BOOK_HREF}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-4 text-base font-bold text-[#7B2044] transition-colors hover:bg-[#FDF4F7]"
            >
              Book Your Free Missed Call Audit
              <IconArrowRight className="h-5 w-5" stroke={2} />
            </Link>
            <p className="mt-4 text-xs text-white/70">
              15-minute call · No credit card · No obligation
            </p>
          </div>
        </section>
      </div>
    </div>
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
      className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-[#D9A8BC] bg-[#FDF4F7] text-[#7B2044] ${className}`}
    >
      {children}
    </div>
  );
}

function Dashes() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-[2px] w-1.5 rounded-full bg-[#D9A8BC]" />
      ))}
    </span>
  );
}

function Squiggle() {
  return (
    <svg
      className="mx-auto mt-8 h-3 w-40 text-[#E7C3D2]"
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
