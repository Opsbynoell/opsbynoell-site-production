import Link from "next/link";
import { Hero } from "@/components/hero";
import { LiveSystemLog, type LogRow } from "@/components/live-system-log";
import { Testimonials } from "@/components/testimonials";
import CTA from "@/components/cta";
import { FAQ, type FaqItem } from "@/components/faq";
import { Button } from "@/components/button";

export const metadata = {
  title: "Predictive Customer Intelligence | Ops by Noell",
  description:
    "We find the revenue your booking software is missing. Then we deploy the agents and the ads that recover it. Free 30-minute audit.",
  openGraph: {
    title: "Predictive Customer Intelligence | Ops by Noell",
    description:
      "The intelligence layer behind your agents, your system, and your ads.",
    url: "https://www.opsbynoell.com/predictive-customer-intelligence",
    type: "website" as const,
  },
};

const SOURCE_PAGE = "predictive-customer-intelligence" as const;

const caseRows: LogRow[] = [
  {
    time: "day 01",
    action: "booked-monthly",
    result: "last-visit 41 days ago · pattern broken",
  },
  {
    time: "day 02",
    action: "ghost-risk-score",
    result: "87 / 100 · prediction triggered",
  },
  {
    time: "day 02",
    action: "reactivation-sequence",
    result: "sent · client responded",
  },
  {
    time: "day 03",
    action: "appointment confirmed",
    result: "$240 recovered",
  },
];

const problems = [
  {
    n: "01",
    title: "The ghost pattern",
    body:
      "Loyal clients quietly stretch their visit cadence. By the time it shows up in your reports, they're at your competitor down the street.",
  },
  {
    n: "02",
    title: "The dead lead graveyard",
    body:
      "Every “let me think about it” lead has a 72-hour window. After that, conversion probability drops 80 percent. Most front desks follow up once, then forget.",
  },
  {
    n: "03",
    title: "The rebooking miss",
    body:
      "The highest-margin appointment you can sell is the one booked at checkout. It gets missed 40 to 60 percent of the time. Every miss is a lost client lifecycle.",
  },
];

const solutions = [
  {
    n: "01",
    title: "Predicts churn before it happens",
    body:
      "Every active client gets a ghost-risk score, updated continuously. You see who's drifting before they're gone, with a one-click outreach sequence ready to deploy.",
    status: "status: monitoring · always-on",
  },
  {
    n: "02",
    title: "Resurrects dead leads on autopilot",
    body:
      "Stale leads get re-scored as new signals come in. When one heats back up, you know, and the agents can re-engage them while they're warm.",
    status: "status: triggered on signal",
  },
  {
    n: "03",
    title: "Closes the rebooking loop",
    body:
      "A missed rebooking gets caught within 24 hours. The right follow-up (text, email, or live agent) fires automatically based on what converts for your business.",
    status: "status: runs after every visit",
  },
];

const deployments = [
  {
    n: "01",
    label: "intelligence + agents",
    title: "Recover what's already in your funnel.",
    body:
      "The intelligence layer watches your existing clients and leads. Noell Agents handle the outreach (calls, texts, chat, rebookings) the moment a signal fires. Best for businesses with strong inbound and gaps in the follow-through.",
    bullets: [
      "Ghost-risk monitoring on every active client",
      "Dead lead resurrection sequences",
      "Rebooking recovery within 24 hours of every visit",
      "Three AI agents handle execution end-to-end",
    ],
    status: "status: best for inbound-heavy businesses",
    href: "/agents",
  },
  {
    n: "02",
    label: "intelligence + system",
    title: "Run the whole front of your business on one platform.",
    body:
      "The intelligence layer is built into a fully managed operations platform (CRM, calendars, marketing, agents, reporting) installed and managed by our team. Best for businesses ready to consolidate off five different tools.",
    bullets: [
      "Full white-labeled operations platform",
      "Three AI agents included (Growth tier and up)",
      "Two-way integration with your PMS or booking tool",
      "Managed install in 14 days, ongoing updates, no maintenance on your end",
    ],
    status: "status: best for consolidation and replatforming",
    href: "/systems",
  },
  {
    n: "03",
    label: "intelligence + media",
    title: "Buy ads with your own customer data, not Facebook's guess.",
    body:
      "Most agencies running ads for service businesses have no idea who their client's best customers actually are. The intelligence layer does. Every active client is already scored by LTV and behavior. That data drives the targeting.",
    bullets: [
      "Lookalike audiences built from your real high-LTV cohorts",
      "Retargeting your ghost-risk list before they leave",
      "Budget allocation weighted to your highest-lifecycle services",
      "Creative briefs informed by what your existing clients actually book",
    ],
    status: "status: best for businesses ready to scale acquisition",
    // TODO: link to dedicated media page when built
    href: "#media",
  },
];

