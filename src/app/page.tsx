import Link from "next/link";
import { Hero } from "@/components/hero";
import { BookingCalendarEmbed } from "@/components/booking-calendar-embed";
import { StickyMobileBookCta } from "@/components/book-sticky-mobile-cta";
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
      "No. The Missed Call Audit is a working deliverable. You leave with a clear map of what is leaking, what it is worth, and whether Ops by Noell is the right fit. If it is not, we will say so.",
  },
  {
    id: "who-is-this-for",
    question: "Who is this for?",
    answer:
      "Local appointment-based service businesses: dental practices, med spas, salons, massage and wellness practices, and other professional service firms where every missed call or slow follow-up costs a booked appointment.",
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
      "Most service business installs are live within 14 days. Your free Missed Call Audit delivers findings within the first session, before anything is built.",
  },
];

export default function Home() {
  return (
    <div>
      <JsonLd
        data={servicePageSchema({
          name: "Ops by Noell AI Operations",
          description:
            "Done-for-you AI front desk and operations systems for local appointment-based service businesses. Built, installed, and managed by our team.",
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
          Service-business headline. Single audience, single primary CTA.
      ─────────────────────────────────────────────────────────────────────── */}
      <Hero
        eyebrow="For local practices and solo operators who can't catch every call"
        headlineLine1Start="While you're with a client,"
        headlineLine1Accent=""
        headlineLine2Start="who's"
        headlineLine2Accent="picking up?"
        headlineLine2Smaller={false}
        body="We build and run an AI front desk that answers and follows up on every call, day or night, so a Laguna Niguel practice recovered $2,560 in 30 days. Done for you. Live in 14 days."
        footnote=""
        proofBadge="$2,560 recovered in 30 days · Laguna Niguel"
        primaryCta={{ label: "Get Your Free Missed Call Audit", href: "/book" }}
        secondaryCta={null}
        showProofBar={true}
        pinnedProof={true}
        calmMobile={true}
        softHalo={true}
        priceSignal={
          <>Free. No pitch. If we can&apos;t find recoverable revenue, we&apos;ll tell you.</>
        }
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
            licensed therapeutic massage practice in Laguna Niguel. In 30 days,
            missed calls turned into booked appointments and{" "}
            <span className="text-wine font-semibold">
              $2,560 in recovered revenue.
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
              Santa E., Healing Hands by Santa, Laguna Niguel CA
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
                <p className="text-sm text-cream/90 leading-relaxed">{item.sub}</p>
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

      {/* ─── 5. THE SYSTEM ───────────────────────────────────────────────────
          Three agents. PCI band collapsed — one tight "how it works" section.
          FounderQuote removed — Santa testimonial above already handles trust.
      ─────────────────────────────────────────────────────────────────────── */}
      {/* Agitation lead-in (relocated from the hero) — sits directly above
          the "Three jobs, handled" block as its question header. */}
      <section className="px-4 pt-20 md:pt-28 text-center -mb-10 md:-mb-16 border-t border-white/5">
        <p className="max-w-3xl mx-auto font-serif text-2xl md:text-3xl font-semibold text-cream leading-snug">
          Who&apos;s answering the phone? Who&apos;s following up on every missed
          call?{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            Who&apos;s there after you close?
          </span>
        </p>
      </section>
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
              We map the leaks in your front desk, follow-up, and operations. You will know what is being missed, what it is worth, and what the fix looks like. No pitch. No pressure.
            </p>
          </div>
          <div className="rounded-[22px] border border-wine/30 bg-[#271520] p-3 sm:p-6 md:p-8">
            <BookingCalendarEmbed id="home-footer-booking" />
            <p className="text-[11px] text-cream/40 text-center mt-4">
              Free &middot; No pitch &middot; If it is not a fit, we will say so
            </p>
          </div>
        </div>
      </section>

      {/* Persistent mobile CTA — appears once the visitor scrolls past the hero */}
      <StickyMobileBookCta
        href="/book"
        label="Book Your Free Audit"
        accent="orange"
        sourcePage="home"
        sourceSection="sticky_mobile"
      />
    </div>
  );
}
