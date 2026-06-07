import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), fullscreen=(self), interest-cohort=()",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/faq",
        destination: "/pricing#faq",
        permanent: true,
      },
      {
        source: "/service-businesses",
        destination: "/for-service-businesses",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/legal/privacy",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/legal/terms",
        permanent: true,
      },
      {
        source: "/cookie-policy",
        destination: "/legal/cookies",
        permanent: true,
      },
      {
        source: "/chiropractor-automation",
        destination: "/verticals/chiropractic",
        permanent: true,
      },
      {
        source: "/revenue-signal-report",
        destination: "/book",
        permanent: true,
      },
      {
        source: "/lp-service",
        destination: "/for-service-businesses",
        permanent: true,
      },
      {
        source: "/lp-b2b",
        destination: "/for-b2b",
        permanent: true,
      },
      {
        source: "/for-service-biz",
        destination: "/for-service-businesses",
        permanent: true,
      },
      {
        source: "/platform",
        destination: "/systems",
        permanent: true,
      },
      // Safety fallback: if /how-it-works page is ever removed, redirect to /systems
      // rather than serving a 404. The dedicated page at src/app/how-it-works/page.tsx
      // takes precedence over this redirect when it exists.
      {
        source: "/how-it-works-legacy",
        destination: "/how-it-works",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
