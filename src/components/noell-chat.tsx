"use client";

/**
 * Generic, agent-agnostic chat widget.
 *
 * Accepts any AgentConfig + ClientConfig (+ optional VerticalConfig) and
 * runs the conversation. Zero business logic lives in this file — it is a
 * view layer that drives the core runtime (src/lib/noell-system/core.ts).
 *
 * Any of the three agents (Support, Front Desk, Care) can be rendered
 * simply by passing a different AgentConfig.
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconMessageCircle, IconX, IconSend } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type {
  AgentConfig,
  ClientConfig,
  Message,
  VerticalConfig,
} from "@/lib/noell-system/types";
import {
  initialState,
  step,
  interpolateMessage,
  type ConversationState,
} from "@/lib/noell-system/core";

// ---------------------------------------------------------------------------
// Theme tokens per agent launcher color
// ---------------------------------------------------------------------------

const launcherTheme: Record<AgentConfig["identity"]["launcherColor"], string> = {
  lilac:
    "bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] shadow-[0px_20px_40px_-10px_rgba(139,111,156,0.45),_0px_8px_16px_-4px_rgba(28,25,23,0.15),_0px_0px_0px_1px_rgba(139,111,156,0.12),_0px_1px_1px_2px_rgba(255,255,255,0.28)_inset]",
  wine:
    "bg-gradient-to-b from-wine-light via-wine to-wine-dark shadow-[0px_20px_40px_-10px_rgba(107,45,62,0.45),_0px_8px_16px_-4px_rgba(28,25,23,0.15),_0px_0px_0px_1px_rgba(107,45,62,0.12),_0px_1px_1px_2px_rgba(255,255,255,0.28)_inset]",
  blush:
    "bg-gradient-to-b from-blush to-blush-dark shadow-[0px_20px_40px_-10px_rgba(199,156,164,0.35),_0px_8px_16px_-4px_rgba(28,25,23,0.15),_0px_0px_0px_1px_rgba(199,156,164,0.18),_0px_1px_1px_2px_rgba(255,255,255,0.35)_inset] text-wine",
};

const visitorBubbleTheme: Record<AgentConfig["identity"]["launcherColor"], string> = {
  lilac:
    "bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white",
  wine: "bg-gradient-to-b from-wine-light via-wine to-wine-dark text-white",
  blush: "bg-gradient-to-b from-blush to-blush-dark text-wine",
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export type NoellChatProps = {
  agent: AgentConfig;
  client: ClientConfig;
  vertical?: VerticalConfig;
  /** If true, the floating launcher is rendered. Default true. */
  floating?: boolean;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NoellChat({ agent, client, vertical, floating = true }: NoellChatProps) {
  // Vertical may override starter chips for this agent
  const starterChips =
    vertical?.starterChipPresets?.[agent.identity.id] ?? agent.starterChips;

  const greeting = interpolateMessage(agent.greeting, client);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [state, setState] = useState<ConversationState>(initialState());
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

  const advance = (visitorInput: string) => {
    const visitorMsg: Message = { from: "visitor", text: visitorInput };
    setMessages((prev) => [...prev, visitorMsg]);

    const result = step({ agent, client, state, visitorInput });
    pushResponses(result.agentResponses);
    setState(result.nextState);

    // Side-effect hooks for host app integration
    if (result.sideEffect?.kind === "capture") {
      // TODO: POST to client.webhooks.onCapture
    } else if (result.sideEffect?.kind === "escalate") {
      // TODO: POST to client.webhooks.onEscalate
    } else if (result.sideEffect?.kind === "route") {
      // TODO: hand off per target (booking_link / human / workflow)
    }
  };

  const handleChip = (chip: string) => advance(chip);
  const handleSend = () => {
    if (!inputValue.trim()) return;
    const text = inputValue;
    setInputValue("");
    advance(text);
  };

  const headerGradient = launcherTheme[agent.identity.launcherColor];
  const visitorBubble = visitorBubbleTheme[agent.identity.launcherColor];

  return (
    <>
      {floating && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full text-white",
            "flex items-center justify-center hover:scale-105 transition-transform",
            headerGradient
          )}
          aria-label={
            isOpen
              ? `Close ${agent.identity.displayName} chat`
              : `Open ${agent.identity.displayName} chat`
          }
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
      )}

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
            <div
              className={cn(
                "px-5 py-4 flex items-center gap-3 relative",
                headerGradient
              )}
            >
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <span className="text-white text-sm font-serif font-semibold">
                  {agent.identity.initial}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {agent.identity.displayName}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
                  <p className="text-[10px] text-white/70">
                    {agent.identity.eyebrow} · Online
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

            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-cream"
            >
              {messages.map((msg, i) => (
                <MessageBubble key={i} msg={msg} visitorBubble={visitorBubble} />
              ))}
              {typing && <TypingIndicator color={agent.identity.launcherColor} />}

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
                  className={cn(
                    "w-10 h-10 rounded-[10px] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md",
                    headerGradient
                  )}
                  aria-label="Send"
                >
                  <IconSend size={15} />
                </button>
              </div>
              <p className="text-[9px] text-charcoal/40 mt-2 text-center">
                {agent.identity.displayName} — {agent.identity.persona}.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function MessageBubble({
  msg,
  visitorBubble,
}: {
  msg: Message;
  visitorBubble: string;
}) {
  const isAgent = msg.from === "agent";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("flex", isAgent ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[82%] px-4 py-2.5 text-sm leading-relaxed rounded-[17px]",
          isAgent
            ? "bg-white border border-warm-border text-charcoal rounded-bl-md shadow-sm"
            : `${visitorBubble} rounded-br-md shadow-md`
        )}
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

function TypingIndicator({
  color,
}: {
  color: AgentConfig["identity"]["launcherColor"];
}) {
  const dotColor =
    color === "wine" ? "bg-wine" : color === "blush" ? "bg-blush-dark" : "bg-lilac-dark";
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
            className={cn("w-1.5 h-1.5 rounded-full", dotColor)}
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
