/// <reference types="node" />

import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;
if (!url) {
  throw new Error("Set DIRECT_URL or DATABASE_URL in apps/api/.env for migrations");
}

export default defineConfig({
  schema: [
    "./src/db/schema/enums.ts",
    "./src/db/schema/users.ts",
    "./src/db/schema/sessions.ts",
    "./src/db/schema/registrations.ts",
    "./src/db/schema/profiles.ts",
    "./src/db/schema/reference.ts",
    "./src/db/schema/doctor-schedule.ts",
  ],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
});
