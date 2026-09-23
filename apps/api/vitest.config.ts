import { resolve } from "node:path";

import { config as loadEnv } from "dotenv";
import { defineConfig } from "vitest/config";

loadEnv({ path: resolve(process.cwd(), ".env") });

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    testTimeout: 15000,
    hookTimeout: 15000,
  },
});
