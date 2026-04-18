"use client";

/**
 * Reusable chat widget for Noell Front Desk and Noell Care.
 *
 * Modes:
 *   - mode="demo"  — scripted, no backend. For the marketing pages.
 *   - mode="live"  — POSTs to /api/front-desk/message or /api/care/message
 *                    with a clientId provided via script tag data-*.
 *
 * In live mode the widget persists a sessionId in sessionStorage so the
 * conversation survives a page refresh within the same tab. It does
 * NOT write to localStorage — a client never wants their visitor's
 * conversation to leak across browser tabs or devices.
 *
 * White-label: when embedded as a standalone bundle (widget.js) we
 * mount inside a Shadow DOM. In-site React usage skips Shadow DOM
 * because the marketing site owns its own CSS.
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { IconMessageCircle, IconX, IconSend } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export type AgentKind = "support" | "frontDesk" | "care";

interface Message {
  from: "agent" | "visitor";
  text: string;
}

export interface AgentChatWidgetProps {
  agent: AgentKind;
  mode: "demo" | "live";
  clientId?: string;
  greeting: string;
  headerLabel: string;
  headerSubtitle: string;
  accent: "lilac" | "wine" | "sage";
  starterChips?: string[];
  autoOpenOnPath?: string;
  /** Only used in demo mode. */
  scriptedResponses?: Record<string, string[]>;
}

const accentClasses: Record<
  AgentChatWidgetProps["accent"],
  {
    launcher: string;
    header: string;
    visitor: string;
  }
> = {
  lilac: {
    launcher:
      "bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white",
    header:
      "bg-gradient-to-br from-lilac via-lilac-dark to-[#6b4f80]",
    visitor:
      "bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white",
  },
  wine: {
    launcher: "bg-gradient-to-b from-wine to-[#5d2a35] text-white",
    header: "bg-gradient-to-br from-wine to-[#5d2a35]",
    visitor: "bg-gradient-to-b from-wine to-[#5d2a35] text-white",
  },
  sage: {
    launcher: "bg-gradient-to-b from-[#7a9c79] to-[#4f6b4e] text-white",
    header: "bg-gradient-to-br from-[#7a9c79] to-[#4f6b4e]",
    visitor: "bg-gradient-to-b from-[#7a9c79] to-[#4f6b4e] text-white",
  },
};

const endpointFor: Record<AgentKind, string> = {
  support: "/api/support/message",
  frontDesk: "/api/front-desk/message",
  care: "/api/care/message",
};

export function AgentChatWidget(props: AgentChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { from: "agent", text: props.greeting },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const styles = accentClasses[props.accent];

  // Auto-open on the agent's own spotlight page.
  useEffect(() => {
    if (typeof window === "undefined" || !props.autoOpenOnPath) return;
    if (window.location.pathname === props.autoOpenOnPath) {
      const t = setTimeout(() => setIsOpen(true), 1400);
      return () => clearTimeout(t);
    }
  }, [props.autoOpenOnPath]);

  // Restore session id from sessionStorage in live mode.
  useEffect(() => {
    if (props.mode !== "live" || typeof window === "undefined") return;
    const key = `noell:${props.agent}:sessionId`;
    const existing = window.sessionStorage.getItem(key);
    if (existing) setSessionId(existing);
  }, [props.mode, props.agent]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  async function send(message: string) {
    const userMsg: Message = { from: "visitor", text: message };
    setMessages((prev) => [...prev, userMsg]);
    setTyping(true);

    if (props.mode === "demo") {
      const flow =
        props.scriptedResponses?.[message.toLowerCase().trim()] ??
        props.scriptedResponses?.["*"] ?? [
          "Got it — I've logged this. Someone from the team will follow up soon.",
        ];
      for (let i = 0; i < flow.length; i++) {
        await new Promise((r) => setTimeout(r, 700));
        setMessages((prev) => [...prev, { from: "agent", text: flow[i] }]);
      }
      setTyping(false);
      return;
    }

    // Live mode
    if (!props.clientId) {
      setMessages((prev) => [
        ...prev,
        {
          from: "agent",
          text: "Widget misconfigured — missing clientId. Please contact the business.",
        },
      ]);
      setTyping(false);
      return;
    }
    try {
      const res = await fetch(endpointFor[props.agent], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: props.clientId,
          sessionId,
          agent: props.agent,
          channel: "chat",
          from: {},
          message,
        }),
      });
      const data = (await res.json()) as {
        sessionId?: string;
        reply?: string;
        error?: string;
      };
      if (data.sessionId && typeof window !== "undefined") {
        window.sessionStorage.setItem(
          `noell:${props.agent}:sessionId`,
          data.sessionId
        );
        setSessionId(data.sessionId);
      }
      setMessages((prev) => [
        ...prev,
        {
          from: "agent",
          text: data.reply || data.error || "Sorry — lost that one. One sec.",
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          from: "agent",
          text: "Hit a snag reaching the desk. Try again in a moment.",
        },
      ]);
      void e;
    } finally {
      setTyping(false);
    }
  }

  function handleSend() {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    void send(text);
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full",
          styles.launcher,
          "shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        )}
        aria-label={isOpen ? `Close ${props.headerLabel}` : `Open ${props.headerLabel}`}
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
              "shadow-xl flex flex-col max-h-[580px]"
            )}
          >
            <div className={cn("px-5 py-4 flex items-center gap-3", styles.header)}>
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/20">
                <span className="text-white text-sm font-serif font-semibold">N</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {props.headerLabel}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  <p className="text-[10px] text-white/70">
                    {props.headerSubtitle}
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
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.from === "agent" ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[82%] px-4 py-2.5 text-sm leading-relaxed rounded-[17px]",
                      msg.from === "agent"
                        ? "bg-white border border-warm-border text-charcoal rounded-bl-md shadow-sm"
                        : cn(styles.visitor, "rounded-br-md shadow-md")
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-white border border-warm-border rounded-[17px] rounded-bl-md px-4 py-3 flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-charcoal/40"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {messages.length === 1 && props.starterChips && (
                <div className="pt-2 flex flex-wrap gap-2">
                  {props.starterChips.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => void send(chip)}
                      className="text-xs px-3 py-1.5 rounded-full bg-white border border-warm-border text-charcoal/70 hover:bg-lilac-light transition-all"
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
                  className="flex-1 h-10 px-3.5 text-sm bg-cream-dark rounded-[10px] border border-warm-border focus:outline-none text-charcoal placeholder:text-charcoal/40"
                />
                <button
                  onClick={handleSend}
                  className={cn(
                    "w-10 h-10 rounded-[10px] text-white flex items-center justify-center shadow-md",
                    styles.launcher
                  )}
                  aria-label="Send"
                >
                  <IconSend size={15} />
                </button>
              </div>
              <p className="text-xs text-neutral-400 mt-2 px-1">
                By chatting, you agree to our{" "}
                <a href="/privacy" target="_blank" rel="noopener" className="underline">Privacy Policy</a>
                {" "}and{" "}
                <a href="/terms" target="_blank" rel="noopener" className="underline">Terms</a>.
                If you share your phone number, you agree to our{" "}
                <a href="/sms-policy" target="_blank" rel="noopener" className="underline">SMS Policy</a>.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
