import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { IconBolt, IconPhoneCall, IconHeartHandshake } from "@tabler/icons-react";

interface AgentCard {
  title: string;
  handle: string;
  eyebrow: string;
  description: string;
  uptime: string;
  href: string;
  icon: React.ReactNode;
}

const agents: AgentCard[] = [
  {
    title: "Noell Support",
    handle: "@noell_support",
    eyebrow: "New prospect intake",
    description:
      "Website chat, lead qualification, contact capture, and triage to booking or your team.",
    uptime: "status: online / 24/7",
    href: "/noell-support",
    icon: <IconBolt size={22} />,
  },
  {
    title: "Noell Front Desk",
    handle: "@noell_frontdesk",
    eyebrow: "Operations layer",
    description:
      "Calls, scheduling, reminders, confirmations, reschedules, review capture, reactivation, and everything a receptionist handles.",
    uptime: "status: online / runs during hours",
    href: "/noell-front-desk",
    icon: <IconPhoneCall size={22} />,
  },
  {
    title: "Noell Care",
    handle: "@noell_care",
    eyebrow: "Existing client support",
    description:
      "Rebooking, service questions, account help, and support for clients already in your system. Keeps your front desk clear for new business.",
    uptime: "status: online / existing clients",
    href: "/noell-care",
    icon: <IconHeartHandshake size={22} />,
  },
];

export function Systems() {
  return (
    <section id="systems" className="w-full py-20 md:py-28 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-wine">
              the noell system / agent roster
            </p>
          </div>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal leading-tight">
            Three agents. One system.{" "}
            <span className="italic bg-gradient-to-b from-wine to-wine-light bg-clip-text text-transparent">
              Zero setup on your end.
            </span>
          </h2>
          <p className="mt-5 text-charcoal/75 max-w-2xl mx-auto leading-relaxed">
            Your leads get qualified instantly. Your phone gets answered. Your
            clients get taken care of. All running in the background while you
            work. Start with the layer you need. Expand when you are ready.
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
              data-agent={agent.handle.replace(/^@/, "")}
              className={cn(
                "group relative rounded-[22px] border border-warm-border bg-white",
                "p-7 md:p-8 transition-all duration-200",
                "shadow-[0px_34px_21px_0px_rgba(28,25,23,0.04),0px_15px_15px_0px_rgba(28,25,23,0.06),0px_4px_8px_0px_rgba(28,25,23,0.05)]",
                "hover:-translate-y-1 hover:shadow-[0px_44px_24px_0px_rgba(28,25,23,0.06),0px_18px_18px_0px_rgba(28,25,23,0.08),0px_6px_10px_0px_rgba(28,25,23,0.06)]"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-wine/10 text-wine flex items-center justify-center">
                  {agent.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-[10px] font-mono text-charcoal/70">
                    0{index + 1}
                  </span>
                </div>
              </div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-wine/70 mb-1">
                {agent.eyebrow}
              </p>
              <h3 className="font-serif text-2xl font-semibold text-charcoal mb-1">
                {agent.title}
              </h3>
              <p className="font-mono text-[10px] text-charcoal/70 mb-3">
                {agent.handle}
              </p>
              <p className="text-sm text-charcoal/80 leading-relaxed">
                {agent.description}
              </p>
              <div className="mt-6 pt-4 border-t border-warm-border flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-widest text-charcoal/70">
                  {agent.uptime}
                </p>
                <p className="text-xs text-wine font-medium opacity-70 group-hover:opacity-100 transition-opacity">
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
