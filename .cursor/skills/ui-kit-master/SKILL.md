---
name: ui-kit-master
description: >-
  Guides MUI styling for Medicly using theme tokens and Emotion styled().
  Use when creating or styling UI components, building theme Light/Dark,
  fixing visual inconsistencies, or when MUI customization is needed.
  Never use inline sx or style.
---

# UI Kit Master (Medicly)

Customize MUI with **theme tokens** and **`styled()`**. Never use inline `sx` or `style`.

## Stack lock

- MUI + Emotion (`@mui/material`, `@emotion/styled`)
- Theme: Medicly tokens from Paper Foundation (navy / green / pink)
- Font: Manrope (self-hosted in `public/fonts` + `@font-face`)
- Icons: `@tabler/icons-react` only — not MUI icons

## Styling decision tree

```
Need to style?
│
├─ Global tokens / Light-Dark → src/theme/
├─ Reusable across features → src/theme/styles/ or shared styled in components/
├─ Component-specific → same file or components/{Name}/styles.ts
├─ Page/section-only → modules/{area}/{page}/ (styles.ts or styled in file)
└─ Responsive → theme.breakpoints inside styled()
```

**NEVER:** `sx`, inline `style`, hardcoded hex in components (use `theme.palette.*` / CSS vars from theme).

## Core pattern

```typescript
import { styled } from '@mui/material';

const Row = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,

  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(1),
  },
}));
```

Blank line before each `theme.breakpoints.*` block.

## Layout

- Prefer **flex**. Use CSS **grid** only when the Paper artboard is clearly a grid and flex would break the layout.
- Page chrome lives in `src/components/Layout/` — not in `src/layouts/` (those are route shells only).

## Theme

- Light + Dark full themes; toggle persists (localStorage).
- First visit follows OS preference; no white flash (`CssBaseline` + correct initial mode).
- Map Paper tokens (`--color-*`, radius, type scale) into MUI `createTheme`.
- **Primary green CTA** (`contained` + `color="primary"`): label text **and** icons are **always white** (`#FFFFFF`) in Light and Dark — do not use dark `onAccent` on the main button.

## File organization

| Scope | Where |
|---|---|
| Component-specific | `components/{Name}/styles.ts` or same file |
| Shared primitives | `components/Text/`, `components/Button/`, … |
| Cross-cutting theme helpers | `src/theme/styles/` |
| Module-only | inside `modules/.../` |

## Related

- Architecture / folders → `frontend-conventions`
- Paper → code workflow → `paper-to-frontend`
