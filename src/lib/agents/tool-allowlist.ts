/**
 * Tool / action allowlist per agent lane.
 *
 * Today Claude is not doing tool-use in this app — every "action"
 * (schedule, reschedule, missed-call, KB read) happens through a
 * dedicated Next.js route called by the server-side runner. Still, we
 * declare which action identifiers each lane is allowed to trigger, so
 * that:
 *
 *   1. If an action helper is added later, the gate is already in
 *      place and can block calls that do not belong to the lane.
 *   2. Audit logs can record the attempted tool even when it is
 *      rejected.
 *   3. Reviewers have a single place to see "what is care allowed to
 *      do?" without grepping routes.
 */
export type AgentLane = "support" | "frontDesk" | "care";

export type AgentTool =
  // read-only
  | "kb.query"
  | "contact.lookup"
  | "session.read"
  // writes
  | "appointment.schedule"
  | "appointment.reschedule"
  | "appointment.cancel"
  | "missed_call.textback"
  | "alert.telegram"
  | "alert.email"
  | "alert.sms_owner"
  | "kb.mutate";

const LANE_TOOLS: Record<AgentLane, ReadonlySet<AgentTool>> = {
  support: new Set<AgentTool>([
    "kb.query",
    "contact.lookup",
    "alert.telegram",
    "alert.email",
    "alert.sms_owner",
  ]),
  frontDesk: new Set<AgentTool>([
    "kb.query",
    "contact.lookup",
    "appointment.schedule",
    "appointment.reschedule",
    "missed_call.textback",
    "alert.telegram",
    "alert.email",
    "alert.sms_owner",
  ]),
  care: new Set<AgentTool>([
    "kb.query",
    "contact.lookup",
    "alert.telegram",
    "alert.email",
    "alert.sms_owner",
  ]),
};

export function isToolAllowed(lane: AgentLane, tool: AgentTool): boolean {
  return LANE_TOOLS[lane].has(tool);
}

export function assertToolAllowed(lane: AgentLane, tool: AgentTool): void {
  if (!isToolAllowed(lane, tool)) {
    throw new Error(`tool "${tool}" is not allowed for lane "${lane}"`);
  }
}

export function listAllowedTools(lane: AgentLane): AgentTool[] {
  return Array.from(LANE_TOOLS[lane]);
}
