"use client";

import { useState } from "react";

export function ROICalculator() {
  const [missedCalls, setMissedCalls] = useState(10);
  const [avgTicket, setAvgTicket] = useState(150);
  const recoveryRate = 0.4;
  const monthly = missedCalls * 4.33 * avgTicket * recoveryRate;
  const paybackMonthsEssentials = monthly > 0 ? 197 / monthly : Infinity;
  const paybackMonthsGrowth = monthly > 0 ? 797 / monthly : Infinity;

  const formatPayback = (months: number) =>
    Number.isFinite(months) ? `${months.toFixed(1)} months` : "n/a";

  return (
    <div className="rounded-2xl border border-warm-border bg-white p-8 md:p-10 max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
          ROI calculator
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal">
          What could this recover for you?
        </h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <label className="block">
          <span className="text-sm text-charcoal/70">
            Missed calls per week
          </span>
          <input
            type="number"
            min={0}
            value={missedCalls}
            onChange={(e) => setMissedCalls(Number(e.target.value) || 0)}
            className="mt-2 w-full rounded-lg border border-warm-border bg-cream px-3 py-3 tap-target text-charcoal focus:outline-none focus:border-wine/60 focus:bg-white"
          />
        </label>
        <label className="block">
          <span className="text-sm text-charcoal/70">
            Average ticket value ($)
          </span>
          <input
            type="number"
            min={0}
            value={avgTicket}
            onChange={(e) => setAvgTicket(Number(e.target.value) || 0)}
            className="mt-2 w-full rounded-lg border border-warm-border bg-cream px-3 py-3 tap-target text-charcoal focus:outline-none focus:border-wine/60 focus:bg-white"
          />
        </label>
      </div>
      <div className="border-t border-warm-border pt-6 space-y-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-charcoal/60">
            Monthly recoverable revenue
          </div>
          <div className="font-serif text-3xl md:text-4xl text-charcoal mt-1">
            $
            {monthly.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="text-sm text-charcoal/75 leading-relaxed">
          Essentials ($197/mo) pays for itself in {formatPayback(paybackMonthsEssentials)}.
          <br />
          Growth ($797/mo) pays for itself in {formatPayback(paybackMonthsGrowth)}.
        </div>
      </div>
      <div className="text-xs text-charcoal/50 mt-6 leading-relaxed">
        Conservative model. Assumes 40% recovery rate on missed calls. Your
        actual recovery depends on call volume, timing, and offer.
      </div>
    </div>
  );
}
