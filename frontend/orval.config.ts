import { defineConfig } from 'orval';

/**
 * Placeholder Orval config. Point `input.target` at a real OpenAPI file when
 * the backend spec is ready, then run `yarn generate:api`.
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
      override: {
        mutator: {
          path: './src/api/mutator/customInstance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
