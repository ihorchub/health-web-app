---
name: frontend-code-review
description: >-
  Reviews Medicly frontend changes (apps/web) against local git state — uncommitted
  diffs or branch vs base. Checks frontend-conventions, ui-kit-master, TanStack Query
  + Orval, i18n, styling, and shared-code placement. Reports severity-tiered findings;
  does not silently rewrite code. Use when the user says review my code, review this
  branch, review these commits, /review, frontend review, or asks for a Medicly code review.
---

# Frontend Code Review (Medicly)

Reviews frontend changes on the current branch or a user-specified commit range.
Always runs against **local git** (no GitHub PR API required). Reports findings;
does **not** auto-edit unless the user explicitly asks to apply fixes.

See [CHECKLIST.md](CHECKLIST.md) for checks and [REPORT.md](REPORT.md) for output format.

**Related (load as needed):** `frontend-conventions`, `ui-kit-master`. Specs win on behaviour (`docs/spec/product-spec.md`).

---

## Step 0 — Mode and changed files

Announce the mode at the start of every review.

### Mode detection

```bash
git diff HEAD --name-only
git diff --staged --name-only
```

| Condition | Mode |
|-----------|------|
| Uncommitted changes (staged and/or unstaged) | **A** |
| Clean working tree | **B** |

User override: “review my uncommitted changes” → A; “review the whole branch” / “all commits” → B.

### Mode A — Uncommitted

```bash
git diff HEAD --name-only
```

Open with:

```
Reviewing: uncommitted changes (staged + unstaged vs HEAD)
Branch: <branch>
Files changed: <N> frontend files under apps/web/
```

### Mode B — Branch vs base

Resolve base (prefer `main`, else `origin/HEAD` / remote default). Do not hardcode if the repo uses another default.

```bash
git merge-base HEAD main   # or detected base
git diff main...HEAD --name-only
git log main..HEAD --oneline
```

Open with:

```
Reviewing: all commits on this branch vs <base>
Branch: <branch> → base: <base>
Commits: <N>
Files changed: <N> frontend files under apps/web/
```

### Scope filter

Keep only paths under `apps/web/` (typically `apps/web/src/`, plus `apps/web` config touched for FE: `orval.config.ts`, `vite.config.*`, `index.html`, locale JSON, etc.).

If no frontend files changed → say so and stop.

In Mode B, skip Step 1.

---

## Step 1 — Staging hygiene (Mode A only)

Scan staged + unstaged paths for:

- `.env`, `.env.*`, credentials, private keys, `*secret*`
- Agent/session junk that must not be committed (e.g. `agent-transcripts/`, local-only Cursor state) — **not** project skills under `.cursor/skills/` (those are intentional)

If secrets / junk are **staged** → unstage them:

```bash
git restore --staged <file>
```

Warn clearly. Do not delete files. Do not touch `.cursor/skills/` as pollution.

---

## Step 2 — Candidate fixes (report only)

Scan changed frontend files. **List** candidates; do **not** apply unless the user says to fix them (e.g. “apply the safe fixes”).

| Candidate | Note |
|-----------|------|
| `console.log(...)` | Remove unless intentional debug behind a gate |
| `console.warn` / `console.error` | Keep only in real error boundaries / handlers |
| Value import that is type-only | Prefer `import type` |
| `// @ts-ignore` / `// @ts-expect-error` | Flag as 🔴; do not strip silently |
| Cross-directory relative import (`../../`) | Prefer `@/` |
| Missing blank line before `theme.breakpoints.*` in `styled()` | Style nit |

Record count for the report (“N candidates; none applied”).

---

## Step 3 — Lint & typecheck

From repo root:

```bash
pnpm --filter @medicly/web lint 2>&1 | head -80
pnpm --filter @medicly/web exec tsc -b --pretty false 2>&1 | head -80
```

Failures → 🔴 Blockers. Do not abort; continue to Step 4.

---

## Step 4 — Convention checks

Read each changed file. Apply [CHECKLIST.md](CHECKLIST.md).

**Changed lines only** — do not flag pre-existing issues in untouched blocks.

Cross-check `frontend-conventions` (+ `ui-kit-master` for styling). CHECKLIST is the review layer; if you tighten a rule here, update the matching conventions reference.

Light product guard: if the diff invents a new SCR/FLO/role or contradicts `product-spec.md` / Open items → 🔴 Blocker.

---

## Step 5 — Shared code audit

For adds/changes under `apps/web/src/components/` or `apps/web/src/utils/`:

1. **Actually shared?** If only one module imports it → prefer `modules/<area>/<page>/…`.
2. **Duplicate?** Near-duplicate in components/utils → report both and recommend reuse/consolidation.

If neither path changed → note “no shared components/utils changes”.

---

## Step 6 — Report

Follow [REPORT.md](REPORT.md) exactly.

---

## Step 7 — Self-evaluation

After the report, read [EVALS.md](EVALS.md) and output the eval as a **separate** block after a divider. Do not blend into the report.
