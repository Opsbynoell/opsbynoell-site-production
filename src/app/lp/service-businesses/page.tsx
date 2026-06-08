import Link from "next/link";
import { BookRequestForm } from "@/components/book-request-form";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { servicePageSchema } from "@/lib/schema";
import {
  IconPhoneCall,
  IconCalendarEvent,
  IconHeartHandshake,
  IconCheck,
  IconStar,
} from "@tabler/icons-react";

export const metadata = pageMetadata({
  path: "/lp/service-businesses",
  title: "AI Receptionist for Service Businesses — Ops by Noell",
  description:
    "Stop losing clients to missed calls. Ops by Noell installs a done-for-you AI receptionist for service businesses. Live in 14 days.",
  ogTitle: "Every missed call is a client you lost. Let's fix that.",
  ogDescription:
    "Ops by Noell is the AI receptionist and done-for-you operations system for service businesses. Catch every call, follow up instantly, keep your calendar full.",
});

const painPoints = [
  {
    icon: <IconPhoneCall size={20} />,
    tag: "Missed call",
    title: "They called during a session. No one answered. They booked someone else.",
    body: "A prospect called while you were with a client. No text went out. No follow-up happened. Noell Front Desk would have replied within 5 minutes, qualified the lead, and routed them to booking.",
  },
  {
    icon: <IconCalendarEvent size={20} />,
    tag: "No follow-up",
    title: "They filled out your form on Saturday. You followed up Monday. Too late.",
    body: "Noell Support responds to every web inquiry instantly, 24/7, capturing contact info and routing to booking before the weekend is over.",
  },
  {
    icon: <IconHeartHandshake size={20} />,
    tag: "Lapsed client",
    title: "A great client stopped booking. You never knew why.",
    body: "Noell Care monitors your client book for gaps and sends proactive reactivation messages before they find someone else. Retention on autopilot.",
  },
];

const proofPoints = [
  "AI receptionist answers every call, 24/7",
  "Missed-call text recovery within 5 minutes",
  "Instant response to every web inquiry",
  "Appointment confirmations and reminders automated",
  "Lapsed client reactivation on autopilot",
  "Built around the tools you already use. Nothing to replace.",
  "Live in 14 days",
];

const testimonials = [
  {
    quote:
      "Before Ops by Noell, I was losing leads every week because I couldn't answer the phone during appointments. Now every call gets a response within minutes. My booking rate went up noticeably in the first month.",
    name: "Santa",
    role: "Med Spa Owner",
    initials: "S",
  },
  {
    quote:
      "The setup was painless. They built everything around my existing booking system. I didn't have to change a single tool. It just works.",
    name: "Service Business Owner",
    role: "Service Business Owner",
    initials: "C",
  },
];

