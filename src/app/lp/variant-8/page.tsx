import { pageMetadata } from "@/lib/seo";
import { Variant8Page } from "@/components/lp/variant-8";

export const metadata = pageMetadata({
  path: "/lp/variant-8",
  title: "AI Front Desk for Service Businesses | Ops by Noell",
  description:
    "Done-for-you AI front desk for Orange County service businesses. Catch every missed call, text back instantly, and keep your calendar full. Free Missed Call Audit.",
  ogTitle: "While you're with a client, who's picking up?",
  ogDescription:
    "An AI front desk that answers, texts back, and books — done for you. Get a free analysis of your missed call patterns.",
  noindex: true,
});

export default function Page() {
  return <Variant8Page />;
}
