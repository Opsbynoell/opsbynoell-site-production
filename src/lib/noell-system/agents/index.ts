import type { AgentConfig, AgentId } from "../types";
import { supportAgent } from "./support";
import { frontDeskAgent } from "./front-desk";
import { careAgent } from "./care";

/**
 * Registry of all agents in the Noell system.
 *
 * The generic chat widget (components/noell-chat.tsx) accepts an AgentId
 * and looks it up here. Adding a fourth agent is a one-file change.
 */
export const agents: Record<AgentId, AgentConfig> = {
  support: supportAgent,
  front_desk: frontDeskAgent,
  care: careAgent,
};

export function getAgent(id: AgentId): AgentConfig {
  return agents[id];
}

export { supportAgent, frontDeskAgent, careAgent };
