# Medicly (health-web-app)

Digital healthcare booking platform — patients search doctors, book honest slots, manage visits; doctors manage schedule and day view.

## Documentation

| Doc                                                      | Purpose                             |
| -------------------------------------------------------- | ----------------------------------- |
| [docs/spec/product-spec.md](docs/spec/product-spec.md)   | Product rules (what)                |
| [docs/spec/backend-spec.md](docs/spec/backend-spec.md)   | API / server behaviour              |
| [docs/spec/frontend-spec.md](docs/spec/frontend-spec.md) | UI per screen                       |
| [docs/spec/tech-stack.md](docs/spec/tech-stack.md)       | **Stack & implementation defaults** |
| [docs/project-context.md](docs/project-context.md)       | Client brief summary                |
| [AGENTS.md](AGENTS.md)                                   | AI / contributor guide              |

## Technology stack (summary)

- **Monorepo:** pnpm — `apps/api`, `apps/web`
- **API:** Fastify, TypeScript, PostgreSQL, Drizzle, TypeBox, OpenAPI
- **Web:** React, Vite, MUI, React Router, React Query, Orval
- **Auth:** Server-side sessions, HTTP-only cookies

See [docs/spec/tech-stack.md](docs/spec/tech-stack.md) for upload limits, promo pricing, sessions, and dev setup conventions.

## Run from zero

```text
pnpm install
cp apps/api/.env.example apps/api/.env   # set DATABASE_URL (+ DIRECT_URL for migrations)
pnpm dev                                 # API :3000 + web :5173 (Vite proxies /api)
```

- API: http://localhost:3000/api/v1/health  
- Web: http://localhost:5173 (home page checks API via proxy)

Frontend-only: `pnpm dev:web`. API-only: `pnpm dev:api`.

PostgreSQL is **Supabase** (hosted). Use the **transaction pooler** (`DATABASE_URL`, port **6543**) for the API. For `pnpm db:migrate`, use **session pooler** (`DIRECT_URL`, port **5432**, user `postgres.[PROJECT_REF]` on the same pooler host). The old `db.*.supabase.co` direct host may not resolve on all projects.

See [docs/spec/tech-stack.md](docs/spec/tech-stack.md) for full conventions.

**Try the API (step-by-step curls):** [apps/api/VERIFY.md](apps/api/VERIFY.md)  
**SCR-01 for frontend:** [docs/spec/SCR-01-api-handoff.md](docs/spec/SCR-01-api-handoff.md)
