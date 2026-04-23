import type { Metadata } from "next";

export const SITE_URL = "https://www.opsbynoell.com";
export const SITE_NAME = "Ops by Noell";
export const DEFAULT_OG_IMAGE = "/images/og-grid-master.jpg";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p === "/" ? "" : p}`;
}

export type PageSeoInput = {
  path: string;
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  image?: string;
  imageAlt?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
};

export function pageMetadata(input: PageSeoInput): Metadata {
  const url = absoluteUrl(input.path);
  const image = input.image ?? DEFAULT_OG_IMAGE;
  const imageAbs = absoluteUrl(image);
  const ogTitle = input.ogTitle ?? input.title;
  const ogDescription = input.ogDescription ?? input.description;

  const meta: Metadata = {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url,
      siteName: SITE_NAME,
      type: input.type ?? "website",
      images: [
        {
          url: imageAbs,
          width: 1200,
          height: 630,
          alt: input.imageAlt ?? ogTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [imageAbs],
    },
  };

  if (input.noindex) {
    meta.robots = { index: false, follow: false };
  }

  if (input.type === "article" && meta.openGraph) {
    (meta.openGraph as { publishedTime?: string; modifiedTime?: string }).publishedTime =
      input.publishedTime;
    (meta.openGraph as { publishedTime?: string; modifiedTime?: string }).modifiedTime =
      input.modifiedTime;
  }

  return meta;
}
