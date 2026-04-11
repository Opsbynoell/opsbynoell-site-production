"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send, ArrowRight } from "lucide-react";

type Message = {
  role: "nova" | "user";
  text: string;
};

const starterPrompts = [
  { label: "What does an audit include?", key: "audit" },
  { label: "How much does this cost?", key: "pricing" },
  { label: "Is this right for my business?", key: "fit" },
  { label: "What does Nova do?", key: "nova" },
];

const mockResponses: Record<string, string> = {
  default:
    "Hi! I'm Nova, the AI assistant for Ops by Noell. I help local service businesses recover revenue they're losing to slow follow-up and missed leads. I can tell you about our systems, pricing, or help you book a free audit. What would you like to know?",
  audit:
    "The free audit is a 30-minute call where we look at your current lead response time, follow-up gaps, no-show rate, and review generation. We'll identify exactly where revenue is leaking and what the first fix should be. It's not a sales pitch — you'll leave with a clear action plan whether you work with us or not. Want me to help you book one?",
  pricing:
    "Pricing depends on your setup and which systems you need. Everything is done-for-you — we build it, test it, and launch it. The best way to get a clear picture is the free audit, where we'll walk through exactly what your business needs and what it would cost. No pressure, no obligation. Want me to help you book one?",
  fit:
    "We work best with local service businesses where missed calls and slow follow-up directly cost revenue — med spas, home services, dental clinics, and professional services. If you're spending on marketing but losing leads to slow response, late follow-up, or no-shows, our systems are built for exactly that. What type of business are you running?",
  nova:
    "Nova is the AI layer built into every Ops by Noell system. It handles instant lead response, smart qualification, and automated booking — trained on your specific business, services, and voice. When a lead comes in, Nova responds in seconds and handles the conversation until an appointment is booked or your team is needed. The free audit will show you exactly how it would work for your business.",
  booking:
    "Absolutely! You can book your free 30-minute audit at opsbynoell.com/book. Pick a time that works and we'll walk through where your leads are slipping. No pitch deck, no pressure — just a direct look at what's costing you revenue.",
  thanks:
    "You're welcome! If you want to get started, the free audit is the best first step: opsbynoell.com/book. Otherwise, I'm here anytime you have questions. Good luck with your business!",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("audit") || lower.includes("what do you look at") || lower.includes("what happens"))
    return mockResponses.audit;
  if (lower.includes("price") || lower.includes("cost") || lower.includes("how much") || lower.includes("plan"))
    return mockResponses.pricing;
  if (lower.includes("right for") || lower.includes("my business") || lower.includes("good fit") || lower.includes("who do you"))
    return mockResponses.fit;
  if (lower.includes("nova") || lower.includes("ai") || lower.includes("assistant") || lower.includes("what do you do") || lower.includes("chatbot"))
    return mockResponses.nova;
  if (lower.includes("book") || lower.includes("schedule") || lower.includes("start") || lower.includes("sign up"))
    return mockResponses.booking;
  if (lower.includes("thank") || lower.includes("great") || lower.includes("awesome") || lower.includes("perfect"))
    return mockResponses.thanks;
  return "That's a great question. For the most specific answer, I'd recommend booking a free audit — we'll look at your exact setup and give you a clear picture of what's possible. It's 30 minutes, no obligation. Want me to help you schedule one?";
}

export function NovaLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    setMessages((prev) => [...prev, { role: "user", text }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "nova", text: getResponse(text) },
      ]);
    }, 800 + Math.random() * 800);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleStarter = (key: string, label: string) => {
    setMessages((prev) => [...prev, { role: "user", text: label }]);
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { role: "nova", text: mockResponses[key] || mockResponses.default },
      ]);
    }, 800 + Math.random() * 800);
  };

  const showStarters = messages.length === 0 && !isTyping;

  return (
    <>
      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-cream border border-charcoal/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: "min(520px, calc(100vh - 120px))" }}
        >
          {/* Header */}
          <div className="px-5 py-4 bg-nova-purple flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cream" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-cream">Nova</p>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cream/40" />
                <p className="text-[11px] text-cream/50">Preview mode</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-cream/50 hover:text-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages area */}
          <div ref={scrollRef} className="flex-1 p-4 space-y-3 overflow-y-auto">
            {/* Welcome message — always present */}
            <div className="flex justify-start">
              <div className="max-w-[85%] bg-white border border-charcoal/5 px-4 py-3 rounded-2xl rounded-bl-sm text-sm text-charcoal/80 leading-relaxed shadow-sm">
                {mockResponses.default}
              </div>
            </div>

            {/* Starter prompts */}
            {showStarters && (
              <div className="space-y-2 pt-2">
                {starterPrompts.map((sp) => (
                  <button
                    key={sp.key}
                    onClick={() => handleStarter(sp.key, sp.label)}
                    className="flex items-center justify-between w-full text-left px-4 py-2.5 rounded-xl border border-charcoal/8 text-sm text-charcoal/60 hover:border-nova-purple/30 hover:text-charcoal hover:bg-white/50 transition-all group"
                  >
                    <span>{sp.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-60 transition-opacity" />
                  </button>
                ))}
              </div>
            )}

            {/* Conversation */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-nova-purple text-cream rounded-br-sm"
                      : "bg-white border border-charcoal/5 text-charcoal/80 rounded-bl-sm shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-charcoal/5 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-charcoal/25 animate-bounce" />
                      <span className="w-1.5 h-1.5 rounded-full bg-charcoal/25 animate-bounce" style={{ animationDelay: "0.15s" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-charcoal/25 animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                    <span className="text-[10px] text-charcoal/20 font-mono">Nova is typing</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-charcoal/5 bg-white/50 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about systems, pricing, or booking..."
                className="flex-1 bg-cream/80 border border-charcoal/8 rounded-full px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/25 outline-none focus:border-nova-purple/30 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 rounded-full bg-nova-purple text-cream flex items-center justify-center hover:bg-nova-purple-light transition-colors disabled:opacity-25 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Launcher button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-nova-purple text-cream shadow-lg hover:bg-nova-purple-light hover:shadow-xl transition-all flex items-center justify-center group"
        aria-label={isOpen ? "Close Nova chat" : "Chat with Nova"}
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </>
  );
}
