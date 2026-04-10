import { Section } from "@/components/section";
import { Headline } from "@/components/headline";
import { Overline } from "@/components/overline";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Systems — Ops by Noell",
  description:
    "AI automation systems that handle lead response, booking, follow-up, and reviews for local businesses.",
};

const systems = [
  {
    number: "01",
    title: "Instant Lead Response",
    status: "Active — avg 8 sec",
    subtitle: "Respond in seconds — not hours",
    description:
      "When a new lead comes in from Google, Facebook, your website, or a missed call, the system responds immediately — via text, email, or voice. Before they have time to call your competitor. Before your front desk even sees the notification.",
    details: [
      "Multi-channel response (SMS, email, voice)",
      "Under 60-second average response time",
      "Intelligent routing based on lead source",
      "After-hours coverage that feels human",
    ],
  },
  {
    number: "02",
    title: "Automated Booking & Confirmation",
    status: "Active — 0 no-shows",
    subtitle: "Self-serve scheduling that actually works",
    description:
      "Leads book themselves into your real calendar — no back-and-forth. The system sends confirmations, reminders, and handles reschedules automatically. Your team gets time back. Your no-show rate drops to near zero.",
    details: [
      "Calendar sync with your existing tools",
      "Smart confirmation sequences (SMS + email)",
      "Automated reminders at 24h, 2h, and 30min",
      "One-tap rescheduling for clients",
    ],
  },
  {
    number: "03",
    title: "Follow-Up & Reactivation",
    status: "Active — 340 contacts re-engaged",
    subtitle: "The system remembers everyone your team forgot",
    description:
      "Leads that didn't book get nurtured with personalized sequences. Past clients who haven't returned in 60, 90, or 120 days get re-engaged. Estimates that went cold get revived. Nothing falls through the cracks.",
    details: [
      "Drip sequences tailored by service and stage",
      "Dormant client reactivation campaigns",
      "Cold estimate follow-up automation",
      "Win-back offers timed to buying cycles",
    ],
  },
  {
    number: "04",
    title: "Review & Reputation Engine",
    status: "Active — 4× review growth",
    subtitle: "Turn happy clients into public proof",
    description:
      "After a successful appointment or completed job, the system asks for a review — at the right moment, on the right platform. Negative sentiment is caught privately before it hits Google. Positive reviews are amplified.",
    details: [
      "Post-service review request automation",
      "Platform-specific routing (Google, Yelp)",
      "Private feedback capture for negatives",
      "Review response templates for your team",
    ],
  },
];

export default function SystemsPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="cream" className="pt-32 md:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            <Overline>Systems</Overline>
            <Headline as="h1" size="hero" className="mt-4">
              From AI chaos to systems that run themselves
            </Headline>
          </div>
          <div>
            <p className="font-serif italic text-xl text-charcoal/50 leading-relaxed">
              We used to reach people by picking up the phone, checking the
              rolodex, leaving a voicemail. Now AI handles it — but only if the
              system is built right.
            </p>
          </div>
        </div>
      </Section>

      {/* System sections — interface-panel aesthetic */}
      {systems.map((system, i) => (
        <Section
          key={system.number}
          variant={i % 2 === 0 ? "cream" : "blush"}
          className="py-20 md:py-28"
        >
          <div className="bg-white/80 border border-charcoal/5 rounded-xl overflow-hidden max-w-4xl">
            {/* Panel top bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-charcoal/[0.02] border-b border-charcoal/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-charcoal/10" />
                  <div className="w-2 h-2 rounded-full bg-charcoal/10" />
                  <div className="w-2 h-2 rounded-full bg-charcoal/10" />
                </div>
                <span className="font-mono text-xs text-charcoal/30">
                  {system.number} — {system.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="font-mono text-[10px] text-charcoal/30">
                  {system.status}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 md:p-10 space-y-6">
              <div className="space-y-2">
                <h2 className="font-serif text-2xl md:text-3xl text-charcoal">
                  {system.title}
                </h2>
                <p className="font-serif italic text-base text-charcoal/40">
                  {system.subtitle}
                </p>
              </div>
              <p className="text-charcoal/60 leading-relaxed max-w-2xl">
                {system.description}
              </p>
              <ul className="space-y-2 border-l-2 border-wine/15 pl-5">
                {system.details.map((detail) => (
                  <li
                    key={detail}
                    className="text-sm text-charcoal/50 leading-relaxed"
                  >
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      ))}

      {/* Closing CTA */}
      <Section variant="charcoal" className="text-center">
        <p className="font-serif uppercase text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tight text-cream max-w-2xl mx-auto">
          Ready to see what a real system looks like?
        </p>
        <p className="mt-6 text-cream/40 leading-relaxed max-w-lg mx-auto">
          We&apos;ll audit your current setup and show you exactly where
          leads are leaking — and what to fix first.
        </p>
        <div className="mt-10">
          <Link
            href="/book"
            className="inline-flex items-center justify-center bg-cream text-charcoal text-sm tracking-wide px-10 py-4 rounded-full hover:bg-white transition-colors"
          >
            Book Your Free Audit
          </Link>
        </div>
      </Section>
    </>
  );
}
