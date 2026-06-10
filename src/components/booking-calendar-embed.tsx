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
    <div ref={containerRef} style={{ minHeight: "min(720px, 85vh)" }}>
      {visible && (
        <>
          <iframe
            src={`https://api.leadconnectorhq.com/widget/booking/${GHL_BOOKING_ID}`}
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
