import React from "react";
import {
  IconHandStop,
  IconSparkles,
  IconScissors,
  IconDental,
  IconHeart,
  IconBriefcase,
} from "@tabler/icons-react";

const verticals = [
  { name: "Massage Therapy", icon: <IconHandStop size={22} /> },
  { name: "Med Spas", icon: <IconSparkles size={22} /> },
  { name: "Salons", icon: <IconScissors size={22} /> },
  { name: "Dental Offices", icon: <IconDental size={22} /> },
  { name: "Estheticians", icon: <IconHeart size={22} /> },
  { name: "Service Businesses", icon: <IconBriefcase size={22} /> },
];

export function LogoCloud() {
  return (
    <section id="verticals" className="w-full py-16 md:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-center text-[11px] uppercase tracking-[0.25em] text-charcoal/50 mb-10">
          Built for
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {verticals.map((v, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-xl border border-warm-border bg-cream/60 py-5 px-3 text-center hover:bg-white transition-colors"
            >
              <span className="text-wine/80">{v.icon}</span>
              <span className="text-xs md:text-sm text-charcoal/70 font-medium">
                {v.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
