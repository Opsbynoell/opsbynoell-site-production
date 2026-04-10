import Link from "next/link";
import { ArrowRight } from "lucide-react";

const verticals = [
  {
    title: "Med Spas & Aesthetics",
    line: "High-ticket appointments demand instant attention.",
    stat: "$3,800",
    statLabel: "monthly revenue recovered",
  },
  {
    title: "Home Services",
    line: "The estimate that gets there first wins the job.",
    stat: "4×",
    statLabel: "review growth in 90 days",
  },
  {
    title: "Dental & Health Clinics",
    line: "Patient trust is built before they walk in the door.",
    stat: "0",
    statLabel: "no-shows after activation",
  },
  {
    title: "Legal & Professional Services",
    line: "First response wins the consultation.",
    stat: "14d",
    statLabel: "audit to operational",
  },
];

export function VerticalsSection() {
  return (
    <div className="space-y-4">
      {verticals.map((v, i) => (
        <Link
          key={v.title}
          href="/verticals"
          className="group grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center p-6 md:p-8 rounded-xl border border-charcoal/5 hover:border-wine/15 bg-cream/50 hover:bg-blush/20 transition-all"
          style={{ transform: `rotate(${i % 2 === 0 ? -0.3 : 0.3}deg)` }}
        >
          <div className="space-y-2">
            <h3 className="font-serif text-xl md:text-2xl text-charcoal group-hover:text-wine transition-colors">
              {v.title}
            </h3>
            <p className="text-sm text-charcoal/45 italic">{v.line}</p>
            <div className="flex items-center gap-2 text-sm text-wine opacity-0 group-hover:opacity-100 transition-opacity pt-1">
              <span>Learn more</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-right border-l border-charcoal/5 pl-6">
            <span className="font-mono text-3xl text-wine">{v.stat}</span>
            <span className="block text-xs text-charcoal/35 mt-1 max-w-[140px]">
              {v.statLabel}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
