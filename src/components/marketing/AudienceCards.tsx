import { audienceSection } from "@/content/home";
import { SectionShell } from "@/components/layout/SectionShell";

export function AudienceCards() {
  return (
    <SectionShell className="bg-[#FAFAF9]">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">
          {audienceSection.headline}
        </h2>
        <p className="mt-3 text-base text-[#4A4A4A] max-w-2xl mx-auto leading-relaxed">
          {audienceSection.subhead}
        </p>
      </div>

      {/* Bento-style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {audienceSection.cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-2xl bg-white border border-[#E8E8E8] p-6 hover:border-[#E8604C]/30 hover:shadow-sm transition-all duration-200"
          >
            <h3 className="text-base font-semibold text-[#1A1A1A]">
              {card.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#4A4A4A]">
              {card.body}
            </p>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
