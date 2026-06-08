import { pageMetadata } from "@/lib/seo";
import { MissedCallAuditPageClient } from "@/components/missed-call-audit-page";

export const metadata = pageMetadata({
  path: "/lp/missed-call-audit",
  title: "Free Missed Call Audit — Most Businesses Find $3K+ in Missing Revenue",
  description:
    "Free audit for service businesses. Find out exactly where your missed calls are going and how much revenue is leaking from your front desk every month.",
  ogTitle: "Free Missed Call Audit — Find out what your front desk is costing you.",
  ogDescription:
    "Most service businesses lose 3-5 clients a week to missed calls and slow follow-up. This audit shows you exactly where the leaks are and what to do about them.",
});

export default function MissedCallAuditPage() {
  return <MissedCallAuditPageClient />;
}
