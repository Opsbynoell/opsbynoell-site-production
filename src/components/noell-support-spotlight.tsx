import React from "react";
import Link from "next/link";
import { IconBolt, IconArrowRight } from "@tabler/icons-react";
import { Button } from "./button";

/**
 * NoellSupportSpotlight, a short honest-positioning band on the homepage
 * that names the chat-widget product and links out to the full
 * /noell-support page. Preserves the "first response, not full front desk"
 * framing and keeps the product's scope visible so the visitor knows what
 * they are buying before they book an audit.
 */

export function NoellSupportSpotlight() {
  return (
    <section className="w-full px-4 my-16 md:my-24">
      <div className="max-w-6xl mx-auto">
        <div className="rounded-[32px] border border-warm-border bg-gradient-to-br from-white via-cream to-blush-light overflow-hidden shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left: message */}
            <div className="px-7 py-10 md:px-12 md:py-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
                  noell support · online
                </p>
              </div>
              <h2 className="font-serif text-2xl md:text-4xl font-semibold text-charcoal leading-tight">
                The chat widget you can see in the corner{" "}
                <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                  is the product.
                </span>
              </h2>
              <p className="mt-5 text-charcoal/80 leading-relaxed">
                Noell Support is the new-prospect intake layer. First
                response, qualification, contact capture, routing, and
                booking-link handoff. It is not trying to be a full front
                desk. That is Noell Front Desk, the separate operations
                layer.
              </p>
              <p className="mt-4 text-sm text-charcoal/75 leading-relaxed">
                Pop the widget open if you want to see it respond. The
                version you are looking at is the same one we install for
                clients.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button
                  href="/noell-support"
                  variant="primary"
                  className="w-full sm:w-auto h-11 px-6"
                >
                  See how Noell responds
                </Button>
                <Link
                  href="/noell-front-desk"
                  className="inline-flex items-center justify-center gap-1.5 text-sm text-charcoal/70 hover:text-charcoal px-4 py-2 transition-colors"
                >
                  How it pairs with Front Desk
                  <IconArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: honest-scope card */}
            <div className="bg-charcoal px-7 py-10 md:px-12 md:py-14 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 mb-5">
                <IconBolt size={16} className="text-blush" />
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-blush">
                  honest scope
                </p>
              </div>

              <p className="text-sm text-cream/80 mb-4 leading-relaxed">
                Noell Support handles the first minutes of a new prospect.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  "Instant first response",
                  "Lead qualification",
                  "Contact capture + routing",
                  "Booking-link handoff",
                  "Human escalation with context",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-cream"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blush" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-sm text-cream/60 mb-3 leading-relaxed">
                It does not try to do:
              </p>
              <ul className="space-y-2 text-sm text-cream/50">
                {[
                  "Run your calendar end to end",
                  "Process payments",
                  "Replace Noell Front Desk",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cream/25" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
