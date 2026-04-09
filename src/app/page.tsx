import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/marketing/HeroSection";
import { StatsBar } from "@/components/marketing/StatsBar";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { CaseStudySection } from "@/components/marketing/CaseStudySection";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { pageMetadata } from "@/lib/metadata";
import { darkCtaSection } from "@/content/home";
import { localBusinessSchema } from "@/lib/schema";
import { ROUTES, CTA } from "@/lib/constants";

export const metadata: Metadata = pageMetadata.home;

// ─── Era Bridge — dark thesis-break section ───────────────────────────────────
function EraBridge() {
  return (
    <section className="bg-[#1F1A1A] py-16 md:py-20 relative overflow-hidden">
      {/* Subtle wine glow from below */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[36rem] h-40 opacity-[0.07]"
        style={{ background: "radial-gradient(ellipse, #6A2C3E 0%, transparent 70%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6D6664] mb-5">
          The Communication Gap
        </p>
        <p className="font-display text-2xl md:text-3xl font-bold text-white leading-snug tracking-tight">
          People now expect an answer in minutes. Service businesses cannot always pick up the phone.
        </p>
        <p className="mt-5 text-sm md:text-base text-[#C8C4C0] leading-relaxed max-w-xl mx-auto">
          That gap — between when someone reaches out and when they hear back — is where most revenue disappears. The right systems close it automatically, without adding headcount.
        </p>
      </div>
    </section>
  );
}

// ─── Nova bridge — compact teaser that routes to /nova ─────────────────────────
function NovaBridge() {
  return (
    <section
      className="relative overflow-hidden py-16 md:py-20 border-y border-[#EDE3DE]"
      style={{ background: "linear-gradient(155deg, #FFF7F4 0%, #EDE0F4 100%)" }}
    >
      {/* Blush anchor orb */}
      <div
        className="pointer-events-none absolute -bottom-16 -left-12 w-64 h-64 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #F0E4E8 0%, transparent 65%)" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* Left: Nova identity + copy */}
          <div className="max-w-xl">
            {/* Nova badge */}
            <div className="inline-flex items-center gap-2 bg-white/70 border border-[#E0D4E8] rounded-full px-3 py-1.5 mb-4 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] flex-shrink-0" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#7C5CFC]">
                Nova AI
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F1A1A] leading-tight">
              The front-line AI that answers when you can&apos;t.
            </h2>
            <p className="mt-3 text-sm md:text-base text-[#6D6664] leading-relaxed">
              Nova responds instantly, qualifies leads, and keeps conversations moving
              while you&apos;re with a client. Included in Starter and Growth.
            </p>

            {/* Capability pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {["Instant response", "Lead qualification", "FAQ handling", "Booking support"].map((cap) => (
                <span
                  key={cap}
                  className="text-[11px] font-medium text-[#6D6664] border border-[#E0D4E8] bg-white/60 rounded-full px-3 py-1"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Right: CTA stack */}
          <div className="flex-shrink-0 flex flex-col items-start md:items-end gap-3">
            <Link
              href={ROUTES.nova}
              className="inline-flex items-center justify-center rounded-full bg-[#7C5CFC] px-7 py-3 text-sm font-semibold text-white hover:bg-[#6b4de8] transition-colors shadow-[0_2px_14px_rgba(124,92,252,0.22)]"
            >
              {CTA.nova}
            </Link>
            <Link
              href={ROUTES.pricing}
              className="text-xs font-medium text-[#6D6664] hover:text-[#7C5CFC] transition-colors"
            >
              See which plans include Nova →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Explore paths — wayfinding row before final CTA ──────────────────────────
function ExplorePaths() {
  const paths = [
    {
      label: "Systems",
      desc: "See every system we build",
      href: ROUTES.systems,
    },
    {
      label: "Verticals",
      desc: "Find your industry",
      href: ROUTES.verticals,
    },
    {
      label: "Pricing",
      desc: "Compare packages",
      href: ROUTES.pricing,
    },
    {
      label: "Nova",
      desc: "Meet the AI layer",
      href: ROUTES.nova,
      accent: true,
    },
  ];

  return (
    <section className="bg-[#FAF5F0] border-y border-[#EDE3DE] py-12 md:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C8C4C0] text-center mb-7">
          Explore the full picture
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {paths.map((p) => (
            <Link
              key={p.href}
              href={p.href}
              className={`group flex flex-col gap-1 rounded-2xl border px-5 py-5 hover:shadow-[0_4px_20px_rgba(31,26,26,0.07)] transition-all duration-200 ${
                p.accent
                  ? "bg-white border-[#E0D4E8] hover:border-[#7C5CFC]/30"
                  : "bg-white border-[#EDE3DE] hover:border-[#6A2C3E]/20"
              }`}
            >
              <span
                className={`text-sm font-semibold transition-colors ${
                  p.accent
                    ? "text-[#7C5CFC] group-hover:text-[#6b4de8]"
                    : "text-[#1F1A1A] group-hover:text-[#6A2C3E]"
                }`}
              >
                {p.label}
              </span>
              <span className="text-xs text-[#6D6664] leading-snug mt-0.5">{p.desc}</span>
              <span
                className={`mt-2 text-sm font-medium transition-transform group-hover:translate-x-0.5 ${
                  p.accent ? "text-[#7C5CFC]" : "text-[#6A2C3E]"
                }`}
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Homepage ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />

      {/* 1. Hero — stop the scroll, create self-recognition */}
      <HeroSection />

      {/* 2. Stats — proof near the top */}
      <StatsBar />

      {/* 3. The Real Problem — agitate + reframe */}
      <ProblemSection />

      {/* 4. Era bridge — communication-era thesis */}
      <EraBridge />

      {/* 5. Case study — resolve early skepticism */}
      <CaseStudySection />

      {/* 6. Nova bridge — introduce the AI layer */}
      <NovaBridge />

      {/* 7. Explore paths — route to deeper pages */}
      <ExplorePaths />

      {/* 8. Dark CTA */}
      <DarkCtaBand
        headline={darkCtaSection.headline}
        subhead={darkCtaSection.subhead}
        primaryCta={darkCtaSection.primaryCta}
        reassurance={darkCtaSection.reassurance}
      />
    </>
  );
}
