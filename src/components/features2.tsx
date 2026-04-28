"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { IconAlertCircle, IconClockHour4, IconPhoneOff } from "@tabler/icons-react";

interface PainPoint {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const defaultPainPoints: PainPoint[] = [
  {
    icon: <IconPhoneOff size={22} />,
    title: "Missed calls become missed revenue",
    description:
      "Someone finds you, calls you, gets no answer, and moves on before you ever have a chance to follow up.",
  },
  {
    icon: <IconClockHour4 size={22} />,
    title: "Follow-up slips when the day gets full",
    description:
      "You mean to text them back, confirm the appointment, or ask for the review, but client work always comes first.",
  },
  {
    icon: <IconAlertCircle size={22} />,
    title: "No-shows are usually a system problem",
    description:
      "If reminders are inconsistent and communication is reactive, no-shows stay high even when demand is strong.",
  },
];

export function Features2({
  eyebrow = "The real problem",
  headlineStart = "Your marketing is working.",
  headlineAccent = "Your response time isn't.",
  body = "The problem usually isn't demand. It's what happens after someone reaches out.",
  painPoints = defaultPainPoints,
  closingLine = "This isn't a marketing problem. It's an operations problem, and it's fixable without hiring anyone.",
}: {
  eyebrow?: string;
  headlineStart?: string;
  headlineAccent?: string;
  body?: string;
  painPoints?: PainPoint[];
  closingLine?: string;
}) {
  return (
    <section
      className="w-full max-w-7xl mx-auto rounded-3xl bg-charcoal px-6 py-20 md:py-28 my-10 md:my-20"
    >
      <div className="text-center mb-14 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-wine-light" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/65">
            {eyebrow}
          </p>
        </div>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
          {headlineStart}{" "}
          <span className="italic text-wine-light">{headlineAccent}</span>
        </h2>
        <p className="mt-5 text-cream/65 max-w-xl mx-auto">{body}</p>

        {/* 85% visual callout: the operational diagnosis number */}
        <div className="mt-8 inline-flex items-stretch rounded-[14px] border border-wine/40 bg-wine/15 overflow-hidden">
          <div className="px-5 md:px-6 py-3 md:py-4 border-r border-wine/30 flex items-center">
            <span className="font-serif text-3xl md:text-4xl font-bold text-cream">
              85%
            </span>
          </div>
          <div className="px-5 md:px-6 py-3 md:py-4 flex items-center text-left">
            <p className="text-xs md:text-sm text-cream/85 leading-snug max-w-xs">
              of callers who cannot reach a service business do not leave a
              voicemail. They call the next name on the list.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {painPoints.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={cn(
              "rounded-[17px] border border-white/[0.08] bg-white/[0.04]",
              "p-6 md:p-7",
              "hover:bg-white/[0.06] transition-colors"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-wine/30 text-wine-light flex items-center justify-center">
                {point.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cream mb-1.5">
                  {point.title}
                </h3>
                <p className="text-sm text-cream/65 leading-relaxed">
                  {point.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto mt-8">
        <div className="rounded-[17px] bg-wine/25 border border-wine/35 px-6 py-4 text-center">
          <p className="text-sm text-cream">
            {closingLine.split(/(fixable without hiring anyone\.)/).map((part, i) =>
              part === "fixable without hiring anyone." ? (
                <span key={i} className="font-semibold text-cream">
                  {part}
                </span>
              ) : (
                <span key={i} className="text-cream/80">
                  {part}
                </span>
              )
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
