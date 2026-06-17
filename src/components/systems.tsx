import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconBolt, IconPhoneCall, IconHeartHandshake } from "@tabler/icons-react";

interface AgentCard {
  title: string;
  slug: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const agents: AgentCard[] = [
  {
    title: "Answers your phone",
    slug: "front-desk",
    description:
      "Picks up every call, day or night. Books the appointment, answers the common questions, and never sends a new client to voicemail.",
    href: "/noell-front-desk",
    icon: <IconPhoneCall size={22} />,
  },
  {
    title: "Texts back missed calls",
    slug: "support",
    description:
      "The moment a call goes unanswered, it texts the caller back within seconds with real open times, so they book with you instead of the next business on Google.",
    href: "/noell-support",
    icon: <IconBolt size={22} />,
  },
  {
    title: "Follows up and fills cancellations",
    slug: "care",
    description:
      "Reminds clients so they actually show up, reactivates the ones who drifted, and fills last-minute cancellations from your existing client list.",
    href: "/noell-care",
    icon: <IconHeartHandshake size={22} />,
  },
];

export function Systems() {
  return (
    <section id="systems" className="w-full py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-strong mb-4">
            What the system does for you
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-cream leading-tight">
            Three jobs, handled.{" "}
            <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
              Zero setup on your end.
            </span>
          </h2>
          <p className="mt-5 text-cream/75 max-w-2xl mx-auto leading-relaxed">
            Your phone gets answered. Missed calls get texted back. Your clients
            get followed up with. All running in the background while you work.
            Start with the part you need. Add more when you are ready.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((agent, index) => (
            <Link
              key={index}
              href={agent.href}
              data-event="systems_grid_click"
              data-source-page="home"
              data-source-section="systems_grid"
              data-agent={agent.slug}
              className={cn(
                "group relative rounded-[22px] border border-wine/20 bg-[#271520] shadow-[0_0_0_1px_rgba(139,42,66,0.10),0_8px_32px_rgba(139,42,66,0.06)]",
                "p-5 sm:p-7 md:p-8 transition-all duration-200",
                "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]",
                "hover:-translate-y-1 hover:shadow-[0px_44px_24px_0px_rgba(28,25,23,0.06),0px_18px_18px_0px_rgba(28,25,23,0.08),0px_6px_10px_0px_rgba(28,25,23,0.06)]"
              )}
            >
              <div className="w-12 h-12 rounded-xl bg-wine/10 text-wine flex items-center justify-center mb-4 md:mb-6 mx-auto md:mx-0">
                {agent.icon}
              </div>
              <h3 className="font-serif text-2xl font-semibold text-cream mb-3 text-center md:text-left">
                {agent.title}
              </h3>
              <p className="text-sm text-cream/80 leading-relaxed text-center md:text-left">
                {agent.description}
              </p>
              <div className="mt-4 pt-3 md:mt-6 md:pt-4 border-t border-white/10 flex items-center justify-center md:justify-end">
                <p className="text-sm text-[#C45A2A] font-medium group-hover:text-[#D96B38] transition-colors">
                  Learn more &rarr;
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
