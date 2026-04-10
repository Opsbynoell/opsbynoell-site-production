"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { novaSpotlight } from "@/content/nova";
import { ROUTES } from "@/lib/constants";

// ─── Live chat trace — Chat Conversation pattern ───────────────────────────────
const chatMessages = [
  { role: "nova", text: "Hi — you just called. I didn't want you to wait. Can I help you book?", delay: 0.9 },
  { role: "lead", text: "Yes, looking for Saturday morning.", delay: 1.5 },
  { role: "nova", text: "Saturday I have 10am and 1pm open. Which works best?", delay: 2.1 },
];

// ─── Nova Spotlight ────────────────────────────────────────────────────────────
export function NovaSpotlight() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28 grain-overlay"
      style={{
        background: "linear-gradient(155deg, #FFF7F4 0%, #EDE0F4 100%)",
      }}
    >
      {/* Warm blush anchor */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 w-80 h-80 rounded-full opacity-35"
        style={{ background: "radial-gradient(circle, #F0E4E8 0%, transparent 65%)" }}
        aria-hidden
      />
      {/* Restrained purple glow */}
      <div
        className="pointer-events-none absolute -top-20 right-1/4 w-64 h-64 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #7C5CFC 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">

        {/* ── Dynamic Island badge — expands on mount ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.82, y: 6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center gap-0 mb-7 overflow-hidden"
        >
          <div className="flex items-center gap-2.5 bg-white/80 border border-[#7C5CFC]/25 rounded-full px-4 py-2 backdrop-blur-sm shadow-[0_2px_14px_rgba(124,92,252,0.1)]">
            {/* Pulsing dot */}
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C5CFC] opacity-50" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7C5CFC]" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#7C5CFC]">
              Nova
            </span>
            <span className="w-px h-3 bg-[#7C5CFC]/20 mx-0.5" />
            <span className="text-[10px] text-[#6D6664]">
              Active · responding instantly
            </span>
          </div>
        </motion.div>

        {/* ── Headline ────────────────────────────────────────────────────── */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl font-bold leading-tight text-[#1F1A1A]"
        >
          {novaSpotlight.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.17 }}
          className="mt-5 text-base md:text-lg text-[#6D6664] leading-relaxed max-w-2xl mx-auto"
        >
          {novaSpotlight.subhead}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="mt-2 text-sm text-[#6D6664]"
        >
          {novaSpotlight.supportingLine}
        </motion.p>

        {/* ── CTAs ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href={ROUTES.book}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#7C5CFC] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#6b4de8] transition-colors shadow-[0_2px_14px_rgba(124,92,252,0.25)]"
          >
            {novaSpotlight.primaryCta}
          </Link>
          <Link
            href={ROUTES.pricing}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-[#E0D4E8] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#6D6664] hover:border-[#7C5CFC]/40 hover:text-[#7C5CFC] transition-colors"
          >
            {novaSpotlight.secondaryCta}
          </Link>
        </motion.div>

        {/* ── Live chat trace — Chat Conversation pattern ──────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-12 max-w-sm mx-auto"
        >
          <div
            className="rounded-2xl overflow-hidden border border-[#E0D4E8]/60 shadow-[0_4px_24px_rgba(124,92,252,0.08)]"
            style={{ background: "rgba(255,255,255,0.72)", backdropFilter: "blur(12px)" }}
          >
            {/* Chrome bar */}
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 border-b border-[#E0D4E8]/60" style={{ background: "rgba(255,255,255,0.9)" }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7C5CFC] opacity-50" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#7C5CFC]" />
              </span>
              <span className="font-mono text-[9px] text-[#7C5CFC] tracking-widest uppercase ml-0.5">
                nova · responding
              </span>
              <span className="ml-auto font-mono text-[9px] text-[#C8C4C0]">missed call</span>
            </div>

            {/* Messages */}
            <div className="px-3.5 py-3.5 flex flex-col gap-2.5">
              <div className="flex justify-center">
                <span className="font-mono text-[9px] text-[#C8C4C0] bg-[#F5F0F9] rounded-full px-2.5 py-0.5">
                  Missed call · nova triggered
                </span>
              </div>

              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: msg.delay }}
                  className={`flex ${msg.role === "nova" ? "justify-start" : "justify-end"}`}
                >
                  {msg.role === "nova" ? (
                    <div className="max-w-[82%] bg-white border border-[#E0D4E8] px-3 py-2 rounded-[0.875rem_0.875rem_0.875rem_0.25rem]">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="w-1 h-1 rounded-full bg-[#7C5CFC]" />
                        <span className="font-mono text-[8px] text-[#7C5CFC] uppercase tracking-widest">nova</span>
                      </div>
                      <p className="text-[11px] leading-snug text-[#1F1A1A]">{msg.text}</p>
                    </div>
                  ) : (
                    <div className="max-w-[72%] bg-[#7C5CFC] px-3 py-2 rounded-[0.875rem_0.875rem_0.25rem_0.875rem]">
                      <p className="text-[11px] leading-snug text-white">{msg.text}</p>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Outcome */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, delay: 2.7 }}
                className="flex justify-center pt-1"
              >
                <span className="text-[9px] font-semibold text-[#7C5CFC] bg-[#7C5CFC]/8 border border-[#7C5CFC]/15 rounded-full px-3 py-1">
                  ✓ lead qualified · booking in progress
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
