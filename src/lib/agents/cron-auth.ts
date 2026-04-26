/**
 * Cron auth gate.
 *
 * Vercel's cron invocations include an `x-vercel-cron` header, but that
 * header is not a secret — any Vercel deploy in any project can set it
 * on an outbound request. We therefore require a shared secret on
 * every cron request in addition to the header:
 *
 *   Authorization: Bearer <CRON_SECRET>
 *
 * Vercel sets this automatically for cron jobs when a project-level
 * secret of the same name is defined (see vercel.json / Project
 * Settings → Environment Variables). Local development can call the
 * route directly with the same bearer token.
 *
 * For backward compatibility, if CRON_SECRET is not set at all we
 * fall back to the legacy "x-vercel-cron header alone" check, so a
 * fresh deploy without the env var still runs. Once CRON_SECRET is
 * populated we hard-require it.
 */

import { env } from "./env";

export function assertCron(req: Request): void {
  const secret = env.cronSecret();
  const auth = req.headers.get("authorization") ?? "";
  const isVercelCron = req.headers.get("x-vercel-cron") !== null;

  if (secret) {
    // Preferred mode: shared secret is required.
    if (auth !== `Bearer ${secret}`) {
      throw new Error("unauthorized cron invocation");
    }
    // Additionally ensure the request looks like cron traffic in prod.
    if (process.env.VERCEL_ENV === "production" && !isVercelCron) {
      throw new Error("unauthorized cron invocation");
    }
    return;
  }

  // Legacy: no secret configured yet. Accept the Vercel cron header.
  // This branch should be removed once CRON_SECRET is set everywhere.
  if (isVercelCron) return;
  throw new Error("unauthorized cron invocation");
}
