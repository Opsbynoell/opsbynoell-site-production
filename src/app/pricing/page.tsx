import type { Metadata } from "next";
import Link from "next/link";
import { PricingGrid } from "@/components/marketing/PricingGrid";
import { FaqSection } from "@/components/marketing/FaqSection";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { SectionShell } from "@/components/layout/SectionShell";
import { pageMetadata } from "@/lib/metadata";
import { pricingHero, novaStandaloneNote, pricingFaq, pricingDarkCta } from "@/content/pricing";
import { ROUTES } from "@/lib/constants";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata.pricing;

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(pricingFaq)) }}
      />

      {/* 1. Hero-lite intro */}
      <SectionShell compact className="bg-white border-b border-[#F0F0F0]">
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
            {pricingHero.headline}
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#4A4A4A] leading-relaxed">
            {pricingHero.subhead}
          </p>
          <p className="mt-2 text-sm text-[#717171]">{pricingHero.supportingLine}</p>
          <div className="mt-6">
            <Link
              href={ROUTES.book}
              className="inline-flex items-center justify-center rounded-full bg-[#E8604C] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d94f3b] transition-colors"
            >
              {pricingHero.primaryCta}
            </Link>
          </div>
        </div>
      </SectionShell>

      {/* 2. Pricing grid */}
      <PricingGrid />

      {/* 3. Nova standalone note — purple accent intentional */}
      <section className="py-14 bg-white border-y border-[#F0F0F0]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#1A1A1A] tracking-tight mb-6">
            {novaStandaloneNote.headline}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {novaStandaloneNote.options.map((option) => (
              <div
                key={option.label}
                className="rounded-2xl border border-[#7C5CFC]/20 bg-white p-6"
              >
                <h3 className="text-sm font-semibold text-[#7C5CFC]">
                  {option.label}
                </h3>
                <div className="mt-1">
                  <span className="text-2xl font-bold text-[#1A1A1A]">
                    ${option.monthlyPrice}
                  </span>
                  <span className="text-sm text-[#717171]">/mo</span>
                  <span className="ml-2 text-xs text-[#717171]">+ ${option.setupFee} setup</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#4A4A4A]">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link
              href={ROUTES.nova}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7C5CFC] hover:text-[#6b4de8] transition-colors"
            >
              {novaStandaloneNote.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. FAQ */}
      <FaqSection items={pricingFaq} headline="Common questions" />

      {/* 5. Dark CTA */}
      <DarkCtaBand
        headline={pricingDarkCta.headline}
        subhead={pricingDarkCta.subhead}
        primaryCta={pricingDarkCta.primaryCta}
      />
    </>
  );
}
