"use client";

import Link from "next/link";
import { Section } from "@/components/section";
import { Headline } from "@/components/headline";
import { Overline } from "@/components/overline";
import { ProofBand } from "@/components/proof-band";
import { CaseStudy } from "@/components/case-study";
import { VerticalsSection } from "@/components/verticals-section";
import { SystemsSection } from "@/components/systems-section";
import { NovaSection } from "@/components/nova-section";
import { AboutSection } from "@/components/about-section";

export default function Home() {
  return (
    <>
      {/* ─── HERO — Recognition ─── */}
      <section className="relative min-h-screen flex flex-col justify-center bg-cream px-6 md:px-12 lg:px-20 pt-24 pb-16">
        <div className="mx-auto max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              <Overline>AI Automation for Local Businesses</Overline>

              <h1 className="font-serif uppercase text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] tracking-tight text-charcoal">
                By the time you call back, they&apos;ve already booked somewhere
                else.
              </h1>

              <p className="text-lg text-charcoal/50 leading-relaxed max-w-md">
                One system change can recover the revenue your team is losing
                every week to missed calls, slow follow-up, and forgotten leads.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center bg-wine text-cream text-sm tracking-wide px-8 py-4 rounded-full hover:bg-wine-light transition-colors"
                >
                  Book Free Audit
                </Link>
                <Link
                  href="/systems"
                  className="inline-flex items-center justify-center border border-charcoal/15 text-charcoal text-sm tracking-wide px-8 py-4 rounded-full hover:border-charcoal/30 transition-colors"
                >
                  See How It Works
                </Link>
              </div>
            </div>

            {/* Right: Layered proof composition — communication bridge */}
            <div className="relative min-h-[420px] md:min-h-[480px]">
              {/* Main system log — contact-list / status-feed aesthetic */}
              <div className="absolute top-0 right-0 w-[90%] bg-white border border-charcoal/8 rounded-xl shadow-sm overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-charcoal/[0.02] border-b border-charcoal/5">
                  <div className="w-2 h-2 rounded-full bg-charcoal/10" />
                  <div className="w-2 h-2 rounded-full bg-charcoal/10" />
                  <div className="w-2 h-2 rounded-full bg-charcoal/10" />
                  <span className="ml-3 font-mono text-[10px] text-charcoal/30">
                    Ops by Noell — System Dashboard
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Status bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="font-mono text-xs text-charcoal/40">
                        Nova: Active
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-charcoal/25">
                      Today, 2:14 PM
                    </span>
                  </div>

                  {/* System log entries */}
                  <div className="space-y-3 border-t border-charcoal/5 pt-4">
                    {[
                      {
                        time: "2:14 PM",
                        status: "New lead",
                        detail: "Google Search — responded in",
                        accent: "8 sec",
                      },
                      {
                        time: "2:15 PM",
                        status: "Booked",
                        detail: "Appointment confirmed —",
                        accent: "Tue 3:00 PM",
                      },
                      {
                        time: "2:15 PM",
                        status: "Sent",
                        detail: "SMS + email confirmation —",
                        accent: "delivered",
                      },
                      {
                        time: "2:16 PM",
                        status: "Notified",
                        detail: "Team alert —",
                        accent: "Slack #leads",
                      },
                    ].map((entry) => (
                      <div
                        key={entry.time + entry.status}
                        className="flex items-start gap-3"
                      >
                        <span className="font-mono text-[10px] text-charcoal/25 mt-0.5 shrink-0 w-12">
                          {entry.time}
                        </span>
                        <div className="flex-1">
                          <span className="font-mono text-[10px] tracking-wider uppercase text-wine/60 mr-2">
                            {entry.status}
                          </span>
                          <span className="text-sm text-charcoal/50">
                            {entry.detail}{" "}
                            <span className="text-wine font-medium">
                              {entry.accent}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating tilted stat card — pinned evidence */}
              <div className="absolute bottom-12 -left-2 md:left-0 -rotate-3 bg-white border border-wine/10 rounded-lg px-5 py-4 shadow-md z-10">
                <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30 block mb-1">
                  This week
                </span>
                <span className="font-mono text-3xl text-wine">$960</span>
                <span className="block text-xs text-charcoal/40 mt-1">
                  revenue recovered
                </span>
              </div>

              {/* Floating missed-call card — communication-then cue */}
              <div className="absolute top-1/2 -left-4 md:-left-6 rotate-2 bg-blush border border-wine/8 rounded-lg px-4 py-3 shadow-sm z-10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="font-mono text-[10px] text-charcoal/40">
                    Missed call — 4:47 PM
                  </span>
                </div>
                <p className="text-xs text-charcoal/50 mt-1 italic">
                  Before: lost to voicemail
                </p>
                <p className="text-xs text-wine mt-0.5">
                  After: Nova responded in 8 sec
                </p>
              </div>

              {/* Wine circle accent — brand motif */}
              <div className="absolute -bottom-2 right-8 w-16 h-16 rounded-full bg-wine/10 border border-wine/15" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
            Scroll
          </span>
          <div className="w-px h-6 bg-charcoal/30" />
        </div>
      </section>

      {/* ─── PROOF BAND — Recognition → Tension ─── */}
      <Section variant="blush" className="py-16 md:py-24">
        <ProofBand />
      </Section>

      {/* ─── DARK INTERRUPTION — Tension ─── */}
      <Section variant="charcoal" className="py-32 md:py-44 lg:py-56">
        <div className="max-w-4xl">
          <p className="font-serif uppercase text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] tracking-tight text-cream">
            Your marketing
            <br />
            is working.
          </p>
          <p className="font-serif uppercase text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] tracking-tight text-blush mt-2">
            Your response
            <br />
            time isn&apos;t.
          </p>
          <p className="mt-10 text-lg text-cream/40 leading-relaxed max-w-xl">
            Every hour a lead waits, the chance of conversion drops by 80%.
            You&apos;re paying to fill the top of the funnel — and watching it
            leak out the bottom.
          </p>
        </div>
      </Section>

      {/* ─── CASE STUDY — Proof ─── */}
      <Section variant="cream" id="proof">
        <CaseStudy />
      </Section>

      {/* ─── VERTICALS — Proof → Relief ─── */}
      <Section variant="cream" id="verticals">
        <div className="space-y-14">
          <div className="max-w-2xl">
            <Overline>Verticals</Overline>
            <Headline as="h2" size="section" className="mt-4">
              Built for businesses where every missed call costs real money
            </Headline>
          </div>
          <VerticalsSection />
        </div>
      </Section>

      {/* ─── BRIDGE + SYSTEMS — Relief ─── */}
      <Section variant="blush" id="systems">
        <div className="space-y-20">
          {/* Communication bridge — visible thesis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-lg">
              <Overline>The Bridge</Overline>
              <p className="font-serif italic text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.15] text-charcoal mt-4">
                We used to reach people by picking up the phone, checking
                the rolodex, leaving a voicemail.
              </p>
              <p className="mt-6 text-charcoal/50 leading-relaxed">
                Now AI handles it — but only if the system is built right. We
                bridge the gap between how communication used to work and how it
                needs to work now.
              </p>
            </div>
            {/* Then/Now visual artifact */}
            <div className="relative">
              <div className="bg-cream/80 border border-charcoal/5 rounded-xl p-6 -rotate-1">
                <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
                  Communication — Then
                </span>
                <div className="mt-3 space-y-2 text-sm text-charcoal/40">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-300" />
                    <span>Missed call — voicemail left</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-300" />
                    <span>Callback attempted — no answer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-300" />
                    <span>Lead lost — booked elsewhere</span>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-wine/10 rounded-xl p-6 rotate-1 -mt-6 ml-8 relative z-10 shadow-sm">
                <span className="font-mono text-[10px] tracking-wider uppercase text-wine">
                  AI Systems — Now
                </span>
                <div className="mt-3 space-y-2 text-sm text-charcoal/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>
                      Lead captured —{" "}
                      <span className="text-wine">responded in 8 sec</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>
                      Appointment booked —{" "}
                      <span className="text-wine">confirmed automatically</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>
                      Revenue recovered —{" "}
                      <span className="text-wine">$960/week</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Systems capabilities */}
          <div>
            <Overline>The System</Overline>
            <Headline as="h2" size="section" className="mt-4 mb-16">
              From AI chaos to systems that run themselves
            </Headline>
            <SystemsSection />
            <div className="mt-16">
              <Link
                href="/systems"
                className="inline-flex items-center justify-center bg-wine text-cream text-sm tracking-wide px-8 py-4 rounded-full hover:bg-wine-light transition-colors"
              >
                Explore Our Systems
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── NOVA — Relief ─── */}
      <Section variant="nova" id="nova">
        <NovaSection />
      </Section>

      {/* ─── ABOUT — Relief → Action ─── */}
      <Section variant="cream" id="about">
        <AboutSection />
      </Section>

      {/* ─── CLOSING CTA — Action ─── */}
      <section className="bg-blush px-6 md:px-12 lg:px-20 py-28 md:py-36">
        <div className="mx-auto max-w-6xl text-center">
          <p className="font-serif uppercase text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-charcoal max-w-2xl mx-auto">
            Let&apos;s find what&apos;s leaking.
          </p>
          <p className="mt-6 text-lg text-charcoal/50 leading-relaxed max-w-lg mx-auto">
            In 30 minutes, we&apos;ll show you exactly where leads are slipping
            and what it&apos;s costing you. No pitch deck. No pressure.
          </p>
          <div className="mt-10">
            <Link
              href="/book"
              className="inline-flex items-center justify-center bg-wine text-cream text-sm tracking-wide px-10 py-4 rounded-full hover:bg-wine-light transition-colors"
            >
              Book Your Free Audit
            </Link>
          </div>
          {/* Wine circle accent */}
          <div className="mx-auto mt-12 w-20 h-20 rounded-full bg-wine/10 border border-wine/15" />
        </div>
      </section>
    </>
  );
}
