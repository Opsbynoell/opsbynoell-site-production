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
  title: "AI-Optimized Digital Operations for B2B & SaaS",
  description:
    "Predictive Customer Intelligence, AI-Optimized GTM, and Digital Presence Architecture for B2B and SaaS companies selling into enterprise accounts.",
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
    body: "Your pitch landed. The champion is sold. Then the buying committee does their own research. They visit your site. In seven seconds, the trust you built in the boardroom either holds or collapses. Ops by Noell rebuilds the structural layer so it holds.",
  },
  {
    icon: <IconChartBar size={20} />,
    tag: "Consumer-grade copy",
    title: "Your website reads like a startup. Your buyers are enterprise.",
    body: "Enterprise buyers are not reading your homepage for inspiration. They are looking for proof of operational maturity, security posture, and implementation credibility. We rewrite the copy, reposition the proof, and rebuild the architecture for the buyer in the room.",
  },
  {
    icon: <IconShieldCheck size={20} />,
    tag: "Stalled pipeline",
    title: "Deals are moving. But not fast enough. And some just go quiet.",
      body: "Noell Inbound, Noell Pipeline, and Noell Account run your B2B revenue cycle end to end. Every deal tracked in the live Noell Ops CRM dashboard with HOT/WARM scoring and deal stage visibility.",
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
    title: "Know which accounts are about to move. Before your team does.",
    description:
      "PCI reads every signal in your pipeline, from engagement patterns to buying committee behavior, and surfaces the accounts most likely to close, expand, or churn before your team notices the shift. Not a report. An operational layer that tells your reps what to do next, today.",
    bullets: [
      "Account-level signal monitoring across your stack",
      "Buying committee engagement tracking",
      "Churn and expansion prediction",
      "Actionable next-step surfacing for each rep",
    ],
  },
  {
    eyebrow: "AI-Optimized GTM Strategy",
    title: "A go-to-market motion built for how enterprise buyers actually buy.",
    description:
      "Enterprise buying is not linear. It involves multiple stakeholders, long timelines, and trust signals that most GTM strategies ignore. We build the operational layer that maps your motion to how procurement actually works, not how you wish it did. Fewer stalled deals. Faster cycles.",
    bullets: [
      "Buying committee mapping and sequencing",
      "Trust signal architecture by deal stage",
      "Content and proof layer alignment",
      "Outbound and inbound motion design",
    ],
  },
  {
    eyebrow: "Digital Presence Architecture",
    title: "A site that holds up when procurement does their research.",
    description:
      "We rebuild the structural layer of your digital presence so that every page, every proof point, and every trust signal is positioned for the enterprise buyer evaluating you without your sales team in the room. Built to survive the seven-second test. Built to close.",
    bullets: [
                  "Site architecture and copy rebuilt for B2B buyers",
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
      "A focused working session ($297, fully credited toward your package if you move forward). We audit your current digital presence against the enterprise buyer journey, identify the specific gaps that are costing you deals, and tell you exactly what we found. No pitch. No deck.",
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
      "The Digital Readiness Review is a focused working session that produces immediate findings ($297, fully credited toward your package if you move forward). The Strategic Brief is delivered within five business days. System build timelines vary by scope, but most initial implementations are live within 30 days of signing.",
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
      "B2B and SaaS engagements are scoped individually. We discuss fit, scope, and pricing on the Digital Readiness Review call. There is no standard package because every B2B operation has different needs. We will tell you exactly what we would build and what it costs before you commit to anything.",
  },
];

