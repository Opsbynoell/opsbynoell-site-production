"use client";
import React, { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import { Button } from "./button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { IphoneMockup } from "./iphone-mockup";
import { ProofBar } from "./proof-bar";
import {
  trackAuditCtaClick,
  type SourcePage,
  type SourceSection,
} from "@/lib/analytics";

export function Hero({
  eyebrow = "A systems agency · Ops by Noell",
  variant = "wine",
  headlineLine1Start = "By the time you call back,",
  headlineLine1Accent = "they've already booked",
  headlineLine2Start = "somewhere",
  headlineLine2Accent = "else.",
  body = "We build, install, and manage the system that catches missed calls, follows up instantly, and keeps your calendar full, so you can stay focused on the client in front of you.",
  footnote = "Built for service businesses and B2B teams that cannot afford to lose a lead.",
  primaryCta = { label: "Get Your Free Audit", href: "/book" },
  secondaryCta = { label: "See the system", href: "/#systems" },
  mockScreen,
  showProofBar = true,
  priceSignal,
  headlineLine2Smaller = false,
  softHalo = false,
  proofBadge,
  pinnedProof = false,
  calmMobile = false,
  sourcePage = "home",
  sourceSection = "hero",
}: {
  eyebrow?: string;
  variant?: "wine" | "lilac" | "sage";
  headlineLine1Start?: string;
  headlineLine1Accent?: string;
  headlineLine2Start?: string;
  headlineLine2Accent?: string;
  body?: string;
  footnote?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string } | null;
  mockScreen?: React.ReactNode;
  showProofBar?: boolean;
  priceSignal?: React.ReactNode;
  headlineLine2Smaller?: boolean;
  /** Soften the decorative ring outlines (ambient glow + animation stay) so
      they don't slice across hero copy that sits over the arc. */
  softHalo?: boolean;
  /** Small proof badge shown under the headline on mobile only. */
  proofBadge?: string;
  /** Pin the proof bar to its first (missed-call recovery) scene, no rotation. */
  pinnedProof?: boolean;
  /** On mobile, hide the proof bar, phone mockup, and background decor for a
      calm, centered single-column hero (desktop unchanged). */
  calmMobile?: boolean;
  sourcePage?: SourcePage;
  sourceSection?: SourceSection;
}) {
  const handlePrimaryCta = () => {
    if (primaryCta.href === "/book") {
      trackAuditCtaClick(sourcePage, sourceSection, {
        destination: primaryCta.href,
        cta_label: primaryCta.label,
      });
    }
  };
  const parentRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;

  const gradients = {
    wine: "bg-gradient-to-t from-[rgba(139,42,66,0.50)] via-[rgba(31,18,25,0.90)] to-[rgba(31,18,25,1)]",
    lilac:
      "bg-gradient-to-t from-[rgba(155,111,184,0.40)] via-[rgba(31,18,25,0.90)] to-[rgba(31,18,25,1)]",
    sage: "bg-gradient-to-t from-[rgba(79,107,78,0.40)] via-[rgba(31,18,25,0.90)] to-[rgba(31,18,25,1)]",
  };

  const accentGradient = {
    wine: "bg-gradient-to-b from-[rgba(139,77,94,1)] to-[rgba(107,45,62,1)]",
    // Lilac variant uses Wine for the italic accent so it passes AA on the
    // blush/lilac hero gradient (the pale-lilac color fails ~1.5:1).
    lilac: "bg-gradient-to-b from-[rgba(139,77,94,1)] to-[rgba(107,45,62,1)]",
    sage: "bg-gradient-to-b from-[rgba(122,156,121,1)] to-[rgba(79,107,78,1)]",
  };

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative flex max-w-7xl rounded-b-3xl my-2 md:my-20 mx-auto flex-col items-center justify-center pt-24 md:pt-32 overflow-hidden px-4 md:px-8",
        gradients[variant]
      )}
    >
      <motion.p
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative z-20 text-[14px] md:text-[15px] uppercase tracking-[0.18em] text-cream/75 mb-5 md:mb-6 text-center"
      >
        {eyebrow}
      </motion.p>

      <div className="text-balance relative z-20 mx-auto mb-5 md:mb-4 max-w-5xl text-center font-serif text-3xl font-semibold tracking-tight text-cream md:text-6xl lg:text-7xl leading-tight">
        <Balancer>
          <motion.h1
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-block text-cream"
          >
            {headlineLine1Start}
            {headlineLine1Accent && (
              <>
                {" "}
                <span
                  className={cn(
                    accentGradient[variant],
                    "bg-clip-text text-transparent italic"
                  )}
                >
                  {headlineLine1Accent}
                </span>
              </>
            )}
            {/* Whitespace before the line break ensures screen readers and
                text extractors do not join the last word of line 1 with the
                first word of line 2 (e.g. "Intelligencefor"). */}
            {" "}
            <br />
            <span
              className={cn(
                headlineLine2Smaller &&
                  "text-[0.78em] font-normal text-cream/85"
              )}
            >
              {headlineLine2Start}
              {headlineLine2Accent && (
                <>
                  {" "}
                  <span
                    className={cn(
                      accentGradient[variant],
                      "bg-clip-text text-transparent italic"
                    )}
                  >
                    {headlineLine2Accent}
                  </span>
                </>
              )}
            </span>
          </motion.h1>
        </Balancer>
      </div>

      {proofBadge && (
        <div className="md:hidden relative z-20 mb-5 mt-1 flex justify-center px-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-wine/40 bg-wine/15 px-3.5 py-1.5 text-[13px] font-medium text-cream text-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C45A2A] flex-shrink-0" />
            {proofBadge}
          </span>
        </div>
      )}

      <motion.p
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="relative z-20 mx-auto mt-4 md:mt-6 max-w-2xl px-4 text-center text-lg md:text-xl leading-relaxed text-cream/85 font-sans"
      >
        {body}
      </motion.p>

      {footnote && (
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="relative z-20 mx-auto mt-6 md:mt-8 max-w-xl px-4 text-center text-sm text-cream/80 leading-relaxed"
        >
          {footnote}
        </motion.p>
      )}

      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="mb-8 mt-7 md:mt-8 z-10 sm:mb-10 flex w-full flex-col items-center justify-center gap-3 px-4 sm:flex-row md:mb-16"
      >
        <Button
          href={primaryCta.href}
          variant={variant === "lilac" ? "lilac" : "primary"}
          className="w-full sm:w-auto h-12 px-7"
          onClick={handlePrimaryCta}
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
            className="w-full sm:w-auto h-12 px-7"
            data-source-page={sourcePage}
            data-source-section={sourceSection}
          >
            {secondaryCta.label}
          </Button>
        )}
      </motion.div>

      {priceSignal && (
        <div className="relative z-20 -mt-1 mb-8 text-center text-sm text-cream/70 px-4">
          {priceSignal}
        </div>
      )}

      {showProofBar && (
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.75 }}
          className={cn(
            "relative z-20 w-full justify-center px-4 mb-8 md:mb-12",
            calmMobile ? "hidden md:flex" : "flex"
          )}
        >
          <ProofBar className="mt-0 md:mt-0" pinned={pinnedProof} />
        </motion.div>
      )}

      <div
        className={cn(
          "pt-[2rem] w-full min-h-[21rem] relative",
          calmMobile && "hidden md:block"
        )}
      >
        <motion.div
          initial={false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute top-0 left-0 right-0 z-10 flex justify-center pb-8"
        >
          <IphoneMockup>{mockScreen ?? <DefaultMockScreen />}</IphoneMockup>
        </motion.div>
        <BackgroundShape variant={variant} soft={softHalo} />
      </div>
    </div>
  );
}

