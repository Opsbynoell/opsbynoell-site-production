import { Button } from "@/components/button";
import { BookingConfirmedConversion } from "@/components/booking-confirmed-conversion";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/book/thanks",
  title: "You Are Booked",
  description:
    "Your Missed Call Audit call is on the calendar. The invite is in your email.",
  noindex: true,
});

const whatHappensOnTheCall = [
  {
    number: "01",
    title: "Check your inbox.",
    detail:
      "The calendar invite and confirmation are in your email. Accept the invite so the time stays blocked on your end.",
  },
  {
    number: "02",
    title: "We prepare before we talk.",
    detail:
      "We look at your website, booking flow, and how your business answers when a call goes unanswered. We show up already knowing where to look.",
  },
  {
    number: "03",
    title: "We walk your missed-call numbers.",
    detail:
      "Thirty minutes. We audit your missed call rate, follow-up gaps, and booking flow, and put a dollar figure on what is leaking.",
  },
  {
    number: "04",
    title: "You leave with the findings.",
    detail:
      "What is leaking, what it is worth, and what the fix looks like. If it is not a fit, we will say so.",
  },
];

export default function BookThanksPage() {
  return (
    <div>
      {/* Page-load conversion tracking. The GHL calendar redirects here
          after every booking, so mounting this page IS the confirmation. */}
      <BookingConfirmedConversion />

      {/* Hero / Confirmation */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-4 mx-auto flex-col items-center justify-center pt-20 md:pt-24 pb-6 md:pb-8 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.30)] via-[rgba(31,18,25,0.85)] to-[rgba(19,11,15,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
          Confirmed
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-cream">
          You&apos;re{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            booked.
          </span>
        </h1>
        <p className="relative z-20 mt-5 max-w-2xl text-center text-cream/80 text-base md:text-lg leading-relaxed">
          Your calendar invite is in your email. Accept it now so the time is
          held, and we will see you on the call.
        </p>
      </section>

      {/* What happens on the call */}
      <section className="px-4 py-14 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-3">
              What happens on the call
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-cream leading-tight">
              Thirty minutes. We walk your missed-call numbers.
            </h2>
            <p className="mt-3 text-cream/70 text-sm md:text-base max-w-xl mx-auto">
              No pitch. No deck. You bring nothing. We bring the audit.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {whatHappensOnTheCall.map((step) => (
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

      {/* Social proof. Reinforce the decision just made. */}
      <section className="px-4 py-10 md:py-12">
        <div className="max-w-2xl mx-auto rounded-[22px] border border-white/10 bg-[#301A26] p-7 md:p-9">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-3">
            Currently running
          </p>
          <p className="font-serif text-lg md:text-xl text-cream leading-snug">
            Healing Hands by Santa, a solo licensed massage practice in Laguna
            Niguel, was losing clients every time she was with a client. Her
            phone went quiet. No follow-up went out. Clients booked elsewhere.
            In thirty days, four missed calls turned into booked appointments
            and{" "}
            <span className="text-wine font-semibold">
              $2,560 in recovered revenue.
            </span>{" "}
            No new software. No configuration. We built it, installed it, and
            ran it.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-4 border-t border-white/10 pt-5">
            {[
              { stat: "4", label: "missed calls recovered" },
              { stat: "$2,560", label: "revenue in 30 days" },
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

      {/* Soft exit. Questions before the call. */}
      <section className="px-4 pb-20 pt-4">
        <div className="max-w-3xl mx-auto rounded-[22px] border border-white/10 bg-[#301A26] p-8 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-strong mb-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-lilac-dark" />
            Have a question before the call?
          </p>
          <h3 className="font-serif text-2xl md:text-3xl font-semibold text-cream mb-3">
            Ask Noell Support anything.
          </h3>
          <p className="text-sm text-cream/70 max-w-md mx-auto mb-6">
            Pop open the chat in the bottom-right and ask anything. A real
            person reads everything before we talk.
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
