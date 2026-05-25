import Link from "next/link";
import { IconArrowRight, IconChartBar } from "@tabler/icons-react";
import CTA from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, servicePageSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/case-studies",
  title: "Case Studies, Real Client Results",
  description:
    "Real numbers from real service businesses. See how Ops by Noell clients recovered missed revenue, rebooked lost clients, and filled their calendars.",
});

const caseStudies = [
  {
    href: "/case-studies/santa-e",
    name: "Santa E.: Massage Therapist",
    result: "$960 recovered in 14 days",
    description:
      "A solo massage therapist in Orange County recovered four missed calls and rebooked them within 14 days of installing a done-for-you AI front desk.",
    vertical: "Massage Therapy",
    timeline: "14 days",
  },
];

export default function CaseStudiesPage() {
  return (
    <div>
      <JsonLd
        data={servicePageSchema({
          name: "Ops by Noell Case Studies",
          description:
            "Real results from service businesses using Ops by Noell done-for-you AI operations.",
          path: "/case-studies",
        })}
        id="case-studies-service"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/case-studies" },
        ])}
        id="case-studies-breadcrumb"
      />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#1F1219] pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-wine/70 font-medium mb-4">
            Case Studies
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-6">
            Real numbers from{" "}
            <em className="italic bg-gradient-to-r from-wine to-wine/70 bg-clip-text text-transparent">
              real businesses.
            </em>
          </h1>
          <p className="text-cream/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Every case study below is a real client, a real result, and a real
            timeline. No composites. No projections. Just what happened after
            Ops by Noell was installed.
          </p>
        </div>
      </section>

      {/* ─── CASE STUDY CARDS ─────────────────────────────────────────────── */}
      <section className="w-full bg-[#1F1219] pb-24 px-4">
        <div className="max-w-3xl mx-auto grid gap-4">
          {caseStudies.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start justify-between gap-4 p-6 rounded-2xl border border-white/10 bg-[#271520]/60 hover:bg-[#271520] hover:shadow-[0_4px_20px_-4px_rgba(92,45,62,0.12)] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-[#2A1520] flex items-center justify-center">
                  <IconChartBar size={18} className="text-wine" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-serif text-lg text-cream group-hover:text-wine transition-colors leading-snug">
                      {item.name}
                    </p>
                    <span className="text-xs uppercase tracking-widest text-wine/60 font-medium border border-wine/20 rounded-full px-2 py-0.5">
                      {item.vertical}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-wine mb-1">
                    {item.result}
                  </p>
                  <p className="text-sm text-cream/60 leading-relaxed">
                    {item.description}
                  </p>
                  <p className="text-xs text-cream/40 mt-2">
                    Timeline: {item.timeline}
                  </p>
                </div>
              </div>
              <IconArrowRight
                size={18}
                className="flex-shrink-0 mt-1 text-cream/30 group-hover:text-wine transition-colors"
              />
            </Link>
          ))}
        </div>

        {/* More coming soon note */}
        <div className="max-w-3xl mx-auto mt-8">
          <div className="rounded-2xl border border-white/10 bg-[#2A1520]/30 p-6 text-center">
            <p className="text-sm text-cream/60">
              More case studies are being documented as clients complete their
              first 30 days. Check back soon.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <CTA
        eyebrow="The first step"
        headlineStart="Find the revenue your booking software is"
        headlineAccent="missing."
        body="In your free Revenue Signal Report, we map the leaks in your front desk, booking flow, and follow-up system. You will know what is being missed, what it may be worth, and which Ops by Noell track fits."
        trustLine="No pitch. No pressure. If it is not a fit, we will say so."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "Read the Santa E. Case Study", href: "/case-studies/santa-e" }}
        sourcePage="case_studies"
      />
    </div>
  );
}
