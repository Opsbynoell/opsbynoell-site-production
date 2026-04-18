"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { IconMessageCircle, IconX, IconSend } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type Message = {
  from: "agent" | "visitor";
  text: string;
  timestamp?: string;
};

const initialConversation: Message[] = [
  {
    from: "agent",
    text: "Hi, I'm Noell. I pick up when you can't, book when you're busy, and keep clients coming back.",
    timestamp: "now",
  },
];

const starterChips = [
  "I'm missing calls",
  "Book an audit",
  "What does Noell Support do?",
];

// Scripted flow demonstrating the 6 capabilities
const responseFlow: Record<string, Message[]> = {
  "i'm missing calls": [
    {
      from: "agent",
      text: "That's exactly what the Noell system catches. When a call goes unanswered, we auto-text the prospect in under 10 seconds with a booking link.",
    },
    {
      from: "agent",
      text: "To get you a tailored audit, can I grab your name and the best number? I'll route this to Noell for a 30-minute call.",
    },
  ],
  "book an audit": [
    {
      from: "agent",
      text: "Perfect. The audit is free, 30 minutes, and you walk away with a map of where leads are leaking, whether you work with us or not.",
    },
    {
      from: "agent",
      text: "Share your name + best contact number and I'll route this straight to Noell's calendar.",
    },
  ],
  "what does noell support do?": [
    {
      from: "agent",
      text: "I'm Noell Support. I handle first response, qualification, contact capture, routing, and booking-link handoff. Anything I can't resolve I escalate to a human with full context.",
    },
    {
      from: "agent",
      text: "Noell Front Desk is the separate operations layer that handles calls, scheduling, reminders, and reactivation. Want to see an audit of what the Noell system would catch on your site?",
    },
  ],
};

const contactCaptureResponse: Message[] = [
  {
    from: "agent",
    text: "Got it, thanks. I've captured your contact and routed this to Noell. You'll get a text with audit times within the hour. Meanwhile, the booking link is here: www.opsbynoell.com/book",
  },
  {
    from: "agent",
    text: "Anything else I can help with? Otherwise I'll hand off from here.",
  },
];

const DISMISS_KEY = "noell-support-dismissed";

