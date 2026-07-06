"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-24">
      <div className="max-w-xl text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-strong mb-5">
          Something broke
        </p>
        <h1 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight mb-5">
          We hit a snag loading that.
        </h1>
        <p className="text-cream/75 leading-relaxed mb-10 max-w-md mx-auto">
          We logged it. Try again, or head back home.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-wine text-cream font-semibold text-sm hover:bg-wine-dark transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-[#271520]/70 border border-white/10 text-cream font-medium text-sm hover:bg-[#271520] transition-colors"
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
