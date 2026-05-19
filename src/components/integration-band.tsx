import { cn } from "@/lib/utils";

interface IntegrationBandProps {
  className?: string;
}

/**
 * PMS and booking integration band (copy pack Section 4).
 * Plain text only in this PR. Logo marquee is a deferred follow-up.
 * Headline + body + footnote. Place between PickYourPath and ROICalculator.
 */
export function IntegrationBand({ className }: IntegrationBandProps) {
  return (
    <section className={cn("w-full px-4 py-14 md:py-16", className)}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
          Integration
        </p>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream leading-tight">
          Built around the booking workflows you already use.
        </h2>
        <p className="mt-5 text-base text-cream/80 leading-relaxed">
          Designed to support service businesses across salons, spas, dental,
          and wellness, using whichever booking or practice management
          software you already run. Your booking system stays the system of
          record. We build the front desk layer around it and run it every
          day.
        </p>
        <p className="mt-5 text-xs text-muted-strong leading-relaxed max-w-2xl mx-auto">
          We are an independent service provider and are not affiliated with,
          endorsed by, or a certified partner of any specific scheduling or
          practice management platform. We design the front desk layer around
          the booking workflows your software supports. Tell us what you use
          on the working call and we will confirm fit.
        </p>
      </div>
    </section>
  );
}
