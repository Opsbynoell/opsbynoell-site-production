"use client";
import { IconCheck, IconQuote } from "@tabler/icons-react";
import { motion } from "motion/react";
import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "./button";

const defaultFeatures = [
  "Dropped no-shows from 4/week to less than 1",
  "Recovered $960 from missed calls in 14 days",
  "Captured 40+ new Google reviews in 8 weeks",
];

const orbitingNodes = [
  { initials: "AM", label: "⭐️⭐️⭐️⭐️⭐️", role: "Esthetician" },
  { initials: "JR", label: "⭐️⭐️⭐️⭐️⭐️", role: "Massage" },
  { initials: "LN", label: "⭐️⭐️⭐️⭐️⭐️", role: "Med Spa" },
  { initials: "SM", label: "⭐️⭐️⭐️⭐️⭐️", role: "Salon" },
  { initials: "DK", label: "⭐️⭐️⭐️⭐️⭐️", role: "Dental" },
  { initials: "TH", label: "⭐️⭐️⭐️⭐️⭐️", role: "Studio" },
];

export function Testimonials({
  accent = "wine",
}: {
  accent?: "wine" | "lilac";
}) {
  const accentBg = accent === "wine" ? "bg-wine/10" : "bg-lilac-dark/10";
  const accentText = accent === "wine" ? "text-wine" : "text-lilac-dark";
  const accentSolid = accent === "wine" ? "bg-wine" : "bg-lilac-dark";
  const accentGrad =
    accent === "wine"
      ? "from-wine to-wine-light"
      : "from-lilac-dark to-lilac";

  return (
    <section className="relative w-full py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-7">
            <p
              className={cn(
                "text-[11px] uppercase tracking-[0.25em]",
                accentText
              )}
            >
              Proof
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              4 no-shows a week.{" "}
              <span
                className={cn(
                  "bg-gradient-to-b bg-clip-text text-transparent italic",
                  accentGrad
                )}
              >
                Then almost none.
              </span>
            </h2>

            <div className={cn("rounded-[22px] p-6 relative", accentBg)}>
              <IconQuote
                className={cn("absolute top-4 right-4 opacity-20", accentText)}
                size={32}
              />
              <p className="text-charcoal/80 leading-relaxed">
                Sarah, a massage therapist in Lago Vista, went from digital
                patchwork to a system that followed up, reminded clients, and
                protected her calendar. Inside 14 days, the system had paid for
                itself.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white",
                    accentSolid
                  )}
                >
                  SM
                </div>
                <div>
                  <p className="text-sm font-medium text-charcoal">Sarah M.</p>
                  <p className="text-xs text-charcoal/50">
                    Massage therapist · Lago Vista
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {defaultFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center",
                      accentBg
                    )}
                  >
                    <IconCheck
                      className={cn("w-3 h-3", accentText)}
                      strokeWidth={3}
                    />
                  </div>
                  <span className="text-charcoal/80">{feature}</span>
                </div>
              ))}
            </div>

            <Button
              href="/book"
              variant={accent === "lilac" ? "lilac" : "primary"}
              className="px-6 py-3"
            >
              Book your free audit
            </Button>
          </div>

          {/* Right — orbiting proof nodes */}
          <div className="relative h-[520px] md:h-[600px] overflow-hidden">
            <OrbitingIcons
              centerNode={
                <div className="p-5 z-20 flex flex-col items-center justify-center rounded-[20px] border-[1.5px] border-warm-border bg-gradient-to-br from-white via-cream to-cream-dark shadow-[0px_123px_35px_0px_rgba(28,25,23,0.00),_0px_79px_32px_0px_rgba(28,25,23,0.02),_0px_44px_27px_0px_rgba(28,25,23,0.06),_0px_20px_20px_0px_rgba(28,25,23,0.09),_0px_5px_11px_0px_rgba(28,25,23,0.10)]">
                  <p
                    className={cn(
                      "text-[10px] uppercase tracking-widest font-medium",
                      accentText
                    )}
                  >
                    Avg rating
                  </p>
                  <p className="font-serif text-4xl font-bold text-charcoal mt-1">
                    4.9
                  </p>
                  <p className="text-[11px] text-charcoal/50 mt-1">
                    across 40+ reviews
                  </p>
                </div>
              }
              nodes={orbitingNodes.map((node, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-[108px] h-[108px] rounded-[22px] bg-white border border-warm-border flex flex-col items-center justify-center p-2",
                    "shadow-[0px_44px_12px_0px_rgba(28,25,23,0.00),_0px_28px_11px_0px_rgba(28,25,23,0.03),_0px_16px_10px_0px_rgba(28,25,23,0.09),_0px_7px_7px_0px_rgba(28,25,23,0.15),_0px_2px_4px_0px_rgba(28,25,23,0.18)]"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-xs font-semibold text-white mb-1.5",
                      accentSolid
                    )}
                  >
                    {node.initials}
                  </div>
                  <p className="text-[9px] text-charcoal/80">{node.label}</p>
                  <p className="text-[9px] text-charcoal/40 mt-0.5">
                    {node.role}
                  </p>
                </div>
              ))}
            />
            <div className="absolute inset-0 z-10 w-full h-full bg-gradient-to-l from-cream via-cream/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}

function OrbitingIcons({
  centerNode,
  nodes,
  radius = 190,
  speed = 28,
}: {
  centerNode: React.ReactNode;
  nodes: React.ReactNode[];
  radius?: number;
  speed?: number;
}) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Center */}
      <div className="absolute z-20">{centerNode}</div>

      {/* Orbital ring */}
      <div
        className="absolute rounded-full border border-warm-border/50"
        style={{ width: radius * 2, height: radius * 2 }}
      />

      {/* Orbiting nodes */}
      <motion.div
        className="absolute"
        style={{ width: radius * 2, height: radius * 2 }}
        animate={{ rotate: 360 }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {nodes.map((node, i) => {
          const angle = (i / nodes.length) * 2 * Math.PI;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{ rotate: -360 }}
              transition={{
                duration: speed,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {node}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
