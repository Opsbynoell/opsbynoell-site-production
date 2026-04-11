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
      "Nova responds to texts, emails, and web inquiries within seconds — in your brand voice.",
    example: '"Hi! Thanks for reaching out. We have openings this week for Botox — would you like to book a consultation?"',
  },
  {
    status: "Booking",
    title: "Books appointments 24/7",
    description:
      "After hours, weekends, holidays. Nova qualifies leads and books them directly into your calendar.",
    example: '"I have Tuesday at 2:00 PM or Thursday at 4:00 PM available. Which works better for you?"',
  },
  {
    status: "Qualifying",
    title: "Qualifies before it connects",
    description:
      "Nova asks the right questions, filters out tire-kickers, and only sends qualified leads to your team.",
    example: '"Great question! To give you the best recommendation, can I ask what area you\'re looking to treat?"',
  },
  {
    status: "Learning",
    title: "Learns your business",
    description:
      "Trained on your services, pricing, and policies. Nova sounds like your best team member.",
    example: '"Our Hydrafacial starts at $189 and includes a 60-minute session with extraction and LED therapy."',
  },
];

export default function NovaPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="nova" className="pt-32 md:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="space-y-8">
            {/* Status strip */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/12">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-[11px] text-cream/50">
                Active — responding to 3 inquiries now
              </span>
            </div>

            <h1 className="font-serif uppercase text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] tracking-tight text-cream">
              Meet Nova.
            </h1>

            <p className="font-serif italic text-2xl text-cream/45">
              Your always-on operations assistant.
            </p>

            <p className="text-lg text-cream/35 leading-relaxed max-w-md">
              Nova answers inquiries, qualifies leads, books appointments,
              and handles follow-up — 24/7, in your brand voice. Like hiring
              the best front desk person who never sleeps, never forgets, and
              never puts a caller on hold.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/book" className="inline-flex items-center justify-center bg-cream text-nova-purple text-sm tracking-wide px-8 py-4 rounded-full hover:bg-white transition-colors">
                Get Nova for Your Business
              </Link>
            </div>

            {/* Live stats */}
            <div className="flex gap-8 pt-4">
              {[
                { n: "8 sec", l: "avg response" },
                { n: "24/7", l: "availability" },
                { n: "0", l: "leads missed" },
              ].map((s) => (
                <div key={s.l}>
                  <span className="font-mono text-xl text-cream/80">{s.n}</span>
                  <span className="block text-[10px] font-mono text-cream/25 mt-0.5">{s.l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat demo */}
          <NovaChatDemo />
        </div>
      </Section>

      {/* Capabilities — with example messages */}
      <Section variant="cream">
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <Overline className="text-nova-purple">What Nova Does</Overline>
            <Headline as="h2" size="section" className="mt-4">
              Everything your front desk does — without the overhead
            </Headline>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="bg-white border border-charcoal/5 rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 py-2.5 bg-charcoal/[0.02] border-b border-charcoal/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-nova-purple" />
                  <span className="font-mono text-[9px] tracking-wider uppercase text-nova-purple/50">
                    {cap.status}
                  </span>
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="font-serif text-lg text-charcoal">
                    {cap.title}
                  </h3>
                  <p className="text-sm text-charcoal/45 leading-relaxed">
                    {cap.description}
                  </p>
                  {/* Example message */}
                  <div className="bg-cream/80 border border-charcoal/5 rounded-lg px-4 py-3 mt-3">
                    <span className="font-mono text-[9px] text-charcoal/20 tracking-wider uppercase block mb-1.5">
                      Nova says:
                    </span>
                    <p className="text-sm text-charcoal/55 italic leading-relaxed">
                      {cap.example}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section variant="blush">
        <div className="max-w-3xl mx-auto space-y-16">
          <Headline as="h2" size="section" className="text-center">
            How Nova works
          </Headline>

          <div className="space-y-5">
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
                  "Nova routes qualified leads to your calendar and alerts your team when a human touch is needed. No busywork.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-cream/80 border border-charcoal/5 rounded-xl overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 py-2.5 bg-charcoal/[0.02] border-b border-charcoal/5">
                  <span className="font-mono text-[10px] text-charcoal/25">
                    Step {item.step}
                  </span>
                </div>
                <div className="p-5 md:p-6 space-y-2">
                  <h3 className="font-serif text-xl text-charcoal">
                    {item.title}
                  </h3>
                  <p className="text-charcoal/50 leading-relaxed">
                    {item.description}
                  </p>
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
        <p className="mt-6 text-cream/35 leading-relaxed max-w-lg mx-auto">
          Nova can be live on your channels in 14 days. Let&apos;s talk about
          what it would look like for your business.
        </p>
        <div className="mt-10">
          <Link href="/book" className="inline-flex items-center justify-center bg-cream text-nova-purple text-sm tracking-wide px-10 py-4 rounded-full hover:bg-white transition-colors">
            Book Your Free Audit
          </Link>
        </div>
        <p className="font-mono text-[10px] text-cream/20 mt-6">
          Included in Growth plan · Can be added to Launch
        </p>
      </Section>
    </>
  );
}
