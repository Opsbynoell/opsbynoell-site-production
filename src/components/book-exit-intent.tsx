"use client";

import { useEffect, useState, useRef } from "react";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { trackConversion, ConversionEvents } from "@/lib/analytics";

const STORAGE_KEY = "book-exit-shown";
const GHL_BOOKING_ID = "ko7eXb5zooItceadiV02";

export function BookExitIntent() {
  const [open, setOpen] = useState(false);
  const scriptLoaded = useRef(false);

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

  // Load the GHL embed script once the modal opens
  useEffect(() => {
    if (!open || scriptLoaded.current) return;
    const script = document.createElement("script");
    script.src = "https://link.msgsndr.com/js/form_embed.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);
    scriptLoaded.current = true;
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Modal panel */}
      <div
        className={cn(
          "relative w-full max-w-2xl rounded-[22px] bg-[#1F1219] border border-white/10",
          "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.18),0px_15px_15px_0px_rgba(28,25,23,0.22),0px_4px_8px_0px_rgba(28,25,23,0.26)]",
          "p-8 md:p-10 max-h-[90vh] overflow-y-auto"
        )}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute top-3 right-3 w-11 h-11 flex items-center justify-center text-cream/70 hover:text-cream tap-target"
        >
          <IconX size={18} />
        </button>

        {/* Header copy */}
        <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
          Before you go
        </p>
        <h3
          id="exit-intent-title"
          className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-2 leading-snug"
        >
          Pick a time before you leave.
        </h3>
        <p className="text-sm text-cream/70 leading-relaxed mb-6">
          A free 20-minute audit. We will show you exactly where your front desk is losing revenue and what it would take to fix it. No pitch. No pressure.
        </p>

        {/* GHL Booking Widget */}
        <iframe
          src={`https://api.leadconnectorhq.com/widget/booking/${GHL_BOOKING_ID}`}
          style={{ width: "100%", border: "none", overflow: "hidden", minHeight: "560px" }}
          scrolling="no"
          id="exit-intent-booking"
        />

        {/* Trust line */}
        <p className="text-[11px] text-cream/40 text-center mt-4">
          Free &middot; No contracts &middot; If it is not a fit, we will say so
        </p>
      </div>
    </div>
  );
}
