import { CompareLayout, type CompareRow } from "@/components/compare-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

const PATH = "/compare/human-answering-services";
const ALT = "Human answering services";

export const metadata = pageMetadata({
  path: PATH,
  absoluteTitle: true,
  title: "Ops by Noell vs. Human Answering Services — AI Front Desk",
  description: `A done-for-you AI front desk for service businesses vs. traditional human answering services. Cost, coverage, and conversion compared.`,
});

const rows: CompareRow[] = [
  {
    capability: "First response time",
    opsByNoell:
      "Under 10 seconds on chat. Under 60 seconds on a missed call.",
    alternative:
      "Dependent on queue. Callers routinely wait 30–90 seconds for a human pickup.",
  },
  {
    capability: "Voice and brand match",
    opsByNoell:
      "Copy written in your voice during onboarding. Consistent every call.",
    alternative:
      "Whoever picks up. Quality varies shift to shift and agent to agent.",
  },
  {
    capability: "Coverage hours",
    opsByNoell: "24/7, consistent.",
    alternative:
      "Often 24/7 on paper, but premium after-hours pricing applies.",
  },
  {
    capability: "Depth per vertical",
    opsByNoell:
      "Copy, cadences, and handoffs written for your specific vertical.",
    alternative: "General scripts. Limited vertical depth.",
  },
  {
    capability: "Booking directly",
    opsByNoell:
      "Yes. Bookings land back in your real calendar.",
    alternative:
      "Often message-taking, not direct booking.",
  },
  {
    capability: "Cost profile",
    opsByNoell:
      "Flat monthly rate from $397/mo (Signal) to $1,497/mo (Full Stack). Predictable.",
    alternative:
      "Per-minute or per-call. Spikes in busy months.",
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
        id="compare-human-answering"
      />
      <CompareLayout
        sourcePage="compare_human_answering_services"
        alternativeName={ALT}
        title={`Ops by Noell vs. ${ALT}`}
        lead="Two ways to stop missing the phone. One is a person you&apos;ve never met reading a script. The other is a front desk layer installed in your voice, running 24/7."
        summary={
          <>
            <p>
              Traditional answering services offer voice coverage at per-minute pricing and usually hand you message notes. Ops by Noell books directly into your calendar, confirms, reminds, and retains, at a flat monthly rate.
            </p>
          </>
        }
        rows={rows}
        verdict={
          <>
            <p>
              Choose an answering service if voice-only human coverage is non-negotiable. Choose Ops by Noell if you want calls, texts, chats, reminders, and retention handled end-to-end in your voice at a predictable monthly cost.
            </p>
          </>
        }
        internalLinks={[
          { label: "Noell Front Desk: operations layer", href: "/noell-front-desk" },
          { label: "Santa E. case study: $2,560 recovered in 30 days", href: "/case-studies/santa-e" },
          { label: "Read: AI front desk vs. human receptionist", href: "/resources/ai-front-desk-vs-human-receptionist" },
        ]}
      />
    </>
  );
}
