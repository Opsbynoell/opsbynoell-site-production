import Link from "next/link";
import Pricing from "@/components/pricing";
import { FAQ, type FaqItem } from "@/components/faq";
import CTA from "@/components/cta";
import { NoellAgentsCard } from "@/components/noell-agents-card";
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
  title: "Pricing — AI Front Desk for Service Businesses",
  description:
    "Two tracks. Noell Agents at $197/mo founding rate, or the full Noell System — Essentials $197, Growth $797, Custom Ops $1,497/mo.",
});

const pricingFaqs: FaqItem[] = [
  // NEW — Session 3 additions, at the top
  {
    id: "agents_vs_system",
    group: "tracks",
    question: "What's the difference between Noell Agents and the Noell System?",
    answer:
      "Noell Agents is just the AI layer — three agents handling chat, calls, and client support. You keep whatever booking tool you already use. The Noell System is the full done-for-you operations layer (client communication, scheduling, reminders, reviews, and reactivation) that we install and manage end-to-end around your booking system. Growth and Custom Ops include both.",
  },
  {
    id: "agents_upgrade_path",
    group: "tracks",
    question: "Can I start with Noell Agents and upgrade to the full system later?",
    answer:
      "Yes. If you move to Growth or Custom Ops within the first 6 months, we credit one month of agents toward Growth setup ($197) or two months toward Custom Ops setup ($394). Founder rate applies to Noell Agents specifically — the full system has its own pricing.",
  },
  {
    id: "founding_member_offer",
    group: "tracks",
    question: "What is the founding member offer and who qualifies?",
    answer:
      "The first 10 founding members of Noell Agents lock in $197/mo (vs $297/mo normal) for 24 months. In return we ask for a written testimonial after 30 days and one 15-minute reference call. The offer closes June 30, 2026, or when the first 10 spots are claimed — whichever comes first.",
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
      "Yes. Upgrades are prorated and take effect immediately — the system grows with you. Downgrades take effect at the start of the next billing month so nothing gets orphaned mid-build. If you're on Custom Ops and we're still building your Reactivation Campaigns when you downgrade, we finish what we started on the original tier. No half-built systems.",
  },
  {
    id: "commitment_guarantee",
    group: "commitment",
    question: "What if it doesn't work for my business?",
    answer:
      "Every install includes a 90-day results check-in. If by day 90 the system hasn't produced measurable lift in at least one of: recovered calls, booked appointments, or captured reviews — we rebuild the core flows at no charge. If the rebuild hasn't moved the numbers by day 120, you can cancel your subscription with no further obligation. The one-time setup fee isn't refundable once provisioning has begun.",
  },
  // Group 2 — What you're actually buying
  {
    id: "features_tier_difference",
    group: "features",
    question: "What's the difference between the three tiers in plain English?",
    answer:
      "Essentials ($197/mo) is for solo operators who just need to stop missing calls. It adds A2P-registered texting, auto-reply when you miss a call, appointment confirmation texts, and one review-request sequence. It works alongside your existing booking tool — it doesn't talk to it directly. Think of it as a smart assistant sitting next to your current setup. Growth ($797/mo) is the full front desk system. Everything in Essentials, plus Noell Support AI Chat on your website handling conversations 24/7, no-show recovery sequences, Google review automation, lead pipeline management so nothing falls through the cracks, and a monthly strategy call. Growth also integrates directly with your PMS or booking tool — reading availability, writing confirmed bookings back in. Most practices start here. Custom Ops ($1,497/mo) is for multi-location or reactivation-heavy practices. Everything in Growth, plus reactivation campaigns that win back inactive clients, multi-location sync, a custom reporting dashboard, same-day priority support, and a quarterly business review. If you have unscheduled treatment worth reactivating or more than one location to run, this is the tier.",
  },
  {
    id: "features_a2p_sms",
    group: "features",
    question: "What is A2P-registered SMS and why does it matter?",
    answer:
      "A2P stands for Application-to-Person. As of 2023, US carriers require every business that sends automated texts to be registered and approved. Unregistered senders get their messages blocked, filtered to spam, or worse — fined. A2P registration is a 2–4 week process involving business verification, campaign approval, and ongoing compliance. We handle it as part of setup. It's the reason your texts actually deliver.",
  },
  {
    id: "features_support_ai_chat",
    group: "features",
    question: "What does Noell Support AI Chat (Growth and up) actually do?",
    answer:
      "Noell Support is an AI chat agent on your website trained on your specific business — your services, pricing, hours, booking logic, tone. She handles the 80% of website conversations that are predictable: \"Do you take my insurance?\", \"What's the earliest appointment?\", \"How much is a deep tissue?\", \"Can I reschedule?\". She books appointments directly when she has enough information. When a conversation needs a human — refund requests, clinical questions, anything that smells like a complaint — she routes it to your team with the full chat context attached. She is not a generic ChatGPT wrapper.",
  },
  {
    id: "features_no_show_recovery",
    group: "features",
    question: "What is no-show recovery (Growth and up)?",
    answer:
      "When a client no-shows, most practices just lose the revenue and move on. No-show recovery automatically texts the client within minutes of the miss, offers the next two available slots on your calendar, and rebooks them without anyone at your practice lifting a finger. On average, no-show recovery rebooks 35-45% of misses within 7 days.",
  },
  {
    id: "features_review_automation",
    group: "features",
    question: "What is Google review automation (Growth and up)?",
    answer:
      "After every appointment, the system texts a review request with a one-tap link to your Google Business profile. Most practices see a 4-8× increase in review volume in the first 90 days. More recent reviews and more 5-star reviews both directly affect how high you rank when someone searches \"dentist near me\" or \"massage near me.\" This is one of the highest-leverage things a practice can do, and nobody does it consistently without automation.",
  },
  {
    id: "features_reactivation",
    group: "features",
    question: "What are reactivation campaigns (Custom Ops only)?",
    answer:
      "Reactivation campaigns automatically identify and contact inactive clients — typically 6+ months since last visit — with a sequence built around why they probably stopped coming. For dental, that's often unscheduled treatment plans sitting in the PMS; we text a friendly nudge with a direct link to reschedule. For salons, it's clients who drifted after a stylist moved. For massage and spa, it's seasonal drop-offs. Reactivation is usually the highest-ROI automation a practice can run because the leads already know and trust you.",
  },
  {
    id: "features_lead_pipeline",
    group: "features",
    question: "What is lead pipeline management (Growth and up)?",
    answer:
      "Every lead that comes into your practice — web form, missed call, chat, direct text — gets logged, tagged, and tracked through a visible pipeline: new lead → contacted → booked → consulted → decision. Leads that go cold get automated follow-up, leads that book skip ahead, leads that ghost get categorized so you see what's actually happening. It replaces the sticky-notes-and-texts-with-myself workflow most practices still run on.",
  },
  // Group 3 — Install, tools, logistics
  {
    id: "logistics_time_to_live",
    group: "logistics",
    question: "How long until the system is live?",
    answer:
      "14 days from audit-to-live on most installs. A2P registration takes 2–4 weeks on the carrier side but runs in parallel, so your SMS delivery goes live as soon as carriers approve — usually within the first 14 days. Multi-location Custom Ops builds can take up to 21 days. Your audit call confirms the timeline for your specific setup.",
  },
  {
    id: "logistics_replace_booking_tool",
    group: "logistics",
    question: "Do I need to replace my current booking tool?",
    answer:
      "No. The Noell system layers on top of the booking, practice management, and field service software you already run — across dental, salon and spa, wellness, and home services. Your team keeps the tool they trained on. We layer the communication and scheduling automation on top. On Essentials, the system works alongside your tool via SMS; on Growth and Custom Ops, it integrates directly (reads availability, writes confirmed bookings back). Tell us what you use on your audit call and we will confirm fit.",
  },
  {
    id: "logistics_managed_meaning",
    group: "logistics",
    question: "What does \"managed\" actually mean?",
    answer:
      "You never touch the backend. Ongoing copy tweaks, automation adjustments, integration fixes, new review responses, seasonal campaign setup, messaging around holidays and closures — we handle all of it. The Noell team is the admin. You get the monthly report. If something isn't working, you tell us and we fix it. Managed means you don't become an ops person in addition to running your practice.",
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
              priceMonthly: 197,
              description:
                "Three managed AI agents covering chat, calls, and existing-client support. Founding rate locked for 24 months.",
              url: "/agents",
            },
            {
              name: "Noell System — Essentials",
              priceMonthly: 197,
              description:
                "Entry tier of the managed Noell System for service businesses.",
            },
            {
              name: "Noell System — Growth",
              priceMonthly: 797,
              description:
                "Full managed Noell System, expanded hours and deeper integrations.",
            },
            {
              name: "Noell System — Custom Ops",
              priceMonthly: 1497,
              description:
                "Custom-scoped operations engagement for multi-location and higher-volume service businesses.",
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
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-8 mx-auto flex-col items-center justify-center pt-24 md:pt-28 pb-6 px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.35)] via-[rgba(240,224,214,0.60)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
          Pricing
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-tight">
          Two tracks.{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            Pick the one that fits.
          </span>
        </h1>
        <p className="relative z-20 mt-4 max-w-2xl text-center text-charcoal/75 text-sm md:text-base leading-relaxed">
          Run only the agents, or install the full system end-to-end.
        </p>
        <p className="relative z-20 mt-3 text-xs text-muted-medium">
          Curious what you could recover?{" "}
          <Link
            href="/roi"
            className="underline underline-offset-4 decoration-charcoal/55 hover:text-charcoal"
          >
            Run the ROI calculator
          </Link>
          .
        </p>
      </section>

      <NoellAgentsCard />

      <section id="noell-system" className="w-full pt-16 md:pt-24 px-4 scroll-mt-20">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
            The Noell System · Done for you
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            The full operations platform,{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              installed in 14 days.
            </span>
          </h2>
          <p className="mt-5 text-charcoal/75 max-w-2xl mx-auto">
            Three tiers. All include the done-for-you operations layer under
            your brand. Agents are included in Growth and up.
          </p>
        </div>
      </section>

      <Pricing />

      <FAQ
        eyebrow={PRICING_FAQ_EYEBROW}
        headlineStart={PRICING_FAQ_HEADLINE_START}
        headlineAccent={PRICING_FAQ_HEADLINE_ACCENT}
        body={PRICING_FAQ_BODY}
        faqs={pricingFaqs}
      />

      <CTA sourcePage="pricing" />
    </div>
  );
}
