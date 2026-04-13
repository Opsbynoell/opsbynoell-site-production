import type { ClientConfig } from "../types";

/**
 * Default client used by this marketing site itself. When we install the
 * Noell system at a real client, a new ClientConfig is added alongside
 * this one and selected at runtime.
 */
export const defaultClient: ClientConfig = {
  clientId: "opsbynoell-marketing",
  businessName: "Ops by Noell",
  vertical: "generic",
  bookingUrl: "/book",
  phone: "",
  email: "hello@opsbynoell.com",
  hours: "By appointment",
  services: ["Free operations audit"],
  team: [{ name: "Noell", role: "owner" }],
  webhooks: {
    // onCapture:  "<wire to CRM>",
    // onEscalate: "<wire to Slack/email>",
    // onResolved: "<wire to analytics>",
  },
};
