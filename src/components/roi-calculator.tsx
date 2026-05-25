"use client";

import { useState } from "react";

export function ROICalculator() {
  const [missedCalls, setMissedCalls] = useState(10);
  const [avgTicket, setAvgTicket] = useState(150);
  const recoveryRate = 0.4;
  const monthly = missedCalls * 4.33 * avgTicket * recoveryRate;
  const paybackMonthsSignal = monthly > 0 ? 397 / monthly : Infinity;
  const paybackMonthsSystem = monthly > 0 ? 897 / monthly : Infinity;

  const formatPayback = (months: number) =>
    Number.isFinite(months) ? `${months.toFixed(1)} months` : "n/a";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#271520] p-8 md:p-10 max-w-3xl mx-auto relative z-10">
      <div className="mb-6">
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
          ROI calculator
        </p>
        <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cream">
          What could this recover for you?
        </h3>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <label className="block">
          <span className="text-sm text-cream/70">
            Missed calls per week:{" "}
            <span className="font-medium text-cream">{missedCalls}</span>
          </span>
          <input
            type="range"
            min={0}
            max={50}
            value={missedCalls}
            onChange={(e) => setMissedCalls(Number(e.target.value))}
            className="mt-3 w-full accent-wine cursor-pointer relative z-10"
            style={{ touchAction: "pan-x" }}
          />
          <div className="flex justify-between text-[10px] text-cream/70 mt-1">
            <span>0</span>
            <span>50</span>
          </div>
        </label>
        <label className="block">
          <span className="text-sm text-cream/70">
            Average ticket value:{" "}
            <span className="font-medium text-cream">${avgTicket}</span>
          </span>
          <input
            type="range"
            min={25}
            max={1000}
            step={25}
            value={avgTicket}
            onChange={(e) => setAvgTicket(Number(e.target.value))}
            className="mt-3 w-full accent-wine cursor-pointer relative z-10"
            style={{ touchAction: "pan-x" }}
          />
          <div className="flex justify-between text-[10px] text-cream/70 mt-1">
            <span>$25</span>
            <span>$1,000</span>
          </div>
        </label>
      </div>
      <div className="border-t border-white/10 pt-6 space-y-3">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-strong">
            You&apos;re likely losing
          </div>
          <div className="font-serif text-3xl md:text-4xl text-wine mt-1">
            ${monthly.toLocaleString("en-US", { maximumFractionDigits: 0 })}
            <span className="font-sans text-base font-normal text-cream/70 ml-2">/month</span>
          </div>
        </div>
        <div className="text-sm text-cream/75 leading-relaxed">
          Signal ($397/mo) pays for itself in {formatPayback(paybackMonthsSignal)}.
          <br />
          System ($897/mo) pays for itself in {formatPayback(paybackMonthsSystem)}.
        </div>
      </div>
      <div className="text-xs text-muted-medium mt-6 leading-relaxed">
        Conservative model. Assumes 40% recovery rate on missed calls. Your
        actual recovery depends on call volume, timing, and offer.
      </div>
    </div>
  );
}
