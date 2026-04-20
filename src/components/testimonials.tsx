"use client";
import { motion } from "motion/react";
import React from "react";
import { Button } from "./button";

export function Testimonials({
  accent = "wine",
}: {
  accent?: "wine" | "lilac";
}) {
  const accentBg = accent === "wine" ? "bg-wine/10" : "bg-lilac-dark/10";
  const accentText = accent === "wine" ? "text-wine" : "text-lilac-dark";
  const accentSolid = accent === "wine" ? "bg-wine" : "bg-lilac-dark";

  return (
    <section className="relative w-full py-24 overflow-hidden">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-7"
        >
          <p
            className={`text-[11px] uppercase tracking-[0.25em] ${accentText}`}
          >
            Proof
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            A quiet week.{" "}
            <span className="italic font-serif text-wine">
              Then a full calendar.
            </span>
          </h2>

          <div className={`rounded-[22px] p-6 relative ${accentBg}`}>
            <p className="text-charcoal/80 leading-relaxed">
              Santa, a massage therapist in Laguna Niguel, went from digital
              patchwork to a system that followed up, reminded clients, and
              protected her calendar. Inside 14 days, the system had paid for
              itself.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white ${accentSolid}`}
              >
                SE
              </div>
              <div>
                <p className="text-sm font-medium text-charcoal">Santa E.</p>
                <p className="text-xs text-charcoal/50">
                  Massage therapist · Laguna Niguel, CA
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              href="/book"
              variant={accent === "lilac" ? "lilac" : "primary"}
              className="px-6 py-3"
            >
              Book your free audit
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
