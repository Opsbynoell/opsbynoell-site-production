import type { Metadata } from "next";
import { HeroSection } from "@/components/marketing/HeroSection";
import { StatsBar } from "@/components/marketing/StatsBar";
import { AudienceCards } from "@/components/marketing/AudienceCards";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { CaseStudySection } from "@/components/marketing/CaseStudySection";
import { FoundersSection } from "@/components/marketing/FoundersSection";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { pageMetadata } from "@/lib/metadata";
import { darkCtaSection } from "@/content/home";
import { localBusinessSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata.home;

export default function HomePage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />

      {/* 1. Hero — stop the scroll */}
      <HeroSection />

      {/* 2. Stats bar — turn attention into credibility */}
      <StatsBar />

      {/* 3. Who This Is For — "that's me" response */}
      <AudienceCards />

      {/* 4. The Real Problem — agitate + reframe */}
      <ProblemSection />

      {/* 5. Santa case study — proof near doubt */}
      <CaseStudySection />

      {/* 6. Founders — human trust */}
      <FoundersSection />

      {/* 7. Dark CTA */}
      <DarkCtaBand
        headline={darkCtaSection.headline}
        subhead={darkCtaSection.subhead}
        primaryCta={darkCtaSection.primaryCta}
        reassurance={darkCtaSection.reassurance}
      />
    </>
  );
}
