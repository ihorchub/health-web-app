import type { FastifyPluginAsync } from "fastify";

import { checkDatabaseConnection } from "../db/client.js";
import { HealthResponse } from "../openapi/schemas.js";

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get("/health", {
    schema: {
      tags: ["health"],
      operationId: "getHealth",
      response: { 200: HealthResponse },
    },
  }, async () => {
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

  app.get("/api/v1/health", {
    schema: {
      tags: ["health"],
      operationId: "getApiV1Health",
      response: { 200: HealthResponse },
    },
  }, async () => {
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
