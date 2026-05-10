import Link from "next/link";
import {
  IconBuildingSkyscraper,
  IconChartBar,
  IconShieldCheck,
  IconCheck,
} from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { FAQ, type FaqItem } from "@/components/faq";
import CTA from "@/components/cta";
import { Button } from "@/components/button";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, servicePageSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  path: "/for-b2b",
  title: "AI-Optimized Digital Operations for B2B and Enterprise",
  description:
    "You win in boardrooms. Ops by Noell makes sure you do not lose on the internet. Predictive customer intelligence, AI-optimized GTM strategy, and digital presence architecture for B2B companies selling into enterprise accounts.",
  ogTitle: "You win in boardrooms. We make sure you do not lose on the internet.",
  ogDescription:
    "Predictive customer intelligence, AI-optimized GTM, and enterprise-grade digital presence for B2B companies. The gap between your pitch and your website is costing you deals.",
});

type TrustSignal = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  body: string;
};

const trustSignals: TrustSignal[] = [
  {
    icon: <IconBuildingSkyscraper size={20} />,
    tag: "The seven-second window",
    title: "The procurement team left the meeting and visited your site.",
    body: "Your pitch landed. The champion is sold. Then the buying committee does their own research. They visit your site. In seven seconds, the trust you built in the boardroom either holds or collapses. Most B2B sites fail this test.",
  },
  {
    icon: <IconChartBar size={20} />,
    tag: "Consumer-grade copy",
    title: "Your website reads like a startup. Your buyers are enterprise.",
    body: "Enterprise buyers are not reading your homepage for inspiration. They are looking for proof of operational maturity, security posture, and implementation credibility. If your copy sounds like a product hunt launch, you are losing deals you never knew you were in.",
  },
  {
    icon: <IconShieldCheck size={20} />,
    tag: "Missing proof layer",
    title: "You have case studies. They are buried on page four.",
    body: "The proof exists. The results are real. But the architecture of your site does not surface it at the moment the buyer needs it. The trust signal arrives too late, or not at all. That is a structural problem, not a content problem.",
  },
];

type SystemCard = {
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
};

const systems: SystemCard[] = [
  {
    eyebrow: "Predictive Customer Intelligence",
    title: "Know who is about to move before they do.",
    description:
      "PCI reads every signal in your pipeline, from engagement patterns to buying committee behavior, and surfaces the accounts most likely to close, expand, or churn before your team notices the shift. Not a dashboard. An operational layer that tells your team what to do next.",
    bullets: [
      "Account-level signal monitoring",
      "Buying committee engagement tracking",
      "Churn and expansion prediction",
      "Actionable next-step surfacing",
    ],
  },
  {
    eyebrow: "AI-Optimized GTM Strategy",
    title: "A go-to-market motion built for how enterprise buyers actually buy.",
    description:
      "Enterprise buying is not linear. It involves multiple stakeholders, long timelines, and trust signals that most GTM strategies ignore. We build the operational layer that maps your motion to how procurement actually works, not how you wish it did.",
    bullets: [
      "Buying committee mapping and sequencing",
      "Trust signal architecture by stage",
      "Content and proof layer alignment",
      "Outbound and inbound motion design",
    ],
  },
  {
    eyebrow: "Digital Presence Architecture",
    title: "A site that holds up when procurement does their research.",
    description:
      "We rebuild the structural layer of your digital presence so that every page, every proof point, and every trust signal is positioned for the enterprise buyer who is evaluating you without your sales team in the room. Built to survive the seven-second test.",
    bullets: [
      "Enterprise-grade site architecture",
      "Proof layer positioning and sequencing",
      "Security and compliance trust signals",
      "Buyer-stage content mapping",
    ],
  },
];

const processSteps = [
  {
    number: "01",
    title: "Digital Readiness Review",
    description:
      "A 30-minute working session. We audit your current digital presence against the enterprise buyer journey, identify the specific gaps that are costing you deals, and tell you exactly what we found. No pitch. No deck.",
  },
  {
    number: "02",
    title: "Strategic Brief",
    description:
      "We deliver a written brief that maps every finding to a deal outcome. You know what is broken, what it is costing you in pipeline, and what the fix looks like before any work begins.",
  },
  {
    number: "03",
    title: "System Build",
    description:
      "We build the infrastructure. Site architecture, proof layer, PCI integration, and GTM motion designed around your buyer and your growth stage. Built by our team, not templated.",
  },
  {
    number: "04",
    title: "Ongoing Operations",
    description:
      "We run it. Signal monitoring, content updates, GTM iteration, and account management handled by our team. The system keeps working while your team closes deals.",
  },
];

