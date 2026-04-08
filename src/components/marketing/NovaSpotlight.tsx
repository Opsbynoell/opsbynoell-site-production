"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { novaSpotlight } from "@/content/nova";
import { ROUTES } from "@/lib/constants";

export function NovaSpotlight() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28 grain-overlay"
      style={{
        // Warmer gradient — cream → soft lilac/lavender, not heavy purple
        background: "linear-gradient(155deg, #FFF7F4 0%, #EDE0F4 100%)",
      }}
    >
      {/* Soft blush radial — warm anchor so it doesn't float in purple */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 w-80 h-80 rounded-full opacity-35"
        style={{ background: "radial-gradient(circle, #F0E4E8 0%, transparent 65%)" }}
        aria-hidden
      />
      {/* Restrained purple accent — top right only */}
      <div
        className="pointer-events-none absolute -top-20 right-1/4 w-64 h-64 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #7C5CFC 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center relative">

        {/* Nova system badge — browser chrome style pill */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2.5 mb-6"
        >
          {/* Window dots as Nova identity accent */}
          <div className="flex items-center gap-1 bg-white/70 border border-[#E0D4E8] rounded-full px-3 py-1.5 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#E0D4E8]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0E4E8]" />
            <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#7C5CFC]">
              Nova AI
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="font-display text-4xl sm:text-5xl font-bold leading-tight text-[#1F1A1A]"
        >
          {novaSpotlight.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="mt-5 text-base md:text-lg text-[#6D6664] leading-relaxed max-w-2xl mx-auto"
        >
          {novaSpotlight.subhead}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-2 text-sm text-[#6D6664]"
        >
          {novaSpotlight.supportingLine}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.26 }}
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
      </div>
    </section>
  );
}