function BackgroundShape({
  variant = "wine",
  soft = false,
}: {
  variant?: "wine" | "lilac" | "sage";
  /** Soften the bright ring outlines (keeping the ambient glow + animation)
      so the rings don't slice across hero copy that sits over the arc. */
  soft?: boolean;
}) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const sizes = isMobile
    ? { outer: 800, middle: 600, inner: 400 }
    : { outer: 1400, middle: 1100, inner: 800 };
  const { outer, middle, inner } = sizes;

  const gradientStart =
    variant === "lilac"
      ? "rgba(232,224,237,1)"
      : variant === "sage"
        ? "rgba(220,232,218,1)"
        : "rgba(251,240,235,1)";
  const gradientMid1 =
    variant === "lilac"
      ? "rgba(232,224,237,0.8)"
      : variant === "sage"
        ? "rgba(220,232,218,0.8)"
        : "rgba(251,240,235,0.8)";

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center">
      <div
        className={cn(
          "absolute z-0 rounded-full border",
          soft ? "border-white/10" : "border-white/30"
        )}
        style={{ width: outer, height: outer }}
      />
      <motion.div
        className={cn(
          "absolute z-0 rounded-full border",
          soft ? "border-white/20" : "border-white"
        )}
        style={{
          width: middle,
          height: middle,
          clipPath: "circle(50% at 50% 50%)",
          background: `
            radial-gradient(
              circle at center,
              ${gradientStart} 0%,
              ${gradientMid1} 20%,
              rgba(255,255,255,0.4) 40%,
              rgba(255,255,255,0) 60%
            )
          `,
        }}
        animate={reduceMotion ? { scale: 1, y: 0 } : { scale: [1, 1.02, 1], y: [0, -5, 0] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 2, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }
        }
      />
      <motion.div
        className="absolute bg-[#271520]/5 z-[2] rounded-full border border-white/10 shadow-[0_0_200px_80px_rgba(255,255,255,0.1)]"
        style={{ width: inner, height: inner }}
        animate={reduceMotion ? { scale: 1, y: 0 } : { scale: [1, 1.03, 1], y: [0, -7, 0] }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 2.5, repeat: Infinity, ease: "easeInOut", times: [0, 0.5, 1] }
        }
      />
    </div>
  );
}

