import { Section } from "@/components/section";
import { Headline } from "@/components/headline";
import { Overline } from "@/components/overline";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Ops by Noell",
  description:
    "Built by operators, not just developers. Meet the team behind Ops by Noell.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero — pull-quote lead */}
      <Section variant="cream" className="pt-32 md:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-8">
            <Overline>About</Overline>
            <p className="font-serif italic text-[clamp(1.6rem,3vw,2.5rem)] leading-[1.15] text-charcoal/70">
              &ldquo;We kept watching talented business owners drown in the
              gap between great marketing and broken follow-through.&rdquo;
            </p>
            <h1 className="font-serif uppercase text-[clamp(2rem,4.5vw,3.5rem)] leading-[0.95] tracking-tight text-charcoal">
              Built by operators, not just developers.
            </h1>
          </div>

          {/* Tilted editorial photo frame */}
          <div className="relative">
            <div className="bg-blush rounded-2xl aspect-[4/3] flex items-center justify-center -rotate-2">
              <div className="text-center space-y-3">
                <p className="font-serif italic text-3xl text-charcoal/20">
                  Nikki &amp; James
                </p>
                <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-charcoal/12">
                  Founders
                </p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-3 bg-white border border-wine/10 rounded-lg px-5 py-3 shadow-sm rotate-2 z-10">
              <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
                Status
              </span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-sm text-charcoal/60">
                  Building systems daily
                </span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Story */}
      <Section variant="blush">
        <div className="max-w-3xl mx-auto space-y-8">
          <Headline as="h2" size="section">
            The gap nobody was fixing
          </Headline>
          <div className="space-y-6 text-charcoal/60 leading-relaxed">
            <p>
              Nikki and James spent years working inside the operational
              trenches of growing businesses. They saw the same pattern
              everywhere: talented people drowning in admin, promising leads
              going cold, and revenue leaking through the cracks of manual
              processes.
            </p>
            <p className="font-serif italic text-xl text-charcoal/70 py-4 border-l-2 border-wine/20 pl-6">
              Marketing agencies could drive traffic. CRMs could store
              contacts. But nobody was building the system that connected the
              two.
            </p>
            <p>
              That&apos;s the gap Ops by Noell fills. Not more software. Not
              more dashboards. A done-for-you system that handles the
              operational work your team doesn&apos;t have time for — and does
              it better than a human could at 2 AM on a Saturday.
            </p>
          </div>
        </div>
      </Section>

      {/* Values — with interface-panel aesthetic */}
      <Section variant="cream">
        <div className="max-w-4xl mx-auto">
          <Headline as="h2" size="section" className="text-center mb-16">
            How we work
          </Headline>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Operators first",
                status: "Core principle",
                description:
                  "We think like business owners, not technologists. Every system is designed around real workflow, not theoretical automation.",
              },
              {
                title: "Done-for-you",
                status: "Every engagement",
                description:
                  "We don't hand you a login and wish you luck. We build it, test it, optimize it, and make sure it works before you touch it.",
              },
              {
                title: "Proof, not promises",
                status: "Measurable",
                description:
                  "We measure revenue recovered, time saved, and no-shows prevented. If the system isn't working, we fix it.",
              },
            ].map((value) => (
              <div
                key={value.title}
                className="bg-white border border-charcoal/5 rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 py-2.5 bg-charcoal/[0.02] border-b border-charcoal/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-wine" />
                  <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
                    {value.status}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-serif text-xl text-charcoal">
                    {value.title}
                  </h3>
                  <p className="text-sm text-charcoal/50 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="charcoal" className="text-center">
        <p className="font-serif uppercase text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tight text-cream max-w-2xl mx-auto">
          Ready to stop losing revenue to slow response?
        </p>
        <p className="mt-6 text-cream/40 leading-relaxed max-w-lg mx-auto">
          Let&apos;s look at your operations and find the first fix that
          makes the biggest difference.
        </p>
        <div className="mt-10">
          <Link
            href="/book"
            className="inline-flex items-center justify-center bg-cream text-charcoal text-sm tracking-wide px-10 py-4 rounded-full hover:bg-white transition-colors"
          >
            Book Your Free Audit
          </Link>
        </div>
        {/* Wine circle */}
        <div className="mx-auto mt-12 w-16 h-16 rounded-full bg-wine/20 border border-wine/25" />
      </Section>
    </>
  );
}
