# React patterns

## Components

- Function components only; **arrow functions** (`const X = () => {}`)
- Props `interface` at top of file
- Extract shared logic into hooks
- Prop drilling > 2 levels → module context
- No noise comments; `TODO`/`FIXME` only when needed

## State

| Scope | Tool |
|-------|------|
| Local UI | `useState` / `useReducer` |
| Server | TanStack Query (Orval hooks) |
| Theme / popups / session UI | React context |
| URL (filters, tabs) | Prefer `nuqs` when added; else ask before inventing |

No Redux store.

## Popups

Use `PopupsContext` + `Popups` enum — do not mount random `<Dialog>` from pages.

1. Register in `src/utils/popupUtils/popupTypes.ts`
2. Open: `updatePopup(Popups.X, true, payload?)`
3. Components live in `src/components/Popups/`
4. Wire into `AppPopups`

Booking wizard (SCR-03…05), visit detail, review, confirmations → this system.

## Icons

`@tabler/icons-react` only.

## Text primitives

Use `src/components/Text/` (`PageTitle`, `TitleH1`…, `Subtitle`, `Body`, `Meta`, `Overline`) — do not invent ad-hoc font sizes on pages.

## Routes

Route paths via enum in `src/utils/routeUtils/` — no hardcoded path strings in features.

## Performance (memo)

**Soft rule** (not Savvy-liberal):

- Use `useMemo` for expensive derived lists/objects
- Use `useCallback` when passing callbacks into heavy/memoized children
- Do **not** wrap every value/callback by default

## Naming

| Type | Convention |
|------|------------|
| Components / pages | `PascalCase.tsx` |
| Hooks | `use{Name}.ts` |
| Utils | `camelCase.ts` |
| Constants | `UPPER_SNAKE_CASE` |
| Enums | `PascalCase` + `UPPER_SNAKE` values |
