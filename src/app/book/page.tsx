import type { Metadata } from "next";
import Link from "next/link";
import {
  IconCalendarEvent,
  IconClipboardCheck,
  IconRoute,
  IconBellRinging,
  IconMessage2,
  IconPhoneCall,
} from "@tabler/icons-react";
import { Button } from "@/components/button";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";

export const metadata: Metadata = {
  title: "Book Your Free Audit — Ops by Noell",
  description:
    "15 minutes. No pitch, no pressure. See exactly where leads are falling through and what a system could recover.",
};

const steps = [
  {
    icon: <IconCalendarEvent size={24} />,
    number: "01",
    title: "Pick a time",
    detail:
      "Choose a 15-minute slot on Noell's calendar. You'll get a confirmation text immediately and a reminder the day before.",
  },
  {
    icon: <IconClipboardCheck size={24} />,
    number: "02",
    title: "We audit your systems",
    detail:
      "We review your follow-up flow, response time, booking process, and communication gaps. You share your stack, we do the digging.",
  },
  {
    icon: <IconRoute size={24} />,
    number: "03",
    title: "Get your action plan",
    detail:
      "You leave with a clear map of what's leaking and exactly what to fix — whether you work with us or not. No pitch, no pressure.",
  },
];

const afterSteps = [
  {
    icon: <IconMessage2 size={18} />,
    title: "Instant confirmation text",
    detail: "You'll get a text within 30 seconds of booking.",
  },
  {
    icon: <IconBellRinging size={18} />,
    title: "Smart reminder",
    detail: "A gentle reminder lands the day before your audit.",
  },
  {
    icon: <IconPhoneCall size={18} />,
    title: "Quick call, clear map",
    detail: "15 focused minutes with a written follow-up afterward.",
  },
];

const bookFaqs = [
  {
    question: "Is this really free?",
    answer:
      "Yes. The audit is free and the output is yours — whether or not you choose to work with us. We do this because it's the fastest way to see if we're a fit.",
  },
  {
    question: "What do I need to prepare?",
    answer:
      "Nothing formal. Be able to describe your current booking flow, what tool you use for scheduling, and roughly how often calls go unanswered. Sharing your phone number and website before the call helps us dig in.",
  },
  {
    question: "What if I can't make the time I booked?",
    answer:
      "Just hit reschedule from the confirmation text. No need to email or explain — the system picks a new slot for you.",
  },
  {
    question: "Is this a sales call in disguise?",
    answer:
      "No. The call is an actual audit. We'll tell you whether the system we build is the right fit. If it isn't, we'll tell you what is.",
  },
];

export default function BookPage() {
  return (
    <div>
      {/* Hero — centered template pattern, no mockup */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-20 mx-auto flex-col items-center justify-center pt-32 pb-20 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.50)] via-[rgba(240,224,214,0.70)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-charcoal/60 mb-6">
          The first step
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-charcoal">
          Your free{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            operations audit.
          </span>
        </h1>
        <p className="relative z-20 mt-6 max-w-xl text-center text-charcoal/70 text-base md:text-lg leading-relaxed">
          15 minutes. No pitch, no pressure. We look at where leads are falling
          through, how your follow-up works today, and what a system could
          recover.
        </p>
        <div className="relative z-20 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-charcoal/50">
          <span>Free &amp; no obligation</span>
          <span>·</span>
          <span>15 minutes, max</span>
          <span>·</span>
          <span>Instant confirmation</span>
        </div>
      </section>

      {/* 3-step process using Features3 card pattern */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              The process
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Three steps.{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                Done in 15 minutes.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div
                key={i}
                className="relative rounded-[22px] border border-warm-border bg-white p-7 md:p-8 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-wine/10 text-wine flex items-center justify-center">
                    {step.icon}
                  </div>
                  <span className="text-[10px] font-mono text-charcoal/30">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-charcoal/60 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking embed scaffold — template card */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[28px] border border-warm-border bg-white shadow-[0px_61px_24px_0px_rgba(28,25,23,0.00),0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.08)] overflow-hidden">
            <div className="px-8 pt-8 pb-4 border-b border-warm-border">
              <p className="text-[11px] uppercase tracking-[0.2em] text-wine mb-2">
                Pick a time
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal">
                All times shown in your local timezone.
              </h2>
            </div>

            <div className="p-6 md:p-8">
              {/* Real embed scaffold — replace src with live GHL/Calendly URL */}
              <div
                className="relative rounded-2xl overflow-hidden border border-warm-border bg-cream"
                style={{ height: "640px" }}
              >
                {/* Skeleton + iframe (iframe only loads when NEXT_PUBLIC_BOOKING_URL is set) */}
                <div className="absolute inset-0 flex items-center justify-center z-0">
                  <div className="flex flex-col items-center gap-3 max-w-sm text-center px-6">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-wine animate-pulse" />
                      <span className="text-[11px] uppercase tracking-widest text-charcoal/50">
                        Loading calendar
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/40">
                      Scheduling widget scaffold. Replace{" "}
                      <code className="text-wine">
                        NEXT_PUBLIC_BOOKING_URL
                      </code>{" "}
                      in env to wire live GHL/Calendly.
                    </p>
                  </div>
                </div>
                <iframe
                  title="Book an audit"
                  src={
                    process.env.NEXT_PUBLIC_BOOKING_URL ||
                    "about:blank"
                  }
                  className="absolute inset-0 w-full h-full z-10"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          {/* What happens after */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {afterSteps.map((item, i) => (
              <div
                key={i}
                className="rounded-[17px] border border-warm-border bg-cream-dark p-5"
              >
                <div className="w-8 h-8 rounded-lg bg-wine/10 text-wine flex items-center justify-center mb-3">
                  {item.icon}
                </div>
                <p className="text-sm font-semibold text-charcoal mb-1">
                  {item.title}
                </p>
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking FAQ */}
      <FAQ
        eyebrow="Before you book"
        headlineStart="Short answers,"
        headlineAccent="zero pressure."
        body="The questions people ask right before they pick a time."
        faqs={bookFaqs}
      />

      {/* Soft exit: Nova fallback */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto rounded-[22px] border border-warm-border bg-cream-dark p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-lilac-dark mb-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lilac-dark" />
            Not ready to book?
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-3">
            Ask Nova a question first.
          </h3>
          <p className="text-sm text-charcoal/60 max-w-md mx-auto mb-6">
            Nova is the first-response assistant. Pop open the chat in the
            bottom-right and ask anything — she routes to Noell when you're
            ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/nova" variant="lilac" className="h-11 px-6">
              See what Nova does
            </Button>
            <Button href="/" variant="secondary" className="h-11 px-6">
              Back to home
            </Button>
          </div>
        </div>
      </section>

      <CTA
        eyebrow="Still thinking"
        headlineStart="The audit is"
        headlineAccent="waiting when you are."
        body="You can always come back. We don't chase, and we don't add you to a list."
        trustLine="Free · 15 minutes · Instant confirmation"
      />
    </div>
  );
}
