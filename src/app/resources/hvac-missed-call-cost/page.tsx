import Link from "next/link";
import { ArticleLayout } from "@/components/article-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";

const PATH = "/resources/hvac-missed-call-cost";
const TITLE = "How much does a missed call cost an HVAC company?";
const DESCRIPTION =
  "For an HVAC contractor, a missed call is not a $150 missed appointment. It is a $5,000 install going to the next name on Google. Here is the math on what unanswered calls actually cost in the trades.";
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
        id="article-hvac-missed-call-cost"
      />
      <ArticleLayout
        eyebrow="Article · 6 min"
        title={TITLE}
        lead="For an HVAC contractor, a missed call is not a $150 missed appointment. It is a $5,000 install going to the next name on Google. Here is the math on what unanswered calls actually cost in the trades."
        meta="Published June 2, 2026 · Ops by Noell"
      >
        <p>
          When we audit a salon or a massage therapist, we talk about the compounding cost of a $120 missed appointment. When we audit an HVAC company, the conversation is entirely different. The volume of calls might be lower, but the stakes of each ring are exponentially higher.
        </p>
        <p>
          In the trades, a missed call is rarely someone calling to ask about your hours. It is someone standing in a 90-degree house in July, or a 50-degree house in January, holding their phone. They are not comparison shopping. They are calling down the list on Google Maps until someone says, "We can have a tech out there this afternoon."
        </p>

        <h2>The math on a single missed call</h2>
        <p>
          Let's look at the actual numbers for a residential HVAC contractor. The average service call (a repair or tune-up) typically runs between $250 and $400. The average full system replacement runs between $5,000 and $8,000.
        </p>
        <p>
          If your close rate on service calls is 60%, and one out of every ten service calls turns into a full system replacement, the blended value of a single dispatched tech is roughly $800 to $1,000.
        </p>
        <p>
          When your office manager steps away from her desk at 2:15 p.m., or when a call comes in at 6:30 p.m. after the office has closed, you aren't missing a conversation. You are missing a $1,000 average-value job. If you miss just three of those calls a week, that is <strong>$150,000 a year in gross revenue</strong> quietly handed to the company down the street.
        </p>

        <h2>Why HVAC calls get missed</h2>
        <p>
          The leak in an HVAC office usually happens in one of three places:
        </p>
        <ul>
          <li>
            <strong>The summer/winter spike.</strong> Your call volume triples during the first heat wave of July or the first freeze of November. Your office staff stays the same size. The lines get backed up, calls go to voicemail, and the customer hangs up to call someone else.
          </li>
          <li>
            <strong>After-hours emergencies.</strong> A unit dies at 7:00 p.m. on a Friday. Most companies route these to an answering service that takes a message and pages an on-call tech. If the answering service takes too long to pick up, or the tech takes too long to call back, the customer moves on.
          </li>
          <li>
            <strong>The "one person" bottleneck.</strong> In smaller shops, one person handles dispatch, customer service, and billing. When they are on the phone with a difficult customer for 15 minutes, every other call during that window goes to voicemail.
          </li>
        </ul>

        <h2>The answering service gap</h2>
        <p>
          Many HVAC companies try to solve this with a traditional live answering service. The problem is that an answering service is fundamentally a message-taking operation. They cannot answer technical questions, they cannot give accurate arrival windows, and they often sound like exactly what they are: a call center reading a script.
        </p>
        <p>
          More importantly, the speed-to-lead is still broken. The answering service takes the message, pages your tech, and the tech has to call the customer back. In the 15 minutes that process takes, the customer has often already booked with a competitor who answered the phone directly.
        </p>

        <h2>What automated missed call recovery looks like in the trades</h2>
        <p>
          Fixing the leak doesn't mean hiring three more dispatchers just for the summer rush. It means ensuring that every inbound call gets an immediate, actionable response, even if the office is slammed or closed.
        </p>
        <p>
          A managed AI front desk handles this differently than an answering service:
        </p>
        <ol>
          <li>
            <strong>Immediate text-back.</strong> Within 60 seconds of a missed call, the customer receives a text: "Hi, this is Ops Heating & Air. We're on the other line but can help right away. Is this an emergency or routine maintenance?"
          </li>
          <li>
            <strong>Triage and routing.</strong> The AI categorizes the response. If it's routine maintenance, it offers two booking windows for next week. If it's an emergency, it immediately escalates the thread to the on-call tech's phone.
          </li>
          <li>
            <strong>After-hours coverage.</strong> The system runs 24/7. The 8:00 p.m. call gets the same immediate response and triage as the 10:00 a.m. call.
          </li>
        </ol>

        <h2>The bottom line</h2>
        <p>
          In the trades, speed is the only competitive advantage that matters when a system goes down. The company that responds first gets the dispatch fee, and the company that gets the dispatch fee gets the eventual replacement job.
        </p>
        <p>
          If you are missing even a handful of calls a week during your busy season, the math is brutal. Closing that gap is the fastest way to add top-line revenue without spending another dollar on marketing.
        </p>

        <h2>Related reading</h2>
        <ul>
          <li>
            <Link href="/resources/missed-call-recovery-for-service-businesses">
              Missed-call recovery for service businesses
            </Link>
          </li>
          <li>
            <Link href="/resources/ai-front-desk-vs-answering-service">
              AI front desk vs. answering service: cost and coverage compared
            </Link>
          </li>
          <li>
            <Link href="/verticals/hvac">
              AI Front Desk for HVAC Contractors
            </Link>
          </li>
        </ul>
      </ArticleLayout>
    </>
  );
}
