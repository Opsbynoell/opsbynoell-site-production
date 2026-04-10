"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { caseStudySection } from "@/content/home";
import { ROUTES } from "@/lib/constants";

// ─── Case Study — Card Spotlight pattern ──────────────────────────────────────
export function CaseStudySection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState({ x: 50, y: 0 });
  const [hovered, setHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <section className="bg-[#FFF7F4] py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6664] mb-4 text-center">
            {caseStudySection.eyebrow}
          </p>

          {/* Card Spotlight — spotlight follows mouse */}
          <div
            ref={cardRef}
            className="relative rounded-3xl bg-white border border-[#EDE3DE] p-8 md:p-10 overflow-hidden shadow-[0_2px_16px_rgba(31,26,26,0.06)] hover:shadow-[0_8px_32px_rgba(31,26,26,0.1)] transition-shadow duration-300 cursor-default"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Mouse-tracking spotlight gradient */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-500"
              style={{
                opacity: hovered ? 1 : 0,
                background: `radial-gradient(520px circle at ${spot.x}% ${spot.y}%, rgba(106,44,62,0.045) 0%, transparent 60%)`,
              }}
              aria-hidden
            />

            {/* Left accent bar */}
            <div className="absolute left-0 top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#F0E4E8] via-[#6A2C3E]/30 to-[#F0E4E8] rounded-full" />

            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F1A1A] tracking-tight">
              {caseStudySection.headline}
            </h2>
            <p className="mt-3 text-base text-[#6D6664] leading-relaxed max-w-2xl">
              {caseStudySection.subhead}
            </p>

            {/* Before / After */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-[#FAF5F0] border border-[#EDE3DE] p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6664] mb-2">
                  Before
                </p>
                <p className="text-sm leading-relaxed text-[#6D6664]">
                  {caseStudySection.before}
                </p>
              </div>
              <div className="rounded-xl bg-[#F0E4E8] border border-[#6A2C3E]/15 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#6A2C3E] mb-2">
                  After
                </p>
                <p className="text-sm leading-relaxed text-[#1F1A1A]">
                  {caseStudySection.after}
                </p>
              </div>
            </div>

            {/* Metrics */}
            <ul className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
              {caseStudySection.metrics.map((metric) => (
                <li
                  key={metric}
                  className="flex items-center gap-2 rounded-full bg-[#6A2C3E]/8 px-4 py-2 text-sm font-medium text-[#6A2C3E]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6A2C3E]" />
                  {metric}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-8">
              <Link
                href={ROUTES.systems}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#6A2C3E] hover:text-[#5a2233] transition-colors group"
              >
                {caseStudySection.cta}
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-150 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
