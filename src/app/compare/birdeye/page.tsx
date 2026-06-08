import { CompareLayout, type CompareRow } from "@/components/compare-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

const PATH = "/compare/birdeye";
const ALT = "Birdeye";

export const metadata = pageMetadata({
  path: PATH,
  absoluteTitle: true,
  title: "Ops by Noell vs. Birdeye — AI Front Desk for Service Businesses",
  description: `How a done-for-you AI front desk from Ops by Noell compares to Birdeye for dental offices, med spas, and service businesses.`,
});

const rows: CompareRow[] = [
  {
    capability: "What it is",
    opsByNoell:
      "A done-for-you AI front desk and operations layer, installed around your existing booking system.",
    alternative:
      "A reputation management and customer experience platform for multi-location businesses.",
  },
  {
    capability: "Primary job",
    opsByNoell:
      "Catch missed calls, handle scheduling, run reminders, and retain existing clients. Automatically.",
    alternative:
      "Collect reviews, manage listings, send surveys, and centralize messaging across locations.",
  },
  {
    capability: "Who operates it",
    opsByNoell: "We do. It runs automatically in the background.",
    alternative:
      "Your marketing or operations team. It is a platform they log into and manage.",
  },
  {
    capability: "Missed call recovery",
    opsByNoell:
      "Every missed call triggers an automatic warm text-back with real booking options within 60 seconds.",
    alternative:
      "Not a core feature. Birdeye focuses on post-visit reputation, not inbound call recovery.",
  },
  {
    capability: "Review generation",
    opsByNoell:
      "Automated review requests sent at the right moment after each visit, tuned by vertical.",
    alternative:
      "Core strength. Birdeye is one of the most established review request platforms available.",
  },
  {
    capability: "Vertical depth",
    opsByNoell:
      "Shaped for dental, med spas, salons, massage, estheticians, and HVAC. Copy written by vertical.",
    alternative:
      "Broad multi-industry platform. Strong in healthcare and home services.",
  },
  {
    capability: "Price signal",
    opsByNoell:
      "From $397/mo (Signal tier) to $1,497/mo (Full Stack). Month-to-month, done-for-you setup included.",
    alternative:
      "Enterprise-tier pricing. Typically quoted per location, often $300-$500/mo per location.",
  },
];

export default function Compare() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          { name: `Ops by Noell vs. ${ALT}`, path: PATH },
        ])}
        id="compare-birdeye"
      />
      <CompareLayout
        sourcePage="compare_birdeye"
        alternativeName={ALT}
        title={`Ops by Noell vs. ${ALT}`}
        lead="One is a done-for-you AI front desk that catches missed calls and runs retention automatically. The other is a reputation management platform your team operates to collect reviews and manage listings."
        summary={
          <>
            <p>
              {ALT} is one of the most established reputation management platforms for multi-location service businesses. It excels at collecting Google reviews, managing business listings, and centralizing messaging across locations. Ops by Noell is built for a different job: we install and manage an AI front desk that catches every missed call, handles scheduling automatically, and runs the reactivation and retention workflows that a reputation platform never touches. If your primary gap is reviews, Birdeye is strong. If your primary gap is missed revenue from unanswered calls and lapsed clients, Ops by Noell addresses that directly.
            </p>
          </>
        }
        rows={rows}
        verdict={
          <>
            <p>
              Choose {ALT} if you manage multiple locations and need a centralized platform for review collection, listing management, and customer surveys. Choose Ops by Noell if you are losing revenue to missed calls and want a done-for-you AI front desk that handles scheduling, reminders, and client reactivation automatically, without adding a per-location SaaS fee for your team to manage.
            </p>
          </>
        }
        internalLinks={[
          { label: "See the Noell System", href: "/systems" },
          { label: "Noell Front Desk: operations layer", href: "/noell-front-desk" },
          { label: "Read: Review velocity and local SEO", href: "/resources/review-velocity-local-seo-service-business" },
          { label: "Read: Missed call recovery", href: "/resources/missed-call-recovery-for-service-businesses" },
        ]}
      />
    </>
  );
}
