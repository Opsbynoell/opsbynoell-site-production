import {
  IconBolt,
  IconListCheck,
  IconAddressBook,
  IconRoute,
  IconLink,
  IconUserCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Features3 } from "@/components/features3";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, servicePageSchema } from "@/lib/schema";
import {
  NOVA_FAQ_EYEBROW,
  NOVA_FAQ_HEADLINE_START,
  NOVA_FAQ_HEADLINE_ACCENT,
  NOVA_FAQ_BODY,
} from "@/content/nova";

export const metadata = pageMetadata({
  path: "/noell-support",
  title: "Noell Support — New-Prospect Intake",
  description:
    "Noell Support handles first response, qualification, contact capture, routing, and booking-link handoff. The new-prospect intake layer of the Noell system.",
});

const supportStats = [
  { value: "<10s", label: "First response", detail: "average text/chat reply" },
  { value: "94%", label: "Qualified", detail: "leads captured with contact" },
  { value: "0", label: "Dropped", detail: "leads in covered hours" },
  { value: "24/7", label: "On", detail: "even at 11pm on a Saturday" },
];

const supportCapabilities = [
  {
    icon: <IconBolt size={22} />,
    title: "First response",
    description:
      "When a call goes unanswered or a chat opens, Noell Support responds in under ten seconds with a warm, on-brand message.",
  },
  {
    icon: <IconListCheck size={22} />,
    title: "Qualification",
    description:
      "Noell Support asks the right questions (service type, timing, urgency) to understand what the prospect actually needs.",
  },
  {
    icon: <IconAddressBook size={22} />,
    title: "Contact capture",
    description:
      "Name, phone, email, service interest. Noell Support collects what you need and logs it straight into your dashboard.",
  },
  {
    icon: <IconRoute size={22} />,
    title: "Smart routing",
    description:
      "Different service? Different location? Noell Support routes the conversation to the right person or workflow automatically.",
  },
  {
    icon: <IconLink size={22} />,
    title: "Booking-link handoff",
    description:
      "When the prospect is ready, Noell Support shares your scheduling link so they can book directly. No back-and-forth.",
  },
  {
    icon: <IconUserCheck size={22} />,
    title: "Human handoff",
    description:
      "Anything Noell Support can't resolve escalates to you immediately with full context. You pick up right where it left off.",
  },
];

const supportFaqs = [
  {
    question: "Is this month-to-month or contract?",
    answer:
      "Month-to-month. No long-term contracts. Cancel anytime with 30 days notice.",
  },
  {
    question: "Why a setup fee?",
    answer:
      "The setup fee covers installation, copy calibration for your voice, system integration, and two rounds of tuning before go-live. It's one-time, disclosed up front, and included in the audit conversation.",
  },
  {
    question: "Do prices increase over time?",
    answer:
      "Existing clients are grandfathered into their signup price. Any future pricing changes only apply to new accounts.",
  },
  {
    question: "Is Noell Support a full AI receptionist?",
    answer:
      "No, and we're careful about that line. Noell Support is the new-prospect intake layer. It handles the critical first minutes: responding, qualifying, capturing, routing, handing off. Noell Front Desk is the separate operations layer that handles calls, scheduling, and reminders.",
  },
  {
    question: "Where does Noell Support live?",
    answer:
      "Embedded on your website (the launcher bottom-right) and wired into your missed-call recovery flow. The same assistant handles website chat and post-missed-call SMS replies.",
  },
  {
    question: "Can I customize what Noell Support says?",
    answer:
      "Yes. During install, we write the opening message, starter chips, qualification questions, and handoff copy in your voice. Updates are included in managed ops.",
  },
  {
    question: "What happens if Noell Support gets asked something unusual?",
    answer:
      "Noell Support escalates. Anything outside its scripted scope goes to you with full transcript + context. It never makes up answers. That's the entire point of honest positioning.",
  },
  {
    question: "How is this different from Noell Front Desk?",
    answer:
      "Noell Front Desk is the operations layer of the system: calls, scheduling, confirmations, reminders, reschedules, review capture, and reactivation. Noell Support is the entry layer for new prospects. They run together, but they are distinct agents in the Noell system.",
  },
];

const supportScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-charcoal/70 font-medium">
          Noell Support · Online
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-charcoal/70">
        live
      </span>
    </div>

    {/* Support greeting */}
    <div className="bg-white rounded-2xl rounded-bl-md p-3 mx-1 border border-warm-border/60 shadow-sm text-[11px] text-charcoal leading-snug">
      Hi, I&apos;m Noell Support. Looking to book or ask a question?
    </div>

    {/* Visitor reply */}
    <div className="flex justify-end mt-2 mx-1">
      <div className="bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white rounded-2xl rounded-br-md p-3 text-[11px] leading-snug max-w-[75%] shadow-sm">
        I keep missing calls during appointments.
      </div>
    </div>

    {/* Support qualification */}
    <div className="bg-white rounded-2xl rounded-bl-md p-3 mx-1 mt-2 border border-warm-border/60 shadow-sm text-[11px] text-charcoal leading-snug">
      That&apos;s exactly what we solve. Can I grab your name and best number?
      I&apos;ll route this to Noell.
    </div>

    {/* Handoff indicator */}
    <div className="bg-lilac-light rounded-2xl p-2 mx-1 mt-2 border border-lilac-dark/20 text-center">
      <p className="text-[9px] uppercase tracking-widest text-lilac-dark font-medium">
        Human handoff · routed
      </p>
    </div>
  </div>
);

