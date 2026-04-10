import { Section } from "@/components/section";
import { Headline } from "@/components/headline";
import { Overline } from "@/components/overline";
import { NovaChatDemo } from "@/components/nova-chat-demo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nova — Ops by Noell",
  description:
    "Meet Nova — your always-on AI operations assistant that answers inquiries, books appointments, and handles follow-up 24/7.",
};

const capabilities = [
  {
    status: "Responding",
    title: "Answers inquiries instantly",
    description:
      "Nova responds to texts, emails, and web inquiries within seconds — in your brand voice. Leads never wait.",
  },
  {
    status: "Booking",
    title: "Books appointments 24/7",
    description:
      "After hours, weekends, holidays. Nova qualifies leads and books them directly into your calendar.",
  },
  {
    status: "Qualifying",
    title: "Qualifies before it connects",
    description:
      "Nova asks the right questions, filters out tire-kickers, and only sends qualified leads to your team.",
  },
  {
    status: "Learning",
    title: "Learns your business",
    description:
      "Trained on your services, pricing, and policies. Nova sounds like your best team member — because it knows what they know.",
  },
];

export default function NovaPage() {
  return (
    <>
      {/* Hero — purple world */}
      <Section variant="nova" className="pt-32 md:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-sm text-cream/70">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>AI-Powered Assistant — Online</span>
            </div>
            <h1 className="font-serif uppercase text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] tracking-tight text-cream">
              Meet Nova.
            </h1>
            <p className="font-serif italic text-2xl text-cream/50">
              Your always-on operations assistant.
            </p>
            <p className="text-lg text-cream/40 leading-relaxed max-w-md">
              Nova answers inquiries, qualifies leads, books appointments,
              and handles follow-up — 24/7, in your brand voice. Like hiring
              the best front desk person who never sleeps, never forgets, and
              never puts a caller on hold.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/book"
                className="inline-flex items-center justify-center bg-cream text-nova-purple text-sm tracking-wide px-8 py-4 rounded-full hover:bg-white transition-colors"
              >
                Get Nova for Your Business
              </Link>
            </div>
          </div>

          {/* Chat demo — browser-window framed */}
          <NovaChatDemo />
        </div>
      </Section>

      {/* Capabilities — interface-panel framing */}
      <Section variant="cream">
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <Overline className="text-nova-purple">What Nova Does</Overline>
            <Headline as="h2" size="section" className="mt-4">
              Everything your front desk does — without the overhead
            </Headline>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="bg-white border border-charcoal/5 rounded-xl overflow-hidden"
              >
                {/* Status bar */}
                <div className="flex items-center gap-2 px-5 py-2.5 bg-charcoal/[0.02] border-b border-charcoal/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-nova-purple" />
                  <span className="font-mono text-[10px] tracking-wider uppercase text-nova-purple/60">
                    {cap.status}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-serif text-lg text-charcoal">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-charcoal/50 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section variant="blush">
        <div className="max-w-3xl mx-auto space-y-16">
          <div className="text-center">
            <Headline as="h2" size="section">
              How Nova works
            </Headline>
          </div>

          <div className="space-y-8">
            {[
              {
                step: "01",
                title: "We train Nova on your business",
                description:
                  "Your services, pricing, policies, and voice. Nova learns how you talk to clients — and mirrors it.",
              },
              {
                step: "02",
                title: "Nova goes live on your channels",
                description:
                  "Website chat, SMS, email, social DMs. Nova handles first contact, qualification, and booking on every channel.",
              },
              {
                step: "03",
                title: "Your team handles what matters",
                description:
                  "Nova routes qualified leads to your calendar and alerts your team when a human touch is needed. No busywork. Just the conversations that count.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-cream/80 border border-charcoal/5 rounded-xl p-6 md:p-8"
                style={{
                  transform: `rotate(${item.step === "02" ? 0.5 : item.step === "03" ? -0.3 : 0}deg)`,
                }}
              >
                <div className="grid grid-cols-[50px_1fr] gap-5 items-start">
                  <span className="font-mono text-2xl text-nova-purple/40">
                    {item.step}
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-charcoal">
                      {item.title}
                    </h3>
                    <p className="text-charcoal/55 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="nova" className="text-center">
        <p className="font-serif uppercase text-[clamp(2rem,4vw,3.5rem)] leading-[0.95] tracking-tight text-cream max-w-2xl mx-auto">
          Ready to stop losing leads after hours?
        </p>
        <p className="mt-6 text-cream/40 leading-relaxed max-w-lg mx-auto">
          Nova can be live on your channels in 14 days. Let&apos;s talk about
          what it would look like for your business.
        </p>
        <div className="mt-10">
          <Link
            href="/book"
            className="inline-flex items-center justify-center bg-cream text-nova-purple text-sm tracking-wide px-10 py-4 rounded-full hover:bg-white transition-colors"
          >
            Book Your Free Audit
          </Link>
        </div>
      </Section>
    </>
  );
}
