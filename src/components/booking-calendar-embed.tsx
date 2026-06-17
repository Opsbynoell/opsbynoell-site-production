"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

const GHL_BOOKING_ID = "ko7eXb5zooItceadiV02";

/**
 * GHL booking calendar embed, deferred until the container is within 200px
 * of the viewport. Neither the iframe nor the form_embed.js auto-resize
 * script is injected before then.
 *
 * form_embed.js resizes the iframe to its content once loaded, so the
 * min(720px, 85vh) minHeight is only a fallback to avoid layout shift.
 *
 * Until the iframe's load event fires, a fixed-height skeleton at the same
 * min(720px, 85vh) reserves the space and shows a loading line, so the
 * booking section never renders as a blank region.
 */
export function BookingCalendarEmbed({
  id,
  title = "Book Missed Call Audit Call",
  scriptStrategy = "lazyOnload",
  maxWidth,
}: {
  /** Unique iframe id, one per embed instance on a page. */
  id: string;
  title?: string;
  /** Use "afterInteractive" only where the calendar is the primary action. */
  scriptStrategy?: "lazyOnload" | "afterInteractive";
  /** Optional max width (e.g. "800px") applied to the iframe. */
  maxWidth?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const timer = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(timer);
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        minHeight: "min(720px, 85vh)",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        margin: "0 auto",
      }}
    >
      {!loaded && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[16px] border border-white/10 bg-white/[0.03]"
          style={{
            height: "min(720px, 85vh)",
            ...(maxWidth ? { maxWidth, margin: "0 auto", left: 0, right: 0 } : {}),
          }}
        >
          <span className="w-8 h-8 rounded-full border-2 border-white/15 border-t-white/60 animate-spin" />
          <p className="text-sm text-cream/60 animate-pulse">
            Loading available times...
          </p>
        </div>
      )}
      {visible && (
        <>
          <iframe
            src={`https://api.leadconnectorhq.com/widget/booking/${GHL_BOOKING_ID}`}
            onLoad={() => setLoaded(true)}
            style={{
              width: "100%",
              minHeight: "min(720px, 85vh)",
              border: "none",
              overflow: "hidden",
              display: "block",
              ...(maxWidth ? { maxWidth, margin: "0 auto" } : {}),
            }}
            scrolling="no"
            title={title}
            id={id}
          />
          <Script
            src="https://link.msgsndr.com/js/form_embed.js"
            strategy={scriptStrategy}
          />
        </>
      )}
    </div>
  );
}
