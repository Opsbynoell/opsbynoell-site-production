"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
      {/* ─── HERO — Recognition — Template: Hero gradient bg + mockup ─── */}
      <div className="relative flex max-w-7xl rounded-b-3xl my-2 md:my-20 mx-auto flex-col items-center justify-center pt-32 overflow-hidden px-4 md:px-8 bg-gradient-to-t from-blush via-cream to-white">
        {/* Headline */}
        <div className="text-balance relative z-20 mx-auto mb-4 max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30 block mb-6">
              AI Automation for Local Businesses
            </span>
            <h1 className="font-serif uppercase text-4xl md:text-6xl lg:text-7xl leading-[0.92] tracking-tight text-charcoal">
              By the time you call back,{" "}
              <span className="text-wine">
                they&apos;ve already booked somewhere else.
              </span>
            </h1>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.5 }}
          className="relative z-20 mx-auto mt-6 max-w-2xl px-4 text-center text-base text-charcoal/50 leading-relaxed"
        >
          One system change can recover the revenue your team is losing every
          week to missed calls, slow follow-up, and forgotten leads.
        </motion.p>

        {/* Dual CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.7 }}
          className="mb-8 mt-6 z-10 sm:mb-10 sm:mt-8 flex w-full flex-col items-center justify-center gap-4 px-4 sm:flex-row md:mb-16"
        >
          <Link
            href="/book"
            className="w-full sm:w-auto bg-wine text-cream text-sm font-medium px-8 py-3.5 rounded-md hover:bg-wine-light transition-all hover:-translate-y-0.5 inline-flex items-center justify-center shadow-[0px_4px_8px_0px_rgba(106,44,62,0.15)]"
          >
            Book Free Audit
          </Link>
          <Link
            href="/systems"
            className="w-full sm:w-auto bg-white text-charcoal text-sm font-medium px-8 py-3.5 rounded-md border border-charcoal/10 hover:border-charcoal/20 transition-all hover:-translate-y-0.5 inline-flex items-center justify-center"
          >
            See How It Works
          </Link>
        </motion.div>

        {/* Product mockup — system dashboard (replaces iPhone mockup) */}
        <div className="pt-4 w-full min-h-[22rem] relative">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute top-0 left-0 right-0 z-10 max-w-3xl mx-auto"
          >
            <div className="bg-white border border-charcoal/8 rounded-xl shadow-lg overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-charcoal/[0.02] border-b border-charcoal/5">
                <div className="w-2 h-2 rounded-full bg-red-400/40" />
                <div className="w-2 h-2 rounded-full bg-yellow-400/40" />
                <div className="w-2 h-2 rounded-full bg-green-400/40" />
                <span className="ml-3 font-mono text-[10px] text-charcoal/20">
                  ops.noell.systems/dashboard
                </span>
                <div className="ml-auto flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-[10px] text-charcoal/25">Nova: Active</span>
                </div>
              </div>
              <div className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-charcoal/40">Today&apos;s Response Log</span>
                  <span className="font-mono text-lg text-wine font-medium">$960 <span className="text-xs text-charcoal/25">recovered</span></span>
                </div>
                <div className="space-y-0 border border-charcoal/5 rounded-lg overflow-hidden text-[12px]">
                  {[
                    { time: "2:14 PM", tag: "CAPTURED", tagColor: "text-green-700 bg-green-50", msg: "New lead from Google Ads", accent: "responded in 8 sec" },
                    { time: "2:15 PM", tag: "BOOKED", tagColor: "text-wine bg-wine/5", msg: "Appointment confirmed", accent: "Tue 3:00 PM" },
                    { time: "2:22 PM", tag: "CAPTURED", tagColor: "text-green-700 bg-green-50", msg: "Missed call — auto-responded", accent: "4 sec response" },
                  ].map((entry, i) => (
                    <div key={i} className={`flex items-center gap-3 px-3 py-2 ${i % 2 === 0 ? "" : "bg-charcoal/[0.015]"}`}>
                      <span className="font-mono text-[10px] text-charcoal/20 shrink-0 w-12">{entry.time}</span>
                      <span className={`font-mono text-[9px] tracking-wider px-1.5 py-0.5 rounded shrink-0 ${entry.tagColor}`}>{entry.tag}</span>
                      <span className="text-charcoal/45 truncate">{entry.msg}</span>
                      <span className="text-wine font-medium ml-auto shrink-0">{entry.accent}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Background concentric circles — template pattern, Ops by Noell colors */}
          <div className="absolute inset-0 z-0 flex items-center justify-center">
            <div className="absolute z-0 rounded-full border border-wine/5" style={{ width: 1200, height: 1200 }} />
            <motion.div
              className="absolute z-0 rounded-full border border-blush"
              style={{
                width: 900,
                height: 900,
                background: "radial-gradient(circle at center, rgba(250,245,240,1) 0%, rgba(240,228,232,0.4) 40%, rgba(250,245,240,0) 60%)",
              }}
              animate={{ scale: [1, 1.02, 1], y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute rounded-full border border-blush/30 shadow-[0_0_200px_80px_rgba(240,228,232,0.15)]"
              style={{ width: 600, height: 600 }}
              animate={{ scale: [1, 1.03, 1], y: [0, -7, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>

      {/* ─── PROOF BAND — Template: Features stat cards ─── */}
      <Section variant="cream" className="py-16 md:py-24">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] tracking-wider uppercase text-charcoal/30">
            One system change. These results.
          </p>
        </div>
        <ProofBand />
      </Section>

      {/* ─── DARK INTERRUPTION — Tension ─── */}
      <section className="relative bg-charcoal px-6 md:px-12 lg:px-20 py-32 md:py-44 lg:py-52">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-4xl">
            <p className="font-serif uppercase text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] tracking-tight text-cream">
              Your marketing<br />is working.
            </p>
            <p className="font-serif uppercase text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] tracking-tight text-blush mt-2">
              Your response<br />time isn&apos;t.
            </p>
            <p className="mt-10 text-lg text-cream/35 leading-relaxed max-w-xl">
              Every hour a lead waits, the chance of conversion drops by 80%.
              You&apos;re paying to fill the top of the funnel — and watching it leak out the bottom.
            </p>
          </div>
          <div className="absolute top-8 right-8 md:right-16 flex items-center gap-2 opacity-40">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="font-mono text-[10px] text-cream/50">3 leads waiting</span>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-lg">
              <Overline>The Bridge</Overline>
              <p className="font-serif italic text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.15] text-charcoal mt-4">
                We used to reach people by picking up the phone, checking the rolodex, leaving a voicemail.
              </p>
              <p className="mt-6 text-charcoal/50 leading-relaxed">
                Now AI handles it — but only if the system is built right. We bridge the gap between how communication used to work and how it needs to work now.
              </p>
            </div>
            <div className="relative">
              <div className="bg-cream/80 border border-charcoal/5 rounded-xl p-6 -rotate-1">
                <span className="font-mono text-[10px] tracking-wider uppercase text-charcoal/25">Communication — Then</span>
                <div className="mt-3 space-y-2.5 text-sm text-charcoal/35">
                  <div className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-red-300" /><span>Missed call — voicemail left</span></div>
                  <div className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-yellow-300" /><span>Callback attempted — no answer</span></div>
                  <div className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-red-300" /><span>Lead lost — booked elsewhere</span></div>
                </div>
              </div>
              <div className="bg-white border border-wine/10 rounded-xl p-6 rotate-1 -mt-8 ml-6 relative z-10 shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-mono text-[10px] tracking-wider uppercase text-wine font-medium">AI Systems — Now</span>
                </div>
                <div className="space-y-2.5 text-sm text-charcoal/55">
                  <div className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-green-500" /><span>Lead captured — <span className="text-wine font-medium">8 sec response</span></span></div>
                  <div className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-green-500" /><span>Appointment booked — <span className="text-wine font-medium">auto-confirmed</span></span></div>
                  <div className="flex items-center gap-2.5"><div className="w-2 h-2 rounded-full bg-green-500" /><span>Revenue recovered — <span className="text-wine font-medium">$960/week</span></span></div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Overline>The System</Overline>
            <Headline as="h2" size="section" className="mt-4 mb-16">
              From AI chaos to systems that run themselves
            </Headline>
            <SystemsSection />
            <div className="mt-16">
              <Link href="/systems" className="inline-flex items-center justify-center bg-wine text-cream text-sm font-medium px-8 py-3.5 rounded-md hover:bg-wine-light transition-all hover:-translate-y-0.5 shadow-[0px_4px_8px_0px_rgba(106,44,62,0.15)]">
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

      {/* ─── ABOUT — Template: Testimonials split layout ─── */}
      <Section variant="cream" id="about">
        <AboutSection />
      </Section>

      {/* ─── CLOSING CTA — Template: CTA with centered headline ─── */}
      <section className="relative bg-blush px-6 md:px-12 lg:px-20 py-28 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-6xl text-center relative z-10">
          <p className="font-serif uppercase text-[clamp(2rem,5vw,4rem)] leading-[0.95] tracking-tight text-charcoal max-w-2xl mx-auto">
            Let&apos;s find what&apos;s leaking.
          </p>
          <p className="mt-6 text-lg text-charcoal/50 leading-relaxed max-w-lg mx-auto">
            In 30 minutes, we&apos;ll show you exactly where leads are slipping and what it&apos;s costing you. No pitch deck. No pressure.
          </p>
          <div className="mt-10">
            <Link href="/book" className="inline-flex items-center justify-center bg-wine text-cream text-sm font-medium px-10 py-3.5 rounded-md hover:bg-wine-light transition-all hover:-translate-y-0.5 shadow-[0px_4px_8px_0px_rgba(106,44,62,0.15)]">
              Book Your Free Audit
            </Link>
          </div>
          <p className="font-mono text-[11px] text-charcoal/25 mt-8">
            $960/week recovered on average · 14 days to operational · 0 no-shows
          </p>
        </div>
        {/* Wine circle accents — like template CTA floating elements */}
        <div className="absolute top-12 left-12 w-20 h-20 rounded-full bg-wine/5 border border-wine/8" />
        <div className="absolute bottom-16 right-16 w-14 h-14 rounded-full bg-wine/8 border border-wine/12" />
        <div className="absolute top-1/2 right-8 w-8 h-8 rounded-full bg-wine/5" />
      </section>
    </>
  );
}
