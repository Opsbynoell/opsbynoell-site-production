import { ArticleLayout } from "@/components/article-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

const PATH = "/resources/missed-call-recovery-for-service-businesses";
const TITLE = "Missed-call recovery for service businesses";
const DESCRIPTION =
  "Why the missed call is the most expensive lead you'll ever own, and how a done-for-you AI front desk catches it before the next door opens.";
const PUBLISHED = "2026-04-18";

export const metadata = pageMetadata({
  path: PATH,
  title: TITLE,
  description: DESCRIPTION,
  type: "article",
  publishedTime: PUBLISHED,
});

export default function Article() {
  return (
    <>
      <JsonLd
        data={[
          articleSchema({
            title: TITLE,
            description: DESCRIPTION,
            path: PATH,
            datePublished: PUBLISHED,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Resources", path: "/resources" },
            { name: TITLE, path: PATH },
          ]),
        ]}
        id="article-missed-call"
      />
      <ArticleLayout
        eyebrow="Article · 6 min"
        title="Missed-call recovery for service businesses"
        lead="The missed call is the most expensive lead you'll ever own. Here is what to do about it, without hiring, outsourcing, or taking the phone to bed."
        meta="Published April 18, 2026 · Nikki Noell"
      >
        <p>
          The average service business misses a quarter of its inbound calls.
          Some miss more. Most owners underestimate the number because
          voicemails never get counted, and a busy signal never shows up in a
          report. The math does not care. Every call that rings out is a caller
          who already picked up their phone, already decided to act, and is
          about to call the next name Google shows them.
        </p>

        <h2>The hidden cost of a missed call</h2>
        <p>
          On average, a new-client phone call is worth several hundred dollars
          in immediate revenue, and several thousand in lifetime value. That is
          the cost of a missed call for a salon, a massage practice, a med spa,
          or a dental office. One every other day adds up to a five-figure
          monthly leak, quietly.
        </p>

        <h2>Why the call gets missed</h2>
        <ul>
          <li>You&apos;re with a client and the phone rings.</li>
          <li>It&apos;s 7:41 p.m. and nobody is at the desk.</li>
          <li>It&apos;s Sunday and your voicemail box is full.</li>
          <li>Your receptionist is handling checkout, insurance, or a reschedule.</li>
        </ul>
        <p>
          None of these are failures of the business. They&apos;re the normal
          texture of running a service shop. The fix is not more discipline, a
          better receptionist, or a guiltier owner. The fix is a front desk
          layer that catches the call when the humans can&apos;t.
        </p>

        <h2>What missed-call recovery actually looks like</h2>
        <p>
          A managed front desk layer does three things within seconds of a
          missed call:
        </p>
        <ol>
          <li>
            <strong>Texts the caller back in your voice.</strong> A short,
            warm, human message, not a generic &ldquo;sorry we missed you&rdquo;
            auto-reply.
          </li>
          <li>
            <strong>Offers the next two real time slots.</strong> Pulled from
            your calendar, not a generic link asking them to do the work.
          </li>
          <li>
            <strong>Books them before they call the next name.</strong> The
            booking goes straight back into whatever scheduler you already use.
          </li>
        </ol>

        <h2>Why speed is the whole game</h2>
        <p>
          A caller who gets a response within 60 seconds is roughly ten times
          more likely to stay with you than a caller you return an hour later.
          After 15 minutes, most of them are already on someone else&apos;s
          calendar. The window isn&apos;t the day, or the hour. It&apos;s the
          first minute.
        </p>

        <h2>What this does not replace</h2>
        <p>
          This is not a call center, and it is not a robo-dialer. It does not
          try to sound like a human it is not. It does not interpret clinical
          questions, make pricing promises you wouldn&apos;t make, or push
          customers who say no. It covers the operational gap — the texting,
          the scheduling, the reminders — and hands any genuine conversation
          back to you.
        </p>

        <h2>How to start</h2>
        <p>
          Count your missed calls for one week. If the number is more than two,
          the math already justifies the fix. Book a free audit and we&apos;ll
          map exactly where the leak is and exactly what a done-for-you AI
          front desk would catch.
        </p>
      </ArticleLayout>
    </>
  );
}
