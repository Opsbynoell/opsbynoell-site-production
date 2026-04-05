import type { Metadata } from "next";
import { NovaSpotlight } from "@/components/marketing/NovaSpotlight";
import { CompareCards } from "@/components/marketing/CompareCards";
import { FaqSection } from "@/components/marketing/FaqSection";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { SectionShell } from "@/components/layout/SectionShell";
import { pageMetadata } from "@/lib/metadata";
import { novaFeatures, novaFaq, novaDarkCta } from "@/content/nova";
import { faqSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata.nova;

export default function NovaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema(novaFaq)) }}
      />

      {/* 1. Nova spotlight — purple accent intentional */}
      <NovaSpotlight />

      {/* 2. Nova features */}
      <SectionShell className="bg-[#F9F7FF]">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {novaFeatures.headline}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {novaFeatures.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-white border border-[#7C5CFC]/15 p-6 hover:border-[#7C5CFC]/35 hover:shadow-sm transition-all duration-200"
            >
              <h3 className="text-base font-semibold text-[#7C5CFC]">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[#4A4A4A]">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* 3. Nova vs Full System */}
      <CompareCards />

      {/* 4. FAQ */}
      <FaqSection items={novaFaq} headline="Questions about Nova" />

      {/* 5. Dark CTA */}
      <DarkCtaBand
        headline={novaDarkCta.headline}
        subhead={novaDarkCta.subhead}
        primaryCta={novaDarkCta.primaryCta}
      />
    </>
  );
}
