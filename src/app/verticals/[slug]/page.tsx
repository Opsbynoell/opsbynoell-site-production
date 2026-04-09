import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { SectionShell } from "@/components/layout/SectionShell";
import { ROUTES } from "@/lib/constants";
import { buildMetadata } from "@/lib/metadata";
import { verticals, verticalsDarkCta } from "@/content/verticals";

export const dynamicParams = false;

export function generateStaticParams() {
  return verticals.map((v) => ({ slug: v.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vertical = verticals.find((v) => v.id === slug);
  if (!vertical) return {};
  return buildMetadata({
    title: `${vertical.title} — Ops by Noell`,
    description: vertical.corePain.slice(0, 155),
    path: `/verticals/${slug}`,
  });
}

export default async function VerticalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const vertical = verticals.find((v) => v.id === slug);
  if (!vertical) notFound();

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <SectionShell compact className="bg-[#FFF7F4] border-b border-[#EDE3DE]">
        <div className="max-w-3xl">
          {/* Back to hub */}
          <Link
            href={ROUTES.verticals}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6D6664] hover:text-[#6A2C3E] transition-colors mb-5"
          >
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" aria-hidden>
              <path d="M5 1L1 5l4 4M1 5h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All Verticals
          </Link>

          <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6664] mb-3">
            {vertical.eyebrow}
          </p>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1A1A] leading-tight">
            {vertical.title}
          </h1>

          {/* Core pain — left-rule */}
          <p className="mt-5 text-base md:text-lg text-[#6D6664] leading-relaxed border-l-2 border-[#6A2C3E]/25 pl-4 max-w-2xl">
            {vertical.corePain}
          </p>

          {/* Package fit badge */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-[#6A2C3E] bg-[#F0E4E8] border border-[#6A2C3E]/15 rounded-full px-3 py-1.5">
              {vertical.packageFit}
            </span>
            <Link
              href={ROUTES.book}
              className="inline-flex items-center justify-center rounded-full bg-[#6A2C3E] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#5a2233] transition-colors shadow-[0_2px_12px_rgba(106,44,62,0.2)]"
            >
              Get Your Free Audit
            </Link>
          </div>
        </div>
      </SectionShell>

      {/* ── Detail Grid ──────────────────────────────────────────────────────── */}
      <SectionShell className="bg-[#FAF5F0]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Common Pains */}
          <div className="rounded-2xl bg-white border border-[#EDE3DE] p-6">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6D6664] mb-4">
              Where the Revenue Slips
            </p>
            <ul className="flex flex-col gap-3">
              {vertical.specificPains.map((pain) => (
                <li key={pain} className="flex items-start gap-2.5 text-sm leading-snug text-[#6D6664]">
                  <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-[#C8C4C0]" />
                  {pain}
                </li>
              ))}
            </ul>
          </div>

          {/* Relevant Systems */}
          <div className="rounded-2xl bg-white border border-[#EDE3DE] p-6">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6D6664] mb-4">
              Systems That Fix It
            </p>
            <ul className="flex flex-col gap-3">
              {vertical.relevantSystems.map((sys) => (
                <li
                  key={sys}
                  className={`flex items-start gap-2.5 text-sm leading-snug font-medium ${
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
            <div className="mt-5 pt-4 border-t border-[#EDE3DE]">
              <Link
                href={ROUTES.systems}
                className="text-xs font-semibold text-[#6A2C3E] hover:text-[#5a2233] transition-colors"
              >
                See all systems →
              </Link>
            </div>
          </div>

          {/* Likely Outcome */}
          <div className="rounded-2xl bg-[#F0E4E8] border border-[#6A2C3E]/15 p-6">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-[#6A2C3E] mb-4">
              Likely Outcome
            </p>
            <p className="text-sm leading-relaxed text-[#1F1A1A]">
              {vertical.likelyOutcome}
            </p>
            {vertical.caseStudyHint && (
              <p className="mt-4 text-xs text-[#6D6664] italic leading-relaxed">
                {vertical.caseStudyHint}
              </p>
            )}
          </div>
        </div>
      </SectionShell>

      {/* ── Other Verticals ───────────────────────────────────────────────────── */}
      <SectionShell compact className="bg-white border-y border-[#EDE3DE]">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#C8C4C0] mb-5 text-center">
            Other Verticals
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {verticals
              .filter((v) => v.id !== vertical.id)
              .map((v) => (
                <Link
                  key={v.id}
                  href={`/verticals/${v.id}`}
                  className="rounded-full border border-[#EDE3DE] bg-[#FAF5F0] px-4 py-1.5 text-xs font-medium text-[#6D6664] hover:border-[#6A2C3E]/30 hover:text-[#6A2C3E] transition-colors"
                >
                  {v.title}
                </Link>
              ))}
          </div>
        </div>
      </SectionShell>

      {/* ── Dark CTA ─────────────────────────────────────────────────────────── */}
      <DarkCtaBand
        headline={verticalsDarkCta.headline}
        subhead={verticalsDarkCta.subhead}
        primaryCta={verticalsDarkCta.primaryCta}
        reassurance={verticalsDarkCta.reassurance}
      />
    </>
  );
}
