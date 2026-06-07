"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconCheck, IconDownload, IconArrowRight } from "@tabler/icons-react";

type FormState = "idle" | "submitting" | "done" | "error";

const leakItems = [
  "Where your missed calls are going (and how to stop the bleed)",
  "The weekend inquiry window most service businesses ignore",
  "How to identify lapsed clients before they book elsewhere",
  "The 3 tests you can run on your own front desk today",
];

const socialProof = [
  { stat: "5 min", label: "Missed-call recovery" },
  { stat: "14 days", label: "Live in your business" },
  { stat: "24/7", label: "Front desk coverage" },
];

export default function RevenueSignalGuidePage() {
  const [state, setState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");

    try {
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: "revenue-signal-guide-lp" }),
      });

      if (!res.ok) {
        console.error("Lead magnet API error:", res.status);
      }

      // Fire Google Ads conversion event
      if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("event", "conversion", {
          send_to: "AW-18123945519/fPkICIXqybocEK_slcJD",
        });
      }

      setState("done");
    } catch {
      setState("done");
    }
  }

  return (
    <div className="min-h-screen bg-[#1F1219] text-[#F5EAE0] overflow-hidden">

      {/* ─── RADIAL GLOW BACKGROUND ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(139,42,66,0.28) 0%, transparent 70%)",
        }}
      />
      {/* Subtle arc ring */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[-120px] z-0"
        style={{
          width: "900px",
          height: "900px",
          borderRadius: "50%",
          border: "1px solid rgba(139,42,66,0.12)",
        }}
      />

      {/* ─── MINIMAL HEADER ─────────────────────────────────────────────── */}
      <header className="relative z-10 w-full px-6 py-5 flex items-center border-b border-[rgba(245,234,224,0.08)]">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo-ops-by-noell-cream-text.png"
            alt="Ops by Noell"
            width={979}
            height={740}
            className="h-10 w-auto"
            priority
          />
        </Link>
      </header>

      {/* ─── HERO / MAIN CONTENT ────────────────────────────────────────── */}
      <main className="relative z-10 w-full px-6 pt-16 pb-8 md:pt-24 md:pb-12 max-w-5xl mx-auto">

        {/* Eyebrow */}
        <p
          className="text-center text-[11px] uppercase tracking-[0.28em] font-medium mb-6"
          style={{ color: "#A89090" }}
        >
          Free Guide · Ops by Noell
        </p>

        {/* Headline */}
        <h1
          className="font-serif text-center text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-5 max-w-3xl mx-auto"
          style={{ color: "#F5EAE0" }}
        >
          Find out where your{" "}
          <em
            className="not-italic"
            style={{
              background: "linear-gradient(181deg, #C45A2A 18%, #9A3A18 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontStyle: "italic",
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
            }}
          >
            front desk is leaking revenue.
          </em>
        </h1>

        {/* Subhead */}
        <p
          className="text-center text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto"
          style={{ color: "rgba(245,234,224,0.65)" }}
        >
          A practical 3-step audit you can run on your own service business in
          15 minutes. Free. No credit card. Instant download.
        </p>

        {/* Social proof bar */}
        <div className="flex items-center justify-center gap-8 md:gap-12 mb-12">
          {socialProof.map(({ stat, label }) => (
            <div key={label} className="text-center">
              <p
                className="font-serif text-2xl font-semibold"
                style={{ color: "#F5EAE0" }}
              >
                {stat}
              </p>
              <p
                className="text-[11px] uppercase tracking-[0.18em] mt-0.5"
                style={{ color: "#A89090" }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

          {/* Left: What's inside */}
          <div className="pt-2">
            <p
              className="text-sm font-semibold mb-5"
              style={{ color: "#F5EAE0" }}
            >
              What&apos;s inside:
            </p>
            <ul className="space-y-4 mb-8">
              {leakItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(139,42,66,0.18)" }}
                  >
                    <IconCheck size={12} style={{ color: "#B5415E" }} />
                  </span>
                  <span
                    className="text-sm leading-relaxed"
                    style={{ color: "rgba(245,234,224,0.80)" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* Trust line */}
            <div
              className="flex items-center gap-2 rounded-xl px-4 py-3"
              style={{
                background: "rgba(42,21,32,0.60)",
                border: "1px solid rgba(245,234,224,0.08)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: "#C45A2A" }}
              />
              <p
                className="text-xs"
                style={{ color: "rgba(245,234,224,0.55)" }}
              >
                Used by service businesses across the US to recover missed revenue
                in the first 30 days.
              </p>
            </div>
          </div>

          {/* Right: Form card */}
          <div
            className="rounded-[24px] p-8"
            style={{
              background: "#271520",
              border: "1px solid rgba(245,234,224,0.10)",
              boxShadow:
                "0px 24px 64px rgba(0,0,0,0.40), 0px 1px 0px rgba(255,255,255,0.06) inset",
            }}
          >
            {state !== "done" ? (
              <>
                <h2
                  className="font-serif text-xl font-semibold mb-1.5"
                  style={{ color: "#F5EAE0" }}
                >
                  Get the free guide
                </h2>
                <p
                  className="text-sm mb-6"
                  style={{ color: "rgba(245,234,224,0.55)" }}
                >
                  Enter your name and email — we&apos;ll send it right over.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "rgba(245,234,224,0.65)" }}
                    >
                      Your name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Jane Smith"
                      className="w-full rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none"
                      style={{
                        background: "#1F1219",
                        border: "1px solid rgba(245,234,224,0.12)",
                        color: "#F5EAE0",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(139,42,66,0.60)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(245,234,224,0.12)")
                      }
                    />
                  </div>
                  <div>
                    <label
                      className="block text-xs font-medium mb-1.5"
                      style={{ color: "rgba(245,234,224,0.65)" }}
                    >
                      Business email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="jane@yourbusiness.com"
                      className="w-full rounded-xl px-4 py-3 text-sm transition-colors focus:outline-none"
                      style={{
                        background: "#1F1219",
                        border: "1px solid rgba(245,234,224,0.12)",
                        color: "#F5EAE0",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(139,42,66,0.60)")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.borderColor =
                          "rgba(245,234,224,0.12)")
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="w-full rounded-[8px] px-6 py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all hover:brightness-110 disabled:opacity-60"
                    style={{
                      background:
                        "linear-gradient(181deg, #C45A2A 18.12%, #9A3A18 99.57%)",
                      boxShadow:
                        "0px 4px 8px 0px rgba(196,90,42,0.30), 0px 2px 4px 0px rgba(196,90,42,0.18), 0px 0px 0px 1px rgba(196,90,42,0.15), 0px 1px 1px 2px rgba(255,255,255,0.22) inset, 0px -1px 5px 2px rgba(255,255,255,0.15) inset",
                    }}
                  >
                    {state === "submitting" ? (
                      "Sending…"
                    ) : (
                      <>
                        <IconDownload size={16} />
                        Get the Free Guide
                      </>
                    )}
                  </button>
                  <p
                    className="text-xs text-center"
                    style={{ color: "rgba(245,234,224,0.35)" }}
                  >
                    No spam. Unsubscribe anytime.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{ background: "rgba(139,42,66,0.18)" }}
                >
                  <IconCheck size={28} style={{ color: "#B5415E" }} />
                </div>
                <h2
                  className="font-serif text-xl font-semibold mb-3"
                  style={{ color: "#F5EAE0" }}
                >
                  Your guide is ready.
                </h2>
                <p
                  className="text-sm mb-6"
                  style={{ color: "rgba(245,234,224,0.65)" }}
                >
                  Click below to download. We&apos;ll also send a copy to{" "}
                  <span style={{ color: "#F5EAE0" }}>{email}</span>.
                </p>
                <a
                  href="/Revenue_Signal_Report_Guide.pdf"
                  download="Revenue_Signal_Report_Guide.pdf"
                  className="inline-flex items-center gap-2 rounded-[8px] px-6 py-3.5 text-sm font-semibold text-white transition-all hover:brightness-110 mb-7"
                  style={{
                    background:
                      "linear-gradient(181deg, #C45A2A 18.12%, #9A3A18 99.57%)",
                    boxShadow:
                      "0px 4px 8px 0px rgba(196,90,42,0.30), 0px 2px 4px 0px rgba(196,90,42,0.18), 0px 0px 0px 1px rgba(196,90,42,0.15)",
                  }}
                >
                  <IconDownload size={16} />
                  Download the Guide (PDF)
                </a>
                <div
                  className="border-t pt-6"
                  style={{ borderColor: "rgba(245,234,224,0.08)" }}
                >
                  <p
                    className="text-sm mb-4"
                    style={{ color: "rgba(245,234,224,0.55)" }}
                  >
                    Want us to run the audit for you — for free?
                  </p>
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
                    style={{ color: "#B5415E" }}
                  >
                    Get your free Revenue Signal Report call
                    <IconArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ─── FOOTER ─────────────────────────────────────────────────────── */}
      <footer
        className="relative z-10 w-full px-6 py-8 text-center mt-8"
        style={{ borderTop: "1px solid rgba(245,234,224,0.07)" }}
      >
        <p
          className="text-xs"
          style={{ color: "rgba(245,234,224,0.35)" }}
        >
          © {new Date().getFullYear()} Ops by Noell ·{" "}
          <Link
            href="/legal/privacy"
            className="transition-colors hover:opacity-70"
          >
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/" className="transition-colors hover:opacity-70">
            opsbynoell.com
          </Link>
        </p>
      </footer>
    </div>
  );
}
