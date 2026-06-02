import { pageMetadata } from "@/lib/seo";
import { UpgradePageClient } from "@/components/upgrade-page-client";

export const metadata = pageMetadata({
  path: "/upgrade",
  title: "You Have Outgrown Your AI Front Desk | Ops by Noell",
  description:
    "Rosie AI, Goodcall, and My AI Front Desk are fine for voicemail replacement. When you need real CRM integration, a human-quality voice, and a team that manages it for you, there is only one option.",
  ogTitle: "You have outgrown your AI front desk.",
  ogDescription:
    "Rosie AI and Goodcall are fine for voicemail replacement. When you need real CRM integration, a voice that sounds human, and a team that manages it for you, there is only one option.",
});

export default function UpgradePage() {
  return <UpgradePageClient />;
}
