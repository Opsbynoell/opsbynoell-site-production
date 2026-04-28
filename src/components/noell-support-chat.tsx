"use client";

import { useState, useRef, useEffect, useCallback } from "react";
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

const DISMISS_KEY = "noell-support-dismissed";
const SESSION_KEY = "noell-support-session-id";
const CLIENT_ID = "opsbynoell";

// Lightweight phone capture so the agent can recognize/escalate properly.
// Pulled from sessionStorage and mirrored back to it once we have it.
const VISITOR_NAME_KEY = "noell-support-visitor-name";
const VISITOR_PHONE_KEY = "noell-support-visitor-phone";

function loadVisitor(): { name?: string; phone?: string } {
  if (typeof window === "undefined") return {};
  return {
    name: sessionStorage.getItem(VISITOR_NAME_KEY) ?? undefined,
    phone: sessionStorage.getItem(VISITOR_PHONE_KEY) ?? undefined,
  };
}

function saveVisitor(v: { name?: string; phone?: string }) {
  if (typeof window === "undefined") return;
  if (v.name) sessionStorage.setItem(VISITOR_NAME_KEY, v.name);
  if (v.phone) sessionStorage.setItem(VISITOR_PHONE_KEY, v.phone);
}

// Heuristic phone/name extraction from free-text. The agent itself does
// the qualifying — this is just so we can attach what we can detect to
// the API payload for contact lookup + escalation alerts.
function extractContact(text: string): { name?: string; phone?: string } {
  const out: { name?: string; phone?: string } = {};
  const phoneMatch = text.match(
    /(\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/
  );
  if (phoneMatch) {
    const digits = phoneMatch[0].replace(/\D/g, "");
    if (digits.length === 10) out.phone = `+1${digits}`;
    else if (digits.length === 11 && digits.startsWith("1"))
      out.phone = `+${digits}`;
  }
  // "my name is X" / "I'm X" / "this is X"
  const nameMatch = text.match(
    /\b(?:my name is|i'?m|this is|name'?s)\s+([A-Z][a-zA-Z'-]{1,20}(?:\s+[A-Z][a-zA-Z'-]{1,20})?)/i
  );
  if (nameMatch) out.name = nameMatch[1];
  return out;
}

export function NoellSupportChat() {
  const pathname = usePathname();
  const isBookPage = pathname === "/book";
  const isSupportPage = pathname === "/noell-support";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialConversation);
  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);
  const [sending, setSending] = useState(false);
  const sessionIdRef = useRef<string | null>(null);
  const visitorRef = useRef<{ name?: string; phone?: string }>({});
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore session + visitor info on mount so refreshes don't lose context.
  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionIdRef.current = sessionStorage.getItem(SESSION_KEY);
    visitorRef.current = loadVisitor();
  }, []);

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

  const sendToAgent = useCallback(async (visitorText: string) => {
    // Extract contact info we can detect from this turn.
    const detected = extractContact(visitorText);
    visitorRef.current = {
      name: visitorRef.current.name ?? detected.name,
      phone: visitorRef.current.phone ?? detected.phone,
    };
    saveVisitor(visitorRef.current);

    setSending(true);
    setTyping(true);
    try {
      const res = await fetch("/api/support/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: CLIENT_ID,
          sessionId: sessionIdRef.current ?? undefined,
          agent: "support",
          channel: "chat",
          from: {
            name: visitorRef.current.name,
            phone: visitorRef.current.phone,
          },
          message: visitorText,
        }),
      });

      if (!res.ok) {
        throw new Error(`API ${res.status}`);
      }
      const data = (await res.json()) as {
        sessionId: string;
        reply: string;
        escalated?: boolean;
      };
      if (data.sessionId) {
        sessionIdRef.current = data.sessionId;
        if (typeof window !== "undefined") {
          sessionStorage.setItem(SESSION_KEY, data.sessionId);
        }
      }
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: "agent", text: data.reply },
      ]);
    } catch {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          from: "agent",
          text:
            "I'm having trouble reaching the team right now. You can text Noell directly or book a time at https://www.opsbynoell.com/book and we'll follow up.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }, []);

  const handleChip = (chip: string) => {
    if (sending) return;
    const userMsg: Message = { from: "visitor", text: chip };
    setMessages((prev) => [...prev, userMsg]);
    void sendToAgent(chip);
  };

  const handleSend = () => {
    const value = inputValue.trim();
    if (!value || sending) return;
    const userMsg: Message = { from: "visitor", text: value };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    void sendToAgent(value);
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
              {messages.length === 1 && !sending && (
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
                  disabled={sending}
                  className="flex-1 h-10 px-3.5 text-sm bg-cream-dark rounded-[10px] border border-warm-border focus:outline-none focus:border-lilac-dark/60 focus:bg-white text-charcoal placeholder:text-charcoal/70 disabled:opacity-60"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !inputValue.trim()}
                  className="w-10 h-10 rounded-[10px] bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md disabled:opacity-50 disabled:hover:scale-100"
                  aria-label="Send"
                >
                  <IconSend size={15} />
                </button>
              </div>
              <p className="text-[9px] text-muted-medium mt-2 text-center">
                Noell Support handles new-prospect intake. First response,
                qualification, routing, and human handoff.
              </p>
              <p className="text-[9px] text-muted-medium mt-1 text-center px-1">
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

// Render a string with auto-linkified URLs. Detects http(s)://, www., and
// bare opsbynoell.com/<path> so the agent's responses always produce
// clickable links even if the model omits the protocol.
function renderWithLinks(text: string): React.ReactNode[] {
  // Order matters: the bare-domain pattern must match AFTER the explicit
  // ones so we don't double-capture. We do it in a single pass by alternation.
  const pattern =
    /(https?:\/\/[^\s)>\]]+|www\.[^\s)>\]]+|opsbynoell\.com\/[^\s)>\]]*)/gi;
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index));
    }
    let raw = match[0];
    // Strip a trailing punctuation char that's almost certainly sentence
    // punctuation, not part of the URL.
    let trailing = "";
    while (raw.length > 0 && /[.,;:!?)]$/.test(raw)) {
      trailing = raw.slice(-1) + trailing;
      raw = raw.slice(0, -1);
    }
    const href = raw.startsWith("http") ? raw : `https://${raw}`;
    parts.push(
      <a
        key={`l${key++}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-lilac-dark hover:text-[#6b4f80] break-all"
      >
        {raw}
      </a>
    );
    if (trailing) parts.push(trailing);
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx));
  return parts;
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
          "max-w-[82%] px-4 py-2.5 text-sm leading-relaxed rounded-[17px] whitespace-pre-wrap",
          isAgent
            ? "bg-white border border-warm-border text-charcoal rounded-bl-md shadow-sm"
            : "bg-gradient-to-b from-lilac via-lilac-dark to-[#6b4f80] text-white rounded-br-md shadow-md"
        )}
      >
        {isAgent ? renderWithLinks(msg.text) : msg.text}
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
