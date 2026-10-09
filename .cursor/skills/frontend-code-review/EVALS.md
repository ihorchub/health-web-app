# Self-Evaluation

Run after the review report is fully output. Separate block after a divider (`---`). Do not re-output or edit the review.

---

## Output format

```
---
Review Self-Eval

[checklist with pass / fail / n/a per item]

Overall: PASS | PARTIAL | FAIL
```

Use:
- pass — criterion met
- fail — not met (one line why)
- n/a — not applicable (e.g. no shared/ changes)

---

## Checklist

### Completeness
- [ ] Every Blocker has file path + line number
- [ ] Every Blocker points at a **changed** line in this diff
- [ ] Every Warning has an actionable “what instead”
- [ ] Candidate-fix count is present and matches the list
- [ ] Summary has all counters (Blockers, Warnings, Suggestions, Candidates)
- [ ] Verdict matches counts (BLOCKED = any Blocker or lint/tsc fail; NEEDS FIXES = only Warnings; READY = neither)

### Coverage
- [ ] All changed `apps/web/` frontend files reviewed (or skipped with reason)
- [ ] Lint + tsc results mentioned
- [ ] Shared audit ran, or noted “no components/utils changes”
- [ ] No silent file edits unless the user asked to apply fixes

### Accuracy
- [ ] No Blockers for pre-existing untouched code
- [ ] No Savvy-only rules misapplied (RTK, Formik legacy, ban grid, mandatory memo)
- [ ] Data-fetching checks on files that fetch or use Query/Orval/`useEffect`
- [ ] TypeScript checks on files with types, assertions, or imports
- [ ] i18n / product checks when UI chrome or SCR surfaces changed

### Overall
- `PASS` — all applicable items pass
- `PARTIAL` — only n/a gaps, no fail
- `FAIL` — any fail
