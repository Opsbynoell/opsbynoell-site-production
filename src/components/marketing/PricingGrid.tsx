import Link from "next/link";
import { pricingGrid } from "@/content/pricing";
import { ROUTES } from "@/lib/constants";

export function PricingGrid() {
  return (
    <section className="py-16 md:py-20 bg-[#FAFAF9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-10 text-center">
          {pricingGrid.headline}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {pricingGrid.tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border p-7 flex flex-col ${
                tier.isPopular
                  ? "bg-white border-[#E8604C] shadow-md ring-1 ring-[#E8604C]/20"
                  : "bg-white border-[#E8E8E8]"
              }`}
            >
              {/* Popular badge */}
              {tier.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E8604C] px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              )}

              {/* Tier name */}
              <h3 className="text-lg font-bold text-[#1A1A1A]">{tier.name}</h3>

              {/* Price */}
              <div className="mt-3">
                <span className="text-3xl font-bold text-[#1A1A1A]">
                  ${tier.monthlyPrice}
                </span>
                <span className="text-sm text-[#717171]">/mo</span>
                <p className="text-xs text-[#717171] mt-0.5">
                  + ${tier.setupFee} setup
                </p>
              </div>

              {/* Best for */}
              <p className="mt-3 text-xs text-[#717171] leading-relaxed border-t border-[#F0F0F0] pt-3">
                Best for: {tier.bestFor}
              </p>

              {/* Features */}
              <ul className="mt-4 flex flex-col gap-2 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-[#4A4A4A]">
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-[#E8604C]/10 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E8604C]" />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={ROUTES.book}
                className={`mt-6 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  tier.isPopular
                    ? "bg-[#E8604C] text-white hover:bg-[#d94f3b]"
                    : "border border-[#E8E8E8] text-[#1A1A1A] hover:border-[#1A1A1A]"
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
