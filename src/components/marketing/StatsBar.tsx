import { statsSection } from "@/content/home";

// Context refs per stat
const statContext = [
  { ref: "case · santa_m",     window: "14d window" },
  { ref: "google · verified",  window: "8wk window" },
  { ref: "avg · post-deploy",  window: "ongoing"    },
  { ref: "audit → live",       window: "avg deploy" },
];

export function StatsBar() {
  return (
    <section className="bg-[#FFF7F4] border-y border-[#EDE3DE] py-14 md:py-20 relative grain-overlay overflow-hidden">
      {/* Subtle warm radial */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-48 opacity-30"
        style={{ background: "radial-gradient(ellipse, #F0E4E8 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6664] mb-2">
            Real Outcomes
          </p>
          <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F1A1A] tracking-tight">
            {statsSection.headline}
          </h2>
          <p className="mt-1 text-sm text-[#6D6664]">{statsSection.supportingLine}</p>
        </div>

        {/* Bento stats grid — featured first + 3 supporting */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {statsSection.stats.map((stat, i) => {
            const ctx = statContext[i];
            const isFeatured = i === 0;
            return (
              <div
                key={stat.label}
                className={`window-frame flex flex-col ${
                  isFeatured ? "md:col-span-2 bg-[#F0E4E8]" : "bg-white"
                }`}
              >
                {/* Metric window chrome */}
                <div className="window-bar py-1.5">
                  <span className="window-dot-close" />
                  <span className="window-dot-min" />
                  <span className="window-dot-expand" />
                  <span className="window-label">{ctx.window}</span>
                </div>
                {/* Value */}
                <div className={`flex flex-col flex-1 ${isFeatured ? "p-6 md:p-8" : "p-5 items-center text-center"}`}>
                  <dt className={`font-display font-bold text-[#6A2C3E] leading-none tabular-nums ${
                    isFeatured ? "text-5xl md:text-6xl" : "text-3xl md:text-4xl"
                  }`}>
                    {stat.value}
                  </dt>
                  <dd className={`mt-2 text-[10px] font-semibold uppercase tracking-widest text-[#6D6664] ${
                    isFeatured ? "" : ""
                  }`}>
                    {stat.label}
                  </dd>
                  <span className="log-ts mt-2 block">{ctx.ref}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing line */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <span className="block h-px w-8 bg-[#EDE3DE]" />
          <p className="log-line text-[#6D6664] text-center">{statsSection.closingLine}</p>
          <span className="block h-px w-8 bg-[#EDE3DE]" />
        </div>
      </div>
    </section>
  );
}
