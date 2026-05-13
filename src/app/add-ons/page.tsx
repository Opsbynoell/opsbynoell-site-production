"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/button";

const addOns = [
  {
    number: "01",
    name: "Digital Infrastructure",
    tagline: "The foundation everything else runs on.",
    description:
      "Disconnected tools, manual handoffs, and no single source of truth are the silent killers of growth. This layer connects everything, automates the repetitive, and gives you one place to see what is actually happening in your business.",
    items: [
      { label: "Tech Stack Audit + Cleanup", price: "$297", cadence: "one-time" },
      { label: "CRM + Pipeline Setup", price: "$497 setup", cadence: "+ $197/mo" },
      { label: "Workflow Automation (3 per quarter)", price: "$297", cadence: "/mo" },
      { label: "Unified Analytics Dashboard", price: "$197", cadence: "/mo" },
    ],
  },
  {
    number: "02",
    name: "Online Presence",
    tagline: "If they cannot find you, they cannot hire you.",
    description:
      "Technical SEO, local search visibility, and website performance are the infrastructure layer of discoverability. Most businesses skip this entirely. The ones that do not compound quietly while everyone else wonders why their traffic is flat.",
    items: [
      { label: "Technical SEO Audit", price: "$497", cadence: "one-time" },
      { label: "Local SEO Management", price: "$297", cadence: "/mo" },
      { label: "SEO Content Engine (4 posts/month)", price: "$497", cadence: "/mo" },
      { label: "Website Performance Optimization", price: "$297", cadence: "/mo" },
    ],
  },
  {
    number: "03",
    name: "Social Media",
    tagline: "Consistency is the product.",
    description:
      "Most businesses post when they remember. This makes it automatic, on-brand, and tied to a strategy rather than a mood. The goal is not virality. The goal is showing up every week so that when someone is ready to buy, you are already in their head.",
    items: [
      { label: "Content Calendar + Scheduling (12 posts/mo, 2 platforms)", price: "$297", cadence: "/mo" },
      { label: "Short-Form Video Scripts (4 per month)", price: "$197", cadence: "/mo" },
      { label: "Social Listening + Engagement", price: "$197", cadence: "/mo" },
      { label: "LinkedIn B2B Outreach", price: "$497", cadence: "/mo" },
    ],
  },
  {
    number: "04",
    name: "Brand Kit + Visual Identity",
    tagline: "The vibe is the first thing they feel.",
    description:
      "Before anyone reads a word, they have already decided if you are credible. A mismatched logo, an inconsistent color palette, and copy that sounds like it was written by a committee will cost you deals you never knew you lost. This layer makes sure the answer is always yes.",
    items: [
      { label: "Brand Audit", price: "$297", cadence: "one-time" },
      { label: "Full Brand Kit Build", price: "$997", cadence: "one-time" },
      { label: "Copywriting Voice Guide", price: "$497", cadence: "one-time" },
      { label: "Visual Templates (social, email, proposals, decks)", price: "$297", cadence: "one-time" },
    ],
  },
  {
    number: "05",
    name: "Psychology + Conversion",
    tagline: "The words and the flow that make people say yes.",
    description:
      "This is the layer most businesses skip. It is the difference between a website that explains what you do and one that makes people want to buy it. Buyer psychology, decision architecture, and conversion copy built around how your specific customer actually thinks.",
    items: [
      { label: "Conversion Copy Rewrite (full site)", price: "$997", cadence: "one-time" },
      { label: "Full Funnel Design + Build", price: "$1,497", cadence: "one-time" },
      { label: "7-Email Nurture Sequence", price: "$497", cadence: "one-time" },
      { label: "Offer Positioning Workshop (90 min, written output)", price: "$497", cadence: "one-time" },
    ],
  },
  {
    number: "06",
    name: "Operational Systems",
    tagline: "The back office that runs itself.",
    description:
      "The processes that eat your time and never show up on a revenue report until they break. Documented, automated, and handed back to you so the business can run without you having to be in every room at once.",
    items: [
      { label: "SOP Documentation (5 core processes)", price: "$497", cadence: "one-time" },
      { label: "Client Onboarding System", price: "$697", cadence: "one-time" },
      { label: "Automated Reporting + KPI Dashboard", price: "$197", cadence: "/mo" },
      { label: "Team Playbook (role-specific guides for every hire)", price: "$497", cadence: "one-time" },
    ],
  },
];

const headcountComparison = [
  { role: "Director of Marketing", annual: "$95,000/yr", monthly: "$7,917/mo" },
  { role: "SEO Specialist", annual: "$58,000/yr", monthly: "$4,833/mo" },
  { role: "CRM + Ops Admin", annual: "$52,000/yr", monthly: "$4,333/mo" },
  { role: "Brand Designer", annual: "$65,000/yr", monthly: "$5,417/mo" },
  { role: "Social Media Manager", annual: "$48,000/yr", monthly: "$4,000/mo" },
];

