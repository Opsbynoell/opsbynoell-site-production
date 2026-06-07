import Link from "next/link";
import { Hero } from "@/components/hero";
import CTA from "@/components/cta";
import { Systems } from "@/components/systems";
import { FAQ, type FaqItem } from "@/components/faq";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { ROICalculator } from "@/components/roi-calculator";
import {
  servicePageSchema,
  homepageLocalBusinessSchema,
  faqPageSchema,
} from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/",
  absoluteTitle: true,
  title: "AI Operations for Service Businesses and B2B, Ops by Noell",
  description:
    "Ops by Noell builds and runs AI-powered operational systems for service-based businesses and B2B companies. Done for you. Live in 14 days.",
  ogTitle: "Ops by Noell, AI Operations for Service Businesses and B2B",
  ogDescription:
    "Whether you run a service business or sell to B2B and SaaS buyers, Ops by Noell builds the operational layer that keeps revenue from slipping out. Free audit to start.",
});

const homepageFaqs: FaqItem[] = [
  {
    id: "is-this-a-sales-pitch",
    question: "Is this a sales pitch?",
    answer:
      "No. The Revenue Signal Report and the Digital Readiness Review are both working deliverables. You leave with a clear map of what is leaking, what it is worth, and whether Ops by Noell is the right fit. If it is not, we will say so.",
  },
  {
    id: "who-is-this-for",
    question: "Who is this for?",
    answer:
      "Two types of business. Service businesses including dental practices, med spas, salons, coaches, agencies, and professional service firms where every missed call or slow follow-up costs a client. And B2B and SaaS companies including AI vendors and tech startups where the gap between your pitch and your website is costing you deals.",
  },
  {
    id: "what-does-done-for-you-mean",
    question: "What does done for you actually mean?",
    answer:
      "It means we build it, install it, and run it. You do not manage agents, write prompts, or monitor dashboards unless you want to. We handle the build, the ongoing tuning, and the monthly reporting. You focus on the business.",
  },
  {
    id: "how-long-to-go-live",
    question: "How long until the system is live?",
    answer:
      "Most service business installs are live within 14 days. B2B engagements vary based on scope but start with a Digital Readiness Review that delivers findings within the first session.",
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
        headlineLine1Start="The AI front desk and pipeline"
        headlineLine1Accent=""
        headlineLine2Start="your business is"
        headlineLine2Accent="missing."
        headlineLine2Smaller={false}
        body="Done for you. Live in 14 days. Managed by our team."
        footnote=""
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See How It Works", href: "/systems" }}
        showProofBar={false}
      />

      {/* ─── 2. PROOF ────────────────────────────────────────────────────────
          Santa testimonial + client-type trust banner.
          Visitor sees real ROI proof within 3 seconds of scrolling.
      ─────────────────────────────────────────────────────────────────────── */}

      {/* Santa testimonial */}
      <section className="px-4 pt-2 pb-8 md:pb-10">
        <div className="max-w-3xl mx-auto rounded-[22px] border border-wine/30 bg-[#301A26] p-7 md:p-9">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
            Currently running
          </p>
          <p className="font-serif text-lg md:text-xl text-cream leading-snug">
            Keeping the front desk moving for Healing Hands by Santa, a solo
            licensed therapeutic massage practice in Laguna Niguel. In fourteen
            days, four missed calls turned into booked appointments and{" "}
            <span className="text-wine font-semibold">
              $960 in recovered revenue.
            </span>
          </p>
          <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  className="w-4 h-4 text-wine"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-cream/70">
              Santa E. &mdash; Healing Hands by Santa, Laguna Niguel CA
            </p>
            <Link
              href="/case-studies/santa-e"
              className="text-sm text-wine underline underline-offset-4 decoration-wine/40 hover:decoration-wine sm:ml-auto"
            >
              Read the full case study &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Client-type trust banner */}
      <section className="px-4 pb-10 md:pb-12">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-5">
            Trusted by service businesses nationwide
          </p>
          <div className="flex flex-wrap justify-center gap-2 md:gap-2.5">
            {[
              "Med Spas",
              "Massage Practices",
              "Dental Offices",
              "Coaching Practices",
              "Marketing Agencies",
              "General Contractors",
              "Salons & Studios",
              "HVAC Companies",
              "Plumbing Services",
              "Electrical Contractors",
              "Pest Control",
              "Landscaping & Lawn Care",
              "Cleaning Services",
              "Roofing Companies",
              "Home Inspectors",
              "Personal Trainers",
              "Chiropractors",
              "Veterinary Practices",
            ].map((label) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-cream/20 bg-cream/8 px-3.5 py-1.5 text-xs font-medium text-cream"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#C45A2A] flex-shrink-0" />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. CALCULATE THE LOSS ───────────────────────────────────────────
          ROI Calculator moved here — while visitor is emotionally engaged.
          "Hook → Proof → Calculate your loss" before any explanation.
          Two sliders, instant result, no email required.
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 py-12 md:py-16 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-3">
            60-second estimator
          </p>
          <h2 className="text-center font-serif text-2xl md:text-3xl font-semibold text-cream mb-8 leading-snug">
            What could this{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              recover for you?
            </span>
          </h2>
          <ROICalculator />
        </div>
      </section>

      {/* ─── 4. AUDIENCE SPLIT ───────────────────────────────────────────────
          The moment the visitor self-identifies. Two tracks. Clean routing.
          Now positioned after the "aha moment" from the calculator.
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="w-full py-16 md:py-24 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              Who we work with
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              Two types of business.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                One operational standard.
              </span>
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 items-stretch">
            {/* Track 1: Service Businesses */}
            <Link
              href="/for-service-businesses"
              className="group relative flex flex-col rounded-[22px] bg-[#271520] p-8 md:p-10 border border-white/10 hover:border-wine/40 transition-all duration-300 shadow-[0px_4px_8px_0px_rgba(28,25,23,0.05),0px_15px_15px_0px_rgba(28,25,23,0.04)] hover:shadow-[0px_8px_24px_0px_rgba(106,44,62,0.12)]"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-wine/85 mb-3">
                Track 01
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-4 leading-snug">
                Service-Based Businesses
              </h3>
              <p className="text-cream/75 leading-relaxed mb-6 flex-1">
                Consultants, agencies, coaches, salons, med spas, dental
                practices, and professional service businesses. You deliver
                excellent work. Every missed call, slow follow-up, and lapsed
                client is revenue your front desk is losing silently.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Every missed call recovered within 5 minutes via SMS",
                  "Lapsed clients reactivated automatically before they book elsewhere",
                  "Live lead intelligence dashboard included with every system",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-cream/80"
                  >
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

            {/* Track 2: B2B & SaaS */}
            <Link
              href="/for-b2b"
              className="group relative flex flex-col rounded-[22px] bg-[#271520] p-8 md:p-10 border border-wine/40 hover:border-wine transition-all duration-300 shadow-[0px_4px_8px_0px_rgba(106,44,62,0.12),0px_15px_15px_0px_rgba(106,44,62,0.08)] hover:shadow-[0px_8px_24px_0px_rgba(106,44,62,0.22)]"
            >
              <p className="text-[11px] uppercase tracking-[0.2em] text-wine/85 mb-3">
                Track 02
              </p>
              <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-4 leading-snug">
                B2B & SaaS
              </h3>
              <p className="text-cream/80 leading-relaxed mb-6 flex-1">
                B2B and SaaS companies, AI vendors, and tech startups. Your
                pitch lands in the boardroom. Then procurement visits your
                website. In seven seconds, the deal either holds or collapses.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Predictive Customer Intelligence surfaces accounts before they move",
                  "Digital presence rebuilt to survive the procurement research window",
                  "Live B2B pipeline dashboard tracks every deal and ICP score",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-sm text-cream/85"
                  >
                    <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-wine/10 text-wine flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-2 text-wine font-medium text-sm group-hover:gap-3 transition-all">
                See how it works for B2B companies
                <span className="text-base">→</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── 5. THE SYSTEM ───────────────────────────────────────────────────
          Three agents. PCI band collapsed — one tight "how it works" section.
          FounderQuote removed — Santa testimonial above already handles trust.
      ─────────────────────────────────────────────────────────────────────── */}
      <Systems />

      {/* ─── 6. FAQ + CTA ────────────────────────────────────────────────────
          Four objection killers. Then the button. End clean.
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
        body="We map the leaks in your operations, front desk, and follow-up system. You will know what is being missed, what it may be worth, and which track fits."
        trustLine="No pitch. No pressure. If it is not a fit, we will say so."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See How PCI Works", href: "/predictive-customer-intelligence" }}
        sourcePage="home"
      />
    </div>
  );
}
