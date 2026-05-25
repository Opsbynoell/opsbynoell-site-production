type Metric = { label: string; value: string };

type Props = {
  quote: string;
  name: string;
  role: string;
  business: string;
  metrics: Metric[];
  eyebrow?: string;
};

export function VerticalCaseStudy({
  quote,
  name,
  role,
  business,
  metrics,
  eyebrow = "One install",
}: Props) {
  return (
    <section className="my-16 md:my-24 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-[#301A26] p-8 md:p-12">
        <div className="text-xs uppercase tracking-widest text-cream/70 mb-4">
          {eyebrow}
        </div>
        <blockquote className="font-serif text-2xl md:text-3xl leading-snug text-cream mb-6">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <div className="text-sm text-cream/80 mb-8">
          <strong>{name}</strong>, {role}. {business}.
        </div>
        <div className="flex gap-8 flex-wrap">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="font-serif text-2xl text-cream">{m.value}</div>
              <div className="text-xs uppercase tracking-wider text-cream/70">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

type PlaceholderProps = {
  vertical: string;
};

// Until each vertical has its own case study, render a real install (Healing
// Hands by Santa, a wellness/massage business) so visitors see actual numbers
// instead of "coming soon."
export function VerticalCaseStudyPlaceholder({ vertical }: PlaceholderProps) {
  return (
    <section className="my-16 md:my-24 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl bg-[#301A26] p-8 md:p-12">
        <div className="text-xs uppercase tracking-widest text-cream/70 mb-4">
          From one live install (we don&apos;t have a {vertical} case study published yet)
        </div>
        <blockquote className="font-serif text-2xl md:text-3xl leading-snug text-cream mb-6">
          &ldquo;The text came in at 7:50 in the morning. By 7:51 the slot was filled and we&apos;d recovered the booking. We didn&apos;t touch a thing.&rdquo;
        </blockquote>
        <div className="text-sm text-cream/80 mb-8">
          <strong>Santa</strong>, owner. Healing Hands by Santa, Mission Viejo, CA.
        </div>
        <div className="flex gap-8 flex-wrap">
          <div>
            <div className="font-serif text-2xl text-cream">$960</div>
            <div className="text-xs uppercase tracking-wider text-cream/70">
              Recovered in first month
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl text-cream">&lt; 60 sec</div>
            <div className="text-xs uppercase tracking-wider text-cream/70">
              Missed-call → text-back
            </div>
          </div>
          <div>
            <div className="font-serif text-2xl text-cream">14 days</div>
            <div className="text-xs uppercase tracking-wider text-cream/70">
              From audit to live
            </div>
          </div>
        </div>
        <p className="mt-8 text-xs text-cream/60">
          Read the full case study:{" "}
          <a
            href="/case-studies/santa-e"
            className="text-cream underline underline-offset-4 decoration-cream/30 hover:decoration-cream"
          >
            Healing Hands by Santa &rarr;
          </a>
        </p>
      </div>
    </section>
  );
}
