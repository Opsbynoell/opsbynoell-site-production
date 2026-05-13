"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "./button";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { SERVICE_TIERS, B2B_TIERS, PRICING_TIERS, type PricingTier, type TierId } from "@/lib/pricing";
import { trackMetaCustomEvent } from "@/lib/meta-pixel-track";

// ─────────────────────────────────────────────────────────────────────────────
// CTA button — all tiers link to /book (no Stripe checkout for now)
// ─────────────────────────────────────────────────────────────────────────────
function PricingCtaButton({
  tier,
  sourcePage,
}: {
  tier: PricingTier;
  sourcePage: PricingSourcePage;
}) {
  return (
    <Button
      href={tier.ctaHref || "/book"}
      variant={tier.isHighlighted ? "primary" : "secondary"}
      className="w-full py-3"
      onClick={() => trackTierClick(tier.id, sourcePage)}
    >
      {tier.ctaLabel}
    </Button>
  );
}

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
  const isB2B = tier.track === "b2b";

  if (variant === "compact") {
    const previewFeatures = tier.features.slice(0, 3);
    return (
      <div
        className={cn(
          "relative rounded-[26px] flex flex-col gap-3 p-3",
          tier.isHighlighted
            ? isB2B
              ? "border border-white/20 bg-gradient-to-b from-[#4A2060] via-[#3A1850] to-[#2A1040]"
              : "border border-white bg-gradient-to-b from-wine-light via-wine to-wine-dark"
            : "bg-warm-border/70"
        )}
      >
        <div className="space-y-4 p-5 bg-[#1F1219] rounded-[20px] shadow-[0px_15px_15px_0px_rgba(28,25,23,0.08),0px_4px_8px_0px_rgba(28,25,23,0.10)]">
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-cream rounded-full border border-white/10 bg-[#271520] inline-flex items-center px-3 py-1">
                {tier.tier}
              </h3>
              {tier.isHighlighted && (
                <span className="text-[10px] font-mono uppercase tracking-widest text-wine">
                  recommended
                </span>
              )}
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold text-cream">
                {tier.launchPrice ?? tier.standardPrice}
              </span>
              <span className="text-xs text-cream/70">{tier.cadence}</span>
              {tier.launchPrice && (
                <span className="text-[10px] text-cream/40 line-through">{tier.standardPrice}</span>
              )}
            </div>
            {tier.launchPrice && (
              <p className="text-[10px] text-wine/80 mt-0.5 font-medium">Launch pricing</p>
            )}
          </div>

          <ul className="space-y-2 pt-1">
            {previewFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span
                  className={cn(
                    "flex-shrink-0 mt-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center",
                    tier.isHighlighted
                      ? "bg-wine text-cream"
                      : "bg-[#2A1520] text-wine"
                  )}
                >
                  <IconCheck size={10} strokeWidth={3} />
                </span>
                <span className="text-xs text-cream/80 leading-snug">
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
          ? isB2B
            ? "border border-white/20 bg-gradient-to-b from-[#4A2060] via-[#3A1850] to-[#2A1040]"
            : "border border-white bg-gradient-to-b from-wine-light via-wine to-wine-dark"
          : "bg-warm-border/70"
      )}
    >
      <div className="space-y-6 p-5 bg-[#1F1219] rounded-[28px] shadow-[0px_95px_27px_0px_rgba(28,25,23,0.00),_0px_61px_24px_0px_rgba(28,25,23,0.03),_0px_34px_21px_0px_rgba(28,25,23,0.08),_0px_15px_15px_0px_rgba(28,25,23,0.12),_0px_4px_8px_0px_rgba(28,25,23,0.15)] pb-8 px-5">
        <div className="flex flex-col">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-sm w-fit font-medium text-cream rounded-full border border-white/10 bg-[#271520] flex justify-center items-center px-4 py-1">
              {tier.tier}
            </h3>
            {tier.isHighlighted && (
              <span className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-mono uppercase tracking-[0.18em]",
                isB2B ? "bg-[#4A2060] text-cream/90" : "bg-wine text-cream"
              )}>
                Most popular
              </span>
            )}
          </div>
          {tier.bestFor && (
            <p className="mt-3 text-xs font-medium text-wine">
              {tier.bestFor}
            </p>
          )}
          {/* Price display */}
          <div className="mt-3 flex items-baseline gap-2 flex-wrap">
            <span className="font-serif text-4xl font-bold text-cream">
              {tier.launchPrice ?? tier.standardPrice}
            </span>
            {tier.cadence && (
              <span className="text-sm text-cream/70">
                {tier.cadence}
              </span>
            )}
            {tier.launchPrice && (
              <span className="text-sm text-cream/35 line-through">{tier.standardPrice}</span>
            )}
          </div>
          {tier.launchPrice && (
            <div className="mt-1 inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-wine animate-pulse" />
              <p className="text-xs font-medium text-wine">
                Launch pricing — limited time
              </p>
            </div>
          )}
          {tier.summary && (
            <p className="mt-3 text-sm font-medium text-cream">
              {tier.summary}
            </p>
          )}
          <p className="mt-2 text-sm text-cream/75 leading-relaxed">
            {tier.tagline}
          </p>
        </div>

        <PricingCtaButton tier={tier} sourcePage={sourcePage} />

        <ul className="space-y-3 pt-2">
          {tier.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <span
                className={cn(
                  "flex-shrink-0 mt-0.5 w-4 h-4 rounded-full flex items-center justify-center",
                  tier.isHighlighted
                    ? "bg-wine text-cream"
                    : "bg-[#2A1520] text-wine"
                )}
              >
                <IconCheck size={11} strokeWidth={3} />
              </span>
              <span className="text-sm text-cream/80 leading-snug">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        {tier.note && (
          <p className="text-[11px] text-cream/50 italic mt-2">
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
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
            Three packages.{" "}
            <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
              One operational standard.
            </span>
          </h2>
          <p className="mt-5 text-cream/75 max-w-xl mx-auto">
            Your {auditPhrase} confirms the right fit.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {SERVICE_TIERS.map((tier) => (
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
            See full feature list and B2B pricing &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Pricing() {
  return (
    <div id="pricing" className="pt-10 md:pt-12 pb-24 px-4 max-w-7xl mx-auto">

      {/* Launch pricing banner */}
      <div className="max-w-3xl mx-auto mb-12 rounded-[20px] border border-wine/30 bg-wine/10 p-5 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-wine animate-pulse" />
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-wine">Launch Pricing — Limited Time</p>
        </div>
        <p className="text-sm text-cream/80 leading-relaxed">
          All tiers are available at launch pricing while we expand into new verticals. Standard rates are shown with a strikethrough. Your rate is locked from day one.
        </p>
      </div>

      {/* Service Track */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-wine/70 mb-1">Track 01</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream">Service Businesses</h2>
            <p className="text-sm text-cream/60 mt-1">Appointment-based, local, and consumer service</p>
          </div>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {SERVICE_TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} sourcePage="pricing" />
          ))}
        </div>
      </div>

      {/* B2B Track */}
      <div className="mb-16">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#9B6FC4]/70 mb-1">Track 02</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream">B2B and Enterprise</h2>
            <p className="text-sm text-cream/60 mt-1">SaaS, professional services, and enterprise sales</p>
          </div>
          <div className="h-px flex-1 bg-white/10" />
        </div>
        <div className="grid md:grid-cols-3 gap-5 items-start">
          {B2B_TIERS.map((tier) => (
            <PricingCard key={tier.id} tier={tier} sourcePage="pricing" />
          ))}
        </div>
      </div>

      {/* Full-width Noell Ops CRM dashboard showcase */}
      <div className="mt-20 mb-6">
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.3em] text-wine/70 mb-2">Included in Full Stack and Enterprise</p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream">
            The Noell Ops CRM
          </h2>
          <p className="mt-3 text-sm text-cream/60 max-w-xl mx-auto">
            A live pipeline dashboard built for your business. HOT/WARM lead scoring, iMessage and email outreach sequences, contact management, and one-click enrollment. Runs under your brand.
          </p>
        </div>

        {/* Browser chrome wrapper */}
        <div className="rounded-[20px] overflow-hidden border border-white/10 shadow-[0px_40px_80px_rgba(0,0,0,0.5)]">
          {/* Browser chrome bar */}
          <div className="flex items-center gap-2 px-4 py-3 bg-[#0E080C] border-b border-white/10">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
            <div className="flex-1 mx-4">
              <div className="bg-[#1A0F14] rounded-md px-3 py-1 text-[11px] font-mono text-cream/30 text-center">
                noelldash.manus.space
              </div>
            </div>
          </div>
          {/* Dashboard screenshot */}
          <div className="relative">
            <img
              src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663120940829/iSNpIDnlLiHRnrsy.png"
              alt="Noell Ops CRM Lead Intelligence Dashboard"
              className="w-full block"
            />
            {/* Subtle fade at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#120A0F] to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Build Your Own — Add-On Services */}
      <div className="mt-24 mb-6">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-wine/70 mb-1">Beyond Enterprise</p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream">Build Your Own Stack</h2>
            <p className="text-sm text-cream/60 mt-2 max-w-2xl">
              Every add-on below is a service most businesses assume requires a full-time hire or agency retainer.
              Layer any combination onto your base package.
            </p>
          </div>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Add-on grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

          {/* Digital Infrastructure */}
          <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-wine/60 mb-2">01</p>
            <h3 className="font-serif text-lg font-semibold text-cream mb-1">Digital Infrastructure</h3>
            <p className="text-xs text-cream/50 mb-5">The foundation everything else runs on. Disconnected tools, zero automation, no single source of truth — this fixes that.</p>
            <ul className="space-y-3">
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Tech Stack Audit + Cleanup</span>
                <span className="text-xs text-wine whitespace-nowrap">$297 one-time</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">CRM + Pipeline Setup</span>
                <span className="text-xs text-wine whitespace-nowrap">$497 setup + $197/mo</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Workflow Automation (3/qtr)</span>
                <span className="text-xs text-wine whitespace-nowrap">$297/mo</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Unified Analytics Dashboard</span>
                <span className="text-xs text-wine whitespace-nowrap">$197/mo</span>
              </li>
            </ul>
          </div>

          {/* Online Presence */}
          <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-wine/60 mb-2">02</p>
            <h3 className="font-serif text-lg font-semibold text-cream mb-1">Online Presence</h3>
            <p className="text-xs text-cream/50 mb-5">Technical SEO, local search, and website performance. If they can't find you, they can't hire you.</p>
            <ul className="space-y-3">
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Technical SEO Audit</span>
                <span className="text-xs text-wine whitespace-nowrap">$497 one-time</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Local SEO Management</span>
                <span className="text-xs text-wine whitespace-nowrap">$297/mo</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">SEO Content Engine (4 posts/mo)</span>
                <span className="text-xs text-wine whitespace-nowrap">$497/mo</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Website Performance Optimization</span>
                <span className="text-xs text-wine whitespace-nowrap">$297/mo</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-wine/60 mb-2">03</p>
            <h3 className="font-serif text-lg font-semibold text-cream mb-1">Social Media</h3>
            <p className="text-xs text-cream/50 mb-5">Consistency is the product. Most businesses post when they remember. This makes it automatic, on-brand, and strategic.</p>
            <ul className="space-y-3">
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Content Calendar + Scheduling</span>
                <span className="text-xs text-wine whitespace-nowrap">$297/mo</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Short-Form Video Scripts (4/mo)</span>
                <span className="text-xs text-wine whitespace-nowrap">$197/mo</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Social Listening + Engagement</span>
                <span className="text-xs text-wine whitespace-nowrap">$197/mo</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">LinkedIn B2B Outreach</span>
                <span className="text-xs text-wine whitespace-nowrap">$497/mo</span>
              </li>
            </ul>
          </div>

          {/* Brand Kit + Visual Identity */}
          <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-wine/60 mb-2">04</p>
            <h3 className="font-serif text-lg font-semibold text-cream mb-1">Brand Kit + Visual Identity</h3>
            <p className="text-xs text-cream/50 mb-5">The vibe is the first thing they feel. Before anyone reads a word, they've already decided if you're credible.</p>
            <ul className="space-y-3">
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Brand Audit</span>
                <span className="text-xs text-wine whitespace-nowrap">$297 one-time</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Full Brand Kit Build</span>
                <span className="text-xs text-wine whitespace-nowrap">$997 one-time</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Copywriting Voice Guide</span>
                <span className="text-xs text-wine whitespace-nowrap">$497 one-time</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Visual Templates (social, email, decks)</span>
                <span className="text-xs text-wine whitespace-nowrap">$297 one-time</span>
              </li>
            </ul>
          </div>

          {/* Psychology + Conversion */}
          <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-wine/60 mb-2">05</p>
            <h3 className="font-serif text-lg font-semibold text-cream mb-1">Psychology + Conversion</h3>
            <p className="text-xs text-cream/50 mb-5">The words and the flow that make people say yes. The difference between a site that explains and one that converts.</p>
            <ul className="space-y-3">
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Conversion Copy Rewrite</span>
                <span className="text-xs text-wine whitespace-nowrap">$997 one-time</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Full Funnel Design + Build</span>
                <span className="text-xs text-wine whitespace-nowrap">$1,497 one-time</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">7-Email Nurture Sequence</span>
                <span className="text-xs text-wine whitespace-nowrap">$497 one-time</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Offer Positioning Workshop (90 min)</span>
                <span className="text-xs text-wine whitespace-nowrap">$497 one-time</span>
              </li>
            </ul>
          </div>

          {/* Operational Systems */}
          <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-6">
            <p className="text-[10px] uppercase tracking-[0.25em] text-wine/60 mb-2">06</p>
            <h3 className="font-serif text-lg font-semibold text-cream mb-1">Operational Systems</h3>
            <p className="text-xs text-cream/50 mb-5">The back office that runs itself. The stuff that eats your time and never shows up on a revenue report — until it breaks.</p>
            <ul className="space-y-3">
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">SOP Documentation (5 processes)</span>
                <span className="text-xs text-wine whitespace-nowrap">$497 one-time</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Client Onboarding System</span>
                <span className="text-xs text-wine whitespace-nowrap">$697 one-time</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Automated Reporting + KPI Dashboard</span>
                <span className="text-xs text-wine whitespace-nowrap">$197/mo</span>
              </li>
              <li className="flex justify-between items-start gap-4">
                <span className="text-sm text-cream/80">Team Playbook</span>
                <span className="text-xs text-wine whitespace-nowrap">$497 one-time</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Full Ops Partner CTA */}
        <div className="mt-10 rounded-[20px] border border-wine/30 bg-wine/10 p-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-wine mb-3">Full Ops Partner</p>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-3">
            $3,500 – $6,500 / mo
          </h3>
          <p className="text-sm text-cream/70 max-w-2xl mx-auto mb-2">
            Base package + 3 to 5 add-ons + dedicated ops partner + monthly strategy session + quarterly business review.
          </p>
          <p className="text-xs text-cream/50 max-w-2xl mx-auto mb-6">
            The equivalent of hiring a Director of Marketing, SEO Specialist, CRM Admin, Brand Designer, and Social Media Manager.
            That's $318,000/yr in headcount — or $26,500/mo. With Ops by Noell, it's one retainer. No benefits. No turnover. No training.
          </p>
          <Link
            href="/book"
            className="inline-block bg-wine text-cream text-sm font-medium px-8 py-3 rounded-full hover:bg-wine/90 transition-colors"
          >
            Book a scoping call
          </Link>
        </div>
      </div>

      <p className="text-center text-xs text-cream/50 mt-10 max-w-2xl mx-auto">
        All engagements start with a free audit call. No bait pricing, no mystery scope. Your rate is locked from day one.
      </p>
      <p className="text-center text-[11px] italic text-cream/40 mt-3 max-w-2xl mx-auto">
        Upgrading between tiers is prorated and takes effect immediately. Downgrades take effect at the start of the next billing month.
      </p>
    </div>
  );
}
