# @medicly/web

Vite + React + TypeScript app for Medicly.

## Run

From the **repo root** (pnpm workspace):

```bash
pnpm install
pnpm dev:web
```

Or both API + web: `pnpm dev`

Open http://localhost:5173 — Vite proxies `/api` → `http://localhost:3000`.

## Scripts (package)

| Script | Purpose |
| --- | --- |
| `pnpm --filter @medicly/web dev` | Vite dev server |
| `pnpm --filter @medicly/web build` | Typecheck + production build |
| `pnpm --filter @medicly/web lint` | ESLint |
| `pnpm --filter @medicly/web format` | Prettier |
| `pnpm --filter @medicly/web generate:api` | Orval codegen (needs OpenAPI) |

## Stack

MUI + Emotion, Tabler icons, TanStack Query, Axios, Orval, React Router, RHF + Yup, sonner, react-i18next.

Brand assets: `public/brand/`.
