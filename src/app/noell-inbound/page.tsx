import {
  IconBolt,
  IconListCheck,
  IconUserCheck,
  IconClock,
  IconTarget,
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
  path: "/noell-inbound",
  title: "Noell Inbound — B2B Lead Qualification and Intake",
  description:
    "Noell Inbound handles first-touch lead qualification, intake routing, and discovery call scheduling for B2B and enterprise sales teams. Never lose a qualified lead again.",
});

const inboundFaqs = [
  {
    id: "inbound_what_leads",
    question: "What kinds of inbound leads does Noell Inbound handle?",
    answer:
      "Contact form submissions, ad click-throughs, website chat initiations, and any other first-touch inquiry from a prospect. Noell Inbound responds immediately, qualifies intent, and routes the lead to the right person on your team.",
  },
  {
    id: "inbound_how_qualify",
    question: "How does Noell Inbound qualify a lead?",
    answer:
      "It captures company size, use case, urgency, and budget signals through a natural conversation — not a form. The result is a qualified lead profile that lands in your CRM or inbox with everything your sales rep needs to walk in prepared.",
  },
  {
    id: "inbound_not_a_fit",
    question: "What happens to leads that are not a fit?",
    answer:
      "Noell Inbound handles them gracefully. Unqualified inquiries receive a professional response and are not passed to your team. Your reps only see leads worth their time.",
  },
  {
    id: "inbound_timeline",
    question: "How long does it take to install?",
    answer:
      "Most B2B implementations are live within 14 days. We handle the configuration, training, and integration with your existing stack.",
  },
  {
    id: "inbound_crm",
    question: "Does Noell Inbound integrate with our CRM?",
    answer:
      "Yes. We build integrations with your existing CRM, calendar, and communication tools as part of the setup. No new platforms required.",
  },
];

export default function NoellInboundPage() {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "B2B & SaaS", path: "/for-b2b" },
            { name: "Noell Inbound", path: "/noell-inbound" },
          ]),
          servicePageSchema({
            name: "Noell Inbound — B2B Lead Qualification",
            description:
              "First-touch lead qualification, intake routing, and discovery call scheduling for B2B and enterprise sales teams.",
            path: "/noell-inbound",
            serviceType: "B2B AI lead qualification layer",
          }),
        ]}
        id="noell-inbound"
      />
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <Hero
        eyebrow="Noell Inbound · B2B Lead Qualification"
        headlineLine1Start="Your best leads are"
        headlineLine1Accent=""
        headlineLine2Start="deciding in seconds."
        headlineLine2Accent="Are you ready?"
        footnote="Built for B2B teams that cannot afford to lose a lead."
        body="Noell Inbound is the first-touch intake layer for B2B and enterprise sales teams. It responds instantly to every inbound inquiry, qualifies intent, and routes the right prospects to the right rep — before the lead goes cold."
        primaryCta={{ label: "Book a Digital Readiness Review", href: "/book" }}
        secondaryCta={{ label: "See all B2B agents", href: "/for-b2b" }}
        showProofBar={false}
        variant="wine"
        sourcePage="noell_inbound"
      />
      {/* ─── THE PROBLEM ─────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24 bg-[#271520]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              The problem
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              The average B2B response time is{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                47 hours.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-cream/75 max-w-2xl mx-auto leading-relaxed">
              By the time your team follows up, the prospect has already had three conversations with your competitors. Noell Inbound responds in seconds — not hours — and qualifies the lead while their intent is highest.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <IconClock size={26} />,
                title: "47-hour average response",
                body: "Most B2B sales teams respond to inbound leads in nearly two days. The prospect has moved on long before your rep picks up the thread.",
              },
              {
                icon: <IconTarget size={26} />,
                title: "78% of deals go to the first responder",
                body: "Speed to lead is the single biggest predictor of whether a qualified prospect converts. First contact wins the conversation.",
              },
              {
                icon: <IconBolt size={26} />,
                title: "Noell responds in seconds",
                body: "Noell Inbound picks up every inquiry the moment it arrives — 24 hours a day, seven days a week — and begins qualifying before your team even sees the notification.",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[17px] bg-[#f5f0eb] border border-white/10 p-6",
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
      {/* ─── WHAT NOELL INBOUND DOES ─────────────────────────────────────── */}
      <Features3
        eyebrow="What Noell Inbound does"
        headlineStart="Three functions."
        headlineAccent="One intake layer."
        body="Noell Inbound handles the full first-touch lifecycle — from the moment a prospect makes contact to the moment they land on your sales team's calendar."
        accent="lilac"
        capabilities={[
          {
            icon: <IconBolt size={28} />,
            number: "01",
            title: "Instant first-touch response",
            description:
              "Every inbound inquiry — contact form, ad click, website chat — receives an immediate, intelligent response. No auto-responder. A real conversation that captures intent.",
            points: [
              "Responds in under 60 seconds",
              "Trained in your brand voice",
              "Available 24/7/365",
            ],
          },
          {
            icon: <IconListCheck size={28} />,
            number: "02",
            title: "Lead qualification and scoring",
            description:
              "Noell Inbound captures company size, use case, urgency, and budget signals through natural conversation. Only qualified prospects are passed to your team.",
            points: [
              "ICP matching built in",
              "Qualification criteria you define",
              "Full conversation transcript included",
            ],
          },
          {
            icon: <IconUserCheck size={28} />,
            number: "03",
            title: "Routing and discovery call scheduling",
            description:
              "Qualified leads are routed to the right rep with full context. Noell Inbound books the discovery call directly — no back-and-forth email chains.",
            points: [
              "CRM integration included",
              "Calendar sync with your team",
              "Audit trail for every lead",
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
              Built for B2B teams that{" "}
              <span className="italic text-lilac-light">
                cannot afford to lose a lead.
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "SaaS companies",
                body: "High-intent prospects are landing on your site every day. Noell Inbound captures them before they bounce and routes qualified leads to your sales team in real time.",
              },
              {
                title: "AI vendors and technology providers",
                body: "Enterprise buyers evaluating AI solutions expect instant, intelligent responses. Noell Inbound demonstrates the capability you are selling — by being the first thing they experience.",
              },
              {
                title: "Professional services firms",
                body: "Consultants, agencies, and advisory firms with long sales cycles need every qualified inquiry to reach the right partner. Noell Inbound ensures nothing slips through.",
              },
              {
                title: "B2B teams with lean sales coverage",
                body: "If your team cannot monitor inbound 24/7, Noell Inbound is the coverage layer that ensures every lead is handled with the same quality as if your best rep picked up.",
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
        faqs={inboundFaqs}
      />
      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <CTA
        eyebrow="Get started"
        headlineStart="See what Noell Inbound would catch"
        headlineAccent="on your site."
        body="Book a free Digital Readiness Review and we will show you exactly how Noell Inbound would handle your current inbound leads — with your copy, in your voice, against your ICP."
        primaryCta={{ label: "Book a Digital Readiness Review", href: "/book" }}
        secondaryCta={{ label: "See all B2B agents", href: "/for-b2b" }}
        trustLine="No pitch · No contracts · Live in 14 days"
        sourcePage="noell_inbound"
      />
    </div>
  );
}
