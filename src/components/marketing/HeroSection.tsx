"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { heroSection } from "@/content/home";

// ─── System interface mockup — single premium object ───────────────────────────
function SystemMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0">

      {/* Single warm depth layer — presence, not stack */}
      <div
        className="absolute inset-0 translate-x-3 translate-y-4 rounded-[0.875rem] bg-[#E8D0D6]/35 blur-[4px] -z-10"
        aria-hidden
      />

      {/* Browser-chrome window shell */}
      <div
        className="window-frame"
        style={{ boxShadow: "0 28px 72px rgba(31,26,26,0.13), 0 4px 14px rgba(31,26,26,0.07)" }}
      >
        {/* Window chrome bar */}
        <div className="window-bar">
          <span className="window-dot-close" />
          <span className="window-dot-min" />
          <span className="window-dot-expand" />
          <span className="window-label">ops-by-noell · missed-call-recovery · active</span>
        </div>

        {/* Status bar row */}
        <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#FAF5F0] border-b border-[#EDE3DE]">
          <div className="flex items-center gap-1.5">
            <span className="status-live" />
            <span className="log-line text-[10px]">system live</span>
          </div>
          <span className="log-ts">09:14 AM</span>
        </div>

        {/* Contact / chat header */}
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-white border-b border-[#EDE3DE]">
          <div className="w-7 h-7 rounded-full bg-[#F0E4E8] flex items-center justify-center flex-shrink-0">
            <span className="text-[9px] font-semibold text-[#6A2C3E]">SM</span>
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-[#1F1A1A] truncate">Santa M.</p>
            <div className="flex items-center gap-1">
              <span className="status-live" style={{ width: "0.35rem", height: "0.35rem", boxShadow: "none" }} />
              <p className="text-[9px] text-[#6D6664]">New lead · responds instantly</p>
            </div>
          </div>
          <span className="ml-auto log-ts shrink-0">missed call</span>
        </div>

        {/* Chat messages */}
        <div className="px-3 py-3.5 flex flex-col gap-3 bg-[#FAF5F0]">
          {/* Trigger event */}
          <div className="flex justify-center">
            <span className="log-ts bg-[#EDE3DE] rounded-full px-2.5 py-0.5 text-[#6D6664]">
              Missed call · auto-reply triggered
            </span>
          </div>

          {/* Auto-response */}
          <div className="flex justify-start">
            <div className="max-w-[80%] bubble-received px-3 py-2">
              <p className="text-[11px] leading-snug text-[#1F1A1A]">
                Hi! You just called — I&apos;m with a client but didn&apos;t want you to wait. How can I help?
              </p>
              <p className="log-ts mt-1 block">Instant</p>
            </div>
          </div>

          {/* Lead replies */}
          <div className="flex justify-end">
            <div className="max-w-[75%] bubble-sent px-3 py-2">
              <p className="text-[11px] leading-snug">
                I wanted to book a massage for Saturday
              </p>
            </div>
          </div>

          {/* Follow-up */}
          <div className="flex justify-start">
            <div className="max-w-[80%] bubble-received px-3 py-2">
              <p className="text-[11px] leading-snug text-[#1F1A1A]">
                Saturday works — I have 11am and 2pm open. Which works better?
              </p>
              <p className="log-ts mt-1 block">Instant</p>
            </div>
          </div>

          {/* Outcome badge — proof inside the window */}
          <div className="flex justify-center">
            <span className="text-[9px] font-semibold text-[#6A2C3E] bg-[#F0E4E8] rounded-full px-3 py-1 border border-[#6A2C3E]/10">
              ✓ Lead captured · appointment confirmed
            </span>
          </div>
        </div>

        {/* Footer — revenue outcome, all proof contained here */}
        <div className="px-3.5 py-2.5 bg-[#F0EAE6] border-t border-[#EDE3DE]">
          <div className="flex items-center justify-between">
            <p className="log-line text-[10px] text-[#6D6664]">
              <span className="log-ts mr-1.5">09:17</span>
              revenue_event · <span className="log-accent font-semibold">$960 recovered</span>
            </p>
            <span className="log-ts text-[#C8C4C0]">14d · case: santa_e</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────
export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28 lg:py-32 grain-overlay"
      style={{
        background: "linear-gradient(150deg, #FFF7F4 0%, #FAF5F0 40%, #F6F1FF 100%)",
      }}
    >
      {/* Warm blush orb */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 w-[28rem] h-[28rem] rounded-full opacity-25"
        style={{ background: "radial-gradient(circle, #E0D4E8 0%, transparent 65%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 w-72 h-72 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #F0E4E8 0%, transparent 65%)" }}
        aria-hidden
      />
      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage: "linear-gradient(#1F1A1A 1px, transparent 1px), linear-gradient(to right, #1F1A1A 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Copy */}
          <div className="text-center lg:text-left">

            {/* Status indicator eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#EDE3DE] bg-white/70 px-3 py-1.5 mb-5 backdrop-blur-sm"
            >
              <span className="status-live" />
              <span className="log-line text-[10px] text-[#6D6664] uppercase tracking-widest">
                Systems active · Ops by Noell
              </span>
            </motion.div>

            {/* Headline — editorial serif */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.07 }}
              className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] xl:text-[3.75rem] font-bold leading-[1.08] text-[#1F1A1A]"
            >
              {heroSection.headline}
            </motion.h1>

            {/* Subhead */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14 }}
              className="mt-5 text-base md:text-lg leading-relaxed text-[#6D6664] max-w-xl mx-auto lg:mx-0"
            >
              {heroSection.subhead}
            </motion.p>

            {/* Specificity line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-2 text-sm text-[#6D6664]/75"
            >
              {heroSection.specificityLine}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.26 }}
              className="mt-8 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-3"
            >
              <Link
                href={ROUTES.book}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#6A2C3E] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#5a2233] transition-colors shadow-[0_2px_16px_rgba(106,44,62,0.28)]"
              >
                {heroSection.primaryCta}
              </Link>
              <Link
                href={ROUTES.systems}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-[#EDE3DE] bg-white/60 px-7 py-3.5 text-sm font-semibold text-[#1F1A1A] hover:border-[#6A2C3E]/35 hover:bg-white transition-all"
              >
                {heroSection.secondaryCta}
              </Link>
            </motion.div>
          </div>

          {/* Right: System mockup — single primary object */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28 }}
            className="flex justify-center lg:justify-end"
          >
            <SystemMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
