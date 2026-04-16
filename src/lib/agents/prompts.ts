/**
 * System-prompt assembly for each agent.
 *
 * At boot we read the SOUL / IDENTITY / BOOTSTRAP markdown files from
 * disk (under agents/<kind>/), then blend them with the per-client
 * config to produce a single `system` string for the Claude Messages
 * API. Reading the files is cheap and happens inside the serverless
 * function's warm filesystem, so we can do it per-request.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { AgentKind, ClientConfig } from "./types";

type Identity = { soul: string; identity: string; bootstrap: string };
const identityCache = new Map<AgentKind, Identity>();

function loadIdentity(kind: AgentKind): Identity {
  const cached = identityCache.get(kind);
  if (cached) return cached;
  // Relative to repo root in both `next dev` and Vercel builds.
  const root = process.cwd();
  const folder =
    kind === "frontDesk" ? "front-desk" : kind === "care" ? "care" : "support";
  const read = (name: string) => {
    try {
      return readFileSync(
        join(root, "agents", folder, name),
        "utf-8"
      );
    } catch {
      return "";
    }
  };
  const identity: Identity = {
    soul: read("SOUL.md"),
    identity: read("IDENTITY.md"),
    bootstrap: read("BOOTSTRAP.md"),
  };
  identityCache.set(kind, identity);
  return identity;
}

function formatServices(cfg: ClientConfig): string {
  if (!cfg.services || cfg.services.length === 0) return "(not configured)";
  return cfg.services
    .map(
      (s) =>
        `- ${s.name} (${s.durationMinutes} min)${
          s.priceRange ? ` — ${s.priceRange}` : ""
        }${s.description ? ` — ${s.description}` : ""}`
    )
    .join("\n");
}

function formatHours(cfg: ClientConfig): string {
  const h = cfg.hours ?? {};
  const keys = Object.keys(h);
  if (keys.length === 0) return "(not configured)";
  return keys.map((k) => `${k}: ${h[k]}`).join(", ");
}

function formatLocations(cfg: ClientConfig): string {
  if (!cfg.locations || cfg.locations.length === 0) return "(not configured)";
  return cfg.locations
    .map(
      (l) =>
        `- ${l.label}: ${l.address}${
          l.parkingNotes ? ` — parking: ${l.parkingNotes}` : ""
        }`
    )
    .join("\n");
}

function formatTeam(cfg: ClientConfig): string {
  if (!cfg.team || cfg.team.length === 0) return "(not configured)";
  return cfg.team
    .map(
      (m) =>
        `- ${m.name}${m.role ? `, ${m.role}` : ""}${
          m.specialties?.length ? ` (${m.specialties.join(", ")})` : ""
        }`
    )
    .join("\n");
}

export interface BuildSystemPromptOptions {
  kind: AgentKind;
  cfg: ClientConfig;
  /** Extra context injected per turn (e.g. KB hits, trigger info). */
  runtimeContext?: string;
}

export function buildSystemPrompt({
  kind,
  cfg,
  runtimeContext,
}: BuildSystemPromptOptions): string {
  const id = loadIdentity(kind);
  const overrides =
    kind === "frontDesk"
      ? cfg.frontDeskSystemPrompt
      : kind === "care"
        ? cfg.careSystemPrompt
        : cfg.supportSystemPrompt;

  const chunks: string[] = [];
  chunks.push("# WHO YOU ARE");
  chunks.push(id.soul);
  chunks.push("\n# WHAT YOU DO AND DO NOT DO");
  chunks.push(id.identity);
  chunks.push("\n# HOW YOU OPEN CONVERSATIONS");
  chunks.push(id.bootstrap);

  chunks.push("\n# THIS CLIENT");
  chunks.push(`Business name: ${cfg.businessName}`);
  if (cfg.vertical) chunks.push(`Vertical: ${cfg.vertical}`);
  if (cfg.phone) chunks.push(`Phone: ${cfg.phone}`);
  if (cfg.email) chunks.push(`Email: ${cfg.email}`);
  chunks.push(`Hours: ${formatHours(cfg)}`);
  chunks.push(`Locations:\n${formatLocations(cfg)}`);
  chunks.push(`Team:\n${formatTeam(cfg)}`);
  chunks.push(`Services:\n${formatServices(cfg)}`);

  if (overrides) {
    chunks.push("\n# CLIENT-SPECIFIC INSTRUCTIONS");
    chunks.push(overrides);
  }

  if (runtimeContext) {
    chunks.push("\n# RUNTIME CONTEXT FOR THIS TURN");
    chunks.push(runtimeContext);
  }

  chunks.push(
    "\n# STRICT RULES",
    "- Never reveal you are an AI or claim to be software.",
    "- Never quote prices unless they appear in the Services list above or are provided in runtime context.",
    "- Never promise outcomes or timelines not backed by this client's config.",
    "- Capture contact info conversationally, not as a form.",
    "- If you are uncertain or the ask is outside your scope, escalate to the owner rather than guess.",
    "- Keep replies short (1–3 sentences) and natural. This is SMS / chat, not email."
  );

  return chunks.join("\n");
}
