import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import { getDoctorCalendar } from "../services/calendar.js";

/** SCR-04 Calendar — "GET calendar requires patient session" (backend-spec.md, Decision 31 Aug 2026). */
export const doctorsRoutes: FastifyPluginAsync = async (app) => {
  app.get(
    "/api/v1/doctors/:doctorId/calendar",
    {
      schema: {
        params: Type.Object({ doctorId: Type.String() }),
        querystring: Type.Object({
          date: Type.Optional(Type.String()),
          from: Type.Optional(Type.String()),
          to: Type.Optional(Type.String()),
          contextAppointmentId: Type.Optional(Type.String()),
        }),
      },
    },
    async (request) => {
      if (!request.sessionUser) {
        throw new ApiError("AUTH_UNAUTHORIZED", 401);
      }
      if (request.sessionUser.role !== "patient") {
        throw new ApiError("AUTH_FORBIDDEN", 403);
      }

      const { doctorId } = request.params as { doctorId: string };
      const { date, from, to, contextAppointmentId } = request.query as {
        date?: string;
        from?: string;
        to?: string;
        contextAppointmentId?: string;
      };

      return getDoctorCalendar({
        doctorId,
        patientId: request.sessionUser.id,
        date,
        from,
        to,
        contextAppointmentId,
      });
    },
  );
};
