import React from "react";
import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type CardProps = {
  eyebrow: string;
  title: string;
  oneLiner: string;
  bullets: string[];
  banner?: string;
  priceLine: string;
  ctaLabel: string;
  ctaHref: string;
  highlighted?: boolean;
};

const cards: CardProps[] = [
  {
    eyebrow: "Self-serve",
    title: "Noell Agents",
    oneLiner:
      "Three AI agents. Works alongside the booking tool you already use.",
    bullets: [
      "Noell Support — 24/7 website chat + lead qualification",
      "Noell Front Desk — calls, scheduling, confirmations, reminders",
      "Noell Care — rebooking + existing-client support",
      "Works with any booking tool",
      "Light onboarding, live in under a week",
    ],
    banner: "Founding rate: $197/mo (through June 30)",
    priceLine: "$297/mo",
    ctaLabel: "Start the agents",
    ctaHref: "/agents",
  },
  {
    eyebrow: "Done-for-you · 14-day install",
    title: "The Noell System",
    oneLiner:
      "The entire operations platform, your brand, installed and managed by our team.",
    bullets: [
      "Full white-labeled operations platform (CRM, calendars, marketing)",
      "Three AI agents included (Growth tier and up)",
      "Two-way integration with your PMS/booking tool",
      "Free 30-minute audit before you commit",
      "Managed install in 14 days",
      "Ongoing updates, no maintenance on your end",
    ],
    priceLine: "From $197/mo to $1,497/mo + setup",
    ctaLabel: "Book a free audit",
    ctaHref: "/book",
    highlighted: true,
  },
];

function Card({ card }: { card: CardProps }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-[22px] bg-white p-7 md:p-8 h-full",
        "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]",
        card.highlighted
          ? "border border-wine"
          : "border border-warm-border"
      )}
    >
      <p className="text-[11px] uppercase tracking-[0.2em] text-wine/70 mb-2">
        {card.eyebrow}
      </p>
      <h3 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-3">
        {card.title}
      </h3>
      <p className="text-sm md:text-base text-charcoal/80 leading-relaxed mb-6">
        {card.oneLiner}
      </p>

      <ul className="space-y-3 mb-7 flex-1">
        {card.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5">
            <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-wine/10 text-wine flex items-center justify-center">
              <IconCheck size={12} strokeWidth={3} />
            </span>
            <span className="text-sm text-charcoal/80 leading-snug">
              {bullet}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-auto">
        {card.banner && (
          <div className="mb-3 rounded-md bg-wine/10 px-3 py-2 text-center">
            <p className="text-xs font-medium text-wine">{card.banner}</p>
          </div>
        )}
        <p
          className={cn(
            "text-center mb-5",
            card.highlighted
              ? "font-serif text-lg text-charcoal"
              : "text-sm text-charcoal/70"
          )}
        >
          {card.priceLine}
        </p>
        <Link
          href={card.ctaHref}
          className={cn(
            "inline-flex w-full items-center justify-center rounded-[8px] h-12 px-6 text-sm font-medium transition-colors tap-target",
            card.highlighted
              ? "bg-[linear-gradient(181deg,_#8B4D5E_18.12%,_#5A1F30_99.57%)] text-white shadow-[0px_4px_8px_0px_rgba(90,31,48,0.18),_0px_2px_4px_0px_rgba(90,31,48,0.12),0px_0px_0px_1px_rgba(90,31,48,0.12),_0px_1px_1px_2px_rgba(255,255,255,0.28)_inset,0px_-1px_5px_2px_rgba(255,255,255,0.20)_inset]"
              : "bg-white border border-warm-border text-charcoal hover:bg-cream"
          )}
        >
          {card.ctaLabel}
        </Link>
      </div>
    </div>
  );
}

export function PickYourPath() {
  return (
    <section className="w-full py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            Two ways to run it
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            Just the agents, or the{" "}
            <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
              full system.
            </span>
          </h2>
          <p className="mt-5 text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
            Run only the AI layer on top of what you already have. Or let us
            install the entire operation end-to-end — platform, automations,
            agents, and managed updates.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-stretch">
          {cards.map((card) => (
            <Card key={card.title} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
