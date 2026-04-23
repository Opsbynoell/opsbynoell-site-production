import { CompareLayout, type CompareRow } from "@/components/compare-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

const PATH = "/compare/diy-ai-receptionist";
const ALT = "DIY AI receptionist tools";

export const metadata = pageMetadata({
  path: PATH,
  title: `Ops by Noell vs. ${ALT}`,
  description: `A done-for-you AI front desk for service businesses vs. DIY AI receptionist tools. Compare setup time, voice match, drift risk, and what happens after go-live.`,
});

const rows: CompareRow[] = [
  {
    capability: "Who builds the agent",
    opsByNoell: "We do, in your voice, during onboarding.",
    alternative:
      "You do, in a web app, usually in your spare evenings.",
  },
  {
    capability: "Time to live",
    opsByNoell: "14 days, fully live, tuned, and integrated.",
    alternative:
      "As fast as you can self-configure. Often weeks of tuning before the tone is right.",
  },
  {
    capability: "Voice match",
    opsByNoell:
      "Written for your voice, reviewed with you, refined weekly.",
    alternative:
      "Generic-by-default. Quality of voice correlates to how many hours you put in.",
  },
  {
    capability: "Drift over time",
    opsByNoell:
      "We monitor and tune. You get a short monthly report.",
    alternative:
      "Quality drifts unless you actively maintain it. The burden is on you.",
  },
  {
    capability: "Integrations into scheduling",
    opsByNoell:
      "We install around your existing booking tool. Bookings land where they should.",
    alternative:
      "Integration depth depends on the tool. Often limited to links.",
  },
  {
    capability: "Who handles escalations",
    opsByNoell: "We do, with context, and hand the real conversation to you.",
    alternative: "You, with whatever the tool captured.",
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
        id="compare-diy-ai"
      />
      <CompareLayout
        alternativeName={ALT}
        title={`Ops by Noell vs. ${ALT}`}
        lead="Two ways to bring AI to the front of your business. One is a weekend project. The other is an installed, managed front desk."
        summary={
          <>
            <p>
              DIY AI receptionist tools can look appealing — low sticker price,
              fast signup. The real cost shows up in the hours you pour into
              prompts, cadences, and QA, and in the weeks it takes to get the
              tone right. Most owners we talk to either abandon the project or
              end up running a version that embarrasses them in front of
              callers.
            </p>
            <p>
              Ops by Noell is the other shape. We build, install, and tune the
              system for you in two weeks, keep tuning it weekly, and meet you
              with a short report.
            </p>
          </>
        }
        rows={rows}
        verdict={
          <>
            <p>
              Choose a DIY tool if your favorite weekend hobby is prompt
              engineering. Choose Ops by Noell if you&apos;d rather spend that
              time on your clients and trust a small team to keep the system in
              your voice.
            </p>
          </>
        }
        internalLinks={[
          { label: "See the Noell System", href: "/systems" },
          { label: "See Noell Agents pricing", href: "/agents" },
          { label: "Read: AI front desk vs. human receptionist", href: "/resources/ai-front-desk-vs-human-receptionist" },
        ]}
      />
    </>
  );
}
