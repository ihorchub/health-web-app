import "./config.js";

import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import multipart from "@fastify/multipart";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import fp from "fastify-plugin";

import { config } from "./config.js";
import { errorsPlugin } from "./plugins/errors.js";
import { sessionPlugin } from "./plugins/session.js";
import { appointmentsRoutes } from "./routes/appointments.js";
import { authRoutes } from "./routes/auth.js";
import { doctorScheduleRoutes } from "./routes/doctor-schedule.js";
import { doctorsRoutes } from "./routes/doctors.js";
import { healthRoutes } from "./routes/health.js";
import { legalRoutes } from "./routes/legal.js";
import { notificationsRoutes } from "./routes/notifications.js";
import { patientsRoutes } from "./routes/patients.js";
import { referenceRoutes } from "./routes/reference.js";
import { uploadsRoutes } from "./routes/uploads.js";

export type AppOptions = {
  /** When true, skip swagger-ui (used by openapi:export). */
  docsUi?: boolean;
};

export async function buildApp(options: AppOptions = {}) {
  const docsUi = options.docsUi ?? config.nodeEnv === "development";
  const app = Fastify({ logger: true }).withTypeProvider<TypeBoxTypeProvider>();

  await app.register(cors, {
    origin: config.nodeEnv === "development" ? true : false,
    credentials: true,
  });

  await app.register(swagger, {
    openapi: {
      openapi: "3.0.3",
      info: {
        title: "Medicly API",
        version: "1.0.0",
        description: "Medicly MVP HTTP API. Cookie session: medicly_sid.",
      },
      // Paths keep `/api/v1/...`. FE Axios baseURL is `/api`, so Orval must strip the `/api` prefix
      // (see apps/web/orval.config.ts) or call with absolute `/api/v1` and empty baseURL.
      servers: [{ url: "/", description: "Same origin / proxied" }],
      tags: [
        { name: "health" },
        { name: "auth" },
        { name: "reference" },
        { name: "legal" },
        { name: "doctors" },
        { name: "patients" },
        { name: "appointments" },
        { name: "notifications" },
        { name: "doctor-schedule" },
      ],
      components: {
        securitySchemes: {
          cookieAuth: {
            type: "apiKey",
            in: "cookie",
            name: "medicly_sid",
          },
        },
      },
    },
  });

  if (docsUi) {
    await app.register(swaggerUi, {
      routePrefix: "/docs",
    });
  }

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
  await app.register(uploadsRoutes);
  await app.register(referenceRoutes);
  await app.register(authRoutes);
  await app.register(legalRoutes);
  await app.register(notificationsRoutes);
  await app.register(patientsRoutes);
  await app.register(doctorScheduleRoutes);
  await app.register(doctorsRoutes);
  await app.register(appointmentsRoutes);

  return app;
}
