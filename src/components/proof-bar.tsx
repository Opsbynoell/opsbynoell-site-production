import { cn } from "@/lib/utils";

interface ProofBarProps {
  className?: string;
}

const stats = [
  { value: "$960", label: "Recovered in 14 days" },
  { value: "4.9\u2605", label: "Across 40+ reviews" },
  { value: "14d", label: "To go live" },
];

export function ProofBar({ className }: ProofBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 md:gap-12 mt-8 md:mt-10",
        className
      )}
    >
      {stats.map((stat, i) => (
        <div key={stat.label} className="flex items-center gap-4 md:gap-12">
          {i > 0 && (
            <span
              aria-hidden
              className="hidden md:inline-block w-px h-10 bg-current opacity-20"
            />
          )}
          <div className="text-center md:text-left">
            <div className="font-serif text-xl md:text-3xl text-charcoal">
              {stat.value}
            </div>
            <div className="text-[10px] md:text-xs uppercase tracking-wider text-charcoal/60">
              {stat.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
