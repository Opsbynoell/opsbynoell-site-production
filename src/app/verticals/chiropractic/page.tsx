import Link from "next/link";
import {
  IconPhoneCall,
  IconCalendarX,
  IconRefresh,
  IconClock,
} from "@tabler/icons-react";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Features3 } from "@/components/features3";
import { VerticalCaseStudyPlaceholder } from "@/components/vertical-case-study";
import {
  breadcrumbSchema,
  faqPageSchema,
  localBusinessSchema,
  servicePageSchema,
} from "@/lib/schema";
import { FAQ } from "@/components/faq";
import { VerticalPricingSection } from "@/components/pricing";
import { VerticalAgentsCallout } from "@/components/vertical-agents-callout";
import { PredictiveIntelligenceVerticalExample } from "@/components/predictive-intelligence";
import CTA from "@/components/cta";
import { cn } from "@/lib/utils";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/verticals/chiropractic",
  title: "AI Front Desk for Chiropractic Offices",
  description:
    "Done-for-you AI front desk for chiropractic practices. Catch missed new-patient calls in under 60 seconds, cut no-shows, reactivate lapsed patients, all without adding staff.",
});

const chiroStats = [
  {
    value: "<60s",
    label: "New patient",
    detail: "callback time on missed calls",
  },
  {
    value: "75%",
    label: "No-shows",
    detail: "reduction with automated reminders",
  },
  {
    value: "24/7",
    label: "Coverage",
    detail: "new patient intake, after hours included",
  },
];

type Concern = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  worry: string;
  answer: string;
};

const chiroConcerns: Concern[] = [
  {
    icon: <IconPhoneCall size={22} />,
    tag: "New patient calls",
    title:
      "New patients call once. If you miss them, they book down the street.",
    worry:
      "A new patient calls, gets voicemail, and books with the office that answered. That missed call is a patient relationship that never starts.",
    answer:
      "Noell Front Desk sends an on-brand text in under sixty seconds: two available openings, a warm note, and a direct booking link. Most new patients self-book before your front desk can call back.",
  },
  {
    icon: <IconCalendarX size={22} />,
    tag: "No-shows and cancellations",
    title:
      "A no-show at 9am costs you a 45-minute slot, not just one appointment.",
    worry:
      "Chiropractic care plans depend on visit cadence. When patients cancel or no-show, they break their own recovery timeline, and your revenue timeline. Manual reminder calls are time-consuming and inconsistent.",
    answer:
      "Automated reminders go out forty-eight hours and two hours before every visit. Patients who do not confirm get a gentle follow-up. No-show rates drop, care-plan completion rises.",
  },
  {
    icon: <IconRefresh size={22} />,
    tag: "Lapsed patient reactivation",
    title:
      "Patients who finished a care plan rarely come back on their own.",
    worry:
      "Maintenance care and new-injury visits sit in your database as silent revenue opportunities. Most practices let them lapse because manual reactivation campaigns are too time-intensive to run consistently.",
    answer:
      "Reactivation runs automatically. Patients who have not visited in sixty or ninety days get a warm, personalized check-in by SMS or email, in your practice voice, at the cadence you set.",
  },
];

const chiroCapabilities = [
  {
    icon: <IconPhoneCall size={28} />,
    number: "01",
    title: "Missed-call recovery",
    description:
      "Every missed call gets an on-brand text in under sixty seconds with available slots and a direct booking link. New-patient calls do not fall through.",
    points: [
      "Under 60 second SMS reply",
      "Two available slots included",
      "Direct booking link in the message",
    ],
  },
  {
    icon: <IconClock size={28} />,
    number: "02",
    title: "Reminder cadence that holds the calendar",
    description:
      "Forty-eight-hour and two-hour reminders by SMS. Patients who do not confirm get a soft follow-up. No-show rates drop without manual effort.",
    points: [
      "Two-step reminder cadence",
      "Soft confirmation required",
      "No manual follow-up needed",
    ],
  },
  {
    icon: <IconRefresh size={28} />,
    number: "03",
    title: "Lapsed-patient reactivation",
    description:
      "Patients who have not visited in 60 to 90 days receive personalized outreach in your practice voice. Maintenance care and re-injury visits fill the schedule without ad spend.",
    points: [
      "Sixty and ninety day reactivation windows",
      "Personalized in your practice voice",
      "Runs automatically",
    ],
  },
];

const chiroFaqs = [
  {
    id: "chiro-works-with-ehr",
    question:
      "Does this work with my current EHR or practice management software?",
    answer:
      "Yes. We install the AI front desk around your existing chiropractic EHR or practice management system. Your patient records, billing, and clinical workflows stay exactly where they are. We handle the front desk layer.",
  },
  {
    id: "chiro-hipaa",
    question: "Is this HIPAA-compliant?",
    answer:
      "Yes. All communication flows are designed to comply with HIPAA requirements. We do not store PHI in marketing systems. The audit-to-install process includes a review of your specific compliance requirements.",
  },
  {
    id: "chiro-how-long",
    question: "How long does it take to go live?",
    answer:
      "Fourteen days from audit to activation. We handle the setup, integration, and testing. Your team learns one thing: how to review the dashboard. Everything else runs automatically.",
  },
  {
    id: "chiro-front-desk-staff",
    question: "Do I need to change my front desk staffing?",
    answer:
      "No. The AI front desk is additive, not a replacement. It handles the calls, texts, and follow-ups that currently fall through, after hours, during high-volume windows, and on weekends, so your staff can focus on the patients in the building.",
  },
];

