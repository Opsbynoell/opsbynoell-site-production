const capabilities = [
  {
    number: "01",
    title: "Instant Lead Response",
    status: "Active — avg 8 sec",
    description:
      "When a new lead comes in — from Google, a missed call, or a DM — the system responds in seconds. Text, email, or voice. Before they have time to call your competitor.",
  },
  {
    number: "02",
    title: "Automated Booking & Confirmation",
    status: "Active — 0 no-shows",
    description:
      "Self-serve scheduling that syncs with your calendar, sends confirmations, and follows up before appointments. No-shows drop. Your front desk gets their time back.",
  },
  {
    number: "03",
    title: "Follow-Up & Reactivation",
    status: "Active — 340 contacts re-engaged",
    description:
      "Leads that didn't book get nurtured. Past clients get re-engaged. The system remembers everyone your team forgot — and brings them back.",
  },
  {
    number: "04",
    title: "Review & Reputation Engine",
    status: "Active — 4× review growth",
    description:
      "Happy clients are asked to review at the right moment, on the right platform. Negative feedback is caught privately before it goes public.",
  },
];

export function SystemsSection() {
  return (
    <div className="space-y-6">
      {capabilities.map((cap) => (
        <div
          key={cap.number}
          className="bg-cream/80 border border-charcoal/5 rounded-xl overflow-hidden"
        >
          {/* Interface panel top bar */}
          <div className="flex items-center justify-between px-5 py-2.5 bg-charcoal/[0.02] border-b border-charcoal/5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-charcoal/30">
                {cap.number}
              </span>
              <span className="font-serif text-base text-charcoal">
                {cap.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="font-mono text-[10px] text-charcoal/30 hidden sm:inline">
                {cap.status}
              </span>
            </div>
          </div>
          {/* Content */}
          <div className="px-5 py-4">
            <p className="text-sm text-charcoal/55 leading-relaxed max-w-2xl">
              {cap.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
