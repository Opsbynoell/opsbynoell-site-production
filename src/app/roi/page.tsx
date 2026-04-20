import type { Metadata } from "next";
import Link from "next/link";
import { ROICalculator } from "@/components/roi-calculator";
import CTA from "@/components/cta";

export const metadata: Metadata = {
  title: "ROI Calculator | Ops by Noell",
  description:
    "Estimate what a missed-call recovery system could return for your service business. Enter your missed calls per week and average ticket to see monthly recovery and payback.",
};

export default function RoiPage() {
  return (
    <div>
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-8 mx-auto flex-col items-center justify-center pt-24 md:pt-28 pb-6 px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.35)] via-[rgba(240,224,214,0.60)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
          ROI calculator
        </p>
        <h1 className="relative z-20 max-w-3xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-tight">
          What could this{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            recover for you?
          </span>
        </h1>
        <p className="relative z-20 mt-4 max-w-xl text-center text-charcoal/75 text-sm md:text-base leading-relaxed">
          A quick back-of-napkin estimate. Tune the inputs to your shop, see the
          monthly recovery, and check payback against each tier.
        </p>
      </section>

      <section className="py-12 md:py-16 px-4">
        <ROICalculator />
      </section>

      <section className="px-4 pb-16 text-center max-w-2xl mx-auto">
        <p className="text-sm text-muted-medium">
          Like what you see?{" "}
          <Link
            href="/pricing"
            className="text-wine underline underline-offset-4 decoration-wine/40 hover:decoration-wine"
          >
            See all tiers
          </Link>{" "}
          or{" "}
          <Link
            href="/book"
            className="text-wine underline underline-offset-4 decoration-wine/40 hover:decoration-wine"
          >
            book a free audit
          </Link>
          .
        </p>
      </section>

      <CTA />
    </div>
  );
}
