import type { Metadata } from "next";
import Link from "next/link";
import { HeroSection } from "@/components/marketing/HeroSection";
import { StatsBar } from "@/components/marketing/StatsBar";
import { ProblemSection } from "@/components/marketing/ProblemSection";
import { CaseStudySection } from "@/components/marketing/CaseStudySection";
import { EraBridgeSection } from "@/components/marketing/EraBridgeSection";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { pageMetadata } from "@/lib/metadata";
import { darkCtaSection } from "@/content/home";
import { localBusinessSchema } from "@/lib/schema";
import { ROUTES, CTA } from "@/lib/constants";

export const metadata: Metadata = pageMetadata.home;

// ─── Nova bridge — dark operational section ────────────────────────────────────
function NovaBridge() {
  return (
    <section className="bg-[#1F1A1A] py-16 md:py-20 relative overflow-hidden">
      {/* Purple glow top-right */}
      <div
        className="pointer-events-none absolute -top-24 -right-16 w-96 h-96 rounded-full opacity-[0.07]"
        style={{ background: "radial-gradient(circle, #7C5CFC 0%, transparent 65%)" }}
        aria-hidden
      />
      {/* Wine glow bottom-left */}
      <div
        className="pointer-events-none absolute -bottom-16 -left-10 w-64 h-64 rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, #6A2C3E 0%, transparent 65%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">

          {/* Left: Copy */}
          <div className="flex-1">
            {/* Nova live badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#7C5CFC]/30 bg-[#7C5CFC]/10 px-3 py-1.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] flex-shrink-0" />
              <span className="font-mono text-[9px] font-semibold uppercase tracking-widest text-[#7C5CFC]">
                nova · live
              </span>
            </div>

            <h2 className="font-display text-2xl md:text-3xl font-bold text-white leading-tight">
              Your front desk doesn&apos;t stop when you do.
            </h2>
            <p className="mt-4 text-sm md:text-base text-[#C8C4C0] leading-relaxed max-w-lg">
              Nova is built into every Ops by Noell system. When a call goes unanswered,
              Nova responds in seconds — qualifies the lead, answers questions, and keeps
              the appointment moving. Not a chatbot. Not a separate app. The front desk, always on.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row items-start gap-3">
              <Link
                href={ROUTES.nova}
                className="inline-flex items-center justify-center rounded-full bg-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#6b4de8] transition-colors shadow-[0_2px_14px_rgba(124,92,252,0.25)]"
              >
                {CTA.nova}
              </Link>
              <Link
                href={ROUTES.pricing}
                className="text-xs font-medium text-[#6D6664] hover:text-[#C8C4C0] transition-colors self-center"
              >
                Included in Starter and Growth →
              </Link>
            </div>
          </div>

          {/* Right: Nova live conversation trace */}
          <div className="flex-shrink-0 w-full lg:max-w-[288px]">
            <div
              className="rounded-xl overflow-hidden border border-[#2A2020]"
              style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
            >
              {/* Terminal bar */}
              <div
                className="flex items-center gap-1.5 px-3.5 py-2 border-b border-[#2A2020]"
                style={{ background: "#171415" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A2020]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A2020]" />
                <span className="ml-1 font-mono text-[9px] text-[#6D6664] tracking-widest">
                  nova · responding
                </span>
              </div>

              {/* Chat trace */}
              <div className="px-3 py-3.5 flex flex-col gap-3" style={{ background: "#1A1616" }}>
                <div className="flex justify-center">
                  <span className="font-mono text-[9px] text-[#6D6664] bg-[#2A2020] rounded-full px-2.5 py-0.5">
                    Missed call · nova triggered
                  </span>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-[#2A2020] border border-[#333] px-3 py-2"
                    style={{ borderRadius: "1rem 1rem 1rem 0.25rem" }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-1 h-1 rounded-full bg-[#7C5CFC]" />
                      <span className="font-mono text-[8px] text-[#7C5CFC] tracking-widest">nova</span>
                    </div>
                    <p className="text-[11px] leading-snug text-[#C8C4C0]">
                      Hi! You just called — didn&apos;t want you to wait. Can I help you book?
                    </p>
                    <span className="font-mono text-[9px] text-[#6D6664]/50 mt-1 block">0.4s response</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <div className="max-w-[75%] bg-[#6A2C3E] px-3 py-2"
                    style={{ borderRadius: "1rem 1rem 0.25rem 1rem" }}>
                    <p className="text-[11px] leading-snug text-white">
                      Yes — Saturday morning?
                    </p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-[#2A2020] border border-[#333] px-3 py-2"
                    style={{ borderRadius: "1rem 1rem 1rem 0.25rem" }}>
                    <p className="text-[11px] leading-snug text-[#C8C4C0]">
                      Saturday I have 10am and 1pm open. Which works best?
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <span className="text-[9px] font-semibold text-[#7C5CFC] bg-[#7C5CFC]/10 border border-[#7C5CFC]/20 rounded-full px-3 py-0.5">
                    ✓ lead qualified · booking in progress
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WhereNext — editorial wayfinding strip ────────────────────────────────────
function WhereNext() {
  const links = [
    { label: "Systems",   sub: "Every system we build",      href: ROUTES.systems  },
    { label: "Verticals", sub: "Your industry, specifically", href: ROUTES.verticals },
    { label: "Pricing",   sub: "Compare packages",            href: ROUTES.pricing  },
    { label: "Nova",      sub: "AI front-desk layer",         href: ROUTES.nova, accent: true },
  ];

  return (
    <section className="bg-[#FAF5F0] border-y border-[#EDE3DE] py-10 md:py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[#C8C4C0] mb-5">
          Go deeper
        </p>
        <div className="divide-y divide-[#EDE3DE]">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group flex items-center justify-between py-4 hover:pl-1 transition-all duration-150"
            >
              <div className="flex items-baseline gap-3">
                <span
                  className={`text-base font-semibold transition-colors ${
                    l.accent
                      ? "text-[#7C5CFC] group-hover:text-[#6b4de8]"
                      : "text-[#1F1A1A] group-hover:text-[#6A2C3E]"
                  }`}
                >
                  {l.label}
                </span>
                <span className="text-xs text-[#6D6664] hidden sm:block">{l.sub}</span>
              </div>
              <span
                className={`text-sm font-medium transition-transform group-hover:translate-x-1 ${
                  l.accent ? "text-[#7C5CFC]" : "text-[#6A2C3E]"
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

      {/* 2. Stats — dark contrast punch, proof near the top */}
      <StatsBar />

      {/* 3. The Real Problem — editorial split, agitate + reframe */}
      <ProblemSection />

      {/* 4. Era bridge — communication-era thesis (dark, rotating insights) */}
      <EraBridgeSection />

      {/* 5. Case study — resolve early skepticism */}
      <CaseStudySection />

      {/* 6. Nova — dark operational, AI front-desk presence */}
      <NovaBridge />

      {/* 7. Where to go next — editorial wayfinding strip */}
      <WhereNext />

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
