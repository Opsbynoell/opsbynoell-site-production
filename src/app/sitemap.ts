import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
  /** ISO date for the last meaningful content change on the page. */
  lastmod: string;
};

// Per-page lastmod dates. Update these alongside content changes so search
// crawlers can prioritize freshly updated pages instead of seeing every
// page share a single build timestamp.
const TODAY = "2026-06-02";
const SEO_FIXES = "2026-05-24";
const LAUNCH_FIXES = "2026-05-04";

const entries: Entry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0, lastmod: SEO_FIXES },
  { path: "/about", changeFrequency: "monthly", priority: 0.8, lastmod: "2026-05-02" },
  { path: "/agents", changeFrequency: "weekly", priority: 0.9, lastmod: SEO_FIXES },
  { path: "/systems", changeFrequency: "weekly", priority: 0.9, lastmod: LAUNCH_FIXES },
  {
    path: "/predictive-customer-intelligence",
    changeFrequency: "weekly",
    priority: 0.95,
    lastmod: SEO_FIXES,
  },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9, lastmod: SEO_FIXES },
  { path: "/what-you-get", changeFrequency: "weekly", priority: 0.9, lastmod: SEO_FIXES },
  { path: "/add-ons", changeFrequency: "monthly", priority: 0.75, lastmod: SEO_FIXES },
  { path: "/digital-readiness-review", changeFrequency: "monthly", priority: 0.85, lastmod: SEO_FIXES },
  { path: "/verticals/chiropractic", changeFrequency: "weekly", priority: 0.8, lastmod: SEO_FIXES },
  { path: "/roi", changeFrequency: "monthly", priority: 0.7, lastmod: LAUNCH_FIXES },
  { path: "/platform/lead-intelligence", changeFrequency: "monthly", priority: 0.75, lastmod: TODAY },
  { path: "/platform/b2b-pipeline", changeFrequency: "monthly", priority: 0.75, lastmod: TODAY },
  {
    path: "/resources/revenue-calculator",
    changeFrequency: "monthly",
    priority: 0.9,
    lastmod: "2026-04-18",
  },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6, lastmod: "2026-04-18" },
  { path: "/book", changeFrequency: "weekly", priority: 0.95, lastmod: LAUNCH_FIXES },

  { path: "/noell-support", changeFrequency: "weekly", priority: 0.85, lastmod: SEO_FIXES },
  { path: "/noell-front-desk", changeFrequency: "weekly", priority: 0.85, lastmod: SEO_FIXES },
  { path: "/noell-care", changeFrequency: "weekly", priority: 0.85, lastmod: SEO_FIXES },
  { path: "/noell-inbound", changeFrequency: "weekly", priority: 0.85, lastmod: TODAY },
  { path: "/noell-pipeline", changeFrequency: "weekly", priority: 0.85, lastmod: TODAY },
  { path: "/noell-account", changeFrequency: "weekly", priority: 0.85, lastmod: TODAY },

  { path: "/verticals", changeFrequency: "weekly", priority: 0.85, lastmod: "2026-04-18" },
  { path: "/verticals/dental", changeFrequency: "weekly", priority: 0.8, lastmod: SEO_FIXES },
  { path: "/verticals/med-spas", changeFrequency: "weekly", priority: 0.8, lastmod: LAUNCH_FIXES },
  { path: "/verticals/salons", changeFrequency: "weekly", priority: 0.8, lastmod: "2026-04-18" },
  { path: "/verticals/massage", changeFrequency: "weekly", priority: 0.8, lastmod: SEO_FIXES },
  { path: "/verticals/estheticians", changeFrequency: "weekly", priority: 0.8, lastmod: SEO_FIXES },
  { path: "/verticals/hvac", changeFrequency: "weekly", priority: 0.8, lastmod: SEO_FIXES },

  { path: "/resources", changeFrequency: "weekly", priority: 0.7, lastmod: LAUNCH_FIXES },
  {
    path: "/resources/missed-call-recovery-for-service-businesses",
    changeFrequency: "monthly",
    priority: 0.7,
    lastmod: "2026-04-18",
  },
  {
    path: "/resources/ai-front-desk-vs-human-receptionist",
    changeFrequency: "monthly",
    priority: 0.7,
    lastmod: "2026-04-18",
  },
  {
    path: "/resources/missed-calls-to-missed-bookings",
    changeFrequency: "monthly",
    priority: 0.7,
    lastmod: "2026-04-18",
  },
  {
    path: "/resources/ai-front-desk-vs-answering-service",
    changeFrequency: "monthly",
    priority: 0.7,
    lastmod: "2026-04-18",
  },
  {
    path: "/resources/rebooking-and-reactivation-for-med-spas-and-massage",
    changeFrequency: "monthly",
    priority: 0.7,
    lastmod: "2026-04-18",
  },
  {
    path: "/resources/dental-missed-call-leakage",
    changeFrequency: "monthly",
    priority: 0.7,
    lastmod: "2026-04-18",
  },
  {
    path: "/resources/salon-after-hours-booking",
    changeFrequency: "monthly",
    priority: 0.7,
    lastmod: "2026-04-18",
  },
  {
    path: "/resources/review-velocity-local-seo-service-business",
    changeFrequency: "monthly",
    priority: 0.7,
    lastmod: "2026-04-18",
  },
  { path: "/resources/massage-therapist-no-show-cost", changeFrequency: "monthly", priority: 0.75, lastmod: LAUNCH_FIXES },
  { path: "/resources/hvac-missed-call-cost", changeFrequency: "monthly", priority: 0.75, lastmod: TODAY },
  { path: "/resources/med-spa-client-reactivation", changeFrequency: "monthly", priority: 0.7, lastmod: TODAY },

  { path: "/case-studies", changeFrequency: "monthly", priority: 0.75, lastmod: TODAY },
  { path: "/case-studies/santa-e", changeFrequency: "monthly", priority: 0.7, lastmod: "2026-04-18" },

  { path: "/for-service-businesses", changeFrequency: "weekly", priority: 0.9, lastmod: SEO_FIXES },
  { path: "/for-b2b", changeFrequency: "weekly", priority: 0.9, lastmod: SEO_FIXES },
  { path: "/upgrade", changeFrequency: "weekly", priority: 0.9, lastmod: TODAY },

  { path: "/compare", changeFrequency: "monthly", priority: 0.7, lastmod: SEO_FIXES },
  { path: "/compare/my-ai-front-desk", changeFrequency: "monthly", priority: 0.65, lastmod: SEO_FIXES },
  { path: "/compare/podium", changeFrequency: "monthly", priority: 0.65, lastmod: SEO_FIXES },
  { path: "/compare/diy-ai-receptionist", changeFrequency: "monthly", priority: 0.65, lastmod: "2026-04-18" },
  { path: "/compare/human-answering-services", changeFrequency: "monthly", priority: 0.65, lastmod: SEO_FIXES },
  { path: "/compare/local-business-messaging-platforms", changeFrequency: "monthly", priority: 0.65, lastmod: "2026-04-18" },
  { path: "/compare/ai-front-desk-alternatives", changeFrequency: "monthly", priority: 0.65, lastmod: "2026-04-18" },
  { path: "/compare/birdeye", changeFrequency: "monthly", priority: 0.65, lastmod: TODAY },
  { path: "/compare/ruby-receptionists", changeFrequency: "monthly", priority: 0.65, lastmod: TODAY },
  { path: "/compare/weave", changeFrequency: "monthly", priority: 0.65, lastmod: TODAY },

  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.3, lastmod: TODAY },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.3, lastmod: TODAY },
  { path: "/legal/cookies", changeFrequency: "yearly", priority: 0.3, lastmod: TODAY },
  { path: "/sms-policy", changeFrequency: "yearly", priority: 0.3, lastmod: TODAY },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return entries.map((e) => ({
    url: `${SITE_URL}${e.path === "/" ? "" : e.path}`,
    lastModified: new Date(e.lastmod),
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
