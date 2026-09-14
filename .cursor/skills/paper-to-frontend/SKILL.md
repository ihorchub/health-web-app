---
name: paper-to-frontend
description: >-
  Transfers Medicly screen designs from Paper into the frontend codebase.
  Use when implementing a SCR page, chrome, theme, or component from Paper,
  when the user mentions Paper, Inventive moon, artboards, or design-to-code
  for this product. Follows ui-kit-master and frontend-conventions.
---

# Paper → Frontend (Medicly)

Implement UI from the Paper file **Inventive moon**:  
https://app.paper.design/file/01M0D5RXPB3F6XJZ814DFZDMEZ

## Source priority

1. **Behaviour:** `docs/spec/product-spec.md` (+ `ia-chrome-decision.md` on chrome)
2. **Visual / layout / fields on screen:** Paper artboards (design wins on UI conflicts)
3. **Contracts:** keep frontend/backend Contract blocks aligned when touching API shape
4. Do not invent SCR IDs or Open product decisions

**SCR-02** page `04 · SCR-02 - Search and results` is **FINAL** — do not redesign.

## Before coding

1. Load **frontend-conventions** + **ui-kit-master**
2. Open the correct Paper page / default Desktop Light UK artboard (and mobile / dark as needed)
3. Use Paper tools for truth:
   - `get_basic_info` / `open_file` — pages & artboards
   - `get_tree_summary` / `get_children` — structure
   - `get_jsx` + `get_computed_styles` — structure & exact values
   - `get_screenshot` — visual QA only (not a source for hex/spacing guesses)
   - Image fills: prefer **original PNG URLs** / export PNG (RGBA). Do not ship JPEG previews from `get_fill_image` as production assets
4. Map artboard → `modules/{area}/{page}/` (see ARCHITECTURE)

## Implementation order (project-level)

1. Skeleton (`frontend/`: Vite, yarn, ESLint, deps)
2. Theme Light/Dark + Manrope
3. Shared kit: `components/Layout`, `Text`, `Popups`, Header/Footer variants
4. Screens (suggested): SCR-02 → cabinets SCR-06/08 → wizard SCR-03…05 → SCR-01/07/09

When implementing **one** screen, still reuse kit first — do not duplicate header/footer.

## Per-screen checklist

- [ ] Correct role chrome (Guest / Patient / Doctor)
- [ ] Desktop + mobile from Paper
- [ ] Light + Dark (or note gap and ask)
- [ ] All copy via i18n namespaces (UK default)
- [ ] States: default, loading, empty, error (and success toast where Paper shows snackbar)
- [ ] Mascot pose from `docs/brand/lika-poses/` when Paper uses Lika
- [ ] Data via Orval/TanStack hooks — no fake `useEffect` fetch
- [ ] Styles: `styled()` + theme; page-only styles in module; shared in `components/`
- [ ] Popups via Popups context for modals
- [ ] QA against Paper screenshot after meaningful UI

## Assets

| Asset | Location |
|-------|----------|
| Lika poses | `docs/brand/lika-poses/*.png` → app `src/assets/` |
| Logos | `docs/brand/logo/*` → app `src/assets/` |
| Font | Manrope self-host `public/fonts` |

Do not regenerate Lika. Transparent RGBA only.

## Explicit non-goals of this skill

- Writing backend/OpenAPI (separate later skill)
- Changing product rules marked Open
- “Improving” locked SCR-02 visuals
