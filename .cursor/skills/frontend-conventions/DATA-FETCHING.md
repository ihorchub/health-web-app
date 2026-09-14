# Data fetching

## Stack

| Layer | Tool |
|-------|------|
| HTTP | Axios (`src/api/mutator/`) — cookie sessions → `withCredentials: true` |
| Codegen | Orval → React Query hooks + models |
| Cache / server state | `@tanstack/react-query` |

No Redux, no RTK Query, no Apollo.

## Hybrid rule (current phase)

Backend lands incrementally after merges from `main`. Agents must **inspect live API code + OpenAPI**, not assume only the FE skeleton.

| Surface | Source of truth |
|---------|-----------------|
| **Auth / registration / login / me** (and any other route that already exists under `apps/api`) | **Real API** — read routes, schema, OpenAPI; wire via Orval when available, else typed Axios matching backend contracts |
| **Everything else** (search, doctors, slots, appointments, notifications, …) | **Mocks behind a thin data layer** shaped like future Orval hooks |

Do **not** sprinkle ad-hoc fake arrays inside JSX. Do **not** invent endpoints that contradict `docs/spec/backend-spec.md`.

### Before wiring any “live” call

1. After merging `main` (or whenever API changed): skim `apps/api/src/` (routes, schema, OpenAPI export).
2. Cross-check Contract blocks in `docs/spec/backend-spec.md` (same SCR/R IDs).
3. Prefer regenerating Orval: OpenAPI → `pnpm --filter @medicly/web generate:api`.
4. If OpenAPI is not ready yet for that route: one hand-written hook in `src/api/` that mirrors the real path/body — replace with generated hook later.

Auth register flow (spec): `POST /api/v1/auth/register/step-1` → verify-email → step-3 → complete; plus login / logout / `GET /api/v1/auth/me`. Exact shapes = backend after merge.

### Mock layer (easy delete later)

```
src/api/
  mutator/customInstance.ts   # Axios; credentials for cookies
  generated/                  # Orval only — never hand-edit
  mocks/                      # temporary fixtures + mock queryFns
  doctors/ (or domain folders) # public hooks + DTO types (Orval-shaped)
```

Pattern:

1. Define a **stable query key + return type** aligned with backend-spec / future OpenAPI DTOs.
2. Export a hook with the **same name signature you expect from Orval** (`useGetDoctorsSearch`, …).
3. Inside: either call generated/real client **or** return mock data via `useQuery({ queryFn: async () => mock… })`.
4. Feature modules import **only** the public hook — never import `mocks/` from pages.
5. When the real endpoint ships: point the hook at Orval (or delete the wrapper) and **delete the mock file**. No UI rewrite.

**Mock DTOs must look like the future API**, not like UI convenience blobs:

- Prefer **ids** (`cityId`, `clinicId`, `specialty`) + resolve labels from live reference / i18n.
- Denormalized `cityName` / `clinicName` only if the future search payload will include them **for the active locale** (same as BE will return after `Accept-Language`).
- Authored long text (doctor about/bio): include **`descriptionUk` + `descriptionEn`** (names may match final OpenAPI — keep both). UI picks by `i18n.language` with fallback. Profile forms will edit both textareas.
- Do not put UI-only translated strings inside fixtures (no `t()` inside mock files).
- Query params / filters / pagination (`cursor`, `sort`, `q`, …) should match the intended BE contract so the swap is a `queryFn` change.

Feature flags (optional): `import.meta.env.VITE_USE_API_MOCKS` or per-domain constants — default mocks **on** for unfinished domains, **off** for auth / reference once API is present.

## Workflow (Orval)

1. Backend OpenAPI → `apps/web/openapi/openapi.json` (or agreed path)
2. `pnpm --filter @medicly/web generate:api` (Orval)
3. Use generated hooks from `src/api/generated/`
4. **Never hand-edit** `src/api/generated/`

```typescript
const { data, isLoading, isError, error } = useGetDoctors();
```

Use hook `isLoading` / `isError` / `isPending` — do not duplicate with local `useState` loading flags for the same request.

## useEffect

Yellow flag for data fetching. Prefer Query hooks. Derive with `useMemo`; handle events in handlers. If `useEffect` is required, it must be justified.

## Mutations + UX

- Success / soft feedback → `sonner` toasts (booking success = toast, not a full success page)
- On settle, invalidate related query keys
- Auth mutations that set cookies must use the shared Axios instance with credentials

## Errors

Map API error codes to i18n messages on the frontend when possible. Prefer stable `code` from API over parsing free-text `message` for UI chrome (e.g. `AUTH_EMAIL_TAKEN`).
