/**
 * Cron auth gate.
 *
 * Vercel cron requests include the `x-vercel-cron` header; for extra
 * safety in the Hobby-plan-world we also require a shared secret in
 * `Authorization: Bearer <CRON_SECRET>`. Either proof is enough.
 */

import { env } from "./env";

export function assertCron(req: Request): void {
  const secret = env.cronSecret();
  const auth = req.headers.get("authorization") ?? "";
  const isVercelCron = req.headers.get("x-vercel-cron") !== null;
  if (isVercelCron) return;
  if (secret && auth === `Bearer ${secret}`) return;
  throw new Error("unauthorized cron invocation");
}
