import Link from "next/link";
import { caseStudySection } from "@/content/home";
import { ROUTES } from "@/lib/constants";
import { SectionShell } from "@/components/layout/SectionShell";

export function CaseStudySection() {
  return (
    <SectionShell className="bg-[#FAFAF9]">
      <div className="max-w-4xl mx-auto">
        {/* Eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-widest text-[#E8604C] mb-4 text-center">
          {caseStudySection.eyebrow}
        </p>

        {/* Card Spotlight — spotlight effect via CSS radial gradient on hover */}
        <div className="group relative rounded-3xl bg-white border border-[#E8E8E8] p-8 md:p-10 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          {/* Subtle background highlight */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background:
                "radial-gradient(600px circle at 50% 0%, rgba(232,96,76,0.04) 0%, transparent 70%)",
            }}
          />

          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {caseStudySection.headline}
          </h2>
          <p className="mt-3 text-base text-[#4A4A4A] leading-relaxed max-w-2xl">
            {caseStudySection.subhead}
          </p>

          {/* Before / After */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-[#FAFAF9] border border-[#F0F0F0] p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#717171] mb-2">
                Before
              </p>
              <p className="text-sm leading-relaxed text-[#4A4A4A]">
                {caseStudySection.before}
              </p>
            </div>
            <div className="rounded-xl bg-[#FFF0F5] border border-[#E8604C]/15 p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#E8604C] mb-2">
                After
              </p>
              <p className="text-sm leading-relaxed text-[#4A4A4A]">
                {caseStudySection.after}
              </p>
            </div>
          </div>

          {/* Metrics */}
          <ul className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3">
            {caseStudySection.metrics.map((metric) => (
              <li
                key={metric}
                className="flex items-center gap-2 rounded-full bg-[#E8604C]/8 px-4 py-2 text-sm font-medium text-[#E8604C]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8604C]" />
                {metric}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-8">
            <Link
              href={ROUTES.services}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#E8604C] hover:text-[#d94f3b] transition-colors"
            >
              {caseStudySection.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
