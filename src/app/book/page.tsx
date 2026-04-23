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
import { BookingEmbed } from "@/components/booking-embed";
import { BookingLeadTracker } from "@/components/booking-lead-tracker";
import { ProofBar } from "@/components/proof-bar";
import { DetectedTimezone } from "@/components/detected-timezone";
import { BookExitIntent } from "@/components/book-exit-intent";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/book",
  title: "Book Your Free Audit",
  description:
    "Pick a 30-minute audit slot on Nikki's calendar. No pitch, no pressure. A clear map of where leads are falling through and what a system could recover.",
});

const steps = [
  {
    icon: <IconCalendarEvent size={24} />,
    number: "01",
    title: "Pick a time",
    detail:
      "Send two or three times that work for you, and Nikki will confirm one personally. You will get a confirmation by text or email and a reminder the day before your audit.",
  },
  {
    icon: <IconClipboardCheck size={24} />,
    number: "02",
    title: "We audit your front desk flow",
    detail:
      "We review your follow-up flow, response time, booking process, and communication gaps. You share how it runs today, we do the digging.",
  },
  {
    icon: <IconRoute size={24} />,
    number: "03",
    title: "Get your action plan",
    detail:
      "You leave with a clear map of what's leaking and exactly what to fix, whether you work with us or not. No pitch, no pressure.",
  },
];

const afterSteps = [
  {
    icon: <IconMessage2 size={18} />,
    title: "Confirmation on its way",
    detail:
      "You'll receive a booking confirmation by text or email, usually within a few minutes.",
  },
  {
    icon: <IconBellRinging size={18} />,
    title: "Reminder the day before",
    detail: "A gentle reminder lands the day before your audit call.",
  },
  {
    icon: <IconPhoneCall size={18} />,
    title: "Focused call, clear map",
    detail: "30 focused minutes with a written follow-up afterward.",
  },
];

const bookFaqs = [
  {
    question: "Is this really free?",
    answer:
      "Yes. The audit is free and the output is yours, whether or not you choose to work with us. We do this because it's the fastest way to see if we're a fit.",
  },
  {
    question: "What do I need to prepare?",
    answer:
      "Nothing formal. Be able to describe your current booking flow, what tool you use for scheduling, and roughly how often calls go unanswered. Sharing your phone number and website before the call helps us dig in.",
  },
  {
    question: "What if I can't make the time I booked?",
    answer:
      "Just hit reschedule from the confirmation text. No need to email or explain. The system picks a new slot for you.",
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
      <JsonLd
        data={[
          faqPageSchema(bookFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Book your audit", path: "/book" },
          ]),
        ]}
        id="book"
      />
      <BookExitIntent />
      <BookingLeadTracker />

      {/* Hero */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-4 mx-auto flex-col items-center justify-center pt-20 md:pt-24 pb-6 md:pb-8 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.50)] via-[rgba(240,224,214,0.70)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
          The first step
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal">
          Your free{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            operations audit.
          </span>
        </h1>
        <p className="relative z-20 mt-4 max-w-xl text-center text-charcoal/70 text-sm md:text-base leading-relaxed">
          30 minutes. No pitch, no pressure. We look at where leads are falling
          through, how your follow-up works today, and what a system could
          recover.
        </p>
        <div className="relative z-20 mt-4 flex flex-wrap items-center justify-center gap-2">
          {[
            "Free & no obligation",
            "30 minutes, focused",
            "Booked on a real calendar",
          ].map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center rounded-full border border-wine/30 bg-white px-3 py-1.5 text-xs text-wine"
            >
              {chip}
            </span>
          ))}
        </div>
      </section>

      {/* Booking embed, eager-loaded, space reserved to avoid CLS */}
      <section className="pt-2 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-[28px] border border-warm-border bg-white shadow-[0px_61px_24px_0px_rgba(28,25,23,0.00),0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.08)] overflow-hidden">
            <div className="px-6 md:px-8 pt-4 pb-3 border-b border-warm-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="text-[11px] uppercase tracking-[0.2em] text-wine">
                Pick a time
              </p>
              <p className="text-xs text-charcoal/60">
                Times shown in your local timezone.
              </p>
            </div>

            <div className="p-4 md:p-6 min-h-[520px]">
              <BookingEmbed />
            </div>

            <div className="px-8 pb-6">
              <DetectedTimezone />
            </div>
          </div>

          {/* Proof bar */}
          <div className="mt-10 flex justify-center">
            <ProofBar className="mt-0 md:mt-0" />
          </div>

          {/* Santa pull quote */}
          <div className="mt-10 rounded-[22px] border border-warm-border bg-cream-dark p-7 md:p-10 max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
              Client voice
            </p>
            <blockquote className="font-serif text-xl md:text-2xl text-charcoal leading-snug">
              &ldquo;Hi Santa, sorry I missed you. I can get you in Saturday
              2pm or 3pm. Which works?&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-charcoal/70">
              Santa E., massage therapist. $960 recovered in 14 days.
            </p>
          </div>

          {/* What happens after */}
          <div className="mt-10">
            <h2 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-5">
              What happens after you book
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {afterSteps.map((item, i) => (
                <div
                  key={i}
                  className="rounded-[17px] border border-warm-border bg-cream-dark p-5"
                >
                  <div
                    aria-hidden="true"
                    className="w-8 h-8 rounded-lg bg-wine/10 text-wine flex items-center justify-center mb-3"
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-sm font-semibold text-charcoal mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal/60 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3-step explainer, moved below proof */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              The process
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Three steps.{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                Done in 30 minutes.
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

      {/* Booking FAQ */}
      <FAQ
        eyebrow="Before you book"
        headlineStart="Short answers."
        headlineAccent="Zero pressure."
        body="The questions people ask right before they pick a time."
        faqs={bookFaqs}
      />

      {/* Soft exit: Noell Support fallback */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto rounded-[22px] border border-warm-border bg-cream-dark p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-strong mb-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lilac-dark" />
            Not ready to book?
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-3">
            Ask Noell Support a question first.
          </h3>
          <p className="text-sm text-charcoal/60 max-w-md mx-auto mb-6">
            Noell Support is the new-prospect intake layer. Pop open the chat
            in the bottom-right and ask anything. It routes to Noell when
            you&apos;re ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/noell-support" variant="lilac" className="h-11 px-6">
              See what Noell Support does
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
        trustLine="Free · focused working call · personally scheduled"
      />
    </div>
  );
}
