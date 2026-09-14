# Module architecture

## Tree (Savvy-aligned)

```
apps/web/
├── public/fonts/              # Manrope woff2
├── public/brand/              # logos, Lika, hero, avatars
├── openapi/
├── orval.config.ts
└── src/
    ├── api/                   # Orval generated + mutator (do not hand-edit generated/)
    ├── assets/                # optional local imports; brand PNGs live in public/brand/
    ├── components/            # Shared UI kit
    │   ├── Layout/            # Visual shell: Header, Footer, page wrappers, onboarding chrome
    │   ├── Popups/            # Shared modals + AppPopups registry
    │   ├── Text/              # PageTitle, TitleH1…, Subtitle, Body, Meta…
    │   ├── Button/
    │   ├── Form/
    │   ├── Loading/
    │   └── …                  # one folder per component or group
    ├── layouts/               # Route shells only: guards + <Outlet /> (no page chrome)
    ├── modules/               # Feature pages
    │   ├── auth/
    │   │   ├── login/         # page folder
    │   │   │   ├── index.tsx
    │   │   │   ├── components/
    │   │   │   ├── hooks/
    │   │   │   └── utils/
    │   │   └── signup/
    │   ├── search/            # SCR-02
    │   ├── booking/           # SCR-03…05 wizard
    │   ├── patient-room/      # SCR-06
    │   ├── profile/           # SCR-07
    │   ├── doctor-day/        # SCR-08
    │   ├── working-hours/     # SCR-09
    │   └── shared/            # only if a page is truly cross-role
    ├── theme/
    ├── context/               # theme, popups, user…
    ├── hooks/
    ├── i18n/
    ├── routes/
    ├── types/
    ├── utils/
    ├── App.tsx
    ├── main.tsx
    └── index.css              # @font-face Manrope
```

## Encapsulation

| Used by | Lives in |
|---|---|
| One page/feature only | `modules/{area}/{page}/` |
| Multiple modules | `src/components/` |
| Route access only | `src/layouts/` + `components/RouteGuards/` |
| Cross-role shared **page** | `modules/shared/{page}/` |

`modules/shared/` ≠ `layouts/`. Shared = shared screens. Layouts = Outlet shells.

## Module page shape

```
modules/{area}/{page}/
├── index.tsx          # page entry
├── components/        # sections for this page only
├── hooks/
├── utils/
└── form/              # if non-trivial form (fields, validation)
```

## UI / logic separation

Pages/components hold JSX. Extract logic into hooks/utils.

## Brand assets

- Runtime source: `apps/web/public/brand/` (`logo/`, `lika-poses/`, `hero/`, `doctor-avatars/`)
- Reference via public URLs (e.g. `/brand/logo/medicly-logo-header-light@2x.png`) — not Vite `import` of brand PNGs
- Do not regenerate Lika — use the PNGs from Paper (transparent RGBA)
