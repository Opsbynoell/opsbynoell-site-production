import { CompareLayout, type CompareRow } from "@/components/compare-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

const PATH = "/compare/weave";
const ALT = "Weave";

export const metadata = pageMetadata({
  path: PATH,
  absoluteTitle: true,
  title: `Ops by Noell vs. ${ALT}`,
  description: `How a done-for-you AI front desk from Ops by Noell compares to ${ALT} for dental and medical practices. Compare features, missed call recovery, and done-for-you setup.`,
});

const rows: CompareRow[] = [
  {
    capability: "What it is",
    opsByNoell:
      "A done-for-you AI front desk and operations layer, installed around your booking system.",
    alternative:
      "A patient communication and VoIP phone platform for your front desk staff to operate.",
  },
  {
    capability: "Primary job",
    opsByNoell:
      "Catch missed calls, handle scheduling, run reminders, retain existing clients.",
    alternative:
      "Unified inbox, VoIP phone system, review requests, and two-way texting.",
  },
  {
    capability: "Who operates it",
    opsByNoell: "We do. It runs automatically in the background.",
    alternative:
      "Your front desk team. It is software they log into daily.",
  },
  {
    capability: "Depth in one vertical",
    opsByNoell:
      "Shaped for dental, med spas, salons, massage, estheticians, and HVAC. Copy and cadence written by vertical.",
    alternative:
      "Strong focus on dental, optometry, and medical practices.",
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
      "From $397/mo (Signal tier) to $1,497/mo (Full Stack). Month-to-month, done-for-you setup included.",
    alternative:
      "Published SaaS pricing. Hardware phones and installation often cost extra.",
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
        id="compare-weave"
      />
      <CompareLayout
        sourcePage="compare_weave"
        alternativeName={ALT}
        title={`Ops by Noell vs. ${ALT}`}
        lead="One is a done-for-you AI front desk that catches every missed call. The other is a patient communication platform your front desk staff operates day-to-day."
        summary={
          <>
            <p>
              {ALT} is a comprehensive patient communication and VoIP platform designed for dental and medical offices. It provides your front desk staff with the tools they need to message patients and request reviews. Ops by Noell is different: we install and manage an AI front desk that acts as an extension of your team, catching missed calls and handling scheduling automatically so your staff can focus on the patients in the practice.
            </p>
          </>
        }
        rows={rows}
        verdict={
          <>
            <p>
              Choose {ALT} if you need a new VoIP phone system and a unified inbox for your existing staff to manage patient communications. Choose Ops by Noell if you are losing revenue to missed calls and want a done-for-you AI front desk that handles scheduling, reminders, and patient recovery automatically, without adding more software for your team to learn.
            </p>
          </>
        }
        internalLinks={[
          { label: "See the Noell System", href: "/systems" },
          { label: "Noell Front Desk: operations layer", href: "/noell-front-desk" },
          { label: "Read: Dental missed-call leakage", href: "/resources/dental-missed-call-leakage" },
        ]}
      />
    </>
  );
}
