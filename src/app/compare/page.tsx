import Link from "next/link";
import {
  IconArrowRight,
  IconScale,
} from "@tabler/icons-react";
import CTA from "@/components/cta";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, servicePageSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/compare",
  absoluteTitle: true,
  title: "Compare AI Front Desk Alternatives",
  description:
    "Side-by-side comparisons of Ops by Noell against the most common alternatives. See how setup, voice fit, retention, and management stack up.",
});

const comparisons = [
  {
    href: "/compare/my-ai-front-desk",
    name: "Ops by Noell vs. My AI Front Desk",
    description:
      "Done-for-you managed operations versus a self-serve AI receptionist platform. Setup model, voice fit, and what happens after go-live.",
  },
  {
    href: "/compare/podium",
    name: "Ops by Noell vs. Podium",
    description:
      "Full-stack AI operations versus a messaging and review platform. What each one actually covers for a service business.",
  },
  {
    href: "/compare/diy-ai-receptionist",
    name: "Ops by Noell vs. DIY AI Receptionist",
    description:
      "Managed installation versus building and maintaining your own AI front desk. Time cost, voice quality, and ongoing tuning.",
  },
  {
    href: "/compare/human-answering-services",
    name: "Ops by Noell vs. Human Answering Services",
    description:
      "AI-powered operations versus a live answering service. Speed, consistency, cost, and what happens at 11 PM on a Sunday.",
  },
  {
    href: "/compare/local-business-messaging-platforms",
    name: "Ops by Noell vs. Local Business Messaging Platforms",
    description:
      "Done-for-you AI operations versus a self-managed messaging tool. Coverage, retention, and what requires your attention.",
  },
  {
    href: "/compare/ai-front-desk-alternatives",
    name: "AI Front Desk Alternatives: Full Comparison",
    description:
      "A complete look at the AI front desk landscape for service businesses. What to look for, what to avoid, and how Ops by Noell fits.",
  },
];

export default function ComparePage() {
  return (
    <div>
      <JsonLd
        data={servicePageSchema({
          name: "Compare Ops by Noell",
          description:
            "Side-by-side comparisons of Ops by Noell against the most common alternatives for service businesses.",
          path: "/compare",
        })}
        id="compare-service"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
        ])}
        id="compare-breadcrumb"
      />

      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="w-full bg-[#1F1219] pt-32 pb-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-wine/70 font-medium mb-4">
            Comparisons
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-cream leading-tight mb-6">
            How Ops by Noell compares to{" "}
            <em className="italic bg-gradient-to-r from-wine to-wine/70 bg-clip-text text-transparent">
              the alternatives.
            </em>
          </h1>
          <p className="text-cream/70 text-lg leading-relaxed max-w-2xl mx-auto">
            Every comparison below is written for service business owners who are
            evaluating their options honestly. No hype. Just what each tool
            actually covers, what it leaves out, and where Ops by Noell fits.
          </p>
        </div>
      </section>

      {/* ─── COMPARISON CARDS ─────────────────────────────────────────────── */}
      <section className="w-full bg-[#1F1219] pb-24 px-4">
        <div className="max-w-3xl mx-auto grid gap-4">
          {comparisons.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start justify-between gap-4 p-6 rounded-2xl border border-white/10 bg-[#271520]/60 hover:bg-[#271520] hover:shadow-[0_4px_20px_-4px_rgba(92,45,62,0.12)] transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0 w-9 h-9 rounded-xl bg-[#2A1520] flex items-center justify-center">
                  <IconScale size={18} className="text-wine" />
                </div>
                <div>
                  <p className="font-serif text-lg text-cream group-hover:text-wine transition-colors leading-snug mb-1">
                    {item.name}
                  </p>
                  <p className="text-sm text-cream/60 leading-relaxed">
                    {item.description}
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
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────────────── */}
      <CTA
        eyebrow="The first step"
        headlineStart="Find the revenue your booking software is"
        headlineAccent="missing."
        body="In your free Revenue Signal Report, we map the leaks in your front desk, booking flow, and follow-up system. You will know what is being missed, what it may be worth, and which Ops by Noell track fits."
        trustLine="No pitch. No pressure. If it is not a fit, we will say so."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See Pricing", href: "/pricing" }}
        sourcePage="compare_index"
      />
    </div>
  );
}
