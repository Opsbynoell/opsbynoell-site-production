import { RevenueCalculator } from "@/components/revenue-calculator";
import { SantaProofBlock } from "@/components/santa-proof-block";
import CTA from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/resources/revenue-calculator",
  title: "Revenue Calculator — See What You're Losing",
  description:
    "Find out how much revenue your dental practice, med spa, or chiropractic office is losing to missed calls and no-shows. Takes 60 seconds.",
  ogTitle: "See What You're Losing — Ops by Noell Revenue Calculator",
  ogDescription:
    "Enter your monthly leads, booking rate, and no-show rate. We show you what the Noell System would recover — based on Santa's actual 75% no-show reduction and $960 recovered in 14 days.",
});

export default function RevenueCalculatorPage() {
  return (
    <div id="main-content">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
          { name: "Revenue Calculator", path: "/resources/revenue-calculator" },
        ])}
        id="revenue-calculator"
      />

      {/* Hero */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-4 mx-auto flex-col items-center justify-center pt-20 md:pt-24 pb-6 md:pb-8 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.50)] via-[rgba(240,224,214,0.70)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
          Takes 60 seconds
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-tight">
          See what you&apos;re{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            actually losing.
          </span>
        </h1>
        <p className="relative z-20 mt-5 max-w-2xl text-center text-charcoal/80 text-base md:text-lg leading-relaxed">
          Every missed call, every no-show, every slow follow-up is revenue walking out the door.
          Enter your numbers. We&apos;ll show you what the Noell System would recover — based on real proof.
        </p>

        {/* Stats strip */}
        <div className="relative z-20 mt-8 flex flex-wrap justify-center gap-6 md:gap-10">
          <div className="text-center">
            <p className="font-serif text-2xl md:text-3xl font-semibold text-wine">75%</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/70 mt-1">
              fewer no-shows
            </p>
          </div>
          <div className="hidden md:block w-px bg-warm-border self-stretch" />
          <div className="text-center">
            <p className="font-serif text-2xl md:text-3xl font-semibold text-wine">$960</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/70 mt-1">
              recovered in 14 days
            </p>
          </div>
          <div className="hidden md:block w-px bg-warm-border self-stretch" />
          <div className="text-center">
            <p className="font-serif text-2xl md:text-3xl font-semibold text-wine">40+</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-charcoal/70 mt-1">
              Google reviews in 8 weeks
            </p>
          </div>
        </div>
        <p className="relative z-20 mt-3 text-[10px] text-charcoal/50 text-center">
          Results from our pilot client, Healing Hands by Santa — Laguna Niguel, CA.
        </p>
      </section>

      {/* Calculator */}
      <section className="py-12 md:py-16">
        <RevenueCalculator />
      </section>

      {/* Santa proof block — medium variant */}
      <SantaProofBlock />

      {/* Dark CTA band */}
      <CTA
        eyebrow="Book a working call"
        headlineStart="Start with a"
        headlineAccent="working call."
        body="We walk your front desk and show you where warm intent is cooling off. Twenty focused minutes. Personally scheduled."
        primaryCta={{ label: "Book a Free Audit", href: "/book" }}
        secondaryCta={null}
        trustLine="No pitch. No pressure. If it's not a fit, we'll say so."
        sourcePage="revenue_calculator"
        sourceSection="final_cta"
      />
    </div>
  );
}
