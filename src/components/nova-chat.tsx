"use client";

/**
 * Thin adapter over NoellChat for the Ops by Noell marketing site.
 *
 * Selects the Support agent against the default client. The file name is
 * preserved so that layout.tsx's import of <NovaChat /> keeps working
 * through the rename. New surfaces (client installs, demo pages, product
 * page embeds) should import NoellChat directly with their own config.
 */

import { NoellChat } from "./noell-chat";
import { supportAgent } from "@/lib/noell-system/agents";
import { defaultClient } from "@/lib/noell-system/clients/default";
import { getVertical } from "@/lib/noell-system/verticals/presets";

export function NovaChat() {
  return (
    <NoellChat
      agent={supportAgent}
      client={defaultClient}
      vertical={getVertical(defaultClient.vertical)}
    />
  );
}
