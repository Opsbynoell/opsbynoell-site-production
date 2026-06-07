import Link from "next/link";

export function VerticalAgentsCallout() {
  return (
    <section className="w-full px-4 py-8 md:py-10">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-[16px] bg-[#1F1219] border-l-[3px] border-wine p-5 md:p-6 shadow-[0px_4px_12px_0px_rgba(28,25,23,0.04)]">
          <p className="text-[10px] uppercase tracking-[0.25em] text-cream/60 font-medium mb-2">
            New · Self-serve option
          </p>
          <p className="text-sm md:text-base text-cream/85 leading-relaxed">
            Want just the AI agents without the full system? See Noell Agents at $397/mo.{" "}
            <Link
              href="/agents"
              className="text-wine hover:text-wine-dark font-medium underline underline-offset-4 decoration-wine/30 whitespace-nowrap"
            >
              Learn more &rarr;
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