const steps = [
  {
    n: "01",
    title: "Connect",
    body:
      "Read-only integration with your booking system, CRM, and payment processor. No migration. No rip-and-replace.",
  },
  {
    n: "02",
    title: "Predict",
    body:
      "Within 48 hours, your first Revenue Signal Report: every account at risk, every lead worth re-engaging, every rebooking you're missing, ranked by dollar impact.",
  },
  {
    n: "03",
    title: "Recover",
    body:
      "Pick your deployment. Agents handle the outreach. The system runs the platform. Media buying drives new acquisition with the same data behind it. You stop losing revenue you already earned.",
  },
];

const pciFaqs: FaqItem[] = [
  {
    id: "pci-booking-software",
    question: "Will this work with my booking software?",
    answer:
      "Yes for almost everyone. We build the intelligence layer around the booking system you already use, including Boulevard, Mangomint, Vagaro, Mindbody, Square Appointments, Acuity, Jane, Dentrix, Eaglesoft, Open Dental, and Curve. If you're on something custom, we'll tell you in the first 10 minutes whether we can connect.",
  },
  {
    id: "pci-vs-reports",
    question:
      "How is this different from the reports my booking software gives me?",
    answer:
      "Your booking software tells you what happened. Predictive Customer Intelligence tells you what's about to happen, and gives you a window to act on it.",
  },
  {
    id: "pci-three-deployments",
    question: "Do I have to use all three deployments?",
    answer:
      "No. Most businesses start with one (usually Intelligence + Agents to fix the leaks they already have) and add deployments as they grow. The intelligence layer is the same underneath, so deployments stack cleanly.",
  },
  {
    id: "pci-media-vs-agency",
    question: "How is the media buying different from a normal ad agency?",
    answer:
      "A normal agency runs Facebook's targeting. We run targeting built from your actual customer data: who books, who comes back, who refers, who has the highest lifetime value. That's the difference between guessing and knowing.",
  },
  {
    id: "pci-data-safe",
    question: "Is my client data safe?",
    answer:
      "Yes. Read-only access, encrypted at rest and in transit, never shared. Built on enterprise-grade infrastructure (Vercel, Supabase).",
  },
  {
    id: "pci-no-action",
    question: "What if I don't act on the audit?",
    answer:
      "You still walk away with a free, prioritized list of revenue you're leaving on the table. Take it, fix it yourself, and we part as friends.",
  },
  {
    id: "pci-cancel",
    question: "Can I cancel anytime?",
    answer:
      "Yes. Month-to-month, no contracts. We earn the next month every month.",
  },
];

function PciMockScreen() {
  return (
    <div className="flex w-full flex-col items-stretch px-3">
      <div className="flex justify-between items-center w-full px-2 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-xs text-charcoal/70 font-medium">
            Intelligence layer · live
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-charcoal/70">
          today
        </span>
      </div>

      <div className="bg-wine rounded-2xl p-6 md:p-7 mx-1 mt-2 shadow-sm">
        <p className="text-[10px] uppercase tracking-widest text-cream/70 font-medium">
          Recovered before she rebooked elsewhere
        </p>
        <p className="font-serif text-4xl md:text-5xl font-bold text-cream mt-3">
          $240
        </p>
        <p className="text-[11px] text-cream/60 mt-2">
          Marina D. · ghost-risk 87 / 100
        </p>
        <div className="mt-5 pt-4 border-t border-cream/15">
          <p className="font-mono text-[10px] uppercase tracking-widest text-cream/65">
            pattern caught · day 03
          </p>
        </div>
      </div>
    </div>
  );
}

