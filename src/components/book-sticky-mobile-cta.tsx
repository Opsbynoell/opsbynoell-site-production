"use client";

import { useEffect, useRef, useState } from "react";

/**
 * StickyMobileBookCta
 * Renders a fixed bottom bar on mobile (<768px) that scrolls into view
 * only when the primary BookRequestForm has scrolled out of the viewport.
 * Clicking it smooth-scrolls back to the form.
 */
export function StickyMobileBookCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Watch the form card — show sticky bar when form is out of view
    const form = document.querySelector('[aria-label="Request a working call"]');
    if (!form) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(form);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    const form = document.querySelector('[aria-label="Request a working call"]');
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      aria-hidden={!visible}
      className={[
        // Only visible on mobile
        "md:hidden",
        "fixed bottom-0 left-0 right-0 z-50",
        "px-4 py-3",
        "bg-[#1A0D13] border-t border-white/10",
        "transition-transform duration-300 ease-in-out",
        visible ? "translate-y-0" : "translate-y-full",
      ].join(" ")}
    >
      <button
        onClick={handleClick}
        className="w-full rounded-full bg-wine text-cream text-sm font-medium py-3.5 tap-target hover:bg-wine-dark transition-colors"
      >
        Get Your Free Revenue Signal Report
      </button>
    </div>
  );
}
