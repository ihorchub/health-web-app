import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import {
  AppointmentMutationResponse,
  BookAppointmentResponse,
  PendingDecisionResponse,
  ReschedulePairResponse,
} from "../openapi/schemas.js";
import {
  runAppointmentMaintenance,
  bookAppointment,
  cancelAppointment,
  getPendingDecision,
  markCompleted,
  patientAcceptProposal,
  patientReschedule,
  type AppointmentRecord,
} from "../services/appointments.js";

const Format = Type.Union([Type.Literal("offline"), Type.Literal("online")]);

function toDto(appointment: AppointmentRecord) {
  const endAt = new Date(appointment.startAt.getTime() + appointment.durationMinutes * 60_000);
  return {
    id: appointment.id,
    doctorId: appointment.doctorId,
    patientId: appointment.patientId,
    startAt: appointment.startAt.toISOString(),
    endAt: endAt.toISOString(),
    format: appointment.format,
    status: appointment.status,
    reason: appointment.reason,
    visitDurationMinutes: appointment.durationMinutes,
    proposedStartAt: appointment.proposedStartAt?.toISOString() ?? null,
    cancelledBy: appointment.cancelledBy,
  };
}

function requireRole(sessionUser: { role: string } | null, role: "patient" | "doctor"): void {
  if (!sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
  if (sessionUser.role !== role) throw new ApiError("AUTH_FORBIDDEN", 403);
}

export const appointmentsRoutes: FastifyPluginAsync = async (app) => {
  app.post(
    "/api/v1/appointments",
    {
      schema: {
        tags: ["appointments"],
        operationId: "postBookAppointment",
        body: Type.Object({
          doctorId: Type.String(),
          startAt: Type.String(),
          format: Format,
          reason: Type.Optional(Type.String()),
        }),
        response: { 201: BookAppointmentResponse },
      },
    },
    async (request, reply) => {
      requireRole(request.sessionUser, "patient");
      const { doctorId, startAt, format, reason } = request.body as {
        doctorId: string;
        startAt: string;
        format: "offline" | "online";
        reason?: string;
      };

      const appointment = await bookAppointment({
        doctorId,
        patientId: request.sessionUser!.id,
        startAt: new Date(startAt),
        format,
        reason,
      });

      reply.status(201);
      return { appointment: toDto(appointment) };
    },
  );

  app.post(
    "/api/v1/appointments/:id/reschedule",
    {
      schema: {
        tags: ["appointments"],
        operationId: "postRescheduleAppointment",
        params: Type.Object({ id: Type.String() }),
        body: Type.Object({
          newStartAt: Type.String(),
          format: Format,
          reason: Type.Optional(Type.String()),
        }),
        response: { 200: ReschedulePairResponse },
      },
    },
    async (request) => {
      requireRole(request.sessionUser, "patient");
      const { id } = request.params as { id: string };
      const { newStartAt, format, reason } = request.body as {
        newStartAt: string;
        format: "offline" | "online";
        reason?: string;
      };

      const { oldAppointment, newAppointment } = await patientReschedule({
        appointmentId: id,
        patientId: request.sessionUser!.id,
        newStartAt: new Date(newStartAt),
        format,
        reason,
      });

      return { oldAppointment: toDto(oldAppointment), newAppointment: toDto(newAppointment) };
    },
  );

  app.post(
    "/api/v1/appointments/:id/cancel",
    {
      schema: {
        tags: ["appointments"],
        operationId: "postCancelAppointment",
        params: Type.Object({ id: Type.String() }),
        response: { 200: AppointmentMutationResponse },
      },
    },
    async (request) => {
      if (!request.sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
      const { id } = request.params as { id: string };

      const appointment = await cancelAppointment({
        appointmentId: id,
        actorId: request.sessionUser.id,
        actorRole: request.sessionUser.role,
      });

      return { appointment: toDto(appointment) };
    },
  );

  app.post(
    "/api/v1/appointments/:id/complete",
    {
      schema: {
        tags: ["appointments"],
        operationId: "postCompleteAppointment",
        params: Type.Object({ id: Type.String() }),
        response: { 200: AppointmentMutationResponse },
      },
    },
    async (request) => {
      requireRole(request.sessionUser, "doctor");
      const { id } = request.params as { id: string };

      const appointment = await markCompleted({ appointmentId: id, doctorId: request.sessionUser!.id });

      return { appointment: toDto(appointment) };
    },
  );

  app.get(
    "/api/v1/appointments/:id/pending-decision",
    {
      schema: {
        tags: ["appointments"],
        operationId: "getPendingDecision",
        params: Type.Object({ id: Type.String() }),
        response: { 200: PendingDecisionResponse },
      },
    },
    async (request) => {
      requireRole(request.sessionUser, "patient");
      const { id } = request.params as { id: string };
      return getPendingDecision({ appointmentId: id, patientId: request.sessionUser!.id });
    },
  );

  app.post(
    "/api/v1/appointments/:id/accept-proposal",
    {
      schema: {
        tags: ["appointments"],
        operationId: "postAcceptProposal",
        params: Type.Object({ id: Type.String() }),
        response: { 200: ReschedulePairResponse },
      },
    },
    async (request) => {
      requireRole(request.sessionUser, "patient");
      const { id } = request.params as { id: string };
      const { oldAppointment, newAppointment } = await patientAcceptProposal({
        appointmentId: id,
        patientId: request.sessionUser!.id,
      });
      return { oldAppointment: toDto(oldAppointment), newAppointment: toDto(newAppointment) };
    },
  );
};

export function startAutoCompleteJob(intervalMs = 60_000): NodeJS.Timeout {
  void runAppointmentMaintenance().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("runAppointmentMaintenance failed", err);
  });
  return setInterval(() => {
    runAppointmentMaintenance().catch((err) => {
      // eslint-disable-next-line no-console
      console.error("runAppointmentMaintenance failed", err);
    });
  }, intervalMs);
}