export default function NoellSupportPage() {
  return (
    <div>
      <JsonLd
        data={[
          servicePageSchema({
            name: "Noell Support — New-Prospect Intake",
            description:
              "New-prospect intake layer of the Noell system: first response, qualification, contact capture, routing, and booking-link handoff.",
            path: "/noell-support",
            serviceType: "AI new-prospect intake layer",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Noell Support", path: "/noell-support" },
          ]),
        ]}
        id="noell-support"
      />
      <Hero
        variant="lilac"
        eyebrow="Noell Support · New prospect intake"
        headlineLine1Start="Your first"
        headlineLine1Accent="response."
        headlineLine2Start="Not your"
        headlineLine2Accent="whole front desk."
        body="Noell Support catches the prospects you can't get to. Responds instantly, qualifies the lead, captures their info, routes them, and hands them off to you or your booking link."
        footnote="Noell Support is the entry layer of the Noell system. Noell Front Desk runs operations. Noell Care looks after existing clients."
        primaryCta={{ label: "Get Noell Support on your site", href: "/book" }}
        secondaryCta={{ label: "Watch how Noell handles this", href: "#how-noell-responds" }}
        mockScreen={supportScreen}
        priceSignal={
          <>
            Starts at $197/mo.{" "}
            <Link href="/pricing" className="underline underline-offset-4 decoration-charcoal/55 hover:text-charcoal">
              See all tiers.
            </Link>
          </>
        }
      />

      {/* Stats */}
      <Features
        eyebrow="What Noell Support catches"
        headlineStart="Every lead gets"
        headlineAccent="a response."
        body="The numbers we watch on a live Noell Support install."
        stats={supportStats}
        accent="lilac"
      />

      {/* 6 capabilities */}
      <section id="capabilities" className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-4">
              What Noell Support does
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Six things,{" "}
              <span className="italic bg-gradient-to-b from-lilac-dark to-lilac bg-clip-text text-transparent">
                done well.
              </span>
            </h2>
            <p className="mt-5 text-charcoal/70 max-w-xl mx-auto">
              Noell Support is not trying to be everything. It handles the
              critical first minutes of every new prospect, the window where
              most revenue is lost.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {supportCapabilities.map((cap, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[17px] border border-warm-border bg-white p-6",
                  "shadow-[0px_15px_15px_0px_rgba(28,25,23,0.04),0px_4px_8px_0px_rgba(28,25,23,0.04)]"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-lilac-dark/10 text-lilac-dark flex items-center justify-center">
                    {cap.icon}
                  </div>
                  <span className="text-[10px] font-mono text-charcoal/70">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-charcoal mb-1.5">
                  {cap.title}
                </h3>
                <p className="text-sm text-charcoal/70 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Does / Does Not honesty band */}
      <section className="w-full max-w-7xl mx-auto rounded-3xl bg-charcoal px-6 py-20 md:py-28 my-10 md:my-16">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-lilac/60 mb-4">
            Honest positioning
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
            Prospect intake,{" "}
            <span className="italic text-lilac">not full front desk.</span>
          </h2>
          <p className="mt-5 text-cream/65 max-w-xl mx-auto">
            Noell Support handles the first minutes with new prospects. Noell
            Front Desk is the separate operations layer that handles calls,
            scheduling, and everything a receptionist runs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Does */}
          <div className="rounded-[17px] border border-lilac-dark/30 bg-lilac-dark/10 p-6 md:p-7">
            <p className="text-[10px] uppercase tracking-[0.2em] text-lilac mb-4 font-semibold">
              Noell Support does
            </p>
            <ul className="space-y-3">
              {[
                "Instant first response",
                "Lead qualification",
                "Contact capture",
                "Smart routing",
                "Booking-link handoff",
                "Human escalation with context",
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm text-cream flex items-center gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lilac" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Does Not */}
          <div className="rounded-[17px] border border-white/10 bg-white/[0.04] p-6 md:p-7">
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream/60 mb-4 font-semibold">
              Noell Support does not
            </p>
            <ul className="space-y-3">
              {[
                "Manage your calendar",
                "Reschedule appointments",
                "Process payments",
                "Replace your staff",
                "Run fully autonomously",
                "Pretend to be Noell Front Desk",
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm text-cream/65 flex items-center gap-2.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cream/20" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="max-w-3xl mx-auto mt-8 rounded-[17px] bg-lilac-dark/20 border border-lilac-dark/30 px-6 py-4 text-center">
          <p className="text-sm text-cream/85">
            <span className="font-semibold text-cream">Noell Front Desk</span>{" "}
            is the operations layer of the Noell system. If you need the full
            front-desk workflow, it layers on top of Noell Support.
          </p>
        </div>
      </section>

      {/* Relief, the step-by-step flow: how Noell responds */}
      <div id="how-noell-responds" className="scroll-mt-24" />
      {/* GTM item 8: Scripted demo transcript — shows a full polished conversation */}
      <section className="py-16 md:py-20 px-4 bg-cream-dark">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-strong mb-3">
              Sample conversation
            </p>
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-charcoal">
              A missed call, handled in{" "}
              <span className="italic text-lilac-dark">under 60 seconds.</span>
            </h2>
            <p className="mt-3 text-sm text-charcoal/60">
              This is a real example of how Noell Support responds to a missed call via SMS.
            </p>
          </div>
          <div className="bg-white rounded-[24px] border border-warm-border shadow-lg overflow-hidden">
            <div className="bg-gradient-to-br from-lilac via-lilac-dark to-[#6b4f80] px-5 py-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
                <span className="text-white text-xs font-serif font-semibold">N</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Noell Support</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-[10px] text-white/70">Responding in under 10 seconds</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-6 space-y-4">
              <div className="flex justify-start">
                <div className="max-w-[82%] bg-white border border-warm-border rounded-[17px] rounded-bl-md px-4 py-3 text-sm text-charcoal shadow-sm">
                  Hi, I noticed we just missed your call. I&apos;m Noell, the front desk assistant for Glow Medspa. Can I help you get booked or answer a quick question?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[82%] bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white rounded-[17px] rounded-br-md px-4 py-3 text-sm shadow-md">
                  Yes, I was calling about a HydraFacial. Do you have anything this week?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[82%] bg-white border border-warm-border rounded-[17px] rounded-bl-md px-4 py-3 text-sm text-charcoal shadow-sm">
                  We do. Can I grab your name so I can check availability for you?
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[82%] bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white rounded-[17px] rounded-br-md px-4 py-3 text-sm shadow-md">
                  Sarah
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[82%] bg-white border border-warm-border rounded-[17px] rounded-bl-md px-4 py-3 text-sm text-charcoal shadow-sm">
                  Hi Sarah. Here&apos;s a direct link to book your HydraFacial. Takes about 30 seconds: opsbynoell.com/book. Let me know if you need anything else.
                </div>
              </div>
              <div className="bg-lilac-light rounded-2xl p-3 border border-lilac-dark/20 text-center">
                <p className="text-[10px] uppercase tracking-widest text-lilac-dark font-medium">Lead captured · Booking link sent · 47 seconds elapsed</p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-charcoal/40 mt-4">Names changed. Timing is representative of live installs.</p>
        </div>
      </section>
      <Features3
        accent="lilac"
        eyebrow="What it feels like"
        headlineStart="You stop worrying"
        headlineAccent="about the phone."
        body="Noell Support runs in the background. You do the work in front of you. Leads still get caught."
        capabilities={[
          {
            icon: <IconBolt size={28} />,
            number: "01",
            title: "Never miss the first minute",
            description:
              "The moment someone reaches out, Noell Support is already talking to them. No more dead windows.",
            points: [
              "<10s response time",
              "Runs 24/7",
              "Missed-call and chat coverage",
            ],
          },
          {
            icon: <IconListCheck size={28} />,
            number: "02",
            title: "Qualified leads land on your phone",
            description:
              "Noell Support filters the noise and only hands you contacts who are actually ready to book or need you directly.",
            points: [
              "Service + urgency captured",
              "Contact info verified",
              "Full transcript included",
            ],
          },
          {
            icon: <IconUserCheck size={28} />,
            number: "03",
            title: "Nothing slips through",
            description:
              "Every lead is logged. Every handoff is recorded. Nothing gets lost between someone reaching out and you hearing about it.",
            points: [
              "Audit trail for every lead",
              "Routing rules per vertical",
              "Managed + monitored by us",
            ],
          },
        ]}
      />

      <FAQ
        accent="lilac"
        eyebrow={NOVA_FAQ_EYEBROW}
        headlineStart={NOVA_FAQ_HEADLINE_START}
        headlineAccent={NOVA_FAQ_HEADLINE_ACCENT}
        body={NOVA_FAQ_BODY}
        faqs={supportFaqs}
      />

      <CTA
        accent="lilac"
        eyebrow="Try Noell Support"
        headlineStart="See what it would catch"
        headlineAccent="on your site."
        body="Book a free audit and we'll show you exactly how Noell Support would handle your current missed calls and chats, with your copy, in your voice."
        primaryCta={{ label: "Book Your Free Audit", href: "/book" }}
        secondaryCta={{ label: "Back to home", href: "/" }}
        trustLine="Free audit · No contracts · Installed in 14 days"
      />
    </div>
  );
}
