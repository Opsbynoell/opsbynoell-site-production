import type { Metadata } from "next";
import Link from "next/link";
import { SystemsBento } from "@/components/marketing/SystemsBento";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { SectionShell } from "@/components/layout/SectionShell";
import { pageMetadata } from "@/lib/metadata";
import { servicesHero, servicesDarkCta } from "@/content/services";
import { ROUTES } from "@/lib/constants";

export const metadata: Metadata = pageMetadata.services;

export default function ServicesPage() {
  return (
    <>
      {/* 1. Hero-lite intro */}
      <SectionShell compact className="bg-white border-b border-[#F0F0F0]">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
            {servicesHero.headline}
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#4A4A4A] leading-relaxed max-w-2xl">
            {servicesHero.subhead}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href={ROUTES.book}
              className="inline-flex items-center justify-center rounded-full bg-[#E8604C] px-6 py-3 text-sm font-semibold text-white hover:bg-[#d94f3b] transition-colors w-full sm:w-auto"
            >
              {servicesHero.primaryCta}
            </Link>
            <Link
              href={ROUTES.pricing}
              className="inline-flex items-center justify-center rounded-full border border-[#E8E8E8] px-6 py-3 text-sm font-semibold text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors w-full sm:w-auto"
            >
              {servicesHero.secondaryCta}
            </Link>
          </div>
        </div>
      </SectionShell>

      {/* 2. The 6 systems */}
      <SystemsBento />

      {/* 3. How It Works */}
      <HowItWorks />

      {/* 4. Dark CTA */}
      <DarkCtaBand
        headline={servicesDarkCta.headline}
        subhead={servicesDarkCta.subhead}
        primaryCta={servicesDarkCta.primaryCta}
      />
    </>
  );
}
