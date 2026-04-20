import type { Metadata } from "next";
import { ConditionalShell } from "@/components/conditional-shell";
import { MetaPixel } from "@/components/meta-pixel";
import { organizationSchema } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.opsbynoell.com"),
  title:
    "Ops by Noell | Done-for-You AI Front Desk for Dental, Med Spas, Salons, Massage & HVAC",
  description:
    "Ops by Noell builds, installs, and manages a done-for-you AI front desk for service businesses in Orange County and beyond. We catch missed calls, follow up instantly, and keep your calendar full. Built for dental practices, med spas, salons, massage therapists, estheticians, and HVAC contractors.",
  icons: {
    icon: [
      { url: "/images/logo-favicon-o.png", type: "image/png" },
    ],
    shortcut: "/images/logo-favicon-o.png",
    apple: "/images/logo-favicon-o.png",
  },
  openGraph: {
    title:
      "By the time you call back, they've already booked somewhere else.",
    description:
      "Done-for-you AI systems for local service businesses. Never miss a call, text, confirmation, or reschedule.",
    url: "https://www.opsbynoell.com",
    siteName: "Ops by Noell",
    type: "website",
    images: [
      {
        url: "/images/og-grid-master.jpg",
        width: 1200,
        height: 630,
        alt: "The Noell System. Three agents working as one for service businesses.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "By the time you call back, they've already booked somewhere else.",
    description:
      "Done-for-you AI front desk for dental, med spas, salons, massage, estheticians, and HVAC.",
    images: ["/images/og-grid-master.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream">
        <MetaPixel />
        <ConditionalShell>{children}</ConditionalShell>
      </body>
    </html>
  );
}
