import { statsSection } from "@/content/home";

// Mono log context for each stat — gives system-proof treatment
const statContext = [
  { window: "14d window", ref: "case · santa_m" },
  { window: "8wk window", ref: "google · verified" },
  { window: "ongoing",    ref: "avg · post-deploy" },
  { window: "avg deploy", ref: "from audit → live" },
];

export function StatsBar() {
  return (
    <section className="bg-[#FFF7F4] border-y border-[#EDE3DE] py-12 md:py-16 relative grain-overlay overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-semibold text-[#1F1A1A] tracking-tight">
            {statsSection.headline}
          </h2>
          <p className="mt-1 text-sm text-[#6D6664]">{statsSection.supportingLine}</p>
        </div>

        {/* Stats grid — system log card treatment */}
        <dl className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {statsSection.stats.map((stat, i) => {
            const ctx = statContext[i];
            return (
              <div
                key={stat.label}
                className="window-frame p-0 flex flex-col"
              >
                {/* Metric window chrome */}
                <div className="window-bar py-1.5">
                  <span className="window-dot-close" />
                  <span className="window-dot-min" />
                  <span className="window-dot-expand" />
                  <span className="window-label">{ctx.window}</span>
                </div>
                {/* Value */}
                <div className="p-4 flex flex-col items-center text-center flex-1">
                  <dt className="font-display text-3xl md:text-4xl font-bold text-[#6A2C3E] leading-none tabular-nums">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-[#6D6664]">
                    {stat.label}
                  </dd>
                  <span className="log-ts mt-2 block">{ctx.ref}</span>
                </div>
              </div>
            );
          })}
        </dl>

        {/* Closing line — styled as a system event */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="block h-px w-8 bg-[#EDE3DE]" />
          <p className="log-line text-[#6D6664] text-center">{statsSection.closingLine}</p>
          <span className="block h-px w-8 bg-[#EDE3DE]" />
        </div>
      </div>
    </section>
  );
}
