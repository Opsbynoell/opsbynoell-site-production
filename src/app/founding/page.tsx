import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Current Pricing, Ops by Noell",
  description: "Private pricing overview. Not publicly listed.",
  robots: { index: false, follow: false },
};

const SERVICE_TIERS = [
  {
    name: "Signal",
    launchPrice: "$397",
    standardPrice: "$497",
    cadence: "/mo",
    highlight: false,
    description: "One agent. Done for you. Live in 14 days.",
    includes: [
      "Noell Support: 24/7 website chat and lead capture",
      "HOT/WARM lead scoring on every conversation",
      "Live lead intelligence dashboard",
      "Monthly performance report",
      "Done-for-you setup and ongoing tuning",
    ],
  },
  {
    name: "System",
    launchPrice: "$897",
    standardPrice: "$1,097",
    cadence: "/mo",
    highlight: true,
    description: "Three agents. Full coverage. The complete service operations layer.",
    includes: [
      "Noell Support: 24/7 website chat and lead capture",
      "Noell Front Desk: AI phone answering, 24/7",
      "Noell Care: lapsed client reactivation",
      "Live lead intelligence dashboard with date range filtering",
      "Bi-weekly ops calls",
      "Quarterly site audit",
      "Done-for-you setup and ongoing tuning",
    ],
  },
  {
    name: "Full Stack",
    launchPrice: "$1,197",
    standardPrice: "$1,497",
    cadence: "/mo",
    highlight: false,
    description: "Everything in System plus a full website build and CRM replacement.",
    includes: [
      "Everything in System",
      "Full website build or redesign",
      "Noell Ops CRM: pipeline, iMessage outreach, email sequences",
      "Click-through audit and conversion optimization",
      "Dedicated ops partner",
      "Priority onboarding",
    ],
  },
];

const B2B_TIERS = [
  {
    name: "Inbound",
    launchPrice: "$497",
    standardPrice: "$597",
    cadence: "/mo",
    highlight: false,
    description: "One agent. First-touch lead qualification and intake, done for you.",
    includes: [
      "Noell Inbound: AI lead qualification and intake (first-touch responses, ICP scoring, routing)",
      "Live B2B pipeline dashboard",
      "Monthly performance report",
      "Done-for-you setup and ongoing tuning",
    ],
  },
  {
    name: "Pipeline",
    launchPrice: "$997",
    standardPrice: "$1,197",
    cadence: "/mo",
    highlight: true,
    description: "Three agents. Full B2B revenue cycle from first touch to renewal.",
    includes: [
      "Noell Inbound: lead qualification and intake",
      "Noell Pipeline: demo scheduling, follow-up sequences, stalled-deal nudges",
      "Noell Account: health touchpoints, renewal sequences, upsell triggers",
      "PCI (Predictive Customer Intelligence) signal layer",
      "Live B2B pipeline dashboard with deal stages and ICP scores",
      "Bi-weekly pipeline calls",
      "ICP refinement and list hygiene",
    ],
  },
  {
    name: "Full Stack",
    launchPrice: "$1,997",
    standardPrice: "$2,497",
    cadence: "/mo",
    highlight: false,
    description: "Everything in Pipeline plus a full website build and dedicated pipeline partner.",
    includes: [
      "Everything in Pipeline",
      "Full website build or redesign",
      "Noell Ops CRM: pipeline, sequences, iMessage + email reporting",
      "Custom account list research",
      "Digital presence architecture",
      "Dedicated pipeline partner",
    ],
  },
];

