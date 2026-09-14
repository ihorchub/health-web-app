import type { FastifyPluginAsync } from "fastify";

import { checkDatabaseConnection } from "../db/client.js";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", async () => {
    let database: "connected" | "disconnected" | "not_configured" = "not_configured";
    if (process.env.DATABASE_URL) {
      database = (await checkDatabaseConnection()) ? "connected" : "disconnected";
    }
    return {
      ok: database === "connected",
      service: "medicly-api",
      database,
    };
  });

  app.get("/api/v1/health", async () => {
    let database: "connected" | "disconnected" | "not_configured" = "not_configured";
    if (process.env.DATABASE_URL) {
      database = (await checkDatabaseConnection()) ? "connected" : "disconnected";
    }
    return {
      ok: database === "connected",
      service: "medicly-api",
      database,
    };
  });
};
