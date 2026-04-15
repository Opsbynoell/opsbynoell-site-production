"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, useAnimation, useInView } from "motion/react";

interface StatCard {
  value: string;
  label: string;
  detail: string;
}

const defaultStats: StatCard[] = [
  { value: "$960", label: "Revenue", detail: "recovered in 14 days" },
  { value: "40+", label: "Reviews", detail: "Google reviews in 6 weeks" },
  { value: "<1", label: "No-shows", detail: "per week, down from 4" },
  { value: "14d", label: "Live", detail: "to get the system running" },
];

export function Features({
  eyebrow = "Real outcomes",
  headlineStart = "One system change",
  headlineAccent = "changes the whole week.",
  body = "Real numbers from a real service business running the Ops by Noell system.",
  stats = defaultStats,
  accent = "wine",
}: {
  eyebrow?: string;
  headlineStart?: string;
  headlineAccent?: string;
  body?: string;
  stats?: StatCard[];
  accent?: "wine" | "lilac";
}) {
  const accentClasses = {
    wine: "from-wine to-wine-light",
    lilac: "from-lilac-dark to-lilac",
  };

  return (
    <div className="w-full py-20 relative">
      <div className="text-center mb-12 px-4">
        <p className="text-[11px] uppercase tracking-[0.25em] text-charcoal/50 mb-4">
          {eyebrow}
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal mb-4 max-w-3xl mx-auto">
          {headlineStart}{" "}
          <span className={cn(
            "bg-gradient-to-b bg-clip-text text-transparent italic",
            accentClasses[accent]
          )}>
            {headlineAccent}
          </span>
        </h2>
        <p className="text-charcoal/75 max-w-xl mx-auto">{body}</p>
      </div>

      <div
        style={{ zIndex: 10 }}
        className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto px-4"
      >
        {stats.map((stat, index) => (
          <div
            key={index}
            className={cn(
              "relative p-6 rounded-xl border border-warm-border bg-cream/50 backdrop-blur-sm",
              "hover:shadow-xl transition-all duration-300",
              "before:absolute before:top-0 before:left-1/2 before:-translate-x-1/2 before:h-[2px] before:w-12",
              accent === "wine"
                ? "before:bg-gradient-to-r before:from-wine before:to-wine-light"
                : "before:bg-gradient-to-r before:from-lilac-dark before:to-lilac",
              "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
            )}
          >
            <BackgroundGrid className="absolute rounded-xl inset-0 z-0" />
            <div className="absolute z-0 inset-0 rounded-xl h-full bg-gradient-radial from-white/50 via-white/60 to-cream" />
            <div className="relative">
              <p className="text-[10px] font-mono uppercase tracking-widest text-charcoal/40 mb-2">
                {stat.label}
              </p>
              <h3 className="font-serif text-4xl md:text-5xl font-bold mb-2 text-charcoal">
                {stat.value}
              </h3>
              <p className="text-sm text-charcoal/75 leading-relaxed">
                {stat.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const BackgroundGrid = ({ className }: { className?: string }) => {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const inView = useInView(ref, { amount: 0.3, once: true });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 1 },
      });
    }
  }, [controls, inView]);

  return (
    <div
      ref={ref}
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{
        backgroundImage: `
          linear-gradient(to right, #E7DFD6 1px, transparent 1px),
          linear-gradient(to bottom, #E7DFD6 1px, transparent 1px)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={controls}
        className="absolute w-full h-full"
      />
    </div>
  );
};
