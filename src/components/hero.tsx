"use client";
import React, { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import Balancer from "react-wrap-balancer";
import Link from "next/link";
import { Button } from "./button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { IphoneMockup } from "./iphone-mockup";

export function Hero({
  eyebrow = "A systems agency · Ops by Noell",
  variant = "wine",
  headlineLine1Start = "By the time you call back,",
  headlineLine1Accent = "they've already booked",
  headlineLine2Start = "somewhere",
  headlineLine2Accent = "else.",
  body = "We build, install, and manage the system that catches missed calls, follows up instantly, and keeps your calendar full, so you can stay focused on the client in front of you.",
  footnote = "Built for massage therapists, med spas, salons, dental offices, and estheticians.",
  primaryCta = { label: "Get Your Free Audit", href: "/book" },
  secondaryCta = { label: "See the system", href: "/#systems" },
  mockScreen,
}: {
  eyebrow?: string;
  variant?: "wine" | "lilac";
  headlineLine1Start?: string;
  headlineLine1Accent?: string;
  headlineLine2Start?: string;
  headlineLine2Accent?: string;
  body?: string;
  footnote?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  mockScreen?: React.ReactNode;
}) {
  const parentRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>;

  const gradients = {
    wine: "bg-gradient-to-t from-[rgba(107,45,62,0.65)] via-[rgba(240,224,214,0.75)] to-[rgba(250,246,241,1)]",
    lilac:
      "bg-gradient-to-t from-[rgba(139,111,156,0.55)] via-[rgba(232,224,237,0.75)] to-[rgba(250,246,241,1)]",
  };

  const accentGradient = {
    wine: "bg-gradient-to-b from-[rgba(139,77,94,1)] to-[rgba(107,45,62,1)]",
    lilac: "bg-gradient-to-b from-[rgba(196,181,206,1)] to-[rgba(139,111,156,1)]",
  };

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative flex max-w-7xl rounded-b-3xl my-2 md:my-20 mx-auto flex-col items-center justify-center pt-32 overflow-hidden px-4 md:px-8",
        gradients[variant]
      )}
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-charcoal/60 mb-6"
      >
        {eyebrow}
      </motion.p>

      <div className="text-balance relative z-20 mx-auto mb-4 max-w-5xl text-center font-serif text-4xl font-semibold tracking-tight text-charcoal md:text-6xl lg:text-7xl">
        <Balancer>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={cn(
              "inline-block bg-gradient-to-b from-charcoal to-[rgba(28,25,23,0.85)]",
              "bg-clip-text text-transparent"
            )}
          >
            {headlineLine1Start}{" "}
            <span
              className={cn(accentGradient[variant], "bg-clip-text text-transparent italic")}
            >
              {headlineLine1Accent}
            </span>
          </motion.h1>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={cn(
              "inline-block bg-gradient-to-b from-charcoal to-[rgba(28,25,23,0.85)]",
              "bg-clip-text text-transparent py-2"
            )}
          >
            {headlineLine2Start}{" "}
            <span
              className={cn(accentGradient[variant], "bg-clip-text text-transparent italic")}
            >
              {headlineLine2Accent}
            </span>
          </motion.h1>
        </Balancer>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="relative z-20 mx-auto mt-4 max-w-2xl px-4 text-center text-base/7 text-charcoal/70"
      >
        {body}
      </motion.p>

      {footnote && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="relative z-20 mx-auto mt-3 max-w-xl px-4 text-center text-sm text-charcoal/50"
        >
          {footnote}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.7 }}
        className="mb-8 mt-8 z-10 sm:mb-10 flex w-full flex-col items-center justify-center gap-3 px-4 sm:flex-row md:mb-16"
      >
        <Button
          href={primaryCta.href}
          variant={variant === "lilac" ? "lilac" : "primary"}
          className="w-full sm:w-auto h-12 px-7"
        >
          {primaryCta.label}
        </Button>
        <Button
          href={secondaryCta.href}
          variant="secondary"
          className="w-full sm:w-auto h-12 px-7"
        >
          {secondaryCta.label}
        </Button>
      </motion.div>

      <div className="pt-[2rem] w-full min-h-[21rem] relative">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="absolute top-0 left-0 right-0 z-10 flex justify-center pb-8"
        >
          <IphoneMockup>{mockScreen ?? <DefaultMockScreen />}</IphoneMockup>
        </motion.div>
        <BackgroundShape variant={variant} />
      </div>
    </div>
  );
}

function BackgroundShape({ variant = "wine" }: { variant?: "wine" | "lilac" }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const sizes = isMobile
    ? { outer: 800, middle: 600, inner: 400 }
    : { outer: 1400, middle: 1100, inner: 800 };
  const { outer, middle, inner } = sizes;

  const gradientStart =
    variant === "lilac"
      ? "rgba(232,224,237,1)"
      : "rgba(251,240,235,1)";
  const gradientMid1 =
    variant === "lilac"
      ? "rgba(232,224,237,0.8)"
      : "rgba(251,240,235,0.8)";

  return (
    <div className="absolute inset-0 z-0 flex items-center justify-center">
      <div
        className="absolute z-0 rounded-full border border-white/30"
        style={{ width: outer, height: outer }}
      />
      <motion.div
        className="absolute z-0 rounded-full border border-white"
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
        animate={{ scale: [1, 1.02, 1], y: [0, -5, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
      />
      <motion.div
        className="absolute bg-white/5 z-[2] rounded-full border border-white/10 shadow-[0_0_200px_80px_rgba(255,255,255,0.1)]"
        style={{ width: inner, height: inner }}
        animate={{ scale: [1, 1.03, 1], y: [0, -7, 0] }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1],
        }}
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
          <span className="text-xs text-charcoal/70 font-medium">
            System active
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-charcoal/40">
          today
        </span>
      </div>

      {/* Missed call recovery card */}
      <div className="bg-white rounded-2xl p-3 mx-1 border border-warm-border/60 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-wine/70 font-medium">
              Missed-call recovery
            </p>
            <p className="text-sm text-charcoal font-medium mt-0.5">Santa E.</p>
            <p className="text-[11px] text-charcoal/50">Auto-text sent · 8s</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blush text-wine">
            triggered
          </span>
        </div>
        <div className="mt-2 bg-cream-dark rounded-lg p-2 text-[11px] text-charcoal/80 leading-snug">
          "Hi Santa, sorry I missed you. I can get you in Saturday 2pm or 3pm.
          Which works?"
        </div>
      </div>

      {/* Revenue recovered card */}
      <div className="bg-wine rounded-2xl p-3 mx-1 mt-2 shadow-sm">
        <p className="text-[10px] uppercase tracking-widest text-cream/70 font-medium">
          Revenue recovered
        </p>
        <p className="font-serif text-3xl font-bold text-cream mt-0.5">$960</p>
        <p className="text-[11px] text-cream/60">from 4 missed calls · 14 days</p>
      </div>

      {/* Booking confirmed card */}
      <div className="bg-blush-light rounded-2xl p-3 mx-1 mt-2 border border-wine/10 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-wine/70 font-medium">
              Booking confirmed
            </p>
            <p className="text-sm text-charcoal font-medium mt-0.5">
              Saturday · 2:00 PM
            </p>
            <p className="text-[11px] text-charcoal/50">
              Deep tissue · 60 min
            </p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-wine text-cream">
            $180
          </span>
        </div>
      </div>
    </div>
  );
}
