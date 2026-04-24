"use client";

import { useEffect } from "react";
import { trackConversion, ConversionEvents } from "@/lib/analytics";

export function BookingLeadTracker() {
  useEffect(() => {
    trackConversion(ConversionEvents.AUDIT_PAGE_VIEW, {
      source_page: "book",
    });
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const data = event.data;
      if (typeof data !== "object" || data === null) return;
      const type = String(
        (data as { type?: unknown; event?: unknown }).type ||
          (data as { type?: unknown; event?: unknown }).event ||
          ""
      ).toLowerCase();
      if (!/booking|appointment|confirm/.test(type)) return;
      if (typeof window === "undefined") return;
      if (sessionStorage.getItem("ops_lead_fired") === "1") return;
      if (typeof (window as { fbq?: unknown }).fbq !== "function") return;
      (window as unknown as { fbq: (...args: unknown[]) => void }).fbq(
        "track",
        "Lead",
        { content_name: "booking_confirmed" }
      );
      sessionStorage.setItem("ops_lead_fired", "1");
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  return null;
}
