import { CompareLayout, type CompareRow } from "@/components/compare-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

const PATH = "/compare/local-business-messaging-platforms";
const ALT = "Broad local-business messaging platforms";

export const metadata = pageMetadata({
  path: PATH,
  title: `Ops by Noell vs. ${ALT}`,
  description: `Why service businesses often graduate from broad local messaging platforms to a done-for-you AI front desk. Compare scope, operating load, and what actually happens on the phone.`,
});

const rows: CompareRow[] = [
  {
    capability: "Scope",
    opsByNoell:
      "Narrow and deep. AI front desk for service businesses, installed end-to-end.",
    alternative:
      "Wide and shallow. Messaging, reviews, text marketing, payments, feedback — many modules.",
  },
  {
    capability: "Who runs it",
    opsByNoell: "We do.",
    alternative:
      "Your front desk or marketing coordinator runs the dashboard.",
  },
  {
    capability: "What the phone actually does",
    opsByNoell:
      "Missed calls are caught and booked automatically within seconds, in your voice.",
    alternative:
      "Call routing and SMS handoff depend on the module. Often not the focus.",
  },
  {
    capability: "Retention layer",
    opsByNoell:
      "Existing clients are held by Noell Care — rebook, reschedule, service questions.",
    alternative:
      "Retention typically handled via text marketing broadcasts.",
  },
  {
    capability: "Done-for-you voice",
    opsByNoell:
      "Copy written by the team, reviewed with you, tuned weekly.",
    alternative:
      "Template-driven, customized by you.",
  },
  {
    capability: "Best fit",
    opsByNoell:
      "Service businesses that want the front of the shop handled, not another dashboard.",
    alternative:
      "Multi-location brands with staff to operate a broad platform.",
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
        id="compare-lbp"
      />
      <CompareLayout
        alternativeName={ALT}
        title="Ops by Noell vs. broad local-business messaging platforms"
        lead="Two different philosophies. One is a wide platform your team operates. The other is a narrow, managed front desk layer that runs itself."
        summary={
          <>
            <p>
              Broad local-business messaging platforms are built to do a lot of
              things for a lot of kinds of businesses. That width is their
              strength. The tradeoff is that the depth per vertical is shallow,
              and the operating load falls on your team.
            </p>
            <p>
              Ops by Noell is the other shape. We don&apos;t try to be
              horizontal. We pick service businesses with a booked calendar and
              a leaking phone, install a front desk layer shaped for that
              reality, and run it.
            </p>
          </>
        }
        rows={rows}
        verdict={
          <>
            <p>
              Choose a broad platform if your team has the bandwidth to run a
              wide product across many modules. Choose Ops by Noell if you
              want the front of your business quietly handled — calls, texts,
              confirmations, reminders, retention — without another dashboard
              to learn.
            </p>
          </>
        }
        internalLinks={[
          { label: "See the Noell System", href: "/systems" },
          { label: "Pricing", href: "/pricing" },
          { label: "Read: Missed-call recovery for service businesses", href: "/resources/missed-call-recovery-for-service-businesses" },
        ]}
      />
    </>
  );
}
