"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { novaSpotlight } from "@/content/nova";
import { ROUTES } from "@/lib/constants";

export function NovaSpotlight() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        background: "linear-gradient(135deg, #F5F0FF 0%, #EDE5FF 100%)",
      }}
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Nova pill badge */}
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#7C5CFC]/10 px-4 py-1.5 text-xs font-semibold text-[#7C5CFC] mb-5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]" />
          Nova AI
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-[#1A1A1A]"
        >
          {novaSpotlight.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.14 }}
          className="mt-5 text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-2xl mx-auto"
        >
          {novaSpotlight.subhead}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-2 text-sm text-[#7C5CFC]/70"
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
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-[#7C5CFC] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#6b4de8] transition-colors"
          >
            {novaSpotlight.primaryCta}
          </Link>
          <Link
            href={ROUTES.pricing}
            className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-[#7C5CFC]/30 bg-white px-7 py-3.5 text-sm font-semibold text-[#7C5CFC] hover:border-[#7C5CFC] transition-colors"
          >
            {novaSpotlight.secondaryCta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
