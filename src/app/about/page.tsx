import Image from "next/image";
import {
  IconUser,
  IconVolume,
  IconHeart,
} from "@tabler/icons-react";
import { Button } from "@/components/button";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  organizationSchema,
} from "@/lib/schema";

const OFFICE_PHOTO = "/images/about-noell-family.jpg";
const OFFICE_PHOTO_ALT =
  "The Ops by Noell studio space in Mission Viejo, California, photographed in black and white.";

export const metadata = pageMetadata({
  path: "/about",
  title: "About Ops by Noell",
  description:
    "An operations studio based in Mission Viejo, CA. We help service-business owners keep more of the revenue they are already earning.",
  image: OFFICE_PHOTO,
  imageAlt: OFFICE_PHOTO_ALT,
});

const credos = [
  {
    icon: <IconUser size={22} />,
    text: "The person running the business knows it better than any software company ever will.",
  },
  {
    icon: <IconVolume size={22} />,
    text: "AI should work quietly in the background, not announce itself in every interaction.",
  },
  {
    icon: <IconHeart size={22} />,
    text: "The best businesses are run by tight-knit teams. We're proud this one is.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <JsonLd
        data={[
          organizationSchema,
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
        id="about"
      />
      {/* 1. Hero, split layout */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* LEFT: photo with cream frame */}
          <div className="order-1 md:order-1">
            <div className="rounded-[28px] bg-[#301A26] p-3 md:p-4 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
              <div className="relative rounded-[22px] overflow-hidden aspect-[4/5] bg-charcoal/5">
                <Image
                  src={OFFICE_PHOTO}
                  alt={OFFICE_PHOTO_ALT}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          {/* RIGHT: editorial text */}
          <div className="order-2 md:order-2">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-strong font-medium mb-5">
              Ops by Noell · Mission Viejo, CA
            </p>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-cream leading-[1.1]">
              Built by an operations team who watched too many good businesses bleed.
            </h1>
            <p className="mt-6 font-serif italic text-lg md:text-xl text-cream/75 leading-relaxed">
              An operations studio based in Mission Viejo, California.
            </p>
            <p className="mt-6 text-base md:text-lg text-cream/80 leading-relaxed">
              We spent years inside growing businesses watching the same pattern: smart owners, booked calendars, lean teams, and money slipping out the back door. A missed call at 9 PM. A chat nobody answered. A client who never got a follow-up. We built Ops by Noell to fix that.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Why we built this */}
      <section className="w-full px-4 py-16 md:py-24 bg-[#1F1219]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight text-center">
            We built the system{" "}
            <span className="italic bg-gradient-to-b from-[#D96B38] to-[#C45A2A] bg-clip-text text-transparent">
              we wished existed.
            </span>
          </h2>
          <div className="mt-10 space-y-6 text-base md:text-lg text-cream/80 leading-relaxed">
            <p>
              You&apos;re already booked. You&apos;re already great at what you do. You shouldn&apos;t have to hire a $4,200/mo front desk to stop losing $5,000 a month in missed calls. You shouldn&apos;t have to choose between answering the phone and finishing the appointment you&apos;re already in.
            </p>
            <p>
              The software existed. The AI existed. But nobody had put it together in a way that an owner could actually install and run without hiring three more people. So we built it.
            </p>
          </div>
        </div>
      </section>

      {/* 3. What we believe, three credos */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-strong font-medium text-center mb-10">
            What we believe
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {credos.map((credo, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#C45A2A]/10 text-[#C45A2A] flex items-center justify-center mb-5">
                  {credo.icon}
                </div>
                <p className="font-serif italic text-lg md:text-xl text-cream leading-snug max-w-xs">
                  {credo.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Who we are, short bio */}
      <section className="w-full px-4 py-16 md:py-20 bg-[#1F1219]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl md:text-4xl font-semibold text-cream leading-tight">
            Every account gets us directly.
          </h2>
          <p className="mt-6 text-base md:text-lg text-cream/80 leading-relaxed">
            When you sign up, you are not handed off to a support team. You are working with us. If you&apos;d rather talk than read, our door is open.
          </p>
          <div className="mt-6">
            <Button href="/book" variant="primary" className="h-11 px-6">
              Book a free 30-minute audit
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Closing, CTA */}
      <section className="w-full px-4 my-16 md:my-20">
        <div className="max-w-5xl mx-auto rounded-[32px] bg-[#301A26]/70 border border-white/10 px-6 py-14 md:py-20 text-center">
          <p className="font-serif italic text-xl md:text-3xl text-cream leading-snug">
            Current pricing is available now.
          </p>
          <p className="mt-4 text-sm md:text-base text-cream/70">
            Every tier includes done-for-you setup, a dedicated ops partner, and a live dashboard. Your rate is locked from day one.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/pricing" variant="primary" className="h-12 px-8">
              See pricing &rarr;
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
