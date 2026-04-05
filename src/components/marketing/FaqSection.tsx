"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSectionProps = {
  items: FaqItem[];
  headline?: string;
};

export function FaqSection({ items, headline }: FaqSectionProps) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {headline && (
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] tracking-tight mb-8 text-center">
            {headline}
          </h2>
        )}
        <Accordion.Root type="single" collapsible className="flex flex-col gap-2">
          {items.map((item, i) => (
            <Accordion.Item
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-[#E8E8E8] bg-[#FAFAF9] overflow-hidden"
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className={cn(
                    "flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-[#1A1A1A]",
                    "hover:bg-white transition-colors duration-150",
                    "data-[state=open]:bg-white",
                    "[&>svg]:transition-transform [&>svg]:duration-200 [&[data-state=open]>svg]:rotate-45"
                  )}
                >
                  {item.question}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                    className="flex-shrink-0 ml-4 text-[#717171]"
                    aria-hidden
                  >
                    <path
                      d="M7 1v12M1 7h12"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-5 pb-4 text-sm leading-relaxed text-[#4A4A4A] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                {item.answer}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
