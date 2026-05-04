"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "./button";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { PRICING_TIERS, type PricingTier, type TierId } from "@/lib/pricing";
import { trackMetaCustomEvent } from "@/lib/meta-pixel-track";

type PricingSourcePage =
  | "pricing"
  | "verticals_dental"
  | "verticals_med_spas"
  | "verticals_salons"
  | "verticals_massage"
  | "verticals_estheticians"
  | "verticals_hvac"
  | "verticals_chiro"
  | "systems";

function trackTierClick(tier: TierId, sourcePage: PricingSourcePage) {
  trackMetaCustomEvent("tier_card_click", {
    tier,
    source_page: sourcePage,
  });
}

export function PricingCard({
  tier,
  variant = "full",
  sourcePage = "pricing",
}: {
  tier: PricingTier;
  variant?: "full" | "compact";
  sourcePage?: PricingSourcePage;
}) {
  if (variant === "compact") {
    const previewFeatures = tier.features.slice(0, 3);
    return (
      <div
        className={cn(
          "relative rounded-[26px] flex flex-col gap-3 p-3",
          tier.isHighlighted
            ? "border border-white bg-gradient-to-b from-wine-light via-wine to-wine-dark"
            : "bg-warm-border/70"
        )}
      >
        <div className="space-y-4 p-5 bg-cream rounded-[20px] shadow-[0px_15px_15px_0px_rgba(28,25,23,0.08),0px_4px_8px_0px_rgba(28,25,23,0.10)]">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-charcoal rounded-full border border-warm-border bg-white inline-flex items-center px-3 py-1">
                {tier.tier}
              </h3>
              {tier.isHighlighted && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-wine">
                  recommended
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline">
              <span className="font-serif text-3xl font-bold text-charcoal">
                {tier.priceFrom}
              </span>
              <span className="ml-1 text-xs text-charcoal/70">
                {tier.cadence}
              </span>
            </div>
            <p className="text-[11px] text-charcoal/70 mt-1">{tier.note}</p>
          </div>

          <ul className="space-y-2 pt-1">
            {previewFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span
                  className={cn(
                    "flex-shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center",
                    tier.isHighlighted
                      ? "bg-wine text-cream"
                      : "bg-blush text-wine"
                  )}
                >
                  <IconCheck size={10} strokeWidth={3} />
                </span>
                <span className="text-xs text-charcoal/80 leading-snug">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <Link
            href="/pricing"
            onClick={() => trackTierClick(tier.id, sourcePage)}
            className="text-xs font-medium text-wine hover:text-wine-dark underline underline-offset-4 decoration-wine/30 inline-block"
          >
            See details &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-[37px] flex flex-col gap-3 p-4",
        tier.isHighlighted
          ? "border border-white bg-gradient-to-b from-wine-light via-wine to-wine-dark"
          : "bg-warm-border/70"
      )}
    >
      <div className="space-y-6 p-5 bg-cream rounded-[28px] shadow-[0px_95px_27px_0px_rgba(28,25,23,0.00),_0px_61px_24px_0px_rgba(28,25,23,0.03),_0px_34px_21px_0px_rgba(28,25,23,0.08),_0px_15px_15px_0px_rgba(28,25,23,0.12),_0px_4px_8px_0px_rgba(28,25,23,0.15)] pb-8 px-5">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm w-fit font-medium text-charcoal rounded-full border border-warm-border bg-white flex justify-center items-center px-4 py-1">
              {tier.tier}
            </h3>
            {tier.isHighlighted && (
              <span className="inline-flex items-center rounded-full bg-wine text-cream px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em]">
                Recommended for revenue recovery
              </span>
            )}
          </div>
          <div className="mt-3 flex items-baseline">
            <span className="font-serif text-4xl font-bold text-charcoal">
              {tier.priceFrom}
            </span>
            {tier.cadence && (
              <span className="ml-1 text-sm text-charcoal/70">
                {tier.cadence}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-charcoal/75 leading-relaxed">
            {tier.tagline}
          </p>
        </div>

        <Button
          href={tier.ctaHref}
          variant={tier.isHighlighted ? "primary" : "secondary"}
          className="w-full py-3"
          onClick={() => trackTierClick(tier.id, sourcePage)}
        >
          {tier.ctaLabel}
        </Button>

        <ul className="space-y-3 pt-2">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <span
                className={cn(
                  "flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center",
                  tier.isHighlighted
                    ? "bg-wine text-cream"
                    : "bg-blush text-wine"
                )}
              >
                <IconCheck size={11} strokeWidth={3} />
              </span>
              <span className="text-sm text-charcoal/80 leading-snug">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {tier.note && (
          <p className="text-[11px] text-charcoal/70 italic mt-2">
            {tier.note}
          </p>
        )}
      </div>
    </div>
  );
}

export function VerticalPricingSection({
  vertical,
  auditPhrase,
  sourcePage,
}: {
  vertical: string;
  auditPhrase: string;
  sourcePage: PricingSourcePage;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !firedRef.current) {
            firedRef.current = true;
            trackMetaCustomEvent("vertical_pricing_shown", { vertical });
          }
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [vertical]);

  return (
    <section ref={ref} className="w-full py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            pricing, plain
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            The same three packages power{" "}
            <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
              every vertical.
            </span>
          </h2>
          <p className="mt-5 text-charcoal/75 max-w-xl mx-auto">
            Your {auditPhrase} confirms the right fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {PRICING_TIERS.map((tier) => (
            <PricingCard
              key={tier.id}
              tier={tier}
              variant="compact"
              sourcePage={sourcePage}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/pricing"
            className="text-sm text-wine hover:text-wine-dark underline underline-offset-4 decoration-wine/30"
          >
            See full feature list &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Pricing() {
  return (
    <div id="pricing" className="pt-10 md:pt-12 pb-24 px-4 max-w-7xl mx-auto">
      {/* Decision D: integration depth by tier (prevents Essentials mis-sale) */}
      <div className="max-w-3xl mx-auto mb-14 rounded-[20px] border border-warm-border bg-cream/70 p-6 md:p-7 text-sm md:text-[15px] text-charcoal/80 leading-relaxed space-y-3">
        <p>
          <span className="font-semibold text-charcoal">
            All packages include:
          </span>{" "}
          vertical-appropriate copy and cadences, A2P-registered SMS,
          missed-call text-back, and a 14-day install managed by the Noell team.
        </p>
        <p>
          <span className="font-semibold text-charcoal">
            Growth and Custom Ops also include
          </span>{" "}
          two-way integration with your existing booking or practice management
          tool &mdash; reading availability out, writing confirmed bookings
          back. Custom Ops adds multi-location sync.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 items-start">
        {PRICING_TIERS.map((tier) => (
          <PricingCard key={tier.id} tier={tier} sourcePage="pricing" />
        ))}
      </div>
      <p className="text-center text-xs text-charcoal/70 mt-10 max-w-2xl mx-auto">
        Each package includes a one-time setup in addition to the monthly
        subscription. Your audit is where we confirm the right fit, answer any
        questions, and book the install. No bait pricing, no mystery scope.
      </p>
      <p className="text-center text-[11px] italic text-charcoal/70 mt-3 max-w-2xl mx-auto">
        Upgrading between tiers is prorated and takes effect immediately.
        Downgrades take effect at the start of the next billing month.
      </p>
    </div>
  );
}
