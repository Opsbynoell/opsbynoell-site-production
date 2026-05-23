import Link from "next/link";
import Pricing from "@/components/pricing";
import { FAQ, type FaqItem } from "@/components/faq";
import CTA from "@/components/cta";
import { NoellAgentsCard } from "@/components/noell-agents-card";
import { ROICalculator } from "@/components/roi-calculator";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {
  PRICING_FAQ_EYEBROW,
  PRICING_FAQ_HEADLINE_START,
  PRICING_FAQ_HEADLINE_ACCENT,
  PRICING_FAQ_BODY,
} from "@/content/pricing";
import {
  breadcrumbSchema,
  faqPageSchema,
  pricingProductSchema,
} from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/pricing",
  title: "Pricing, AI Operations for Service Businesses and B2B",
  description:
    "Two tracks. Six tiers. Service businesses from $397/mo. B2B from $597/mo. Every engagement includes a live dashboard, done-for-you setup, and a dedicated ops partner.",
});

const pricingFaqs: FaqItem[] = [
  {
    id: "track_difference",
    group: "tracks",
    question: "What is the difference between the Service track and the B2B track?",
    answer:
      "The Service track is built for appointment-based businesses: salons, med spas, dental practices, HVAC, and similar. Three agents handle chat, phone, and client reactivation. The B2B track is built for companies selling to other businesses: SaaS, professional services, and enterprise sales. Three agents handle outbound prospecting, lead qualification, and pipeline nurturing. Both tracks include a live dashboard and done-for-you setup.",
  },
  {
    id: "tier_difference_service",
    group: "tracks",
    question: "What is the difference between Signal, System, and Full Stack?",
    answer:
      "Signal ($397/mo) is one agent: Noell Support handles 24/7 website chat and lead capture. System ($1,097/mo) adds Noell Front Desk (AI phone) and Noell Care (client reactivation), all three agents running together. Full Stack ($1,497/mo) adds a full website build or redesign, the Noell Ops CRM replacing GoHighLevel, a click-through audit, and a dedicated ops partner.",
  },
  {
    id: "tier_difference_b2b",
    group: "tracks",
    question: "What is the difference between Prospect, Pipeline, and Full Stack?",
    answer:
      "Prospect ($597/mo) is one agent: Noell Inbound handles first-touch lead qualification, ICP scoring, and routing the right prospects to the right rep. Pipeline ($1,197/mo) adds Noell Pipeline (demo scheduling, follow-up sequences, stalled-deal nudges) and Noell Account (health touchpoints, renewal sequences, upsell triggers), plus the PCI signal layer. Full Stack ($2,497/mo) adds a full website build, the Noell Ops CRM, custom account list research, and a dedicated pipeline partner.",
  },
  {
    id: "no_contract",
    group: "tracks",
    question: "Is there a contract or minimum commitment?",
    answer:
      "Month-to-month. No annual contract required. You can cancel with 30 days notice at any time. Your rate is locked at the price you signed up at for as long as you stay on that tier. Most clients stay because the agents pay for themselves within the first 60 days.",
  },
  // Dashboard
  {
    id: "dashboard_included",
    group: "features",
    question: "Is the dashboard included? What does it show?",
    answer:
      "Yes. Every Noell engagement includes the Noell Ops Dashboard, a live client dashboard built specifically for your business. For service businesses it shows your lead pipeline with HOT and WARM scoring, full conversation threads from every agent, conversion funnel from first contact to booked appointment, website analytics with top pages and traffic sources, and date range filtering (7D, 30D, 90D, All Time). For B2B engagements it shows deal stages, ICP scores, outreach status, pipeline value, and win rate. Every plan also includes a real-time notification feed so you are alerted the moment a new lead comes in, a reply arrives, or a sequence step completes. System and Full Stack tiers add analytics goals where you set monthly targets and track progress with live charts, plus an automated weekly report email every Monday summarizing leads, funnel performance, top pages, and goal progress. You see exactly what the system is doing and what it is recovering. No login required for your team, we send you a direct link.",
  },
  // Existing — Group 1 — Commitment and terms
  {
    id: "commitment_month_to_month",
    group: "commitment",
    question: "Is this month-to-month or contract?",
    answer:
      "Month-to-month. No long-term contracts. Cancel anytime with 30 days notice. Your monthly rate is locked at the price you signed up at for as long as you stay on that tier.",
  },
  {
    id: "commitment_setup_fee",
    group: "commitment",
    question: "Why is there a setup fee?",
    answer:
      "Setup covers the 14-day install: vertical-specific copy written in your voice, A2P SMS registration (required by federal carriers before any business texting is legal), integration with your existing tools, and the initial automation buildout. It's one-time and non-refundable once provisioning begins. Setup is where the system actually learns your business.",
  },
  {
    id: "commitment_price_increases",
    group: "commitment",
    question: "Do prices increase over time?",
    answer:
      "No. Your monthly rate is locked at the price you signed up at. If you upgrade tiers, the new rate applies. If you downgrade, the lower rate applies at the start of the next billing month. We don't do introductory pricing games.",
  },
  {
    id: "commitment_upgrade_downgrade",
    group: "commitment",
    question: "Can I upgrade or downgrade later?",
    answer:
      "Yes. Upgrades are prorated and take effect immediately, the system grows with you. Downgrades take effect at the start of the next billing month so nothing gets orphaned mid-build. If you're on Full Stack and we're still building your site or migrating you onto the Noell Ops CRM when you downgrade, we finish what we started on the original tier. No half-built systems.",
  },
  {
    id: "commitment_guarantee",
    group: "commitment",
    question: "What if it doesn't work for my business?",
    answer:
      "Every install includes a 90-day results check-in. If by day 90 the system hasn't produced measurable lift in at least one of: recovered calls, booked appointments, or captured reviews, we rebuild the core flows at no charge. If the rebuild hasn't moved the numbers by day 120, you can cancel your subscription with no further obligation. The one-time setup fee isn't refundable once provisioning has begun.",
  },
  // Group 2 — What you're actually buying
  {
    id: "features_tier_difference",
    group: "features",
    question: "What's the difference between the three tiers in plain English?",
    answer:
      "Signal ($397/mo) is the entry tier for owners who just need to stop missing leads. One agent, Noell Support, handles 24/7 website chat and lead capture with HOT/WARM scoring and a live dashboard. It works alongside your existing booking tool. System ($897/mo) is the full front desk. Everything in Signal, plus Noell Front Desk (AI phone, answers calls and books appointments), Noell Care (rebooks and reactivation), and deep two-way integration with your PMS or booking tool, reading availability and writing confirmed bookings back. Most practices start here. Full Stack ($1,497/mo) is for owners who want Noell to run the whole operation. Everything in System, plus a full website build or redesign, the Noell Ops CRM replacing GoHighLevel, a click-through audit, custom automation workflows, and a dedicated ops partner.",
  },
  {
    id: "features_a2p_sms",
    group: "features",
    question: "What is A2P-registered SMS and why does it matter?",
    answer:
      "A2P stands for Application-to-Person. As of 2023, US carriers require every business that sends automated texts to be registered and approved. Unregistered senders get their messages blocked, filtered to spam, or worse, fined. A2P registration is a 2–4 week process involving business verification, campaign approval, and ongoing compliance. We handle it as part of setup. It's the reason your texts actually deliver.",
  },
  {
    id: "features_support_ai_chat",
    group: "features",
    question: "What does Noell Support AI Chat (Signal and up) actually do?",
    answer:
      "Noell Support is an AI chat agent on your website trained on your specific business, your services, pricing, hours, booking logic, tone. She handles the 80% of website conversations that are predictable: \"Do you take my insurance?\", \"What's the earliest appointment?\", \"How much is a deep tissue?\", \"Can I reschedule?\". She books appointments directly when she has enough information. When a conversation needs a human, refund requests, clinical questions, anything that smells like a complaint, she routes it to your team with the full chat context attached. She is not a generic ChatGPT wrapper.",
  },
  {
    id: "features_no_show_recovery",
    group: "features",
    question: "What is no-show recovery (System and up)?",
    answer:
      "When a client no-shows, most practices just lose the revenue and move on. No-show recovery automatically texts the client within minutes of the miss, offers the next two available slots on your calendar, and rebooks them without anyone at your practice lifting a finger. On average, no-show recovery rebooks 35-45% of misses within 7 days.",
  },
  {
    id: "features_review_automation",
    group: "features",
    question: "What is Google review automation (System and up)?",
    answer:
      "After every appointment, the system texts a review request with a one-tap link to your Google Business profile. Most practices see a 4-8× increase in review volume in the first 90 days. More recent reviews and more 5-star reviews both directly affect how high you rank when someone searches \"dentist near me\" or \"massage near me.\" This is one of the highest-leverage things a practice can do, and nobody does it consistently without automation.",
  },
  {
    id: "features_reactivation",
    group: "features",
    question: "What is reactivation (System and Full Stack)?",
    answer:
      "Reactivation campaigns automatically identify and contact inactive clients, typically 6+ months since last visit, with a sequence built around why they probably stopped coming. For dental, that's often unscheduled treatment plans sitting in the PMS; we text a friendly nudge with a direct link to reschedule. For salons, it's clients who drifted after a stylist moved. For massage and spa, it's seasonal drop-offs. Reactivation is usually the highest-ROI automation a practice can run because the leads already know and trust you.",
  },
  {
    id: "features_lead_pipeline",
    group: "features",
    question: "What is lead pipeline management (System and up)?",
    answer:
      "Every lead that comes into your practice, web form, missed call, chat, direct text, gets logged, tagged, and tracked through a visible pipeline: new lead → contacted → booked → consulted → decision. Leads that go cold get automated follow-up, leads that book skip ahead, leads that ghost get categorized so you see what's actually happening. It replaces the sticky-notes-and-texts-with-myself workflow most practices still run on.",
  },
  // Group 3 — Install, tools, logistics
  {
    id: "logistics_time_to_live",
    group: "logistics",
    question: "How long until the system is live?",
    answer:
      "14 days from audit-to-live on most installs. A2P registration takes 2–4 weeks on the carrier side but runs in parallel, so your SMS delivery goes live as soon as carriers approve, usually within the first 14 days. Multi-location and Full Stack builds can take up to 21 days. Your audit call confirms the timeline for your specific setup.",
  },
  {
    id: "logistics_replace_booking_tool",
    group: "logistics",
    question: "Do I need to replace my current booking tool?",
    answer:
      "No. The Noell system layers on top of the booking, practice management, and field service software you already run, across dental, salon and spa, wellness, and home services. Your team keeps the tool they trained on. We layer the communication and scheduling automation on top. On Signal, the system works alongside your tool via SMS and chat; on System and Full Stack, it integrates directly (reads availability, writes confirmed bookings back). Tell us what you use on your audit call and we will confirm fit.",
  },
  {
    id: "logistics_managed_meaning",
    group: "logistics",
    question: "What does \"managed\" actually mean?",
    answer:
      "You never touch the backend. Ongoing copy tweaks, automation adjustments, integration fixes, new review responses, seasonal campaign setup, messaging around holidays and closures, we handle all of it. The Noell team is the admin. You get the monthly report. If something isn't working, you tell us and we fix it. Managed means you don't become an ops person in addition to running your practice.",
  },
];

