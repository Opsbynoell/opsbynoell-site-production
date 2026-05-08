import { Hero } from "@/components/hero";
import CTA from "@/components/cta";
import { ROICalculator } from "@/components/roi-calculator";
import { SantaProofBlock } from "@/components/santa-proof-block";
import { FounderQuote } from "@/components/founder-quote";
import { PciBand } from "@/components/pci-band";
import { IntegrationBand } from "@/components/integration-band";
import { Systems } from "@/components/systems";
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

// Three questions that kill the three most common objections before the CTA.
const homepageFaqs: FaqItem[] = [
  {
    id: "is-this-a-sales-pitch",
    question: "Is this a sales pitch?",
    answer:
      "No. The Revenue Signal Report is a working deliverable. You will leave with a clear map of where your front desk, booking flow, and follow-up system are leaking revenue, and whether Ops by Noell is a fit. If it is not, we will say so.",
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

      {/* ─── 1. HOOK ─────────────────────────────────────────────────────────
          One headline. One body line. One CTA. The visitor decides in 5 sec.
      ─────────────────────────────────────────────────────────────────────── */}
      <Hero
        headlineLine1Start="Your booking software shows what happened."
        headlineLine1Accent=""
        headlineLine2Start="We show who is about to"
        headlineLine2Accent="slip away."
        headlineLine2Smaller={false}
        body="Ops by Noell finds the clients, leads, and rebookings your front desk is about to lose, then deploys AI agents that recover the revenue before it leaves your book."
        footnote="Done for you. Built around the booking and practice management tools you already use. Live in 14 days."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See How It Works", href: "/systems" }}
        showProofBar={false}
      />

      {/* ─── 2. PROOF ────────────────────────────────────────────────────────
          Kill skepticism immediately. Real result, real number, real timeline.
      ─────────────────────────────────────────────────────────────────────── */}
      <SantaProofBlock />

      {/* ─── 3. TRUST ────────────────────────────────────────────────────────
          "A real person built this." Photo + one paragraph. Short.
      ─────────────────────────────────────────────────────────────────────── */}
      <FounderQuote />

      {/* ─── 4. PAIN MADE PERSONAL ───────────────────────────────────────────
          The ROI calculator. Visitor stops skimming and starts calculating.
          Moved up — this is the conversion engine, not a footer feature.
      ─────────────────────────────────────────────────────────────────────── */}
      <section id="roi-calculator" className="w-full py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <ROICalculator />
        </div>
      </section>

      {/* ─── 5. HOW IT WORKS ─────────────────────────────────────────────────
          PCI differentiator band (tight, editorial) + three agents.
          Together these answer: "okay but what actually happens?"
      ─────────────────────────────────────────────────────────────────────── */}
      <PciBand />
      <Systems />

      {/* ─── 6. REMOVES THE LAST OBJECTION ───────────────────────────────────
          "Works with the tools I already use." One row. No switching required.
      ─────────────────────────────────────────────────────────────────────── */}
      <IntegrationBand />

      {/* ─── 7. ONE ACTION + THREE OBJECTION KILLERS ─────────────────────────
          Three FAQs max. Then the button. End clean.
      ─────────────────────────────────────────────────────────────────────── */}
      <FAQ
        faqs={homepageFaqs}
        eyebrow="Questions"
        headlineStart="Straight"
        headlineAccent="answers."
        body="Real questions from service business owners before they request a Revenue Signal Report."
      />

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
