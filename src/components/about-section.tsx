import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function AboutSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      {/* Editorial image frame — tilted, authored */}
      <div className="relative">
        <div
          className="bg-blush rounded-2xl aspect-[4/3] flex items-center justify-center -rotate-1"
        >
          <div className="text-center space-y-3">
            <p className="font-serif italic text-3xl text-charcoal/25">
              Nikki &amp; James
            </p>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-charcoal/15">
              Founders, Ops by Noell
            </p>
          </div>
        </div>
        {/* Floating detail card */}
        <div className="absolute -bottom-4 -right-2 bg-white border border-wine/10 rounded-lg px-5 py-3 shadow-sm rotate-2 z-10">
          <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
            Combined experience
          </span>
          <span className="block font-mono text-2xl text-wine mt-1">
            12+ years
          </span>
          <span className="block text-xs text-charcoal/40">
            in operations &amp; automation
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Pull-quote lead */}
        <p className="font-serif italic text-[clamp(1.4rem,2.5vw,2rem)] leading-[1.2] text-charcoal/70">
          &ldquo;We kept watching talented business owners drown in the gap
          between great marketing and broken follow-through.&rdquo;
        </p>

        <div className="space-y-4 text-charcoal/55 leading-relaxed max-w-lg">
          <p>
            Nikki and James built Ops by Noell after years inside the operational
            trenches of growing businesses. The leads were coming in. The systems
            weren&apos;t keeping up.
          </p>
          <p>
            They&apos;ve spent their careers building the operational infrastructure
            that turns marketing spend into booked revenue — for med spas, home
            service companies, clinics, and professional firms across the country.
          </p>
        </div>

        <Link
          href="/about"
          className="inline-flex items-center gap-2 text-sm text-wine hover:text-wine-light transition-colors group"
        >
          <span>Read our story</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
