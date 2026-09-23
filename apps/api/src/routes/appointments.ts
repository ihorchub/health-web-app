import { Type } from "@sinclair/typebox";
import type { FastifyPluginAsync } from "fastify";

import { ApiError } from "../lib/errors.js";
import {
  autoCompleteDueAppointments,
  bookAppointment,
  cancelAppointment,
  markCompleted,
  patientReschedule,
  type AppointmentRecord,
} from "../services/appointments.js";

const Format = Type.Union([Type.Literal("offline"), Type.Literal("online")]);

function toDto(appointment: AppointmentRecord) {
  const endAt = new Date(appointment.startAt.getTime() + appointment.durationMinutes * 60_000);
  return {
    id: appointment.id,
    doctorId: appointment.doctorId,
    startAt: appointment.startAt.toISOString(),
    endAt: endAt.toISOString(),
    format: appointment.format,
    status: appointment.status,
    reason: appointment.reason,
    visitDurationMinutes: appointment.durationMinutes,
  };
}

function requireRole(sessionUser: { role: string } | null, role: "patient" | "doctor"): void {
  if (!sessionUser) throw new ApiError("AUTH_UNAUTHORIZED", 401);
  if (sessionUser.role !== role) throw new ApiError("AUTH_FORBIDDEN", 403);
}

export const appointmentsRoutes: FastifyPluginAsync = async (app) => {
  // FLO-01 / SCR-05 — new book.
  app.post(
    "/api/v1/appointments",
    {
      schema: {
        body: Type.Object({
          doctorId: Type.String(),
          startAt: Type.String(),
          format: Format,
          reason: Type.Optional(Type.String()),
        }),
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

  // FLO-02 / SCR-05 — patient reschedules their own Upcoming appointment.
  app.post(
    "/api/v1/appointments/:id/reschedule",
    {
      schema: {
        params: Type.Object({ id: Type.String() }),
        body: Type.Object({
          newStartAt: Type.String(),
          format: Format,
          reason: Type.Optional(Type.String()),
        }),
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

  // FLO-04 — patient or doctor cancels (SCR-06 / SCR-08 / SCR-12).
  app.post(
    "/api/v1/appointments/:id/cancel",
    { schema: { params: Type.Object({ id: Type.String() }) } },
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

  // SCR-08 — doctor marks a visit Completed.
  app.post(
    "/api/v1/appointments/:id/complete",
    { schema: { params: Type.Object({ id: Type.String() }) } },
    async (request) => {
      requireRole(request.sessionUser, "doctor");
      const { id } = request.params as { id: string };

      const appointment = await markCompleted({ appointmentId: id, doctorId: request.sessionUser!.id });

      return { appointment: toDto(appointment) };
    },
  );
};

/** Auto-complete job (backend-spec.md): runs periodically, `Upcoming` -> `Completed` past end time. */
export function startAutoCompleteJob(intervalMs = 60_000): NodeJS.Timeout {
  return setInterval(() => {
    autoCompleteDueAppointments().catch((err) => {
      // eslint-disable-next-line no-console
      console.error("autoCompleteDueAppointments failed", err);
    });
  }, intervalMs);
}
