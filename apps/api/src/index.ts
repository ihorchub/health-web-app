import "./config.js";

import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import fp from "fastify-plugin";

import { closeDatabase } from "./db/client.js";
import { config } from "./config.js";
import { errorsPlugin } from "./plugins/errors.js";
import { sessionPlugin } from "./plugins/session.js";
import { authRoutes } from "./routes/auth.js";
import { doctorScheduleRoutes } from "./routes/doctor-schedule.js";
import { healthRoutes } from "./routes/health.js";
import { legalRoutes } from "./routes/legal.js";
import { referenceRoutes } from "./routes/reference.js";

const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

await app.register(cors, {
  origin: config.nodeEnv === "development" ? true : false,
  credentials: true,
});

await app.register(errorsPlugin);
await app.register(cookie, {
  secret: config.sessionSecret ?? "dev-insecure-secret-change-me",
  hook: "onRequest",
});
if (!config.sessionSecret) {
  app.log.warn("SESSION_SECRET not set — using insecure dev default for cookies");
}
await app.register(multipart, {
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});
await app.register(fp(sessionPlugin, { name: "medicly-session" }));
await app.register(healthRoutes);
await app.register(referenceRoutes);
await app.register(authRoutes);
await app.register(legalRoutes);
await app.register(doctorScheduleRoutes);

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
