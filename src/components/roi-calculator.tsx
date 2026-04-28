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
            Missed calls per week:{" "}
            <span className="font-medium text-charcoal">{missedCalls}</span>
          </span>
          <input
            type="range"
            min={0}
            max={50}
            value={missedCalls}
            onChange={(e) => setMissedCalls(Number(e.target.value))}
            className="mt-3 w-full accent-wine cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-charcoal/70 mt-1">
            <span>0</span>
            <span>50</span>
          </div>
        </label>
        <label className="block">
          <span className="text-sm text-charcoal/70">
            Average ticket value:{" "}
            <span className="font-medium text-charcoal">${avgTicket}</span>
          </span>
          <input
            type="range"
            min={25}
            max={1000}
            step={25}
            value={avgTicket}
            onChange={(e) => setAvgTicket(Number(e.target.value))}
            className="mt-3 w-full accent-wine cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-charcoal/70 mt-1">
            <span>$25</span>
            <span>$1,000</span>
          </div>
        </label>
      </div>
      <div className="border-t border-warm-border pt-6 space-y-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-strong">
            You&apos;re likely losing
          </div>
          <div className="font-serif text-3xl md:text-4xl text-wine mt-1">
            ${monthly.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            <span className="font-sans text-base font-normal text-charcoal/70 ml-2">/month</span>
          </div>
        </div>
        <div className="text-sm text-charcoal/75 leading-relaxed">
          Essentials pays for itself in {formatPayback(paybackMonthsEssentials)}.
          <br />
          Growth pays for itself in {formatPayback(paybackMonthsGrowth)}.
        </div>
      </div>
      <div className="text-xs text-muted-medium mt-6 leading-relaxed">
        Conservative model. Assumes 40% recovery rate on missed calls. Your
        actual recovery depends on call volume, timing, and offer.
      </div>
    </div>
  );
}
