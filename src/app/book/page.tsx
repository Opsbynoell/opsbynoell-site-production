import type { Metadata } from "next";
import { BookingEmbed } from "@/components/marketing/BookingEmbed";
import { ReassuranceCards } from "@/components/marketing/ReassuranceCards";
import { SectionShell } from "@/components/layout/SectionShell";
import { pageMetadata } from "@/lib/metadata";
import { reassuranceIntro } from "@/content/book";

export const metadata: Metadata = pageMetadata.book;

export default function BookPage() {
  return (
    <>
      {/* 1. Reassurance intro — reduce vulnerability before the calendar */}
      <SectionShell compact className="bg-white border-b border-[#F0F0F0]">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] tracking-tight leading-tight">
            {reassuranceIntro.headline}
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#4A4A4A] leading-relaxed">
            {reassuranceIntro.subhead}
          </p>
          <p className="mt-3 text-sm font-medium text-[#E8604C]">
            {reassuranceIntro.reassuranceLine}
          </p>
          <p className="mt-1 text-sm text-[#717171]">
            {reassuranceIntro.trustLine}
          </p>
        </div>
      </SectionShell>

      {/* 2. Calendar embed — dominant action, no distractions */}
      <BookingEmbed />

      {/* 3. Reassurance cards — remove final objections */}
      <ReassuranceCards />
    </>
  );
}
