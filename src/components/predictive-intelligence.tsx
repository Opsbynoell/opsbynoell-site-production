import Link from "next/link";
import {
  IconSparkles,
  IconActivity,
  IconAlertTriangle,
  IconClock,
} from "@tabler/icons-react";

const signals = [
  {
    icon: <IconAlertTriangle size={22} />,
    title: "Who is about to lapse",
    detail:
      "Your system watches cadence and tone across the whole book. When a regular starts drifting, you hear about it before they are gone.",
  },
  {
    icon: <IconClock size={22} />,
    title: "When to reach out",
    detail:
      "The right window to rebook is not the same for every client. The system learns your patterns and surfaces the moment that works.",
  },
  {
    icon: <IconActivity size={22} />,
    title: "What is trending in your book",
    detail:
      "Quiet shifts in service mix, visit gaps, and response time, surfaced as signals, not as a dashboard you have to open.",
  },
];

export function PredictiveIntelligence({
  eyebrow = "Rolling in · Predictive Customer Intelligence",
  compact = false,
}: {
  eyebrow?: string;
  compact?: boolean;
}) {
  return (
    <section className="w-full px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 md:mb-14 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IconSparkles size={16} className="text-wine" aria-hidden="true" focusable="false" />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
              {eyebrow}
            </p>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            The system doesn&rsquo;t just react.{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              It learns your book.
            </span>
          </h2>
          <p className="mt-5 text-charcoal/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Predictive Customer Intelligence is the next layer of the Noell
            system. It watches patterns across every call, text, and booking,
            quietly, and surfaces the small signals that protect retention
            before the churn shows up in the numbers.
          </p>
        </div>

        <div
          className={
            compact
              ? "grid grid-cols-1 md:grid-cols-3 gap-4"
              : "grid grid-cols-1 md:grid-cols-3 gap-5"
          }
        >
          {signals.map((s, i) => (
            <div
              key={i}
              className="rounded-[22px] border border-warm-border bg-white p-6 md:p-7 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
            >
              <div
                aria-hidden="true"
                className="w-10 h-10 rounded-xl bg-wine/10 text-wine flex items-center justify-center mb-4"
              >
                {s.icon}
              </div>
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-2 leading-snug">
                {s.title}
              </h3>
              <p className="text-sm text-charcoal/65 leading-relaxed">
                {s.detail}
              </p>
            </div>
          ))}
        </div>

        {!compact && (
          <p className="text-center text-xs text-muted-strong mt-8 max-w-2xl mx-auto">
            Rolling out to Growth and Custom Ops clients first.{" "}
            <Link
              href="/book"
              className="text-wine hover:text-wine-dark underline underline-offset-4"
            >
              Ask about the intelligence layer on your audit
            </Link>
            .
          </p>
        )}
      </div>
    </section>
  );
}

type Vertical =
  | "dental"
  | "med-spas"
  | "salons"
  | "massage"
  | "estheticians"
  | "hvac";

const EXAMPLES: Record<Vertical, { title: string; detail: string }[]> = {
  dental: [
    {
      title: "Hygiene recalls at risk",
      detail:
        "The system flags 6-month recalls that are drifting before they fall off entirely, so your team can send a real person a warm nudge.",
    },
    {
      title: "Unscheduled treatment cooling",
      detail:
        "Diagnosed-but-unscheduled patients get surfaced at the right moment, not six months late.",
    },
    {
      title: "New-patient pipeline health",
      detail:
        "A weekly read on new-patient response time, show rates, and first-visit completion, without opening a dashboard.",
    },
  ],
  "med-spas": [
    {
      title: "Membership lapse risk",
      detail:
        "Members with quieter cadences get flagged early so you can protect the relationship before renewal.",
    },
    {
      title: "Consult-to-treatment gap",
      detail:
        "The system watches the window between consultation and treatment and surfaces the ones trending cold.",
    },
    {
      title: "Premium tone integrity",
      detail:
        "Outreach cadence stays quiet for premium clients even as the system leans in for retention elsewhere.",
    },
  ],
  salons: [
    {
      title: "Chair-level rebook risk",
      detail:
        "Rebook rate by chair, with soft signals when a stylist's book is quietly slipping.",
    },
    {
      title: "Walk-in vs. regular mix",
      detail:
        "Shifts in your client mix show up as signals, not as surprises in next month's revenue.",
    },
    {
      title: "Color loyalty drift",
      detail:
        "Color clients on a long cadence get surfaced at the right window, not after they have already booked somewhere.",
    },
  ],
  massage: [
    {
      title: "Returning-client lapse",
      detail:
        "Regulars who quietly fall off your calendar get flagged early, so the right nudge lands at the right time.",
    },
    {
      title: "Right-time rebook",
      detail:
        "The system learns each client's natural cadence and surfaces the day before they were going to book on their own.",
    },
    {
      title: "Package adherence",
      detail:
        "Package clients drifting from cadence get surfaced before the package expires and the relationship cools.",
    },
  ],
  estheticians: [
    {
      title: "Membership drop-off",
      detail:
        "Members slowing down get surfaced early so outreach can protect the relationship, not chase a cancellation.",
    },
    {
      title: "Routine adherence",
      detail:
        "Treatment routines that slip cadence become visible as signals, long before the retention number moves.",
    },
    {
      title: "Seasonal skincare windows",
      detail:
        "The right moment to re-engage skincare routines gets surfaced by season, not by a broadcast.",
    },
  ],
  hvac: [
    {
      title: "Maintenance plan risk",
      detail:
        "Plan members whose visit cadence is slipping get flagged before they become last year's clients.",
    },
    {
      title: "Emergency vs. scheduled trend",
      detail:
        "Shifts in the mix of emergency vs. scheduled calls become a signal, not a surprise in the slow season.",
    },
    {
      title: "Seasonal demand ramp",
      detail:
        "The ramp into heating and cooling seasons gets surfaced as an outreach moment, not a firefight.",
    },
  ],
};

export function PredictiveIntelligenceVerticalExample({
  vertical,
}: {
  vertical: Vertical;
}) {
  const items = EXAMPLES[vertical];
  if (!items) return null;

  return (
    <section className="w-full px-4 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <IconSparkles
              size={16}
              className="text-wine"
              aria-hidden="true"
              focusable="false"
            />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
              Rolling in &middot; Predictive Customer Intelligence
            </p>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            What the system learns{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              about your book.
            </span>
          </h2>
          <p className="mt-5 text-charcoal/70 max-w-2xl mx-auto leading-relaxed">
            The intelligence layer watches quietly across calls, texts, and
            bookings and surfaces the signals specific to how your business
            actually runs. Here are three examples for your vertical.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <div
              key={i}
              className="rounded-[22px] border border-warm-border bg-white p-6 md:p-7 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
            >
              <h3 className="font-serif text-xl font-semibold text-charcoal mb-3 leading-snug">
                {it.title}
              </h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                {it.detail}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-strong mt-8 max-w-2xl mx-auto">
          Rolling out to Growth and Custom Ops clients first. The signals get
          tuned to your specific book during install.
        </p>
      </div>
    </section>
  );
}