export function NoellSupportChat() {
  const pathname = usePathname();
  const isBookPage = pathname === "/book";
  const isSupportPage = pathname === "/noell-support";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialConversation);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [stage, setStage] = useState<"intro" | "qualified" | "captured">(
    "intro"
  );
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-expand triggers (non-/book pages, respect session dismissal).
  // The widget auto-expands ONLY when the visitor has scrolled past the hero
  // AND at least 8 seconds have elapsed since mount AND they have never
  // dismissed the widget this session. Dismissal is sticky per session.
  useEffect(() => {
    if (isBookPage) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISS_KEY)) return;

    // On the Noell Support spotlight page, seeing the widget in action is the
    // whole point. Keep a short delay so the page can render first, but still
    // respect session dismissal (guarded above).
    if (isSupportPage) {
      const t = setTimeout(() => {
        if (sessionStorage.getItem(DISMISS_KEY)) return;
        setIsOpen(true);
      }, 1400);
      return () => clearTimeout(t);
    }

    let elapsed = false;
    let scrolledPastHero = false;

    const openIfReady = () => {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
      if (!elapsed || !scrolledPastHero) return;
      setIsOpen(true);
    };

    const timer = setTimeout(() => {
      elapsed = true;
      openIfReady();
    }, 8000);

    const onScroll = () => {
      if (scrolledPastHero) return;
      // "Past the hero" ~ one viewport of scroll. Use 85% of innerHeight so
      // tall mobile viewports don't require a full page-length swipe.
      if (window.scrollY >= window.innerHeight * 0.85) {
        scrolledPastHero = true;
        openIfReady();
      }
    };

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return;
      if (sessionStorage.getItem(DISMISS_KEY)) return;
      setIsOpen(true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [isBookPage, isSupportPage, pathname]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const pushResponses = (responses: Message[]) => {
    responses.forEach((response, i) => {
      setTimeout(() => {
        setTyping(true);
        setTimeout(() => {
          setTyping(false);
          setMessages((prev) => [...prev, response]);
        }, 600);
      }, 700 * (i + 1));
    });
  };

  const handleChip = (chip: string) => {
    const userMsg: Message = { from: "visitor", text: chip };
    setMessages((prev) => [...prev, userMsg]);
    const flow = responseFlow[chip.toLowerCase()];
    if (flow) {
      pushResponses(flow);
      setStage("qualified");
    }
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    const userMsg: Message = { from: "visitor", text: inputValue };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    if (stage === "qualified") {
      pushResponses(contactCaptureResponse);
      setStage("captured");
    } else if (stage === "intro") {
      pushResponses([
        {
          from: "agent",
          text: "Got it. To route you to the right place, can I grab your name and best contact number? I'll make sure Noell sees this within the hour.",
        },
      ]);
      setStage("qualified");
    } else {
      pushResponses([
        {
          from: "agent",
          text: "Understood. I've logged this and you'll hear back soon. In the meantime, feel free to book directly at opsbynoell.com/book.",
        },
      ]);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(DISMISS_KEY, "1");
    }
  };

  const launcherMotion = prefersReducedMotion
    ? {}
    : {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { delay: 1, type: "spring" as const, stiffness: 260, damping: 20 },
      };

  // Shared launcher button (orb) used on /book and whenever closed
  const OrbButton = (
    <motion.button
      {...launcherMotion}
      onClick={() => setIsOpen((v) => !v)}
      className={cn(
        "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
        "bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white",
        "shadow-[0px_20px_40px_-10px_rgba(139,111,156,0.45),_0px_8px_16px_-4px_rgba(28,25,23,0.15),_0px_0px_0px_1px_rgba(139,111,156,0.12),_0px_1px_1px_2px_rgba(255,255,255,0.28)_inset]",
        "flex items-center justify-center hover:scale-105 transition-transform"
      )}
      aria-label={isOpen ? "Close Noell Support chat" : "Open Noell Support chat"}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="x"
            initial={prefersReducedMotion ? false : { rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconX size={22} />
          </motion.div>
        ) : (
          <motion.div
            key="msg"
            initial={prefersReducedMotion ? false : { rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <IconMessageCircle size={22} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );

  // Pill launcher (default on non-/book pages when closed)
  const PillButton = (
    <motion.button
      {...launcherMotion}
      onClick={() => setIsOpen(true)}
      className={cn(
        "fixed bottom-6 right-6 z-50 h-11 pl-4 pr-5 rounded-full",
        "bg-cream text-charcoal border-2 border-lilac-dark",
        "shadow-[0px_20px_40px_-10px_rgba(139,111,156,0.35),_0px_8px_16px_-4px_rgba(28,25,23,0.12),_0px_1px_1px_2px_rgba(255,255,255,0.5)_inset]",
        "flex items-center gap-2 text-sm font-medium hover:bg-white transition-colors tap-target"
      )}
      aria-label="Open Noell Support chat"
    >
      <span className="w-6 h-6 rounded-full bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white flex items-center justify-center">
        <IconMessageCircle size={14} />
      </span>
      Have a question? Chat with Noell
    </motion.button>
  );

  return (
    <>
      {/* Launcher: orb on /book, pill everywhere else (when closed). Orb also when open. */}
      {isOpen || isBookPage ? OrbButton : PillButton}

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={
              prefersReducedMotion
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 20, scale: 0.95 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 20, scale: 0.95 }
            }
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: "easeOut" }}
            className={cn(
              "fixed bottom-24 right-6 z-50",
              "w-[380px] max-w-[calc(100vw-3rem)]",
              "rounded-[24px] border border-warm-border bg-cream overflow-hidden",
              "shadow-[0px_95px_27px_0px_rgba(28,25,23,0.00),_0px_61px_24px_0px_rgba(28,25,23,0.04),_0px_34px_21px_0px_rgba(28,25,23,0.10),_0px_15px_15px_0px_rgba(28,25,23,0.16),_0px_4px_8px_0px_rgba(28,25,23,0.20)]",
              "flex flex-col max-h-[580px]"
            )}
          >
            {/* Header pill */}
            <div className="bg-gradient-to-br from-lilac via-lilac-dark to-[#6b4f80] px-5 py-4 flex items-center gap-3 relative">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-white text-sm font-serif font-semibold">
                  N
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Noell Support</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                  <p className="text-[10px] text-white/70">
                    New prospect intake · Online
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/70 hover:text-white tap-target flex items-center justify-center"
                aria-label="Close"
              >
                <IconX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-cream"
            >
              {messages.map((msg, i) => (
                <MessageBubble
                  key={i}
                  msg={msg}
                  prefersReducedMotion={prefersReducedMotion}
                />
              ))}
              {typing && <TypingIndicator />}

              {/* Starter chips */}
              {messages.length === 1 && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {starterChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChip(chip)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white border border-warm-border text-charcoal/70 hover:bg-lilac-light hover:border-lilac-dark hover:text-lilac-dark transition-all"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-white border-t border-warm-border">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 h-10 px-3.5 text-sm bg-cream-dark rounded-[10px] border border-warm-border focus:outline-none focus:border-lilac-dark/60 focus:bg-white text-charcoal placeholder:text-charcoal/40"
                />
                <button
                  onClick={handleSend}
                  className="w-10 h-10 rounded-[10px] bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                  aria-label="Send"
                >
                  <IconSend size={15} />
                </button>
              </div>
              <p className="text-[9px] text-charcoal/40 mt-2 text-center">
                Noell Support handles new-prospect intake. First response,
                qualification, routing, and human handoff.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({
  msg,
  prefersReducedMotion,
}: {
  msg: Message;
  prefersReducedMotion?: boolean;
}) {
  const isAgent = msg.from === "agent";
  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.25 }}
      className={cn("flex", isAgent ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[82%] px-4 py-2.5 text-sm leading-relaxed rounded-[17px]",
          isAgent
            ? "bg-white border border-warm-border text-charcoal rounded-bl-md shadow-sm"
            : "bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white rounded-br-md shadow-md"
        )}
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start"
    >
      <div className="bg-white border border-warm-border rounded-[17px] rounded-bl-md px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-lilac-dark"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
