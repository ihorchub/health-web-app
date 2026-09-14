---
name: frontend-conventions
description: >-
  Enforces Medicly frontend conventions: folder structure, React patterns,
  forms, TypeScript, i18n, and data fetching with TanStack Query + Orval.
  ALWAYS use when writing, reviewing, or organizing frontend code under
  frontend/ — components, modules, hooks, theme, routes, or i18n.
---

# Frontend Conventions (Medicly)

React + TypeScript + Vite + MUI. Data: **TanStack Query + Orval + Axios** (no Redux/RTK). Forms: **React Hook Form + Yup**. Package manager: **yarn**. Lint: **ESLint + Prettier**.

## Reference files

Load only what the task needs:

| File | When |
|------|------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | New files, folder structure, modules vs components |
| [FORMS.md](FORMS.md) | Forms, validation, FieldName |
| [PATTERNS.md](PATTERNS.md) | Components, popups, icons, routes, memo |
| [TYPESCRIPT.md](TYPESCRIPT.md) | Types, `any`, imports |
| [DATA-FETCHING.md](DATA-FETCHING.md) | API hooks, Orval, loading/error |
| [I18N.md](I18N.md) | EN/UK, namespaces, user data vs chrome |

## Related skills

- **ui-kit-master** — MUI `styled()`, theme, no `sx`
- **paper-to-frontend** — implementing a screen from Paper
- Specs: `docs/spec/product-spec.md` wins on behaviour; Paper wins on UI shape. `ia-chrome-decision.md` wins on chrome conflicts.

## Hard locks

- No Redux / RTK Query / Apollo / Formik in new code
- No AG Grid (not this product)
- Alias `@/` → `src/`
- SCR IDs from product spec only — do not invent screens
