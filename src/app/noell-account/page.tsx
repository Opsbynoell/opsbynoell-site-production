import {
  IconHeartHandshake,
  IconRefresh,
  IconShieldCheck,
  IconAlertTriangle,
  IconUsers,
  IconTrendingUp,
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
  path: "/noell-account",
  title: "Noell Account — B2B Account Management and Retention",
  description:
    "Noell Account manages account health touchpoints, renewal sequences, upsell triggers, and support triage for B2B and enterprise teams. Keep clients, grow revenue, reduce churn.",
});

const accountFaqs = [
  {
    id: "account_what_handles",
    question: "What does Noell Account actually manage?",
    answer:
      "Account health touchpoints, renewal sequences, upsell trigger conversations, and support triage. Everything that happens after the deal closes to keep clients engaged and growing.",
  },
  {
    id: "account_churn",
    question: "How does Noell Account detect churn risk?",
    answer:
      "It monitors engagement signals — response rates, usage patterns, support ticket frequency — and initiates a proactive check-in before disengagement becomes a decision to leave.",
  },
  {
    id: "account_renewal",
    question: "How does it handle renewals?",
    answer:
      "Noell Account initiates renewal conversations at the right time based on contract timelines you configure. It handles the early touchpoints and escalates to your account manager when human judgment is needed.",
  },
  {
    id: "account_crm",
    question: "Does Noell Account integrate with our CRM?",
    answer:
      "Yes. Every touchpoint, escalation, and account signal is logged in your CRM. Your team always has full context on every account.",
  },
  {
    id: "account_timeline",
    question: "How long does it take to go live?",
    answer:
      "Most B2B account management implementations are live within 14 days. We configure the health signals, renewal timelines, and escalation rules with you during onboarding.",
  },
];

export default function NoellAccountPage() {
  return (
    <div className="min-h-screen bg-[#f5f0eb]">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "B2B & SaaS", path: "/for-b2b" },
            { name: "Noell Account", path: "/noell-account" },
          ]),
          servicePageSchema({
            name: "Noell Account — B2B Account Management",
            description:
              "Account health touchpoints, renewal sequences, upsell triggers, and support triage for B2B and enterprise teams.",
            path: "/noell-account",
            serviceType: "B2B AI account management layer",
          }),
        ]}
        id="noell-account"
      />
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <Hero
        eyebrow="Noell Account · B2B Account Management"
        headlineLine1Start="Winning the client is"
        headlineLine1Accent=""
        headlineLine2Start="only half the"
        headlineLine2Accent="revenue."
        footnote="Built for B2B account teams that cannot afford to lose a client."
        body="Noell Account is the post-sale operations layer for B2B and enterprise teams. It manages account health touchpoints, renewal sequences, upsell triggers, and support triage — so your clients stay, grow, and refer."
        primaryCta={{ label: "Book a Digital Readiness Review", href: "/book" }}
        secondaryCta={{ label: "See all B2B agents", href: "/for-b2b" }}
        showProofBar={false}
        variant="wine"
        sourcePage="noell_account"
      />
      {/* ─── THE PROBLEM ─────────────────────────────────────────────────── */}
      <section className="w-full px-4 py-16 md:py-24 bg-[#271520]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              The problem
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              Most churn is visible{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                weeks before it happens.
              </span>
            </h2>
            <p className="mt-6 text-base md:text-lg text-cream/75 max-w-2xl mx-auto leading-relaxed">
              Clients do not leave overnight. They go quiet. They stop engaging. They start evaluating alternatives. Noell Account detects the early signals and responds before the relationship reaches the point of no return.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                icon: <IconAlertTriangle size={26} />,
                title: "Silent clients are at-risk clients",
                body: "When a client stops reaching out, most teams assume everything is fine. Noell Account treats silence as a signal and initiates a check-in before disengagement becomes a decision.",
              },
              {
                icon: <IconUsers size={26} />,
                title: "Account managers are stretched thin",
                body: "When one account manager is covering 20 accounts, proactive touchpoints become reactive firefighting. Noell Account handles the cadence so your team can focus on the relationships that need them most.",
              },
              {
                icon: <IconTrendingUp size={26} />,
                title: "Expansion revenue is being left on the table",
                body: "Most B2B companies have significant expansion revenue available in their existing client base. Noell Account identifies the signals and initiates the conversation at the right moment.",
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
      {/* ─── WHAT NOELL ACCOUNT DOES ─────────────────────────────────────── */}
      <Features3
        eyebrow="What Noell Account does"
        headlineStart="Three functions."
        headlineAccent="One account layer."
        body="Noell Account manages the full post-sale lifecycle — from onboarding through renewal and expansion — so your clients feel supported without your team manually managing every touchpoint."
        accent="lilac"
        capabilities={[
          {
            icon: <IconHeartHandshake size={28} />,
            number: "01",
            title: "Account health and retention touchpoints",
            description:
              "Noell Account monitors account health signals and sends proactive touchpoints before disengagement becomes churn. Check-ins, milestone acknowledgments, and relationship maintenance — all automated.",
            points: [
              "Health signal monitoring",
              "Proactive check-in sequences",
              "Escalation to account manager when needed",
            ],
          },
          {
            icon: <IconRefresh size={28} />,
            number: "02",
            title: "Renewal sequences and contract management",
            description:
              "Noell Account initiates renewal conversations at the right time — not too early to feel pushy, not too late to lose the deal. Renewal reminders, contract review scheduling, and negotiation prep are all handled.",
            points: [
              "Renewal timeline configured by you",
              "Multi-touch renewal sequences",
              "Contract anniversary tracking",
            ],
          },
          {
            icon: <IconShieldCheck size={28} />,
            number: "03",
            title: "Upsell triggers and support triage",
            description:
              "When an expansion signal fires, Noell Account initiates the conversation. When a support issue arrives, it triages and routes with full context. Your team gets involved at exactly the right moment.",
            points: [
              "Expansion signal detection",
              "Support triage and routing",
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
                retention is revenue.
              </span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: "SaaS companies with recurring revenue",
                body: "Every churned account is a compounding loss. Noell Account keeps your existing clients engaged, identifies at-risk accounts early, and manages the renewal process so your MRR stays intact.",
              },
              {
                title: "Professional services with retainer clients",
                body: "Agencies, consultancies, and advisory firms with ongoing client relationships need consistent, professional touchpoints between deliverables. Noell Account maintains the relationship without adding to your team's workload.",
              },
              {
                title: "Enterprise accounts with complex relationships",
                body: "Large accounts have multiple stakeholders, long contract cycles, and high expansion potential. Noell Account tracks the relationship across contacts and ensures no thread goes unmanaged.",
              },
              {
                title: "Teams managing more accounts than capacity allows",
                body: "When your account managers are stretched past what is sustainable, Noell Account is the infrastructure layer that ensures every client receives the attention they expect.",
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
        faqs={accountFaqs}
      />
      {/* ─── CTA ─────────────────────────────────────────────────────────── */}
      <CTA
        eyebrow="Get started"
        headlineStart="See what Noell Account would do"
        headlineAccent="for your clients."
        body="Book a free Digital Readiness Review and we will map your current account management process, identify where clients are at risk, and show you exactly how Noell Account would close the gaps."
        primaryCta={{ label: "Book a Digital Readiness Review", href: "/book" }}
        secondaryCta={{ label: "See all B2B agents", href: "/for-b2b" }}
        trustLine="No pitch · No contracts · Live in 14 days"
        sourcePage="noell_account"
      />
    </div>
  );
}
