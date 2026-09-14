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

- **Monorepo:** pnpm — `apps/api` (scaffolded), `apps/web` (next)
- **API:** Fastify, TypeScript, PostgreSQL, Drizzle, TypeBox, OpenAPI
- **Web:** React, Vite, MUI, React Router, React Query, Orval
- **Auth:** Server-side sessions, HTTP-only cookies

See [docs/spec/tech-stack.md](docs/spec/tech-stack.md) for upload limits, promo pricing, sessions, and dev setup conventions.

## Run from zero (API)

```text
pnpm install
cp apps/api/.env.example apps/api/.env   # set DATABASE_URL (+ DIRECT_URL for migrations)
pnpm dev
curl http://localhost:3000/api/v1/health
```

PostgreSQL is **Supabase** (hosted). Use the **transaction pooler** URI (`DATABASE_URL`, port 6543) for the API; use **direct** (`DIRECT_URL`, port 5432) for `pnpm db:migrate` when needed.

See [docs/spec/tech-stack.md](docs/spec/tech-stack.md) for full conventions.
