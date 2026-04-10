import { Headline } from "./headline";
import { Overline } from "./overline";

export function CaseStudy() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
      {/* Story side */}
      <div className="space-y-8">
        <Overline>Case Study</Overline>
        <Headline as="h2" size="section">
          4 no-shows a week.
          <br />
          Then none.
        </Headline>
        <div className="space-y-4 text-charcoal/60 leading-relaxed max-w-lg">
          <p>
            A med-spa owner was losing $3,800 a month to missed appointments.
            Clients would book and never show. The front desk would call — if
            they had time. Most days, they didn&apos;t.
          </p>
          <p>
            We built an automated confirmation and reminder sequence that
            texts, follows up, and reschedules — without anyone touching it.
            Within two weeks, no-shows dropped to zero.
          </p>
        </div>
      </div>

      {/* Evidence artifact — overlapping tilted cards */}
      <div className="relative min-h-[360px]">
        {/* Before card — tilted behind */}
        <div className="absolute top-0 left-0 w-[85%] bg-blush/60 border border-wine/8 rounded-xl p-7 -rotate-2">
          <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
            Before — Weekly Average
          </span>
          <div className="flex items-baseline gap-3 mt-3">
            <span className="font-mono text-5xl text-charcoal/25 line-through decoration-wine/30 decoration-2">
              4
            </span>
            <span className="text-sm text-charcoal/30">
              no-shows per week
            </span>
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-charcoal/25">
              <div className="w-1.5 h-1.5 rounded-full bg-red-300" />
              <span>Mon 9:00 AM — no show</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-charcoal/25">
              <div className="w-1.5 h-1.5 rounded-full bg-red-300" />
              <span>Tue 2:30 PM — no show</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-charcoal/25">
              <div className="w-1.5 h-1.5 rounded-full bg-red-300" />
              <span>Thu 11:00 AM — no show</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-charcoal/25">
              <div className="w-1.5 h-1.5 rounded-full bg-red-300" />
              <span>Fri 4:00 PM — cancelled late</span>
            </div>
          </div>
        </div>

        {/* After card — layered on top */}
        <div className="absolute bottom-0 right-0 w-[85%] bg-white border border-wine/10 rounded-xl p-7 rotate-1 shadow-md z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-mono text-[10px] tracking-wider uppercase text-wine">
              After — System Active
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-5xl text-wine">0</span>
            <span className="text-sm text-charcoal/60">
              no-shows — fully automated
            </span>
          </div>
          <div className="mt-5 pt-4 border-t border-charcoal/5 flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
                Revenue recovered
              </span>
              <div className="font-mono text-2xl text-wine mt-1">
                $3,800
                <span className="text-sm text-charcoal/40">/mo</span>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
                Time to result
              </span>
              <div className="font-mono text-2xl text-charcoal mt-1">
                14
                <span className="text-sm text-charcoal/40"> days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Wine circle accent */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 w-12 h-12 rounded-full bg-wine/8 border border-wine/12" />
      </div>
    </div>
  );
}
