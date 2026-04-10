"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Rotating insights — operational data feel ─────────────────────────────────
const insights = [
  {
    stat: "78%",
    label: "of missed calls never call back",
    ref: "industry · avg",
  },
  {
    stat: "< 5 min",
    label: "response window before a lead goes cold",
    ref: "response · data",
  },
  {
    stat: "$2,400",
    label: "avg monthly revenue lost to no-shows",
    ref: "case · aggregate",
  },
];

// ─── EraBridge — Uptime Status + Rotating Tabs pattern ────────────────────────
export function EraBridgeSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setActive((prev) => (prev + 1) % insights.length),
      3600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-[#1F1A1A] py-16 md:py-20 relative overflow-hidden">
      {/* Wine glow from below */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[36rem] h-40 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse, #6A2C3E 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">

        {/* ── Uptime Status pill ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#6A2C3E]/25 bg-[#6A2C3E]/10 px-3.5 py-1.5">
            {/* Ping dot */}
            <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6A2C3E] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6A2C3E]" />
            </span>
            <span className="font-mono text-[9px] text-[#6A2C3E] uppercase tracking-widest">
              ops · monitoring
            </span>
            <span className="font-mono text-[9px] text-[#6D6664]">·</span>
            <span className="font-mono text-[9px] text-[#6D6664] uppercase tracking-widest">
              comms gap detected
            </span>
          </div>
        </div>

        {/* ── Thesis headline ────────────────────────────────────────────────── */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6D6664] mb-5">
            The Communication Gap
          </p>
          <p className="font-display text-2xl md:text-3xl font-bold text-white leading-snug tracking-tight">
            People now expect an answer in minutes.{" "}
            <span className="text-[#C8C4C0]/70">
              Service businesses cannot always pick up the phone.
            </span>
          </p>
        </div>

        {/* ── Rotating insight card ──────────────────────────────────────────── */}
        <div
          className="rounded-2xl border border-[#2A2020] overflow-hidden"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.25)" }}
        >
          {/* Terminal bar with dot indicators */}
          <div
            className="flex items-center justify-between px-4 py-2.5 border-b border-[#2A2020]"
            style={{ background: "#171415" }}
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#6A2C3E]/50" />
              <span className="w-2 h-2 rounded-full bg-[#2A2020]" />
              <span className="w-2 h-2 rounded-full bg-[#2A2020]" />
              <span className="ml-1.5 font-mono text-[9px] text-[#6D6664] tracking-widest">
                comms-gap · live-data
              </span>
            </div>
            {/* Tab dots */}
            <div className="flex items-center gap-1.5" role="tablist" aria-label="Insights">
              {insights.map((_, i) => (
                <button
                  key={i}
                  role="tab"
                  aria-selected={active === i}
                  onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${
                    active === i
                      ? "w-5 h-1.5 bg-[#6A2C3E]"
                      : "w-1.5 h-1.5 bg-[#3A2C2C] hover:bg-[#6A2C3E]/40"
                  }`}
                  aria-label={`Insight ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Cycling content */}
          <div style={{ background: "#1A1616" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -14 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="px-6 py-7 text-center"
              >
                <span className="font-mono text-[9px] text-[#6D6664]/60 uppercase tracking-widest block mb-4">
                  {insights[active].ref}
                </span>
                <p className="font-display text-5xl md:text-6xl font-bold text-white tabular-nums leading-none">
                  {insights[active].stat}
                </p>
                <p className="mt-3 text-sm text-[#C8C4C0] leading-relaxed">
                  {insights[active].label}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Supporting close ───────────────────────────────────────────────── */}
        <p className="mt-8 text-sm md:text-base text-[#C8C4C0] leading-relaxed text-center max-w-xl mx-auto">
          That gap — between when someone reaches out and when they hear back — is where most
          revenue disappears. The right systems close it automatically, without adding headcount.
        </p>
      </div>
    </section>
  );
}
