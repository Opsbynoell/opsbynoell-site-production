import type { Metadata } from "next";
import Link from "next/link";
import {
  IconHandStop,
  IconPhoneOff,
  IconCalendarCheck,
  IconHeartHandshake,
} from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Features3 } from "@/components/features3";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title:
    "Ops by Noell for Massage Therapy | AI Front Desk for Solo and Small-Team Practices",
  description:
    "Hands on a client while the phone rings. Ops by Noell catches missed calls, confirms appointments, and keeps your calendar full without making you feel like a salesperson on top of being a therapist.",
};

const massageStats = [
  {
    value: "$960",
    label: "Recovered",
    detail: "in 14 days from missed calls, real install",
  },
  {
    value: "<1",
    label: "No-shows",
    detail: "per week, down from four",
  },
  {
    value: "24/7",
    label: "Coverage",
    detail: "so Tuesday at 9pm becomes a Friday booking",
  },
];

type Concern = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  worry: string;
  answer: string;
};

const massageConcerns: Concern[] = [
  {
    icon: <IconPhoneOff size={22} />,
    tag: "On the table",
    title: "Hands on a client while the phone rings.",
    worry:
      "You are in a session. The phone buzzes in the other room. You hear it. You cannot answer it. By the time your client is off the table and the sheets are changed, the caller has already Googled another therapist in your zip code.",
    answer:
      "The missed call triggers an on-brand text in under ten seconds. Your next two openings, a warm note in your voice, and a direct booking link. Most prospects book themselves before you are even back at the front.",
  },
  {
    icon: <IconCalendarCheck size={22} />,
    tag: "Dead calendar days",
    title: "Dead days on the calendar stop feeling personal.",
    worry:
      "A slow Tuesday is not just a slow Tuesday. It is the reminder that this business depends on you, and when you are not booked, no one else is picking up the slack. The anxiety leaks into the good weeks too.",
    answer:
      "Reactivation runs quietly in the background. Clients who have not booked in sixty or ninety days get a gentle, warm check-in on the right cadence. Not pushy, not needy, written in your voice. Dead days fill before they even show up on the calendar.",
  },
  {
    icon: <IconHeartHandshake size={22} />,
    tag: "Not a salesperson",
    title: "You became a therapist. Not a salesperson.",
    worry:
      "Every piece of business advice you hear tells you to follow up, upsell, capture reviews, post more, text more. You just want to do good work and have a full book. You would rather eat the slow week than feel like you are chasing clients.",
    answer:
      "The system does the ask, you do the work. Review requests, rebook nudges, and reactivation all run without you touching them. Every message is written in a quiet, warm tone that sounds like you, not a funnel.",
  },
];

const massageCapabilities = [
  {
    icon: <IconPhoneOff size={28} />,
    number: "01",
    title: "Missed-call recovery, always on",
    description:
      "Every call you miss gets an on-brand text in under ten seconds with your next two openings and a booking link. You finish the session. The lead still gets caught.",
    points: [
      "Under 10 second response",
      "On-brand message in your voice",
      "Direct booking link in the text",
    ],
  },
  {
    icon: <IconCalendarCheck size={28} />,
    number: "02",
    title: "Reminder cadence that keeps no-shows low",
    description:
      "Confirmation, reminder, and self-serve reschedule sized to the way your clients actually book. No generic blast, no awkward night-before call.",
    points: [
      "SMS confirmations",
      "Gentle day-before reminder",
      "Self-serve reschedule",
    ],
  },
  {
    icon: <IconHeartHandshake size={28} />,
    number: "03",
    title: "Warm reactivation, not pushy",
    description:
      "Clients who have drifted get a quiet note at the right window. The ones who want to come back, do. The ones who moved away, quietly unsubscribe.",
    points: [
      "60 and 90 day reactivation",
      "Tone written with you",
      "One message per window, max",
    ],
  },
];

const massageFaqs = [
  {
    question: "I am a solo therapist. Is this overkill?",
    answer:
      "Most Ops by Noell installs are solo practitioners or two-to-three-person teams. The Essentials package is built exactly for this: missed-call text-back, appointment confirmations, and one review request sequence. If you have more than eight to ten sessions a week, the system pays for itself from missed-call recovery alone.",
  },
  {
    question: "Does it work with Square, Acuity, Vagaro, or Jane?",
    answer:
      "Yes. We layer on top of the booking tools solo and small-team massage therapists actually use (Square Appointments, Acuity, Vagaro, Jane, Mindbody, and a handful of others). You keep using what you know. The system reads your availability and pushes confirmed bookings back.",
  },
  {
    question: "Will my clients be able to tell it is automated?",
    answer:
      "The opening message makes clear that you are in a session and the reply is automated, then it offers real times and a real link. Clients consistently tell us it feels more considerate than getting no reply at all, because they know exactly where they stand and what to do next.",
  },
  {
    question: "How long is install and how much do I have to set up?",
    answer:
      "Most massage installs are live in fourteen days. You do not configure anything. We write the copy with you, plug in your booking tool, and handle the routing. Your part is roughly a sixty-minute voice-match call during install and a short weekly report after that.",
  },
];

const massageScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-charcoal/70 font-medium">
          Noell Front Desk, Massage
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-charcoal/40">
        solo
      </span>
    </div>

    <div className="bg-white rounded-2xl p-3 mx-1 border border-warm-border/60 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-wine/70 font-medium">
            Missed call, on the table
          </p>
          <p className="text-sm text-charcoal font-medium mt-0.5">Santa E.</p>
          <p className="text-[11px] text-charcoal/50">Auto-text sent, 8s</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blush text-wine">
          caught
        </span>
      </div>
      <div className="mt-2 bg-cream-dark rounded-lg p-2 text-[11px] text-charcoal/80 leading-snug">
        Hi Santa, sorry I missed you, I am with a client. Saturday 2pm or 3pm
        works for deep tissue. Which feels easier?
      </div>
    </div>

    <div className="bg-wine rounded-2xl p-3 mx-1 mt-2 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-cream/70 font-medium">
        Recovered, 14 days
      </p>
      <p className="font-serif text-3xl font-bold text-cream mt-0.5">$960</p>
      <p className="text-[11px] text-cream/60">
        from 4 missed calls, all booked
      </p>
    </div>
  </div>
);

export default function MassageVerticalPage() {
  return (
    <div>
      <Hero
        eyebrow="Ops by Noell for Massage Therapy"
        headlineLine1Start="Hands on"
        headlineLine1Accent="a client."
        headlineLine2Start="Phone"
        headlineLine2Accent="ringing off the hook."
        body="A done-for-you AI front desk for solo and small-team massage practices. Missed calls caught in seconds, reminders that keep no-shows low, and quiet reactivation that fills slow weeks before they show up on the calendar."
        footnote="Built for solo massage therapists and small teams running Square Appointments, Acuity, Vagaro, Jane, or Mindbody."
        primaryCta={{ label: "Get Your Free Massage Audit", href: "/book" }}
        secondaryCta={{
          label: "See how it handles the missed call",
          href: "#massage-concerns",
        }}
        mockScreen={massageScreen}
      />

      <Features
        eyebrow="What therapists see"
        headlineStart="A quieter phone."
        headlineAccent="A fuller book."
        body="Three numbers from a real solo-therapist install."
        stats={massageStats}
      />

      <section id="massage-concerns" className="w-full py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
                solo therapist worries / answered
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              The three things most therapists worry about{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                quietly.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {massageConcerns.map((c, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[22px] border border-warm-border bg-white p-7",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-wine/10 text-wine flex items-center justify-center">
                    {c.icon}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-charcoal/50">
                    {c.tag}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-3 leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm text-charcoal/60 leading-relaxed mb-4 border-l-2 border-warm-border pl-4 italic">
                  {c.worry}
                </p>
                <p className="text-sm text-charcoal/80 leading-relaxed">
                  {c.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Features3
        eyebrow="What changes"
        headlineStart="Three quiet moves"
        headlineAccent="that fill the calendar."
        body="Not a feature list. The three plays that work without making you feel like a salesperson."
        capabilities={massageCapabilities}
      />

      <FAQ
        eyebrow="Massage questions"
        headlineStart="The ones"
        headlineAccent="we hear most often."
        body="Solo and small-team therapists ask us these before signing. Straight answers."
        faqs={massageFaqs}
      />

      <section className="w-full px-4 my-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-charcoal/50 mb-3">
            run a different kind of practice?
          </p>
          <Link
            href="/verticals"
            className="text-sm text-wine hover:text-wine-dark underline underline-offset-4 decoration-wine/30"
          >
            See every vertical Ops by Noell is built for &rarr;
          </Link>
        </div>
      </section>

      <CTA
        eyebrow="For massage therapists"
        headlineStart="Get a free audit"
        headlineAccent="of your call flow."
        body="A 30-minute review of your missed-call recovery, reminder cadence, and reactivation gaps. You walk away with a clear map of what is leaking, whether you work with us or not."
        primaryCta={{
          label: "Book Your Free Massage Audit",
          href: "/book",
        }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · Live in 14 days · No contracts"
      />
    </div>
  );
}
