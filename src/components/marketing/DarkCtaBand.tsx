import Link from "next/link";
import { ROUTES } from "@/lib/constants";

type DarkCtaBandProps = {
  headline: string;
  subhead: string;
  primaryCta: string;
  reassurance?: string;
  ctaHref?: string;
};

export function DarkCtaBand({
  headline,
  subhead,
  primaryCta,
  reassurance,
  ctaHref = ROUTES.book,
}: DarkCtaBandProps) {
  return (
    <section className="bg-[#0F0F0F] py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
          {headline}
        </h2>
        <p className="mt-4 text-base md:text-lg text-white/70 leading-relaxed max-w-2xl mx-auto">
          {subhead}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-[#E8604C] px-7 py-3 text-sm font-semibold text-white hover:bg-[#d94f3b] transition-colors w-full sm:w-auto"
          >
            {primaryCta}
          </Link>
        </div>
        {reassurance && (
          <p className="mt-4 text-sm text-white/40">{reassurance}</p>
        )}
      </div>
    </section>
  );
}
