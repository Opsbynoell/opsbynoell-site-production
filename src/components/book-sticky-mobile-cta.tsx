"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  trackAuditCtaClick,
  type SourcePage,
  type SourceSection,
} from "@/lib/analytics";

interface StickyMobileBookCtaProps {
  /**
   * When provided, the bar becomes a link to this href (e.g. "/book") and
   * appears after the visitor scrolls past the hero. When omitted, the bar
   * keeps its original behavior: it watches the BookRequestForm and
   * smooth-scrolls back to it (used on /book).
   */
  href?: string;
  label?: string;
  sourcePage?: SourcePage;
  sourceSection?: SourceSection;
}

/**
 * StickyMobileBookCta
 * Fixed bottom bar on mobile (<768px) that gives the visitor a persistent
 * path to booking.
 *
 * - href mode (e.g. homepage): renders a Link to href, shown once the
 *   visitor scrolls past the hero (~600px), and fires the audit CTA event.
 * - form mode (default, /book): shown only when the BookRequestForm has
 *   scrolled out of view; clicking smooth-scrolls back to the form.
 */
export function StickyMobileBookCta({
  href,
  label = "Get Your Free Missed Call Audit",
  sourcePage = "home",
  sourceSection = "sticky_mobile",
}: StickyMobileBookCtaProps = {}) {
  const [visible, setVisible] = useState(false);

  // href mode: reveal after scrolling past the hero.
  useEffect(() => {
    if (!href) return;
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [href]);

  // form mode: reveal when the BookRequestForm scrolls out of view.
  useEffect(() => {
    if (href) return;
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
  }, [href]);

  const handleFormScroll = () => {
    const form = document.querySelector('[aria-label="Request a working call"]');
    if (form) {
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const wrapperClass = [
    "md:hidden",
    "fixed bottom-0 left-0 right-0 z-50",
    "px-4 py-3",
    "bg-[#1A0D13] border-t border-white/10",
    "transition-transform duration-300 ease-in-out",
    visible ? "translate-y-0" : "translate-y-full",
  ].join(" ");

  const buttonClass =
    "block w-full text-center rounded-full bg-wine text-cream text-sm font-medium py-3.5 tap-target hover:bg-wine-dark transition-colors";

  return (
    <div aria-hidden={!visible} className={wrapperClass}>
      {href ? (
        <Link
          href={href}
          className={buttonClass}
          data-event="audit_cta_click"
          data-source-page={sourcePage}
          data-source-section={sourceSection}
          onClick={() =>
            trackAuditCtaClick(sourcePage, sourceSection, {
              destination: href,
              cta_label: label,
            })
          }
        >
          {label}
        </Link>
      ) : (
        <button onClick={handleFormScroll} className={buttonClass}>
          {label}
        </button>
      )}
    </div>
  );
}
