import { problemSection } from "@/content/home";
import { SectionShell } from "@/components/layout/SectionShell";

export function ProblemSection() {
  return (
    <SectionShell className="bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {problemSection.headline}
          </h2>
          <p className="mt-3 text-base text-[#4A4A4A] leading-relaxed">
            {problemSection.subhead}
          </p>
        </div>

        {/* Problem slides — vertical stack on mobile, clean card list */}
        <ol className="flex flex-col gap-6">
          {problemSection.slides.map((slide, i) => (
            <li
              key={slide.title}
              className="flex gap-4 rounded-2xl border border-[#F0F0F0] bg-[#FAFAF9] p-6"
            >
              {/* Number */}
              <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E8604C]/10 flex items-center justify-center text-xs font-bold text-[#E8604C]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-base font-semibold text-[#1A1A1A]">
                  {slide.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#4A4A4A]">
                  {slide.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Closing reframe */}
        <p className="mt-8 text-center text-sm font-medium text-[#4A4A4A] bg-[#FFF0F5] rounded-xl px-6 py-4 border border-[#E8604C]/10">
          {problemSection.closingLine}
        </p>
      </div>
    </SectionShell>
  );
}
