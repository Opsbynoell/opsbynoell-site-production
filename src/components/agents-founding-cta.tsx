"use client";

import React from "react";
import { Button } from "./button";
import { trackMetaEvent } from "@/lib/meta-pixel-track";

type Variant = "primary" | "wine" | "secondary";

export function AgentsFoundingCta({
  href = "/book",
  className,
  children,
  variant = "primary",
}: {
  href?: string;
  className?: string;
  children: React.ReactNode;
  variant?: Variant;
}) {
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
