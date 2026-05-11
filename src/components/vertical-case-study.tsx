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

export function VerticalCaseStudyPlaceholder({ vertical }: PlaceholderProps) {
  /* TODO: replace with real case study from Nikki */
  return (
    <section className="my-16 md:my-24 px-4">
      <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-white/10 bg-[#301A26]/50 p-8 md:p-12 text-center">
        <div className="text-xs uppercase tracking-widest text-cream/70 mb-3">
          Case study
        </div>
        <p className="font-serif text-xl md:text-2xl text-cream/70 leading-snug">
          Coming soon: a {vertical} case study.
        </p>
        <p className="mt-3 text-sm text-cream/70">
          We&apos;re running live installs right now. Real numbers land here when they do.
        </p>
      </div>
    </section>
  );
}
