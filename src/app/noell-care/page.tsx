import {
  IconUser,
  IconRefresh,
  IconMap,
  IconCalendarEvent,
  IconCalendarRepeat,
  IconHelpCircle,
  IconShieldCheck,
} from "@tabler/icons-react";
import { AdHero } from "@/components/ad-hero";
import { Features3 } from "@/components/features3";
import { FAQ } from "@/components/faq";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { breadcrumbSchema, servicePageSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  path: "/noell-care",
  title: "Noell Care, AI Client Reactivation",
  description:
    "Noell Care wins back lapsed clients and runs the returning-client desk. Reactivation campaigns, rebooking, service questions, and account support, all on your voice.",
});

const careCapabilities = [
  {
    icon: <IconRefresh size={22} />,
    title: "Reactivation (System tier and up)",
    description:
      "Care reaches lapsed clients by SMS and email on a cadence built around your service intervals. Win-back sequences in your voice, paused the moment they reply or rebook.",
  },
  {
    icon: <IconCalendarEvent size={22} />,
    title: "Rebooking",
    description:
      "Returning clients land in Care, get recognized by phone or email, and can rebook their usual in one reply.",
  },
  {
    icon: <IconCalendarRepeat size={22} />,
    title: "Appointment changes",
    description:
      "Move a Tuesday to a Wednesday without a phone call. Care captures it and hands off to Front Desk for the calendar action.",
  },
  {
    icon: <IconHelpCircle size={22} />,
    title: "Service questions",
    description:
      "'Do you offer deep tissue?' 'How long is a facial?' Answered from your knowledge base, in your voice, not from the internet.",
  },
  {
    icon: <IconMap size={22} />,
    title: "Location & logistics",
    description:
      "'Where do I park?' 'What door do I use?' Answered with your real location notes, not a generic 'see our website'.",
  },
  {
    icon: <IconShieldCheck size={22} />,
    title: "Account support",
    description:
      "Cancellation policy, insurance, receipts, late-arrival rules. Quoted verbatim from your configured policy library.",
  },
  {
    icon: <IconUser size={22} />,
    title: "Owner escalation",
    description:
      "Anything Care cannot answer escalates to you immediately, with the full transcript and the contact's history attached.",
  },
];

const careFaqs = [
  {
    question: "How is Noell Care different from Noell Support?",
    answer:
      "Support is for strangers: the new prospect reaching your site for the first time. Care is for people who already come here. The tone is 'welcome back,' not 'how can we help you.' Care recognizes the client if they're in your file, pulls their history, and answers from your knowledge base.",
  },
  {
    question: "What's in Noell Care's knowledge base?",
    answer:
      "Your services (names, descriptions, durations, prices if you want), your FAQ, your location notes, your policies, and your team roster. We populate it during onboarding from an interview. You never touch a settings screen.",
  },
  {
    question: "Does Noell Care book appointments?",
    answer:
      "Care captures the intent conversationally and hands off to Noell Front Desk's scheduling path, which pushes the booking to whatever calendar or practice management system you already use. One system, two roles, Care handles the conversation, Front Desk handles the calendar.",
  },
  {
    question: "What happens if Care cannot answer something?",
    answer:
      "It says so and escalates to you, with context. Care never invents policies, never guesses prices, and never interprets medical, clinical, or insurance questions on its own.",
  },
];

const careScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-cream/70 font-medium">
          Noell Care · Recognized
        </span>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-cream/70">
        regular
      </span>
    </div>

    <div className="bg-[#271520] rounded-2xl rounded-bl-md p-3 mx-1 border border-white/10/60 shadow-sm text-[11px] text-cream leading-snug">
      Hey Sarah, good to hear from you. How was your deep tissue on Saturday?
    </div>

    <div className="flex justify-end mt-2 mx-1">
      <div className="bg-gradient-to-b from-[#7a9c79] to-[#4f6b4e] text-white rounded-2xl rounded-br-md p-3 text-[11px] leading-snug max-w-[75%] shadow-sm">
        Great, thanks! Can I rebook for next Saturday same time?
      </div>
    </div>

    <div className="bg-[#271520] rounded-2xl rounded-bl-md p-3 mx-1 mt-2 border border-white/10/60 shadow-sm text-[11px] text-cream leading-snug">
      Got it, Saturday at 2 with Maya, deep tissue 60. I&apos;ll lock it in.
    </div>

    <div className="bg-[#301A26] rounded-2xl p-2 mx-1 mt-2 border border-white/10/60 text-center">
      <p className="text-[9px] uppercase tracking-widest text-cream/70 font-medium">
        Handed to Front Desk · booked
      </p>
    </div>
  </div>
);

