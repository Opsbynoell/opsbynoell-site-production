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
      <section className="relative min-h-screen flex flex-col justify-center bg-cream px-6 md:px-12 lg:px-20 pt-24 pb-16 overflow-hidden">
        {/* Notification strip — operational presence */}
        <div className="absolute top-20 left-0 right-0 border-b border-charcoal/5 bg-cream/80 backdrop-blur-sm z-10">
          <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-20 py-2 flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="font-mono text-[11px] text-charcoal/35">
              System active — 12 leads responded to today
            </span>
            <span className="font-mono text-[11px] text-charcoal/20 ml-auto hidden sm:inline">
              avg response: 8 sec
            </span>
          </div>
        </div>

        <div className="mx-auto max-w-6xl w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Copy */}
            <div className="space-y-8">
              <Overline>AI Automation for Local Businesses</Overline>

              <h1 className="font-serif uppercase text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[0.92] tracking-tight text-charcoal">
                By the time you call back, they&apos;ve already booked
                somewhere else.
              </h1>

              <p className="text-lg text-charcoal/50 leading-relaxed max-w-md">
                One system change can recover the revenue your team is losing
                every week to missed calls, slow follow-up, and forgotten
                leads.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link href="/book" className="inline-flex items-center justify-center bg-wine text-cream text-sm tracking-wide px-8 py-4 rounded-full hover:bg-wine-light transition-colors">
                  Book Free Audit
                </Link>
                <Link href="/systems" className="inline-flex items-center justify-center border border-charcoal/15 text-charcoal text-sm tracking-wide px-8 py-4 rounded-full hover:border-charcoal/30 transition-colors">
                  See How It Works
                </Link>
              </div>
            </div>

            {/* Right: Layered proof composition */}
            <div className="relative min-h-[460px] md:min-h-[520px]">
              {/* Main system dashboard */}
              <div className="absolute top-4 right-0 w-[92%] bg-white border border-charcoal/8 rounded-xl shadow-sm overflow-hidden">
                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-charcoal/[0.02] border-b border-charcoal/5">
                  <div className="w-2 h-2 rounded-full bg-red-400/50" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400/50" />
                  <div className="w-2 h-2 rounded-full bg-green-400/50" />
                  <span className="ml-3 font-mono text-[10px] text-charcoal/25">
                    ops.noell.systems/dashboard
                  </span>
                </div>

                <div className="p-5 space-y-4">
                  {/* Status header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span className="font-mono text-xs text-charcoal/50 font-medium">
                        Nova: Active
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-[10px] text-charcoal/25">
                        Today
                      </span>
                      <span className="font-mono text-lg text-wine font-medium">
                        $960
                      </span>
                    </div>
                  </div>

                  {/* Response log */}
                  <div className="space-y-0 border border-charcoal/5 rounded-lg overflow-hidden">
                    {[
                      { time: "2:14 PM", tag: "CAPTURED", tagColor: "text-green-600 bg-green-50", msg: "New lead from Google Ads", accent: "responded in 8 sec" },
                      { time: "2:15 PM", tag: "BOOKED", tagColor: "text-wine bg-wine/5", msg: "Appointment confirmed", accent: "Tue 3:00 PM" },
                      { time: "2:15 PM", tag: "SENT", tagColor: "text-charcoal/40 bg-charcoal/3", msg: "SMS + email confirmation", accent: "delivered" },
                      { time: "2:16 PM", tag: "ALERT", tagColor: "text-charcoal/40 bg-charcoal/3", msg: "Team notified", accent: "#leads" },
                      { time: "2:22 PM", tag: "CAPTURED", tagColor: "text-green-600 bg-green-50", msg: "Missed call — auto-responded", accent: "responded in 4 sec" },
                      { time: "2:23 PM", tag: "QUALIFYING", tagColor: "text-amber-600 bg-amber-50", msg: "Nova asking about service type", accent: "in progress" },
                    ].map((entry, i) => (
                      <div key={i} className={`flex items-center gap-3 px-3 py-2 text-[12px] ${i % 2 === 0 ? "" : "bg-charcoal/[0.015]"}`}>
                        <span className="font-mono text-[10px] text-charcoal/20 shrink-0 w-12">
                          {entry.time}
                        </span>
                        <span className={`font-mono text-[9px] tracking-wider px-1.5 py-0.5 rounded ${entry.tagColor} shrink-0`}>
                          {entry.tag}
                        </span>
                        <span className="text-charcoal/45 truncate">
                          {entry.msg}
                        </span>
                        <span className="text-wine font-medium ml-auto shrink-0">
                          {entry.accent}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating stat card — tilted, pinned */}
              <div className="absolute bottom-16 -left-2 -rotate-3 bg-white border border-wine/12 rounded-lg px-5 py-4 shadow-lg z-10">
                <span className="font-mono text-[9px] tracking-wider uppercase text-charcoal/25 block">
                  This week
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="font-mono text-4xl text-wine font-medium">$960</span>
                </div>
                <span className="text-[11px] text-charcoal/35 mt-1 block">
                  revenue recovered
                </span>
              </div>

              {/* Missed call notification — communication-then cue */}
              <div className="absolute bottom-2 left-10 rotate-1 bg-blush border border-wine/8 rounded-lg px-4 py-3 shadow-sm z-10 max-w-[200px]">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="font-mono text-[9px] tracking-wider uppercase text-charcoal/35">
                    Missed call
                  </span>
                  <span className="font-mono text-[9px] text-charcoal/20 ml-auto">
                    4:47 PM
                  </span>
                </div>
                <p className="text-[11px] text-charcoal/35 line-through">
                  Lost to voicemail
                </p>
                <p className="text-[11px] text-wine font-medium">
                  Nova responded in 8 sec →
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-25">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
            Scroll
          </span>
          <div className="w-px h-8 bg-charcoal/30" />
        </div>
      </section>

      {/* ─── PROOF BAND — Recognition → Tension ─── */}
      <Section variant="blush" className="py-16 md:py-24">
        <p className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30 mb-8">
          One system change. These results.
        </p>
        <ProofBand />
      </Section>

      {/* ─── DARK INTERRUPTION — Tension ─── */}
      <section className="relative bg-charcoal px-6 md:px-12 lg:px-20 py-32 md:py-44 lg:py-56">
        <div className="mx-auto max-w-6xl">
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
            <p className="mt-10 text-lg text-cream/35 leading-relaxed max-w-xl">
              Every hour a lead waits, the chance of conversion drops by 80%.
              You&apos;re paying to fill the top of the funnel — and watching
              it leak out the bottom.
            </p>
          </div>
          {/* Status cue — keeps tension operational */}
          <div className="absolute top-8 right-8 md:right-16 flex items-center gap-2 opacity-40">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="font-mono text-[10px] text-cream/50">
              3 leads waiting
            </span>
          </div>
        </div>
      </section>

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
          {/* Communication bridge */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-lg">
              <Overline>The Bridge</Overline>
              <p className="font-serif italic text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.15] text-charcoal mt-4">
                We used to reach people by picking up the phone, checking
                the rolodex, leaving a voicemail.
              </p>
              <p className="mt-6 text-charcoal/50 leading-relaxed">
                Now AI handles it — but only if the system is built right.
                We bridge the gap between how communication used to work and
                how it needs to work now.
              </p>
            </div>
            {/* Then/Now artifact */}
            <div className="relative">
              <div className="bg-cream/80 border border-charcoal/5 rounded-xl p-6 -rotate-1">
                <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/25">
                  Communication — Then
                </span>
                <div className="mt-3 space-y-2.5 text-sm text-charcoal/35">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-red-300" />
                    <span>Missed call — voicemail left</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-300" />
                    <span>Callback attempted — no answer</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-red-300" />
                    <span>Lead lost — booked elsewhere</span>
                  </div>
                </div>
              </div>
              <div className="bg-white border border-wine/10 rounded-xl p-6 rotate-1 -mt-8 ml-6 relative z-10 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-mono text-[10px] tracking-wider uppercase text-wine font-medium">
                    AI Systems — Now
                  </span>
                </div>
                <div className="space-y-2.5 text-sm text-charcoal/55">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Lead captured — <span className="text-wine font-medium">8 sec response</span></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Appointment booked — <span className="text-wine font-medium">auto-confirmed</span></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span>Revenue recovered — <span className="text-wine font-medium">$960/week</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Systems */}
          <div>
            <Overline>The System</Overline>
            <Headline as="h2" size="section" className="mt-4 mb-16">
              From AI chaos to systems that run themselves
            </Headline>
            <SystemsSection />
            <div className="mt-16">
              <Link href="/systems" className="inline-flex items-center justify-center bg-wine text-cream text-sm tracking-wide px-8 py-4 rounded-full hover:bg-wine-light transition-colors">
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
            In 30 minutes, we&apos;ll show you exactly where leads are
            slipping and what it&apos;s costing you. No pitch deck. No
            pressure.
          </p>
          <div className="mt-10">
            <Link href="/book" className="inline-flex items-center justify-center bg-wine text-cream text-sm tracking-wide px-10 py-4 rounded-full hover:bg-wine-light transition-colors">
              Book Your Free Audit
            </Link>
          </div>
          {/* Proof reinforcement */}
          <p className="font-mono text-[11px] text-charcoal/25 mt-8">
            $960/week recovered on average · 14 days to operational · 0
            no-shows
          </p>
        </div>
      </section>
    </>
  );
}
