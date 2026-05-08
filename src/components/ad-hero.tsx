"use client";
/**
 * AdHero — GTM item 1
 *
 * A thin client wrapper around <Hero> that reads UTM parameters from the URL
 * and swaps the hero headline to match the ad angle that drove the click.
 *
 * Usage: replace <Hero ... /> on agent pages with <AdHero page="frontDesk" ... />
 *
 * Supported utm_content values per page:
 *
 * /noell-front-desk
 *   utm_content=missed-calls   → "You're missing calls right now"
 *   utm_content=receptionist   → "Your receptionist can't do all of this"
 *   (default)                  → existing headline
 *
 * /noell-support
 *   utm_content=missed-calls   → "You're missing calls right now"
 *   utm_content=first-response → "Your first response sets the tone"
 *   (default)                  → existing headline
 *
 * /noell-care
 *   utm_content=regulars       → "Your regulars deserve better than a hold queue"
 *   utm_content=recognition    → "They stayed. Make sure they feel it."
 *   (default)                  → existing headline
 *
 * The component also adds an "Ad landing" eyebrow badge when utm_source is present,
 * so you can visually confirm ad traffic is landing correctly in session replays.
 */

import { useEffect, useState } from "react";
import { Hero } from "@/components/hero";
import type { SourcePage } from "@/lib/analytics";

type AdPage = "frontDesk" | "support" | "care";

interface AdHeadline {
  eyebrow?: string;
  headlineLine1Start?: string;
  headlineLine1Accent?: string;
  headlineLine2Start?: string;
  headlineLine2Accent?: string;
  body?: string;
}

const AD_HEADLINES: Record<AdPage, Record<string, AdHeadline>> = {
  frontDesk: {
    "missed-calls": {
      eyebrow: "Noell Front Desk · You're losing revenue right now",
      headlineLine1Start: "Every missed call is",
      headlineLine1Accent: "$300 walking out.",
      headlineLine2Start: "We stop that",
      headlineLine2Accent: "today.",
      body: "Noell Front Desk catches missed calls, texts back in under 10 seconds, and books the appointment before they call your competitor. Setup in 48 hours.",
    },
    receptionist: {
      eyebrow: "Noell Front Desk · Your front desk, upgraded",
      headlineLine1Start: "Your receptionist",
      headlineLine1Accent: "can't do all of this.",
      headlineLine2Start: "Noell",
      headlineLine2Accent: "can.",
      body: "Calls, scheduling, confirmations, reminders, reschedules, review capture, and reactivation. Everything a receptionist handles, managed automatically.",
    },
  },
  support: {
    "missed-calls": {
      eyebrow: "Noell Support · Stop losing leads to missed calls",
      headlineLine1Start: "You're missing calls",
      headlineLine1Accent: "right now.",
      headlineLine2Start: "Noell answers",
      headlineLine2Accent: "in 10 seconds.",
      body: "Noell Support is your AI front desk for new prospects. It catches missed calls, qualifies the lead, and books the appointment while you're with another client.",
    },
    "first-response": {
      eyebrow: "Noell Support · First response wins the client",
      headlineLine1Start: "Your first response",
      headlineLine1Accent: "sets the tone.",
      headlineLine2Start: "Make it",
      headlineLine2Accent: "instant.",
      body: "The business that responds first wins the client 78% of the time. Noell Support makes sure that business is always you.",
    },
  },
  care: {
    regulars: {
      eyebrow: "Noell Care · For your best clients",
      headlineLine1Start: "Your regulars deserve",
      headlineLine1Accent: "better than a hold queue.",
      headlineLine2Start: "Give them",
      headlineLine2Accent: "that.",
      body: "Noell Care recognizes your returning clients the moment they reach out. No re-explaining. No hold music. Just the experience that keeps them coming back.",
    },
    recognition: {
      eyebrow: "Noell Care · Client recognition, automated",
      headlineLine1Start: "They stayed.",
      headlineLine1Accent: "Make sure they feel it.",
      headlineLine2Start: "Recognized.",
      headlineLine2Accent: "Not re-interrogated.",
      body: "Noell Care knows your clients by name, history, and preference. Every interaction feels personal because it is.",
    },
  },
};

interface AdHeroProps {
  page: AdPage;
  // Default (non-ad) hero props — passed through when no UTM match
  defaultEyebrow?: string;
  defaultHeadlineLine1Start?: string;
  defaultHeadlineLine1Accent?: string;
  defaultHeadlineLine2Start?: string;
  defaultHeadlineLine2Accent?: string;
  defaultBody?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  showProofBar?: boolean;
  priceSignal?: React.ReactNode;
  mockScreen?: React.ReactNode;
  sourcePage?: SourcePage;
  variant?: "wine" | "lilac" | "sage";
}

export function AdHero({
  page,
  defaultEyebrow,
  defaultHeadlineLine1Start,
  defaultHeadlineLine1Accent,
  defaultHeadlineLine2Start,
  defaultHeadlineLine2Accent,
  defaultBody,
  primaryCta,
  secondaryCta,
  showProofBar,
  priceSignal,
  mockScreen,
  sourcePage,
  variant,
}: AdHeroProps) {
  const [adOverride, setAdOverride] = useState<AdHeadline | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const utmContent = params.get("utm_content");
    if (utmContent && AD_HEADLINES[page][utmContent]) {
      setAdOverride(AD_HEADLINES[page][utmContent]);
    }
  }, [page]);

  return (
    <Hero
      variant={variant}
      eyebrow={adOverride?.eyebrow ?? defaultEyebrow}
      headlineLine1Start={adOverride?.headlineLine1Start ?? defaultHeadlineLine1Start}
      headlineLine1Accent={adOverride?.headlineLine1Accent ?? defaultHeadlineLine1Accent}
      headlineLine2Start={adOverride?.headlineLine2Start ?? defaultHeadlineLine2Start}
      headlineLine2Accent={adOverride?.headlineLine2Accent ?? defaultHeadlineLine2Accent}
      body={adOverride?.body ?? defaultBody}
      primaryCta={primaryCta}
      secondaryCta={secondaryCta}
      showProofBar={showProofBar}
      priceSignal={priceSignal}
      mockScreen={mockScreen}
      sourcePage={sourcePage}
    />
  );
}
