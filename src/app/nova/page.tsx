import type { Metadata } from "next";
import {
  IconBolt,
  IconListCheck,
  IconAddressBook,
  IconRoute,
  IconLink,
  IconUserCheck,
} from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Features3 } from "@/components/features3";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nova Prospect — AI First-Response Assistant — Ops by Noell",
  description:
    "Nova Prospect handles first response, qualification, contact capture, routing, and booking-link handoff. Not a full AI front desk — the fastest first response you've ever had.",
};

const novaStats = [
  { value: "<10s", label: "First response", detail: "average text/chat reply" },
  { value: "94%", label: "Qualified", detail: "leads captured with contact" },
  { value: "0", label: "Dropped", detail: "leads in Nova-watched hours" },
  { value: "24/7", label: "On", detail: "even at 11pm on a Saturday" },
];

const novaCapabilities = [
  {
    icon: <IconBolt size={22} />,
    title: "First response",
    description:
      "When a call goes unanswered or a chat opens, Nova responds in under ten seconds with a warm, on-brand message.",
  },
  {
    icon: <IconListCheck size={22} />,
    title: "Qualification",
    description:
      "Nova asks the right questions — service type, timing, urgency — to understand what the prospect actually needs.",
  },
  {
    icon: <IconAddressBook size={22} />,
    title: "Contact capture",
    description:
      "Name, phone, email, service interest. Nova collects what you need and logs it straight into your system.",
  },
  {
    icon: <IconRoute size={22} />,
    title: "Routing",
    description:
      "Different service? Different location? Nova routes the conversation to the right person or workflow automatically.",
  },
  {
    icon: <IconLink size={22} />,
    title: "Booking-link handoff",
    description:
      "When the prospect is ready, Nova shares your scheduling link so they can book directly. No back-and-forth.",
  },
  {
    icon: <IconUserCheck size={22} />,
    title: "Human handoff",
    description:
      "Anything Nova can't resolve escalates to you immediately with full context. You pick up right where she left off.",
  },
];

const novaFaqs = [
  {
    question: "Is Nova a full AI receptionist?",
    answer:
      "No, and we're careful about that line. Nova Prospect is a first-response assistant. It handles the critical first minutes — responding, qualifying, capturing, routing, handing off. A full AI front desk is a separate product track.",
  },
  {
    question: "Where does Nova live?",
    answer:
      "Embedded on your website (the purple launcher bottom-right) and wired into your missed-call recovery flow. The same assistant handles chat and post-missed-call SMS replies.",
  },
  {
    question: "Can I customize what Nova says?",
    answer:
      "Yes. During install, we write the opening message, starter chips, qualification questions, and handoff copy in your voice. Updates are included in managed ops.",
  },
  {
    question: "What happens if Nova gets asked something unusual?",
    answer:
      "Nova escalates. Anything outside her scripted scope goes to you with full transcript + context. She never makes up answers. That's the entire point of honest positioning.",
  },
  {
    question: "How is this different from Nova Front Desk?",
    answer:
      "Nova Front Desk is a separate, deeper product track that handles calendar management, rescheduling, and more autonomous operation. It is not the same as Nova Prospect and we do not blur the two.",
  },
];

const novaScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-charcoal/70 font-medium">
          Nova · Online
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-charcoal/40">
        live
      </span>
    </div>

    {/* Nova greeting */}
    <div className="bg-white rounded-2xl rounded-bl-md p-3 mx-1 border border-warm-border/60 shadow-sm text-[11px] text-charcoal leading-snug">
      Hi — I'm Nova. Looking to book or ask a question?
    </div>

    {/* Visitor reply */}
    <div className="flex justify-end mt-2 mx-1">
      <div className="bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white rounded-2xl rounded-br-md p-3 text-[11px] leading-snug max-w-[75%] shadow-sm">
        I keep missing calls during appointments.
      </div>
    </div>

    {/* Nova qualification */}
    <div className="bg-white rounded-2xl rounded-bl-md p-3 mx-1 mt-2 border border-warm-border/60 shadow-sm text-[11px] text-charcoal leading-snug">
      That's exactly what we solve. Can I grab your name and best number? I'll
      route this to Noell.
    </div>

    {/* Handoff indicator */}
    <div className="bg-lilac-light rounded-2xl p-2 mx-1 mt-2 border border-lilac-dark/20 text-center">
      <p className="text-[9px] uppercase tracking-widest text-lilac-dark font-medium">
        Human handoff · routed
      </p>
    </div>
  </div>
);

