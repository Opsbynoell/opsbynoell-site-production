/**
 * Cron auth gate.
 *
 * Vercel's cron invocations include an `x-vercel-cron` header, but that
 * header is not a secret — any Vercel deploy in any project can set it
 * on an outbound request. We therefore require a shared secret on every
 * cron request in addition to the header:
 *
 *   Authorization: Bearer <CRON_SECRET>
 *
 * Vercel sets this automatically for cron jobs when a project-level
 * secret of the same name is defined (see vercel.json / Project
 * Settings → Environment Variables). Local development can call the
 * route directly with the same bearer token.
 */

import { env } from "./env";

export function assertCron(req: Request): void {
  const secret = env.cronSecret();
  const auth = req.headers.get("authorization") ?? "";
  const isVercelCron = req.headers.get("x-vercel-cron") !== null;

  if (!secret) {
    // Misconfig is louder than an open cron endpoint.
    throw new Error("CRON_SECRET is not configured");
  }
  if (auth !== `Bearer ${secret}`) {
    throw new Error("unauthorized cron invocation");
  }
  // Additionally ensure the request looks like cron traffic in prod.
  if (process.env.VERCEL_ENV === "production" && !isVercelCron) {
    throw new Error("unauthorized cron invocation");
  }
}
