"use client";

import { useState } from "react";
import { trackConversion, ConversionEvents } from "@/lib/analytics";

type FormState = "idle" | "submitting" | "sent" | "error";

interface BookRequestFormProps {
  className?: string;
}

export function BookRequestForm({ className }: BookRequestFormProps) {
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bookingSystem, setBookingSystem] = useState<string>("");
  const [leakDescription, setLeakDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "submitting") return;

    if (!name.trim() || !business.trim() || !phone.trim() || !email.trim() || !bookingSystem || !leakDescription.trim()) {
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
          leak_description: leakDescription.trim(),
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "send_failed");
      }

      setState("sent");
      trackConversion(ConversionEvents.AUDIT_REQUEST_SUBMITTED, {
        source_page: "book",
        source_section: "book_request_form",
      });
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
        <div className="rounded-[22px] border border-warm-border bg-cream-dark p-8 md:p-10 max-w-2xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
            Got it
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-4">
            Your request is in.
          </h2>
          <p className="text-base text-charcoal/80 leading-relaxed">
            A real person on our team will read it, usually the same day,
            within one business day always. You will get a reply by email or
            text with two or three time windows that fit your schedule.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      aria-label="Request a working call"
    >
      <div className="rounded-[22px] border border-warm-border bg-white p-7 md:p-9 max-w-2xl mx-auto shadow-[0px_15px_15px_0px_rgba(28,25,23,0.04),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
        <p className="text-xs text-charcoal/70 mb-5">
          All fields marked <span aria-hidden="true" className="text-wine">*</span> are required.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="block">
            <span className="block text-sm text-charcoal/80 mb-2">
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
              className="w-full rounded-lg border border-warm-border bg-cream px-3 py-3 tap-target text-charcoal focus:outline-none focus:border-wine/60 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-charcoal/80 mb-2">
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
              className="w-full rounded-lg border border-warm-border bg-cream px-3 py-3 tap-target text-charcoal focus:outline-none focus:border-wine/60 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-charcoal/80 mb-2">
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
              className="w-full rounded-lg border border-warm-border bg-cream px-3 py-3 tap-target text-charcoal focus:outline-none focus:border-wine/60 focus:bg-white"
            />
          </label>
          <label className="block">
            <span className="block text-sm text-charcoal/80 mb-2">
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
              className="w-full rounded-lg border border-warm-border bg-cream px-3 py-3 tap-target text-charcoal focus:outline-none focus:border-wine/60 focus:bg-white"
            />
          </label>
        </div>

        <label className="block mt-5">
          <span className="block text-sm text-charcoal/80 mb-2">
            Current booking or practice management software{" "}
            <span aria-hidden="true" className="text-wine">*</span>
            <span className="sr-only"> (required)</span>
          </span>
          <input
            type="text"
            required
            aria-required="true"
            value={bookingSystem}
            onChange={(e) => setBookingSystem(e.target.value)}
            placeholder="What you use to manage appointments"
            maxLength={120}
            className="w-full rounded-lg border border-warm-border bg-cream px-3 py-3 tap-target text-charcoal focus:outline-none focus:border-wine/60 focus:bg-white"
          />
        </label>

        <label className="block mt-5">
          <span className="block text-sm text-charcoal/80 mb-2">
            One sentence on what is leaking at the front desk right now.{" "}
            <span aria-hidden="true" className="text-wine">*</span>
            <span className="sr-only"> (required)</span>
          </span>
          <textarea
            required
            aria-required="true"
            value={leakDescription}
            onChange={(e) => setLeakDescription(e.target.value)}
            rows={3}
            maxLength={500}
            className="w-full rounded-lg border border-warm-border bg-cream px-3 py-3 tap-target text-charcoal focus:outline-none focus:border-wine/60 focus:bg-white resize-y"
          />
        </label>

        <div className="mt-7 flex flex-col items-stretch gap-3">
          <button
            type="submit"
            disabled={state === "submitting"}
            className="rounded-full bg-wine text-cream text-sm font-medium px-6 py-3 tap-target hover:bg-wine-dark transition-colors disabled:opacity-60"
            data-event="audit_cta_click"
            data-source-page="book"
            data-source-section="book_request_form"
          >
            {state === "submitting" ? "Sending..." : "Request a working call."}
          </button>
          {state === "error" && (
            <p className="text-sm text-wine">{errorMessage}</p>
          )}
        </div>
      </div>
    </form>
  );
}
