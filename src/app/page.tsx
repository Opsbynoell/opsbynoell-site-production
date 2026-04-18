import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { FounderQuote } from "@/components/founder-quote";
import { Features2 } from "@/components/features2";
import { LogoCloud } from "@/components/logos-cloud";
import { Testimonials } from "@/components/testimonials";
import { Systems } from "@/components/systems";
import { NoellSupportSpotlight } from "@/components/noell-support-spotlight";
import { Features3 } from "@/components/features3";
import Pricing from "@/components/pricing";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";

export default function Home() {
  return (
    <div>
      {/* 1. Hero (Recognition) */}
      <Hero
        headlineLine1Start="Meet"
        headlineLine1Accent="Noell."
        headlineLine2Start="Your AI"
        headlineLine2Accent="support team."
        body="The Noell System — AI support for appointment-based businesses. Three roles, one system."
      />

      {/* 2. Social proof bar, credibility numbers */}
      <Features />

      {/* 3. Founder presence */}
      <FounderQuote />

      {/* 4. Problem, Pain (with 85% stat callout) */}
      <Features2 />

      {/* 6. Who This Is For, vertical identity cards */}
      <LogoCloud />

      {/* 7. Case Study, moved up before the Agent Roster */}
      <Testimonials />

      {/* 8. Agent Roster, three Noell agents as a buddy list */}
      <Systems />

      {/* 9. Noell Support Spotlight, honest positioning */}
      <NoellSupportSpotlight />

      {/* 10. How It Works, three-step process (Features3 reframed) */}
      <Features3
        eyebrow="How it works"
        headlineStart="Three moves"
        headlineAccent="that close the gap."
        body="Not a 40-feature list. Three touchpoints, running quietly, that move the numbers every week."
      />

      {/* 11. Pricing */}
      <Pricing />

      {/* 12. FAQ */}
      <FAQ />

      {/* 13. Dark CTA (Action) */}
      <CTA />
    </div>
  );
}
