"use client";

import { useState } from "react";
import { trackConversion, ConversionEvents } from "@/lib/analytics";

type FormState = "idle" | "submitting" | "sent" | "error";

// Typed helper so TypeScript doesn't complain about window.gtag
type GtagFn = (...args: unknown[]) => void;

interface BookRequestFormProps {
  className?: string;
}

// Dropdown options for booking/practice management software
const BOOKING_SYSTEMS = [
  "Acuity Scheduling",
  "Boulevard",
  "Calendly",
  "Fresha",
  "GlossGenius",
  "GoHighLevel (GHL)",
  "HoneyBook",
  "Jane App",
  "Mindbody",
  "Noterro",
  "Practice Better",
  "ServiceTitan",
  "SimplePractice",
  "Square Appointments",
  "Vagaro",
  "Other / Not sure",
];

// Dropdown options for the primary front-desk leak
const LEAK_OPTIONS = [
  "Missed calls that never get followed up",
  "Leads that go cold before I can respond",
  "No-shows and last-minute cancellations",
  "Manual follow-up taking too much of my time",
  "Booking confirmations and reminders are inconsistent",
  "Slow or no response to web form inquiries",
  "Review generation — I'm not getting enough 5-star reviews",
  "Something else",
];

export function BookRequestForm({ className }: BookRequestFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bookingSystem, setBookingSystem] = useState<string>("");
  const [leakDescription, setLeakDescription] = useState("");
  const [smsConsent, setSmsConsent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;

    if (!name.trim() || !business.trim() || !phone.trim() || !email.trim() || !bookingSystem || !leakDescription) {
      setState("error");
      setErrorMessage("Please complete every field before sending.");
      return;
    }

    setState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/book-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          business: business.trim(),
          phone: phone.trim(),
          email: email.trim(),
          booking_system: bookingSystem,
          leak_description: leakDescription,
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "send_failed");
      }

      // Enhanced Conversions: set user_data BEFORE the conversion event fires
      // so Google can match this conversion to a signed-in Google user.
      if (typeof window !== "undefined") {
        const gtag = (window as Window & { gtag?: GtagFn }).gtag;
        if (typeof gtag === "function") {
          const nameParts = name.trim().split(" ");
          const firstName = nameParts[0] ?? "";
          const lastName = nameParts.slice(1).join(" ") || undefined;
          gtag("set", "user_data", {
            email: email.trim().toLowerCase(),
            phone_number: phone.trim(),
            address: {
              first_name: firstName,
              ...(lastName ? { last_name: lastName } : {}),
            },
          });
        }
      }

      // Fire Google Ads conversion with event_callback so the redirect
      // waits until the conversion ping is acknowledged (or 1 s timeout).
      // This prevents the page navigation from dropping the gtag hit.
      const doRedirect = () => { window.location.href = "/thank-you"; };

      if (typeof window !== "undefined") {
        const gtag = (window as Window & { gtag?: GtagFn }).gtag;
        if (typeof gtag === "function") {
          // Also fire Meta Pixel Lead event
          trackConversion(ConversionEvents.AUDIT_REQUEST_SUBMITTED, {
            source_page: "book",
            source_section: "book_request_form",
          });
          // Re-fire Google Ads conversion with event_callback for reliable delivery
          gtag("event", "conversion", {
            send_to: "AW-18123945519/UI5DCPOdgKYcEK_slcJD",
            value: 200.0,
            currency: "USD",
            event_callback: doRedirect,
          });
          // Safety fallback: redirect after 1 s even if callback never fires
          setTimeout(doRedirect, 1000);
        } else {
          trackConversion(ConversionEvents.AUDIT_REQUEST_SUBMITTED, {
            source_page: "book",
            source_section: "book_request_form",
          });
          doRedirect();
        }
      } else {
        doRedirect();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "send_failed";
      setState("error");
      setErrorMessage(
        message === "send_failed"
          ? "Something went wrong on our side. Try again in a moment, or email hello@opsbynoell.com."
          : message
      );
    }
  }

  if (state === "sent") {
    return (
      <div className={className}>
        <div className="rounded-[22px] border border-white/10 bg-[#301A26] p-8 md:p-10 max-w-2xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            Got it
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-4">
            Your request is in.
          </h2>
          <p className="text-base text-cream/80 leading-relaxed">
            A real person on our team will read it, usually the same day,
            within one business day always. You will get a reply by email or
            text with two or three time windows that fit your schedule.
          </p>
        </div>
      </div>
    );
  }

  const selectClass =
    "w-full rounded-lg border border-cream/20 bg-[#1F1219] px-3 py-3 tap-target text-cream focus:outline-none focus:border-[#C45A2A]/70 focus:bg-[#271520] appearance-none cursor-pointer";

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      aria-label="Request a working call"
    >
      <div className="rounded-[22px] border border-white/10 bg-[#271520] p-7 md:p-9 max-w-2xl mx-auto shadow-[0px_15px_15px_0px_rgba(28,25,23,0.04),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
        <p className="text-xs text-cream/70 mb-5">
          All fields marked <span aria-hidden="true" className="text-wine">*</span> are required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="block">
            <span className="block text-sm text-cream/80 mb-2">
              Name <span aria-hidden="true" className="text-wine">*</span>
              <span className="sr-only"> (required)</span>
            </span>
            <input
              type="text"
              required
              aria-required="true"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full rounded-lg border border-cream/20 bg-[#1F1219] px-3 py-3 tap-target text-cream focus:outline-none focus:border-[#C45A2A]/70 focus:bg-[#271520]"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-cream/80 mb-2">
              Business name <span aria-hidden="true" className="text-wine">*</span>
              <span className="sr-only"> (required)</span>
            </span>
            <input
              type="text"
              required
              aria-required="true"
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              autoComplete="organization"
              className="w-full rounded-lg border border-cream/20 bg-[#1F1219] px-3 py-3 tap-target text-cream focus:outline-none focus:border-[#C45A2A]/70 focus:bg-[#271520]"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-cream/80 mb-2">
              Phone <span aria-hidden="true" className="text-wine">*</span>
              <span className="sr-only"> (required)</span>
            </span>
            <input
              type="tel"
              required
              aria-required="true"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              className="w-full rounded-lg border border-cream/20 bg-[#1F1219] px-3 py-3 tap-target text-cream focus:outline-none focus:border-[#C45A2A]/70 focus:bg-[#271520]"
            />
            <p className="mt-1.5 text-[11px] text-cream/45">Used only to send you calendar options.</p>
          </label>
          <label className="block">
            <span className="block text-sm text-cream/80 mb-2">
              Email <span aria-hidden="true" className="text-wine">*</span>
              <span className="sr-only"> (required)</span>
            </span>
            <input
              type="email"
              required
              aria-required="true"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border border-cream/20 bg-[#1F1219] px-3 py-3 tap-target text-cream focus:outline-none focus:border-[#C45A2A]/70 focus:bg-[#271520]"
            />
            <p className="mt-1.5 text-[11px] text-cream/45">Where we send your audit summary.</p>
          </label>
        </div>

        {/* Booking system — dropdown instead of free text */}
        <label className="block mt-5">
          <span className="block text-sm text-cream/80 mb-2">
            Current booking or practice management software{" "}
            <span aria-hidden="true" className="text-wine">*</span>
            <span className="sr-only"> (required)</span>
          </span>
          <div className="relative">
            <select
              required
              aria-required="true"
              value={bookingSystem}
              onChange={(e) => setBookingSystem(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>Select your booking software</option>
              {BOOKING_SYSTEMS.map((sys) => (
                <option key={sys} value={sys}>{sys}</option>
              ))}
            </select>
            {/* Custom chevron */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cream/50">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </label>

        {/* Primary leak — dropdown instead of open textarea */}
        <label className="block mt-5">
          <span className="block text-sm text-cream/80 mb-2">
            What is the biggest leak at your front desk right now?{" "}
            <span aria-hidden="true" className="text-wine">*</span>
            <span className="sr-only"> (required)</span>
          </span>
          <div className="relative">
            <select
              required
              aria-required="true"
              value={leakDescription}
              onChange={(e) => setLeakDescription(e.target.value)}
              className={selectClass}
            >
              <option value="" disabled>Choose the one that hurts most</option>
              {LEAK_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {/* Custom chevron */}
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cream/50">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                <path d="M1 1l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>
        </label>

        {/* SMS / TCPA consent */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-wine/25 bg-wine/5 p-4">
          <input
            type="checkbox"
            id="sms-consent"
            checked={smsConsent}
            onChange={(e) => setSmsConsent(e.target.checked)}
            className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-white/20 accent-wine cursor-pointer"
          />
          <label htmlFor="sms-consent" className="text-xs text-cream/85 leading-relaxed cursor-pointer select-none">
            <span className="font-medium text-cream/90">Optional:</span> Send me text updates about my Missed Call Audit. Message and data rates may apply. Reply STOP to opt out at any time. View our{" "}
            <a href="/sms-policy" className="underline underline-offset-2 text-wine/70 hover:text-wine transition-colors">SMS Policy</a>{" "}and{" "}
            <a href="/legal/privacy" className="underline underline-offset-2 text-wine/70 hover:text-wine transition-colors">Privacy Policy</a>.
          </label>
        </div>

        <div className="mt-7 flex flex-col items-stretch gap-3">
          <button
            type="submit"
            disabled={state === "submitting"}
            aria-busy={state === "submitting"}
            className="rounded-full bg-[linear-gradient(181deg,_#C45A2A_18%,_#9A3A18_100%)] text-white text-sm font-medium px-6 py-3 tap-target hover:brightness-110 transition-all shadow-[0px_4px_8px_0px_rgba(196,90,42,0.30)] disabled:opacity-60"
            data-event="audit_cta_click"
            data-source-page="book"
            data-source-section="book_request_form"
          >
            {state === "submitting" ? "Sending..." : "Send my Missed Call Audit request"}
          </button>
          <p role="alert" aria-live="polite" className="text-sm text-wine min-h-[1.25rem]">
            {state === "error" ? errorMessage : ""}
          </p>
        </div>
      </div>
    </form>
  );
}
