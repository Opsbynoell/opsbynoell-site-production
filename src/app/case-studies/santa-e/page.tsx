import { ArticleLayout } from "@/components/article-layout";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  caseStudySchema,
  servicePageSchema,
} from "@/lib/schema";

const PATH = "/case-studies/santa-e";
const TITLE = "Santa E., massage therapist — $960 recovered in 14 days";
const DESCRIPTION =
  "How one solo massage therapist in Orange County recovered four missed calls and rebooked them within 14 days of installing a done-for-you AI front desk.";
const PUBLISHED = "2026-04-18";

export const metadata = pageMetadata({
  path: PATH,
  title: "Santa E. case study — $960 recovered in 14 days",
  description: DESCRIPTION,
  type: "article",
  publishedTime: PUBLISHED,
});

export default function CaseStudy() {
  return (
    <>
      <JsonLd
        data={[
          caseStudySchema({
            title: TITLE,
            description: DESCRIPTION,
            path: PATH,
            datePublished: PUBLISHED,
            about: "AI front desk for massage therapy practices",
          }),
          servicePageSchema({
            name: "AI front desk for massage therapists",
            description:
              "Missed-call recovery, confirmations, and quiet retention for solo and small-team massage practices.",
            path: "/verticals/massage",
            vertical: "massage therapy practices",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Case studies", path: "/case-studies/santa-e" },
            { name: "Santa E. — massage therapist", path: PATH },
          ]),
        ]}
        id="case-santa-e"
      />
      <ArticleLayout
        eyebrow="Case study · 4 min"
        title="Santa E., massage therapist — $960 recovered in 14 days"
        lead="A solo practitioner. Four missed calls the old way would have eaten. All four rebooked within 14 days of install."
        meta="Orange County, CA · Solo massage practice · 14-day result"
      >
        <p>
          Santa, owner of Healing Hands by Santa, has run a solo licensed
          massage practice in Orange County for almost a decade. Most of her
          calendar is regulars, but her growth engine has always been
          new-client intent from Google and word of mouth. Until install, that
          intent lived and died on voicemail. In session with a client, phone
          ringing in the next room — by the time she could call back, the
          caller had already booked somewhere else.
        </p>

        <h2>The problem, in her words</h2>
        <blockquote>
          <p>
            &ldquo;I&apos;d see the missed call notification on my break and
            feel sick. I knew most of them were gone by the time I called
            back.&rdquo;
          </p>
        </blockquote>

        <h2>What we installed</h2>
        <ul>
          <li>
            Missed-call recovery layered on top of her existing booking tool.
            Every missed call triggers a text-back in her voice within 30
            seconds.
          </li>
          <li>
            Two real open slots surfaced automatically based on her live
            calendar, not a generic &ldquo;book here&rdquo; link.
          </li>
          <li>
            A confirmation and day-before reminder cadence to protect the
            booking once it landed.
          </li>
        </ul>

        <h2>The first missed call</h2>
        <p>
          Saturday, 11:42 a.m. New client search, no voicemail left. The
          system texted back 8 seconds later:
        </p>
        <blockquote>
          <p>
            &ldquo;Hi Santa, sorry I missed you. I can get you in Saturday 2pm
            or 3pm. Which works?&rdquo;
          </p>
        </blockquote>
        <p>
          The reply came back inside of four minutes: &ldquo;2pm please.&rdquo;
          That single recovered booking was a $180 deep tissue appointment for
          a client who has since rebooked twice.
        </p>

        <h2>The fourteen-day result</h2>
        <ul>
          <li>Four new-client missed calls caught by the text-back layer.</li>
          <li>All four rebooked inside the same week.</li>
          <li>$960 in recovered revenue, net.</li>
          <li>
            Zero additional work for Santa. No dashboard, no configuration, no
            &ldquo;training the AI.&rdquo;
          </li>
        </ul>

        <h2>What made the recovery possible</h2>
        <p>
          Santa did not need another dashboard. She needed a system that
          could catch missed intent, respond quickly, and protect her
          calendar while she was with clients.
        </p>
        <ul>
          <li>
            <strong>Noell Support</strong> — captured and qualified missed
            inbound intent.
          </li>
          <li>
            <strong>Noell Front Desk</strong> — helped turn missed calls into
            booked appointments.
          </li>
          <li>
            <strong>Noell Care</strong> — protected existing-client
            follow-up and rebooking.
          </li>
          <li>
            <strong>Predictive Customer Intelligence</strong> — identified
            the patterns that should become recovery signals.
          </li>
        </ul>

        <h2>What Santa kept</h2>
        <p>
          Santa still runs her practice herself. She still takes real calls
          when she is free. The AI front desk layer just catches the calls she
          can&apos;t physically answer, and then gets out of the way.
        </p>

        <h2>What this proves</h2>
        <p>
          Missed-call recovery is not a theoretical lift. For a solo
          practitioner with a tight calendar, catching four calls in two weeks
          is the difference between a slow month and a full one. The system
          paid for itself in week one.
        </p>
      </ArticleLayout>
    </>
  );
}
