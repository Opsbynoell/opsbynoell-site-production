import type { Metadata, Viewport } from "next";

// Onboarding is a post-checkout flow accessed via a signed Stripe redirect.
// Should never be indexed.
export const metadata: Metadata = {
  title: "Onboarding",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#130B0F",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
