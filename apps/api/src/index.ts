import "./config.js";

import cors from "@fastify/cors";
import Fastify from "fastify";

import { closeDatabase } from "./db/client.js";
import { config } from "./config.js";
import { healthRoutes } from "./routes/health.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: config.nodeEnv === "development" ? true : false,
  credentials: true,
});

await app.register(healthRoutes);

const start = async () => {
  if (!config.databaseUrl) {
    app.log.warn("DATABASE_URL not set — copy .env.example to apps/api/.env");
  }
  try {
    await app.listen({ port: config.port, host: config.host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

const shutdown = async () => {
  await app.close();
  await closeDatabase();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
