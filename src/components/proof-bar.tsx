import { cn } from "@/lib/utils";

interface ProofBarProps {
  className?: string;
}

const rows = [
  {
    time: "09:14",
    action: "missed-call-recovery",
    sep: ">",
    result: "triggered",
  },
  {
    time: "09:14",
    action: "auto-reply sent",
    sep: "+",
    result: "lead engaged",
  },
  {
    time: "09:17",
    action: "appointment confirmed",
    sep: "+",
    result: "$960 recovered",
  },
];

export function ProofBar({ className }: ProofBarProps) {
  return (
    <div
      className={cn(
        "w-full max-w-xl mx-auto mt-8 md:mt-10",
        className
      )}
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-charcoal/60 text-center mb-3">
        case: santa_e &nbsp;/&nbsp; audit &gt; live
      </p>
      <div className="rounded-2xl bg-cream-dark border border-warm-border p-4 md:p-5">
        <ul className="font-mono text-xs md:text-sm space-y-1.5 text-left">
          {rows.map((row) => (
            <li key={`${row.time}-${row.action}`} className="flex items-baseline gap-2 md:gap-3">
              <span className="text-charcoal/50 tabular-nums">{row.time}</span>
              <span className="text-wine font-semibold">{row.action}</span>
              <span className="text-charcoal/30">{row.sep}</span>
              <span className="text-charcoal">{row.result}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
