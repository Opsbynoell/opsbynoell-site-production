import { Section } from "@/components/section";
import { Headline } from "@/components/headline";
import { Overline } from "@/components/overline";
import { NovaChatDemo } from "@/components/nova-chat-demo";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nova — Ops by Noell",
  description:
    "Nova is the AI layer inside every Ops by Noell system — handling lead response, qualification, and booking so your team can focus on what matters.",
};

const capabilities = [
  {
    title: "Instant lead response",
    description:
      "When a lead comes in — from your website, a missed call, or a form — Nova responds immediately via text or email, in your brand voice.",
    example: '"Hi! Thanks for reaching out. We have openings this week — would you like to book a consultation?"',
  },
  {
    title: "Smart qualification",
    description:
      "Nova asks the right questions to understand what the lead needs, so your team only spends time on qualified prospects.",
    example: '"To give you the best recommendation, can I ask what service you\'re interested in?"',
  },
  {
    title: "Automated booking",
    description:
      "Nova checks your calendar and books appointments directly — no back-and-forth, no phone tag, no missed opportunities.",
    example: '"I have Tuesday at 2:00 PM or Thursday at 4:00 PM. Which works better for you?"',
  },
  {
    title: "After-hours coverage",
    description:
      "Leads don't stop at 5 PM. Nova handles inquiries around the clock so you never lose a lead to a slow response.",
    example: '"Thanks for reaching out! I can help you book right now — what time works best this week?"',
  },
];

export default function NovaPage() {
  return (
    <>
      {/* Hero */}
      <Section variant="nova" className="pt-32 md:pt-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/12">
              <div className="w-2 h-2 rounded-full bg-cream/40" />
              <span className="font-mono text-[11px] text-cream/40">
                The AI layer inside every system
              </span>
            </div>

            <h1 className="font-serif uppercase text-[clamp(2.5rem,6vw,5rem)] leading-[0.92] tracking-tight text-cream">
              Meet Nova.
            </h1>

            <p className="font-serif italic text-2xl text-cream/45">
              The AI that powers your lead response.
            </p>

            <p className="text-lg text-cream/35 leading-relaxed max-w-md">
              Nova is the AI layer built into every Ops by Noell system. It
              handles instant lead response, qualification, and booking — so
              your team focuses on the work that matters, not on chasing
              callbacks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/book"
                className="inline-flex items-center justify-center bg-cream text-nova-purple text-sm font-medium px-8 py-3.5 rounded-md hover:bg-white transition-all hover:-translate-y-0.5"
              >
                Book Free Audit
              </Link>
            </div>
          </div>

          {/* Chat demo — framed as preview */}
          <div className="space-y-2">
            <NovaChatDemo />
            <p className="font-mono text-[9px] text-cream/20 text-center">
              Preview — showing how Nova handles a typical inquiry
            </p>
          </div>
        </div>
      </Section>

      {/* Capabilities */}
      <Section variant="cream">
        <div className="space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <Overline className="text-nova-purple">How Nova Works</Overline>
            <Headline as="h2" size="section" className="mt-4">
              Your system responds instantly — even when you can&apos;t
            </Headline>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="bg-white border border-charcoal/5 rounded-xl p-6 space-y-3"
              >
                <h3 className="font-serif text-lg text-charcoal">
                  {cap.title}
                </h3>
                <p className="text-sm text-charcoal/45 leading-relaxed">
                  {cap.description}
                </p>
                <div className="bg-cream/80 border border-charcoal/5 rounded-lg px-4 py-3">
                  <span className="font-mono text-[9px] text-charcoal/20 tracking-wider uppercase block mb-1.5">
                    Example response
                  </span>
                  <p className="text-sm text-charcoal/55 italic leading-relaxed">
                    {cap.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* How it gets set up */}
      <Section variant="blush">
        <div className="max-w-3xl mx-auto space-y-16">
          <Headline as="h2" size="section" className="text-center">
            How we set up Nova for your business
          </Headline>

          <div className="space-y-5">
            {[
              {
                step: "01",
                title: "We learn your business",
                description:
                  "During your audit, we map your services, pricing, policies, and how you talk to clients. Nova gets trained on all of it.",
              },
              {
                step: "02",
                title: "We build and test the system",
                description:
                  "Nova gets configured to handle your specific lead types, qualification questions, and booking flow. We test everything before it goes live.",
              },
              {
                step: "03",
                title: "Your system goes live",
                description:
                  "Nova starts handling incoming leads across your channels. Your team gets notified when a human touch is needed — everything else runs automatically.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-cream/80 border border-charcoal/5 rounded-xl p-6 md:p-7"
              >
                <div className="grid grid-cols-[50px_1fr] gap-4 items-start">
                  <span className="font-mono text-2xl text-charcoal/15">
                    {item.step}
                  </span>
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl text-charcoal">
                      {item.title}
                    </h3>
                    <p className="text-charcoal/50 leading-relaxed">
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
          See what Nova can do for your business.
        </p>
        <p className="mt-6 text-cream/35 leading-relaxed max-w-lg mx-auto">
          Every free audit includes a walkthrough of how Nova would handle
          your specific leads and booking flow.
        </p>
        <div className="mt-10">
          <Link
            href="/book"
            className="inline-flex items-center justify-center bg-cream text-nova-purple text-sm font-medium px-10 py-3.5 rounded-md hover:bg-white transition-all hover:-translate-y-0.5"
          >
            Book Your Free Audit
          </Link>
        </div>
      </Section>
    </>
  );
}
