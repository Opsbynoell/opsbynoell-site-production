import React from "react";
import Link from "next/link";
import {
  IconDental,
  IconSparkles,
  IconScissors,
  IconHandStop,
  IconHeart,
  IconSnowflake,
} from "@tabler/icons-react";

type Vertical = {
  name: string;
  href: string;
  icon: React.ReactNode;
  identity: string;
};

const verticals: Vertical[] = [
  {
    name: "Dental Offices",
    href: "/verticals/dental",
    icon: <IconDental size={22} />,
    identity:
      "You run a practice, not a call center. New patient calls should not decide whether you have a good week.",
  },
  {
    name: "Med Spas",
    href: "/verticals/med-spas",
    icon: <IconSparkles size={22} />,
    identity:
      "You built a premium room. Warm intent should not cool off while the front desk is busy.",
  },
  {
    name: "Salons",
    href: "/verticals/salons",
    icon: <IconScissors size={22} />,
    identity:
      "Every stylist is a revenue center. Rebooks are retention. Missed calls cost chairs.",
  },
  {
    name: "Massage Therapy",
    href: "/verticals/massage",
    icon: <IconHandStop size={22} />,
    identity:
      "Solo or small team. You want a full calendar without feeling like a salesperson.",
  },
  {
    name: "Estheticians",
    href: "/verticals/estheticians",
    icon: <IconHeart size={22} />,
    identity:
      "Retention-first, never pushy. Skincare clients want to feel cared for, not sold to.",
  },
  {
    name: "HVAC",
    href: "/verticals/hvac",
    icon: <IconSnowflake size={22} />,
    identity:
      "Emergency or scheduled, the call needs to route to the right tech in the right window.",
  },
];

export function LogoCloud() {
  return (
    <section id="verticals" className="w-full py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/60">
              who this is for
            </p>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            If you recognize yourself here,{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              this was built for you.
            </span>
          </h2>
          <p className="mt-4 text-charcoal/75">
            Ops by Noell is for service businesses where the owner is in the
            work all day and the front desk cannot also be the marketing team.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {verticals.map((v) => (
            <Link
              key={v.name}
              href={v.href}
              className="group rounded-[17px] border border-warm-border bg-white hover:bg-cream-dark/60 transition-colors px-5 py-5 flex gap-4 items-start"
            >
              <div className="w-10 h-10 rounded-lg bg-wine/10 text-wine flex items-center justify-center flex-shrink-0">
                {v.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-serif text-base md:text-lg font-semibold text-charcoal leading-snug">
                    {v.name}
                  </p>
                  <span className="font-mono text-[10px] text-wine/60 opacity-0 group-hover:opacity-100 transition-opacity">
                    &rarr;
                  </span>
                </div>
                <p className="text-xs md:text-sm text-charcoal/80 leading-relaxed">
                  {v.identity}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-center mt-8">
          <Link
            href="/verticals"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine hover:text-wine-dark"
          >
            see every vertical &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
