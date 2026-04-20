"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconPlus } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { trackMetaCustomEvent } from "@/lib/meta-pixel-track";

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  group?: string;
}

const defaultFaqs: FaqItem[] = [
  {
    question: "Is this month-to-month or contract?",
    answer:
      "Month-to-month. No long-term contracts. Cancel anytime with 30 days notice.",
  },
  {
    question: "Why a setup fee?",
    answer:
      "The setup fee covers installation, copy calibration for your voice, system integration, and two rounds of tuning before go-live. It's one-time, disclosed up front, and included in the audit conversation.",
  },
  {
    question: "Do prices increase over time?",
    answer:
      "Existing clients are grandfathered into their signup price. Any future pricing changes only apply to new accounts.",
  },
  {
    question: "How long until the system is live?",
    answer:
      "Most practices are fully live within 14 days of signing. Install is handled by us, you do not configure the system yourself. We migrate existing contacts, write the copy, and train the workflows in your voice.",
  },
  {
    question: "Do I need to replace my current booking tool?",
    answer:
      "No. We integrate with the major scheduling platforms (Calendly, Acuity, Vagaro, and similar). The Noell system layers on top with smart booking logic, missed-call recovery, reminders, and review capture.",
  },
  {
    question: "What does \"managed\" actually mean?",
    answer:
      "We monitor the automations weekly, tune the copy and cadence, handle escalations, and give you a simple monthly report. You don't touch the dashboard unless you want to.",
  },
  {
    question: "Is Noell Support really an AI receptionist?",
    answer:
      "No, and we are careful about that. Noell Support handles new-prospect intake. First response, qualification, contact capture, routing, and booking-link handoff, then escalates to you. Noell Front Desk is the separate operations layer that handles calls, scheduling, reminders, and reactivation.",
  },
  {
    question: "What if it does not work for my business?",
    answer:
      "If the system is not recovering more than it costs you within 60 days of going live, we keep working on it free of charge until it does. The system is either paying for itself or we are not doing our job.",
  },
];

export function FAQ({
  eyebrow = "Questions",
  headlineStart = "Straight",
  headlineAccent = "answers.",
  body = "No sales theater. These are the real questions we get before someone books an audit.",
  faqs = defaultFaqs,
  accent = "wine",
}: {
  eyebrow?: string;
  headlineStart?: string;
  headlineAccent?: string;
  body?: string;
  faqs?: FaqItem[];
  accent?: "wine" | "lilac";
}) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set([0]));

  function toggle(index: number) {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
        const faq = faqs[index];
        if (faq?.id) {
          trackMetaCustomEvent("faq_open", {
            question_id: faq.id,
            question_group: faq.group,
          });
        }
      }
      return next;
    });
  }

  const accentText = accent === "wine" ? "text-wine" : "text-lilac-dark";
  const accentGrad =
    accent === "wine"
      ? "from-wine to-wine-light"
      : "from-lilac-dark to-lilac";

  return (
    <section className="w-full py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <p
            className={cn(
              "text-[11px] uppercase tracking-[0.25em] mb-4",
              accentText
            )}
          >
            {eyebrow}
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold text-charcoal mb-4">
            {headlineStart}{" "}
            <span
              className={cn(
                "bg-gradient-to-b bg-clip-text text-transparent italic",
                accentGrad
              )}
            >
              {headlineAccent}
            </span>
          </h2>
          <p className="text-charcoal/60 max-w-2xl mx-auto">{body}</p>
        </div>

        <div className="space-y-3 rounded-[22px] bg-warm-border/40 p-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-[17px] border border-warm-border bg-gradient-to-b from-white via-cream to-white shadow-[0px_61px_24px_0px_rgba(28,25,23,0.00),_0px_34px_21px_0px_rgba(28,25,23,0.04),_0px_15px_15px_0px_rgba(28,25,23,0.06),_0px_4px_8px_0px_rgba(28,25,23,0.08)] overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full px-6 py-5 flex items-center gap-3 text-left tap-target"
              >
                <motion.div
                  initial={false}
                  animate={{ rotate: openSet.has(index) ? 45 : 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <IconPlus size={20} className={accentText} />
                </motion.div>
                <span className="text-base md:text-lg text-charcoal font-medium">
                  {faq.question}
                </span>
              </button>
              <AnimatePresence mode="sync">
                {openSet.has(index) && (
                  <motion.div
                    key={`content-${index}`}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: {
                        height: "auto",
                        opacity: 1,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 40,
                        },
                      },
                      collapsed: {
                        height: 0,
                        opacity: 0,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 40,
                        },
                      },
                    }}
                    className="px-6 overflow-hidden"
                  >
                    <div className="pb-5 pl-8">
                      <p className="text-charcoal/70 leading-relaxed text-sm md:text-base">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
