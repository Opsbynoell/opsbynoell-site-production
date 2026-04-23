import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

type Entry = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const entries: Entry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/agents", changeFrequency: "weekly", priority: 0.9 },
  { path: "/systems", changeFrequency: "weekly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/roi", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  { path: "/book", changeFrequency: "weekly", priority: 0.95 },

  { path: "/noell-support", changeFrequency: "weekly", priority: 0.85 },
  { path: "/noell-front-desk", changeFrequency: "weekly", priority: 0.85 },
  { path: "/noell-care", changeFrequency: "weekly", priority: 0.85 },

  { path: "/verticals", changeFrequency: "weekly", priority: 0.85 },
  { path: "/verticals/dental", changeFrequency: "weekly", priority: 0.8 },
  { path: "/verticals/med-spas", changeFrequency: "weekly", priority: 0.8 },
  { path: "/verticals/salons", changeFrequency: "weekly", priority: 0.8 },
  { path: "/verticals/massage", changeFrequency: "weekly", priority: 0.8 },
  { path: "/verticals/estheticians", changeFrequency: "weekly", priority: 0.8 },
  { path: "/verticals/hvac", changeFrequency: "weekly", priority: 0.8 },

  { path: "/resources", changeFrequency: "weekly", priority: 0.7 },
  {
    path: "/resources/missed-call-recovery-for-service-businesses",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/resources/ai-front-desk-vs-human-receptionist",
    changeFrequency: "monthly",
    priority: 0.7,
  },

  { path: "/case-studies/santa-e", changeFrequency: "monthly", priority: 0.7 },

  { path: "/compare/my-ai-front-desk", changeFrequency: "monthly", priority: 0.65 },
  { path: "/compare/podium", changeFrequency: "monthly", priority: 0.65 },
  { path: "/compare/diy-ai-receptionist", changeFrequency: "monthly", priority: 0.65 },
  { path: "/compare/human-answering-services", changeFrequency: "monthly", priority: 0.65 },
  { path: "/compare/local-business-messaging-platforms", changeFrequency: "monthly", priority: 0.65 },
  { path: "/compare/ai-front-desk-alternatives", changeFrequency: "monthly", priority: 0.65 },

  { path: "/legal/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/legal/cookies", changeFrequency: "yearly", priority: 0.3 },
  { path: "/sms-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return entries.map((e) => ({
    url: `${SITE_URL}${e.path === "/" ? "" : e.path}`,
    lastModified: now,
    changeFrequency: e.changeFrequency,
    priority: e.priority,
  }));
}
