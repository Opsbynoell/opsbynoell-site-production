import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { pageMetadata } from "@/lib/seo";

export const legalUpdatedDate = "April 13, 2026";

type LegalKind = "Privacy Policy" | "Terms of Service" | "Cookie Policy";

const LEGAL_PATHS: Record<LegalKind, string> = {
  "Privacy Policy": "/legal/privacy",
  "Terms of Service": "/legal/terms",
  "Cookie Policy": "/legal/cookies",
};

export const legalMetadataBase = (kind: LegalKind): Metadata =>
  pageMetadata({
    path: LEGAL_PATHS[kind],
    title: kind,
    description: `${kind} for Ops by Noell. Last updated ${legalUpdatedDate}.`,
  });

export function LegalShell({
  title,
  lead,
  children,
}: {
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-20 mx-auto flex-col items-center justify-center pt-32 pb-16 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.35)] via-[rgba(240,224,214,0.65)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-charcoal/60 mb-6">
          Legal · Last updated {legalUpdatedDate}
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-4xl md:text-6xl font-semibold tracking-tight text-charcoal">
          {title}
        </h1>
        <p className="relative z-20 mt-6 max-w-2xl text-center text-charcoal/70 text-base md:text-lg leading-relaxed">
          {lead}
        </p>
      </section>

      <section className="pb-20 px-4">
        <article className="max-w-3xl mx-auto rounded-[22px] border border-warm-border bg-white p-8 md:p-12 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] prose prose-sm md:prose-base prose-headings:font-serif prose-headings:text-charcoal prose-p:text-charcoal/70 prose-li:text-charcoal/70 prose-a:text-wine prose-strong:text-charcoal">
          {children}
          <hr className="my-10 border-warm-border" />
          <p className="text-xs text-charcoal/50">
            Questions about this policy? Email{" "}
            <a href="mailto:hello@opsbynoell.com" className="text-wine">
              hello@opsbynoell.com
            </a>
            .
          </p>
          <p className="text-xs text-charcoal/50">
            <Link href="/" className="text-wine">
              &larr; Back to home
            </Link>
          </p>
        </article>
      </section>
    </div>
  );
}
