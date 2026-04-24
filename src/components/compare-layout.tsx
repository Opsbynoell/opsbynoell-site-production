import Link from "next/link";
import React from "react";
import CTA from "@/components/cta";
import type { SourcePage } from "@/lib/analytics";

export type CompareRow = {
  capability: string;
  opsByNoell: string;
  alternative: string;
};

export function CompareLayout({
  alternativeName,
  title,
  lead,
  summary,
  rows,
  verdict,
  internalLinks,
  sourcePage = "compare_index",
}: {
  alternativeName: string;
  title: string;
  lead: string;
  summary: React.ReactNode;
  rows: CompareRow[];
  verdict: React.ReactNode;
  internalLinks?: { label: string; href: string }[];
  sourcePage?: SourcePage;
}) {
  return (
    <div>
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-10 mx-auto flex-col items-center justify-center pt-28 md:pt-32 pb-12 md:pb-16 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.25)] via-[rgba(240,224,214,0.60)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
          Comparison
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-tight">
          {title}
        </h1>
        <p className="relative z-20 mt-5 max-w-2xl text-center text-charcoal/75 text-base md:text-lg leading-relaxed">
          {lead}
        </p>
      </section>

      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto rounded-[22px] border border-warm-border bg-white p-7 md:p-10 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            The short version
          </h2>
          <div className="text-charcoal/80 space-y-4 leading-relaxed">
            {summary}
          </div>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-6 text-center">
            Side by side
          </h2>
          <div className="overflow-x-auto rounded-[22px] border border-warm-border bg-white">
            <table className="w-full text-sm md:text-base border-collapse">
              <caption className="sr-only">
                Capability comparison between Ops by Noell and {alternativeName}
              </caption>
              <thead>
                <tr className="bg-cream-dark text-charcoal">
                  <th scope="col" className="text-left px-4 md:px-6 py-4 font-semibold border-b border-warm-border w-1/3">
                    Capability
                  </th>
                  <th scope="col" className="text-left px-4 md:px-6 py-4 font-semibold border-b border-warm-border">
                    Ops by Noell
                  </th>
                  <th scope="col" className="text-left px-4 md:px-6 py-4 font-semibold border-b border-warm-border">
                    {alternativeName}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-warm-border align-top"
                  >
                    <th
                      scope="row"
                      className="text-left text-charcoal font-medium px-4 md:px-6 py-4"
                    >
                      {row.capability}
                    </th>
                    <td className="px-4 md:px-6 py-4 text-charcoal/80">
                      {row.opsByNoell}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-charcoal/70">
                      {row.alternative}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-strong mt-4 max-w-3xl">
            This comparison reflects publicly available descriptions of each
            option and Ops by Noell&apos;s current delivery model. Features and
            pricing of any third-party option can change at any time.
          </p>
        </div>
      </section>

      <section className="px-4 pb-12">
        <div className="max-w-4xl mx-auto rounded-[22px] border border-warm-border bg-cream-dark p-7 md:p-10">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            The verdict
          </h2>
          <div className="text-charcoal/80 space-y-4 leading-relaxed">
            {verdict}
          </div>
          {internalLinks && internalLinks.length > 0 && (
            <ul className="mt-6 grid sm:grid-cols-2 gap-2 text-sm">
              {internalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-wine hover:text-wine-dark underline underline-offset-4"
                  >
                    {l.label} &rarr;
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <CTA
        eyebrow="The 30-minute audit"
        headlineStart="We&apos;ll tell you honestly"
        headlineAccent="which one fits you."
        body="If the honest answer is &lsquo;not us,&rsquo; we'll say that. The audit is free either way."
        primaryCta={{ label: "Book Your Free Audit", href: "/book" }}
        secondaryCta={{
          label: "See the Noell System",
          href: "/systems",
        }}
        trustLine="Free 30-minute audit · Live in 14 days · No contracts"
        sourcePage={sourcePage}
        sourceSection="comparison_cta"
      />
    </div>
  );
}
