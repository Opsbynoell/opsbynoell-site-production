import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { Systems } from "@/components/systems";
import CTA from "@/components/cta";
import { PickYourPath } from "@/components/pick-your-path";
import { FullSystemFeatures } from "@/components/full-system-features";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { servicePageSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/",
  title:
    "Ops by Noell | Done-for-You AI Front Desk for Service Businesses",
  description:
    "Three AI agents, or the full managed operations layer. Built for dental, med spas, salons, massage, estheticians, and HVAC. Live in 14 days.",
  ogTitle:
    "By the time you call back, they've already booked somewhere else.",
  ogDescription:
    "Done-for-you AI operations for local service businesses. Never miss a call, text, confirmation, or reschedule.",
});

export default function Home() {
  return (
    <div>
      <JsonLd
        data={servicePageSchema({
          name: "The Noell System — Done-for-You AI Front Desk",
          description:
            "A done-for-you AI front desk and operations layer for service businesses. Three managed agents cover new-prospect intake, calls and scheduling, and existing-client support.",
          path: "/",
        })}
        id="home-service"
      />
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
