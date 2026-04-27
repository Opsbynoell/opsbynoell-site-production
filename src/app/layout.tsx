import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { ConditionalShell } from "@/components/conditional-shell";
import { MetaPixel } from "@/components/meta-pixel";
import { JsonLd } from "@/components/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from "@/lib/seo";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Ops by Noell | Done-for-You AI Front Desk for Service Businesses",
    template: "%s | Ops by Noell",
  },
  description:
    "Ops by Noell installs and manages a done-for-you AI front desk for dental practices, med spas, salons, massage therapists, estheticians, and HVAC contractors. Catch missed calls, follow up instantly, and keep your calendar full.",
  applicationName: SITE_NAME,
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: "/images/logo-favicon-o.png", type: "image/png" }],
    shortcut: "/images/logo-favicon-o.png",
    apple: "/images/logo-favicon-o.png",
  },
  openGraph: {
    title:
      "Ops by Noell | Done-for-You AI Front Desk for Service Businesses",
    description:
      "Done-for-you AI operations for service businesses. Catch every missed call, text, confirmation, and reschedule, and keep your calendar full.",
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: absoluteUrl(DEFAULT_OG_IMAGE),
        width: 1200,
        height: 630,
        alt: "The Noell System. Three agents working as one for service businesses.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Ops by Noell | Done-for-You AI Front Desk for Service Businesses",
    description:
      "Done-for-you AI operations for service businesses. Catch missed calls, follow up instantly, keep the calendar full.",
    images: [absoluteUrl(DEFAULT_OG_IMAGE)],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-cream">
        <JsonLd data={[organizationSchema, websiteSchema]} id="site" />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <MetaPixel />
        <ConditionalShell>{children}</ConditionalShell>
        <Analytics />
      </body>
    </html>
  );
}