export default function AddOnsPage() {
  return (
    <main className="bg-[#1F1219] min-h-screen text-cream">

      {/* Hero */}
      <section className="pt-28 pb-16 px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-wine mb-4">
            Beyond Enterprise
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-cream leading-tight mb-6">
            Build Your Own Stack
          </h1>
          <p className="text-lg text-cream/70 max-w-2xl leading-relaxed">
            Every service below is something most businesses assume requires a full-time hire or an agency retainer.
            Layer any combination onto your base package. One partner. One invoice. No hand-holding required.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Button href="/pricing" variant="wine">
              View base packages
            </Button>
            <Button href="/book" variant="secondary">
              Book a scoping call
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="border-t border-white/10 max-w-5xl mx-auto" />

      {/* Add-on cards */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {addOns.map((addon, i) => (
            <motion.div
              key={addon.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="rounded-[20px] border border-white/10 bg-white/[0.025] p-7 flex flex-col"
            >
              {/* Card header */}
              <div className="mb-5">
                <p className="text-[10px] uppercase tracking-[0.3em] text-wine/60 mb-2">
                  {addon.number}
                </p>
                <h2 className="font-serif text-xl font-semibold text-cream mb-1">
                  {addon.name}
                </h2>
                <p className="text-sm font-medium text-wine/90 mb-3">
                  {addon.tagline}
                </p>
                <p className="text-sm text-cream/55 leading-relaxed">
                  {addon.description}
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 mb-5" />

              {/* Line items */}
              <ul className="space-y-4 flex-1">
                {addon.items.map((item) => (
                  <li key={item.label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-cream/80 leading-snug">{item.label}</span>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-semibold text-cream">{item.price}</span>
                      <span className="text-xs text-wine/80 ml-1">{item.cadence}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Full Ops Partner section */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="rounded-[24px] border border-wine/30 bg-wine/10 p-10"
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-wine mb-4">
            Full Ops Partner
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream mb-3">
            $3,500 – $6,500 / month
          </h2>
          <p className="text-cream/70 max-w-2xl mb-2 leading-relaxed">
            Your base package plus three to five add-ons, a dedicated ops partner, a monthly strategy session, and a quarterly business review.
          </p>
          <p className="text-sm text-cream/50 max-w-2xl mb-8 leading-relaxed">
            This is not a bundle of line items. It is a relationship where you hand over the operational and marketing layer of your business and it gets handled. The headcount comparison below is why the math works.
          </p>

          {/* Headcount comparison table */}
          <div className="rounded-[16px] border border-white/10 overflow-hidden mb-8">
            <div className="grid grid-cols-3 px-5 py-3 bg-white/[0.04] border-b border-white/10">
              <span className="text-[11px] uppercase tracking-[0.2em] text-cream/40">Role</span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-cream/40 text-right">Annual</span>
              <span className="text-[11px] uppercase tracking-[0.2em] text-cream/40 text-right">Monthly</span>
            </div>
            {headcountComparison.map((row, i) => (
              <div
                key={row.role}
                className={`grid grid-cols-3 px-5 py-4 ${i < headcountComparison.length - 1 ? "border-b border-white/[0.06]" : ""}`}
              >
                <span className="text-sm text-cream/80">{row.role}</span>
                <span className="text-sm text-cream/60 text-right">{row.annual}</span>
                <span className="text-sm text-cream/60 text-right">{row.monthly}</span>
              </div>
            ))}
            <div className="grid grid-cols-3 px-5 py-4 bg-white/[0.04] border-t border-white/10">
              <span className="text-sm font-semibold text-cream">Total headcount</span>
              <span className="text-sm font-semibold text-cream text-right">$318,000/yr</span>
              <span className="text-sm font-semibold text-cream text-right">$26,500/mo</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="rounded-[12px] border border-wine/40 bg-wine/20 px-5 py-3">
              <p className="text-xs text-wine/70 mb-0.5">With Ops by Noell</p>
              <p className="text-2xl font-serif font-semibold text-cream">$3,500 – $6,500 / mo</p>
              <p className="text-xs text-cream/50 mt-0.5">One retainer. No benefits. No turnover. No training.</p>
            </div>
            <Button href="/book" variant="wine">
              Book a scoping call
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Footer note */}
      <div className="border-t border-white/10 max-w-5xl mx-auto" />
      <section className="py-12 px-6 max-w-5xl mx-auto text-center">
        <p className="text-sm text-cream/50 max-w-xl mx-auto">
          All engagements start with a free audit call. No bait pricing, no mystery scope.
          Your rate is locked from day one.
        </p>
        <p className="text-xs italic text-cream/35 mt-3 max-w-xl mx-auto">
          Add-ons can be layered onto any base package at any time. Monthly add-ons are billed alongside your base retainer and can be paused with 30 days notice.
        </p>
      </section>

    </main>
  );
}
