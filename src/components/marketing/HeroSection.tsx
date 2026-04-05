"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ROUTES } from "@/lib/constants";
import { heroSection } from "@/content/home";

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28 lg:py-32"
      style={{
        background: "linear-gradient(135deg, #FFF0F5 0%, #EDE5FF 100%)",
      }}
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-widest text-[#E8604C] mb-4"
        >
          {heroSection.eyebrow}
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-[#1A1A1A]"
        >
          {heroSection.headline}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16 }}
          className="mt-6 text-lg md:text-xl leading-relaxed text-[#4A4A4A] max-w-3xl mx-auto"
        >
          {heroSection.subhead}
        </motion.p>

        {/* Specificity line */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="mt-3 text-sm text-[#717171]"
        >
          {heroSection.specificityLine}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href={ROUTES.book}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#E8604C] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#d94f3b] transition-colors"
          >
            {heroSection.primaryCta}
          </Link>
          <Link
            href={ROUTES.services}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-[#E8E8E8] bg-white px-7 py-3.5 text-sm font-semibold text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
          >
            {heroSection.secondaryCta}
          </Link>
        </motion.div>

        {/* Micro-proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-xs text-[#717171]"
        >
          {heroSection.microProof}
        </motion.p>
      </div>
    </section>
  );
}
