import Link from "next/link";
import { Hero } from "@/components/hero";
import CTA from "@/components/cta";
import { FounderQuote } from "@/components/founder-quote";
import { PciBand } from "@/components/pci-band";
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
  title: "AI Operations for Service Businesses and B2B — Ops by Noell",
  description:
    "Ops by Noell builds and runs AI-powered operational systems for service-based businesses and B2B companies. Done for you. Live in 14 days.",
  ogTitle: "Ops by Noell — AI Operations for Service Businesses and B2B",
  ogDescription:
    "Whether you run a service business or sell into enterprise, Ops by Noell builds the operational layer that keeps revenue from slipping out. Free audit to start.",
});

const homepageFaqs: FaqItem[] = [
  {
    id: "is-this-a-sales-pitch",
    question: "Is this a sales pitch?",
    answer:
      "No. The Revenue Signal Report is a working deliverable. You will leave with a clear map of where your operations are leaking revenue, and whether Ops by Noell is a fit. If it is not, we will say so.",
  },
  {
    id: "who-is-this-for",
    question: "Who is this for?",
    answer:
      "Service businesses including dental practices, med spas, salons, massage therapists, and HVAC companies, as well as B2B companies including SaaS, AI vendors, and tech startups selling into enterprise accounts.",
  },
  {
    id: "how-long-to-go-live",
    question: "How long does it take to go live?",
    answer:
      "Most clients are live within 14 days of their first working session. We handle the build, the installation, and the ongoing operations. You do not manage the system — we do.",
  },
];

export default function Home() {
  return (
    <div>
      <JsonLd
        data={servicePageSchema({
          name: "Ops by Noell AI Operations",
          description:
            "Done-for-you AI operational systems for service businesses and B2B companies. Built, installed, and managed by our team.",
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
          Brand-level headline. Speaks to both audiences.
      ─────────────────────────────────────────────────────────────────────── */}
      <Hero
        headlineLine1Start="The operations layer your business"
        headlineLine1Accent=""
        headlineLine2Start="is"
        headlineLine2Accent="missing."
        headlineLine2Smaller={false}
        body="Ops by Noell builds and runs AI-powered operational systems that catch missed revenue, recover lost clients, and make sure your digital presence holds up when it matters most."
        footnote="Done for you. Built around the tools you already use. Live in 14 days."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See How It Works", href: "/systems" }}
        showProofBar={false}
      />

      {/* ─── 2. AUDIENCE SPLIT ───────────────────────────────────────────────
          The moment the visitor self-identifies. Two tracks. Clean routing.
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="w-full py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              Who we work with
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Two types of business.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                One operational standard.
              </span>
            </h2>
            <p className="mt-5 text-charcoal/70 max-w-2xl mx-auto leading-relaxed text-base md:text-lg">
              Tell us which describes you and we will show you exactly what we build.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            {/* Track 1: Service Businesses */}
            <Link
              href="/for-service-businesses"
              className="group relative flex flex-col rounded-[22px] bg-white p-8 md:p-10 border border-warm-border hover:border-wine/40 transition-all duration-300 shadow-[0px_4px_8px_0px_rgba(28,25,23,0.05),0px_15px_15px_0px_rgba(28,25,23,0.04)] hover:shadow-[0px_8px_24px_0px_rgba(106,44,62,0.12)]"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-wine/85 mb-3">
                Track 01
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-4 leading-snug">
                Service-Based Businesses
              </h3>
              <p className="text-charcoal/75 leading-relaxed mb-6 flex-1">
                Consultants, agencies, coaches, salons, med spas, dental practices, and professional services. You deliver excellent work. We make sure your front desk, follow-up, and client retention reflect that.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Missed-call recovery and front desk automation",
                  "Client retention and rebooking systems",
                  "Live lead intelligence dashboard included",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal/80">
                    <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-wine/10 text-wine flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-2 text-wine font-medium text-sm group-hover:gap-3 transition-all">
                See how it works for service businesses
                <span className="text-base">→</span>
              </div>
            </Link>

            {/* Track 2: B2B and Enterprise */}
            <Link
              href="/for-b2b"
              className="group relative flex flex-col rounded-[22px] bg-wine p-8 md:p-10 border border-wine hover:border-wine-dark transition-all duration-300 shadow-[0px_4px_8px_0px_rgba(106,44,62,0.18),0px_15px_15px_0px_rgba(106,44,62,0.12)] hover:shadow-[0px_8px_24px_0px_rgba(106,44,62,0.28)]"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-cream/60 mb-3">
                Track 02
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-4 leading-snug">
                B2B and Enterprise
              </h3>
              <p className="text-cream/80 leading-relaxed mb-6 flex-1">
                SaaS companies, AI vendors, and tech startups selling into enterprise accounts. You win in boardrooms. We make sure you do not lose on the internet when procurement does their research.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Predictive Customer Intelligence for pipeline signals",
                  "AI-optimized GTM strategy for enterprise buyers",
                  "Live B2B pipeline dashboard included",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-cream/85">
                    <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-cream/20 text-cream flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-2 text-cream font-medium text-sm group-hover:gap-3 transition-all">
                See how it works for B2B companies
                <span className="text-base">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 3. TRUST ────────────────────────────────────────────────────────
          "A real person built this." Photo + one paragraph. Short.
      ─────────────────────────────────────────────────────────────────────── */}
      <FounderQuote />

      {/* ─── 4. HOW IT WORKS ─────────────────────────────────────────────────
          PCI differentiator band (tight, editorial) + three agents.
      ─────────────────────────────────────────────────────────────────────── */}
      <PciBand />
      <Systems />

      {/* ─── 5. FAQ + CTA ────────────────────────────────────────────────────
          Three objection killers. Then the button. End clean.
      ─────────────────────────────────────────────────────────────────────── */}
      <FAQ
        faqs={homepageFaqs}
        eyebrow="Questions"
        headlineStart="Straight"
        headlineAccent="answers."
        body="Real questions from business owners and operators before they book their first working session."
      />
      <CTA
        eyebrow="The first step"
        headlineStart="Find out what your operations are"
        headlineAccent="missing."
        body="In your free Revenue Signal Report, we map the leaks in your operations, front desk, and follow-up system. You will know what is being missed, what it may be worth, and which Ops by Noell track fits."
        trustLine="No pitch. No pressure. If it is not a fit, we will say so."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See How PCI Works", href: "/predictive-customer-intelligence" }}
        sourcePage="home"
      />
    </div>
  );
}
