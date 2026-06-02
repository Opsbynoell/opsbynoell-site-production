import Script from "next/script";
import { Button } from "@/components/button";
import { ThankYouConversions } from "@/components/thank-you-conversions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/thank-you",
  title: "We Got Your Request",
  description:
    "Your Revenue Signal Report request is in. A real person on our team will review it and reply within one business day.",
  noindex: true,
});

const whatHappensNext = [
  {
    number: "01",
    title: "A real person reviews your request.",
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

export default function ThankYouPage() {
  return (
    <div>
      {/* Page-load conversion tracking */}
      <ThankYouConversions />

      {/* Hero / Confirmation */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-4 mx-auto flex-col items-center justify-center pt-20 md:pt-24 pb-6 md:pb-8 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.30)] via-[rgba(31,18,25,0.85)] to-[rgba(19,11,15,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
          Got it
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-cream">
          We got your request!{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            Here&rsquo;s what happens next.
          </span>
        </h1>
        <p className="relative z-20 mt-5 max-w-2xl text-center text-cream/80 text-base md:text-lg leading-relaxed">
          A real person on our team will read what you sent, usually the same
          day, within one business day always. You will get a reply by email or
          text with two or three time windows that fit your schedule.
        </p>
      </section>

      {/* What happens next steps */}
      <section className="px-4 py-14 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
              What happens after you send it
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream leading-tight">
              No widget. No queue. A human reply.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {whatHappensNext.map((step) => (
              <div
                key={step.number}
                className="rounded-[20px] border border-white/10 bg-[#271520] p-6 md:p-7"
              >
                <span className="font-mono text-[10px] text-cream/70">
                  {step.number}
                </span>
                <h3 className="mt-3 font-serif text-xl font-semibold text-cream">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-cream/70 leading-relaxed">
                  {step.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GHL Revenue Signal Report Calendar */}
      <section style={{ marginTop: "2rem", padding: "0 1rem 4rem" }}>
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <h2
            style={{
              fontFamily: "serif",
              fontSize: "1.75rem",
              fontWeight: 600,
              color: "var(--color-cream, #f5f0eb)",
              marginBottom: "0.75rem",
            }}
          >
            Want to skip the wait? Book directly.
          </h2>
          <p
            style={{
              color: "rgba(245,240,235,0.75)",
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            Pick a time that works for you. 30-minute Revenue Signal Report
            call, Tuesday through Thursday, 10 AM to 5 PM Pacific.
          </p>
        </div>
        <iframe
          src="https://api.leadconnectorhq.com/widget/booking/HRQS43hNklkuUBBgDTPe"
          style={{
            width: "100%",
            minHeight: "720px",
            border: "none",
            display: "block",
            maxWidth: "800px",
            margin: "0 auto",
          }}
          title="Book Revenue Signal Report Call"
          scrolling="no"
          id="HRQS43hNklkuUBBgDTPe_msgsndr-calendar"
        />
        <Script
          src="https://link.msgsndr.com/js/form_embed.js"
          strategy="afterInteractive"
        />
      </section>

      {/* Soft exit */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto rounded-[22px] border border-white/10 bg-[#301A26] p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-strong mb-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lilac-dark" />
            Have a question first?
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-3">
            Ask Noell Support anything.
          </h3>
          <p className="text-sm text-cream/70 max-w-md mx-auto mb-6">
            Pop open the chat in the bottom-right and ask anything. It routes to
            Noell when you are ready.
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
    </div>
  );
}