export default function PricingPage() {
  return (
    <div>
      <JsonLd
        data={[
          pricingProductSchema([
            {
              name: "Noell Agents",
              priceMonthly: 397,
              description:
                "Three managed AI agents covering chat, calls, and existing-client support. Starting at $397/mo (Signal tier). Month-to-month.",
              url: "/agents",
            },
            {
              name: "Noell System: Signal",
              priceMonthly: 397,
              description:
                "Entry tier of the managed Noell System for service businesses. One AI agent, Noell Support, on 24/7 website chat with HOT/WARM lead scoring.",
            },
            {
              name: "Noell System: System",
              priceMonthly: 897,
              description:
                "Full managed Noell System: three agents (Support, Front Desk, Care), deep two-way PMS or booking integration, and the full Noell Ops Dashboard.",
            },
            {
              name: "Noell System: Full Stack",
              priceMonthly: 1497,
              description:
                "Done-for-you operations engagement: everything in System, plus a full website build, the Noell Ops CRM, click-through audit, and a dedicated ops partner.",
            },
          ]),
          faqPageSchema(pricingFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
        ]}
        id="pricing"
      />
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-8 mx-auto flex-col items-center justify-center pt-24 md:pt-28 pb-6 px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.25)] via-[rgba(31,18,25,0.85)] to-[rgba(19,11,15,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
          Pricing
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-cream leading-tight">
          Two tracks.{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            One operational standard.
          </span>
        </h1>
        <p className="relative z-20 mt-4 max-w-2xl text-center text-cream/75 text-sm md:text-base leading-relaxed">
          Service businesses: start with the agents or the full done-for-you system. B2B and SaaS: scoped individually, starting with a Digital Readiness Review ($297, credited toward your package).
        </p>
        <p className="relative z-20 mt-3 text-xs text-muted-medium">
          Curious what you could recover?{" "}
          <a
            href="#roi-calculator"
            className="underline underline-offset-4 decoration-charcoal/55 hover:text-cream"
          >
            Run the ROI calculator below
          </a>
          {" · "}
          <Link
            href="/for-b2b"
            className="underline underline-offset-4 decoration-charcoal/55 hover:text-cream"
          >
            B2B pricing
          </Link>
          .
        </p>
      </section>

      <section className="w-full px-4 pt-6 md:pt-10">
        <div className="max-w-3xl mx-auto rounded-[18px] border border-wine/25 bg-[#301A26]/60 px-5 py-4 text-center">
          <p className="text-sm md:text-base text-cream/85 leading-relaxed">
            <span className="font-semibold text-cream">
              Service track starts at $397/mo (Signal). B2B track starts at $497/mo (Prospect).
            </span>{" "}
            The difference is scope, agents only, or the full system.
          </p>
        </div>
      </section>

      <NoellAgentsCard />

      <section id="noell-system" className="w-full pt-16 md:pt-24 px-4 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
            The Noell System · Done for you
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
            The full operations platform,{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              installed in 14 days.
            </span>
          </h2>
          <p className="mt-5 text-cream/75 max-w-2xl mx-auto">
            Three tiers. All include the done-for-you operations layer under
            your brand. Agents are included in System and up.
          </p>
        </div>
      </section>

      <Pricing />

      <section id="roi-calculator" className="w-full py-12 md:py-16 px-4 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-3">
            Estimate your recovery
          </p>
          <h2 className="font-serif text-2xl md:text-4xl font-semibold text-cream leading-tight">
            See what either plan could recover for you.
          </h2>
        </div>
        <ROICalculator />
      </section>

      <FAQ
        eyebrow={PRICING_FAQ_EYEBROW}
        headlineStart={PRICING_FAQ_HEADLINE_START}
        headlineAccent={PRICING_FAQ_HEADLINE_ACCENT}
        body={PRICING_FAQ_BODY}
        faqs={pricingFaqs}
      />

      {/* ─── B2B PRICING CALLOUT ─────────────────────────────────────────── */}
      <section className="w-full px-4 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-[22px] bg-[#1a0d12] p-8 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-lilac-light font-medium mb-4">
              B2B & SaaS
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-white leading-snug mb-4">
              B2B pricing is scoped to your operation.
            </h2>
            <p className="text-white/70 leading-relaxed mb-6">
              B2B and SaaS buying cycles, pipeline complexity, and account management scope vary too much for a fixed-rate card. Every B2B engagement starts with a Digital Readiness Review: a focused working session where we audit your digital presence against the buyer journey, identify the gaps costing you deals, and tell you exactly what we would build and what it costs. $297, fully credited toward your package if you move forward. No pitch. No deck.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {[
                "Three B2B agents: Inbound, Pipeline, Account",
                "Predictive Customer Intelligence signal layer",
                "Live B2B pipeline dashboard included",
                "Digital presence architecture for B2B and SaaS buyers",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                  <span className="flex-shrink-0 w-4 h-4 rounded-full bg-lilac-light/20 text-lilac-light flex items-center justify-center text-[10px]">
                    ✓
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/digital-readiness-review"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-wine text-cream font-medium text-sm hover:bg-wine/90 transition-colors"
              >
                Book a Digital Readiness Review
              </Link>
              <Link
                href="/for-b2b"
                className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-white/20 text-white/80 font-medium text-sm hover:border-white/40 hover:text-white transition-colors"
              >
                See the B2B track
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTA sourcePage="pricing" />
    </div>
  );
}
