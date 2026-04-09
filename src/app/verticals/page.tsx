import type { Metadata } from "next";
import Link from "next/link";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { SectionShell } from "@/components/layout/SectionShell";
import { pageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/constants";
import {
  verticalsHero,
  verticalsOverview,
  verticals,
  fitCheck,
  verticalsDarkCta,
} from "@/content/verticals";

export const metadata: Metadata = pageMetadata.verticals;

export default function VerticalsPage() {
  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <SectionShell compact className="bg-[#FFF7F4] border-b border-[#EDE3DE]">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6664] mb-4">
            {verticalsHero.eyebrow}
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1A1A] leading-tight">
            {verticalsHero.headline}
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#6D6664] leading-relaxed max-w-2xl">
            {verticalsHero.subhead}
          </p>
          <div className="mt-6">
            <Link
              href={ROUTES.book}
              className="inline-flex items-center justify-center rounded-full bg-[#6A2C3E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5a2233] transition-colors shadow-[0_2px_12px_rgba(106,44,62,0.2)]"
            >
              {verticalsHero.primaryCta}
            </Link>
          </div>
        </div>
      </SectionShell>

      {/* ── 2. Overview + Industry Grid ──────────────────────────────────────── */}
      <SectionShell className="bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F1A1A] tracking-tight">
              {verticalsOverview.headline}
            </h2>
            <p className="mt-3 text-base text-[#6D6664] leading-relaxed max-w-2xl mx-auto">
              {verticalsOverview.subhead}
            </p>
          </div>

          {/* 7-card grid — 3 cols desktop, 2 tablet, 1 mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {verticals.map((v, i) => (
              <Link
                key={v.id}
                href={`/verticals/${v.id}`}
                className="group relative rounded-2xl border border-[#EDE3DE] bg-[#FAF5F0] p-6 hover:border-[#6A2C3E]/25 hover:shadow-[0_4px_20px_rgba(31,26,26,0.07)] transition-all duration-200 flex flex-col"
              >
                {/* Index numeral — faint, top right */}
                <span
                  className="pointer-events-none select-none absolute top-3 right-5 font-display text-5xl font-bold leading-none text-[#EDE3DE] group-hover:text-[#E0D4D8] transition-colors"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6D6664] mb-1.5">
                  {v.eyebrow}
                </p>
                <h3 className="font-display text-lg font-bold text-[#1F1A1A] leading-tight mb-3">
                  {v.title}
                </h3>
                <p className="text-xs leading-relaxed text-[#6D6664] flex-1">
                  {v.cardPain}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#6A2C3E] group-hover:text-[#5a2233] transition-colors">
                  See how it works
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ── 3. Fit Check ─────────────────────────────────────────────────────── */}
      <SectionShell compact className="bg-[#FAF5F0] border-y border-[#EDE3DE]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-xl md:text-2xl font-bold text-[#1F1A1A] tracking-tight">
            {fitCheck.headline}
          </h2>
          <p className="mt-3 text-base text-[#6D6664] leading-relaxed">
            {fitCheck.body}
          </p>
          <div className="mt-6">
            <Link
              href={ROUTES.book}
              className="inline-flex items-center justify-center rounded-full bg-[#6A2C3E] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5a2233] transition-colors"
            >
              {fitCheck.cta}
            </Link>
            <p className="mt-2 text-xs text-[#6D6664]">{fitCheck.ctaNote}</p>
          </div>
        </div>
      </SectionShell>

      {/* ── 4. Dark CTA ──────────────────────────────────────────────────────── */}
      <DarkCtaBand
        headline={verticalsDarkCta.headline}
        subhead={verticalsDarkCta.subhead}
        primaryCta={verticalsDarkCta.primaryCta}
        reassurance={verticalsDarkCta.reassurance}
      />
    </>
  );
}