export default function NoellCarePage() {
  return (
    <div>
      <JsonLd
        data={[
          servicePageSchema({
            name: "Noell Care: AI Reactivation and Returning-Client Desk",
            description:
              "Reactivation layer of the Noell system: wins back lapsed clients via SMS and email, runs the returning-client desk for rebooking, service questions, and account support.",
            path: "/noell-care",
            serviceType: "AI client reactivation and returning-client support",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Noell Care", path: "/noell-care" },
          ]),
        ]}
        id="noell-care"
      />
      <AdHero
        page="care"
        variant="sage"
        defaultEyebrow="Noell Care · Reactivation + returning-client desk"
        defaultHeadlineLine1Start="The agent that"
        defaultHeadlineLine1Accent="wins them back."
        defaultHeadlineLine2Start="And handles them"
        defaultHeadlineLine2Accent="when they return."
        defaultBody="Reactivation on cadence, returning-client recognition on reply. The warm third layer of the Noell system."
        primaryCta={{ label: "Get Your Free Revenue Signal Report", href: "/book" }}
        secondaryCta={{ label: "See the capabilities", href: "#capabilities" }}
        mockScreen={careScreen}
        sourcePage="noell_care"
        footnote="Built for service businesses that cannot afford to lose a returning client. Reactivation campaigns ship with System tier and up."
      />

      <section id="capabilities" className="py-20 md:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 max-w-3xl mx-auto">
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#4f6b4e] mb-4">
              What Noell Care runs
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              Reactivation first.{" "}
              <span className="italic bg-gradient-to-b from-[#4f6b4e] to-[#7a9c79] bg-clip-text text-transparent">
                Returning-client desk on top.
              </span>
            </h2>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {careCapabilities.map((cap, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[17px] border border-white/10 bg-[#271520] p-6",
                  "shadow-[0px_15px_15px_0px_rgba(28,25,23,0.04),0px_4px_8px_0px_rgba(28,25,23,0.04)]"
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[#7a9c79]/10 text-[#4f6b4e] flex items-center justify-center">
                    {cap.icon}
                  </div>
                  <span className="text-[10px] font-mono text-cream/70">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-cream mb-1.5">
                  {cap.title}
                </h3>
                <p className="text-sm text-cream/70 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Features3
        eyebrow="How it fits"
        headlineStart="The third agent of"
        headlineAccent="the Noell system."
        body="Care never pretends to be scheduling or operations. It hands off cleanly."
        capabilities={[
          {
            icon: <IconUser size={28} />,
            number: "01",
            title: "Recognize first",
            description:
              "On every inbound message Care looks up the sender in your client contacts and opens with their name if it's a match.",
            points: ["Phone + email lookup", "Visit history surfaced", "VIP flag honored"],
          },
          {
            icon: <IconHelpCircle size={28} />,
            number: "02",
            title: "Answer from the knowledge base",
            description:
              "Services, policies, location, team. Care answers from your real config, never from general internet knowledge.",
            points: ["Category-scoped lookup", "Escalates on low-confidence matches", "Never fabricates policy"],
          },
          {
            icon: <IconRefresh size={28} />,
            number: "03",
            title: "Hand off scheduling to Front Desk",
            description:
              "Care captures the rebooking intent, Front Desk executes it against your calendar. One system, clean roles.",
            points: [
              "Intent captured conversationally",
              "Handoff is a function call, not a new thread",
              "Visitor sees one conversation",
            ],
          },
        ]}
      />


      <FAQ
        eyebrow="Care questions"
        headlineStart="Warm"
        headlineAccent="answers."
        body="Common questions about the reactivation and returning-client layer."
        faqs={careFaqs}
      />

      <CTA
        eyebrow="The first step"
        headlineStart="See what your regulars"
        headlineAccent="are asking for."
        body="Book a free audit. We'll review your inbound and show you how Care would handle it, in your voice, from your knowledge base."
        trustLine="Free 30-minute audit · No contracts required · Live in 14 days"
        sourcePage="noell_care"
      />
    </div>
  );
}
