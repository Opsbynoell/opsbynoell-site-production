"use client";
import React from "react";
import { motion } from "motion/react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
  trackAuditCtaClick,
  type SourcePage,
  type SourceSection,
} from "@/lib/analytics";

export default function CTA({
  eyebrow = "The first step",
  headlineStart = "Start with a",
  headlineAccent = "working call.",
  body = "We walk your front desk and show you where warm intent is cooling off. Twenty focused minutes. Personally scheduled.",
  primaryCta = { label: "Book Your Free Audit", href: "/book" },
  secondaryCta = { label: "Talk to Noell Support first", href: "/noell-support" },
  trustLine = "No pitch. No pressure. If it’s not a fit, we’ll say so.",
  accent = "wine",
  sourcePage,
  sourceSection = "final_cta",
}: {
  eyebrow?: string;
  headlineStart?: string;
  headlineAccent?: string;
  body?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string } | null;
  trustLine?: string;
  accent?: "wine" | "lilac";
  sourcePage?: SourcePage;
  sourceSection?: SourceSection;
}) {
  const handlePrimary = () => {
    if (primaryCta.href === "/book") {
      trackAuditCtaClick(sourcePage ?? "home", sourceSection, {
        destination: primaryCta.href,
        cta_label: primaryCta.label,
      });
    }
  };
  const gradientBg =
    accent === "wine"
      ? "bg-gradient-to-br from-wine via-wine-light to-wine-dark"
      : "bg-gradient-to-br from-lilac-dark via-lilac-dark/90 to-[#6b4f80]";

  const accentGrad =
    accent === "wine" ? "from-cream to-cream-dark" : "from-lilac-light to-white";

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
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#271520]/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#271520]/5 blur-3xl" />

        <div className="relative z-10 text-center max-w-3xl mx-auto">
          {eyebrow && (
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/60 mb-5">
              {eyebrow}
            </p>
          )}
          <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight">
            {headlineStart}
            {headlineAccent && (
              <>
                {" "}
                <span
                  className={cn(
                    "bg-gradient-to-b bg-clip-text text-transparent italic",
                    accentGrad
                  )}
                >
                  {headlineAccent}
                </span>
              </>
            )}
          </h2>
          <p className="mt-6 text-white/70 text-lg max-w-xl mx-auto leading-relaxed">
            {body}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              href={primaryCta.href}
              variant="secondary"
              className="h-12 px-8 bg-[#271520] text-cream hover:bg-[#1F1219]"
              onClick={handlePrimary}
              data-event={primaryCta.href === "/book" ? "audit_cta_click" : undefined}
              data-source-page={sourcePage}
              data-source-section={sourceSection}
            >
              {primaryCta.label}
            </Button>
            {secondaryCta && (
              <Button
                href={secondaryCta.href}
                variant="secondary"
                className="h-12 px-8 bg-transparent border border-white/30 text-white hover:bg-[#271520]/10"
                data-source-page={sourcePage}
                data-source-section={sourceSection}
              >
                {secondaryCta.label}
              </Button>
            )}
          </div>

          {trustLine && (
            <p className="mt-8 text-xs text-on-dark-soft">{trustLine}</p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
