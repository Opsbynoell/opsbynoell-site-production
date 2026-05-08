"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { trackMetaEvent } from "@/lib/meta-pixel-track";

type Variant = "primary" | "wine" | "secondary";

export function AgentsFoundingCta({
  planId = "agents_founding",
  href,
  className,
  children,
  variant = "primary",
}: {
  planId?: string;
  href?: string;
  className?: string;
  children: React.ReactNode;
  variant?: Variant;
}) {
  const [loading, setLoading] = useState(false);

  // If an explicit href is provided (e.g. /book), use it as a plain link.
  if (href) {
    return (
      <Button
        href={href}
        variant={variant}
        className={className}
        onClick={() => {
          trackMetaEvent("InitiateCheckout", {
            value: 197,
            currency: "USD",
            content_name: "noell_agents_founding",
          });
        }}
      >
        {children}
      </Button>
    );
  }

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    trackMetaEvent("InitiateCheckout", {
      value: 197,
      currency: "USD",
      content_name: planId,
    });
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (res.ok) {
        const { url } = await res.json();
        if (url) { window.location.href = url; return; }
      }
      window.location.href = "/book";
    } catch {
      window.location.href = "/book";
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleClick}
      type="button"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </Button>
  );
}
