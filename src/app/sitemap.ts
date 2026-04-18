import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.opsbynoell.com";
  const routes = [
    "",
    "/verticals",
    "/verticals/dental",
    "/verticals/med-spas",
    "/verticals/salons",
    "/verticals/massage",
    "/verticals/estheticians",
    "/verticals/hvac",
    "/noell-support",
    "/noell-front-desk",
    "/book",
  ];
  return routes.map((r) => ({
    url: `${base}${r}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: r === "" ? 1 : r === "/book" ? 0.9 : 0.7,
  }));
}
