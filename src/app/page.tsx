import { Hero } from "@/components/hero";
import { LogoCloud } from "@/components/logos-cloud";
import { Features } from "@/components/features";
import { Features2 } from "@/components/features2";
import { FounderQuote } from "@/components/founder-quote";
import { Systems } from "@/components/systems";
import { Features3 } from "@/components/features3";
import Pricing from "@/components/pricing";
import { Testimonials } from "@/components/testimonials";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";

export default function Home() {
  return (
    <div>
      {/* Recognition */}
      <Hero />

      {/* Founder presence, trust microcopy */}
      <FounderQuote />

      {/* Trust, who it's for */}
      <LogoCloud />

      {/* Proof, operational stats */}
      <Features />

      {/* Tension, the real problem */}
      <Features2 />

      {/* The Noell system, 3-agent product section */}
      <Systems />

      {/* Relief, what changes */}
      <Features3 />

      {/* Pricing, honest packages */}
      <Pricing />

      {/* Proof, case study */}
      <Testimonials />

      {/* FAQ */}
      <FAQ />

      {/* Action */}
      <CTA />
    </div>
  );
}
