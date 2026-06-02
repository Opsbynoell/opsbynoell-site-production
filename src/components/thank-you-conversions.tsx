"use client";

import { useEffect } from "react";

/**
 * Fires Google Ads conversion + Meta Pixel Lead event once on mount.
 * Placed on the /thank-you page so the conversion fires on page load
 * after a successful form submission redirect.
 */

type GtagFn = (...args: unknown[]) => void;

export function ThankYouConversions() {
  useEffect(() => {
    // Google Ads conversion
    if (typeof window !== "undefined") {
      const gtag = (window as Window & { gtag?: GtagFn }).gtag;
      if (typeof gtag === "function") {
        gtag("event", "conversion", {
          send_to: "AW-18123945519/vpq9CNbp8rYcEK_slcJD",
          value: 200.0,
          currency: "USD",
        });
      }
    }

    // Meta Pixel Lead event
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Lead");
    }
  }, []);

  return null;
}
