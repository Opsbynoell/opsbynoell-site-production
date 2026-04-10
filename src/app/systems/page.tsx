import type { Metadata } from "next";
import Link from "next/link";
import { DarkCtaBand } from "@/components/marketing/DarkCtaBand";
import { SectionShell } from "@/components/layout/SectionShell";
import { pageMetadata } from "@/lib/metadata";
import { ROUTES } from "@/lib/constants";
import {
  systemsHero,
  coreSystemsOverview,
  systemBuckets,
  systemBreakdowns,
  packageMapping,
  systemsHowItWorks,
  systemsDarkCta,
} from "@/content/systems";

export const metadata: Metadata = pageMetadata.systems;

// ─── Browser chrome header ─────────────────────────────────────────────────────
function WindowBar({ label }: { label: string }) {
  return (
    <div className="window-bar rounded-t-xl -mx-px -mt-px">
      <span className="window-dot-close" />
      <span className="window-dot-min" />
      <span className="window-dot-expand" />
      <span className="window-label">{label}</span>
    </div>
  );
}

// ─── Status dot + label ────────────────────────────────────────────────────────
function StatusLive({ label = "active" }: { label?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="status-live" />
      <span className="log-line text-[10px] text-[#6D6664]">{label}</span>
    </div>
  );
}

// ─── Icon map for system buckets ───────────────────────────────────────────────
function BucketIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    capture: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M9 1a8 8 0 100 16A8 8 0 009 1z" stroke="#6A2C3E" strokeWidth="1.4"/>
        <path d="M6 9l2 2 4-4" stroke="#6A2C3E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    desk: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="#6A2C3E" strokeWidth="1.4"/>
        <path d="M6 7h6M6 10h4" stroke="#6A2C3E" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    followup: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M15 3L9 9M9 9l-2-2M9 9v4l3-2" stroke="#6A2C3E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 9a6 6 0 0110.5-4" stroke="#6A2C3E" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    reputation: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M9 2l1.8 3.6L15 6.3l-3 2.9.7 4.1L9 11.1l-3.7 2.2.7-4.1-3-2.9 4.2-.7L9 2z" stroke="#6A2C3E" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
    reactivation: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path d="M3 9a6 6 0 0112 0" stroke="#6A2C3E" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M15 6v3h-3" stroke="#6A2C3E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    payment: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="2" y="4" width="14" height="10" rx="2" stroke="#6A2C3E" strokeWidth="1.4"/>
        <path d="M2 8h14" stroke="#6A2C3E" strokeWidth="1.4"/>
        <path d="M5 12h2" stroke="#6A2C3E" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    nova: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="7" stroke="#7C5CFC" strokeWidth="1.4"/>
        <path d="M6 9h6M9 6v6" stroke="#7C5CFC" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    os: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="#6A2C3E" strokeWidth="1.4"/>
        <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="#6A2C3E" strokeWidth="1.4"/>
        <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="#6A2C3E" strokeWidth="1.4"/>
        <rect x="10" y="10" width="6" height="6" rx="1.5" stroke="#6A2C3E" strokeWidth="1.4"/>
      </svg>
    ),
  };
  return <>{icons[icon] ?? null}</>;
}

