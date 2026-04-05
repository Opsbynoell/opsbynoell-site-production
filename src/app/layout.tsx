import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SITE_META } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_META.url),
  title: {
    default: SITE_META.name + " — " + SITE_META.tagline,
    template: "%s | " + SITE_META.name,
  },
  description: SITE_META.description,
  openGraph: {
    type: "website",
    locale: SITE_META.locale,
    url: SITE_META.url,
    siteName: SITE_META.name,
    title: SITE_META.name + " — " + SITE_META.tagline,
    description: SITE_META.description,
    images: [{ url: SITE_META.ogImage, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: SITE_META.twitterHandle,
    title: SITE_META.name + " — " + SITE_META.tagline,
    description: SITE_META.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-[#1A1A1A]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