const b2bFaqs: FaqItem[] = [
  {
    id: "b2b_who_is_this_for",
    question: "What types of B2B companies do you work with?",
    answer:
      "We work with SaaS companies, AI vendors, tech startups, and B2B platforms that are selling into enterprise accounts. If you have a strong product and a strong pitch but your digital presence is not keeping up with your sales motion, we are a fit.",
  },
  {
    id: "b2b_pci",
    question: "What is Predictive Customer Intelligence?",
    answer:
      "PCI is the signal layer we build on top of your existing data. It reads engagement patterns, buying committee behavior, and account signals to surface who is most likely to close, expand, or churn before your team notices the shift. It is not a dashboard you check. It is an operational layer that tells your team what to do next.",
  },
  {
    id: "b2b_timeline",
    question: "How long does it take to see results?",
    answer:
      "The Digital Readiness Review is 30 minutes and produces immediate findings. The Strategic Brief is delivered within five business days. System build timelines vary by scope, but most initial implementations are live within 30 days of signing.",
  },
  {
    id: "b2b_existing_stack",
    question: "Do you work with our existing CRM and marketing stack?",
    answer:
      "Yes. We build around the tools you already use. PCI layers on top of your CRM. The GTM motion is designed around your existing sales process. We do not require you to replace anything to get started.",
  },
  {
    id: "b2b_proof",
    question: "Do you have B2B case studies?",
    answer:
      "Our current flagship B2B implementation is running inside a live enterprise sales operation. We use it as a live proof of concept in every sales conversation. We will show you exactly how it works on the Digital Readiness Review call.",
  },
  {
    id: "b2b_pricing",
    question: "How is this priced?",
    answer:
      "B2B and enterprise engagements are scoped individually. We discuss fit, scope, and pricing on the Digital Readiness Review call. There is no standard package because enterprise buyers have different needs. We will tell you exactly what we would build and what it costs before you commit to anything.",
  },
];