function CaseSummaryPanel() {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
      <div className="rounded-[18px] border border-warm-border bg-white p-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-wine/70 mb-2">
          Pattern caught
        </p>
        <p className="text-sm font-medium text-charcoal">Marina D.</p>
        <p className="font-serif text-3xl font-semibold text-wine mt-2">
          87 / 100
        </p>
        <p className="text-[11px] text-charcoal/70 mt-1">ghost-risk score</p>
      </div>
      <div className="rounded-[18px] border border-warm-border bg-white p-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-wine/70 mb-2">
          Reactivation triggered
        </p>
        <p className="text-sm font-medium text-charcoal">SMS · 11s</p>
        <p className="font-mono text-[11px] text-charcoal/70 mt-2">
          auto-sequence
        </p>
      </div>
      <div className="rounded-[18px] border border-warm-border bg-white p-5 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-wine/70 mb-2">
          Outcome
        </p>
        <p className="font-serif text-3xl font-semibold text-wine mt-1">
          $240 recovered
        </p>
        <p className="text-[11px] text-charcoal/70 mt-1">
          before she rebooked elsewhere
        </p>
      </div>
    </div>
  );
}

function ProblemSection() {
  return (
    <section className="w-full px-4 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            the gap
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            Your booking software shows you what happened.{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              Not what&rsquo;s about to.
            </span>
          </h2>
          <p className="mt-5 text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
            Most service businesses lose 15 to 30 percent of revenue to signals
            their software never surfaces. Not because the work isn&rsquo;t
            getting done, because the patterns aren&rsquo;t getting caught.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {problems.map((p) => (
            <div
              key={p.n}
              className="rounded-[22px] border border-warm-border bg-white p-6 md:p-7 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
            >
              <p className="font-mono text-[10px] tracking-[0.22em] text-wine/70 mb-3">
                {p.n}
              </p>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-3 leading-snug">
                {p.title}
              </h3>
              <p className="text-sm md:text-base text-charcoal/70 leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SolutionSection() {
  return (
    <section className="w-full px-4 py-20 md:py-28 bg-cream-dark/40">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            the intelligence layer
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            One brain. Watching everything.{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              Always on.
            </span>
          </h2>
          <p className="mt-5 text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
            Predictive Customer Intelligence is the operating layer underneath
            everything Ops by Noell deploys. It connects to the systems you
            already use, scores every client, lead, and rebooking in real time,
            and tells the rest of the stack exactly what to do next.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {solutions.map((s) => (
            <div
              key={s.n}
              className="rounded-[22px] border border-warm-border bg-white p-6 md:p-7 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] flex flex-col"
            >
              <p className="font-mono text-[10px] tracking-[0.22em] text-wine/70 mb-3">
                {s.n}
              </p>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-3 leading-snug">
                {s.title}
              </h3>
              <p className="text-sm md:text-base text-charcoal/70 leading-relaxed flex-1">
                {s.body}
              </p>
              <p className="mt-5 pt-4 border-t border-warm-border font-mono text-[10px] uppercase tracking-widest text-charcoal/70">
                {s.status}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DeploymentSection() {
  return (
    <section className="w-full px-4 py-20 md:py-28">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            how you deploy it
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            Three ways the intelligence{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              becomes revenue.
            </span>
          </h2>
          <p className="mt-5 text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
            The intelligence layer is the brain. The hands are how the work
            gets done. Pick the deployment that fits where your business is
            leaking the most.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {deployments.map((d) => (
            <div
              key={d.n}
              className="rounded-[22px] border border-warm-border bg-white p-7 md:p-8 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)] flex flex-col"
            >
              <div className="flex items-center justify-between mb-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-wine/70">
                  {d.label}
                </p>
                <span className="font-mono text-[10px] text-charcoal/70">
                  {d.n}
                </span>
              </div>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-3 leading-snug">
                {d.title}
              </h3>
              <p className="text-sm md:text-base text-charcoal/70 leading-relaxed">
                {d.body}
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-charcoal/80">
                {d.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-wine flex-shrink-0"
                    />
                    <span className="leading-relaxed">{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-4 border-t border-warm-border flex items-center justify-between gap-3">
                <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/70">
                  {d.status}
                </p>
                <Link
                  href={d.href}
                  className="text-xs font-medium text-wine hover:text-wine-dark whitespace-nowrap"
                >
                  Learn more &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="w-full px-4 py-20 md:py-28 bg-cream-dark/40 scroll-mt-24"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            how it works
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            Three steps.{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              Live in under a week.
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded-[22px] border border-warm-border bg-white p-6 md:p-7 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
            >
              <p className="font-mono text-[10px] tracking-[0.22em] text-wine/70 mb-3">
                step {s.n}
              </p>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-3 leading-snug">
                {s.title}
              </h3>
              <p className="text-sm md:text-base text-charcoal/70 leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingTeaserSection() {
  return (
    <section className="w-full px-4 py-20 md:py-28">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
          pricing
        </p>
        <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
          Two ways to run it.{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            Three deployments under each.
          </span>
        </h2>
        <p className="mt-5 text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
          Self-serve agents start at $197/mo founding rate. The full
          done-for-you operation runs $197 to $1,497/mo. Media buying retainers
          are quoted based on spend and scope.
        </p>
        <div className="mt-8">
          <Button href="/pricing" variant="secondary" className="px-6 py-3">
            See how it&rsquo;s priced &rarr;
          </Button>
        </div>
      </div>
    </section>
  );
}

export default function PredictiveCustomerIntelligencePage() {
  return (
    <div>
      <Hero
        eyebrow="A systems agency · Ops by Noell · Intelligence layer"
        headlineLine1Start="Predictive Customer"
        headlineLine1Accent="Intelligence"
        headlineLine2Start="for service businesses."
        headlineLine2Accent=""
        headlineLine2Smaller
        body="We find the revenue your booking software is missing. Then we deploy the agents and the ads that recover it."
        footnote=""
        primaryCta={{ label: "Get Your Free Audit", href: "/book" }}
        secondaryCta={{ label: "See how it works", href: "#how-it-works" }}
        showProofBar={false}
        sourcePage={SOURCE_PAGE}
        sourceSection="hero"
        mockScreen={<PciMockScreen />}
      />

      <LiveSystemLog
        eyebrow="case: marina_d  /  signal > ghost-risk > 87"
        rows={caseRows}
        separator="·"
        caption=""
      >
        <CaseSummaryPanel />
      </LiveSystemLog>

      <ProblemSection />

      <SolutionSection />

      <DeploymentSection />

      <HowItWorksSection />

      <Testimonials
        eyebrow="Proof"
        headlineStart="The system that recovered $960 in 14 days for one massage therapist"
        headlineAccent="runs the same way for you."
        body="Santa, a massage therapist in Laguna Niguel, went from digital patchwork to a system that watched her client patterns, caught her missed calls, and protected her calendar. Inside 14 days, the system had paid for itself."
        ctaLabel="Book your free audit"
        sourcePage={SOURCE_PAGE}
        sourceSection="proof"
      />

      <CTA
        eyebrow="The first step"
        headlineStart="Start with a"
        headlineAccent="free 30-minute audit."
        body="No pitch. No pressure. A clear map of where leads, clients, and rebookings are falling through, whether you work with us or not."
        trustLine="Free · 30 minutes · Live in 14 days"
        primaryCta={{ label: "Get Your Free Audit", href: "/book" }}
        secondaryCta={null}
        sourcePage={SOURCE_PAGE}
        sourceSection="offer"
      />

      <PricingTeaserSection />

      <FAQ
        eyebrow="Questions"
        headlineStart="Straight"
        headlineAccent="answers."
        body="The questions we get most often about Predictive Customer Intelligence."
        faqs={pciFaqs}
      />

      <CTA
        eyebrow=""
        headlineStart="The revenue is"
        headlineAccent="already yours."
        body="Spend 30 minutes. Get the map of what's leaking. Decide what's next from there."
        trustLine=""
        primaryCta={{ label: "Get Your Free Audit", href: "/book" }}
        secondaryCta={null}
        sourcePage={SOURCE_PAGE}
        sourceSection="final"
      />
    </div>
  );
}
