import { pageMetadata } from "@/lib/seo";
import { RevenueSignalGuidePageClient } from "@/components/revenue-signal-guide-page";

export const metadata = pageMetadata({
  path: "/lp/revenue-signal-guide",
  title: "Free Revenue Signal Guide — Find Your Front Desk Leaks",
  description:
    "Download the free Revenue Signal Guide. Find out where your missed calls are going and how to stop the bleed in 14 days.",
  ogTitle: "Find out what your front desk is costing you. Free guide.",
  ogDescription:
    "Most service businesses lose 3-5 clients a week to missed calls and slow follow-up. This guide shows you exactly where the leaks are and what to do about them.",
});

export default function RevenueSignalGuidePage() {
  return <RevenueSignalGuidePageClient />;
}
