"use client";

import { motion } from "motion/react";

const rows = [
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

export function LiveSystemLog() {
  return (
    <section className="w-full bg-blush">
      <div className="max-w-4xl mx-auto py-16 md:py-24 px-4">
        <p className="font-mono text-[11px] uppercase tracking-widest text-charcoal/60 text-center mb-8">
          LIVE &nbsp;/&nbsp; system log &nbsp;/&nbsp; last 12 hours
        </p>

        <ul className="font-mono text-xs md:text-sm space-y-2 text-left">
          {rows.map((row, i) => (
            <motion.li
              key={`${row.time}-${row.action}`}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              className="flex items-baseline gap-2 md:gap-3"
            >
              <span className="text-charcoal/50 tabular-nums">{row.time}</span>
              <span className="text-wine font-semibold">{row.action}</span>
              <span className="text-charcoal/30">&gt;</span>
              <span className="text-charcoal">{row.result}</span>
            </motion.li>
          ))}
        </ul>

        <p className="text-charcoal/60 italic text-sm mt-8 text-center">
          The system runs. You run the business.
        </p>
      </div>
    </section>
  );
}

export default LiveSystemLog;
