import type { Metadata } from "next";
import { NovaSpotlight } from "@/components/marketing/NovaSpotlight";
import { CompareCards } from "@/components/marketing/CompareCards";
import { FaqSection } from "@/components/marketing/FaqSection";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { SectionShell } from "@/components/layout/SectionShell";
import { pageMetadata } from "@/lib/metadata";
import { novaFeatures, novaFaq, novaFaqHeadline, novaDarkCta } from "@/content/nova";
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

      {/* 2. Nova features — lilac-tinted bg to bridge from hero */}
      <SectionShell className="bg-[#FAF5F0]">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6664] mb-3">
            What Nova Does
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1F1A1A] tracking-tight">
            {novaFeatures.headline}
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {novaFeatures.cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-white border border-[#E0D4E8] p-6 hover:border-[#7C5CFC]/30 hover:shadow-[0_4px_20px_rgba(31,26,26,0.06)] transition-all duration-200"
            >
              {/* Small Nova dot accent */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]" />
                <h3 className="text-sm font-semibold text-[#7C5CFC]">
                  {card.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[#6D6664]">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* 3. Nova vs Full System */}
      <CompareCards />

      {/* 4. FAQ */}
      <FaqSection items={novaFaq} headline={novaFaqHeadline} />

      {/* 5. Dark CTA */}
      <DarkCtaBand
        headline={novaDarkCta.headline}
        subhead={novaDarkCta.subhead}
        primaryCta={novaDarkCta.primaryCta}
      />
    </>
  );
}
