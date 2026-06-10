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
 * Global listener for the GHL calendar widget's booking-confirmation
 * postMessage. Mounted once in the root layout so it covers every page with
 * an embedded calendar.
 *
 * The confirmation filter is a heuristic until we verify the exact event
 * shape GHL sends — in development every message from a GHL origin is
 * logged raw to the console for that purpose.
 */
export function GhlBookingConversion() {
  const fired = useRef(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (!isGhlOrigin(event.origin)) return;

      if (process.env.NODE_ENV === "development") {
        // Raw payload, so we can verify the real shape of the booking
        // confirmation event before tightening the filter below.
        console.log("[ghl-booking-conversion] message", {
          origin: event.origin,
          data: event.data,
        });
      }

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
