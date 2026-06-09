"use client";

import { useEffect } from "react";

/**
 * Fires Meta Pixel Lead event once on mount when the visitor lands on /thank-you.
 *
 * NOTE: The Google Ads conversion event (AW-18123945519/UI5DCPOdgKYcEK_slcJD)
 * is intentionally NOT fired here. It fires exactly once at the point of form
 * submission inside book-request-form.tsx via trackConversion(). Firing it
 * again on page load would double-count conversions and corrupt Smart Bidding.
 */

export function ThankYouConversions() {
  useEffect(() => {
    // Meta Pixel Lead event — fires on /thank-you page load
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Lead");
    }
  }, []);

  return null;
}
