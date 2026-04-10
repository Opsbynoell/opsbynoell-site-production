"use client";

import { useState, useEffect, useRef } from "react";

type Message = {
  role: "nova" | "visitor";
  text: string;
};

const demoConversation: Message[] = [
  { role: "visitor", text: "Hi, do you have availability this week for Botox?" },
  {
    role: "nova",
    text: "Hi! Yes, we have openings this week. We offer Botox starting at $12/unit with our certified injectors. Would you like to book a consultation?",
  },
  { role: "visitor", text: "Yes please, what times work?" },
  {
    role: "nova",
    text: "I have Tuesday at 2:00 PM, Wednesday at 10:30 AM, or Thursday at 4:00 PM. Which works best for you?",
  },
  { role: "visitor", text: "Wednesday at 10:30 works" },
  {
    role: "nova",
    text: "You're booked for Wednesday at 10:30 AM. I've sent a confirmation to your phone and email. You'll get a reminder 24 hours before. Is there anything else?",
  },
];

export function NovaChatDemo() {
  const [visibleMessages, setVisibleMessages] = useState<Message[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentIndex >= demoConversation.length) return;

    const message = demoConversation[currentIndex];
    const delay = currentIndex === 0 ? 1000 : message.role === "nova" ? 1500 : 800;

    const timer = setTimeout(() => {
      if (message.role === "nova") {
        setIsTyping(true);
        const typeTimer = setTimeout(() => {
          setIsTyping(false);
          setVisibleMessages((prev) => [...prev, message]);
          setCurrentIndex((prev) => prev + 1);
        }, 1200);
        return () => clearTimeout(typeTimer);
      } else {
        setVisibleMessages((prev) => [...prev, message]);
        setCurrentIndex((prev) => prev + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages, isTyping]);

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl overflow-hidden max-w-md mx-auto lg:mx-0">
      {/* Browser chrome with connection status */}
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-white/5 border-b border-white/10">
        <div className="w-2 h-2 rounded-full bg-white/20" />
        <div className="w-2 h-2 rounded-full bg-white/20" />
        <div className="w-2 h-2 rounded-full bg-white/20" />
        <span className="ml-3 font-mono text-[10px] text-cream/30">
          Nova — AI Assistant
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
          <span className="font-mono text-[10px] text-cream/30">
            Connected
          </span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="p-5 space-y-4 h-[340px] overflow-y-auto">
        {visibleMessages.length === 0 && !isTyping && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <div className="w-2 h-2 rounded-full bg-green-400 mx-auto animate-pulse" />
              <p className="text-sm text-cream/25 italic">
                Connection established...
              </p>
            </div>
          </div>
        )}

        {visibleMessages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "visitor" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "visitor"
                  ? "bg-cream text-charcoal rounded-br-sm"
                  : "bg-white/10 text-cream/90 rounded-bl-sm"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cream/40 animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-cream/40 animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-cream/40 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status footer */}
      <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between">
        <div className="bg-white/5 rounded-full px-4 py-2 text-sm text-cream/25 flex-1">
          Type a message...
        </div>
        <span className="font-mono text-[9px] text-cream/15 ml-3">
          AI-powered
        </span>
      </div>
    </div>
  );
}
