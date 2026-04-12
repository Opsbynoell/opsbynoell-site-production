import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { NovaChat } from "@/components/nova-chat";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ops by Noell — Systems That Run Themselves",
  description:
    "We build, install, and manage the system that catches missed calls, follows up instantly, and keeps your calendar full. Built for massage therapists, med spas, salons, dental offices, and estheticians.",
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
      </head>
      <body className="min-h-full flex flex-col bg-cream">
        <Navbar />
        <main className="flex-1 pt-4">{children}</main>
        <Footer />
        <NovaChat />
      </body>
    </html>
  );
}
