import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import { parseProfilePatchBody } from "../lib/profile-patch.js";
import {
  BulkCancelResponse,
  DoctorDashboardResponse,
  DoctorMeProfileDto,
  DoctorScheduleResponse,
  PatchDoctorScheduleBody,
} from "../openapi/schemas.js";
import {
  bulkCancelAppointments,
  getDoctorScheduleForUser,
  patchDoctorSchedule,
} from "../services/doctor-schedule.js";
import { getDoctorDashboard } from "../services/doctor-dashboard.js";
import { getDoctorProfile, patchDoctorProfile } from "../services/me-profile.js";

export const doctorScheduleRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/api/v1/doctors/me/schedule",
    {
      schema: {
        tags: ["doctor-schedule"],
        operationId: "getDoctorSchedule",
        response: { 200: DoctorScheduleResponse },
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
      return getDoctorScheduleForUser(request.sessionUser.id);
    },
  );

  app.patch(
    "/api/v1/doctors/me/schedule",
    {
      schema: {
        tags: ["doctor-schedule"],
        operationId: "patchDoctorSchedule",
        body: PatchDoctorScheduleBody,
        response: { 200: DoctorScheduleResponse },
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
      return patchDoctorSchedule(
        request.sessionUser.id,
        (request.body ?? {}) as Parameters<typeof patchDoctorSchedule>[1],
      );
    },
  );

  app.post(
    "/api/v1/doctors/me/schedule/bulk-cancel",
    {
      schema: {
        tags: ["doctor-schedule"],
        operationId: "postBulkCancel",
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
        response: { 200: BulkCancelResponse },
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
        tags: ["doctor-schedule"],
        operationId: "getDoctorMeDashboard",
        querystring: Type.Object({
          date: Type.Optional(Type.String()),
        }),
        response: { 200: DoctorDashboardResponse },
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
      const { date } = request.query as { date?: string };
      return getDoctorDashboard({ doctorId: request.sessionUser.id, date });
    },
  );

  app.get(
    "/api/v1/doctors/me/profile",
    {
      schema: {
        tags: ["doctor-schedule"],
        operationId: "getDoctorMeProfile",
        response: { 200: DoctorMeProfileDto },
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
      return getDoctorProfile(request.sessionUser.id);
    },
  );

  app.patch(
    "/api/v1/doctors/me/profile",
    {
      schema: {
        tags: ["doctor-schedule"],
        operationId: "patchDoctorMeProfile",
        response: { 200: DoctorMeProfileDto },
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      if (request.sessionUser.role !== "doctor") throw new ApiError("AUTH_FORBIDDEN", 403);
      const body = await parseProfilePatchBody(request);
      return patchDoctorProfile(request.sessionUser.id, body);
    },
  );
};
