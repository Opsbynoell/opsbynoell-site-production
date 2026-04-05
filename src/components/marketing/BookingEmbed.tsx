import { calendarEmbed } from "@/content/book";

export function BookingEmbed() {
  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-medium text-[#717171] mb-6">
          {calendarEmbed.helperLine}
        </p>

        {calendarEmbed.embedUrl ? (
          <div className="w-full rounded-2xl overflow-hidden border border-[#E8E8E8]" style={{ minHeight: 600 }}>
            <iframe
              src={calendarEmbed.embedUrl}
              width="100%"
              height="700"
              frameBorder="0"
              title="Book a free audit"
              className="w-full"
            />
          </div>
        ) : (
          /* Placeholder — swap when embed URL is configured */
          <div className="rounded-2xl border-2 border-dashed border-[#E8E8E8] bg-[#FAFAF9] flex items-center justify-center py-24">
            <div className="text-center px-8">
              <p className="text-sm font-semibold text-[#1A1A1A]">
                Calendar coming soon
              </p>
              <p className="mt-1 text-xs text-[#717171]">
                Configure <code className="font-mono text-[10px] bg-[#F0F0F0] px-1.5 py-0.5 rounded">calendarEmbed.embedUrl</code> in{" "}
                <code className="font-mono text-[10px] bg-[#F0F0F0] px-1.5 py-0.5 rounded">src/content/book.ts</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
