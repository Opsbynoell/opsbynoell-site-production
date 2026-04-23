import Link from "next/link";
import { CompareLayout, type CompareRow } from "@/components/compare-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

const PATH = "/compare/ai-front-desk-alternatives";

export const metadata = pageMetadata({
  path: PATH,
  title: "AI front desk alternatives — done-for-you vs. DIY vs. human",
  description:
    "A short, honest map of AI front desk alternatives for service businesses, and where Ops by Noell&apos;s done-for-you install fits among them.",
});

const rows: CompareRow[] = [
  {
    capability: "Done-for-you AI front desk (Ops by Noell)",
    opsByNoell:
      "We install, voice, tune, and manage. You never touch a dashboard. Live in 14 days.",
    alternative: "Best for service businesses that want it handled.",
  },
  {
    capability: "DIY AI receptionist tools",
    opsByNoell:
      "Ops by Noell is the managed alternative. We do the configuration and keep tuning.",
    alternative:
      "You build and maintain the agent yourself. Ownership stays with you, and so does the drift.",
  },
  {
    capability: "Broad local-business messaging platforms",
    opsByNoell:
      "Ops by Noell narrows the scope to the front desk job and runs it.",
    alternative:
      "Wide feature set. Your team operates the dashboard.",
  },
  {
    capability: "Human answering services",
    opsByNoell:
      "Ops by Noell pairs speed and consistency with your voice, at a flat rate.",
    alternative:
      "Per-minute pricing. Voice varies by agent.",
  },
  {
    capability: "Hiring another front desk person",
    opsByNoell:
      "A managed AI layer covers the leaky edges a single hire physically can&apos;t.",
    alternative:
      "$45–65k/yr plus turnover. Human judgement is irreplaceable; coverage hours are not.",
  },
];

export default function Compare() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: PATH },
          {
            name: "AI front desk alternatives",
            path: PATH,
          },
        ])}
        id="compare-alternatives"
      />
      <CompareLayout
        alternativeName="Other options"
        title="AI front desk alternatives"
        lead="A short, honest map of the options, and where a done-for-you install fits among them."
        summary={
          <>
            <p>
              Service-business owners comparing AI front desk alternatives
              usually run into the same five shapes: a done-for-you install, a
              DIY configure-it-yourself tool, a broad local messaging platform,
              a traditional answering service, or hiring another human at the
              front desk. Each one wins somewhere. Each one loses somewhere
              specific.
            </p>
            <p>
              Below is the short map. If you want the deeper comparison on a
              specific one, jump into it.
            </p>
            <ul className="list-disc pl-5">
              <li>
                <Link className="text-wine underline underline-offset-4" href="/compare/my-ai-front-desk">
                  Ops by Noell vs. My AI Front Desk
                </Link>
              </li>
              <li>
                <Link className="text-wine underline underline-offset-4" href="/compare/podium">
                  Ops by Noell vs. Podium
                </Link>
              </li>
              <li>
                <Link className="text-wine underline underline-offset-4" href="/compare/diy-ai-receptionist">
                  Ops by Noell vs. DIY AI receptionist tools
                </Link>
              </li>
              <li>
                <Link className="text-wine underline underline-offset-4" href="/compare/human-answering-services">
                  Ops by Noell vs. human answering services
                </Link>
              </li>
              <li>
                <Link className="text-wine underline underline-offset-4" href="/compare/local-business-messaging-platforms">
                  Ops by Noell vs. broad local-business messaging platforms
                </Link>
              </li>
            </ul>
          </>
        }
        rows={rows}
        verdict={
          <>
            <p>
              There is no universal &ldquo;best&rdquo; here — only the best fit
              for how your business actually runs. If you want the front desk
              job handled in your voice without a dashboard to operate, the
              done-for-you install is the fit. If not, one of the other shapes
              probably is, and the audit will tell you honestly which one.
            </p>
          </>
        }
        internalLinks={[
          { label: "Book a free audit", href: "/book" },
          { label: "See the Noell System", href: "/systems" },
          { label: "Read: AI front desk vs. human receptionist", href: "/resources/ai-front-desk-vs-human-receptionist" },
        ]}
      />
    </>
  );
}