export default function ForB2BPage() {
  return (
    <div>
      <JsonLd
        data={servicePageSchema({
          name: "Ops by Noell for B2B & SaaS",
          description:
            "Predictive customer intelligence, AI-optimized GTM strategy, and digital presence architecture for B2B and SaaS companies.",
          path: "/for-b2b",
        })}
        id="b2b-service"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "For B2B & SaaS", path: "/for-b2b" },
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
        body="B2B and SaaS buyers leave the meeting and do their own research. In seven seconds, the trust you built in the boardroom either holds or collapses. Ops by Noell builds the operational layer, the agents, and the pipeline visibility that makes sure it holds."
        footnote="Three B2B agents. Predictive Customer Intelligence. Live pipeline dashboard. Done for you."
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
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight max-w-3xl mx-auto">
              The pitch is excellent.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                The website is not.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-cream/75 max-w-2xl mx-auto leading-relaxed">
              Here is where the trust collapses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustSignals.map((signal, i) => (
              <div
                key={i}
                className={cn(
                  "relative rounded-[22px] bg-[#271520] p-7 border border-wine/20 shadow-[0_0_0_1px_rgba(139,42,66,0.15),0_8px_32px_rgba(139,42,66,0.08)]",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-wine">{signal.icon}</span>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-wine/85 font-medium">
                    {signal.tag}
                  </p>
                </div>
                <h3 className="font-serif text-lg md:text-xl font-semibold text-cream leading-snug mb-3">
                  {signal.title}
                </h3>
                <p className="text-sm text-cream/75 leading-relaxed">
                  {signal.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. PCI BAND ──────────────────────────────────────────────────── */}
      <section className="w-full bg-[#301A26] py-16 md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            Predictive Customer Intelligence
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-wine leading-tight">
            Your pipeline tells you what happened. We tell you what is about to.
          </h2>

          <p className="mt-8 font-serif italic text-lg md:text-xl text-cream">
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
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight max-w-3xl mx-auto">
              Three systems.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                One full-stack B2B operation.
              </span>
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {systems.map((system, i) => (
              <div
                key={i}
                className={cn(
                  "relative flex flex-col rounded-[22px] bg-[#271520] p-7 md:p-8 border border-wine/20 shadow-[0_0_0_1px_rgba(139,42,66,0.15),0_8px_32px_rgba(139,42,66,0.08)]",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-wine/85 font-medium mb-2">
                  {system.eyebrow}
                </p>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-cream mb-3 leading-snug">
                  {system.title}
                </h3>
                <p className="text-sm md:text-base text-cream/75 leading-relaxed mb-6">
                  {system.description}
                </p>
                <ul className="space-y-2 flex-1">
                  {system.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <IconCheck size={14} className="text-wine shrink-0 mt-0.5" />
                      <span className="text-sm text-cream/80">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. B2B AGENTS ────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24 bg-[#1a0d12]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-lilac-light font-medium mb-4">
              The agents
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white leading-tight max-w-3xl mx-auto">
              Three agents.{" "}
              <span className="italic text-lilac-light">
                One B2B operations layer.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
              Each agent handles a distinct phase of the B2B revenue cycle. Together, they cover the full journey from first inbound signal to long-term account retention.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
              {
                eyebrow: "Noell Inbound",
                title: "Every inbound lead qualified before it goes cold.",
                description:
                  "Noell Inbound responds to every inquiry in seconds, qualifies intent against your ICP, and routes the right prospects to the right rep. No more leads sitting in an inbox for 48 hours.",
                href: "/noell-inbound",
                bullets: ["Instant first-touch response", "ICP-matched qualification", "Discovery call scheduling"],
              },
              {
                eyebrow: "Noell Pipeline",
                title: "Deals moving. Follow-up handled. Nothing stalls.",
                description:
                  "Noell Pipeline schedules demos, runs multi-touch follow-up cadences, and reactivates stalled deals without your reps manually managing every thread. Your team closes. Noell handles the motion.",
                href: "/noell-pipeline",
                bullets: ["Demo and call scheduling", "Multi-touch follow-up cadences", "Stalled deal reactivation"],
              },
              {
                eyebrow: "Noell Account",
                title: "Clients retained. Renewals handled. Expansion triggered.",
                description:
                  "Noell Account manages health touchpoints, renewal sequences, and upsell triggers so your clients stay, grow, and refer. Post-sale revenue on autopilot.",
                href: "/noell-account",
                bullets: ["Health signal monitoring", "Renewal sequences", "Upsell trigger conversations"],
              },
            ].map((agent, i) => (
              <Link
                key={i}
                href={agent.href}
                className={cn(
                  "relative flex flex-col rounded-[22px] bg-[#271520]/5 border border-white/10 p-7 md:p-8",
                  "hover:bg-[#271520]/10 transition-colors"
                )}
              >
                <p className="text-[10px] uppercase tracking-[0.2em] text-lilac-light font-medium mb-2">
                  {agent.eyebrow}
                </p>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-white mb-3 leading-snug">
                  {agent.title}
                </h3>
                <p className="text-sm md:text-base text-white/60 leading-relaxed mb-6">
                  {agent.description}
                </p>
                <ul className="space-y-2 flex-1">
                  {agent.bullets.map((bullet, j) => (
                    <li key={j} className="flex items-start gap-2.5">
                      <IconCheck size={14} className="text-lilac-light shrink-0 mt-0.5" />
                      <span className="text-sm text-white/70">{bullet}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-lilac-light font-medium">
                  Learn more →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5.5 PIPELINE DASHBOARD CALLOUT ───────────────────────────────── */}
      <section className="w-full px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[22px] bg-[#271520] border border-white/10 p-8 md:p-10 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1">
                <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-3">
                  B2B Pipeline Dashboard
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream leading-snug mb-4">
                  Your entire pipeline, visible in one place.
                </h2>
                <p className="text-cream/75 leading-relaxed mb-6">
                  Every account your Noell agents touch is tracked in a live B2B pipeline dashboard. Deal stages, ICP scores, outreach status, pipeline value, and win rate. Table view or kanban. You see exactly what is moving and what is stalled.
                </p>
                <ul className="space-y-2.5">
                  {[
                    "Deal stages: Prospect, Qualified, Demo, Proposal, Negotiation, Closed",
                    "ICP scoring and outreach status per account",
                    "Pipeline value and win rate at a glance",
                    "Full conversation threads from every B2B agent",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-cream/80">
                      <IconCheck size={14} className="text-wine shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-shrink-0 flex flex-col gap-3 md:items-end">
                <div className="rounded-[16px] bg-[#1a0d12] px-6 py-5 text-center min-w-[180px]">
                  <p className="font-serif text-3xl font-semibold text-lilac-light mb-1">Live</p>
                  <p className="text-[11px] text-white/60 uppercase tracking-wide">included with<br />every engagement</p>
                </div>
                <p className="text-[11px] text-cream/50 text-center">
                  Included in all B2B engagements
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. LIVE PROOF ───────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-14 md:py-16 bg-[#301A26]">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-[22px] border border-white/10 bg-[#271520] p-7 md:p-10 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              Live implementation · Premier Tech Sales Inc.
            </p>
              <p className="font-serif text-xl md:text-2xl text-cream leading-snug mb-5">
                Three agents, PCI, and a live pipeline dashboard. Running inside a real B2B sales operation today. We show it on every Digital Readiness Review call.
              </p>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">3</p>
                <p className="text-[11px] text-cream/70 mt-1 uppercase tracking-wide">B2B agents<br />running live</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">Live</p>
                <p className="text-[11px] text-cream/70 mt-1 uppercase tracking-wide">pipeline<br />dashboard</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-3xl md:text-4xl font-semibold text-wine">PCI</p>
                <p className="text-[11px] text-cream/70 mt-1 uppercase tracking-wide">signal layer<br />active</p>
              </div>
            </div>
            <div className="border-l-2 border-wine/40 pl-4">
              <p className="text-sm md:text-base text-cream/80 italic leading-relaxed">
                "The site must speak their language. Predictive customer intelligence, AI-optimized GTM, and B2B-grade operational systems. That is the brief. That is what we built. And it is running right now."
              </p>
              <footer className="mt-3 text-[11px] uppercase tracking-[0.2em] text-cream/80">
                Nikki Noell · Ops by Noell
              </footer>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. HOW IT STARTS ─────────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              The process
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              We do not send proposals.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                We run working sessions.
              </span>
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {processSteps.map((step, i) => (
              <div
                key={i}
                className={cn(
                  "relative rounded-[22px] bg-[#271520] p-7 border border-wine/20 shadow-[0_0_0_1px_rgba(139,42,66,0.15),0_8px_32px_rgba(139,42,66,0.08)]",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-wine/60 mb-3">
                  {step.number}
                </p>
                <h3 className="font-serif text-xl font-semibold text-cream mb-3">
                  {step.title}
                </h3>
                <p className="text-sm md:text-base text-cream/75 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. FAQ ───────────────────────────────────────────────────────── */}
      <FAQ
        faqs={b2bFaqs}
        eyebrow="Questions"
        headlineStart="Straight"
        headlineAccent="answers."
        body="Real questions from B2B founders and revenue leaders before they book a Digital Readiness Review."
      />

      {/* ─── 9. CTA ───────────────────────────────────────────────────────── */}
      <CTA
        eyebrow="The first step"
        headlineStart="Let us talk about"
        headlineAccent="your pipeline."
        body="In your Digital Readiness Review ($297, credited toward your package), we audit your current digital presence against the B2B buyer journey, identify the specific gaps costing you deals, and tell you exactly what we found."
        trustLine="No pitch. No pressure. If it is not a fit, we will say so."
        primaryCta={{ label: "Book a Digital Readiness Review", href: "/book" }}
        secondaryCta={{ label: "See How PCI Works", href: "/predictive-customer-intelligence" }}
        sourcePage="for_b2b"
      />
    </div>
  );
}
