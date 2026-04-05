import Link from "next/link";
import { novaVsFullSystem } from "@/content/nova";
import { ROUTES } from "@/lib/constants";
import { SectionShell } from "@/components/layout/SectionShell";

export function CompareCards() {
  return (
    <SectionShell className="bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-8 text-center">
          {novaVsFullSystem.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {novaVsFullSystem.options.map((option) => (
            <div
              key={option.label}
              className="rounded-2xl border border-[#7C5CFC]/20 bg-[#F9F7FF] p-7"
            >
              <h3 className="text-sm font-semibold text-[#7C5CFC]">
                {option.label}
              </h3>
              <div className="mt-2">
                <span className="text-2xl font-bold text-[#1A1A1A]">
                  ${option.monthlyPrice}
                </span>
                <span className="text-sm text-[#717171]">/mo</span>
                <span className="ml-2 text-xs text-[#717171]">
                  + ${option.setupFee} setup
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#4A4A4A]">
                {option.bestFor}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href={ROUTES.pricing}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#7C5CFC] hover:text-[#6b4de8] transition-colors"
          >
            {novaVsFullSystem.cta}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
