import Link from "next/link";
import React from "react";

export function ArticleLayout({
  eyebrow,
  title,
  lead,
  meta,
  children,
  footerCta = true,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  meta?: string;
  children: React.ReactNode;
  footerCta?: boolean;
}) {
  return (
    <div>
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-10 mx-auto flex-col items-center justify-center pt-28 md:pt-32 pb-10 md:pb-14 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.25)] via-[rgba(240,224,214,0.60)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
          {eyebrow}
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-tight">
          {title}
        </h1>
        <p className="relative z-20 mt-5 max-w-2xl text-center text-charcoal/75 text-base md:text-lg leading-relaxed">
          {lead}
        </p>
        {meta && (
          <p className="relative z-20 mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-strong">
            {meta}
          </p>
        )}
      </section>

      <section className="px-4 pb-16 md:pb-20">
        <article className="max-w-3xl mx-auto rounded-[22px] border border-warm-border bg-white p-8 md:p-12 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] prose prose-sm md:prose-base prose-headings:font-serif prose-headings:text-charcoal prose-headings:font-semibold prose-p:text-charcoal/75 prose-li:text-charcoal/75 prose-a:text-wine prose-strong:text-charcoal prose-blockquote:text-charcoal/80 prose-blockquote:border-wine/30">
          {children}

          {footerCta && (
            <>
              <hr className="my-10 border-warm-border" />
              <p className="text-sm text-charcoal/70">
                Want your own look at where leads are leaking?{" "}
                <Link
                  href="/book"
                  className="text-wine font-semibold underline underline-offset-4"
                >
                  Book a free 30-minute audit
                </Link>
                . We&apos;ll map the gaps and show exactly what a Noell install
                would catch.
              </p>
            </>
          )}
        </article>
      </section>
    </div>
  );
}
