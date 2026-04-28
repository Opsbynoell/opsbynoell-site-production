"use client";

import React from "react";
import { motion } from "motion/react";

export interface LogRow {
  time: string;
  action: string;
  result?: string;
}

const defaultRows: LogRow[] = [
  {
    time: "06:12",
    action: "missed-call",
    result: "answered within 58s, booking offered",
  },
  {
    time: "07:44",
    action: "new chat lead",
    result: "qualified, slot held for 2pm",
  },
  {
    time: "09:14",
    action: "reactivation",
    result: "sent while you slept",
  },
  {
    time: "11:03",
    action: "confirmation",
    result: "client confirmed, added to route",
  },
  {
    time: "13:27",
    action: "escalation",
    result: "flagged for owner, summary attached",
  },
];

export function LiveSystemLog({
  eyebrow = "LIVE  /  system log  /  last 12 hours",
  rows = defaultRows,
  caption = "The system runs. You run the business.",
  separator = ">",
  children,
}: {
  eyebrow?: string;
  rows?: LogRow[];
  caption?: string;
  separator?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="w-full bg-blush">
      <div className="max-w-4xl mx-auto py-16 md:py-24 px-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-charcoal/70 text-center mb-8">
          {eyebrow}
        </p>

        <ul className="font-mono text-xs md:text-sm space-y-2 text-left">
          {rows.map((row, i) => (
            <motion.li
              key={`${row.time}-${row.action}-${i}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              className="flex items-baseline gap-2 md:gap-3"
            >
              <span className="text-charcoal/70 tabular-nums">{row.time}</span>
              <span className="text-wine font-semibold">{row.action}</span>
              {row.result && (
                <>
                  <span className="text-charcoal/70">{separator}</span>
                  <span className="text-charcoal">{row.result}</span>
                </>
              )}
            </motion.li>
          ))}
        </ul>

        {children}

        {caption && (
          <p className="text-charcoal/70 italic text-sm mt-8 text-center">
            {caption}
          </p>
        )}
      </div>
    </section>
  );
}

export default LiveSystemLog;
