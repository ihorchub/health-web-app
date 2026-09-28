import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import { parseProfilePatchBody } from "../lib/profile-patch.js";
import {
  addFavourite,
  clearRecentlyViewed,
  listFavourites,
  listRecentlyViewed,
  recordRecentlyViewed,
  removeFavourite,
} from "../services/patient-lists.js";
import { getPatientCabinet, listPatientAppointments } from "../services/patient-cabinet.js";
import { getPatientProfile, patchPatientProfile } from "../services/me-profile.js";
import { createReview, getPatientReviews } from "../services/reviews.js";

function requirePatient(sessionUser: { role: string } | null): void {
  if (!sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
  if (sessionUser.role !== "patient") throw new ApiError("AUTH_FORBIDDEN", 403);
}

export const patientsRoutes: FastifyPluginAsync = async (app) => {
  app.get("/api/v1/patients/me/cabinet", async (request) => {
    requirePatient(request.sessionUser);
    return getPatientCabinet(request.sessionUser!.id);
  });

  app.get("/api/v1/patients/me/appointments", async (request) => {
    requirePatient(request.sessionUser);
    return listPatientAppointments(request.sessionUser!.id);
  });

  app.get("/api/v1/patients/me/favourites", async (request) => {
    requirePatient(request.sessionUser);
    return listFavourites(request.sessionUser!.id);
  });

  app.post(
    "/api/v1/patients/me/favourites/:doctorId",
    { schema: { params: Type.Object({ doctorId: Type.String() }) } },
    async (request) => {
      requirePatient(request.sessionUser);
      const { doctorId } = request.params as { doctorId: string };
      return addFavourite(request.sessionUser!.id, doctorId);
    },
  );

  app.delete(
    "/api/v1/patients/me/favourites/:doctorId",
    { schema: { params: Type.Object({ doctorId: Type.String() }) } },
    async (request) => {
      requirePatient(request.sessionUser);
      const { doctorId } = request.params as { doctorId: string };
      return removeFavourite(request.sessionUser!.id, doctorId);
    },
  );

  app.get("/api/v1/patients/me/recently-viewed", async (request) => {
    requirePatient(request.sessionUser);
    return listRecentlyViewed(request.sessionUser!.id);
  });

  app.post(
    "/api/v1/patients/me/recently-viewed/:doctorId",
    { schema: { params: Type.Object({ doctorId: Type.String() }) } },
    async (request) => {
      requirePatient(request.sessionUser);
      const { doctorId } = request.params as { doctorId: string };
      return recordRecentlyViewed(request.sessionUser!.id, doctorId);
    },
  );

  app.delete("/api/v1/patients/me/recently-viewed", async (request) => {
    requirePatient(request.sessionUser);
    return clearRecentlyViewed(request.sessionUser!.id);
  });

  app.get("/api/v1/patients/me/reviews", async (request) => {
    requirePatient(request.sessionUser);
    return getPatientReviews(request.sessionUser!.id);
  });

  app.post(
    "/api/v1/reviews",
    {
      schema: {
        body: Type.Object({
          appointmentId: Type.String(),
          rating: Type.Integer({ minimum: 1, maximum: 5 }),
          text: Type.Optional(Type.String()),
        }),
      },
    },
    async (request, reply) => {
      requirePatient(request.sessionUser);
      const body = request.body as { appointmentId: string; rating: number; text?: string };
      const review = await createReview({
        patientId: request.sessionUser!.id,
        appointmentId: body.appointmentId,
        rating: body.rating,
        text: body.text,
      });
      reply.status(201);
      return { review };
    },
  );

  app.get("/api/v1/patients/me/profile", async (request) => {
    requirePatient(request.sessionUser);
    return getPatientProfile(request.sessionUser!.id);
  });

  app.patch("/api/v1/patients/me/profile", async (request) => {
    requirePatient(request.sessionUser);
    const body = await parseProfilePatchBody(request);
    return patchPatientProfile(request.sessionUser!.id, body);
  });
};
