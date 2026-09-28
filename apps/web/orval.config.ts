import { defineConfig } from 'orval';

/**
 * Regenerates TanStack Query hooks + models from the exported OpenAPI document.
 * Run from repo root: `pnpm generate:api` (exports OpenAPI then orval).
 */
export default defineConfig({
  medicly: {
    input: {
      target: './openapi/openapi.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/generated/models',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      override: {
        mutator: {
          path: './src/api/mutator/customInstance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
