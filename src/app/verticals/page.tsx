import Link from "next/link";
import {
  IconDental,
  IconSparkles,
  IconScissors,
  IconHandStop,
  IconHeart,
  IconSnowflake,
} from "@tabler/icons-react";
import CTA from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/verticals",
  title:
    "Verticals — AI Front Desk for Dental, Med Spas, Salons, Massage, Estheticians, HVAC",
  description:
    "Ops by Noell is a done-for-you AI front desk for service businesses. Pick your vertical to see how the Noell system is shaped around the operational reality of your specific business.",
});

type Vertical = {
  slug: string;
  href: string;
  name: string;
  icon: React.ReactNode;
  tagline: string;
  description: string;
  status: "live" | "soon";
  proof: string;
};

type VerticalLink = Vertical & { ctaLabel: string };

const verticals: VerticalLink[] = [
  {
    slug: "dental",
    href: "/verticals/dental",
    name: "Dental Offices",
    icon: <IconDental size={24} />,
    tagline: "For general, family, cosmetic, and pediatric practices.",
    description:
      "Installed around your practice management software. Catches new patient calls in under 60 seconds and reactivates unscheduled treatment.",
    status: "live",
    proof: "New patient callback: under 60s",
    ctaLabel: "AI front desk for dental offices",
  },
  {
    slug: "med-spas",
    href: "/verticals/med-spas",
    name: "Med Spas",
    icon: <IconSparkles size={24} />,
    tagline: "For aesthetic and wellness practices.",
    description:
      "Warm intent cools off quietly. The Noell system catches inquiries without degrading your premium positioning, and books consultations while the lead is still warm.",
    status: "live",
    proof: "Consultation bookings, held warm",
    ctaLabel: "AI front desk for med spas",
  },
  {
    slug: "salons",
    href: "/verticals/salons",
    name: "Salons",
    icon: <IconScissors size={24} />,
    tagline: "For full-service hair and color salons.",
    description:
      "Built around stylists as individual revenue centers. Rebooking is the retention mechanic, and the Noell system protects it without adding front desk work.",
    status: "live",
    proof: "Rebook rate, measured per chair",
    ctaLabel: "AI front desk for salons",
  },
  {
    slug: "massage",
    href: "/verticals/massage",
    name: "Massage Therapy",
    icon: <IconHandStop size={24} />,
    tagline: "For solo and small-team massage practices.",
    description:
      "Built for the solo practitioner reality. No dead calendar days, no pushy outreach, no feeling like a salesperson on top of being a therapist.",
    status: "live",
    proof: "Missed-call recovery, live",
    ctaLabel: "Missed-call recovery for massage therapists",
  },
  {
    slug: "estheticians",
    href: "/verticals/estheticians",
    name: "Estheticians",
    icon: <IconHeart size={24} />,
    tagline: "For licensed estheticians and skincare studios.",
    description:
      "Facial, treatment, and membership flows handled with the quiet tone that matches a skincare brand. Retention-first, never pushy.",
    status: "live",
    proof: "Membership retention, protected",
    ctaLabel: "AI front desk for estheticians",
  },
  {
    slug: "hvac",
    href: "/verticals/hvac",
    name: "HVAC",
    icon: <IconSnowflake size={24} />,
    tagline: "For residential HVAC contractors.",
    description:
      "Service-type routing for emergency vs. scheduled calls. The Noell system triages urgency, captures the right info, and dispatches the right tech without turning your office into a call center.",
    status: "live",
    proof: "Emergency vs. scheduled, routed",
    ctaLabel: "AI front desk for HVAC contractors",
  },
];

export default function VerticalsHubPage() {
  return (
    <div>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Verticals", path: "/verticals" },
        ])}
        id="verticals-hub"
      />
      {/* Hero */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-20 mx-auto flex-col items-center justify-center pt-32 pb-20 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(106,44,62,0.45)] via-[rgba(240,228,232,0.70)] to-[rgba(250,245,240,1)]">
        <div className="relative z-20 flex items-center gap-2 mb-6">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/60">
            the noell system / verticals
          </p>
        </div>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-charcoal leading-tight">
          Built for your vertical,{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            not every vertical.
          </span>
        </h1>
        <p className="relative z-20 mt-6 max-w-2xl text-center text-charcoal/70 text-base md:text-lg leading-relaxed">
          Every vertical has its own operational reality. The Noell system
          ships with copy, cadences, routing, and integrations built for the
          one you actually run. Pick yours below.
        </p>
      </section>

      {/* Vertical cards grid */}
      <section className="w-full px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {verticals.map((v) => (
              <Link
                key={v.slug}
                id={v.slug}
                href={v.href}
                className="block h-full scroll-mt-32"
              >
                <div className="group relative rounded-[22px] border border-warm-border bg-white p-7 h-full flex flex-col transition-all duration-200 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] hover:-translate-y-1 hover:shadow-[0px_44px_24px_0px_rgba(28,25,23,0.06),0px_18px_18px_0px_rgba(28,25,23,0.08),0px_6px_10px_0px_rgba(28,25,23,0.06)]">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-wine/10 text-wine flex items-center justify-center">
                      {v.icon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
                        online
                      </span>
                    </div>
                  </div>

                  <h2 className="font-serif text-2xl font-semibold text-charcoal mb-1">
                    {v.name}
                  </h2>
                  <p className="text-xs text-wine/80 mb-4">{v.tagline}</p>
                  <p className="text-sm text-charcoal/65 leading-relaxed mb-6 flex-1">
                    {v.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-warm-border">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/50">
                      {v.proof}
                    </p>
                    <p className="text-xs text-wine font-medium opacity-70 group-hover:opacity-100 transition-opacity">
                      {v.ctaLabel} &rarr;
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <p className="text-center text-xs text-charcoal/50 mt-10 max-w-2xl mx-auto">
            Each page is built around the operational reality of that
            vertical. The install shapes the system further around your
            specific business. The audit is where we start.
          </p>
        </div>
      </section>

      <CTA
        eyebrow="Your vertical, or close to it?"
        headlineStart="Book a free audit"
        headlineAccent="and we will build the system around you."
        body="The audit is the same across verticals. We look at your missed-call flow, your booking process, and where your specific business is leaking leads."
        primaryCta={{ label: "Book Your Free Audit", href: "/book" }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · No contracts · Live in 14 days"
      />
    </div>
  );
}
