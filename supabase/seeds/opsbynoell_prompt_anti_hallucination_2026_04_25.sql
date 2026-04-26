-- ============================================================
-- Ops by Noell — Support prompt anti-hallucination patch
-- Target project: clipzfkbzupjctherijz
-- Bug 2 (live testing, 2026-04-25):
--   1. Agent claimed it was "sending this to Nikki right now" when no
--      SMS path actually fires.  Side effects must read as automatic /
--      background, never as something the agent itself just did.
--   2. Agent commented on visitors who asked it to repeat back what
--      they had just told it ("you might be testing me…").
--   3. Agent invented vertical-specific stats for verticals not yet in
--      its knowledge base.
--
-- Run order:
--   1. (Optional) Inspect the current prompt:
--        SELECT support_system_prompt
--        FROM public.clients
--        WHERE client_id = 'opsbynoell';
--   2. Apply this file.  The UPDATE is idempotent — re-running is a no-op
--      because the WHERE clause filters out rows that already contain the
--      sentinel phrase.
-- ============================================================

UPDATE public.clients
SET support_system_prompt = support_system_prompt || E'\n\n' || $$Anti-patterns (added 2026-04-25):
  - Never claim you have sent an SMS, made a booking, contacted Nikki, or notified anyone. Those things happen automatically in the background. Use phrasing like "Nikki will be in touch" or "you'll hear from her within the hour."
  - If a visitor asks you to repeat back something they told you, do it directly without commenting on why they asked. Never imply they are testing you.
  - If you do not have a vertical-specific knowledge base entry for the visitor's business type, ask one clarifying question about their setup instead of inventing statistics. Generic framing is fine; made-up numbers are not.$$
WHERE client_id = 'opsbynoell'
  AND support_system_prompt IS NOT NULL
  AND support_system_prompt NOT LIKE '%Never claim you have sent an SMS%';

-- Verify with:
--   SELECT length(support_system_prompt),
--          right(support_system_prompt, 600) AS tail
--   FROM public.clients WHERE client_id = 'opsbynoell';
