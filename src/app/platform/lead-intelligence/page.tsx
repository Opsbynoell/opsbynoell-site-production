import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, servicePageSchema } from "@/lib/schema";

const OVERVIEW_SRC = "/images/dashboard-lead-intelligence-overview.png";
const OVERVIEW_ALT =
  "Lead Intelligence Dashboard overview, showing HOT and WARM lead counts, new leads this week, conversion rate, tasks due, score drops, a 7-day HOT leads chart, lead source breakdown, and a four-step conversion funnel.";

const LEADS_SRC = "/images/dashboard-lead-intelligence-leads.png";
const LEADS_ALT =
  "Lead Intelligence Dashboard lead table, showing priority (P1/P2/P3), visitor name and phone, intent (HOT/WARM), assigned agent (Noell Support, Front Desk, Care), trigger source, follow-up status, AI score, and last-contact date.";

export const metadata = pageMetadata({
  path: "/platform/lead-intelligence",
  title: "Lead Intelligence Dashboard",
  description:
    "The live dashboard included with every Noell service engagement: HOT and WARM lead scoring, conversation threads, lead source breakdown, and conversion funnel.",
});

function BrowserFrame({
  src,
  alt,
  path,
  priority = false,
}: {
  src: string;
  alt: string;
  path: string;
  priority?: boolean;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1F1219] shadow-[0px_34px_60px_0px_rgba(28,25,23,0.4)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-[#130B0F]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
        <div className="flex-1 mx-3">
          <div className="bg-[#1A0F14] rounded-md px-3 py-1 text-[11px] font-mono text-cream/40 text-center max-w-md mx-auto">
            {path}
          </div>
        </div>
      </div>
      <Image
        src={src}
        alt={alt}
        width={2400}
        height={1500}
        priority={priority}
        sizes="(min-width: 1024px) 1100px, 100vw"
        className="w-full h-auto block"
      />
    </div>
  );
}

export default function LeadIntelligencePlatformPage() {
  return (
    <div className="min-h-screen bg-[#130B0F]">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Platform", path: "/platform/lead-intelligence" },
            { name: "Lead Intelligence Dashboard", path: "/platform/lead-intelligence" },
          ]),
          servicePageSchema({
            name: "Noell Lead Intelligence Dashboard",
            description:
              "Live client dashboard for service businesses: HOT/WARM lead scoring, conversation threads, conversion funnel, website analytics, lead source breakdown.",
            path: "/platform/lead-intelligence",
            serviceType: "AI lead intelligence dashboard",
          }),
        ]}
        id="platform-lead-intelligence"
      />

      <section className="relative max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-10 md:pb-14">
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-5">
          Platform · Service businesses
        </p>
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-cream leading-[1.1] max-w-4xl">
          Lead Intelligence Dashboard
        </h1>
        <p className="mt-6 max-w-2xl text-cream/75 text-base md:text-lg leading-relaxed">
          Every Noell service engagement includes a live client dashboard.
          Every lead, every conversation, every booking — scored, threaded,
          and tracked. You see exactly what the system is doing and what it
          is recovering.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-wine text-cream font-semibold text-sm hover:bg-wine-dark transition-colors"
          >
            Book a demo to see it live
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-[#271520]/70 border border-white/10 text-cream font-medium text-sm hover:bg-[#271520] transition-colors"
          >
            See pricing
          </Link>
        </div>
      </section>

      <section className="w-full px-4 pb-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <BrowserFrame
            src={OVERVIEW_SRC}
            alt={OVERVIEW_ALT}
            path="dashboard.opsbynoell.com / lead-intelligence"
            priority
          />
          <p className="text-center text-sm text-cream/65 max-w-2xl mx-auto leading-relaxed">
            HOT leads, WARM leads, new-this-week, conversion rate, tasks due,
            score drops, and the live source breakdown (chat, SMS, calls), all
            on one screen.
          </p>

          <BrowserFrame
            src={LEADS_SRC}
            alt={LEADS_ALT}
            path="dashboard.opsbynoell.com / lead-intelligence?view=leads"
          />
          <p className="text-center text-sm text-cream/65 max-w-2xl mx-auto leading-relaxed">
            The lead table: every visitor sorted by priority, with intent
            scoring, the agent that owns the conversation, the trigger that
            started it, and the AI score driving the follow-up.
          </p>
        </div>
      </section>

      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "HOT / WARM scoring",
              body: "Every new lead is scored on the spot from the conversation, the source, and the signals attached. No human triage step.",
            },
            {
              title: "Threaded conversations",
              body: "Every chat, call, and SMS for a lead in one thread. You see what was said, what was offered, what's pending.",
            },
            {
              title: "Live conversion funnel",
              body: "HOT → contacted → booked → closed. Date-range filterable. Source breakdown built in.",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-white/10 bg-[#271520] p-6 shadow-[0px_4px_8px_0px_rgba(28,25,23,0.05)]"
            >
              <h3 className="font-serif text-lg font-semibold text-cream mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-cream/70 leading-relaxed">{card.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="w-full px-4 my-16 md:my-20">
        <div className="max-w-4xl mx-auto rounded-[32px] bg-[#301A26]/70 border border-white/10 px-6 py-14 md:py-20 text-center">
          <p className="font-serif italic text-xl md:text-3xl text-cream leading-snug">
            Included with every Noell engagement.
          </p>
          <p className="mt-4 text-sm md:text-base text-cream/70 max-w-xl mx-auto">
            Signal, System, and Full Stack tiers all ship with the Lead Intelligence Dashboard.
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-col sm:flex-row">
            <Link
              href="/book"
              className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-wine text-cream font-semibold text-sm hover:bg-wine-dark transition-colors"
            >
              Book a demo to see it live
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-[#271520]/70 border border-white/10 text-cream font-medium text-sm hover:bg-[#271520] transition-colors"
            >
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
