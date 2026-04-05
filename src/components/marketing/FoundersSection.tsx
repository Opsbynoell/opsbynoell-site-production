import { foundersSection } from "@/content/home";
import { SectionShell } from "@/components/layout/SectionShell";

export function FoundersSection() {
  return (
    <SectionShell className="bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {foundersSection.headline}
          </h2>
          <p className="mt-3 text-base text-[#4A4A4A] leading-relaxed max-w-2xl">
            {foundersSection.subhead}
          </p>
        </div>

        {/* Value cards — 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {foundersSection.valueCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[#E8E8E8] bg-[#FAFAF9] p-6"
            >
              <h3 className="text-sm font-semibold text-[#1A1A1A]">
                {card.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#4A4A4A]">
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
