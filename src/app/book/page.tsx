import { Section } from "@/components/section";
import { Overline } from "@/components/overline";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Book Your Free Audit — Ops by Noell",
  description:
    "In 30 minutes, we'll show you where leads are slipping, where follow-up is breaking, and what's costing you revenue right now.",
};

export default function BookPage() {
  return (
    <>
      <Section variant="cream" className="pt-32 md:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: Reassurance copy with editorial treatment */}
          <div className="space-y-10">
            <div className="space-y-6">
              <Overline>Book Your Free Audit</Overline>
              <h1 className="font-serif uppercase text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-tight text-charcoal">
                Let&apos;s find
                <br />
                what&apos;s leaking.
              </h1>
              <p className="text-lg text-charcoal/50 leading-relaxed max-w-md">
                In 30 minutes, we&apos;ll walk through where leads are
                slipping, where follow-up is breaking, and what&apos;s costing
                you revenue right now. This is not a sales pitch. It&apos;s a
                clarity call.
              </p>
            </div>

            {/* What we'll look at — wine border treatment */}
            <div className="space-y-4">
              <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/35">
                What we&apos;ll look at
              </span>
              <ul className="space-y-3">
                {[
                  "Missed calls and slow response gaps",
                  "Follow-up breakdowns and no-show risk",
                  "Review and reactivation opportunities",
                  "The first system fix that would make the biggest difference",
                ].map((item) => (
                  <li
                    key={item}
                    className="text-charcoal/60 leading-relaxed pl-4 border-l-2 border-wine/25"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* What happens after */}
            <div className="space-y-4">
              <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/35">
                What happens after
              </span>
              <p className="text-charcoal/60 leading-relaxed max-w-md">
                You&apos;ll leave with a clear picture of what&apos;s being
                missed, what to fix first, and whether Ops by Noell is the
                right fit.
              </p>
            </div>

            {/* Trust microcopy — blush block */}
            <div className="bg-blush/50 border border-wine/8 rounded-xl px-6 py-5 max-w-md -rotate-[0.5deg]">
              <p className="text-sm text-charcoal/55 leading-relaxed">
                No pitch deck. No pressure. No obligation.
              </p>
              <p className="text-sm text-charcoal/65 mt-2">
                Just a direct look at what&apos;s leaking and what it would
                take to fix it.
              </p>
            </div>
          </div>

          {/* Right: Booking embed — browser-window framed */}
          <div className="space-y-6">
            <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/35">
              Choose a time that works for you
            </span>

            <div className="bg-white border border-charcoal/8 rounded-xl overflow-hidden shadow-sm">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-charcoal/[0.02] border-b border-charcoal/5">
                <div className="w-2 h-2 rounded-full bg-charcoal/10" />
                <div className="w-2 h-2 rounded-full bg-charcoal/10" />
                <div className="w-2 h-2 rounded-full bg-charcoal/10" />
                <span className="ml-3 font-mono text-[10px] text-charcoal/25">
                  Ops by Noell — Book Your Audit
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="font-mono text-[10px] text-charcoal/25">
                    Secure
                  </span>
                </div>
              </div>

              {/* Embed area */}
              <div className="min-h-[480px] flex flex-col items-center justify-center p-8">
                <div className="text-center space-y-4 max-w-sm">
                  <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center mx-auto">
                    <span className="font-serif italic text-2xl text-wine">
                      N
                    </span>
                  </div>
                  <p className="font-serif italic text-xl text-charcoal/35">
                    Booking calendar
                  </p>
                  <p className="text-sm text-charcoal/25 leading-relaxed">
                    Replace this container with your GHL or Calendly embed.
                    Use the{" "}
                    <code className="font-mono text-[11px] bg-blush/50 px-1.5 py-0.5 rounded">
                      iframe
                    </code>{" "}
                    or script embed code from your booking platform.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-sm text-charcoal/35 leading-relaxed">
              If you don&apos;t see a time that fits, email{" "}
              <a
                href="mailto:hello@opsbynoell.com"
                className="text-wine hover:text-wine-light transition-colors"
              >
                hello@opsbynoell.com
              </a>{" "}
              and we&apos;ll find one.
            </p>
          </div>
        </div>
      </Section>

      {/* Testimonial — tilted, layered */}
      <Section variant="blush" className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto relative">
          <div className="bg-white border border-wine/8 rounded-xl px-8 py-7 rotate-[0.5deg] shadow-sm">
            <p className="font-serif italic text-xl md:text-2xl text-charcoal/65 leading-relaxed">
              &ldquo;She didn&apos;t just fix our operations — she made us
              wonder how we&apos;d been running without them.&rdquo;
            </p>
            <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-charcoal/35 mt-4">
              — Founder, Series B Med Spa
            </p>
          </div>
          {/* Wine circle accent */}
          <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-wine/8 border border-wine/12" />
        </div>
      </Section>
    </>
  );
}
