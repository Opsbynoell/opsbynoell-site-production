import React from "react";

/**
 * BridgeMetaphor, the THEN / NOW table that carries the Analog Signal
 * nostalgia thesis on the homepage. Shows the brand's core argument: the
 * warm communication systems of the AIM era map cleanly onto the agents
 * and workflows of a modern AI front desk. Styled in Courier New for the
 * system-status register.
 */

type Row = { then: string; now: string };

const rows: Row[] = [
  { then: "Buddy List", now: "Agent Roster" },
  { then: "AIM Chat Window", now: "AI Chat Widget" },
  { then: "Away Message", now: "System Uptime" },
  { then: "Contact List", now: "Client Pipeline" },
  { then: "File Transfer", now: "Automated Deliverables" },
  { then: "Status Message", now: "Workflow Status" },
];

export function BridgeMetaphor() {
  return (
    <section className="w-full px-4 my-14 md:my-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/70">
              signal check / then and now
            </p>
          </div>
          <h2 className="font-serif text-2xl md:text-4xl font-semibold text-charcoal leading-tight">
            The systems you grew up with,{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              running your front desk.
            </span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
            The bridge between warm, familiar communication and the AI layer
            that now runs underneath it.
          </p>
        </div>

        <div className="rounded-[22px] border border-warm-border bg-gradient-to-b from-white via-cream to-white overflow-hidden shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
          {/* Header row */}
          <div className="grid grid-cols-2 bg-charcoal/[0.03] border-b border-warm-border">
            <div className="px-5 py-3 md:px-8 md:py-4 border-r border-warm-border">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/70">
                then · 2003
              </p>
            </div>
            <div className="px-5 py-3 md:px-8 md:py-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
                now · 2026
              </p>
            </div>
          </div>

          {/* Rows */}
          <div>
            {rows.map((row, i) => (
              <div
                key={i}
                className={
                  "grid grid-cols-2 " +
                  (i !== rows.length - 1 ? "border-b border-warm-border/70" : "")
                }
              >
                <div className="px-5 py-3.5 md:px-8 md:py-4 border-r border-warm-border/70">
                  <p className="font-mono text-xs md:text-sm text-charcoal/70">
                    {row.then}
                  </p>
                </div>
                <div className="px-5 py-3.5 md:px-8 md:py-4 flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="font-mono text-[10px] text-wine/60"
                  >
                    &rarr;
                  </span>
                  <p className="font-mono text-xs md:text-sm text-charcoal">
                    {row.now}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-charcoal/70 mt-6 max-w-xl mx-auto">
          Same idea, new weight class. The Noell system keeps the human
          tone and replaces the manual work.
        </p>
      </div>
    </section>
  );
}
