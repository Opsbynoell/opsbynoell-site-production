/**
 * A single clean "missed call → instant text-back → booked" visual for the
 * mobile hero. One calm card (not the multi-card mockup), on-message with the
 * missed-call recovery story.
 */
export function TextbackCard() {
  return (
    <div className="mx-auto w-full max-w-sm rounded-3xl border border-white/10 bg-[#241019]/90 backdrop-blur-sm p-4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-cream/55">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C45A2A]" />
          Missed call · new client
        </span>
        <span className="text-[11px] text-cream/40">9:14 AM</span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="self-start max-w-[82%] rounded-2xl rounded-bl-md bg-[#3a2230] px-3.5 py-2 text-[13px] leading-snug text-cream/90">
          Hi, are you taking new clients?
        </div>
        <div className="self-end max-w-[88%] rounded-2xl rounded-br-md bg-gradient-to-b from-[#8B2A42] to-[#6B2D3E] px-3.5 py-2 text-[13px] leading-snug text-cream">
          Hi! Sorry we missed you — I can get you in Tue 2pm or Wed 10am. Which
          works?
        </div>
        <div className="self-start max-w-[82%] rounded-2xl rounded-bl-md bg-[#3a2230] px-3.5 py-2 text-[13px] leading-snug text-cream/90">
          Tuesday 2pm, thank you!
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
        <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#C45A2A] text-[10px] font-bold text-white">
          ✓
        </span>
        <span className="text-[12px] font-medium text-[#E0A43B]">
          Booked in under a minute — while you were with a client.
        </span>
      </div>
    </div>
  );
}
