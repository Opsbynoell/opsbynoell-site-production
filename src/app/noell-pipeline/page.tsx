import {
  IconCalendar,
  IconSend,
  IconRepeat,
  IconClock,
  IconAlertTriangle,
  IconChartBar,
} from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";
import { Features3 } from "@/components/features3";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, servicePageSchema } from "@/lib/schema";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  path: "/noell-pipeline",
  title: "Noell Pipeline, B2B Sales Operations and Follow-Up",
  description:
    "Noell Pipeline handles demo scheduling, follow-up sequences, and deal-stage management for B2B teams.",
});

const pipelineFaqs = [
  {
    id: "pipeline_what_handles",
    question: "What does Noell Pipeline actually handle?",
    answer:
      "Demo and discovery call scheduling, post-meeting follow-up sequences, proposal acknowledgment, and deal-stage nudges. Everything that happens between your sales conversations.",
  },
  {
    id: "pipeline_crm",
    question: "Does Noell Pipeline integrate with our CRM?",
    answer:
      "Yes. We build the integration with your existing CRM as part of setup. Every touchpoint is logged, every lead status is updated, and your reps always have full context.",
  },
  {
    id: "pipeline_custom",
    question: "Can we configure the follow-up sequences?",
    answer:
      "Yes. Sequences are built around your sales process, your timelines, and your brand voice. We configure them with you during onboarding.",
  },
  {
    id: "pipeline_timeline",
    question: "How long does it take to go live?",
    answer:
      "Most B2B pipeline implementations are live within 14 days. We handle configuration, CRM integration, and calendar sync.",
  },
  {
    id: "pipeline_reps",
    question: "Does this replace our sales reps?",
    answer:
      "No. Noell Pipeline handles the operational work between conversations so your reps can focus on the conversations themselves. Your team closes deals. Noell Pipeline keeps them from dying in the follow-up.",
  },
];

