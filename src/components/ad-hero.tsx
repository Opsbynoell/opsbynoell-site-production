"use client";
/**
 * AdHero, GTM item 1
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
    // Hook type: Bleeding Money
    "missed-calls": {
      eyebrow: "You are paying for leads that go to voicemail",
      headlineLine1Start: "You paid $60 for that lead.",
      headlineLine1Accent: "",
      headlineLine2Start: "They heard your voicemail and called",
      headlineLine2Accent: "someone else.",
      body: "Noell Front Desk texts back within 5 minutes, qualifies the lead, and books the appointment before they call your competitor. Done for you. Live in 14 days.",
    },
    // Hook type: Contrarian
    receptionist: {
      eyebrow: "Stop hiring receptionists who quit in three weeks",
      headlineLine1Start: "Your receptionist quit.",
      headlineLine1Accent: "",
      headlineLine2Start: "Ours has never",
      headlineLine2Accent: "missed a call.",
      body: "Calls, scheduling, confirmations, reminders, reschedules, review capture, and reactivation. Everything a receptionist handles, managed by our team. No hiring. No training. No turnover.",
    },
    // Hook type: Identity
    reputation: {
      eyebrow: "You built a great business",
      headlineLine1Start: "Do not let a missed call",
      headlineLine1Accent: "",
      headlineLine2Start: "ruin your",
      headlineLine2Accent: "reputation.",
      body: "Your clients chose you because you are reliable. Noell Front Desk makes sure every call, inquiry, and follow-up reflects that. Done for you. No software to learn.",
    },
  },
  support: {
    // Hook type: Bleeding Money
    "missed-calls": {
      eyebrow: "Your marketing is not failing you. Your front desk is.",
      headlineLine1Start: "You are spending money on ads",
      headlineLine1Accent: "",
      headlineLine2Start: "to fill your",
      headlineLine2Accent: "voicemail.",
      body: "Noell Support is your AI front desk for new prospects. It catches every inquiry, qualifies the lead, and routes them to booking while you are with another client. Done for you.",
    },
    // Hook type: Specificity
    "first-response": {
      eyebrow: "Five minutes is the window",
      headlineLine1Start: "After 5 minutes, your odds",
      headlineLine1Accent: "",
      headlineLine2Start: "of booking that lead drop by",
      headlineLine2Accent: "80%.",
      body: "Noell Support responds to every inquiry the moment it comes in, 24 hours a day, 7 days a week. The business that responds first wins the client. That business is now you.",
    },
  },
  care: {
    // Hook type: Identity
    regulars: {
      eyebrow: "Your best clients deserve better",
      headlineLine1Start: "A great client stopped booking.",
      headlineLine1Accent: "",
      headlineLine2Start: "You found out",
      headlineLine2Accent: "three months later.",
      body: "Noell Care monitors your client book for gaps and sends proactive reactivation messages before they find someone else. Retention handled. No manual outreach required.",
    },
    // Hook type: Competitor Frustration
    recognition: {
      eyebrow: "Noell Care · Client retention, managed for you",
      headlineLine1Start: "They stayed.",
      headlineLine1Accent: "Make sure they feel it.",
      headlineLine2Start: "Recognized.",
      headlineLine2Accent: "Not re-interrogated.",
      body: "Noell Care knows your clients by name, history, and preference. Every interaction feels personal because it is. No dashboard to manage. We handle it.",
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
  footnote?: string;
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
  footnote,
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
      footnote={footnote}
    />
  );
}
