"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import {
  IconPhoneCall,
  IconCalendarCheck,
  IconStar,
} from "@tabler/icons-react";

interface SystemCapability {
  icon: React.ReactNode;
  number: string;
  title: string;
  description: string;
  points: string[];
}

const defaultCapabilities: SystemCapability[] = [
  {
    icon: <IconPhoneCall size={28} />,
    number: "01",
    title: "Missed-call recovery",
    description:
      "When a call goes unanswered, an automatic text arrives in seconds with a booking link and the earliest availability.",
    points: [
      "Auto-text in under 10 seconds",
      "Booking link included",
      "Human handoff when needed",
    ],
  },
  {
    icon: <IconCalendarCheck size={28} />,
    number: "02",
    title: "Automated reminders",
    description:
      "Every appointment is confirmed and reminded on the right channel at the right time. No more manual texts the night before.",
    points: [
      "Multi-channel confirmations",
      "Smart reminder cadence",
      "Cancellation recapture",
    ],
  },
  {
    icon: <IconStar size={28} />,
    number: "03",
    title: "Review capture",
    description:
      "After each appointment, happy clients get a gentle nudge to leave a Google review. Your reputation compounds automatically.",
    points: [
      "Post-visit review requests",
      "Filter + routing logic",
      "Reputation dashboard",
    ],
  },
];

export function Features3({
  eyebrow = "Relief",
  headlineStart = "What changes",
  headlineAccent = "when the system takes over.",
  body = "Three plays, running quietly in the background, that protect your calendar and compound your reputation week after week.",
  capabilities = defaultCapabilities,
  accent = "wine",
}: {
  eyebrow?: string;
  headlineStart?: string;
  headlineAccent?: string;
  body?: string;
  capabilities?: SystemCapability[];
  accent?: "wine" | "lilac";
}) {
  const accentText = accent === "wine" ? "text-wine" : "text-lilac-dark";
  // Eyebrow needs extra contrast on cream; lilac-dark fails AA, so use muted-strong for the lilac variant.
  const eyebrowColor = accent === "wine" ? "text-wine" : "text-muted-strong";
  const accentBg = accent === "wine" ? "bg-wine/10" : "bg-lilac-dark/10";
  const accentGrad =
    accent === "wine"
      ? "from-wine to-wine-light"
      : "from-lilac-dark to-lilac";

  return (
    <section className="w-full py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p
            className={cn(
              "text-[11px] uppercase tracking-[0.25em] mb-4",
              eyebrowColor
            )}
          >
            {eyebrow}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            {headlineStart}{" "}
            <span
              className={cn(
                "bg-gradient-to-b bg-clip-text text-transparent italic",
                accentGrad
              )}
            >
              {headlineAccent}
            </span>
          </h2>
          <p className="mt-5 text-charcoal/75 max-w-xl mx-auto">{body}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={cn(
                "relative rounded-[22px] border border-warm-border bg-white",
                "p-7 md:p-8",
                "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    accentBg,
                    accentText
                  )}
                >
                  {cap.icon}
                </div>
                <span className="text-[10px] font-mono text-charcoal/70">
                  {cap.number}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-2">
                {cap.title}
              </h3>
              <p className="text-sm text-charcoal/75 leading-relaxed mb-5">
                {cap.description}
              </p>
              <ul className="space-y-2 pt-4 border-t border-warm-border">
                {cap.points.map((point, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-charcoal/70"
                  >
                    <span
                      className={cn(
                        "mt-1.5 w-1 h-1 rounded-full flex-shrink-0",
                        accent === "wine" ? "bg-wine" : "bg-lilac-dark"
                      )}
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
