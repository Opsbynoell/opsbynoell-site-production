import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { Systems } from "@/components/systems";
import CTA from "@/components/cta";
import { PickYourPath } from "@/components/pick-your-path";
import { FullSystemFeatures } from "@/components/full-system-features";

export const metadata: Metadata = {
  title:
    "Ops by Noell | AI Agents + Full Operations Platform for Service Businesses",
  description:
    "Three AI agents, or the full white-labeled operations platform. Built for dental, med spas, salons, massage, estheticians, and HVAC. Live in 14 days.",
};

export default function Home() {
  return (
    <div>
      {/* 1. Hero */}
      <Hero
        headlineLine1Start="Three agents. One system."
        headlineLine1Accent=""
        headlineLine2Start="Never miss a call, text, confirmation, or reschedule."
        headlineLine2Accent=""
        headlineLine2Smaller
        body="Noell Support handles website chat 24/7. Noell Front Desk never misses a call, text, or confirmation. Noell Care takes reschedules and service questions. The system runs. You run the business."
        footnote=""
        primaryCta={{
          label: "Get Your Free Audit",
          href: "/book",
        }}
        secondaryCta={{
          label: "See how it works",
          href: "#systems",
        }}
      />

      {/* 2. Pick your path — two tracks (agents-only vs full system) */}
      <PickYourPath />

      {/* 3. What We Do — three agents, tight */}
      <Systems />

      {/* 4. What's in the full system — feature grid */}
      <FullSystemFeatures />

      {/* 5. Proof — one strong testimonial */}
      <Testimonials />

      {/* 6. Final CTA band */}
      <CTA
        eyebrow="The first step"
        headlineStart="Start with a"
        headlineAccent="free 30-minute audit."
        body="No pitch. No pressure. A clear map of where leads are falling through, whether you work with us or not."
        trustLine="Free · 30 minutes · Live in 14 days"
      />
    </div>
  );
}
