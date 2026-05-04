import Link from "next/link";
import {
  IconPhoneCall,
  IconRobot,
  IconLayoutDashboard,
  IconHandStop,
  IconChecklist,
  IconShieldLock,
} from "@tabler/icons-react";
import CTA from "@/components/cta";
import { FAQ, type FaqItem } from "@/components/faq";
import { Button } from "@/components/button";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  faqPageSchema,
  servicePageSchema,
} from "@/lib/schema";

const PATH = "/what-you-get";

export const metadata = pageMetadata({
  path: PATH,
  title: "What's Included — Done-for-You AI Front Desk",
  description:
    "A business line that never misses a call, three AI agents in the background, the dashboard that runs your front office, and done-for-you setup.",
  ogTitle: "Stay focused on the client in front of you. We'll handle the phone.",
  ogDescription:
    "An AI front desk that answers your calls, books appointments, and texts customers — without losing the next booking.",
});

type GetItem = {
  icon: React.ReactNode;
  number: string;
  title: string;
  body: React.ReactNode;
  callout?: React.ReactNode;
};

const items: GetItem[] = [
  {
    icon: <IconPhoneCall size={26} />,
    number: "01",
    title: "A business line that never misses a call",
    body: (
      <>
        A dedicated phone number (or we port the one you have), answered the
        moment it rings — by an AI trained on your business, your hours, your
        services, your prices, and your booking rules. Calls get answered,
        qualified, and either booked, transferred, or texted back. No
        voicemail backlog.
      </>
    ),
  },
  {
    icon: <IconRobot size={26} />,
    number: "02",
    title: "Three AI agents working in the background",
    body: (
      <ul className="mt-2 space-y-2 list-none pl-0">
        <li className="flex gap-2">
          <span className="text-wine font-semibold shrink-0">Front Desk</span>
          <span className="text-charcoal/80">
            picks up calls and books appointments
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-wine font-semibold shrink-0">Care</span>
          <span className="text-charcoal/80">
            sends reminders, follows up after visits, and recovers no-shows
          </span>
        </li>
        <li className="flex gap-2">
          <span className="text-wine font-semibold shrink-0">Support</span>
          <span className="text-charcoal/80">
            runs the live chat on your website and your text inbox
          </span>
        </li>
      </ul>
    ),
  },
  {
    icon: <IconLayoutDashboard size={26} />,
    number: "03",
    title: "The dashboard that runs your front office",
    body: (
      <>
        One login. Every call, every text, every chat — organized by customer,
        searchable, with full transcripts. Watch it work in real time, or
        check it once a day. Your call.
      </>
    ),
  },
  {
    icon: <IconHandStop size={26} />,
    number: "04",
    title: "The “tap-in” feature",
    body: (
      <>
        When a customer asks something only you can answer, your AI pauses and
        texts you. You text back from your personal phone — your reply lands
        inside that customer&apos;s conversation as if you typed it from a
        desk. The AI stays out of the way until you&apos;re done.
      </>
    ),
    callout: (
      <div className="mt-5 rounded-[18px] border border-wine/15 bg-blush-light/70 p-5 md:p-6">
        <p className="text-[10px] uppercase tracking-[0.22em] text-wine font-medium mb-2">
          Example
        </p>
        <p className="text-sm md:text-base text-charcoal/85 leading-relaxed">
          You&apos;re with a client. A new customer texts asking about
          availability for a 90-minute appointment next Tuesday at 4 PM.
          Between appointments, you reply &ldquo;Yes, that time is open —
          here&apos;s the booking link.&rdquo; They book. Your current
          client&apos;s appointment was never interrupted.
        </p>
      </div>
    ),
  },
  {
    icon: <IconChecklist size={26} />,
    number: "05",
    title: "Done-for-you setup",
    body: (
      <>
        We do the work. Number, AI training, automations, dashboard,
        deliverability. You get a login and a 10-minute walkthrough video.
        You&apos;re live in a week.
      </>
    ),
  },
  {
    icon: <IconShieldLock size={26} />,
    number: "06",
    title: "Compliance built in, not bolted on",
    body: (
      <>
        Carrier-approved messaging (A2P 10DLC). Encrypted at rest and in
        transit. Auditable trail of every interaction. Architected to stay
        out of PCI scope so you don&apos;t inherit compliance burden from us.
      </>
    ),
  },
];

type Differentiator = { title: string; body: string };

const differentiators: Differentiator[] = [
  {
    title: "Not another inbox.",
    body: "Other tools give you a place to see missed messages. We give you a system that answers them — and only pulls you in when it actually needs you.",
  },
  {
    title: "Not a chatbot.",
    body: "A real voice on the phone, real intelligence in the texts, trained on your specific business.",
  },
  {
    title: "Not a DIY toolkit.",
    body: "You don't configure anything. We build it, run it, and tune it.",
  },
];

type PricingCard = {
  name: string;
  body: string;
  bestFor: string;
  highlighted?: boolean;
};

const pricingCards: PricingCard[] = [
  {
    name: "Starter",
    body: "Dedicated line, NOELL Front Desk, dashboard, 500 conversations/mo.",
    bestFor: "Best for solo operators.",
  },
  {
    name: "Growth",
    body: "Everything in Starter + NOELL Care, website chat widget, no-show recovery.",
    bestFor: "Best for 1–3 person teams.",
    highlighted: true,
  },
  {
    name: "Pro",
    body: "Everything in Growth + advanced analytics, custom agent training, priority support.",
    bestFor: "Best for 4+ teams or multi-location.",
  },
];

