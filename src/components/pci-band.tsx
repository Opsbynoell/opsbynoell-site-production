import { cn } from "@/lib/utils";

interface PciBandProps {
  className?: string;
}

/**
 * Predictive Customer Intelligence homepage band (copy pack Section 11).
 * Full-width cream band, wine headline, charcoal body. Editorial tone.
 * No SaaS-grid feature tiles. No infrastructure language. PCI is described
 * as an outcome layer only.
 */
export function PciBand({ className }: PciBandProps) {
  return (
    <section className={cn("w-full bg-[#301A26] py-16 md:py-20", className)}>
      <div className="mx-auto max-w-3xl px-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
          Predictive Customer Intelligence
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-wine leading-tight">
          Your front desk does more than answer. It watches.
        </h2>
        <p className="mt-6 text-base md:text-lg text-cream/85 leading-relaxed">
          Every call, text, booking, cancellation, and silence at your front
          desk is a signal. Most service businesses never look at them. Ops by
          Noell reads them every day and shows you who needs attention next
          before the revenue leaks out. No dashboard you have to learn. No
          report you have to chase. The right follow-up, surfaced at the right
          time, already wired to the front desk that handles it.
        </p>
        <p className="mt-8 font-serif italic text-lg md:text-xl text-cream">
          We do not just recover the call. We recover the client who was going
          to quietly disappear.
        </p>
      </div>
    </section>
  );
}
