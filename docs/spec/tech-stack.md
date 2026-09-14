# Medicly — technology stack & implementation defaults

**Status:** Approved for implementation (14 Sep 2026)  
**Audience:** Team + agents implementing the monorepo.  
**Specs:** Product behaviour stays in `product-spec.md`; API contracts in `backend-spec.md` / `frontend-spec.md`.

This document locks **how** we build. It does not change **what** the product does.

---

## 1. Stack overview

| Layer | Choice |
|---|---|
| **Monorepo** | **pnpm workspaces** — `apps/api`, `apps/web` |
| **Frontend** | React 18+, **TypeScript**, **Vite** |
| **UI** | **MUI** (theme = Medicly / Manrope from Paper) |
| **Client routing** | **React Router** |
| **Server state** | **TanStack React Query** |
| **API client** | **Orval** — generates hooks + types from **OpenAPI** |
| **Backend** | **Node.js**, **Fastify**, **TypeScript** |
| **Database** | **PostgreSQL** on **Supabase** (hosted); local Docker optional for offline dev |
| **ORM** | **Drizzle** (migrations + queries) |
| **Request validation** | **TypeBox** (`@fastify/type-provider-typebox`) |
| **API contract** | **OpenAPI 3** — generated from Fastify routes (source of truth on server) |
| **Auth** | **Server-side sessions** in Postgres; **HTTP-only** session cookie |
| **Password hashing** | **argon2** (or bcrypt cost 12 if argon2 unavailable in env) |
| **Tests (API)** | **Vitest** + real Postgres (Docker Compose in dev/CI) |

---

## 2. Repository layout (target)

```text
/
  apps/
    api/          # Fastify, Drizzle, OpenAPI, seed, tests
    web/          # Vite + React + MUI + Orval output
  packages/       # optional later; avoid shared domain package in MVP
  docker-compose.yml   # optional local PostgreSQL
  pnpm-workspace.yaml
  .env.example
```

**Supabase env (API):** `DATABASE_URL` = transaction pooler (runtime); `DIRECT_URL` = direct Postgres (Drizzle migrations). Do **not** use Supabase Auth / `@supabase/server` for MVP — sessions live in our Postgres schema.

**Scripts (team convention):** `pnpm dev` (api + web), `pnpm db:migrate`, `pnpm db:seed`, `pnpm test`, `pnpm generate:api` (Orval from running or exported OpenAPI).

---

## 3. API contract workflow

1. Define routes on Fastify with **TypeBox** schemas for params, body, response.
2. Register **`@fastify/swagger`** (+ swagger-ui in dev only) so **OpenAPI** is emitted from code.
3. Export OpenAPI JSON (dev URL or build artifact) → **Orval** → `apps/web/src/api/` (generated; commit or regenerate in CI — **commit generated client** for simpler 2-person workflow).
4. React Query hooks from Orval use `credentials: 'include'` for cookie auth.

**Error envelope (all layers):** `{ error: { code, message?, fields? } }` — UI copy from i18n by `code` (`backend-spec.md` appendix).

**API prefix:** `/api/v1`

---

## 4. Authentication & cookies

| Topic | Decision |
|---|---|
| Session store | Postgres table `sessions` (`id`, `user_id`, `expires_at`, `created_at`) |
| Cookie | Opaque session id; `HttpOnly`, `Secure` in production, `SameSite=Lax` |
| Session TTL | **14 days** sliding or absolute from login; delete row on logout |
| SPA dev | Vite **proxy** `/api` → Fastify so cookie is same-site on `localhost` |
| Production | Prefer **same origin** (static + API behind one host) or explicit CORS with `credentials: true` and fixed allowed origin |
| CSRF | Same-site deployment + Lax cookie for MVP; revisit if API on different site |

No JWT for MVP (see `backend-spec.md` Accounts section).

---

## 5. Data & time

| Topic | Decision |
|---|---|
| DB timestamps | **`timestamptz`** stored in **UTC** |
| Booking horizon / Zone A | Computed in **`Europe/Kyiv`** |
| Display | Frontend formats in user locale + Kyiv for slot labels as per i18n spec |

---

## 6. Validation & uploads

| Topic | Decision |
|---|---|
| **Phone** | Required non-empty string on register/profile; **no** SMS OTP. Optional client mask `+380 …`; server accepts any non-empty string ≤ 32 chars for MVP |
| **Email** | Standard format check server-side |
| **Password** | Min **8** characters; confirm password **client-only** |
| **License / doctor photo** | Multipart upload; types: **image/jpeg, image/png, image/webp, application/pdf** (license only); max **10 MB** per file |
| **Storage** | Local directory **`uploads/`** (gitignored); DB stores relative path or key; serve via authenticated or public static route as appropriate |
| **DOB** | Must be a date in the past (patient and doctor) |

---

## 7. Pricing & promos (display only)

Stored on doctor schedule / profile (see Drizzle schema in `apps/api`):

| Field | Meaning |
|---|---|
| `base_price` | Integer UAH (or minor units — pick one convention in schema and use everywhere) |
| `promo_price` | Optional; shown when active |
| `promo_valid_until` | Optional **date** (inclusive, Kyiv calendar day); if set and `today <= promo_valid_until` and `promo_price` set → show promo |

**Effective price** for search/calendar/booking preview: promo if active, else base. Never charged in app.

Zone A: base price changes frozen per product rules (`SCR-09`); promo display may still show per seed.

---

## 8. Slots, calendar refresh, concurrency

| Topic | Decision |
|---|---|
| Slot generation | **Compute on read** (`backend-spec.md` Slots section) |
| Double booking | Transaction + **unique / exclusion** constraint on doctor occupied time |
| Calendar refresh (FE) | **React Query** `refetchInterval` **30s** on SCR-04 while wizard open; refetch on focus; invalidate after book/cancel |

---

## 9. Frontend implementation notes

- **i18n:** translation files (EN/UK); no hardcoded UI strings.
- **Theme:** MUI theme from Paper tokens; light/dark persisted (product R-11).
- **OpenAPI types:** prefer generated types; do not duplicate DTOs manually.
- **Legal pages:** static routes in React; content from API or markdown — copy **Open** for legal text only.

---

## 10. Week 3 client questions — where answered

Client brief “open questions” (schedule, slots, double-booking, state machine, authz, timezone, API per screen) are answered in **`backend-spec.md`** shared sections and SCR/FLO blocks (Sep 2026). This file adds **tooling** choices only.

---

## 11. Still open (product / copy / UX chrome)

| Item | Owner |
|---|---|
| Privacy Policy / Terms **legal copy** | Client / team content |
| Full specialty list beyond four | Product **Open** |
| SCR-12 / notification **exact layout** | Design / frontend polish |
| Proposed time on list row vs SCR-12 only | Frontend **Open** (either OK) |
| Exact seed fictional names | Seed data file |

Do not block backend start on these.
