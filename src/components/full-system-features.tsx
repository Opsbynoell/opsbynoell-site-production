import React from "react";
import Link from "next/link";
import {
  IconUsers,
  IconLayoutKanban,
  IconCalendarEvent,
  IconMessage2,
  IconFilter,
  IconStar,
  IconRotate,
  IconCertificate,
  IconClipboardList,
  IconDeviceMobile,
  IconChartLine,
  IconShieldCheck,
} from "@tabler/icons-react";

type Feature = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    title: "CRM + contact database",
    description: "Every lead, client, and interaction in one place.",
    icon: <IconUsers size={22} stroke={1.6} />,
  },
  {
    title: "Pipeline management",
    description: "Track leads from first touch to booked appointment.",
    icon: <IconLayoutKanban size={22} stroke={1.6} />,
  },
  {
    title: "Booking calendar",
    description:
      "Native calendar that integrates with your PMS or runs standalone.",
    icon: <IconCalendarEvent size={22} stroke={1.6} />,
  },
  {
    title: "Email + SMS marketing",
    description: "Broadcasts, drip campaigns, nurture sequences.",
    icon: <IconMessage2 size={22} stroke={1.6} />,
  },
  {
    title: "Funnels + landing pages",
    description: "Lead capture pages that match your brand.",
    icon: <IconFilter size={22} stroke={1.6} />,
  },
  {
    title: "Reputation dashboard",
    description: "Request, monitor, and respond to reviews from one place.",
    icon: <IconStar size={22} stroke={1.6} />,
  },
  {
    title: "Reactivation campaigns",
    description:
      "Win back lapsed clients automatically (Custom Ops only).",
    icon: <IconRotate size={22} stroke={1.6} />,
  },
  {
    title: "Memberships + courses",
    description:
      "Offer memberships, packages, or educational content.",
    icon: <IconCertificate size={22} stroke={1.6} />,
  },
  {
    title: "Forms + surveys",
    description: "Intake forms, client surveys, feedback collection.",
    icon: <IconClipboardList size={22} stroke={1.6} />,
  },
  {
    title: "Client mobile app",
    description: "Your own branded app for clients to book and pay.",
    icon: <IconDeviceMobile size={22} stroke={1.6} />,
  },
  {
    title: "Reporting + analytics",
    description:
      "Calls, bookings, revenue, funnel metrics in one dashboard.",
    icon: <IconChartLine size={22} stroke={1.6} />,
  },
  {
    title: "Managed updates",
    description:
      "New features shipped automatically. No maintenance on your end.",
    icon: <IconShieldCheck size={22} stroke={1.6} />,
  },
];

export function FullSystemFeatures() {
  return (
    <section className="w-full py-16 md:py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            The full system &middot; Included in Growth and Custom Ops
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            Everything the front of your{" "}
            <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
              business runs on.
            </span>
          </h2>
          <p className="mt-5 text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
            The agents are one layer. The full system gives you the platform
            underneath.
          </p>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 md:gap-y-12">
          {features.map((feature) => (
            <li key={feature.title} className="flex gap-4">
              <span className="flex-shrink-0 w-10 h-10 rounded-lg bg-wine/10 text-wine flex items-center justify-center">
                {feature.icon}
              </span>
              <div>
                <h3 className="font-serif text-lg md:text-xl font-semibold text-charcoal mb-1.5 leading-snug">
                  {feature.title}
                </h3>
                <p className="text-sm text-charcoal/70 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-14 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-charcoal hover:text-wine transition-colors"
          >
            See how it&apos;s priced
            <span className="text-wine">&rarr;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
