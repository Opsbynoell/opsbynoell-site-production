import Link from "next/link";
import { RevenueCalculator } from "@/components/revenue-calculator";
import { SantaProofBlock } from "@/components/santa-proof-block";
import CTA from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  calculatorApplicationSchema,
} from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/resources/revenue-calculator",
  title: "Industry Revenue Calculator: Dental, Med Spa, Chiropractic",
  description:
    "Industry-specific revenue calculator for dental, med spa, and chiropractic practices. Monthly leads, booking rate, no-show rate, and the Santa proof math.",
  ogTitle: "Industry Revenue Calculator, Ops by Noell",
  ogDescription:
    "Enter your monthly leads, booking rate, and no-show rate. We show you what the Noell System would recover, based on Santa's actual 75% no-show reduction and $2,560 recovered in 30 days.",
});

export default function RevenueCalculatorPage() {
  return (
    <div id="main-content">
      <JsonLd
        data={[
          calculatorApplicationSchema({
            name: "Service Business Revenue Calculator",
            description:
              "Estimate revenue lost to missed calls and no-shows for service businesses, with the recovery a managed AI front desk would return.",
            path: "/resources/revenue-calculator",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: "Revenue Calculator", path: "/resources/revenue-calculator" },
          ]),
        ]}
        id="revenue-calculator"
      />

      {/* Hero */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-4 mx-auto flex-col items-center justify-center pt-20 md:pt-24 pb-6 md:pb-8 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.30)] via-[rgba(31,18,25,0.85)] to-[rgba(19,11,15,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
          Industry-specific · Dental, med spa, chiropractic
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-cream leading-tight">
          See what you&apos;re{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            actually losing.
          </span>
        </h1>
        <p className="relative z-20 mt-5 max-w-2xl text-center text-cream/80 text-base md:text-lg leading-relaxed">
          Industry-specific math: monthly leads, booking rate, no-show rate.
          We&apos;ll show you what the Noell System would recover, based on
          real proof.{" "}
          <Link
            href="/roi"
            className="text-wine underline underline-offset-4 decoration-wine/40 hover:decoration-wine"
          >
            Just want a quick payback estimate?
          </Link>
        </p>

        {/* Stats strip */}
        <div className="relative z-20 mt-8 flex flex-wrap justify-center gap-6 md:gap-10">
          <div className="text-center">
            <p className="font-serif text-2xl md:text-3xl font-semibold text-wine">75%</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream/70 mt-1">
              fewer no-shows
            </p>
          </div>
          <div className="hidden md:block w-px bg-warm-border self-stretch" />
          <div className="text-center">
            <p className="font-serif text-2xl md:text-3xl font-semibold text-wine">$2,560</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream/70 mt-1">
              recovered in 30 days
            </p>
          </div>
          <div className="hidden md:block w-px bg-warm-border self-stretch" />
          <div className="text-center">
            <p className="font-serif text-2xl md:text-3xl font-semibold text-wine">40+</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream/70 mt-1">
              Google reviews in 8 weeks
            </p>
          </div>
        </div>
        <p className="relative z-20 mt-3 text-[10px] text-cream/50 text-center">
          Results from our pilot client, Healing Hands by Santa, Laguna Niguel, CA.
        </p>
      </section>

      {/* Calculator */}
      <section className="py-12 md:py-16">
        <RevenueCalculator />
      </section>

      {/* Santa proof block, medium variant */}
      <SantaProofBlock />

      {/* Dark CTA band */}
      <CTA
        eyebrow="Book a working call"
        headlineStart="Start with a"
        headlineAccent="working call."
        body="We walk your front desk and show you where warm intent is cooling off. Thirty focused minutes. Personally scheduled."
        primaryCta={{ label: "Book a Free Audit", href: "/book" }}
        secondaryCta={null}
        trustLine="No pitch. No pressure. If it's not a fit, we'll say so."
        sourcePage="revenue_calculator"
        sourceSection="final_cta"
      />
    </div>
  );
}
