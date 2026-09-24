import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import { getDoctorCalendar } from "../services/calendar.js";
import { getDoctorById } from "../services/doctors-profile.js";
import { searchDoctors } from "../services/doctors-search.js";

/** SCR-02 Search + SCR-03 Profile + SCR-04 Calendar — backend-spec.md. */
export const doctorsRoutes: FastifyPluginAsync = async (app) => {
  // Register static `/search` before `/:doctorId/...` paths.
  app.get(
    "/api/v1/doctors/search",
    {
      schema: {
        querystring: Type.Object({
          q: Type.Optional(Type.String()),
          cityId: Type.Optional(Type.String()),
          clinicId: Type.Optional(Type.String()),
          specialty: Type.Optional(Type.String()),
          format: Type.Optional(
            Type.Union([
              Type.Literal("offline"),
              Type.Literal("online"),
              Type.Literal("both"),
            ]),
          ),
          date: Type.Optional(Type.String()),
          minRating: Type.Optional(Type.Number()),
          priceMin: Type.Optional(Type.Number()),
          priceMax: Type.Optional(Type.Number()),
          sort: Type.Optional(
            Type.Union([Type.Literal("rating"), Type.Literal("nearest_slot")]),
          ),
          cursor: Type.Optional(Type.String()),
          limit: Type.Optional(Type.Number()),
        }),
      },
    },
    async (request) => {
      const query = request.query as {
        q?: string;
        cityId?: string;
        clinicId?: string;
        specialty?: string;
        format?: "offline" | "online" | "both";
        date?: string;
        minRating?: number;
        priceMin?: number;
        priceMax?: number;
        sort?: "rating" | "nearest_slot";
        cursor?: string;
        limit?: number;
      };

      return searchDoctors({
        ...query,
        sessionUser: request.sessionUser,
      });
    },
  );

  app.get(
    "/api/v1/doctors/:doctorId",
    {
      schema: {
        params: Type.Object({ doctorId: Type.String() }),
      },
    },
    async (request) => {
      const { doctorId } = request.params as { doctorId: string };
      return getDoctorById({
        doctorId,
        sessionUser: request.sessionUser,
      });
    },
  );

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
