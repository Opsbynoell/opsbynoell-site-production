import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block admin + API only. Legal pages (/legal/*) are public-facing
        // and intentionally indexable. The earlier /privacy and /terms
        // rules pointed at non-existent paths and gave a false sense of
        // protection — they are removed here.
        disallow: ["/admin", "/admin/", "/api/"],
      },
      // AI Search & Answer Engine Crawlers — explicitly welcomed
      // These bots power ChatGPT Search, Perplexity, and Claude web search.
      // Explicit rules ensure they are never accidentally blocked.
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Claude-SearchBot",
        allow: "/",
      },
      {
        userAgent: "Claude-User",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
