import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { Systems } from "@/components/systems";
import CTA from "@/components/cta";

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

      {/* 2. What We Do — three agents, tight */}
      <Systems />

      {/* 3. Proof — one strong testimonial */}
      <Testimonials />

      {/* 4. Final CTA band */}
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
