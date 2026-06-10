"use client";

import { useEffect, useRef } from "react";
import { trackBookingConfirmed } from "@/lib/analytics";

const GHL_ORIGINS = [
  "leadconnectorhq.com",
  "msgsndr.com",
  "gohighlevel.com",
];

function isGhlOrigin(origin: string): boolean {
  try {
    const host = new URL(origin).hostname;
    return GHL_ORIGINS.some(
      (domain) => host === domain || host.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

/**
 * Fallback listener for the GHL calendar widget's booking-confirmation
 * postMessage, mounted once in the root layout.
 *
 * The primary conversion path is the /book/thanks page load: the GHL
 * calendar redirects the top window there after every booking. This
 * listener only matters for an embed mode that does not redirect. Both
 * paths call trackBookingConfirmed(), which dedupes via the shared
 * `bookingConvFired` sessionStorage guard, so they can never both fire
 * for one booking.
 */
export function GhlBookingConversion() {
  const fired = useRef(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isGhlOrigin(event.origin)) return;

      let text = "";
      if (typeof event.data === "string") {
        text = event.data;
      } else {
        try {
          text = JSON.stringify(event.data) ?? "";
        } catch {
          return;
        }
      }

      const looksLikeBookingConfirmation =
        /appointment|booking|booked/i.test(text) &&
        /success|confirm|booked|scheduled|complete/i.test(text);
      if (!looksLikeBookingConfirmation) return;

      if (fired.current) return;
      fired.current = true;
      trackBookingConfirmed({
        source_section: "booking_embed",
        destination: typeof window !== "undefined" ? window.location.pathname : undefined,
      });
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return null;
}
