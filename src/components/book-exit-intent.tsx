"use client";

import { useEffect, useState } from "react";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { trackConversion, ConversionEvents } from "@/lib/analytics";

const STORAGE_KEY = "book-exit-shown";

export function BookExitIntent() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Desktop only (viewport check + pointer)
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    if (!isDesktop) return;

    const armedAt = Date.now();
    const MIN_WAIT_MS = 5000;

    const onMouseLeave = (e: MouseEvent) => {
      if (Date.now() - armedAt < MIN_WAIT_MS) return;
      if (e.clientY <= 0) {
        setOpen(true);
        sessionStorage.setItem(STORAGE_KEY, "1");
        trackConversion(ConversionEvents.AUDIT_EXIT_INTENT_SHOWN, {
          source_page: "book",
          source_section: "book_exit_intent",
        });
      }
    };

    document.addEventListener("mouseleave", onMouseLeave);
    return () => document.removeEventListener("mouseleave", onMouseLeave);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/book-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error("send failed");
      setState("sent");
      trackConversion(ConversionEvents.AUDIT_WORKSHEET_REQUEST, {
        source_page: "book",
        source_section: "book_exit_intent",
      });
    } catch {
      setState("error");
    }
  };

  if (!open) return null;

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
          "relative w-full max-w-md rounded-[22px] bg-cream border border-warm-border",
          "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.10),0px_15px_15px_0px_rgba(28,25,23,0.14),0px_4px_8px_0px_rgba(28,25,23,0.18)]",
          "p-8"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-charcoal/50 hover:text-charcoal tap-target"
        >
          <IconX size={18} />
        </button>

        <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
          Before you go
        </p>
        <h3
          id="book-exit-title"
          className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-3 leading-snug"
        >
          Not the right time?
        </h3>
        <p className="text-sm text-charcoal/70 leading-relaxed mb-6">
          Get the audit worksheet via email. Same questions we ask on the call,
          yours to run on your own.
        </p>

        {state === "sent" ? (
          <p className="text-sm text-charcoal/80">
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
                className="w-full rounded-lg border border-warm-border bg-white px-3 py-3 tap-target text-charcoal focus:outline-none focus:border-wine/60"
              />
            </label>
            <button
              type="submit"
              disabled={state === "sending"}
              className="rounded-full bg-wine text-cream text-sm font-medium px-5 py-3 tap-target hover:bg-wine-dark transition-colors disabled:opacity-60"
            >
              {state === "sending" ? "Sending..." : "Send me the worksheet"}
            </button>
            {state === "error" && (
              <p className="text-xs text-wine">
                Something went wrong. Try again in a moment.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
