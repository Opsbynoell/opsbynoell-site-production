"use client";

import { useEffect } from "react";
import { trackMetaEvent } from "@/lib/meta-pixel-track";

export function AgentsPageAnalytics() {
  useEffect(() => {
    trackMetaEvent("ViewContent", { content_name: "noell_agents_landing" });
  }, []);
  return null;
}
