import { Button } from "@/components/button";
import { FAQ, type FaqItem } from "@/components/faq";
import CTA from "@/components/cta";
import { BookRequestForm } from "@/components/book-request-form";
import { BookExitIntent } from "@/components/book-exit-intent";
import { BookingLeadTracker } from "@/components/booking-lead-tracker";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/book",
  title: "Get Your Free Revenue Signal Report",
  description:
    "Tell us what you use to book, where the front desk is leaking, and what kind of business you run. We will review it personally and reply within one business day with two or three times for a focused walkthrough.",
});

const bookFaqs: FaqItem[] = [
  {
    id: "is-this-a-sales-pitch",
    question: "Is this a sales pitch?",
    answer:
      "No. The Revenue Signal Report is a working deliverable. You will leave with a clear map of where your front desk, booking flow, and follow-up system are leaking revenue, and whether Ops by Noell is a fit. If it is not, we will say so.",
  },
  {
    id: "switch-booking-systems",
    question: "Do I need to switch booking systems?",
    answer:
      "No. We install the AI front desk around the booking system you already use. Your booking system stays the system of record.",
  },
  {
    id: "who-shows-up",
    question: "Who actually shows up on the call?",
    answer:
      "An Ops by Noell operator who has installed this system for real service businesses. Not a sales rep. Not an SDR.",
  },
  {
    id: "what-to-prepare",
    question: "What do I need to have ready?",
    answer:
      "Nothing. If you have your current booking system link and a rough sense of how many calls you miss on a busy day, that is more than enough.",
  },
  {
    id: "why-no-live-calendar",
    question: "Why not a live calendar?",
    answer:
      "Audits are scheduled personally right now. You get a human reply, not a booking widget, because the first touchpoint should prove we actually run the front desk. When we add a real scheduler, it will be one we trust end to end. Not before.",
  },
  {
    id: "not-ready-after-call",
    question: "What if I am not ready to move forward after the call?",
    answer:
      "You keep the audit. We tell you what we would do, in order, with or without us. That part is yours to keep.",
  },
];

const whatHappensNext = [
  {
    number: "01",
    title: "A real person reviews your booking flow.",
    detail:
      "Someone on our team reads what you sent, usually the same day, within one business day always.",
  },
  {
    number: "02",
    title: "We reply with two or three working-call times.",
    detail:
      "By email or text, with windows that fit your schedule. You pick one.",
  },
  {
    number: "03",
    title: "We walk through the leaks on the call.",
    detail:
      "We cover what we already spotted, estimate what those leaks may be worth, and answer your questions.",
  },
  {
    number: "04",
    title: "If it is a fit, you get a recommended track.",
    detail:
      "We map the right Ops by Noell track and install path. If it is not a fit, we will say so.",
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
            { name: "Request a working call", path: "/book" },
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
          Get your free{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            Revenue Signal Report.
          </span>
        </h1>
        <p className="relative z-20 mt-5 max-w-2xl text-center text-charcoal/80 text-base md:text-lg leading-relaxed">
          Tell us what you use to book, where the front desk is leaking, and
          what kind of business you run. We will review it personally and
          reply within one business day with two or three times for a focused
          walkthrough.
        </p>
      </section>

      {/* Form intro */}
      <section className="px-4 pt-8 pb-2">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-sm md:text-base text-charcoal/75 leading-relaxed">
            The report starts here. Six quick details help us map your
            missed-call, rebooking, and follow-up leaks before the call.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 pt-4 pb-10">
        <BookRequestForm />
      </section>

      {/* What happens after you send it */}
      <section className="px-4 py-14 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
              What happens after you send it
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal leading-tight">
              No widget. No queue. A human reply.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {whatHappensNext.map((step) => (
              <div
                key={step.number}
                className="rounded-[20px] border border-warm-border bg-white p-6 md:p-7"
              >
                <span className="font-mono text-[10px] text-charcoal/70">
                  {step.number}
                </span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-charcoal">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-charcoal/70 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-xs md:text-sm text-charcoal/70 italic max-w-xl mx-auto leading-relaxed">
            We do not chase. We do not add you to a list. If it is not a fit,
            we will say so.
          </p>
        </div>
      </section>

      {/* Trust and proof block */}
      <section className="px-4 py-12 md:py-14">
        <div className="max-w-2xl mx-auto rounded-[22px] border border-warm-border bg-cream-dark p-7 md:p-9">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
            Currently running
          </p>
          <p className="font-serif text-lg md:text-xl text-charcoal leading-snug">
            Currently keeping the front desk moving for Healing Hands by
            Santa — a solo licensed therapeutic massage practice in Laguna
            Niguel run by Santa, the owner. In fourteen days, four missed
            calls turned into booked appointments and{" "}
            <span className="text-wine">nine hundred sixty dollars</span> in
            recovered revenue.
          </p>
          <p className="mt-5 text-sm text-charcoal/70 leading-relaxed">
            We work alongside the booking and practice management software
            your business already uses. Based in Orange County, California.
            Served nationally.
          </p>
        </div>
      </section>

      {/* Booking FAQ */}
      <FAQ
        eyebrow="Before you send the form"
        headlineStart="Short answers."
        headlineAccent="Zero pressure."
        body="The questions people ask right before they request a working call."
        faqs={bookFaqs}
      />

      {/* Soft exit. Noell Support fallback. */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto rounded-[22px] border border-warm-border bg-cream-dark p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-strong mb-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lilac-dark" />
            Not ready to send the form?
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal mb-3">
            Ask Noell Support a question first.
          </h3>
          <p className="text-sm text-charcoal/70 max-w-md mx-auto mb-6">
            Pop open the chat in the bottom-right and ask anything. It routes
            to Noell when you are ready.
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
        headlineStart="The Revenue Signal Report is"
        headlineAccent="here when you are."
        body="You can always come back. We do not chase, and we do not add you to a list."
        trustLine="Free · Reviewed personally · Reply within one business day"
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={null}
        sourcePage="book"
      />
    </div>
  );
}
