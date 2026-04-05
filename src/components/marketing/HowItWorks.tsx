import { howItWorksSection } from "@/content/services";
import { SectionShell } from "@/components/layout/SectionShell";

export function HowItWorks() {
  return (
    <SectionShell className="bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight">
            {howItWorksSection.headline}
          </h2>
        </div>

        <ol className="flex flex-col gap-6">
          {howItWorksSection.steps.map((step) => (
            <li key={step.number} className="flex gap-5 items-start">
              {/* Step number */}
              <span className="flex-shrink-0 w-10 h-10 rounded-full border-2 border-[#E8604C]/20 bg-[#FFF0F5] flex items-center justify-center text-sm font-bold text-[#E8604C]">
                {step.number}
              </span>
              <div className="pt-1.5">
                <h3 className="text-base font-semibold text-[#1A1A1A]">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#4A4A4A]">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <p className="mt-8 text-center text-sm font-medium text-[#717171]">
          {howItWorksSection.supportingLine}
        </p>
      </div>
    </SectionShell>
  );
}
