"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import {
  trackConversion,
  ConversionEvents,
  type SourcePage,
} from "@/lib/analytics";

const STORAGE_KEY = "exitIntentDismissed";
const SUPPRESS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/** Routes where the exit-intent modal is allowed to fire. */
const ALLOWED_ROUTES: Record<string, SourcePage> = {
  "/book": "book",
  "/pricing": "pricing",
  "/for-service-businesses": "for_service_businesses",
};

function isSuppressed(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return Date.now() - ts < SUPPRESS_MS;
  } catch {
    return false;
  }
}

export function BookExitIntent() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const sourcePage = ALLOWED_ROUTES[pathname ?? ""];

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!sourcePage) return;
    if (isSuppressed()) return;

    // Desktop only: skip narrow viewports and touch-primary devices
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const armedAt = Date.now();
    const MIN_WAIT_MS = 5000;

    const onMouseLeave = (e: MouseEvent) => {
      if (Date.now() - armedAt < MIN_WAIT_MS) return;
      if (e.clientY <= 0) {
        setOpen(true);
        try {
          localStorage.setItem(STORAGE_KEY, String(Date.now()));
        } catch {
          // Storage unavailable (private mode) — modal still shows once.
        }
        trackConversion(ConversionEvents.AUDIT_EXIT_INTENT_SHOWN, {
          source_page: sourcePage,
          source_section: "book_exit_intent",
        });
        document.removeEventListener("mouseleave", onMouseLeave);
      }
    };

    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, [sourcePage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/book-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: `exit_intent:${pathname}`,
        }),
      });
      if (!res.ok) throw new Error("send failed");
      setState("sent");
      trackConversion(ConversionEvents.AUDIT_WORKSHEET_REQUEST, {
        source_page: sourcePage,
        source_section: "book_exit_intent",
      });
    } catch {
      setState("error");
    }
  };

  if (!sourcePage || !open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-exit-title"
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
    >
      <div
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div
        className={cn(
          "relative w-full max-w-md rounded-[22px] bg-[#1F1219] border border-white/10",
          "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.10),0px_15px_15px_0px_rgba(28,25,23,0.14),0px_4px_8px_0px_rgba(28,25,23,0.18)]",
          "p-8"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-cream/70 hover:text-cream tap-target"
        >
          <IconX size={18} />
        </button>

        <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
          Before you go
        </p>
        <h3
          id="book-exit-title"
          className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-3 leading-snug"
        >
          Want the audit framework as a PDF?
        </h3>
        <p className="text-sm text-cream/70 leading-relaxed mb-6">
          Same questions we work through on the call, yours to run on your own
          before we talk.
        </p>

        {state === "sent" ? (
          <p className="text-sm text-cream/80">
            On its way. Check your inbox in a minute or two.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="block">
              <span className="sr-only">Email address</span>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@business.com"
                className="w-full rounded-lg border border-white/10 bg-[#271520] px-3 py-3 tap-target text-cream focus:outline-none focus:border-wine/60"
              />
            </label>
            <button
              type="submit"
              disabled={state === "sending"}
              aria-busy={state === "sending"}
              className="rounded-full bg-wine text-cream text-sm font-medium px-5 py-3 tap-target hover:bg-wine-dark transition-colors disabled:opacity-60"
            >
              {state === "sending" ? "Sending..." : "Send me the audit framework"}
            </button>
            <p role="alert" aria-live="polite" className="text-xs text-wine min-h-[1rem]">
              {state === "error" ? "Something went wrong. Try again in a moment." : ""}
            </p>
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          <Link
            href="/book"
            onClick={() => setOpen(false)}
            className="text-cream/60 underline underline-offset-4 hover:text-cream transition-colors"
          >
            Or skip the PDF and book your audit
          </Link>
        </p>
      </div>
    </div>
  );
}
