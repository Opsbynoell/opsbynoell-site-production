import { CompareLayout, type CompareRow } from "@/components/compare-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

const PATH = "/compare/ruby-receptionists";
const ALT = "Ruby Receptionists";

export const metadata = pageMetadata({
  path: PATH,
  absoluteTitle: true,
  title: `Ops by Noell vs. ${ALT}`,
  description: `How a done-for-you AI front desk from Ops by Noell compares to ${ALT} for service businesses. Compare missed call recovery, cost, voice fit, and done-for-you setup.`,
});

const rows: CompareRow[] = [
  {
    capability: "What it is",
    opsByNoell:
      "A done-for-you AI front desk and operations layer, installed around your existing booking system.",
    alternative:
      "A live virtual receptionist service staffed by human agents who answer calls on your behalf.",
  },
  {
    capability: "Primary job",
    opsByNoell:
      "Catch missed calls, handle scheduling, run reminders, and retain existing clients. Automatically.",
    alternative:
      "Answer inbound calls during business hours and take messages or transfer calls.",
  },
  {
    capability: "After-hours coverage",
    opsByNoell:
      "Always on. Every missed call, text, web form, and DM gets a response in minutes, 24/7.",
    alternative:
      "After-hours plans available at additional cost. Coverage depends on the plan tier.",
  },
  {
    capability: "Who operates it",
    opsByNoell: "We do. It runs automatically in the background.",
    alternative:
      "Ruby's team of human receptionists. You train them on your scripts.",
  },
  {
    capability: "Voice match",
    opsByNoell:
      "Written for your voice during onboarding, tuned weekly. Sounds like your team.",
    alternative:
      "Scripted by you, read by Ruby agents. Quality depends on script quality and agent training.",
  },
  {
    capability: "Retention and reactivation",
    opsByNoell:
      "Built-in reactivation sequences, reminder cadences, and review requests. All automated.",
    alternative:
      "Not included. Ruby answers calls; it does not run follow-up or retention workflows.",
  },
  {
    capability: "Price signal",
    opsByNoell:
      "From $397/mo (Signal tier) to $1,497/mo (Full Stack). Month-to-month, done-for-you setup included.",
    alternative:
      "Plans typically start around $235/mo for limited minutes. Overages billed per minute.",
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
        id="compare-ruby-receptionists"
      />
      <CompareLayout
        sourcePage="compare_ruby_receptionists"
        alternativeName={ALT}
        title={`Ops by Noell vs. ${ALT}`}
        lead="One is a done-for-you AI front desk that runs 24/7 without a per-minute bill. The other is a live answering service staffed by human agents who work from your scripts."
        summary={
          <>
            <p>
              {ALT} is one of the most recognized live virtual receptionist services for small businesses. Human agents answer your calls, follow your scripts, and take messages. For businesses that want a warm human voice on every call during business hours, Ruby does that job well. Ops by Noell is built differently: we install and manage an AI front desk that catches every missed call around the clock, handles scheduling automatically, and runs the retention and reactivation workflows that a live answering service never touches.
            </p>
          </>
        }
        rows={rows}
        verdict={
          <>
            <p>
              Choose {ALT} if your primary need is a live human voice on inbound calls during business hours and you are comfortable with per-minute billing and a scripted experience. Choose Ops by Noell if you are losing revenue to after-hours missed calls, need automated reminders and reactivation, and want a done-for-you system that gets smarter about your business every month without adding a per-minute cost.
            </p>
          </>
        }
        internalLinks={[
          { label: "See the Noell System", href: "/systems" },
          { label: "Noell Front Desk: operations layer", href: "/noell-front-desk" },
          { label: "Read: Missed calls to missed bookings", href: "/resources/missed-calls-to-missed-bookings" },
          { label: "AI front desk vs. human receptionist", href: "/resources/ai-front-desk-vs-human-receptionist" },
        ]}
      />
    </>
  );
}