export default function NovaPage() {
  return (
    <div>
      <Hero
        variant="lilac"
        eyebrow="Nova Prospect · First-response assistant"
        headlineLine1Start="Your first"
        headlineLine1Accent="response."
        headlineLine2Start="Not your"
        headlineLine2Accent="whole front desk."
        body="Nova Prospect catches the leads you can't get to. Responds instantly, qualifies the prospect, captures their info, routes them, and hands them off to you or your booking link."
        footnote="Not Nova Front Desk. Not an autonomous receptionist. The fastest first response you've ever had."
        primaryCta={{ label: "Get Nova on your site", href: "/book" }}
        secondaryCta={{ label: "Try the demo chat", href: "#capabilities" }}
        mockScreen={novaScreen}
      />

      {/* Nova stats */}
      <Features
        eyebrow="What Nova catches"
        headlineStart="Every lead gets"
        headlineAccent="a response."
        body="The numbers we watch on a live Nova install."
        stats={novaStats}
        accent="lilac"
      />

      {/* 6 capabilities */}
      <section id="capabilities" className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-lilac-dark mb-4">
              What Nova does
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
              Six things,{" "}
              <span className="italic bg-gradient-to-b from-lilac-dark to-lilac bg-clip-text text-transparent">
                done well.
              </span>
            </h2>
            <p className="mt-5 text-charcoal/60 max-w-xl mx-auto">
              Nova Prospect is not trying to be everything. It handles the
              critical first minutes of every lead — the window where most
              revenue is lost.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {novaCapabilities.map((cap, i) => (
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
                  <span className="text-[10px] font-mono text-charcoal/30">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-charcoal mb-1.5">
                  {cap.title}
                </h3>
                <p className="text-sm text-charcoal/60 leading-relaxed">
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
            First response,{" "}
            <span className="italic text-lilac">not full front desk.</span>
          </h2>
          <p className="mt-5 text-cream/50 max-w-xl mx-auto">
            Nova Prospect handles the first minutes. A complete AI front desk
            is a separate product track — and we'll tell you when it's ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Does */}
          <div className="rounded-[17px] border border-lilac-dark/30 bg-lilac-dark/10 p-6 md:p-7">
            <p className="text-[10px] uppercase tracking-[0.2em] text-lilac mb-4 font-semibold">
              Nova Prospect does
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
            <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-4 font-semibold">
              Nova Prospect does not
            </p>
            <ul className="space-y-3">
              {[
                "Manage your calendar",
                "Reschedule appointments",
                "Process payments",
                "Replace your staff",
                "Run fully autonomously",
                "Pretend to be Nova Front Desk",
              ].map((item) => (
                <li
                  key={item}
                  className="text-sm text-cream/50 flex items-center gap-2.5"
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
            <span className="font-semibold text-cream">Nova Front Desk</span> is
            a separate product track, not a marketing rebrand. If you need full
            front-desk automation, we'll tell you when it's live.
          </p>
        </div>
      </section>

      {/* Relief — what life looks like with Nova */}
      <Features3
        accent="lilac"
        eyebrow="What it feels like"
        headlineStart="You stop worrying"
        headlineAccent="about the phone."
        body="Nova runs in the background. You do the work in front of you. Leads still get caught."
        capabilities={[
          {
            icon: <IconBolt size={28} />,
            number: "01",
            title: "Never miss the first minute",
            description:
              "The moment someone reaches out, Nova is already talking to them. No more dead windows.",
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
              "Nova filters the noise and only hands you contacts who are actually ready to book or need you directly.",
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
        eyebrow="Nova questions"
        headlineStart="Honest"
        headlineAccent="answers about Nova."
        body="What people ask before they install a first-response assistant."
        faqs={novaFaqs}
      />

      <CTA
        accent="lilac"
        eyebrow="Try Nova"
        headlineStart="See what Nova would catch"
        headlineAccent="on your site."
        body="Book a free audit and we'll show you exactly how Nova would handle your current missed calls and chats — with your copy, in your voice."
        primaryCta={{ label: "Book Your Free Audit", href: "/book" }}
        secondaryCta={{ label: "Back to home", href: "/" }}
        trustLine="Free audit · No contracts · Installed in 14 days"
      />
    </div>
  );
}
