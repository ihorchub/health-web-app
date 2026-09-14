# @medicly/web

Vite + React + MUI skeleton for Medicly.

## Where to work

| Area            | Path                                              |
| --------------- | ------------------------------------------------- |
| Screens (SCR-*) | `src/pages/`                                      |
| Shared UI       | `src/components/`                                 |
| Theme           | `src/theme.ts`                                    |
| i18n (EN/UK)    | `src/i18n/` — wire a library when you add strings |
| Orval output    | `src/api/` (generated later)                      |

## Specs

- UI behaviour: `docs/spec/frontend-spec.md`
- SCR-02 layout lock: `docs/spec/ia-chrome-decision.md` (Paper FINAL)

## Imports

- Use **`@/`** for app code (`@/components/Button`, `@/pages/HomePage`). Same pattern as **savvy-dev-web-app**.
- **Auto-import:** workspace sets `importModuleSpecifier: non-relative` so the editor prefers `@/`, not `./components/...`.
- **Sort order** (Prettier `@trivago/prettier-plugin-sort-imports`): React → other packages → `@/` → relative (`./` only for co-located files in a folder).
- **On save:** Prettier formats + sorts imports; ESLint does not re-sort (avoids fighting Prettier). Run `pnpm prettier:fix` from root if needed.

## Dev

From repo root: `pnpm dev` (needs API on :3000 for proxy). Or `pnpm dev:web` for UI-only.