const faqs: FaqItem[] = [
  {
    id: "wyg-tech-savvy",
    question: "Do I need to be tech-savvy?",
    answer:
      "No. We set everything up. You get a login and a video.",
  },
  {
    id: "wyg-customers-know",
    question: "Will my customers know it's AI?",
    answer:
      "Only if you want them to. We tune the voice and tone to match your brand.",
  },
  {
    id: "wyg-take-over",
    question: "What happens when I take over a conversation?",
    answer:
      "The AI immediately stops responding in that thread. When you wrap up, it picks back up only if you tell it to.",
  },
  {
    id: "wyg-keep-number",
    question: "Can I keep my existing number?",
    answer: "Yes. We port it.",
  },
  {
    id: "wyg-after-hours",
    question: "What about texts after hours?",
    answer:
      "AI handles them. You wake up to a clean inbox of qualified bookings, not a backlog.",
  },
];

export default function WhatYouGetPage() {
  return (
    <div id="main-content">
      <JsonLd
        data={[
          servicePageSchema({
            name: "Ops by Noell — AI front desk for service businesses",
            description:
              "Done-for-you AI front desk. Dedicated phone line, three AI agents (Front Desk, Care, Support), unified dashboard, tap-in human-handoff, A2P 10DLC compliance.",
            path: PATH,
          }),
          faqPageSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "What You Get", path: PATH },
          ]),
        ]}
        id="what-you-get"
      />

      {/* HERO */}
      <section className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-8 mx-auto flex-col items-center justify-center pt-24 md:pt-28 pb-12 md:pb-16 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-[rgba(107,45,62,0.35)] via-[rgba(240,224,214,0.65)] to-[rgba(250,246,241,1)]">
        <p className="relative z-20 text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-5">
          What you get
        </p>
        <h1 className="relative z-20 max-w-4xl text-center font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-tight">
          Stay focused on the client in front of you.{" "}
          <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
            We&apos;ll handle the phone.
          </span>
        </h1>
        <p className="relative z-20 mt-6 max-w-2xl text-center text-charcoal/80 text-base md:text-lg leading-relaxed">
          Ops by Noell builds an AI front desk that answers your calls, books
          your appointments, and texts your customers — so you can be present
          with the client you&apos;re serving without losing the next booking.
        </p>
        <div className="relative z-20 mt-8">
          <Button
            href="/book"
            variant="primary"
            data-event="audit_cta_click"
            data-source-page="what_you_get"
            data-source-section="hero"
          >
            Book a 15-min walkthrough &rarr;
          </Button>
        </div>
      </section>

      {/* WHAT YOU ACTUALLY GET */}
      <section className="w-full px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              The build
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              What you actually get{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                when you sign up.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {items.map((item) => (
              <article
                key={item.number}
                className="rounded-[22px] border border-warm-border bg-white p-7 md:p-8 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-lg bg-wine/10 text-wine flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-charcoal/70">
                    {item.number}
                  </span>
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-charcoal mb-3 leading-snug">
                  {item.title}
                </h3>
                <div className="text-sm md:text-base text-charcoal/80 leading-relaxed">
                  {item.body}
                </div>
                {item.callout}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE'RE DIFFERENT */}
      <section className="w-full px-4 py-16 md:py-20 bg-cream-dark/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              The difference
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              How we&apos;re{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                different.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className="rounded-[22px] border border-warm-border bg-white p-7 md:p-8"
              >
                <h3 className="font-serif text-lg md:text-xl font-semibold text-charcoal mb-3 leading-snug">
                  {d.title}
                </h3>
                <p className="text-sm md:text-base text-charcoal/75 leading-relaxed">
                  {d.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="w-full px-4 py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine mb-4">
              Pricing
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Three tiers.{" "}
              <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
                Pick where you start.
              </span>
            </h2>
            <p className="mt-4 text-charcoal/70 text-sm md:text-base">
              See full pricing on the{" "}
              <Link
                href="/pricing"
                className="underline underline-offset-4 decoration-wine/40 text-wine hover:text-wine-dark"
              >
                pricing page
              </Link>
              .
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pricingCards.map((card) => (
              <div
                key={card.name}
                className={
                  card.highlighted
                    ? "rounded-[22px] border-2 border-wine bg-white p-7 md:p-8 shadow-[0px_34px_21px_0px_rgba(106,44,62,0.10),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                    : "rounded-[22px] border border-warm-border bg-white p-7 md:p-8"
                }
              >
                {card.highlighted && (
                  <p className="text-[10px] uppercase tracking-[0.22em] text-wine font-medium mb-3">
                    Most teams start here
                  </p>
                )}
                <h3 className="font-serif text-2xl font-semibold text-charcoal mb-3">
                  {card.name}
                </h3>
                <p className="text-sm text-charcoal/80 leading-relaxed mb-4">
                  {card.body}
                </p>
                <p className="text-xs uppercase tracking-[0.18em] text-charcoal/60">
                  {card.bestFor}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button
              href="/book"
              variant="primary"
              data-event="audit_cta_click"
              data-source-page="what_you_get"
              data-source-section="pricing"
            >
              Start with Starter &rarr;
            </Button>
            <Button href="/book" variant="secondary">
              Talk to us first &rarr;
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ
        eyebrow="Questions"
        headlineStart="Common"
        headlineAccent="questions."
        body="Real questions from owners before they sign up."
        faqs={faqs}
      />

      {/* CLOSING CTA */}
      <CTA
        eyebrow="The first step"
        headlineStart="Stop missing the next booking"
        headlineAccent="while you're with the current one."
        body="A 15-minute walkthrough. We show you exactly what gets installed, what it costs, and how fast you'd be live."
        primaryCta={{ label: "Book a 15-min walkthrough", href: "/book" }}
        secondaryCta={{ label: "See full pricing", href: "/pricing" }}
        trustLine="Done-for-you setup · Live in a week · No contracts"
        sourcePage="what_you_get"
      />
    </div>
  );
}
