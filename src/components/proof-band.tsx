const stats = [
  {
    number: "$960",
    label: "revenue recovered per week",
    timestamp: "Last 7 days",
  },
  {
    number: "4×",
    label: "review growth in 90 days",
    timestamp: "Since activation",
  },
  {
    number: "0",
    label: "no-shows after system launch",
    timestamp: "30-day average",
  },
  {
    number: "14",
    suffix: " days",
    label: "from audit to fully operational",
    timestamp: "Median client",
  },
];

export function ProofBand() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {stats.map((stat, i) => (
        <div
          key={stat.label}
          className="relative border-l-2 border-wine/20 pl-5 py-2"
          style={{ transform: `rotate(${i % 2 === 0 ? -0.5 : 0.5}deg)` }}
        >
          <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30 block mb-2">
            {stat.timestamp}
          </span>
          <div className="font-mono text-4xl md:text-5xl text-wine tracking-tight">
            {stat.number}
            {stat.suffix && (
              <span className="text-2xl md:text-3xl">{stat.suffix}</span>
            )}
          </div>
          <p className="text-sm text-charcoal/50 leading-relaxed mt-2">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
