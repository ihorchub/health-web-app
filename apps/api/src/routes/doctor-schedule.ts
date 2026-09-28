import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import { parseProfilePatchBody } from "../lib/profile-patch.js";
import {
  bulkCancelAppointments,
  getDoctorScheduleForUser,
  patchDoctorSchedule,
} from "../services/doctor-schedule.js";
import { getDoctorDashboard } from "../services/doctor-dashboard.js";
import { getDoctorProfile, patchDoctorProfile } from "../services/me-profile.js";

export const doctorScheduleRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/v1/doctors/me/schedule", async (request) => {
    if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
    if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
    return getDoctorScheduleForUser(request.sessionUser.id);
  });

  app.patch("/api/v1/doctors/me/schedule", async (request) => {
    if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
    if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
    return patchDoctorSchedule(request.sessionUser.id, (request.body ?? {}) as Record<string, unknown>);
  });

  app.post(
    "/api/v1/doctors/me/schedule/bulk-cancel",
    {
      schema: {
        body: Type.Object({
          scope: Type.Union([
            Type.Literal("whole_day"),
            Type.Literal("rest_of_day"),
            Type.Literal("rest_of_week"),
            Type.Literal("custom_range"),
          ]),
          from: Type.Optional(Type.String()),
          to: Type.Optional(Type.String()),
          confirm: Type.Boolean(),
        }),
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
      const body = request.body as {
        scope: "whole_day" | "rest_of_day" | "rest_of_week" | "custom_range";
        from?: string;
        to?: string;
        confirm: boolean;
      };
      return bulkCancelAppointments({
        doctorId: request.sessionUser.id,
        scope: body.scope,
        from: body.from,
        to: body.to,
        confirm: body.confirm,
      });
    },
  );

  app.get(
    "/api/v1/doctors/me/dashboard",
    {
      schema: {
        querystring: Type.Object({
          date: Type.Optional(Type.String()),
        }),
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
      const { date } = request.query as { date?: string };
      return getDoctorDashboard({ doctorId: request.sessionUser.id, date });
    },
  );

  app.get("/api/v1/doctors/me/profile", async (request) => {
    if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
    if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
    return getDoctorProfile(request.sessionUser.id);
  });

  app.patch("/api/v1/doctors/me/profile", async (request) => {
    if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
    if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
    const body = await parseProfilePatchBody(request);
    return patchDoctorProfile(request.sessionUser.id, body);
  });
};
