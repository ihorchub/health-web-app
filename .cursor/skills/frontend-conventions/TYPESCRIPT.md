# TypeScript

## Hard rules

- No `any`
- Avoid `as` assertions — prefer type guards or generated types
- `import type` for type-only imports
- `@/` path alias for internal imports
- Strict mode

## Types

- Prefer `enum` for closed string sets used in app logic
- Named `interface` for object shapes — no inline parameter object types
- Prefer Orval-generated models from `src/api/generated/` over hand-rolled API DTOs
- If a server field is missing from OpenAPI, flag it — do not silently invent the FE type as source of truth
- Module types: `modules/.../types/` when needed

## Checklist when touching files

- [ ] no `any` / `@ts-ignore` / eslint-disable for types
- [ ] no cross-folder relative imports (use `@/`)
- [ ] type-only imports use `import type`
