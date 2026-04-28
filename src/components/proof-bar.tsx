"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface ProofBarProps {
  className?: string;
}

type RecoveryRow = {
  time: string;
  action: string;
  sep: string;
  result: string;
};

const recoveryScenes: RecoveryRow[][] = [
  [
    { time: "09:14", action: "missed-call-recovery", sep: "·", result: "triggered" },
    { time: "09:14", action: "auto-reply sent", sep: "·", result: "lead engaged" },
    { time: "09:17", action: "appointment confirmed", sep: "·", result: "$960 recovered" },
  ],
  [
    { time: "14:22", action: "web-chat opened", sep: "·", result: "qualified" },
    { time: "14:23", action: "Noell Support", sep: "·", result: "booking link sent" },
    { time: "14:24", action: "audit booked", sep: "·", result: "Tue 11am" },
  ],
  [
    { time: "18:03", action: "after-hours text", sep: "·", result: "Noell Front Desk" },
    { time: "18:04", action: "deposit requested", sep: "·", result: "link sent" },
    { time: "18:05", action: "deposit captured", sep: "·", result: "$300 secured" },
  ],
  [
    { time: "07:48", action: "rebooking SMS sent", sep: "·", result: "no-show recovery" },
    { time: "07:50", action: "client replied", sep: "·", result: "slot selected" },
    { time: "07:51", action: "slot filled", sep: "·", result: "$480 recovered" },
  ],
];

const sceneLabels = [
  "case: santa_e · missed-call recovery",
  "case: ops_demo · web-chat qualification",
  "case: after-hours · deposit capture",
  "case: no-show recovery · rebooking",
];

export function ProofBar({ className }: ProofBarProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  // Lazy initializer reads matchMedia synchronously when available (SSR returns
  // false), avoiding react-hooks/set-state-in-effect and matching the pattern
  // in noell-support-chat.tsx.
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  // Subscribe to prefers-reduced-motion changes after mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Auto-rotate scenes every 3.5s, but pause entirely when reduced motion is requested.
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setSceneIndex((prev) => (prev + 1) % recoveryScenes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  const rows = recoveryScenes[sceneIndex];
  const label = sceneLabels[sceneIndex];

  // Animation props collapse to instant (duration 0, no offset) when reduced motion is on.
  const labelMotion = reducedMotion
    ? { initial: false as const, animate: { opacity: 1 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      };
  const sceneMotion = reducedMotion
    ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, y: 6 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -6 },
        transition: { duration: 0.35, ease: "easeInOut" as const },
      };

  return (
    <div
      id="live-recovery"
      className={cn(
        "w-full max-w-xl mx-auto mt-8 md:mt-10",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={`label-${sceneIndex}`}
          {...labelMotion}
          className="font-mono text-[11px] uppercase tracking-widest text-charcoal/70 text-center mb-3"
        >
          {label}
        </motion.p>
      </AnimatePresence>
      <div className="rounded-2xl bg-cream-dark border border-warm-border p-4 md:p-5">
        <AnimatePresence mode="wait">
          <motion.ul
            key={`scene-${sceneIndex}`}
            {...sceneMotion}
            className="font-mono text-xs md:text-sm space-y-1.5 text-left"
          >
            {rows.map((row) => (
              <li key={`${row.time}-${row.action}`} className="flex items-baseline gap-2 md:gap-3">
                <span className="text-charcoal/70 tabular-nums">{row.time}</span>
                <span className="text-wine font-semibold">{row.action}</span>
                <span className="text-charcoal/70">{row.sep}</span>
                <span className="text-charcoal">{row.result}</span>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </div>
  );
}
