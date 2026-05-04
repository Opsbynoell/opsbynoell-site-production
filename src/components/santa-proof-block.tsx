import { cn } from "@/lib/utils";

interface SantaProofBlockProps {
  className?: string;
}

/**
 * Homepage social proof block (copy pack Section 5).
 * Editorial card on cream, max-w-2xl. Wine accent on the recovered-revenue
 * figure. No quote marks, no testimonial schema, no aggregateRating. The
 * copy is operational, not endorsement language.
 */
export function SantaProofBlock({ className }: SantaProofBlockProps) {
  return (
    <section className={cn("w-full px-4 py-14 md:py-16", className)}>
      <div className="mx-auto max-w-2xl rounded-[22px] border border-warm-border bg-cream-dark p-7 md:p-10">
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
          Case study · Healing Hands by Santa · Laguna Niguel, CA
        </p>
        <p className="font-serif text-xl md:text-2xl text-charcoal leading-snug mb-5">
          Santa, owner of Healing Hands by Santa, has been a licensed massage
          therapist for 25 years. Before Ops by Noell, her phone went quiet
          every time she was with a client. No one followed up. Clients
          booked elsewhere.
        </p>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">4</p>
            <p className="text-[11px] text-charcoal/70 mt-1 uppercase tracking-wide">missed calls<br/>recovered</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">$960</p>
            <p className="text-[11px] text-charcoal/70 mt-1 uppercase tracking-wide">recovered<br/>in 14 days</p>
          </div>
          <div className="text-center">
            <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">75%</p>
            <p className="text-[11px] text-charcoal/70 mt-1 uppercase tracking-wide">fewer<br/>no-shows</p>
          </div>
        </div>
        <blockquote className="border-l-2 border-wine/40 pl-4">
          <p className="text-sm md:text-base text-charcoal/80 italic leading-relaxed">
            “I used to dread Mondays because there would always be gaps I didn’t expect.
            Now I open my calendar and it’s just full. The reminders go out and people show up.
            I don’t think about it anymore.”
          </p>
          <footer className="mt-3 text-[11px] uppercase tracking-[0.2em] text-charcoal/80">
            Santa E. · Licensed Massage Therapist · Laguna Niguel CA
          </footer>
        </blockquote>
      </div>
    </section>
  );
}
