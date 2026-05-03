# A2P-Frozen Path Legal Audit — 2026-05-02

## Scope

Read-only audit of the following A2P 10DLC-frozen paths for:

1. Unprofessional / sensual / euphemistic language (massage-context phrases such as
   "on the table," "between strokes," "mid-massage," "hands-on," "in the middle of
   bodywork," "happy ending," "sensual," "intimate," "touch")
2. Any instance of Santa's last name ("Essenberge")
3. Any other naming-convention deviations from the approved
   "Santa, owner of Healing Hands by Santa" / "Santa E." / "Santa" pattern

Files audited:

- `src/app/contact/page.tsx`
- `src/app/sms-policy/page.tsx`
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`
- `src/app/legal/cookies/page.tsx`
- `src/app/legal/privacy/page.tsx`
- `src/app/legal/terms/page.tsx`
- `src/components/noell-support-chat.tsx`
- `src/components/agent-chat-widget.tsx`

No code modifications were made. This document is the only deliverable.

---

## Summary

**No findings.** Every audited file is clean against the criteria above.

| File                                       | Sensual/euphemistic language | Santa's last name | Santa naming deviations | Notes |
|--------------------------------------------|------------------------------|-------------------|-------------------------|-------|
| `src/app/contact/page.tsx`                 | None                         | None              | Santa not referenced    | A2P consent block intact (HELP/STOP, "Message and data rates may apply", frequency disclosure). |
| `src/app/sms-policy/page.tsx`              | None                         | None              | Santa not referenced    | A2P 10DLC program description, opt-in/out, HELP, frequency, carrier-sharing clauses all intact. |
| `src/app/privacy/page.tsx`                 | None                         | None              | Santa not referenced    | "No mobile information will be shared..." clause and originator-opt-in clauses intact. |
| `src/app/terms/page.tsx`                   | None                         | None              | Santa not referenced    | A2P 10DLC SMS Terms section (5a) intact; HELP/STOP, carrier liability, TCPA references preserved. |
| `src/app/legal/cookies/page.tsx`           | None                         | None              | Santa not referenced    | — |
| `src/app/legal/privacy/page.tsx`           | None                         | None              | Santa not referenced    | — |
| `src/app/legal/terms/page.tsx`             | None                         | None              | Santa not referenced    | — |
| `src/components/noell-support-chat.tsx`    | None                         | None              | Santa not referenced    | Initial agent greeting and consent footer reference Privacy / Terms / SMS Policy correctly. |
| `src/components/agent-chat-widget.tsx`     | None                         | None              | Santa not referenced    | Same consent footer pattern as noell-support-chat. |

### Verification commands run (read-only)

```
grep -nIE -i 'on the table|between strokes|mid-massage|during a massage|hands-on|in the middle of bodywork|happy ending|sensual|intimate|\btouch\b|the table|client on the table|stroke|bodywork|essenberge|massage' <frozen paths>
# → no matches

grep -nIE -i 'santa|healing hands' <frozen paths>
# → no matches
```

---

## Findings

_None._

There is no copy in any frozen path that would require either a sensual-language
rewrite or a Santa-naming-convention edit. The frozen surface is already
A2P-aligned and brand-neutral with respect to the case-study client.

---

## A2P-Critical Strings Confirmed Present (do NOT alter in any future pass)

These strings were observed in the frozen paths and must remain verbatim:

| String                                                                                          | File(s)                                                  |
|-------------------------------------------------------------------------------------------------|----------------------------------------------------------|
| "Reply HELP for help, STOP to cancel."                                                          | `contact/page.tsx`, `sms-policy/page.tsx`                |
| "Message and data rates may apply."                                                             | `contact/page.tsx`, `sms-policy/page.tsx`, `privacy/page.tsx`, `terms/page.tsx` |
| "Message frequency varies."                                                                     | `contact/page.tsx`, `sms-policy/page.tsx`, `privacy/page.tsx`, `terms/page.tsx` |
| "No mobile information will be shared with third parties or affiliates for marketing/promotional purposes." | `sms-policy/page.tsx`, `privacy/page.tsx`               |
| "Text messaging originator opt-in data and consent will not be shared with any third parties, except for aggregators and providers of the Text Message services." | `sms-policy/page.tsx`, `privacy/page.tsx`               |
| Program name: "Ops by Noell — Customer Care & Lead Follow-up"                                   | `sms-policy/page.tsx`, `terms/page.tsx`                  |
| Consent checkbox / submission disclosure copy in `<p className="mt-8 text-sm text-muted-medium">` | `contact/page.tsx`                                       |

---

## Recommendations

1. **No edits required to frozen paths.** Proceed with the site-wide language pass
   on non-frozen files only.
2. Re-run this audit if any future PR touches these paths, since A2P 10DLC
   carrier-approved copy must remain byte-stable.
3. If a future copy change to a frozen path becomes genuinely necessary
   (e.g. address change at 23710 El Toro Road, EIN update, new vendor in the
   subprocessor list), open a dedicated PR labeled `a2p-review` and re-submit
   the campaign brief to The Campaign Registry before merging.

---

## Risk Levels

Not applicable — no findings, no proposed changes.

For reference, the risk-level rubric to be used if findings ever do surface:

| Risk   | Description                                                                                       |
|--------|---------------------------------------------------------------------------------------------------|
| LOW    | Cosmetic copy in non-disclosure body text, no carrier-relevant strings touched.                   |
| MEDIUM | Any change to the SMS Policy program name, opt-in flow description, frequency, or vendor list.   |
| HIGH   | Any change to HELP/STOP language, the "no mobile information shared" clause, the originator-opt-in clause, or the consent-checkbox label on the contact form. Requires re-submission to TCR before publish. |
