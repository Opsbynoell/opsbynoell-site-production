import { FAQ, type FaqItem } from "@/components/faq";
import CTA from "@/components/cta";
import { Button } from "@/components/button";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, servicePageSchema } from "@/lib/schema";
import { IconCheck, IconSearch, IconChartBar, IconArrowRight } from "@tabler/icons-react";

export const metadata = pageMetadata({
  path: "/digital-readiness-review",
  title: "Digital Readiness Review",
  description:
    "A focused audit of your digital presence, pipeline, and operational systems. We identify the gaps between how your business looks online and how enterprise buyers actually evaluate vendors.",
  ogTitle: "Digital Readiness Review by Ops by Noell",
  ogDescription:
    "Find out exactly where your digital presence, pipeline, and operations are losing deals. A focused, no-fluff review built for B2B and SaaS companies.",
});

const whatWeReview = [
  {
    icon: <IconSearch size={20} />,
    eyebrow: "Digital Presence",
    title: "How your site reads to a buyer doing their own research.",
    body: "We review your homepage, product pages, social proof, and trust signals against the standards enterprise procurement teams actually use. Most B2B sites pass the founder test and fail the buying committee test.",
  },
  {
    icon: <IconChartBar size={20} />,
    eyebrow: "Pipeline Architecture",
    title: "Where deals stall, go quiet, or never start.",
    body: "We map your inbound motion, outbound sequences, and CRM hygiene. We identify the friction points that slow first-touch qualification, delay demo scheduling, and let warm accounts go cold.",
  },
  {
    icon: <IconArrowRight size={20} />,
    eyebrow: "Operational Systems",
    title: "Whether your back-end matches your front-end promise.",
    body: "A polished pitch backed by a slow, manual operation loses deals at the contract stage. We review your handoff flows, onboarding architecture, and renewal cadences to find the gaps before your buyers do.",
  },
];

const deliverables = [
  "A written summary of your top three digital presence gaps",
  "A prioritized list of pipeline friction points with estimated deal impact",
  "A recommended operational track with a clear install path",
  "Honest assessment of whether Ops by Noell is the right fit",
];

const drrFaqs: FaqItem[] = [
  {
    id: "what-is-a-drr",
    question: "What exactly is a Digital Readiness Review?",
    answer:
      "It is a focused, one-session audit of your digital presence, pipeline, and operational systems. We look at your site, your inbound motion, and your back-end operations and tell you exactly where the gaps are and what to do about them.",
  },
  {
    id: "who-is-this-for",
    question: "Who is this for?",
    answer:
      "B2B and SaaS companies that are actively selling into mid-market or enterprise accounts and suspect their digital presence, pipeline, or operations are costing them deals. If you are pre-revenue or still finding product-market fit, this is not the right starting point.",
  },
  {
    id: "how-long",
    question: "How long does it take?",
    answer:
      "The review itself is a focused working session, typically sixty to ninety minutes. You receive a written summary within one business day.",
  },
  {
    id: "is-this-a-sales-call",
    question: "Is this just a sales call?",
    answer:
      "No. You receive a working deliverable regardless of whether we move forward together. If Ops by Noell is not the right fit, we will tell you and point you in the right direction.",
  },
  {
    id: "what-do-i-need",
    question: "What do I need to prepare?",
    answer:
      "Nothing formal. If you have your website URL, a rough sense of your current pipeline stage distribution, and the name of your CRM, that is enough to start.",
  },
];

export default function DigitalReadinessReviewPage() {
  return (
    <div>
      <JsonLd
        data={[
          faqPageSchema(drrFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Digital Readiness Review", path: "/digital-readiness-review" },
          ]),
          servicePageSchema({
            name: "Digital Readiness Review",
            description:
              "A focused audit of your digital presence, pipeline, and operational systems for B2B and SaaS companies.",
            path: "/digital-readiness-review",
          }),
        ]}
        id="digital-readiness-review"
      />

      {/* Hero */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-4 mx-auto flex-col items-center justify-center pt-20 md:pt-24 pb-6 md:pb-8 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.30)] via-[rgba(31,18,25,0.85)] to-[rgba(19,11,15,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
          For B2B & SaaS
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-cream">
          Digital{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            Readiness Review.
          </span>
        </h1>
        <p className="relative z-20 mt-5 max-w-2xl text-center text-cream/80 text-base md:text-lg leading-relaxed">
          A focused audit of your digital presence, pipeline, and operational
          systems. We find the gaps that are costing you deals before your
          buyers find them first.
        </p>
        <div className="relative z-20 mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/book" variant="wine" className="h-12 px-7 text-base">
            Request Your Review
          </Button>
          <Button href="/for-b2b" variant="secondary" className="h-12 px-7 text-base">
            See the full B2B track
          </Button>
        </div>
      </section>

      {/* What we review */}
      <section className="px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
              What we cover
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream leading-tight">
              Three layers. One honest assessment.
            </h2>
            <p className="mt-4 text-cream/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Most audits stop at the homepage. We go three layers deep.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {whatWeReview.map((item, idx) => (
              <div
                key={idx}
                className="rounded-[20px] border border-white/10 bg-[#271520] p-6 md:p-7"
              >
                <div className="flex items-center gap-2 text-wine mb-3">
                  {item.icon}
                  <span className="text-[11px] uppercase tracking-widest text-muted-strong">
                    {item.eyebrow}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-cream leading-snug mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-cream/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="px-4 py-12 md:py-14">
        <div className="max-w-3xl mx-auto rounded-[22px] border border-white/10 bg-[#301A26] p-7 md:p-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            What you walk away with
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream leading-tight mb-6">
            A working deliverable. Not a deck.
          </h2>
          <ul className="space-y-4">
            {deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <IconCheck size={16} className="text-wine mt-0.5 shrink-0" />
                <span className="text-sm md:text-base text-cream/80 leading-relaxed">
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-sm text-cream/70 italic leading-relaxed">
              You keep the review regardless of whether we move forward. If it
              is not a fit, we will say so and point you in the right direction.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        eyebrow="Before you request"
        headlineStart="Short answers."
        headlineAccent="No pressure."
        body="The questions B2B founders ask before requesting a Digital Readiness Review."
        faqs={drrFaqs}
      />

      {/* CTA */}
      <CTA
        eyebrow="Ready when you are"
        headlineStart="Request your"
        headlineAccent="Digital Readiness Review."
        body="Tell us about your business and we will review your digital presence, pipeline, and operations personally. Reply within one business day."
        trustLine="Working deliverable included · No obligation · B2B & SaaS focused"
        primaryCta={{ label: "Request Your Review", href: "/book" }}
        secondaryCta={{ label: "See the full B2B track", href: "/for-b2b" }}
        sourcePage="digital-readiness-review"
      />
    </div>
  );
}
