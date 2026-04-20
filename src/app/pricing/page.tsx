import type { Metadata } from "next";
import Link from "next/link";
import Pricing from "@/components/pricing";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";

export const metadata: Metadata = {
  title: "Pricing | Ops by Noell",
  description:
    "Transparent, flat-rate pricing for the Noell system. Essentials at $197/mo, Growth at $797/mo, Custom Ops at $1,497/mo. Each tier includes a one-time setup.",
};

export default function PricingPage() {
  return (
    <div>
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-8 mx-auto flex-col items-center justify-center pt-24 md:pt-28 pb-6 px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.35)] via-[rgba(240,224,214,0.60)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
          Pricing
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-tight">
          One system.{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            Three ways to run it.
          </span>
        </h1>
        <p className="relative z-20 mt-4 max-w-2xl text-center text-charcoal/75 text-sm md:text-base leading-relaxed">
          Transparent, flat-rate monthly pricing. No bait pricing, no mystery
          scope. Your audit is where we confirm the right fit and book the
          install.
        </p>
        <p className="relative z-20 mt-3 text-xs text-muted-medium">
          Curious what you could recover?{" "}
          <Link
            href="/roi"
            className="underline underline-offset-4 decoration-charcoal/30 hover:text-charcoal"
          >
            Run the ROI calculator
          </Link>
          .
        </p>
      </section>

      <Pricing />

      <FAQ
        eyebrow="Before you book"
        headlineStart="Pricing questions,"
        headlineAccent="answered."
      />

      <CTA />
    </div>
  );
}
