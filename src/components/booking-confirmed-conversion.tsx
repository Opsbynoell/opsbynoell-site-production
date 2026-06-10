"use client";

import { useEffect } from "react";
import { trackBookingConfirmed } from "@/lib/analytics";

/**
 * Fires the booking conversion when /book/thanks mounts. The GHL calendar
 * redirects the top window here after every booking, so a page load IS the
 * confirmation. Dedup against refreshes, back-navigation, and the
 * postMessage fallback is handled inside trackBookingConfirmed via the
 * shared `bookingConvFired` sessionStorage guard.
 */
export function BookingConfirmedConversion() {
  useEffect(() => {
    trackBookingConfirmed({
      source_page: "book",
      source_section: "booking_embed",
      destination: "/book/thanks",
    });
  }, []);

  return null;
}
