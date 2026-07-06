import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine mb-5">
          404
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight mb-5">
          That page didn&apos;t make it.
        </h1>
        <p className="text-cream/75 leading-relaxed mb-10 max-w-md mx-auto">
          The link is broken or the page moved. Try one of these instead.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-wine text-cream font-semibold text-sm hover:bg-wine-dark transition-colors"
          >
            Back home
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-[#271520]/70 border border-white/10 text-cream font-medium text-sm hover:bg-[#271520] transition-colors"
          >
            See pricing
          </Link>
          <Link
            href="/book"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-[#271520]/70 border border-white/10 text-cream font-medium text-sm hover:bg-[#271520] transition-colors"
          >
            Book a call
          </Link>
        </div>
      </div>
    </div>
  );
}
