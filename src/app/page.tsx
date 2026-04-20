import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import LiveSystemLog from "@/components/live-system-log";
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
        headlineLine1Start="Three agents. One system."
        headlineLine1Accent=""
        headlineLine2Start="Never miss a call, text, confirmation, or reschedule."
        headlineLine2Accent=""
        headlineLine2Smaller
        body="Noell Support handles website chat 24/7. Noell Front Desk never misses a call, text, or confirmation. Noell Care takes reschedules and service questions. The system runs. You run the business."
        footnote=""
        primaryCta={{
          label: "Start with a free 30-minute audit",
          href: "/book",
        }}
        secondaryCta={{
          label: "See how it works",
          href: "#the-noell-system",
        }}
      />

      {/* 2. Social proof bar, credibility numbers */}
      <Features />

      <LiveSystemLog />

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
