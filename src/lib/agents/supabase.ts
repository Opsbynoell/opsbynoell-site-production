/**
 * Thin Supabase REST client.
 *
 * We deliberately avoid the @supabase/supabase-js SDK here — the agents
 * backend only needs the PostgREST HTTP API, and pulling in the SDK
 * would add bundle weight and a websocket dependency we do not want in
 * Vercel serverless functions.
 *
 * Everything runs with the **service role key** so it bypasses RLS.
 * Never import this module from a client component.
 */

import { env } from "./env";

type QueryValue = string | number | boolean | null;

function baseHeaders(): Record<string, string> {
  const key = env.supabaseServiceKey();
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

function restUrl(path: string): string {
  return `${env.supabaseUrl()}/rest/v1/${path.replace(/^\//, "")}`;
}

/** SELECT. Accepts PostgREST query syntax in `params`. */
export async function sbSelect<T>(
  table: string,
  params: Record<string, QueryValue | undefined> = {},
  options: { select?: string; limit?: number; order?: string } = {}
): Promise<T[]> {
  const search = new URLSearchParams();
  if (options.select) search.set("select", options.select);
  if (options.limit) search.set("limit", String(options.limit));
  if (options.order) search.set("order", options.order);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    search.append(k, String(v));
  }
  const res = await fetch(`${restUrl(table)}?${search.toString()}`, {
    headers: baseHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `supabase select ${table} failed: ${res.status} ${await res.text()}`
    );
  }
  return (await res.json()) as T[];
}

/** INSERT one row and return it. */
export async function sbInsert<T>(
  table: string,
  row: Record<string, unknown>
): Promise<T> {
  const res = await fetch(restUrl(table), {
    method: "POST",
    headers: {
      ...baseHeaders(),
      Prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    throw new Error(
      `supabase insert ${table} failed: ${res.status} ${await res.text()}`
    );
  }
  const rows = (await res.json()) as T[];
  return rows[0];
}

/** UPDATE by filter (PostgREST query params). */
export async function sbUpdate<T>(
  table: string,
  filter: Record<string, QueryValue>,
  patch: Record<string, unknown>
): Promise<T[]> {
  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(filter)) search.append(k, String(v));
  const res = await fetch(`${restUrl(table)}?${search.toString()}`, {
    method: "PATCH",
    headers: {
      ...baseHeaders(),
      Prefer: "return=representation",
    },
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    throw new Error(
      `supabase update ${table} failed: ${res.status} ${await res.text()}`
    );
  }
  return (await res.json()) as T[];
}

/** UPSERT — honors the primary key or the unique constraint set on the table. */
export async function sbUpsert<T>(
  table: string,
  row: Record<string, unknown>,
  onConflict?: string
): Promise<T> {
  const search = new URLSearchParams();
  if (onConflict) search.set("on_conflict", onConflict);
  const res = await fetch(`${restUrl(table)}?${search.toString()}`, {
    method: "POST",
    headers: {
      ...baseHeaders(),
      Prefer: "return=representation,resolution=merge-duplicates",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    throw new Error(
      `supabase upsert ${table} failed: ${res.status} ${await res.text()}`
    );
  }
  const rows = (await res.json()) as T[];
  return rows[0];
}

/** Raw RPC call (for more complex reads like full-text KB search). */
export async function sbRpc<T>(
  fn: string,
  args: Record<string, unknown>
): Promise<T> {
  const res = await fetch(`${env.supabaseUrl()}/rest/v1/rpc/${fn}`, {
    method: "POST",
    headers: baseHeaders(),
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `supabase rpc ${fn} failed: ${res.status} ${await res.text()}`
    );
  }
  return (await res.json()) as T;
}
