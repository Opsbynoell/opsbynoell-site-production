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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left: Reassurance */}
          <div className="space-y-10">
            <div className="space-y-6">
              <Overline>Book Your Free Audit</Overline>

              <h1 className="font-serif uppercase text-[clamp(2.2rem,5vw,4rem)] leading-[0.92] tracking-tight text-charcoal">
                Let&apos;s find what&apos;s leaking.
              </h1>

              <p className="text-lg text-charcoal/55 leading-relaxed max-w-md">
                In 30 minutes, we&apos;ll walk through where leads are
                slipping, where follow-up is breaking, and what&apos;s costing
                you revenue right now. This is not a sales pitch. It&apos;s a
                clarity call.
              </p>
            </div>

            {/* Expectation block */}
            <div className="space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
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
                      className="text-charcoal/55 leading-relaxed pl-4 border-l-2 border-wine/20"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
                  What happens after
                </span>
                <p className="text-charcoal/55 leading-relaxed max-w-md">
                  You&apos;ll leave with a clear picture of what&apos;s being
                  missed, what to fix first, and whether Ops by Noell is the
                  right fit.
                </p>
              </div>
            </div>

            {/* Trust microcopy */}
            <div className="bg-blush/60 border border-wine/8 rounded-xl px-6 py-5 max-w-sm">
              <p className="text-sm text-charcoal/50 leading-relaxed">
                No pitch deck. No pressure. No obligation.
              </p>
              <p className="text-sm text-charcoal/60 mt-2 leading-relaxed">
                Just a direct look at what&apos;s leaking and what it would
                take to fix it.
              </p>
            </div>
          </div>

          {/* Right: Booking embed */}
          <div className="space-y-5">
            <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
              Choose a time that works for you
            </span>

            {/* Embed scaffold — premium, realistic */}
            <div className="bg-white border border-charcoal/8 rounded-xl overflow-hidden shadow-sm">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-charcoal/[0.02] border-b border-charcoal/5">
                <div className="w-2 h-2 rounded-full bg-red-400/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/40" />
                <div className="w-2 h-2 rounded-full bg-green-400/40" />
                <span className="ml-3 font-mono text-[10px] text-charcoal/20">
                  Ops by Noell — Schedule Your Audit
                </span>
                <div className="ml-auto flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="font-mono text-[9px] text-charcoal/20">Secure</span>
                </div>
              </div>

              {/* Calendar placeholder */}
              <div className="p-6 min-h-[480px]">
                {/* Month header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-medium text-charcoal/60">April 2026</span>
                  <div className="flex gap-1">
                    <div className="w-7 h-7 rounded-md border border-charcoal/8 flex items-center justify-center text-charcoal/25 text-xs">&larr;</div>
                    <div className="w-7 h-7 rounded-md border border-charcoal/8 flex items-center justify-center text-charcoal/25 text-xs">&rarr;</div>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div key={d} className="text-center text-[10px] font-mono text-charcoal/20 py-1">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 2; // offset for month start
                    const isValid = day >= 1 && day <= 30;
                    const isPast = day < 11;
                    const isAvailable = isValid && !isPast && ![6, 7, 13, 14, 20, 21, 27, 28].includes(day);
                    return (
                      <div
                        key={i}
                        className={`aspect-square rounded-md flex items-center justify-center text-xs ${
                          !isValid ? "" :
                          isPast ? "text-charcoal/12" :
                          isAvailable ? "text-charcoal/50 border border-charcoal/8 hover:border-wine/30 hover:bg-wine/3 cursor-pointer transition-colors" :
                          "text-charcoal/15"
                        }`}
                      >
                        {isValid ? day : ""}
                      </div>
                    );
                  })}
                </div>

                {/* Time slots preview */}
                <div className="mt-6 pt-5 border-t border-charcoal/5">
                  <span className="text-xs text-charcoal/30 block mb-3">Available times</span>
                  <div className="flex flex-wrap gap-2">
                    {["9:00 AM", "10:30 AM", "1:00 PM", "2:30 PM", "4:00 PM"].map((time) => (
                      <div key={time} className="px-3 py-1.5 rounded-md border border-charcoal/8 text-xs text-charcoal/40 hover:border-wine/30 hover:text-wine cursor-pointer transition-colors">
                        {time}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Replace instruction - subtle */}
                <p className="text-[10px] text-charcoal/15 mt-6 font-mono">
                  Replace this scaffold with your GHL or Calendly embed code
                </p>
              </div>
            </div>

            <p className="text-sm text-charcoal/30 leading-relaxed">
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

      {/* Proof reinforcement — tilted testimonial */}
      <Section variant="blush" className="py-16 md:py-20">
        <div className="max-w-2xl mx-auto relative">
          <div className="bg-white border border-wine/8 rounded-xl px-8 py-7 rotate-[0.5deg] shadow-sm">
            <p className="font-serif italic text-xl md:text-2xl text-charcoal/60 leading-relaxed">
              &ldquo;She didn&apos;t just fix our operations — she made us
              wonder how we&apos;d been running without them.&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-5 pt-4 border-t border-charcoal/5">
              <div className="w-8 h-8 rounded-full bg-blush border border-wine/10 flex items-center justify-center">
                <span className="font-serif italic text-sm text-wine">M</span>
              </div>
              <div>
                <p className="text-sm text-charcoal/50 font-medium">Med Spa Founder</p>
                <p className="font-mono text-[10px] text-charcoal/25">Series B · recovered $3,800/mo</p>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
