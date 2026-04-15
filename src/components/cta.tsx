"use client";
import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export default function CTA({
  eyebrow = "The first step",
  headlineStart = "See exactly where",
  headlineAccent = "leads are falling through.",
  body = "No pitch. No pressure. A 30-minute audit that gives you a clear map of what's leaking, whether you work with us or not.",
  primaryCta = { label: "Book Your Free Audit", href: "/book" },
  secondaryCta = { label: "Talk to Noell Support first", href: "/noell-support" },
  trustLine = "Free 30-minute audit · No contracts required · Live in 14 days",
  accent = "wine",
}: {
  eyebrow?: string;
  headlineStart?: string;
  headlineAccent?: string;
  body?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  trustLine?: string;
  accent?: "wine" | "lilac";
}) {
  const gradientBg =
    accent === "wine"
      ? "bg-gradient-to-br from-wine via-wine-light to-wine-dark"
      : "bg-gradient-to-br from-lilac-dark via-lilac-dark/90 to-[#6b4f80]";

  const accentGrad =
    accent === "wine" ? "from-blush to-cream" : "from-lilac-light to-white";

  return (
    <section className="w-full px-4 my-16 md:my-24">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={cn(
          "relative max-w-6xl mx-auto rounded-[32px] px-8 py-20 md:px-16 md:py-24 overflow-hidden",
          gradientBg
        )}
      >
        {/* Ambient shapes */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/60 mb-5">
            {eyebrow}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
            {headlineStart}{" "}
            <span
              className={cn(
                "bg-gradient-to-b bg-clip-text text-transparent italic",
                accentGrad
              )}
            >
              {headlineAccent}
            </span>
          </h2>
          <p className="mt-6 text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
            {body}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              href={primaryCta.href}
              variant="secondary"
              className="h-12 px-8 bg-white text-charcoal hover:bg-cream"
            >
              {primaryCta.label}
            </Button>
            <Button
              href={secondaryCta.href}
              variant="secondary"
              className="h-12 px-8 bg-transparent border border-white/30 text-white hover:bg-white/10"
            >
              {secondaryCta.label}
            </Button>
          </div>

          <p className="mt-8 text-xs text-white/50">{trustLine}</p>
        </div>
      </motion.div>
    </section>
  );
}
