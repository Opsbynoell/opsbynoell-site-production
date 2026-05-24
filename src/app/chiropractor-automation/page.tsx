import Link from "next/link";
import {
  IconPhoneCall,
  IconCalendarX,
  IconStethoscope,
  IconRefresh,
  IconClock,
  IconCircleCheck,
  IconUsers,
  IconBolt,
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
  path: "/chiropractor-automation",
  title: "AI Front Desk for Chiropractic Offices, Ops by Noell",
  description:
    "Done-for-you AI front desk for chiropractic practices. Catch missed new-patient calls, reduce no-shows, reactivate lapsed patients, and run automated reviews.",
});

const chiropractorStats = [
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
  {
    value: "14d",
    label: "Live",
    detail: "installed around your existing EHR",
  },
];

type ChiroConcern = {
  icon: React.ReactNode;
  tag: string;
  title: string;
  worry: string;
  answer: string;
};

const chiroConcerns: ChiroConcern[] = [
  {
    icon: <IconPhoneCall size={22} />,
    tag: "New patient calls",
    title: "New patients call once. If you miss them, they book down the street.",
    worry:
      "Your front desk is triaging insurance, handling check-ins, and answering existing patient questions. A new patient calls, gets voicemail, and books with the chiropractic office that answered. That missed call is a patient relationship that never starts.",
    answer:
      "Noell Front Desk sends an on-brand text in under 60 seconds: two available openings, a warm note, and a direct booking link. Most new patients self-book before your front desk can call back.",
  },
  {
    icon: <IconCalendarX size={22} />,
    tag: "No-shows and cancellations",
    title: "A no-show at 9am costs you a 45-minute slot, not just one appointment.",
    worry:
      "Chiropractic care plans depend on visit cadence. When patients cancel or no-show, they break their own recovery timeline, and your revenue timeline. Manual reminder calls are time-consuming and inconsistent.",
    answer:
      "Automated appointment reminders go out 48 hours and 2 hours before every visit. Patients who do not confirm get a gentle follow-up. No-show rates drop, care plan completion rates rise.",
  },
  {
    icon: <IconRefresh size={22} />,
    tag: "Lapsed patient reactivation",
    title: "Patients who finished a care plan rarely come back on their own.",
    worry:
      "Maintenance care and new injury visits are sitting in your database as silent revenue opportunities. Most practices let them lapse because manual reactivation campaigns are too time-intensive to run consistently.",
    answer:
      "Reactivation runs automatically. Patients who have not visited in 60 or 90 days get a warm, personalized check-in via SMS or email, in your practice voice, at the cadence you set.",
  },
];

const chiroCapabilities = [
  {
    icon: <IconPhoneCall size={20} />,
    number: "01",
    title: "Missed-call recovery",
    description: "Every missed call gets an on-brand text in under 60 seconds with available slots and a booking link. New patient calls don't fall through.",
    points: ["On-brand text in <60 seconds", "Two available slots included", "Direct booking link"],
  },
  {
    icon: <IconClock size={20} />,
    number: "02",
    title: "Appointment reminders",
    description: "Automated 48-hour and 2-hour reminders via SMS. Patients who don't confirm get a gentle follow-up. No-show rates drop without manual effort.",
    points: ["48-hour and 2-hour reminder cadence", "Soft confirmation required", "No manual follow-up needed"],
  },
  {
    icon: <IconRefresh size={20} />,
    number: "03",
    title: "Lapsed patient reactivation",
    description: "Patients who haven't visited in 60–90 days receive personalized outreach. Maintenance care and re-injury visits fill your schedule without ad spend.",
    points: ["60 and 90 day reactivation windows", "Personalized in your practice voice", "Runs automatically"],
  },
  {
    icon: <IconCircleCheck size={20} />,
    number: "04",
    title: "Google review generation",
    description: "After each visit, a review request goes out at the right moment. Practices on our system average 40+ new reviews in the first 8 weeks.",
    points: ["Post-visit timing optimization", "Direct Google Business Profile link", "40+ reviews avg in 8 weeks"],
  },
  {
    icon: <IconUsers size={20} />,
    number: "05",
    title: "New patient intake",
    description: "Noell Support qualifies new patient inquiries 24/7 via website chat, capturing contact info, insurance, and chief complaint before the first call.",
    points: ["24/7 website chat qualification", "Insurance and chief complaint captured", "Booking handoff included"],
  },
  {
    icon: <IconStethoscope size={20} />,
    number: "06",
    title: "EHR-compatible",
    description: "Layers on top of the chiropractic EHR or practice management system you already use. No migration, no rip-and-replace.",
    points: ["No EHR migration required", "Works alongside your billing system", "14-day install"],
  },
];

