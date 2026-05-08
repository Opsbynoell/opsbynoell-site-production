import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * FounderQuote — early founder-presence band.
 *
 * Lives near the top of the homepage, right after the hero, to trigger the
 * "a real person built this" signal within the first 10 seconds.
 * Split layout: photo left, editorial text right on desktop.
 * Stacks to photo-top on mobile.
 */

export function FounderQuote() {
  return (
    <section className="w-full px-4 my-10 md:my-16">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-[22px] border border-warm-border bg-gradient-to-b from-white via-cream to-white shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] items-stretch">
            {/* Photo column */}
            <div className="relative h-56 md:h-auto md:min-h-[320px] bg-charcoal/5">
              <Image
                src="/images/about-noell-family.jpg"
                alt="James and Nikki Noell — the family behind Ops by Noell"
                fill
                sizes="(min-width: 768px) 280px, 100vw"
                className="object-cover object-top"
                priority
              />
              {/* subtle gradient overlay at bottom to blend into card */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-cream/60 to-transparent md:hidden" />
            </div>

            {/* Text column */}
            <div className="px-7 py-10 md:px-10 md:py-12 flex flex-col justify-center">
              <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
                James &amp; Nikki Noell · Mission Viejo, CA
              </p>

              <p className="font-serif text-xl md:text-2xl leading-snug text-charcoal tracking-tight">
                You built this to work with clients.{" "}
                <span className="italic text-wine">
                  Not to chase them.
                </span>
              </p>

              <p className="mt-4 text-sm md:text-base text-charcoal/75 leading-relaxed">
                We build, install, and run the system so the calls get answered,
                the follow-ups go out, and your calendar stays full. You stay
                focused on the work in front of you. We do the quiet part.
              </p>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/60">
                    The Noells · Ops by Noell
                  </p>
                </div>
                <Link
                  href="/about"
                  className="text-[11px] text-wine/70 hover:text-wine underline underline-offset-4 decoration-wine/30 transition-colors"
                >
                  Our story &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
