/**
 * Knowledge base helpers for Noell Care.
 *
 * Today: simple keyword matching against the `keywords` array plus a
 * fallback scan of question/answer substrings. Fast, deterministic,
 * good enough to ship v1.
 *
 * Tomorrow: swap `queryKnowledgeBase` for a pgvector / embeddings-based
 * search. The runner interface does not change.
 */

import { sbSelect } from "./supabase";

export interface KnowledgeEntry {
  id: string;
  client_id: string;
  category: "services" | "faq" | "location" | "policies" | "team";
  question: string;
  answer: string;
  keywords: string[];
  active: boolean;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);
}

function score(entry: KnowledgeEntry, tokens: string[]): number {
  const hay = (
    entry.question +
    " " +
    entry.answer +
    " " +
    entry.keywords.join(" ")
  ).toLowerCase();
  let s = 0;
  for (const t of tokens) {
    if (entry.keywords.some((k) => k.toLowerCase() === t)) s += 3;
    else if (hay.includes(t)) s += 1;
  }
  return s;
}

export async function queryKnowledgeBase(
  clientId: string,
  question: string,
  limit = 5
): Promise<KnowledgeEntry[]> {
  const rows = await sbSelect<KnowledgeEntry>(
    "knowledge_base",
    { client_id: `eq.${clientId}`, active: "eq.true" },
    { limit: 500 }
  );
  const tokens = tokenize(question);
  if (tokens.length === 0) return [];
  const scored = rows
    .map((r) => ({ r, s: score(r, tokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit);
  return scored.map((x) => x.r);
}

export function formatKnowledgeContext(entries: KnowledgeEntry[]): string {
  if (entries.length === 0) {
    return "No matching knowledge base entries for this question. If the visitor is asking about a fact, escalate rather than guess.";
  }
  return [
    "Authoritative knowledge base entries for this client (answer from these only for factual questions):",
    ...entries.map(
      (e) => `- [${e.category}] Q: ${e.question}\n  A: ${e.answer}`
    ),
  ].join("\n");
}