function DefaultMockScreen() {
  return (
    <div className="flex w-full flex-col items-stretch px-3">
      {/* App bar */}
      <div className="flex justify-between items-center w-full px-2 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-cream/70 font-medium">
            System active
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-cream/70">
          today
        </span>
      </div>

      {/* New inquiry card */}
      <div className="bg-[#271520] rounded-2xl p-3 mx-1 border border-white/10/60 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-wine/85 font-medium">
              New inquiry
            </p>
            <p className="text-sm text-cream font-medium mt-0.5">Inbound lead</p>
            <p className="text-[11px] text-cream/70">Qualified · 12s</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-wine/20 text-wine-light">
            triggered
          </span>
        </div>
        <div className="mt-2 bg-[#301A26] rounded-lg p-2 text-[11px] text-cream/80 leading-snug">
          &ldquo;Thanks for reaching out. A few quick questions to confirm we are the
          right fit, what does your current setup look like?&rdquo;
        </div>
      </div>

      {/* Revenue recovered card */}
      <div className="bg-wine rounded-2xl p-3 mx-1 mt-2 shadow-sm">
        <p className="text-[10px] uppercase tracking-widest text-cream/70 font-medium">
          Revenue recovered
        </p>
        <p className="font-serif text-3xl font-bold text-cream mt-0.5">$2,560</p>
        <p className="text-[11px] text-cream/60">from recovered missed calls · 30 days</p>
      </div>

      {/* Meeting confirmed card */}
      <div className="bg-[#301A26] rounded-2xl p-3 mx-1 mt-2 border border-wine/10 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-wine/85 font-medium">
              Meeting confirmed
            </p>
            <p className="text-sm text-cream font-medium mt-0.5">
              Tuesday · 10:00 AM
            </p>
            <p className="text-[11px] text-cream/70">
              Discovery call · 30 min
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-wine text-cream">
            booked
          </span>
        </div>
      </div>
    </div>
  );
}
