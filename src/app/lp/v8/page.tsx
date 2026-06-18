import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/lp/v8",
  title: "Variant 8 — Ops by Noell",
  description: "Light-theme landing page preview.",
  noindex: true,
});

/* Variant 8 — light/blush theme preview. Standalone page (the /lp/* route
   skips the global dark nav/footer). Colors from the design tokens:
   cream #FBF3EE / blush #FBEEE9, white cards, ink #20131C, mauve #6E5B66,
   wine #8B2A42 / #6B1A2E / #B5415E. Playfair (font-serif) + Inter (font-sans). */

const stats = [
  { stat: "70%", label: "of missed calls never leave a voicemail" },
  { stat: "$60", label: "average cost per inbound lead" },
  { stat: "5 min", label: "before a lead goes cold" },
];

export default function V8Page() {
  return (
    <div className="min-h-screen bg-[#FBF3EE] text-[#20131C] font-sans antialiased">
      {/* ── Top bar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#F0D9D2] bg-[#FBF3EE]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <span className="font-serif text-xl font-semibold text-[#20131C]">
            Ops <span className="text-[#8B2A42]">by Noell</span>
          </span>
          <Link
            href="/book"
            className="rounded-full border border-[#8B2A42]/40 px-4 py-2 text-sm font-medium text-[#8B2A42] transition-colors hover:bg-[#8B2A42] hover:text-white"
          >
            Book a Call
          </Link>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="px-5 pt-12 pb-10 text-center">
        <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-[#8B2A42]">
          Done-for-you AI front desk · Orange County
        </p>
        <h1 className="mx-auto mt-5 max-w-[18ch] font-serif text-[2rem] font-semibold leading-[1.12] tracking-tight text-[#20131C] md:text-5xl">
          While you&apos;re with a client,{" "}
          <span className="italic text-[#8B2A42]">who&apos;s picking up?</span>
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-[#6E5B66]">
          Every missed call is a client who already booked somewhere else. We
          install an AI front desk that answers, follows up, and fills your
          calendar.{" "}
          <span className="font-semibold text-[#20131C]">Live in 14 days.</span>
        </p>

        {/* 3-step flow visual */}
        <div className="mx-auto mt-8 flex max-w-md items-stretch justify-center gap-2">
          <FlowCard>
            <div className="flex flex-col gap-1.5">
              <span className="h-1.5 w-8 rounded-full bg-[#22C55E]" />
              <span className="h-1.5 w-12 rounded-full bg-[#E7C9C1]" />
              <span className="h-1.5 w-9 rounded-full bg-[#E7C9C1]" />
            </div>
            <span className="mt-3 block text-[10px] font-medium uppercase tracking-wide text-[#9A8089]">
              Missed call
            </span>
          </FlowCard>
          <Connector />
          <FlowCard accent>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B2A42] text-xs font-bold text-white">
              AI
            </span>
            <span className="mt-3 block text-[10px] font-medium uppercase tracking-wide text-[#9A8089]">
              Texts back
            </span>
          </FlowCard>
          <Connector />
          <FlowCard>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FBEEE9] text-[#8B2A42]">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="mt-3 block text-[10px] font-medium uppercase tracking-wide text-[#9A8089]">
              Booked
            </span>
          </FlowCard>
        </div>

        {/* Work-with-us choice */}
        <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9A8089]">
          How would you like to work with us?
        </p>
        <div className="mx-auto mt-4 grid max-w-md grid-cols-2 gap-3">
          <Link
            href="/book"
            className="rounded-2xl border border-[#EAD3CB] bg-white px-4 py-4 text-sm font-semibold text-[#20131C] shadow-[0_1px_2px_rgba(32,19,28,0.04)] transition-colors hover:border-[#8B2A42]/40"
          >
            Alongside your team
          </Link>
          <Link
            href="/book"
            className="rounded-2xl border border-[#8B2A42] bg-[#8B2A42] px-4 py-4 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(139,42,66,0.25)] transition-colors hover:bg-[#6B1A2E]"
          >
            Full AI front desk
          </Link>
        </div>
        <p className="mx-auto mt-4 max-w-sm text-[13px] leading-relaxed text-[#6E5B66]">
          Either way, we build it, install it, and run it — you never manage a
          dashboard.
        </p>
      </section>

      {/* ── Proof card + CTA ────────────────────────────────────── */}
      <section className="px-5 pb-12">
        <div className="mx-auto max-w-md rounded-3xl border border-[#EAD3CB] bg-white p-7 text-center shadow-[0_10px_30px_-12px_rgba(32,19,28,0.12)]">
          <p className="font-serif text-5xl font-semibold text-[#8B2A42]">$2,560</p>
          <p className="mt-1 text-sm text-[#6E5B66]">recovered in 30 days</p>
          <p className="mx-auto my-4 text-[#B5415E]">&#9670;</p>
          <p className="font-semibold text-[#20131C]">Healing Hands by Santa</p>
          <p className="text-sm italic text-[#9A8089]">Laguna Niguel</p>
        </div>

        <div className="mx-auto mt-6 max-w-md text-center">
          <Link
            href="/book"
            className="block w-full rounded-2xl bg-[#8B2A42] px-6 py-4 text-base font-semibold text-white shadow-[0_8px_24px_-6px_rgba(139,42,66,0.4)] transition-colors hover:bg-[#6B1A2E]"
          >
            Get Your Free Front Desk Audit
          </Link>
          <p className="mt-3 text-xs text-[#9A8089]">
            HIPAA Compliant&nbsp;&nbsp;·&nbsp;&nbsp;Free. No pitch. Zero obligation.
          </p>
        </div>
      </section>

      {/* ── Trust row ───────────────────────────────────────────── */}
      <section className="border-y border-[#F0D9D2] bg-white px-5 py-7">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center text-[13px] text-[#6E5B66] md:flex-row md:justify-center md:gap-8">
          <span>Salons, med spas, dental, HVAC</span>
          <span className="hidden md:inline text-[#E0C4BC]">·</span>
          <span>Live in 14 days</span>
          <span className="hidden md:inline text-[#E0C4BC]">·</span>
          <span>Month-to-month, no contracts</span>
          <span className="hidden md:inline text-[#E0C4BC]">·</span>
          <span>Built around the tools you use</span>
        </div>
      </section>

      {/* ── Pain band: the cost of silence ──────────────────────── */}
      <section className="bg-[#FBEEE9] px-5 py-14">
        <div className="mx-auto max-w-md text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8B2A42]">
            The quiet revenue leak
          </p>
          <h2 className="mt-3 font-serif text-[1.75rem] font-semibold text-[#20131C]">
            The cost of <span className="italic text-[#8B2A42]">silence.</span>
          </h2>
          <div className="mt-7 space-y-3 text-left">
            {stats.map((s) => (
              <div
                key={s.stat}
                className="flex items-center gap-4 rounded-2xl border-l-4 border-[#8B2A42] bg-[#FDF6F2] px-5 py-4"
              >
                <span className="font-serif text-3xl font-semibold text-[#8B2A42]">
                  {s.stat}
                </span>
                <span className="text-[15px] leading-snug text-[#6E5B66]">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More sections (ROI estimator, features, steps, testimonials, FAQ,
          CTA band, footer) coming next. */}
      <div className="px-5 py-10 text-center text-xs text-[#9A8089]">
        Variant 8 preview — more sections in progress.
      </div>
    </div>
  );
}

function FlowCard({
  children,
  accent = false,
}: {
  children: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex flex-1 flex-col items-center rounded-2xl border bg-white px-3 py-4 ${
        accent ? "border-[#8B2A42]/30" : "border-[#EAD3CB]"
      }`}
    >
      {children}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex items-center">
      <span className="h-px w-3 bg-[#E0C4BC]" />
      <span className="h-1.5 w-1.5 rounded-full bg-[#B5415E]" />
      <span className="h-px w-3 bg-[#E0C4BC]" />
    </div>
  );
}
