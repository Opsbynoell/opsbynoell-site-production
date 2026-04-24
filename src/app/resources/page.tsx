import Link from "next/link";
import CTA from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/resources",
  title: "Resources — Missed-Call Recovery and AI Front Desk for Service Businesses",
  description:
    "Short, honest reads for service-business owners: missed-call recovery, what a real AI front desk looks like, and how to stop losing booked appointments to 9 p.m. phone tag.",
});

type Resource = {
  title: string;
  excerpt: string;
  href?: string;
  kind: "Article" | "Case study" | "Roadmap";
  minutes?: string;
  status?: "live" | "coming";
};

const resources: Resource[] = [
  {
    kind: "Article",
    status: "live",
    title: "From missed calls to missed bookings",
    excerpt:
      "Warm intent cools off quietly. The leak between the first ring and the empty chair — and what a full front desk layer actually does about it.",
    href: "/resources/missed-calls-to-missed-bookings",
    minutes: "8 min",
  },
  {
    kind: "Article",
    status: "live",
    title: "AI front desk vs. answering service",
    excerpt:
      "An answering service takes messages. An AI front desk books appointments. Which one your numbers actually support, and when the answer is both.",
    href: "/resources/ai-front-desk-vs-answering-service",
    minutes: "6 min",
  },
  {
    kind: "Article",
    status: "live",
    title: "Rebooking and reactivation for med spas and massage",
    excerpt:
      "The biggest growth lever in a premium service business isn't new leads — it's the regulars who quietly stopped coming in. How to bring them back without sounding like a promo blast.",
    href: "/resources/rebooking-and-reactivation-for-med-spas-and-massage",
    minutes: "7 min",
  },
  {
    kind: "Article",
    status: "live",
    title: "Missed-call recovery for service businesses",
    excerpt:
      "Why the missed call is the most expensive lead you will ever own, and how a done-for-you AI front desk catches it before the next door opens.",
    href: "/resources/missed-call-recovery-for-service-businesses",
    minutes: "6 min",
  },
  {
    kind: "Article",
    status: "live",
    title: "AI front desk vs. human receptionist",
    excerpt:
      "What an AI front desk actually does, what it does not, and how it sits alongside the humans you already pay.",
    href: "/resources/ai-front-desk-vs-human-receptionist",
    minutes: "7 min",
  },
  {
    kind: "Case study",
    status: "live",
    title: "Santa E., massage therapist — $960 recovered in 14 days",
    excerpt:
      "How one solo massage therapist in Orange County recovered four missed calls and booked them inside two weeks of install.",
    href: "/case-studies/santa-e",
    minutes: "4 min",
  },
  {
    kind: "Roadmap",
    status: "coming",
    title: "Predictive Customer Intelligence for service businesses",
    excerpt:
      "How the Noell system is learning to see across your book — which regulars are drifting, when to reach out, and what is quietly shifting in your service mix. Long-form piece in progress, shipping alongside the intelligence layer rollout.",
    minutes: "Next drop",
  },
];

export default function ResourcesPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Resources", path: "/resources" },
        ])}
        id="resources"
      />
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-10 mx-auto flex-col items-center justify-center pt-28 md:pt-32 pb-12 md:pb-16 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.25)] via-[rgba(240,224,214,0.60)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
          Resources
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-tight">
          Short, honest reads for{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            service-business owners.
          </span>
        </h1>
        <p className="relative z-20 mt-5 max-w-2xl text-center text-charcoal/75 text-base md:text-lg leading-relaxed">
          Missed-call recovery, what a real AI front desk looks like, and how
          owners stop losing booked appointments to 9 p.m. phone tag.
        </p>
      </section>

      <section className="px-4 pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
          {resources.map((r, idx) => {
            const card = (
              <>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-wine mb-4">
                  {r.kind}
                  {r.minutes ? ` · ${r.minutes}` : ""}
                </p>
                <h2 className="font-serif text-2xl font-semibold text-charcoal mb-3 leading-snug">
                  {r.title}
                </h2>
                <p className="text-sm text-charcoal/70 leading-relaxed">
                  {r.excerpt}
                </p>
                <p
                  className={
                    r.status === "coming"
                      ? "mt-5 text-xs text-muted-strong font-medium"
                      : "mt-5 text-xs text-wine font-medium opacity-70 group-hover:opacity-100 transition-opacity"
                  }
                >
                  {r.status === "coming"
                    ? "Coming soon · watch this space"
                    : "Read it →"}
                </p>
              </>
            );
            if (r.href) {
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group block rounded-[22px] border border-warm-border bg-white p-7 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] hover:-translate-y-1 transition-transform"
                >
                  {card}
                </Link>
              );
            }
            return (
              <div
                key={`roadmap-${idx}`}
                aria-label={`${r.title} — coming soon`}
                className="block rounded-[22px] border border-dashed border-warm-border bg-cream-dark/60 p-7"
              >
                {card}
              </div>
            );
          })}
        </div>
      </section>

      <CTA
        eyebrow="Where we end up"
        headlineStart="Book a free audit"
        headlineAccent="when you are ready."
        body="Every resource on this site ends in the same place: the 30-minute audit where we map what is leaking and how to catch it."
        primaryCta={{ label: "Book Your Free Audit", href: "/book" }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · Live in 14 days · No contracts"
      />
    </div>
  );
}
