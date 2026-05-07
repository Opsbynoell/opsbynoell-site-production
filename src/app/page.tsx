import { Hero } from "@/components/hero";
import { Testimonials } from "@/components/testimonials";
import { Systems } from "@/components/systems";
import CTA from "@/components/cta";
import { PickYourPath } from "@/components/pick-your-path";
import { FullSystemFeatures } from "@/components/full-system-features";
import { PredictiveIntelligence } from "@/components/predictive-intelligence";
import { ROICalculator } from "@/components/roi-calculator";
import { ProofBar } from "@/components/proof-bar";
import { SantaProofBlock } from "@/components/santa-proof-block";
import { FounderQuote } from "@/components/founder-quote";
import { PciBand } from "@/components/pci-band";
import { IntegrationBand } from "@/components/integration-band";
import { FAQ, type FaqItem } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {
  servicePageSchema,
  homepageLocalBusinessSchema,
  faqPageSchema,
} from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/",
  absoluteTitle: true,
  title: "Predictive Customer Intelligence for Service Businesses — Ops by Noell",
  description:
    "We find the clients, leads, and rebookings your booking software is about to lose, then deploy the agents that recover them. Get your free Revenue Signal Report.",
  ogTitle: "Ops by Noell — Predictive Customer Intelligence for Service Businesses",
  ogDescription:
    "$960 recovered in 14 days. The intelligence layer that catches revenue your booking software misses. Free Revenue Signal Report.",
});

const homepageFaqs: FaqItem[] = [
  {
    id: "is-this-a-sales-pitch",
    question: "Is this a sales pitch?",
    answer:
      "No. The Revenue Signal Report is a working deliverable. You will leave with a clear map of where your front desk, booking flow, and follow-up system are leaking revenue, and whether Ops by Noell is a fit. If it is not, we will say so.",
  },
  {
    id: "what-is-revenue-signal-report",
    question: "What is the Revenue Signal Report?",
    answer:
      "A free review of where your front desk, booking flow, and follow-up system are leaking revenue. You tell us about your business and current tools, we review personally and reply within one business day with a focused walkthrough.",
  },
  {
    id: "switch-booking-systems",
    question: "Do I need to switch booking systems?",
    answer:
      "No. We install the AI front desk around the booking system you already use. Your booking system stays the system of record.",
  },
  {
    id: "who-is-this-for",
    question: "Who is this for?",
    answer:
      "Dental practices, med spas, salons, massage therapists, estheticians, and HVAC companies. Solo operators and small teams whose front desk has gone quiet while the owner is with a client.",
  },
  {
    id: "what-does-it-cost",
    question: "What does it cost?",
    answer:
      "Done-for-you pricing. We share specifics on the working call once we understand what your front desk needs. We do not quote in advance because the install depends on what we find.",
  },
  {
    id: "pci-extra-charge",
    question: "Is Predictive Customer Intelligence an extra charge?",
    answer:
      "No. It is built into every Ops by Noell install. The front desk that answers your calls is the same front desk that watches your patterns. They are one system, not two.",
  },
];

export default function Home() {
  return (
    <div>
      <JsonLd
        data={servicePageSchema({
          name: "The Ops by Noell AI front desk",
          description:
            "The done-for-you AI front desk for local service businesses. Built, installed, and managed around the booking system you already use, so missed calls, consults, reminders, reviews, and reactivation keep moving.",
          path: "/",
        })}
        id="home-service"
      />
      <JsonLd
        data={homepageLocalBusinessSchema()}
        id="home-localbusiness"
      />
      <JsonLd
        data={faqPageSchema(homepageFaqs)}
        id="home-faq"
      />

      {/* 1. Hero */}
      <Hero
        headlineLine1Start="Your booking software shows what happened."
        headlineLine1Accent=""
        headlineLine2Start="We show who is about to"
        headlineLine2Accent="slip away."
        headlineLine2Smaller={false}
        body="Ops by Noell finds the clients, leads, and rebookings your front desk is about to lose, then deploys AI agents that recover the revenue before it leaves your book."
        footnote="Done for you. Built around the booking and practice management tools you already use. Live in 14 days."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See How It Works", href: "/predictive-customer-intelligence" }}
        showProofBar={false}
      />

      {/* 2. Santa proof block */}
      <SantaProofBlock />

      {/* 3. Founder presence band — "a real person built this" signal */}
      <FounderQuote />

      {/* 4. PCI band */}
      <PciBand />

      {/* 4. Predictive Customer Intelligence detail (moved up — PCI is the differentiator) */}
      <PredictiveIntelligence />

      {/* 5. ProofBar / #live-recovery */}
      <section className="w-full flex justify-center px-4 pb-12 md:pb-16">
        <ProofBar />
      </section>

      {/* 6. Pick your path */}
      <PickYourPath />

      {/* 7. Integration band */}
      <IntegrationBand />

      {/* 8. ROI Calculator */}
      <section className="w-full py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <ROICalculator />
        </div>
      </section>

      {/* 9. Systems. Three agents, tight. */}
      <Systems />

      {/* 10. Full system features (kept from prior layout) */}
      <FullSystemFeatures />

      {/* 11. Proof. Santa case study block. */}
      <Testimonials />

      {/* 12. Homepage FAQ */}
      <FAQ
        faqs={homepageFaqs}
        eyebrow="Questions"
        headlineStart="Straight"
        headlineAccent="answers."
        body="Real questions from service business owners before they request a Revenue Signal Report."
      />

      {/* 13. Final CTA band */}
      <CTA
        eyebrow="The first step"
        headlineStart="Find the revenue your booking software is"
        headlineAccent="missing."
        body="In your free Revenue Signal Report, we map the leaks in your front desk, booking flow, and follow-up system. You will know what is being missed, what it may be worth, and which Ops by Noell track fits."
        trustLine="No pitch. No pressure. If it is not a fit, we will say so."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See How PCI Works", href: "/predictive-customer-intelligence" }}
        sourcePage="home"
      />
    </div>
  );
}