export default function LpServiceBusinessesPage() {
  return (
    <div className="min-h-screen bg-[#1F1219] text-cream">
      <JsonLd
        data={servicePageSchema({
          name: "AI Receptionist for Service Businesses — Ops by Noell",
          description:
            "Done-for-you AI receptionist and virtual front desk for service businesses. Catch every missed call, follow up instantly, and keep your calendar full.",
          path: "/lp/service-businesses",
        })}
        id="lp-sb-service"
      />

      {/* ─── MINIMAL HEADER ─────────────────────────────────────────────── */}
      <header className="w-full px-6 py-5 flex items-center justify-between border-b border-wine/15">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-obn-cream.png"
            alt="Ops by Noell"
            className="h-7 w-auto"
          />
          <span className="font-serif text-lg font-semibold text-cream">
            Ops by Noell
          </span>
        </Link>
        <a
          href="#form"
          className="text-sm font-medium text-cream bg-wine hover:bg-wine-dark px-4 py-2 rounded-full transition-colors"
        >
          Get Free Audit →
        </a>
      </header>

      {/* ─── HERO ───────────────────────────────────────────────────────── */}
      <section className="w-full px-6 py-16 md:py-24 max-w-5xl mx-auto text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-5">
          AI Receptionist · Virtual Front Desk · Service Business Automation
        </p>
        <h1 className="font-serif text-4xl md:text-6xl font-semibold text-cream leading-tight mb-6">
          Every missed call is a client{" "}
          <span className="italic text-wine-light">you already lost.</span>
        </h1>
        <p className="text-lg md:text-xl text-cream/80 max-w-2xl mx-auto leading-relaxed mb-8">
          Ops by Noell installs a done-for-you AI receptionist and virtual front desk for service businesses.
          Every call answered. Every inquiry followed up. Every lapsed client reactivated.{" "}
          <strong className="text-cream">Live in 14 days.</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="#form"
            className="inline-flex items-center gap-2 bg-wine hover:bg-wine-dark text-cream font-semibold px-8 py-4 rounded-full text-base transition-colors shadow-lg"
          >
            Get Your Free Missed Call Audit
          </a>
          <p className="text-sm text-cream/50">
            No pitch. No deck. Just a real audit of where you are losing revenue.
          </p>
        </div>
      </section>

      {/* ─── SOCIAL PROOF BAND ──────────────────────────────────────────── */}
      <section className="w-full px-6 py-8 bg-[#271520] border-y border-wine/15">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-cream/70">
          <span className="flex items-center gap-1.5">
            <IconCheck size={14} className="text-wine" />
            Service businesses across the US
          </span>
          <span className="flex items-center gap-1.5">
            <IconCheck size={14} className="text-wine" />
            Salons, med spas, dental offices, massage
          </span>
          <span className="flex items-center gap-1.5">
            <IconCheck size={14} className="text-wine" />
            Live in 14 days
          </span>
          <span className="flex items-center gap-1.5">
            <IconCheck size={14} className="text-wine" />
            Month-to-month, no contracts
          </span>
        </div>
      </section>

      {/* ─── STICKY MOBILE CTA ───────────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1F1219]/95 backdrop-blur-sm border-t border-wine/20 px-6 py-4 flex items-center justify-between md:hidden">
        <p className="text-sm text-cream/80 font-medium">Free revenue audit</p>
        <a
          href="#form"
          className="bg-wine hover:bg-wine-dark text-cream font-semibold px-5 py-2.5 rounded-full text-sm transition-colors"
        >
          Get Free Audit
        </a>
      </div>

      {/* ─── PAIN POINTS ────────────────────────────────────────────────── */}
      <section className="w-full px-6 py-16 md:py-20 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
            The quiet revenue leak
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream leading-tight max-w-3xl mx-auto">
            You're not losing clients because your work is bad.{" "}
            <span className="italic text-wine-light">
              You're losing them between sessions.
            </span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="rounded-[20px] bg-[#271520] p-7 border border-wine/20"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="text-wine">{point.icon}</span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-wine/85 font-medium">
                  {point.tag}
                </p>
              </div>
              <h3 className="font-serif text-lg font-semibold text-cream leading-snug mb-3">
                {point.title}
              </h3>
              <p className="text-sm text-cream/70 leading-relaxed">{point.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── WHAT YOU GET ───────────────────────────────────────────────── */}
      <section className="w-full px-6 py-16 md:py-20 bg-[#271520]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              Done-for-you operations
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream leading-tight">
              One complete AI front desk.
              <br />
              <span className="italic text-wine-light">Built around your tools.</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {proofPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-3">
                <IconCheck size={16} className="text-wine mt-0.5 shrink-0" />
                <p className="text-sm text-cream/85 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a
              href="#form"
              className="inline-flex items-center gap-2 bg-wine hover:bg-wine-dark text-cream font-semibold px-8 py-4 rounded-full text-base transition-colors"
            >
              Get Your Free Missed Call Audit
            </a>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ───────────────────────────────────────────────── */}
      <section className="w-full px-6 py-16 md:py-20 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
            Real results
          </p>
          <h2 className="font-serif text-3xl font-semibold text-cream">
            What service business owners say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-[20px] bg-[#271520] p-8 border border-wine/20"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <IconStar key={j} size={14} className="text-wine fill-wine" />
                ))}
              </div>
              <p className="text-sm text-cream/80 leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-wine/30 flex items-center justify-center text-wine font-semibold text-sm">
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-cream">{t.name}</p>
                  <p className="text-xs text-cream/50">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FORM ───────────────────────────────────────────────────────── */}
      <section
        id="form"
        className="w-full px-6 py-16 md:py-24 bg-[#271520] border-t border-wine/15"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              Free · No pitch · No deck
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-semibold text-cream leading-tight mb-4">
              Get your free Missed Call Audit
            </h2>
            <p className="text-base text-cream/70 leading-relaxed">
              Tell us where your front desk is leaking. We will review it personally and reply within
              one business day with two or three times for a focused 30-minute walkthrough.
              You will leave with a clear map of exactly where you are losing revenue and what it is worth.
              Whether you work with us or not.
            </p>
          </div>
          <div className="rounded-[24px] bg-[#1F1219] border border-wine/20 p-8">
            <BookRequestForm />
          </div>
          <p className="text-center text-sm text-wine font-medium mt-4">
            We review a limited number of new requests each month. Spots are first-come, first-served.
          </p>
          <p className="text-center text-xs text-cream/40 mt-3">
            Month-to-month. No contracts. Cancel anytime. Starts at $397/mo.
          </p>
        </div>
      </section>

      {/* ─── MINIMAL FOOTER ─────────────────────────────────────────────── */}
      <footer className="w-full px-6 py-8 border-t border-wine/15 text-center">
        <p className="text-xs text-cream/40">
          © {new Date().getFullYear()} Ops by Noell ·{" "}
          <Link href="/legal/privacy" className="hover:text-cream/70 transition-colors">
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/sms-policy" className="hover:text-cream/70 transition-colors">
            SMS Policy
          </Link>{" "}
          ·{" "}
          <Link href="/" className="hover:text-cream/70 transition-colors">
            opsbynoell.com
          </Link>
        </p>
      </footer>
    </div>
  );
}
