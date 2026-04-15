import React from "react";
import { LogoMark } from "./logo";

/**
 * FounderQuote — a short, early founder-presence band.
 *
 * Lives near the top of the homepage, right after the hero, to trigger the
 * "a real person built this" signal within the first 10 seconds. Done as a
 * typographic panel rather than a photo band, since the founder photo asset
 * is not yet deployed. Text leads with the Noells, sign-off matches the
 * brand rules in AGENTS guidance.
 */

export function FounderQuote() {
  return (
    <section className="w-full px-4 my-10 md:my-16">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-[22px] border border-warm-border bg-gradient-to-b from-white via-cream to-white px-7 py-10 md:px-14 md:py-14 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
          <div className="flex items-center justify-center mb-6">
            <LogoMark className="h-10 w-auto opacity-90" />
          </div>

          <p className="font-serif text-xl md:text-2xl lg:text-3xl leading-snug text-charcoal text-center tracking-tight">
            You built this to work with clients.{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              Not to chase them.
            </span>
          </p>

          <p className="mt-5 text-sm md:text-base text-charcoal/65 leading-relaxed text-center max-w-2xl mx-auto">
            We are the Noells. We build, install, and run the system so the
            calls get answered, the follow-ups go out, and your calendar stays
            full. You stay focused on the work in front of you. We do the
            quiet part.
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/60">
              Nikki · Ops by Noell · www.opsbynoell.com/book
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
