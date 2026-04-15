"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconMessageCircle, IconX, IconSend } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type Message = {
  from: "nova" | "visitor";
  text: string;
  timestamp?: string;
};

const initialConversation: Message[] = [
  {
    from: "nova",
    text: "Hi, I'm Noell Support, the new-prospect intake layer for Ops by Noell. I can help you get started. Are you looking to book a free audit, ask about our systems, or something else?",
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
      from: "nova",
      text: "That's exactly what the Noell system catches. When a call goes unanswered, we auto-text the prospect in under 10 seconds with a booking link.",
    },
    {
      from: "nova",
      text: "To get you a tailored audit, can I grab your name and the best number? I'll route this to Noell for a 30-minute call.",
    },
  ],
  "book an audit": [
    {
      from: "nova",
      text: "Perfect. The audit is free, 30 minutes, and you walk away with a map of where leads are leaking, whether you work with us or not.",
    },
    {
      from: "nova",
      text: "Share your name + best contact number and I'll route this straight to Noell's calendar.",
    },
  ],
  "what does noell support do?": [
    {
      from: "nova",
      text: "I'm Noell Support. I handle first response, qualification, contact capture, routing, and booking-link handoff. Anything I can't resolve I escalate to a human with full context.",
    },
    {
      from: "nova",
      text: "Noell Front Desk is the separate operations layer that handles calls, scheduling, reminders, and reactivation. Want to see an audit of what the Noell system would catch on your site?",
    },
  ],
};

const contactCaptureResponse: Message[] = [
  {
    from: "nova",
    text: "Got it, thanks. I've captured your contact and routed this to Noell. You'll get a text with audit times within the hour. Meanwhile, the booking link is here: www.opsbynoell.com/book",
  },
  {
    from: "nova",
    text: "Anything else I can help with? Otherwise I'll hand off from here.",
  },
];

export function NovaChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialConversation);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [stage, setStage] = useState<"intro" | "qualified" | "captured">(
    "intro"
  );
  const scrollRef = useRef<HTMLDivElement>(null);

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

    // If at qualified stage, treat next input as contact capture
    if (stage === "qualified") {
      pushResponses(contactCaptureResponse);
      setStage("captured");
    } else if (stage === "intro") {
      // Generic intro response
      pushResponses([
        {
          from: "nova",
          text: "Got it. To route you to the right place, can I grab your name and best contact number? I'll make sure Noell sees this within the hour.",
        },
      ]);
      setStage("qualified");
    } else {
      pushResponses([
        {
          from: "nova",
          text: "Understood. I've logged this and you'll hear back soon. In the meantime, feel free to book directly at opsbynoell.com/book.",
        },
      ]);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
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
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IconX size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="msg"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <IconMessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
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
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white"
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
                <MessageBubble key={i} msg={msg} />
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

function MessageBubble({ msg }: { msg: Message }) {
  const isNova = msg.from === "nova";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex", isNova ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[82%] px-4 py-2.5 text-sm leading-relaxed rounded-[17px]",
          isNova
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