const chiroFaqs = [
  {
    id: "chiro-works-with-ehr",
    question: "Does this work with my current EHR or practice management software?",
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
      "14 days from audit to activation. We handle the setup, integration, and testing. Your team learns one thing: how to review the dashboard. Everything else runs automatically.",
  },
  {
    id: "chiro-front-desk-staff",
    question: "Do I need to change my front desk staffing?",
    answer:
      "No. The AI front desk is additive, not a replacement. It handles the calls, texts, and follow-ups that currently fall through, after hours, during high-volume windows, and on weekends, so your staff can focus on the patients in the building.",
  },
  {
    id: "chiro-new-patients",
    question: "Will this actually help us get more new patients?",
    answer:
      "Yes, primarily by stopping the leaks. The biggest driver of new patient loss in chiropractic is the missed call. Our system catches those calls and responds in under 60 seconds. Most practices see measurable new patient conversion improvement in the first 30 days.",
  },
  {
    id: "chiro-review-generation",
    question: "How does review generation work for a chiropractic office?",
    answer:
      "After each appointment, a review request goes out via SMS at the moment patients are most satisfied, typically right after a session. The message links directly to your Google Business Profile. No follow-up needed from your team.",
  },
];

export default function ChiropractorAutomationPage() {
  return (
    <div>
      <JsonLd
        data={[
          servicePageSchema({
            name: "AI front desk for chiropractic offices",
            description:
              "Done-for-you AI front desk for chiropractic practices. Missed-call recovery, appointment reminders, lapsed patient reactivation, and review generation, installed around your existing EHR.",
            path: "/chiropractor-automation",
            vertical: "chiropractic practices",
          }),
          localBusinessSchema("chiropractic practices"),
          faqPageSchema(chiroFaqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Chiropractor Automation", path: "/chiropractor-automation" },
          ]),
        ]}
        id="vertical-chiro"
      />
      <Hero
        eyebrow="Ops by Noell for Chiropractic Offices"
        headlineLine1Start="New patients call"
        headlineLine1Accent="once."
        headlineLine2Start="Your system should"
        headlineLine2Accent="answer every time."
        body="A done-for-you AI front desk for chiropractic practices. Missed new-patient calls recovered in under 60 seconds, automated reminders that cut no-shows, and quiet reactivation that brings lapsed patients back, without adding staff."
        footnote="Works with most chiropractic EHR and practice management systems. Tell us what you run on your intro call and we will confirm fit."
        primaryCta={{ label: "Book a Free Chiropractic Audit", href: "/book" }}
        secondaryCta={{
          label: "See how it handles new patient calls",
          href: "#chiro-concerns",
        }}
      />

      <VerticalAgentsCallout />

      <Features
        eyebrow="What practices see"
        headlineStart="Fewer missed calls."
        headlineAccent="More filled slots."
        body="Numbers from practices running the Ops by Noell front desk."
        stats={chiropractorStats}
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
        headlineStart="Six things your front desk"
        headlineAccent="handles automatically."
        body="Not a feature checklist. The six plays that run in the background while you adjust."
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
