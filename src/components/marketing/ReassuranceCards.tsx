import { reassuranceCards, callTestimonialLine } from "@/content/book";

export function ReassuranceCards() {
  return (
    <section className="py-12 bg-[#FAFAF9] border-t border-[#F0F0F0]">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {reassuranceCards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl bg-white border border-[#E8E8E8] p-5"
            >
              <h3 className="text-sm font-semibold text-[#1A1A1A]">
                {card.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#4A4A4A]">
                {card.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[#717171] italic">
          {callTestimonialLine}
        </p>
      </div>
    </section>
  );
}
