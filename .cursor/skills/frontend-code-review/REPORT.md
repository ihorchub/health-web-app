# Report Format

Use this structure exactly. Do not rename section headings or the summary table.

---

### Frontend Code Review (Medicly)

**Mode:** A (uncommitted) | B (branch vs `<base>`)
**Files reviewed:** `X` changed frontend files under `apps/web/`
**Candidate fixes:** `Y` listed (applied: none | N after user request)
**Lint / tsc:** pass | fail (brief)

---

#### Blockers (`N`)

For each:

```
**[file path]:[line number]** — [short description]
> [1–3 lines: why + what to do instead]
```

If none: `None`

---

#### Warnings (`N`)

Same format. Simple nits can be one line; structural issues get the explanation block.

If none: `None`

---

#### Suggestions (`N`)

Short bullets. Paths optional.

If none: `None`

---

#### Summary

```
Blockers:    N   ← must fix before merging
Warnings:    N   ← should address
Suggestions: N   ← optional
Candidates:  N   ← listed; applied only on request

Verdict: READY TO MERGE | NEEDS FIXES | BLOCKED
```

**Verdict logic:**
- `BLOCKED` → any Blocker, or lint/tsc failed
- `NEEDS FIXES` → only Warnings remain
- `READY TO MERGE` → zero Blockers and zero Warnings (Suggestions OK)

---

## Notes

- Changed lines only; skip full scans for drive-by import/rename touches.
- Do not invent Savvy-only rules (RTK, Apollo, ban on CSS grid, mandatory useMemo everywhere).
- Prefer actionable “instead” over style lectures.