function TierCard({
  tier,
}: {
  tier: (typeof SERVICE_TIERS)[0];
}) {
  return (
    <div
      className={`relative rounded-2xl p-7 flex flex-col gap-5 border transition-all ${
        tier.highlight
          ? "border-[#8B2A42] bg-[#271520] shadow-[0_0_32px_rgba(139,42,66,0.18)]"
          : "border-[#3D1F2B] bg-[#1F1219]"
      }`}
    >
      {tier.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B2A42] text-[#F5EAE0] text-xs font-semibold px-4 py-1 rounded-full tracking-wide">
          Most Popular
        </div>
      )}

      <div>
        <div className="text-xs font-semibold tracking-widest text-[#8B2A42] uppercase mb-1">
          {tier.name}
        </div>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-4xl font-bold text-[#F5EAE0]">{tier.launchPrice}</span>
          <span className="text-[#C4A8D4] text-sm mb-1">{tier.cadence}</span>
          <span className="text-[#7A5A65] text-sm mb-1 ml-2 line-through">{tier.standardPrice}/mo standard</span>
        </div>
        <p className="text-[#C4A8D4] text-sm leading-relaxed">{tier.description}</p>
      </div>

      <ul className="flex flex-col gap-2.5">
        {tier.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-[#F5EAE0]/80">
            <span className="mt-0.5 text-[#8B2A42] text-base leading-none">✓</span>
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-2">
        <Link
          href="/book"
          className="block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all bg-[#8B2A42] text-[#F5EAE0] hover:bg-[#B5415E]"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default function FoundingPage() {
  return (
    <main className="min-h-screen bg-[#130B0F] text-[#F5EAE0]">
      {/* Header */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#271520] border border-[#8B2A42]/40 rounded-full px-4 py-1.5 text-xs font-semibold tracking-widest text-[#8B2A42] uppercase mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B2A42] animate-pulse" />
          Current Pricing
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#F5EAE0] mb-5 leading-tight">
          Current Pricing
        </h1>
        <p className="text-[#C4A8D4] text-lg max-w-2xl mx-auto leading-relaxed">
          Standard rates are shown with a strikethrough. Your rate is locked from the day you sign up.
        </p>
      </section>

      {/* What's included */}
      <section className="max-w-3xl mx-auto px-6 pb-14">
        <div className="bg-[#1F1219] border border-[#3D1F2B] rounded-2xl p-7 grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-[#F5EAE0] mb-1">Rate locked</div>
            <div className="text-sm text-[#C4A8D4]">Your launch price is locked from day one, regardless of future standard rate increases</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#F5EAE0] mb-1">Done for you</div>
            <div className="text-sm text-[#C4A8D4]">Setup, onboarding, and ongoing tuning are all included in every tier</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#F5EAE0] mb-1">Month-to-month</div>
            <div className="text-sm text-[#C4A8D4]">No annual contract. Cancel with 30 days notice at any time.</div>
          </div>
        </div>
      </section>

      {/* Service Track */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="mb-8">
          <div className="text-xs font-semibold tracking-widest text-[#8B2A42] uppercase mb-2">Track 01</div>
          <h2 className="text-2xl font-bold text-[#F5EAE0]">Service Business Track</h2>
          <p className="text-[#C4A8D4] text-sm mt-1">For appointment-based and local service businesses.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {SERVICE_TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      {/* B2B Track */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="mb-8">
          <div className="text-xs font-semibold tracking-widest text-[#C4A8D4] uppercase mb-2">Track 02</div>
          <h2 className="text-2xl font-bold text-[#F5EAE0]">B2B Track</h2>
          <p className="text-[#C4A8D4] text-sm mt-1">For B2B companies with a defined ICP and a sales pipeline to fill.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {B2B_TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </div>
      </section>

      {/* Footer note */}
      <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
        <p className="text-[#7A5A65] text-sm leading-relaxed">
          This page is not publicly listed or indexed. It is shared directly in sales conversations.
        </p>
        <p className="text-[#7A5A65] text-sm mt-3">
          Questions?{" "}
          <Link href="/book" className="text-[#C4A8D4] underline underline-offset-2 hover:text-[#F5EAE0]">
            Book a call
          </Link>{" "}
          or email{" "}
          <a href="mailto:noell@opsbynoell.com" className="text-[#C4A8D4] underline underline-offset-2 hover:text-[#F5EAE0]">
            noell@opsbynoell.com
          </a>
        </p>
      </section>
    </main>
  );
}
