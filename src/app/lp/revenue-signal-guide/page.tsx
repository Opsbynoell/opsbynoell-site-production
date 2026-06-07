"use client";

import { useState } from "react";
import Link from "next/link";
import { IconCheck, IconDownload, IconArrowRight } from "@tabler/icons-react";

type FormState = "idle" | "submitting" | "done" | "error";

const leakItems = [
  "Where your missed calls are going (and how to stop the bleed)",
  "The weekend inquiry window most service businesses ignore",
  "How to identify lapsed clients before they book elsewhere",
  "The 3 tests you can run on your own front desk today",
];

export default function RevenueSignalGuidePage() {
  const [state, setState] = useState<FormState>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;
    setState("submitting");
    setErrorMsg("");

    try {
      // Submit to the same API endpoint used by the book form
      const res = await fetch("/api/lead-magnet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, source: "revenue-signal-guide-lp" }),
      });

      if (!res.ok) {
        // Even if the API fails, we still give them the download
        // (don't gate the PDF on API success)
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
      // Still show success and allow download even on network error
      setState("done");
    }
  }

  return (
    <div className="min-h-screen bg-[#1F1219] text-cream">
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
      </header>

      {/* ─── MAIN CONTENT ───────────────────────────────────────────────── */}
      <main className="w-full px-6 py-16 md:py-24 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: What's inside */}
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-4">
              Free Guide
            </p>
            <h1 className="font-serif text-3xl md:text-4xl font-semibold text-cream leading-tight mb-5">
              The Revenue Signal Report Guide
            </h1>
            <p className="text-base text-cream/75 leading-relaxed mb-8">
              A practical 3-step audit you can run on your own service business in 15 minutes
              to find exactly where your front desk is leaking revenue.
            </p>
            <p className="text-sm font-medium text-cream mb-4">What&apos;s inside:</p>
            <ul className="space-y-3 mb-8">
              {leakItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <IconCheck size={16} className="text-wine mt-0.5 shrink-0" />
                  <span className="text-sm text-cream/80 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-cream/40">
              Free. No credit card. Instant download.
            </p>
          </div>

          {/* Right: Form or Download */}
          <div className="rounded-[24px] bg-[#271520] border border-wine/20 p-8">
            {state !== "done" ? (
              <>
                <h2 className="font-serif text-xl font-semibold text-cream mb-2">
                  Get the free guide
                </h2>
                <p className="text-sm text-cream/60 mb-6">
                  Enter your name and email and we&apos;ll send it right over.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-cream/70 mb-1.5">
                      Your name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Jane Smith"
                      className="w-full bg-[#1F1219] border border-wine/25 rounded-xl px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-wine/60 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-cream/70 mb-1.5">
                      Business email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="jane@yourbusiness.com"
                      className="w-full bg-[#1F1219] border border-wine/25 rounded-xl px-4 py-3 text-sm text-cream placeholder:text-cream/30 focus:outline-none focus:border-wine/60 transition-colors"
                    />
                  </div>
                  {errorMsg && (
                    <p className="text-xs text-red-400">{errorMsg}</p>
                  )}
                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="w-full bg-wine hover:bg-wine-dark text-cream font-semibold px-6 py-3.5 rounded-full text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
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
                  <p className="text-xs text-cream/40 text-center">
                    No spam. Unsubscribe anytime.
                  </p>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-wine/20 flex items-center justify-center mx-auto mb-5">
                  <IconCheck size={28} className="text-wine" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-cream mb-3">
                  Your guide is ready.
                </h2>
                <p className="text-sm text-cream/70 mb-6">
                  Click below to download. We&apos;ll also send a copy to {email}.
                </p>
                <a
                  href="/Revenue_Signal_Report_Guide.pdf"
                  download="Revenue_Signal_Report_Guide.pdf"
                  className="inline-flex items-center gap-2 bg-wine hover:bg-wine-dark text-cream font-semibold px-6 py-3.5 rounded-full text-sm transition-colors mb-6"
                >
                  <IconDownload size={16} />
                  Download the Guide (PDF)
                </a>
                <div className="border-t border-wine/15 pt-6 mt-2">
                  <p className="text-sm text-cream/60 mb-4">
                    Want us to run the audit for you — for free?
                  </p>
                  <Link
                    href="/book"
                    className="inline-flex items-center gap-2 text-sm font-medium text-wine hover:text-wine-light transition-colors"
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

      {/* ─── MINIMAL FOOTER ─────────────────────────────────────────────── */}
      <footer className="w-full px-6 py-8 border-t border-wine/15 text-center">
        <p className="text-xs text-cream/40">
          © {new Date().getFullYear()} Ops by Noell ·{" "}
          <Link href="/legal/privacy" className="hover:text-cream/70 transition-colors">
            Privacy
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
