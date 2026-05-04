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
  jamesPersonSchema,
  personSchema,
} from "@/lib/schema";

const FAMILY_PHOTO = "/images/about-noell-family.jpg";
const FAMILY_PHOTO_ALT =
  "James and Nikki Noell with their daughter — the family behind Ops by Noell, photographed in black and white.";

export const metadata = pageMetadata({
  path: "/about",
  title: "About James & Nikki Noell",
  description:
    "A family-run studio from Mission Viejo, CA, founded by James and Nikki Noell. We help service-business owners keep more of the revenue they are already earning.",
  image: FAMILY_PHOTO,
  imageAlt: FAMILY_PHOTO_ALT,
});

const credos = [
  {
    icon: <IconUser size={22} />,
    text: "The person running the business knows it better than any software company ever will.",
  },
  {
    icon: <IconVolume size={22} />,
    text: "AI should work quietly in the background — not announce itself in every interaction.",
  },
  {
    icon: <IconHeart size={22} />,
    text: "The best businesses are family-run. We're proud this one is.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <JsonLd
        data={[
          personSchema(),
          jamesPersonSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
        id="about"
      />
      {/* 1. Hero — split layout */}
      <section className="relative w-full max-w-7xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-12 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* LEFT: photo with cream frame */}
          <div className="order-1 md:order-1">
            <div className="rounded-[28px] bg-cream-dark p-3 md:p-4 shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]">
              <div className="relative rounded-[22px] overflow-hidden aspect-[4/5] bg-charcoal/5">
                <Image
                  src={FAMILY_PHOTO}
                  alt={FAMILY_PHOTO_ALT}
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
            <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium mb-5">
              James &amp; Nikki Noell · Mission Viejo, CA
            </p>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-charcoal leading-[1.1]">
              Built by a family who watched too many good businesses bleed.
            </h1>
            <p className="mt-6 font-serif italic text-lg md:text-xl text-muted-strong leading-relaxed">
              Ops by Noell is a family-run studio from Mission Viejo,
              California.
            </p>
            <p className="mt-6 text-base md:text-lg text-charcoal/80 leading-relaxed">
              We&apos;re James and Nikki Noell — a husband-and-wife team based
              in Mission Viejo. Between us we&apos;ve spent years inside
              growing businesses, from sales to operations, watching the same
              pattern everywhere we went: smart owners, booked calendars, lean
              teams — and money slipping out the back door. A missed call at 9
              PM. A chat nobody answered. A client who never got a follow-up.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Why we built this */}
      <section className="w-full px-4 py-16 md:py-24 bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight text-center">
            We built the system{" "}
            <span className="italic bg-gradient-to-b from-wine-light to-wine bg-clip-text text-transparent">
              we wished existed.
            </span>
          </h2>
          <div className="mt-10 space-y-6 text-base md:text-lg text-charcoal/80 leading-relaxed">
            <p>
              We kept watching the same pattern. Brilliant owners running
              service businesses — dental practices, med spas, salons, lash
              studios, massage practices, HVAC companies — losing five-figure
              revenue every month to the quietest problem in the business. A
              ringing phone with nobody to answer it. A new client who chatted
              on the website at 7:42 AM and never heard back. A loyal customer
              nobody followed up with.
            </p>
            <p>
              We started Ops by Noell to help service-business owners keep
              more of the money they&apos;re already making — while running
              lean teams, wearing every hat, and building something that
              carries their name. You&apos;re already booked. You&apos;re
              already great at what you do. You shouldn&apos;t have to hire a
              $4,200/mo front desk to stop losing $5,000 a month in missed
              calls. You shouldn&apos;t have to choose between answering the
              phone and finishing the appointment you&apos;re already in.
            </p>
            <p>
              The software existed. The AI existed. But nobody had put it
              together in a way that an owner — not a software developer, not
              a &ldquo;growth hacker&rdquo; — could actually install and run
              without hiring three more people. So we built it. Three AI
              agents that handle the front of the house, sitting on top of the
              operations platform we use ourselves, in your brand, live in two
              weeks.
            </p>
          </div>
        </div>
      </section>

      {/* 3. What we believe — three credos */}
      <section className="w-full px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.25em] text-wine font-medium text-center mb-10">
            What we believe
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {credos.map((credo, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-wine/10 text-wine flex items-center justify-center mb-5">
                  {credo.icon}
                </div>
                <p className="font-serif italic text-lg md:text-xl text-charcoal leading-snug max-w-xs">
                  {credo.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Who we are — short bio */}
      <section className="w-full px-4 py-16 md:py-20 bg-cream">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl md:text-4xl font-semibold text-charcoal leading-tight">
            Who we are.
          </h2>
          <p className="mt-6 text-base md:text-lg text-charcoal/80 leading-relaxed">
            James and Nikki Noell, based in Mission Viejo. Between us, years
            of working inside growing businesses — sales, operations, the kind
            of behind-the-scenes systems work that keeps good companies from
            collapsing under their own success. We&apos;ve seen where
            businesses leak, and we built Ops by Noell to plug it. The studio
            is named for our family, and every account gets our attention
            directly. When you sign up, you&apos;re not handed off to a
            support team. You&apos;re working with us.
          </p>
          <p className="mt-6 font-serif italic text-muted-strong text-sm md:text-base">
            If you&apos;d rather talk to a human than read more copy, our door
            is open.
          </p>
          <div className="mt-6">
            <Button href="/book" variant="primary" className="h-11 px-6">
              Book a free 30-minute audit
            </Button>
          </div>
        </div>
      </section>

      {/* 5. Closing — echo founder offer */}
      <section className="w-full px-4 my-16 md:my-20">
        <div className="max-w-5xl mx-auto rounded-[32px] bg-cream-dark/70 border border-warm-border px-6 py-14 md:py-20 text-center">
          <p className="font-serif italic text-xl md:text-3xl text-charcoal leading-snug">
            Right now, we&apos;re looking for ten founding members.
          </p>
          <p className="mt-4 text-sm md:text-base text-charcoal/70">
            Locked pricing, direct access, a real relationship with the team
            building this.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="/agents" variant="primary" className="h-12 px-8">
              See the founding offer &rarr;
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