export default function NoellPipelinePage() {
  return (
    <div className="min-h-screen bg-[#130B0F]">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "B2B & SaaS", path: "/for-b2b" },
            { name: "Noell Pipeline", path: "/noell-pipeline" },
          ]),
          servicePageSchema({
            name: "Noell Pipeline: B2B Sales Operations",
            description:
              "Demo scheduling, follow-up sequences, and deal-stage management for B2B sales teams.",
            path: "/noell-pipeline",
            serviceType: "B2B AI sales operations layer",
          }),
        ]}
        id="noell-pipeline"
      />
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <Hero
        eyebrow="Noell Pipeline · B2B Sales Operations"
        headlineLine1Start="Deals do not die in the pitch."
        headlineLine1Accent=""
        headlineLine2Start="They die in the"
        headlineLine2Accent="follow-up."
        footnote="Built for B2B sales teams that cannot afford to lose a deal."
        body="Demo scheduling, follow-up sequences, and deal-stage management, without your reps manually managing every thread."
        primaryCta={{ label: "Book a Digital Readiness Review", href: "/book" }}
        secondaryCta={{ label: "See all B2B agents", href: "/for-b2b" }}
        showProofBar={false}
        variant="wine"
        sourcePage="noell_pipeline"
      />
      {/* ─── THE PROBLEM ─────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24 bg-[#271520]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              The problem
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              Most pipeline loss happens{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                between meetings.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-cream/75 max-w-2xl mx-auto leading-relaxed">
              A great discovery call means nothing if the follow-up email takes three days, the demo reminder never goes out, or the proposal sits unacknowledged for two weeks. Noell Pipeline fills the gaps your reps cannot.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <IconClock size={26} />,
                title: "Delayed follow-up kills deals",
                body: "80% of sales require five or more follow-up touchpoints. Most reps stop after two. The deals that close are the ones where someone kept showing up.",
              },
              {
                icon: <IconAlertTriangle size={26} />,
                title: "Manual scheduling creates friction",
                body: "Every back-and-forth email to schedule a demo is an opportunity for the prospect to disengage. Noell Pipeline eliminates the friction and books the next step automatically.",
              },
              {
                icon: <IconChartBar size={26} />,
                title: "Quiet deals are dying deals",
                body: "When a prospect goes silent, most reps wait. Noell Pipeline detects stalled deals and sends a calibrated nudge before the opportunity closes permanently.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[17px] bg-[#271520] border border-white/10 p-6",
                  "shadow-[0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-wine/10 text-wine flex items-center justify-center mb-4">
                  {card.icon}
                </div>
                <h3 className="font-serif text-lg font-semibold text-cream mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-cream/70 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── WHAT NOELL PIPELINE DOES ────────────────────────────────────── */}
      <Features3
        eyebrow="What Noell Pipeline does"
        headlineStart="Three functions."
        headlineAccent="One pipeline layer."
        body="Noell Pipeline manages the operational work between your sales conversations so your reps can focus on the conversations themselves."
        accent="lilac"
        capabilities={[
          {
            icon: <IconCalendar size={28} />,
            number: "01",
            title: "Demo and discovery call scheduling",
            description:
              "Noell Pipeline books the next step in your sales process automatically, no back-and-forth email chains, no manual calendar management. The meeting lands on your rep's calendar with full context.",
            points: [
              "Calendar sync with your full team",
              "Automated reminders sent to prospects",
              "Reschedule handling included",
            ],
          },
          {
            icon: <IconSend size={28} />,
            number: "02",
            title: "Follow-up sequences and cadences",
            description:
              "After every meeting, proposal, or touchpoint, Noell Pipeline sends the right follow-up at the right time. Sequences are configured around your sales process and run automatically.",
            points: [
              "Post-meeting follow-up within 24 hours",
              "Proposal acknowledgment sequences",
              "Multi-touch cadences you define",
            ],
          },
          {
            icon: <IconRepeat size={28} />,
            number: "03",
            title: "Deal-stage nudges and reactivation",
            description:
              "When a deal goes quiet, Noell Pipeline detects the silence and sends a calibrated nudge. When a prospect re-engages, it routes them back to the right rep with full context.",
            points: [
              "Stalled deal detection",
              "Re-engagement sequences",
              "Full CRM logging included",
            ],
          },
        ]}
      />
      {/* ─── WHO IT IS FOR ───────────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24 bg-[#1a0d12]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-lilac-light font-medium mb-4">
              Who it is for
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-white leading-tight">
              Built for B2B teams where{" "}
              <span className="italic text-lilac-light">
                every deal matters.
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "SaaS sales teams",
                body: "High-velocity pipelines require consistent follow-up at scale. Noell Pipeline handles the operational cadence so your reps can focus on closing, not chasing.",
              },
              {
                title: "B2B and SaaS sales with long cycles",
                body: "Long B2B sales cycles require sustained, intelligent touchpoints over months. Noell Pipeline maintains the relationship between your conversations without your team manually tracking every thread.",
              },
              {
                title: "Founders selling directly",
                body: "When you are the sales team, every hour spent on scheduling and follow-up is an hour not spent selling. Noell Pipeline gives you back that time.",
              },
              {
                title: "Revenue teams scaling past capacity",
                body: "When your team is growing faster than your ops can support, Noell Pipeline is the infrastructure layer that keeps deals moving without adding headcount.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-[17px] border border-white/10 bg-[#271520]/5 p-6"
              >
                <h3 className="font-serif text-lg font-semibold text-white mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ─── FAQ ─────────────────────────────────────────────────────────── */}
      <FAQ
        accent="lilac"
        eyebrow="Questions"
        headlineStart="Straight"
        headlineAccent="answers."
        body="Real questions from B2B founders and revenue leaders before they book a Digital Readiness Review."
        faqs={pipelineFaqs}
      />
      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <CTA
        eyebrow="Get started"
        headlineStart="See what Noell Pipeline would do"
        headlineAccent="for your deals."
        body="Book a Digital Readiness Review ($297, credited toward your package) and we will map your current sales process, identify where deals are dying, and show you exactly how Noell Pipeline would close the gaps."
        primaryCta={{ label: "Book a Digital Readiness Review", href: "/book" }}
        secondaryCta={{ label: "See all B2B agents", href: "/for-b2b" }}
        trustLine="No pitch · No contracts · Live in 14 days"
        sourcePage="noell_pipeline"
      />
    </div>
  );
}
