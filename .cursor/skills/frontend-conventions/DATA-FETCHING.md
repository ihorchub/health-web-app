# Data fetching

## Stack

| Layer | Tool |
|-------|------|
| HTTP | Axios (`src/api/mutator/`) |
| Codegen | Orval → React Query hooks + models |
| Cache / server state | `@tanstack/react-query` |

No Redux, no RTK Query, no Apollo.

## Workflow

1. Backend OpenAPI → `frontend/openapi/openapi.json` (or agreed path)
2. `yarn generate:api` (Orval)
3. Use generated hooks from `src/api/`
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

## Errors

Map API error codes to i18n messages on the frontend when possible. Prefer stable `code` from API over parsing free-text `message` for UI chrome.
