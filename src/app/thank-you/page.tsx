import { Button } from "@/components/button";
import { BookingCalendarEmbed } from "@/components/booking-calendar-embed";
import { ThankYouConversions } from "@/components/thank-you-conversions";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/thank-you",
  title: "We Got Your Request",
  description:
    "Your Missed Call Audit request is in. A real person on our team will review it and reply within one business day.",
  noindex: true,
});

const whatHappensNext = [
  {
    number: "01",
    title: "Your request is already in our queue.",
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
          Your audit is{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            in good hands.
          </span>
        </h1>
        <p className="relative z-20 mt-5 max-w-2xl text-center text-cream/80 text-base md:text-lg leading-relaxed">
          A real person will read what you sent within one business day.
        </p>
      </section>

      {/* GHL Calendar — moved to top, primary action while intent is highest */}
      <section className="px-4 pt-8 pb-10">
        <div className="max-w-3xl mx-auto text-center mb-6">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-2">
            Skip the wait
          </p>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream">
            Book your audit call directly.
          </h2>
          <p className="mt-2 text-cream/70 text-sm md:text-base">
            30-minute Missed Call Audit call, Tuesday through Thursday, 10 AM
            to 5 PM Pacific.
          </p>
        </div>
        <BookingCalendarEmbed
          id="thank-you-booking"
          maxWidth="800px"
        />
      </section>

      {/* Social proof — reinforce the decision just made */}
      <section className="px-4 py-10 md:py-12">
        <div className="max-w-2xl mx-auto rounded-[22px] border border-white/10 bg-[#301A26] p-7 md:p-9">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-3">
            Currently running
          </p>
          <p className="font-serif text-lg md:text-xl text-cream leading-snug">
            Healing Hands by Santa, a solo licensed massage practice in Laguna
            Niguel, was losing clients every time she was with a client. Her
            phone went quiet. No follow-up went out. Clients booked elsewhere.
            In fourteen days, four missed calls turned into booked appointments
            and{" "}
            <span className="text-wine font-semibold">
              $960 in recovered revenue.
            </span>{" "}
            No new software. No configuration. We built it, installed it, and
            ran it.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
            {[
              { stat: "4", label: "missed calls recovered" },
              { stat: "$960", label: "revenue in 14 days" },
              { stat: "75%", label: "fewer no-shows" },
            ].map((item) => (
              <div key={item.stat} className="text-center">
                <p className="font-serif text-2xl font-semibold text-wine">
                  {item.stat}
                </p>
                <p className="text-[10px] text-cream/60 uppercase tracking-wide mt-1">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What happens next steps */}
      <section className="px-4 py-14 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
              Here is what happens now
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

      {/* Soft exit — replaced "Back to home" with a high-value resource */}
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
            Pop open the chat in the bottom-right and ask anything. It routes
            to Noell when you are ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/noell-support" variant="lilac" className="h-11 px-6">
              See what Noell Support does
            </Button>
            <Button
              href="/resources/missed-call-recovery-for-service-businesses"
              variant="secondary"
              className="h-11 px-6"
            >
              Read: Missed Call Recovery
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