export default function ForB2BPage() {
  return (
    <div>
      <JsonLd
        data={servicePageSchema({
          name: "Ops by Noell for B2B and Enterprise",
          description:
            "Predictive customer intelligence, AI-optimized GTM strategy, and digital presence architecture for B2B companies selling into enterprise accounts.",
          path: "/for-b2b",
        })}
        id="b2b-service"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "For B2B and Enterprise", path: "/for-b2b" },
        ])}
        id="b2b-breadcrumb"
      />
      <JsonLd
        data={faqPageSchema(b2bFaqs)}
        id="b2b-faq"
      />

      {/* ─── 1. HERO ──────────────────────────────────────────────────────── */}
      <Hero
        headlineLine1Start="You win in boardrooms."
        headlineLine1Accent=""
        headlineLine2Start="We make sure you do not lose"
        headlineLine2Accent="on the internet."
        headlineLine2Smaller={false}
        body="Enterprise buyers leave the meeting and do their own research. In seven seconds, the trust you built in the boardroom either holds or collapses. Ops by Noell builds the operational layer that makes sure it holds."
        footnote="Predictive Customer Intelligence. AI-Optimized GTM. Digital Presence Architecture."
        primaryCta={{ label: "Book a Digital Readiness Review", href: "/book" }}
        secondaryCta={{ label: "See How PCI Works", href: "/predictive-customer-intelligence" }}
        showProofBar={false}
        variant="wine"
      />

      {/* ─── 2. THE BOARDROOM DISCONNECT ──────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              The boardroom disconnect
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight max-w-3xl mx-auto">
              The pitch is excellent.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                The website is not.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
              Enterprise buying committees do not make decisions in the room. They do their own research. Here is where the trust collapses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustSignals.map((signal, i) => (
              <div
                key={i}
                className={cn(
                  "relative rounded-[22px] bg-white p-7 border border-warm-border",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-wine">{signal.icon}</span>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-wine/85 font-medium">
                    {signal.tag}
                  </p>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-semibold text-charcoal leading-snug mb-3">
                  {signal.title}
                </h3>
                <p className="text-sm text-charcoal/75 leading-relaxed">
                  {signal.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. PCI BAND ──────────────────────────────────────────────────── */}
      <section className="w-full bg-cream-dark py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            Predictive Customer Intelligence
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-wine leading-tight">
            Your pipeline tells you what happened. We tell you what is about to.
          </h2>
          <p className="mt-6 text-base md:text-lg text-charcoal/85 leading-relaxed">
            Every signal in your pipeline, from engagement patterns to buying committee behavior, is data your CRM is not reading. Ops by Noell reads it every day and surfaces the accounts most likely to close, expand, or churn before your team notices the shift. Not a dashboard you check. An operational layer that tells your team what to do next.
          </p>
          <p className="mt-8 font-serif italic text-lg md:text-xl text-charcoal">
            We do not just tell you who is interested. We tell you who is about to go quiet.
          </p>
          <div className="mt-10">
            <Button href="/predictive-customer-intelligence" variant="primary">
              See How PCI Works
            </Button>
          </div>
        </div>
      </section>

      {/* ─── 4. THE THREE SYSTEMS ─────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              What we build
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight max-w-3xl mx-auto">
              Three systems.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                One enterprise-grade operation.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
              Every B2B engagement is built around three interconnected systems that cover the full enterprise buyer journey, from first signal to closed deal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systems.map((system, i) => (
              <div
                key={i}
                className={cn(
                  "relative flex flex-col rounded-[22px] bg-white p-7 md:p-8 border border-warm-border",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-wine/85 font-medium mb-2">
                  {system.eyebrow}
                </p>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-3 leading-snug">
                  {system.title}
                </h3>
                <p className="text-sm md:text-base text-charcoal/75 leading-relaxed mb-6">
                  {system.description}
                </p>
                <ul className="space-y-2 flex-1">
                  {system.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <IconCheck size={14} className="text-wine shrink-0 mt-0.5" />
                      <span className="text-sm text-charcoal/80">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. LIVE PROOF ────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-14 md:py-16 bg-cream-dark">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[22px] border border-warm-border bg-white p-7 md:p-10 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              Live implementation · Premier Tech Sales Inc.
            </p>
            <p className="font-serif text-xl md:text-2xl text-charcoal leading-snug mb-5">
              Our current flagship B2B implementation is running inside a live enterprise sales operation today. We use it as a proof of concept in every sales conversation because it is the most honest demonstration we can offer.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">Live</p>
                <p className="text-[11px] text-charcoal/70 mt-1 uppercase tracking-wide">production<br />system</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">3</p>
                <p className="text-[11px] text-charcoal/70 mt-1 uppercase tracking-wide">integrated<br />systems</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">B2B</p>
                <p className="text-[11px] text-charcoal/70 mt-1 uppercase tracking-wide">enterprise<br />verified</p>
              </div>
            </div>
            <div className="border-l-2 border-wine/40 pl-4">
              <p className="text-sm md:text-base text-charcoal/80 italic leading-relaxed">
                "The site must speak their language. Predictive customer intelligence, AI-optimized GTM, and enterprise-grade operational systems. That is the brief. That is what we built."
              </p>
              <footer className="mt-3 text-[11px] uppercase tracking-[0.2em] text-charcoal/80">
                Nikki Noell · Ops by Noell
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. HOW IT STARTS ─────────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              The process
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              We do not send proposals.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                We run working sessions.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-charcoal/75 max-w-xl mx-auto leading-relaxed">
              Every B2B engagement starts with a Digital Readiness Review. No pitch. No deck. A direct conversation about what is broken and what it is costing you in pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "relative rounded-[22px] bg-white p-7 border border-warm-border",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-wine/60 mb-3">
                  {step.number}
                </p>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-charcoal/75 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. FAQ ───────────────────────────────────────────────────────── */}
      <FAQ
        faqs={b2bFaqs}
        eyebrow="Questions"
        headlineStart="Straight"
        headlineAccent="answers."
        body="Real questions from B2B founders and revenue leaders before they book a Digital Readiness Review."
      />

      {/* ─── 8. CTA ───────────────────────────────────────────────────────── */}
      <CTA
        eyebrow="The first step"
        headlineStart="Let us talk about"
        headlineAccent="your pipeline."
        body="In your free Digital Readiness Review, we audit your current digital presence against the enterprise buyer journey, identify the specific gaps costing you deals, and tell you exactly what we found."
        trustLine="No pitch. No pressure. If it is not a fit, we will say so."
        primaryCta={{ label: "Book a Digital Readiness Review", href: "/book" }}
        secondaryCta={{ label: "See How PCI Works", href: "/predictive-customer-intelligence" }}
        sourcePage="for_b2b"
      />
    </div>
  );
}
