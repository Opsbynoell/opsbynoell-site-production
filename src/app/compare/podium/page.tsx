import { CompareLayout, type CompareRow } from "@/components/compare-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

const PATH = "/compare/podium";
const ALT = "Podium";

export const metadata = pageMetadata({
  path: PATH,
  title: `Ops by Noell vs. ${ALT}`,
  description: `How a done-for-you AI front desk from Ops by Noell compares to ${ALT} for service businesses — scope, done-for-you setup, and who the system is really for.`,
});

const rows: CompareRow[] = [
  {
    capability: "What it is",
    opsByNoell:
      "A done-for-you AI front desk and operations layer, installed around your booking system.",
    alternative:
      "A broad local-business messaging and reviews platform. Many modules, configured by your team.",
  },
  {
    capability: "Primary job",
    opsByNoell:
      "Catch missed calls, handle scheduling, run reminders, retain existing clients.",
    alternative:
      "Centralized messaging, review requests, text marketing, payment collection.",
  },
  {
    capability: "Who operates it",
    opsByNoell: "We do.",
    alternative:
      "Your front desk team, trained on the platform.",
  },
  {
    capability: "Depth in one vertical",
    opsByNoell:
      "Shaped for dental, med spas, salons, massage, estheticians, and HVAC. Copy and cadence written by vertical.",
    alternative:
      "Horizontal. Same product across many categories.",
  },
  {
    capability: "Voice match",
    opsByNoell: "Written for your voice during onboarding, tuned weekly.",
    alternative:
      "Templates you customize yourself, with time.",
  },
  {
    capability: "Price signal",
    opsByNoell:
      "From $197/mo (Noell Agents) or $197–$1,497/mo (full system) with one-time setup. Month-to-month.",
    alternative:
      "Published SaaS pricing. Often higher when stacked with SMS/voice modules.",
  },
];

export default function Compare() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: PATH },
          { name: `Ops by Noell vs. ${ALT}`, path: PATH },
        ])}
        id="compare-podium"
      />
      <CompareLayout
        sourcePage="compare_podium"
        alternativeName={ALT}
        title={`Ops by Noell vs. ${ALT}`}
        lead="One is a done-for-you AI front desk managed end-to-end. The other is a broad messaging and reviews platform your team runs."
        summary={
          <>
            <p>
              {ALT} is a general-purpose local-business messaging platform.
              It&apos;s wide — messaging, reviews, text-to-pay — and your team
              operates it. Ops by Noell is narrow and deep: we install and
              manage an AI front desk shaped specifically for service
              businesses, in your voice, so your team doesn&apos;t run another
              tool.
            </p>
          </>
        }
        rows={rows}
        verdict={
          <>
            <p>
              Choose {ALT} if you want a broad platform your front desk will
              operate day to day, with many features you can roll in over time.
              Choose Ops by Noell if you want the front-of-house handled for
              you — missed-call recovery, confirmations, reminders, and
              retention — by a team that writes and tunes it in your voice.
            </p>
          </>
        }
        internalLinks={[
          { label: "See the Noell System", href: "/systems" },
          { label: "Noell Front Desk — operations layer", href: "/noell-front-desk" },
          { label: "Read: Missed-call recovery for service businesses", href: "/resources/missed-call-recovery-for-service-businesses" },
        ]}
      />
    </>
  );
}