const chiroScreen = (
  <div className="flex w-full flex-col items-stretch px-3">
    <div className="flex justify-between items-center w-full px-2 pb-2">
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-xs text-cream/70 font-medium">
          Noell Front Desk, Chiropractic
        </span>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-cream/70">
        missed call
      </span>
    </div>

    <div className="bg-[#271520] rounded-2xl p-3 mx-1 border border-white/10/60 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-wine/85 font-medium">
            New patient, low back
          </p>
          <p className="text-sm text-cream font-medium mt-0.5">Marcus T.</p>
          <p className="text-[11px] text-cream/70">Replied in 47s</p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2A1520] text-wine">
          warm
        </span>
      </div>
      <div className="mt-2 bg-[#301A26] rounded-lg p-2 text-[11px] text-cream/80 leading-snug">
        Hi Marcus, sorry we missed you. We have new-patient openings
        Tuesday 3:15 or Wednesday 10:00 with Dr. Patel. Want me to lock one
        in?
      </div>
    </div>

    <div className="bg-wine rounded-2xl p-3 mx-1 mt-2 shadow-sm">
      <p className="text-[10px] uppercase tracking-widest text-cream/70 font-medium">
        New-patient consult booked
      </p>
      <p className="font-serif text-2xl font-bold text-cream mt-0.5">
        Tue · 3:15 PM
      </p>
      <p className="text-[11px] text-cream/60">
        Initial exam, 45 min · Dr. Patel
      </p>
    </div>
  </div>
);

export default function ChiropracticVerticalPage() {
  return (
    <div>
      <JsonLd
        data={[
          servicePageSchema({
            name: "AI front desk for chiropractic offices",
            description:
              "Done-for-you AI front desk for chiropractic practices. Missed-call recovery, appointment reminders, lapsed-patient reactivation, installed around your existing EHR.",
            path: "/verticals/chiropractic",
            vertical: "chiropractic practices",
          }),
          localBusinessSchema("chiropractic practices"),
          faqPageSchema(chiroFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Verticals", path: "/verticals" },
            { name: "Chiropractic", path: "/verticals/chiropractic" },
          ]),
        ]}
        id="vertical-chiropractic"
      />
      <Hero
        eyebrow="Ops by Noell for Chiropractic Offices"
        headlineLine1Start="New patients call"
        headlineLine1Accent="once."
        headlineLine2Start="Your system should"
        headlineLine2Accent="answer every time."
        body="A done-for-you AI front desk for chiropractic practices. Missed new-patient calls recovered in under sixty seconds, automated reminders that cut no-shows, and quiet reactivation that brings lapsed patients back, without adding staff."
        footnote="Works with most chiropractic EHR and practice management systems. Tell us what you run on your intro call and we will confirm fit."
        primaryCta={{ label: "Book a Free Chiropractic Audit", href: "/book" }}
        secondaryCta={{
          label: "See how it handles new patient calls",
          href: "#chiro-concerns",
        }}
        sourcePage="verticals_chiro"
        mockScreen={chiroScreen}
      />

      <VerticalAgentsCallout />

      <Features
        eyebrow="What practices see"
        headlineStart="Fewer missed calls."
        headlineAccent="More filled slots."
        body="Numbers from practices running the Ops by Noell front desk."
        stats={chiroStats}
      />

      <section id="chiro-concerns" className="w-full py-20 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
                chiropractic front desk problems / solved
              </p>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
              Three things that cost chiropractic practices revenue{" "}
              <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
                every week.
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {chiroConcerns.map((c, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-[22px] border border-white/10 bg-[#271520] p-7",
                  "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]"
                )}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-wine/10 text-wine flex items-center justify-center">
                    {c.icon}
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/70">
                    {c.tag}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-cream mb-3 leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm text-cream/70 leading-relaxed mb-4 border-l-2 border-white/10 pl-4 italic">
                  {c.worry}
                </p>
                <p className="text-sm text-cream/80 leading-relaxed">
                  {c.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <VerticalCaseStudyPlaceholder vertical="chiropractic" />

      <Features3
        eyebrow="What changes"
        headlineStart="Three moves"
        headlineAccent="your front desk handles automatically."
        body="Not a feature list. The three plays that run in the background while you adjust."
        capabilities={chiroCapabilities}
      />

      <PredictiveIntelligenceVerticalExample vertical="chiropractic" />

      <VerticalPricingSection
        vertical="chiropractic"
        auditPhrase="chiropractic audit"
        sourcePage="verticals_chiro"
      />

      <FAQ
        eyebrow="Chiropractic questions"
        headlineStart="Straight answers"
        headlineAccent="before you commit."
        body="The questions chiropractic offices ask us before signing. No sales theater."
        faqs={chiroFaqs}
      />

      <section className="w-full px-4 my-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-cream/70 mb-3">
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
        eyebrow="For chiropractic offices"
        headlineStart="Get a free audit"
        headlineAccent="of your call flow."
        body="A 30-minute review of your missed-call recovery, reminder cadence, and reactivation gaps. You walk away with a clear map of what is leaking, whether you work with us or not."
        primaryCta={{
          label: "Book Your Free Chiropractic Audit",
          href: "/book",
        }}
        secondaryCta={{
          label: "Talk to Noell Support first",
          href: "/noell-support",
        }}
        trustLine="Free 30-minute audit · Live in 14 days · HIPAA-compliant"
        sourcePage="verticals_chiro"
      />
    </div>
  );
}
