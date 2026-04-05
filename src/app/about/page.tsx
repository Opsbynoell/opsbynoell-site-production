import type { Metadata } from "next";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { SectionShell } from "@/components/layout/SectionShell";
import { pageMetadata } from "@/lib/metadata";
import { founderStory, whyOpsSection, founderImageBlock, aboutDarkCta } from "@/content/about";

export const metadata: Metadata = pageMetadata.about;

export default function AboutPage() {
  return (
    <>
      {/* 1. Founder story */}
      <SectionShell className="bg-white border-b border-[#F0F0F0]">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
            {founderStory.headline}
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#4A4A4A] leading-relaxed">
            {founderStory.subhead}
          </p>
          <div className="mt-6 flex flex-col gap-4">
            {founderStory.paragraphs.map((para, i) => (
              <p key={i} className="text-base text-[#4A4A4A] leading-relaxed">
                {para}
              </p>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* 2. Why Ops by Noell */}
      <SectionShell className="bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-8">
            {whyOpsSection.headline}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {whyOpsSection.cards.map((card) => (
              <div
                key={card.title}
                className="rounded-2xl bg-white border border-[#E8E8E8] p-6"
              >
                <h3 className="text-base font-semibold text-[#1A1A1A]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4A4A4A]">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* 3. Founder image placeholder */}
      <SectionShell compact className="bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-3xl bg-[#FAFAF9] border border-[#E8E8E8] aspect-[16/7] flex items-center justify-center">
            {founderImageBlock.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={founderImageBlock.imageSrc}
                alt={founderImageBlock.imageAlt}
                className="w-full h-full object-cover rounded-3xl"
              />
            ) : (
              <div className="text-center px-8">
                <p className="text-sm font-semibold text-[#1A1A1A]">
                  {founderImageBlock.captionHeadline}
                </p>
                <p className="mt-1 text-xs text-[#717171] max-w-xs mx-auto">
                  {founderImageBlock.captionBody}
                </p>
              </div>
            )}
          </div>
        </div>
      </SectionShell>

      {/* 4. Dark CTA */}
      <DarkCtaBand
        headline={aboutDarkCta.headline}
        subhead={aboutDarkCta.subhead}
        primaryCta={aboutDarkCta.primaryCta}
      />
    </>
  );
}
