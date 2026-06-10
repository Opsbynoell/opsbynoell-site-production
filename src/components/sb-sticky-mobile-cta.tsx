"use client";

import { useEffect, useState } from "react";

const CALENDAR_SECTION_ID = "sb-booking-section";
const SCROLL_THRESHOLD_PX = 600;

/**
 * Sticky bottom CTA bar for /for-service-businesses. Mobile only (<768px),
 * appears after 600px of scroll, hides while the inline calendar section is
 * in the viewport. Tapping it smooth-scrolls to the calendar.
 */
export function ServiceBusinessesStickyCta() {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [calendarInView, setCalendarInView] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPast(window.scrollY > SCROLL_THRESHOLD_PX);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const calendar = document.getElementById(CALENDAR_SECTION_ID);
    if (!calendar) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setCalendarInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(calendar);
    return () => observer.disconnect();
  }, []);

  const visible = scrolledPast && !calendarInView;

  const handleClick = () => {
    document
      .getElementById(CALENDAR_SECTION_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      aria-hidden={!visible}
      className={[
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
        tabIndex={visible ? 0 : -1}
        className="w-full rounded-full bg-wine text-cream text-sm font-medium py-3.5 tap-target hover:bg-wine-dark transition-colors"
      >
        Book your free audit
      </button>
    </div>
  );
}
