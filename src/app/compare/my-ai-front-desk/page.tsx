import { CompareLayout, type CompareRow } from "@/components/compare-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";

const PATH = "/compare/my-ai-front-desk";
const ALT = "My AI Front Desk";

export const metadata = pageMetadata({
  path: PATH,
  title: `Ops by Noell vs. ${ALT}`,
  description: `How a done-for-you AI front desk from Ops by Noell compares to ${ALT} for service businesses — setup model, voice fit, retention, and what happens after go-live.`,
});

const rows: CompareRow[] = [
  {
    capability: "Setup model",
    opsByNoell:
      "Done-for-you. We install, copy, calibrate, and manage end-to-end. You don't configure a dashboard.",
    alternative:
      "Largely self-serve. You sign up, configure the agent, and tune it yourself over time.",
  },
  {
    capability: "Voice and brand fit",
    opsByNoell:
      "Copy written in your voice during onboarding, reviewed with you before go-live, tuned weekly.",
    alternative:
      "Generic-by-default prompts. Voice quality rises or falls with how much time you put in.",
  },
  {
    capability: "What it covers",
    opsByNoell:
      "New-prospect intake, calls and scheduling, existing-client support, reminders, review capture, reactivation.",
    alternative:
      "Primarily call answering and voicemail-style capture. Retention and reactivation sit outside the product.",
  },
  {
    capability: "Works with your booking tool",
    opsByNoell:
      "Yes. Installed around Calendly, Acuity, Vagaro, practice management, or whatever you already use.",
    alternative:
      "Depends on the integration list. Often limited to calendar links.",
  },
  {
    capability: "Who builds and tunes it",
    opsByNoell: "The Ops by Noell team.",
    alternative: "You.",
  },
  {
    capability: "Founding rate",
    opsByNoell:
      "$197/mo for Noell Agents, locked for 24 months. Full system from $197/mo with one-time setup.",
    alternative:
      "Published SaaS pricing. Quality of output depends heavily on your own tuning.",
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
        id={`compare-my-ai-front-desk`}
      />
      <CompareLayout
        sourcePage="compare_my_ai_front_desk"
        alternativeName={ALT}
        title={`Ops by Noell vs. ${ALT}`}
        lead="One is a done-for-you AI front desk managed by a small team. The other is a DIY AI receptionist product you configure yourself."
        summary={
          <>
            <p>
              Both options answer calls with AI. The difference is who builds
              and runs it. {ALT} is a self-serve product — you configure the
              agent, wire up the integrations, and babysit the tone over time.
              Ops by Noell is a managed service — we build, install, voice,
              and tune the front desk layer for you, and keep tuning it week
              over week.
            </p>
            <p>
              If you love software and have time to configure, a self-serve
              tool is a real option. If you&apos;re a service-business owner
              who wants the phones handled without becoming a prompt engineer,
              a done-for-you install is the fit.
            </p>
          </>
        }
        rows={rows}
        verdict={
          <>
            <p>
              Choose {ALT} if you want a standalone AI receptionist product and
              you&apos;re comfortable configuring and tuning it yourself.
              Choose Ops by Noell if you want an installed, managed operations
              layer that covers the whole front of your business and stays
              tuned in your voice, without you touching a dashboard.
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
