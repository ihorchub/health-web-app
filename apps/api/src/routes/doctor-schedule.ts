import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import { getDoctorScheduleForUser } from "../services/doctor-schedule.js";

export const doctorScheduleRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/v1/doctors/me/schedule", async (request) => {
    if (!request.sessionUser) {
      throw new ApiError("AUTH_UNAUTHORIZED", 401);
    }
    if (request.sessionUser.role !== "doctor") {
      throw new ApiError("AUTH_FORBIDDEN", 403);
    }
    return getDoctorScheduleForUser(request.sessionUser.id);
  });
};
