import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

const PATH = "/resources/med-spa-client-reactivation";
const TITLE = "How to reactivate lapsed med spa clients";
const DESCRIPTION =
  "Med spa clients don't usually churn because they are unhappy; they churn because they get busy and forget to rebook. Here is how to reactivate lapsed clients without sounding like a desperate sales pitch.";
const PUBLISHED = "2026-06-02";

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
        id="article-med-spa-client-reactivation"
      />
      <ArticleLayout
        eyebrow="Article · 6 min"
        title={TITLE}
        lead="Med spa clients rarely churn because they are angry. They churn because life gets busy, their Botox wears off quietly, and nobody from your office reached out. Here is how to bring them back without sounding like a discount blast."
        meta="Published June 2, 2026 · Ops by Noell"
      >
        <p>
          If you look at the patient roster of a typical med spa that has been open for more than two years, you will usually find a gold mine sitting entirely untouched: the "lapsed" client list.
        </p>
        <p>
          These are patients who came in for neurotoxins, filler, or a laser series, spent $500 to $1,200, had a great experience, and then... just never came back. When we ask owners why these patients left, the assumption is often that they found a cheaper injector or moved away. The reality is usually much more boring: they just forgot to rebook, and your front desk was too busy to remind them.
        </p>

        <h2>The math of the silent churn</h2>
        <p>
          Neurotoxins (Botox, Dysport, etc.) are the financial engine of most med spas because they require a 90-to-120-day cadence. If a patient gets 40 units at $12/unit, that is a $480 ticket. If they maintain that cadence four times a year, they are a $1,920 annual recurring revenue asset.
        </p>
        <p>
          When that patient hits day 130 since their last appointment and hasn't rebooked, you haven't just lost a single $480 visit. You are watching a $2,000 annual asset quietly walk out the door.
        </p>
        <p>
          If your spa has 100 patients currently sitting between day 120 and day 180 since their last visit, you are sitting on roughly $50,000 of unbooked, high-intent revenue.
        </p>

        <h2>Why email blasts don't work for reactivation</h2>
        <p>
          The default industry playbook for a slow month is to export the patient list from the EMR (Zenoti, Boulevard, Jane) and send a mass email offering 15% off filler or $10/unit Botox.
        </p>
        <p>
          This approach fails for two reasons:
        </p>
        <ol>
          <li>
            <strong>It trains your patients to wait for discounts.</strong> If you only reach out when things are on sale, your patients will stop booking at full price.
          </li>
          <li>
            <strong>It ignores the specific treatment cadence.</strong> An email blast goes to everyone at once. It doesn't care that Sarah is exactly 14 weeks out from her last Dysport appointment and is actively looking in the mirror noticing her glabella lines returning.
          </li>
        </ol>

        <h2>The right way to reactivate: Cadence and Context</h2>
        <p>
          Effective reactivation doesn't feel like marketing. It feels like high-end concierge service. It relies on reaching out to the right patient, at the exact right time, with a message specific to what they actually buy.
        </p>
        <p>
          A successful reactivation text looks like this:
        </p>
        <blockquote>
          "Hi Sarah! It's the front desk at [Spa Name]. It's been about 4 months since we saw you last for your Dysport, so you're probably due for a touch-up soon. Did you want me to look for an opening with Jessica next week?"
        </blockquote>
        <p>
          Notice what this message does:
        </p>
        <ul>
          <li>It uses her name.</li>
          <li>It names the specific treatment she gets (Dysport, not a generic "appointment").</li>
          <li>It names her specific injector (Jessica).</li>
          <li>It asks a low-friction question ("Did you want me to look?") rather than demanding she click a link and navigate a booking portal.</li>
          <li>It does not offer a discount.</li>
        </ul>

        <h2>The operational bottleneck</h2>
        <p>
          Every med spa owner agrees that the highly specific, personalized text message works better than the generic email blast. The reason they don't do it is operational: it requires a human being to sit at a computer, pull a report of everyone who is 120 days out, cross-reference their last treatment and provider, and type out 50 individual text messages.
        </p>
        <p>
          Your front desk is too busy checking people out, answering the phone, and flipping rooms to do this consistently. So it gets done once a quarter, or not at all.
        </p>

        <h2>How AI automates the concierge experience</h2>
        <p>
          This is exactly the problem Predictive Customer Intelligence is built to solve. An AI operations layer integrates with your booking system and constantly monitors the cadence of every patient.
        </p>
        <p>
          When Sarah hits day 120 since her last Dysport appointment, the system notices. It drafts the highly specific, personalized text message in your spa's voice, mentioning her specific treatment and her specific provider. It sends the text automatically. When Sarah replies "Yes, next Thursday afternoon?", the AI handles the back-and-forth scheduling and puts her on the calendar.
        </p>
        <p>
          The result is that your lapsed patient list gets actively worked every single day, pulling lost revenue back onto the books, without your front desk ever having to pull a report or type a text message.
        </p>

        <h2>Where to start</h2>
        <p>
          Pull a report from your booking software of every patient who has had neurotoxin in the last 18 months, but has not been in for the last 5 months. That is your immediate reactivation target list.
        </p>
        <p>
          If the size of that list makes you uncomfortable, it's time to automate your retention.
        </p>

        <h2>Related reading</h2>
        <ul>
          <li>
            <Link href="/resources/rebooking-and-reactivation-for-med-spas-and-massage">
              Rebooking and reactivation for med spas and massage
            </Link>
          </li>
          <li>
            <Link href="/verticals/med-spas">
              AI Front Desk for Med Spas
            </Link>
          </li>
          <li>
            <Link href="/resources/missed-calls-to-missed-bookings">
              From missed calls to missed bookings
            </Link>
          </li>
        </ul>
      </ArticleLayout>
    </>
  );
}
