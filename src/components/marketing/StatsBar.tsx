import { statsSection } from "@/content/home";

export function StatsBar() {
  return (
    <section className="bg-white border-y border-[#F0F0F0] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Headlines */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-[#1A1A1A] tracking-tight">
            {statsSection.headline}
          </h2>
          <p className="mt-1 text-sm text-[#717171]">{statsSection.supportingLine}</p>
        </div>

        {/* Stats grid */}
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {statsSection.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-4"
            >
              <dt className="text-3xl md:text-4xl font-bold text-[#E8604C] tracking-tight">
                {stat.value}
              </dt>
              <dd className="mt-1 text-xs font-medium uppercase tracking-wider text-[#717171]">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>

        {/* Closing line */}
        <p className="mt-8 text-center text-sm text-[#717171]">
          {statsSection.closingLine}
        </p>
      </div>
    </section>
  );
}