export default function SystemsPage() {
  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b border-[#EDE3DE] py-20 md:py-28 grain-overlay"
        style={{ background: "linear-gradient(150deg, #FFF7F4 0%, #FAF5F0 50%, #F5F0FF 100%)" }}
      >
        {/* Blush orb */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #E0D4E8 0%, transparent 65%)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #F0E4E8 0%, transparent 65%)" }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Browser-chrome identity strip */}
            <div className="window-frame mb-7 max-w-xs">
              <WindowBar label="opsbynoell-systems — dashboard" />
              <div className="flex items-center justify-between px-3 py-2 bg-[#FAF5F0]">
                <StatusLive label="8 systems active" />
                <span className="log-ts">last sync · now</span>
              </div>
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6664] mb-4">
              {systemsHero.eyebrow}
            </p>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-[#1F1A1A] leading-tight max-w-2xl">
              {systemsHero.headline}
            </h1>
            <p className="mt-5 text-base md:text-lg text-[#6D6664] leading-relaxed max-w-2xl">
              {systemsHero.subhead}
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href={ROUTES.book}
                className="inline-flex items-center justify-center rounded-full bg-[#6A2C3E] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#5a2233] transition-colors shadow-[0_2px_16px_rgba(106,44,62,0.24)] w-full sm:w-auto"
              >
                {systemsHero.primaryCta}
              </Link>
              <Link
                href={ROUTES.pricing}
                className="inline-flex items-center justify-center rounded-full border border-[#EDE3DE] bg-white/70 px-7 py-3.5 text-sm font-semibold text-[#1F1A1A] hover:border-[#6A2C3E]/40 hover:bg-white transition-all w-full sm:w-auto"
              >
                {systemsHero.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Core Systems Overview ─────────────────────────────────────────── */}
      <section className="bg-[#1F1A1A] py-14 md:py-16 relative overflow-hidden">
        {/* Subtle wine glow */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[36rem] h-32 opacity-[0.06]"
          style={{ background: "radial-gradient(ellipse, #6A2C3E 0%, transparent 70%)" }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight">
            {coreSystemsOverview.headline}
          </h2>
          <p className="mt-4 text-base text-[#C8C4C0] leading-relaxed">
            {coreSystemsOverview.subhead}
          </p>
        </div>
      </section>

      {/* ── 3. System Buckets Grid ───────────────────────────────────────────── */}
      <SectionShell className="bg-[#FAF5F0]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemBuckets.map((bucket) => (
            <a
              key={bucket.id}
              href={`#${bucket.id}`}
              className={`group rounded-2xl border p-5 transition-all duration-200 block ${
                bucket.isFeatured
                  ? "lg:col-span-4 bg-[#1F1A1A] border-transparent hover:shadow-[0_8px_36px_rgba(31,26,26,0.22)]"
                  : bucket.isNova
                  ? "bg-[#FAF5F0] border-[#E0D4E8] hover:border-[#7C5CFC]/30 hover:shadow-[0_4px_20px_rgba(124,92,252,0.08)]"
                  : "bg-white border-[#EDE3DE] hover:border-[#6A2C3E]/20 hover:shadow-[0_4px_20px_rgba(106,44,62,0.07)]"
              }`}
            >
              {/* Icon + status row */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                  bucket.isFeatured
                    ? "bg-white/10 border-white/15"
                    : bucket.isNova
                    ? "bg-white border-[#E0D4E8]"
                    : "bg-[#FAF5F0] border-[#EDE3DE]"
                }`}>
                  <BucketIcon icon={bucket.icon} />
                </div>
                {bucket.isFeatured ? (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-[#F0E4E8]/60">
                    Full Stack
                  </span>
                ) : (
                  <StatusLive label={bucket.isNova ? "nova" : "active"} />
                )}
              </div>
              <h3
                className={`font-semibold mb-2 ${
                  bucket.isFeatured
                    ? "text-white text-base"
                    : bucket.isNova
                    ? "text-[#7C5CFC] text-sm"
                    : "text-[#1F1A1A] text-sm"
                }`}
              >
                {bucket.title}
              </h3>
              <p className={`text-xs leading-relaxed ${
                bucket.isFeatured ? "text-[#C8C4C0] max-w-2xl" : "text-[#6D6664]"
              }`}>{bucket.body}</p>
              <p className={`mt-3 text-[9px] font-mono uppercase tracking-wider ${
                bucket.isFeatured ? "text-[#F0E4E8]/35" : "text-[#6A2C3E]/50"
              }`}>
                {bucket.urgencyLine}
              </p>
            </a>
          ))}
        </div>
      </SectionShell>

      {/* ── 4. Deep System Breakdown ─────────────────────────────────────────── */}
      <SectionShell className="bg-[#FAF5F0]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6664] mb-3">
              Under the Hood
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F1A1A] tracking-tight">
              What each system actually does.
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {systemBreakdowns.map((system) => (
              <div
                key={system.id}
                id={system.id}
                className="window-frame scroll-mt-24"
                style={{ boxShadow: "0 2px 20px rgba(31,26,26,0.07)" }}
              >
                {/* Window chrome header */}
                <WindowBar label={`${system.id} · included: ${system.included.join(", ").toLowerCase()}`} />

                <div className="p-6 md:p-8 bg-white">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex items-center gap-2.5">
                      <StatusLive />
                      <h3 className="text-base font-bold text-[#1F1A1A]">
                        {system.title}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5 shrink-0">
                      {system.included.map((pkg) => (
                        <span
                          key={pkg}
                          className="text-[10px] font-semibold uppercase tracking-widest text-[#6A2C3E] bg-[#F0E4E8] rounded-full px-2.5 py-1"
                        >
                          {pkg}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-xl bg-[#FAF5F0] border border-[#EDE3DE] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6D6664] mb-2">
                        The Problem
                      </p>
                      <p className="text-sm leading-relaxed text-[#6D6664]">
                        {system.problem}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#FAF5F0] border border-[#EDE3DE] p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6D6664] mb-2">
                        The Fix
                      </p>
                      <p className="text-sm leading-relaxed text-[#6D6664]">
                        {system.solution}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#F0E4E8] border border-[#6A2C3E]/15 p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-[#6A2C3E] mb-2">
                        Outcome
                      </p>
                      <p className="text-sm leading-relaxed text-[#1F1A1A] font-medium">
                        {system.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionShell>

      {/* ── 5. Package Mapping ───────────────────────────────────────────────── */}
      <SectionShell className="bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6664] mb-3">
              Packages
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F1A1A] tracking-tight">
              {packageMapping.headline}
            </h2>
            <p className="mt-3 text-base text-[#6D6664] leading-relaxed">
              {packageMapping.subhead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {packageMapping.packages.map((pkg) => (
              <div
                key={pkg.name}
                className={`relative rounded-2xl border p-6 flex flex-col transition-shadow ${
                  pkg.isPopular
                    ? "bg-white border-[#6A2C3E] shadow-[0_4px_24px_rgba(106,44,62,0.12)]"
                    : "bg-[#FAF5F0] border-[#EDE3DE] hover:shadow-[0_4px_16px_rgba(31,26,26,0.07)]"
                }`}
              >
                {pkg.isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#6A2C3E] px-4 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}
                <h3 className="text-base font-bold text-[#1F1A1A]">{pkg.name}</h3>
                <div className="mt-2 mb-3">
                  <span className="font-display text-3xl font-bold text-[#1F1A1A]">
                    ${pkg.monthlyPrice}
                  </span>
                  <span className="text-sm text-[#6D6664]">/mo</span>
                  <p className="text-xs text-[#6D6664] mt-0.5">+ ${pkg.setupFee} setup</p>
                </div>
                <p className="text-xs font-semibold text-[#6A2C3E] border-t border-[#EDE3DE] pt-3 mb-3">
                  {pkg.focus}
                </p>
                <ul className="flex flex-col gap-2 flex-1">
                  {pkg.systems.map((sys) => (
                    <li key={sys} className="flex items-start gap-2 text-xs text-[#6D6664]">
                      <span className="mt-0.5 w-3.5 h-3.5 rounded-full bg-[#F0E4E8] flex items-center justify-center flex-shrink-0">
                        <span className="w-1 h-1 rounded-full bg-[#6A2C3E]" />
                      </span>
                      {sys}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-[#6D6664] leading-snug border-t border-[#EDE3DE] pt-3">
                  {pkg.bestFor}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href={ROUTES.pricing}
              className="inline-flex items-center justify-center rounded-full bg-[#6A2C3E] px-7 py-3.5 text-sm font-semibold text-white hover:bg-[#5a2233] transition-colors shadow-[0_2px_14px_rgba(106,44,62,0.2)]"
            >
              {packageMapping.cta}
            </Link>
            <p className="mt-3 text-xs text-[#6D6664]">{packageMapping.ctaNote}</p>
          </div>
        </div>
      </SectionShell>

      {/* ── 6. How It Works — Timeline pattern ───────────────────────────────── */}
      <SectionShell className="bg-[#FAF5F0]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#6D6664] mb-3">
              Process
            </p>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-[#1F1A1A] tracking-tight">
              {systemsHowItWorks.headline}
            </h2>
          </div>

          {/* Vertical timeline */}
          <ol className="relative pl-10">
            {/* Connecting line */}
            <div className="absolute left-[18px] top-3 bottom-3 w-px bg-gradient-to-b from-[#6A2C3E]/50 via-[#6A2C3E]/20 to-transparent" />

            {systemsHowItWorks.steps.map((step, i) => (
              <li
                key={step.number}
                className={`relative flex flex-col gap-1 ${
                  i < systemsHowItWorks.steps.length - 1 ? "pb-10" : ""
                }`}
              >
                {/* Node */}
                <span className="absolute -left-10 top-0.5 w-9 h-9 rounded-full bg-[#F0E4E8] border border-[#6A2C3E]/20 flex items-center justify-center text-xs font-bold text-[#6A2C3E] flex-shrink-0 z-10">
                  {step.number}
                </span>
                {/* Content */}
                <h3 className="text-base font-semibold text-[#1F1A1A] leading-snug pt-1">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#6D6664]">{step.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-center text-sm font-medium text-[#6D6664] bg-white rounded-2xl px-6 py-4 border border-[#EDE3DE]">
            {systemsHowItWorks.supportingLine}
          </p>
        </div>
      </SectionShell>

      {/* ── 7. Dark CTA ──────────────────────────────────────────────────────── */}
      <DarkCtaBand
        headline={systemsDarkCta.headline}
        subhead={systemsDarkCta.subhead}
        primaryCta={systemsDarkCta.primaryCta}
        reassurance={systemsDarkCta.reassurance}
      />
    </>
  );
}
