# Review Checklist (Medicly)

Apply in Step 4. Focus on **changed lines** only.

Stack locks (any new use → 🔴): Redux / RTK Query / Apollo / Formik / AG Grid / `@mui/icons-material`.

---

## 🔴 Blockers — must fix before merging

### Data fetching
- API call inside `for` / `forEach` / `map` → N+1 (prefer batch endpoint)
- `useEffect` used for data fetching → TanStack Query / Orval hook
- Hand-edited files under `apps/web/src/api/generated/`
- Ad-hoc fake arrays in JSX — mocks belong in `src/api/mocks/` (or domain wrappers); pages import public hooks only
- Invented endpoint / DTO that contradicts `docs/spec/backend-spec.md` Contract (same SCR/R IDs)
- Manual `useState` loading/error duplicating Query hook `isLoading` / `isError` / `isPending`

### TypeScript
- `any` (explicit or obvious inference escape)
- `// @ts-ignore` / `// @ts-expect-error` without a justified, temporary reason
- `as SomeType` where a type guard or generated type would work
- Blanket `eslint-disable` without a documented, specific reason

### Styling (ui-kit-master)
- Inline `sx` or `style` on new/changed UI
- Hardcoded hex / raw spacing where `theme.palette.*` / `theme.spacing` exists
- Brand PNGs imported via Vite instead of `/brand/...` public URLs

### Product / i18n
- New SCR ID or screen not in product spec
- User-facing string hardcoded in JSX (must be `t('namespace:key')` with EN + UK)
- Inventing Open product decisions

### Code quality
- Non-trivial logic (transform/filter/compute) left in page/component body instead of hook/util
- `function` keyword for components/helpers → `const name = () => {}`
- Inline object parameter type → named `interface`
- Mounting random `<Dialog>` from a page instead of `PopupsContext` + `Popups` enum

---

## 🟡 Warnings — should fix

### Styling
- Prefer flex; CSS grid only when Paper clearly requires it
- Missing blank line before `theme.breakpoints.*` in `styled()`
- Ad-hoc font sizes on pages instead of `src/components/Text/` primitives
- Icons from libraries other than `@tabler/icons-react`

### React patterns
- `useEffect` for pure state derivation → prefer derive / `useMemo` when needed
- Prop drilling > 2 levels → suggest module context
- Blanket `useMemo` / `useCallback` on every value (soft rule: only expensive derives or heavy memoized children)

### Navigation & feedback
- Hardcoded route path strings → enum in `src/utils/routeUtils/`
- `alert` / `window.confirm` / ad-hoc MUI Snackbar → `sonner`
- New popup not registered / not under `src/components/Popups/`

### Data & forms
- Feature importing `src/api/mocks/` directly
- Formik in new code; Yup schema inline in component; field names as raw strings (use `form/fields.ts` + `FieldName`, `form/validation.ts`)
- Auth/cookie calls not using shared Axios mutator with credentials

### Structure
- Feature-only file dumped in root `src/hooks/` or `src/components/` → `modules/<area>/<page>/`
- Generic util buried in a module → `src/utils/`
- Component missing props `interface` at top of file
- Cross-folder relative imports → `@/`
- Type-only value imports → `import type`

### i18n
- Only one locale updated when chrome strings changed
- Specialty/status labels from API `name` when an id + i18n catalog exists
- Machine-translated or single-locale doctor bio when dual `descriptionUk` / `descriptionEn` is required

---

## 🔵 Suggestions — nice to have

- Co-locate leftover files with their feature module
- Extract a hook from a growing page
- Reuse schema helpers in `src/utils/schemaUtils/`
- `useMemo` / `useCallback` only where cost or child re-renders clearly justify it
- After language toggle, remount routed tree (`key={language}`) if stale labels/filters are a risk
