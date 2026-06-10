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
  title: "AI Front Desk for Service Businesses | Ops by Noell",
  description:
    "Ops by Noell builds and runs AI-powered front desk and operations systems for service-based businesses. Done for you. Live in 14 days.",
  ogTitle: "Ops by Noell | AI Front Desk for Service Businesses",
  ogDescription:
    "Stop losing revenue to missed calls and slow follow-up. Ops by Noell builds and runs your AI front desk and operations system. Done for you. Live in 14 days.",
});

const homepageFaqs: FaqItem[] = [
  {
    id: "is-this-a-sales-pitch",
    question: "Is this a sales pitch?",
    answer:
      "No. The Missed Call Audit and the Digital Readiness Review are both working deliverables. You leave with a clear map of what is leaking, what it is worth, and whether Ops by Noell is the right fit. If it is not, we will say so.",
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
        eyebrow="For service-based businesses"
        headlineLine1Start="While you are with a client,"
        headlineLine1Accent=""
        headlineLine2Start="someone else is answering"
        headlineLine2Accent="your phone."
        headlineLine2Smaller={false}
        body="Every missed call is a client who called the next business on Google. Ops by Noell builds and runs your AI front desk so nothing slips through. Done for you. Live in 14 days. No software to learn."
        footnote=""
        primaryCta={{ label: "Get Your Free Missed Call Audit", href: "/book" }}
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

      {/* ─── 2.5 PAIN AGITATION BAND ──────────────────────────────────────────
          Loss-aversion framing before the calculator. Real language from real owners.
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="px-4 py-12 md:py-14 border-t border-white/5 bg-[#1c1210]">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-[11px] uppercase tracking-[0.25em] text-wine mb-6">
            The invisible cost
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                stat: "70%",
                label: "of missed calls never leave a voicemail",
                sub: "They just call the next business on Google.",
              },
              {
                stat: "$60",
                label: "average cost per inbound lead from paid ads",
                sub: "Most service businesses answer fewer than half their calls.",
              },
              {
                stat: "5 min",
                label: "is the response window before a lead goes cold",
                sub: "After five minutes, your odds of booking drop by over 80%.",
              },
            ].map((item) => (
              <div
                key={item.stat}
                className="rounded-[18px] bg-[#271520] border border-wine/20 p-6 text-center"
              >
                <p className="font-serif text-4xl font-semibold text-wine mb-2">
                  {item.stat}
                </p>
                <p className="text-sm text-cream/80 font-medium mb-1.5">{item.label}</p>
                <p className="text-xs text-cream/50 leading-relaxed">{item.sub}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-base text-cream/70 max-w-2xl mx-auto leading-relaxed">
            Your marketing is not failing you. Your front desk is. Ops by Noell fixes the part that runs while you are doing the actual work.
          </p>
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
            How much is your front desk{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              costing you?
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
                One team that runs it for you.
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
                You built a great business. But every missed call, slow follow-up, and lapsed client is revenue leaving quietly. Your competitors are not better than you. They just pick up the phone.
              </p>
              <ul className="space-y-2.5 mb-8">
                {[
                  "Every missed call recovered within 5 minutes via SMS",
                  "Lapsed clients reactivated before they book elsewhere",
                  "No software to learn. We build it, run it, and manage it.",
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
      {/* ─── 7. INLINE BOOKING ───────────────────────────────────────────────
          Replace the outbound CTA link with an inline booking widget.
          Visitors who scroll to the bottom are the most qualified — give them
          a calendar, not another page to navigate to.
      ─────────────────────────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-3">
              The first step
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream leading-tight mb-4">
              Find out what your operations are{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                missing.
              </span>
            </h2>
            <p className="text-base text-cream/70 max-w-xl mx-auto leading-relaxed">
              We map the leaks in your front desk, follow-up, and operations. You will know what is being missed, what it is worth, and which track fits. No pitch. No pressure.
            </p>
          </div>
          <div className="rounded-[22px] border border-wine/30 bg-[#271520] p-6 md:p-8">
            <iframe
              src="https://api.leadconnectorhq.com/widget/booking/ko7eXb5zooItceadiV02"
              style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "600px" }}
              scrolling="no"
              id="home-footer-booking"
            />
            <script src="https://link.msgsndr.com/js/form_embed.js" type="text/javascript" />
            <p className="text-[11px] text-cream/40 text-center mt-4">
              Free &middot; No pitch &middot; If it is not a fit, we will say so
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
