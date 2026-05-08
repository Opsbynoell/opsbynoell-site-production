import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import { Button } from "./button";

const LEFT_ITEMS = [
  "Noell Support (website chat)",
  "Noell Front Desk (calls/scheduling)",
  "Noell Care (existing-client support)",
];

const RIGHT_ITEMS = [
  "Works alongside any booking tool",
  "Light onboarding, live in under a week",
  "Testimonial required + 1 reference call",
];

export function NoellAgentsCard() {
  return (
    <section className="w-full px-4 pt-4 md:pt-8">
      <div className="max-w-6xl mx-auto">
        <div className="relative rounded-[28px] border border-wine/20 bg-cream p-6 md:p-10 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] overflow-hidden">
          {/* Wine accent left border */}
          <div className="absolute inset-y-0 left-0 w-1 bg-wine" aria-hidden />

          {/* Founder banner */}
          <div className="md:absolute md:top-6 md:right-6 mb-4 md:mb-0">
            <span className="inline-flex items-center rounded-full bg-wine text-cream px-3.5 py-1.5 text-[11px] font-medium tracking-wide">
              Founding rate — $197/mo, locked 12 months
            </span>
          </div>

          <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium">
            The AI layer · Self-serve
          </p>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            Noell Agents
          </h2>
          <p className="mt-2 text-sm font-medium text-wine">
            Best for businesses adding AI to an existing stack
          </p>
          <p className="mt-3 text-charcoal/75 text-base md:text-lg leading-relaxed max-w-2xl">
            Three AI agents. No platform migration. Works on top of what you
            have.
          </p>
          <p className="mt-2 text-sm text-charcoal/75 leading-relaxed max-w-2xl">
            Best when you already like your booking tool and need calls, chat,
            and client support covered without a platform migration.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
            {/* Price block */}
            <div className="md:border-r md:border-warm-border md:pr-10">
              <div className="flex items-baseline">
                <span className="text-base text-charcoal/70 mr-2">From</span>
                <span className="font-serif text-5xl md:text-6xl font-bold text-charcoal leading-none">
                  $197
                </span>
                <span className="ml-1 text-lg text-charcoal/70">/mo</span>
              </div>
              <p className="mt-2 text-sm font-medium text-charcoal">
                3 AI agents. Plug in. Go.
              </p>
              <p className="mt-3 text-sm text-wine font-medium">
                Founding rate locked 12 months ($297/mo after)
              </p>
              <p className="mt-1 text-sm text-charcoal/70">No setup fee</p>
              <div className="mt-6">
                <Button href="/agents" variant="primary" className="h-11 px-6">
                  Start the agents
                </Button>
              </div>
            </div>

            {/* Two-column included list */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-charcoal/70 font-medium mb-4">
                What&apos;s included
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                <ul className="space-y-3">
                  {LEFT_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-wine text-cream flex items-center justify-center">
                        <IconCheck size={11} strokeWidth={3} />
                      </span>
                      <span className="text-sm text-charcoal/85 leading-snug">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-3">
                  {RIGHT_ITEMS.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-wine text-cream flex items-center justify-center">
                        <IconCheck size={11} strokeWidth={3} />
                      </span>
                      <span className="text-sm text-charcoal/85 leading-snug">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="mt-8 pt-6 border-t border-warm-border text-sm italic text-muted-strong leading-relaxed max-w-3xl">
            Need PMS integration, reactivation, or Predictive Customer
            Intelligence? Start with{" "}
            <Link
              href="#noell-system"
              className="text-wine hover:text-wine-dark underline underline-offset-4 decoration-wine/30"
            >
              Growth
            </Link>{" "}
            instead.
          </p>
        </div>
      </div>
    </section>
  );
}
