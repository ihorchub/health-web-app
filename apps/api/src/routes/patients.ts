import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import { parseProfilePatchBody } from "../lib/profile-patch.js";
import {
  CreateReviewResponse,
  FavouriteAddResponse,
  FavouriteRemoveResponse,
  OkTrue,
  PatientAppointmentsResponse,
  PatientCabinetResponse,
  PatientDoctorListResponse,
  PatientProfileDto,
  PatientReviewsResponse,
} from "../openapi/schemas.js";
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
  app.get(
    "/api/v1/patients/me/cabinet",
    {
      schema: {
        tags: ["patients"],
        operationId: "getPatientCabinet",
        response: { 200: PatientCabinetResponse },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      return getPatientCabinet(request.sessionUser!.id);
    },
  );

  app.get(
    "/api/v1/patients/me/appointments",
    {
      schema: {
        tags: ["patients"],
        operationId: "getPatientAppointments",
        response: { 200: PatientAppointmentsResponse },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      return listPatientAppointments(request.sessionUser!.id);
    },
  );

  app.get(
    "/api/v1/patients/me/favourites",
    {
      schema: {
        tags: ["patients"],
        operationId: "getFavourites",
        response: { 200: PatientDoctorListResponse },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      return listFavourites(request.sessionUser!.id);
    },
  );

  app.post(
    "/api/v1/patients/me/favourites/:doctorId",
    {
      schema: {
        tags: ["patients"],
        operationId: "postFavourite",
        params: Type.Object({ doctorId: Type.String() }),
        response: { 200: FavouriteAddResponse },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      const { doctorId } = request.params as { doctorId: string };
      return addFavourite(request.sessionUser!.id, doctorId);
    },
  );

  app.delete(
    "/api/v1/patients/me/favourites/:doctorId",
    {
      schema: {
        tags: ["patients"],
        operationId: "deleteFavourite",
        params: Type.Object({ doctorId: Type.String() }),
        response: { 200: FavouriteRemoveResponse },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      const { doctorId } = request.params as { doctorId: string };
      return removeFavourite(request.sessionUser!.id, doctorId);
    },
  );

  app.get(
    "/api/v1/patients/me/recently-viewed",
    {
      schema: {
        tags: ["patients"],
        operationId: "getRecentlyViewed",
        response: { 200: PatientDoctorListResponse },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      return listRecentlyViewed(request.sessionUser!.id);
    },
  );

  app.post(
    "/api/v1/patients/me/recently-viewed/:doctorId",
    {
      schema: {
        tags: ["patients"],
        operationId: "postRecentlyViewed",
        params: Type.Object({ doctorId: Type.String() }),
        response: { 200: OkTrue },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      const { doctorId } = request.params as { doctorId: string };
      return recordRecentlyViewed(request.sessionUser!.id, doctorId);
    },
  );

  app.delete(
    "/api/v1/patients/me/recently-viewed",
    {
      schema: {
        tags: ["patients"],
        operationId: "deleteRecentlyViewed",
        response: { 200: OkTrue },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      return clearRecentlyViewed(request.sessionUser!.id);
    },
  );

  app.get(
    "/api/v1/patients/me/reviews",
    {
      schema: {
        tags: ["patients"],
        operationId: "getPatientReviews",
        response: { 200: PatientReviewsResponse },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      return getPatientReviews(request.sessionUser!.id);
    },
  );

  app.post(
    "/api/v1/reviews",
    {
      schema: {
        tags: ["patients"],
        operationId: "postReview",
        body: Type.Object({
          appointmentId: Type.String(),
          rating: Type.Integer({ minimum: 1, maximum: 5 }),
          text: Type.Optional(Type.String()),
        }),
        response: { 201: CreateReviewResponse },
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

  app.get(
    "/api/v1/patients/me/profile",
    {
      schema: {
        tags: ["patients"],
        operationId: "getPatientProfile",
        response: { 200: PatientProfileDto },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      return getPatientProfile(request.sessionUser!.id);
    },
  );

  app.patch(
    "/api/v1/patients/me/profile",
    {
      schema: {
        tags: ["patients"],
        operationId: "patchPatientProfile",
        response: { 200: PatientProfileDto },
      },
    },
    async (request) => {
      requirePatient(request.sessionUser);
      const body = await parseProfilePatchBody(request);
      return patchPatientProfile(request.sessionUser!.id, body);
    },
  );
};
