import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, servicePageSchema } from "@/lib/schema";

const OVERVIEW_SRC = "/images/dashboard-b2b-overview.png";
const OVERVIEW_ALT =
  "B2B Pipeline Dashboard overview, showing open deals, pipeline value, meetings booked, win rate, average deal size, and stalled deals.";

const STAGE_SRC = "/images/dashboard-b2b-pipeline-stage.png";
const STAGE_ALT =
  "B2B Pipeline Dashboard by stage, showing pipeline distribution from Lead to Closed Won, deal value per stage, and the account-level table.";

export const metadata = pageMetadata({
  path: "/platform/b2b-pipeline",
  title: "B2B Pipeline Dashboard",
  description:
    "The live B2B dashboard that ships with the Inbound, Pipeline, and Full Stack tiers. Deal stages, ICP scores, account tracking, pipeline value.",
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

export default function B2BPipelinePlatformPage() {
  return (
    <div className="min-h-screen bg-[#130B0F]">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Platform", path: "/platform/b2b-pipeline" },
            { name: "B2B Pipeline Dashboard", path: "/platform/b2b-pipeline" },
          ]),
          servicePageSchema({
            name: "Noell B2B Pipeline Dashboard",
            description:
              "Live B2B dashboard: deal stages, ICP scores, account-level tracking, pipeline value, win rate, stalled deals, and outreach status across all B2B agents.",
            path: "/platform/b2b-pipeline",
            serviceType: "B2B AI pipeline dashboard",
          }),
        ]}
        id="platform-b2b-pipeline"
      />

      <section className="relative max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-10 md:pb-14">
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-5">
          Platform · B2B &amp; SaaS
        </p>
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-cream leading-[1.1] max-w-4xl">
          B2B Pipeline Dashboard
        </h1>
        <p className="mt-6 max-w-2xl text-cream/75 text-base md:text-lg leading-relaxed">
          Account-based pipeline tracking across the Noell Inbound, Pipeline,
          and Account agents. Every deal, every ICP score, every meeting booked,
          every outreach status, in one live view.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Link
            href="/digital-readiness-review"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-wine text-cream font-semibold text-sm hover:bg-wine-dark transition-colors"
          >
            Book a Digital Readiness Review
          </Link>
          <Link
            href="/for-b2b"
            className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-[#271520]/70 border border-white/10 text-cream font-medium text-sm hover:bg-[#271520] transition-colors"
          >
            See the B2B track
          </Link>
        </div>
      </section>

      <section className="w-full px-4 pb-12">
        <div className="max-w-6xl mx-auto space-y-10">
          <BrowserFrame
            src={OVERVIEW_SRC}
            alt={OVERVIEW_ALT}
            path="dashboard.opsbynoell.com / b2b-pipeline"
            priority
          />
          <p className="text-center text-sm text-cream/65 max-w-2xl mx-auto leading-relaxed">
            Open deals, pipeline value, meetings booked, win rate, average deal
            size, stalled deals, and daily data merges from your CRM, all on one
            screen.
          </p>

          <BrowserFrame
            src={STAGE_SRC}
            alt={STAGE_ALT}
            path="dashboard.opsbynoell.com / b2b-pipeline?view=stage"
          />
          <p className="text-center text-sm text-cream/65 max-w-2xl mx-auto leading-relaxed">
            Pipeline-by-stage view: deal value per stage, account-level table
            with ICP score, current outreach status, last activity, and the
            next follow-up scheduled by the agent.
          </p>
        </div>
      </section>

      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: "Account-based, not contact-based",
              body: "Tracks the company, the contacts inside it, and the deal value attached, the way B2B sales teams actually work.",
            },
            {
              title: "Live ICP scoring",
              body: "Every account gets a 0–100 ICP score, updated as new signals arrive. Sales sees who to call first without asking.",
            },
            {
              title: "Daily CRM merge",
              body: "Pulls from GoHighLevel and your outreach tool overnight. The dashboard you see at 9am is current to last night.",
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
            Included with every B2B engagement.
          </p>
          <p className="mt-4 text-sm md:text-base text-cream/70 max-w-xl mx-auto">
            Inbound, Pipeline, and Full Stack tiers all ship with the B2B
            Pipeline Dashboard. Configured to your ICP and pipeline stages
            during onboarding.
          </p>
          <div className="mt-8 flex justify-center gap-3 flex-col sm:flex-row">
            <Link
              href="/digital-readiness-review"
              className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-wine text-cream font-semibold text-sm hover:bg-wine-dark transition-colors"
            >
              Book a Digital Readiness Review
            </Link>
            <Link
              href="/for-b2b"
              className="inline-flex items-center justify-center h-12 px-7 rounded-xl bg-[#271520]/70 border border-white/10 text-cream font-medium text-sm hover:bg-[#271520] transition-colors"
            >
              See the B2B track
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
