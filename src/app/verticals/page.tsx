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

// ─── Vertical nav anchors ──────────────────────────────────────────────────────
function VerticalPills() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {verticals.map((v, i) => (
        <a
          key={v.id}
          href={`#${v.id}`}
          className="inline-flex items-center gap-2 rounded-full border border-[#EDE3DE] bg-white px-4 py-1.5 text-xs font-semibold text-[#6D6664] hover:border-[#6A2C3E]/30 hover:text-[#6A2C3E] transition-colors"
        >
          <span className="font-mono text-[9px] text-[#C8C4C0] tracking-wider">
            {String(i + 1).padStart(2, "0")}
          </span>
          {v.title}
        </a>
      ))}
    </div>
  );
}

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

      {/* ── 2. Overview + Vertical Pills ─────────────────────────────────────── */}
      <SectionShell compact className="bg-white border-b border-[#EDE3DE]">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold text-[#1F1A1A] tracking-tight">
            {verticalsOverview.headline}
          </h2>
          <p className="mt-3 text-base text-[#6D6664] leading-relaxed">
            {verticalsOverview.subhead}
          </p>
        </div>
        <VerticalPills />
      </SectionShell>

      {/* ── 3. Vertical Breakdowns ───────────────────────────────────────────── */}
      <SectionShell className="bg-[#FAF5F0]">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
          {verticals.map((vertical, i) => (
            <div
              key={vertical.id}
              id={vertical.id}
              className="scroll-mt-24 window-frame"
            >
              {/* Window chrome — shows system index + vertical ID */}
              <div className="window-bar">
                <span className="window-dot-close" />
                <span className="window-dot-min" />
                <span className="window-dot-expand" />
                <span className="window-label">
                  {`vertical · ${String(i + 1).padStart(2, "0")} · ${vertical.id}`}
                </span>
              </div>

              {/* Card body */}
              <div className="p-7 md:p-10 bg-white relative overflow-hidden">

                {/* Decorative index — large faint numeral, top-right */}
                <span
                  className="pointer-events-none select-none absolute top-4 right-6 font-display text-8xl md:text-9xl font-bold leading-none text-[#EDE3DE]"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Header */}
                <div className="relative flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6D6664] mb-1">
                      {vertical.eyebrow}
                    </p>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F1A1A] leading-tight">
                      {vertical.title}
                    </h2>
                  </div>
                  <span className="self-start shrink-0 text-xs font-semibold text-[#6A2C3E] bg-[#F0E4E8] border border-[#6A2C3E]/15 rounded-full px-3 py-1.5 whitespace-nowrap">
                    {vertical.packageFit}
                  </span>
                </div>

                {/* Core pain — left-rule treatment */}
                <p className="relative text-sm md:text-base text-[#6D6664] leading-relaxed border-l-2 border-[#6A2C3E]/25 pl-4 mb-7">
                  {vertical.corePain}
                </p>

                {/* Pain + Systems + Outcome grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

                  {/* Specific pains */}
                  <div className="rounded-xl bg-[#FAF5F0] border border-[#EDE3DE] p-5">
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6D6664] mb-3">
                      Common Pains
                    </p>
                    <ul className="flex flex-col gap-2">
                      {vertical.specificPains.map((pain) => (
                        <li
                          key={pain}
                          className="flex items-start gap-2 text-xs leading-snug text-[#6D6664]"
                        >
                          <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-[#C8C4C0]" />
                          {pain}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Relevant systems */}
                  <div className="rounded-xl bg-[#FAF5F0] border border-[#EDE3DE] p-5">
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6D6664] mb-3">
                      Relevant Systems
                    </p>
                    <ul className="flex flex-col gap-2">
                      {vertical.relevantSystems.map((sys) => (
                        <li
                          key={sys}
                          className={`flex items-start gap-2 text-xs leading-snug font-medium ${
                            sys === "Nova AI" ? "text-[#7C5CFC]" : "text-[#1F1A1A]"
                          }`}
                        >
                          <span
                            className={`mt-1.5 flex-shrink-0 w-1 h-1 rounded-full ${
                              sys === "Nova AI" ? "bg-[#7C5CFC]" : "bg-[#6A2C3E]"
                            }`}
                          />
                          {sys}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Likely outcome — wine-tinted card */}
                  <div className="rounded-xl bg-[#F0E4E8] border border-[#6A2C3E]/15 p-5">
                    <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6A2C3E] mb-3">
                      Likely Outcome
                    </p>
                    <p className="text-xs leading-relaxed text-[#1F1A1A]">
                      {vertical.likelyOutcome}
                    </p>
                  </div>
                </div>

                {/* Case study hint + CTA — footer strip */}
                <div className="mt-6 pt-5 border-t border-[#EDE3DE] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-xs text-[#6D6664] italic">
                    {vertical.caseStudyHint}
                  </p>
                  <Link
                    href={ROUTES.book}
                    className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#6A2C3E] hover:text-[#5a2233] transition-colors"
                  >
                    See how this works →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* ── 4. Fit Check ─────────────────────────────────────────────────────── */}
      <SectionShell compact className="bg-white border-y border-[#EDE3DE]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl md:text-2xl font-bold text-[#1F1A1A] tracking-tight">
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

      {/* ── 5. Dark CTA ──────────────────────────────────────────────────────── */}
      <DarkCtaBand
        headline={verticalsDarkCta.headline}
        subhead={verticalsDarkCta.subhead}
        primaryCta={verticalsDarkCta.primaryCta}
        reassurance={verticalsDarkCta.reassurance}
      />
    </>
  );
}
