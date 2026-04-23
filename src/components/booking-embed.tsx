"use client";

import { useState } from "react";
import Link from "next/link";
import { IconMail, IconArrowRight } from "@tabler/icons-react";

/**
 * BookingEmbed, calendar scheduler embed with a branded loading state.
 *
 * Reads the scheduler URL from NEXT_PUBLIC_BOOKING_URL.
 *
 * While the iframe loads, a cream / ink plum skeleton keeps the page
 * feeling authored rather than stuck. If no scheduler URL is configured,
 * we render an honest manual-scheduling fallback (email + chat).
 */

export function BookingEmbed() {
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;
  const [loaded, setLoaded] = useState(false);

  if (!bookingUrl) {
    return <BookingFallback />;
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden border border-warm-border bg-cream min-h-[520px]"
      style={{ height: "640px" }}
    >
      {/* Branded loading state, stays until iframe reports loaded */}
      {!loaded && (
        <div
          aria-hidden={loaded}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-cream text-charcoal px-6 text-center"
        >
          <div className="flex items-center gap-2 mb-5">
            <span
              aria-hidden="true"
              className="inline-block w-1.5 h-1.5 rounded-full bg-[#2E7D5B] animate-pulse"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-strong">
              loading calendar
            </span>
          </div>

          <p className="font-mono text-sm md:text-base tracking-tight text-charcoal">
            Fetching Nikki&apos;s open audit slots
            <LoadingDots />
          </p>

          <p className="mt-5 font-mono text-[11px] uppercase tracking-widest text-muted-strong">
            this takes a second on a slow connection
          </p>

          {/* Subtle skeleton of upcoming dates */}
          <div className="mt-8 grid grid-cols-4 gap-2 max-w-md w-full" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-12 rounded-md border border-warm-border bg-white/70 font-mono text-[10px] flex items-center justify-center text-charcoal/30"
              >
                {String.fromCharCode(9604)}
              </div>
            ))}
          </div>
        </div>
      )}

      <iframe
        title="Book an audit with Nikki Noell"
        src={bookingUrl}
        className="absolute inset-0 w-full h-full"
        loading="eager"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function LoadingDots() {
  return (
    <span aria-hidden="true" className="inline-flex ml-1">
      <span className="animate-pulse [animation-delay:-0.3s]">.</span>
      <span className="animate-pulse [animation-delay:-0.15s]">.</span>
      <span className="animate-pulse">.</span>
    </span>
  );
}

function BookingFallback() {
  return (
    <div className="rounded-2xl border border-warm-border bg-gradient-to-b from-cream to-white p-8 md:p-12">
      <div className="max-w-lg mx-auto text-center">
        <div className="inline-flex items-center gap-2 mb-5">
          <span
            aria-hidden="true"
            className="inline-block w-1.5 h-1.5 rounded-full bg-[#2E7D5B]"
          />
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-strong">
            audits scheduled personally
          </p>
        </div>

        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-4 leading-snug">
          Book your free{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            30-minute audit.
          </span>
        </h2>
        <p className="text-sm text-charcoal/60 leading-relaxed mb-8 max-w-md mx-auto">
          Nikki schedules every audit personally. Send two or three times that
          work for you this week and you&apos;ll hear back with a confirmed
          slot, usually within one business hour on weekdays.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <a
            href="mailto:hello@opsbynoell.com?subject=Free%20audit%20request&body=Hi%20Nikki%2C%20I%27d%20like%20to%20book%20a%20free%20audit.%0A%0AName%3A%20%0ABusiness%3A%20%0APhone%3A%20%0ATimes%20that%20work%3A%20"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-wine text-cream text-sm font-medium px-6 hover:bg-wine-dark transition-colors"
          >
            <IconMail size={16} aria-hidden="true" focusable="false" />
            Email hello@opsbynoell.com
          </a>
          <Link
            href="/noell-support"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white border border-warm-border text-charcoal text-sm font-medium px-6 hover:bg-cream-dark transition-colors"
          >
            Or ask Noell Support
            <IconArrowRight size={14} aria-hidden="true" focusable="false" />
          </Link>
        </div>

        <p className="mt-8 font-mono text-[10px] uppercase tracking-widest text-muted-strong">
          why not self-serve right now?
        </p>
        <p className="mt-2 text-xs text-muted-medium leading-relaxed max-w-md mx-auto">
          Audits are booked by hand while we onboard founding members. Self-serve
          scheduling returns as soon as capacity opens back up.
        </p>
      </div>
    </div>
  );
}
