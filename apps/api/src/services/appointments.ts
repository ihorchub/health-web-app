/**
 * Appointment commands — backend-spec.md "Appointment state machine" + "Slots and double booking".
 *
 * Double-booking guard: every write here goes through the DB unique partial index
 * `appointments_doctor_start_occupied_uidx` (doctor_id, start_at) WHERE status occupies that
 * instant. A concurrent second writer for the same doctor+time gets a Postgres unique
 * violation (23505), which we translate to `SLOT_TAKEN` (FLO-06).
 */
import { and, eq, inArray } from "drizzle-orm";

import { getDb } from "../db/client.js";
import { appointments } from "../db/schema/appointments.js";
import { ApiError } from "../lib/errors.js";
import { newId } from "../lib/ids.js";
import { loadDoctorForBooking, validateSlotOrThrow } from "./booking-validation.js";

export type AppointmentFormat = "offline" | "online";
export type AppointmentStatus = "Upcoming" | "Reschedule Pending" | "Completed" | "Cancelled" | "Rescheduled";
export type CancelledBy = "patient" | "doctor";

export type AppointmentRecord = {
  id: string;
  doctorId: string;
  patientId: string;
  startAt: Date;
  durationMinutes: number;
  format: AppointmentFormat;
  reason: string | null;
  status: AppointmentStatus;
  cancelledBy: CancelledBy | null;
  proposedStartAt: Date | null;
  replacesAppointmentId: string | null;
  completedAt: Date | null;
  createdAt: Date;
};

const UNIQUE_VIOLATION = "23505";

function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === UNIQUE_VIOLATION;
}

export async function getAppointmentById(id: string): Promise<AppointmentRecord> {
  const [row] = await getDb().select().from(appointments).where(eq(appointments.id, id)).limit(1);
  if (!row) throw new ApiError("APPOINTMENT_NOT_FOUND", 404);
  return row as AppointmentRecord;
}

export type BookAppointmentInput = {
  doctorId: string;
  patientId: string;
  startAt: Date;
  format: AppointmentFormat;
  reason?: string;
  now?: Date;
};

export async function bookAppointment(input: BookAppointmentInput): Promise<AppointmentRecord> {
  const now = input.now ?? new Date();
  const doctor = await loadDoctorForBooking(input.doctorId);

  if (!doctor.supportedFormats.includes(input.format)) {
    throw new ApiError("AUTH_VALIDATION_FAILED", 400, { format: "UNSUPPORTED" });
  }

  await validateSlotOrThrow({ doctor, startAt: input.startAt, now });

  const id = newId("apt");
  try {
    await getDb().insert(appointments).values({
      id,
      doctorId: input.doctorId,
      patientId: input.patientId,
      startAt: input.startAt,
      durationMinutes: doctor.visitDurationMinutes,
      format: input.format,
      reason: input.reason?.trim() ? input.reason.trim() : null,
      status: "Upcoming",
    });
  } catch (err) {
    if (isUniqueViolation(err)) throw new ApiError("SLOT_TAKEN", 409);
    throw err;
  }

  return getAppointmentById(id);
}

export type CancelAppointmentInput = {
  appointmentId: string;
  actorId: string;
  actorRole: CancelledBy;
};

const CANCELLABLE_STATUSES: AppointmentStatus[] = ["Upcoming", "Reschedule Pending"];

export async function cancelAppointment(input: CancelAppointmentInput): Promise<AppointmentRecord> {
  const appointment = await getAppointmentById(input.appointmentId);
  const owns =
    input.actorRole === "patient" ? appointment.patientId === input.actorId : appointment.doctorId === input.actorId;
  if (!owns) throw new ApiError("APPOINTMENT_FORBIDDEN", 403);
  if (!CANCELLABLE_STATUSES.includes(appointment.status)) {
    throw new ApiError("APPOINTMENT_INVALID_TRANSITION", 409);
  }

  await getDb()
    .update(appointments)
    .set({ status: "Cancelled", cancelledBy: input.actorRole, proposedStartAt: null })
    .where(eq(appointments.id, input.appointmentId));

  return getAppointmentById(input.appointmentId);
}

export type MarkCompletedInput = {
  appointmentId: string;
  doctorId: string;
  now?: Date;
};

export async function markCompleted(input: MarkCompletedInput): Promise<AppointmentRecord> {
  const appointment = await getAppointmentById(input.appointmentId);
  if (appointment.doctorId !== input.doctorId) throw new ApiError("APPOINTMENT_FORBIDDEN", 403);
  if (appointment.status !== "Upcoming") throw new ApiError("APPOINTMENT_INVALID_TRANSITION", 409);

  await getDb()
    .update(appointments)
    .set({ status: "Completed", completedAt: input.now ?? new Date() })
    .where(eq(appointments.id, input.appointmentId));

  return getAppointmentById(input.appointmentId);
}

export type PatientRescheduleInput = {
  appointmentId: string;
  patientId: string;
  newStartAt: Date;
  format: AppointmentFormat;
  reason?: string;
  now?: Date;
};

export type PatientRescheduleResult = {
  oldAppointment: AppointmentRecord;
  newAppointment: AppointmentRecord;
};

export async function patientReschedule(input: PatientRescheduleInput): Promise<PatientRescheduleResult> {
  const now = input.now ?? new Date();
  const old = await getAppointmentById(input.appointmentId);
  if (old.patientId !== input.patientId) throw new ApiError("APPOINTMENT_FORBIDDEN", 403);
  // Reschedule Pending must go through the SCR-12 decision commands, not a direct move (backend-spec.md).
  if (old.status !== "Upcoming") throw new ApiError("APPOINTMENT_INVALID_TRANSITION", 409);

  const doctor = await loadDoctorForBooking(old.doctorId);
  if (!doctor.supportedFormats.includes(input.format)) {
    throw new ApiError("AUTH_VALIDATION_FAILED", 400, { format: "UNSUPPORTED" });
  }
  await validateSlotOrThrow({ doctor, startAt: input.newStartAt, now });

  const newAppointmentId = newId("apt");
  try {
    await getDb().transaction(async (tx) => {
      await tx.insert(appointments).values({
        id: newAppointmentId,
        doctorId: old.doctorId,
        patientId: input.patientId,
        startAt: input.newStartAt,
        durationMinutes: doctor.visitDurationMinutes,
        format: input.format,
        reason: input.reason?.trim() ? input.reason.trim() : old.reason,
        status: "Upcoming",
        replacesAppointmentId: old.id,
      });
      await tx.update(appointments).set({ status: "Rescheduled" }).where(eq(appointments.id, old.id));
    });
  } catch (err) {
    if (isUniqueViolation(err)) throw new ApiError("SLOT_TAKEN", 409);
    throw err;
  }

  return {
    oldAppointment: await getAppointmentById(old.id),
    newAppointment: await getAppointmentById(newAppointmentId),
  };
}

/**
 * System job (backend-spec.md "Auto-complete job"): `Upcoming` -> `Completed` once
 * `start_at + duration_minutes` has passed. Never touches `Reschedule Pending`.
 */
export async function autoCompleteDueAppointments(now: Date = new Date()): Promise<number> {
  const db = getDb();
  const dueRows = await db
    .select({ id: appointments.id, startAt: appointments.startAt, durationMinutes: appointments.durationMinutes })
    .from(appointments)
    .where(eq(appointments.status, "Upcoming"));

  const dueIds = dueRows
    .filter((row) => row.startAt.getTime() + row.durationMinutes * 60_000 <= now.getTime())
    .map((row) => row.id);

  if (dueIds.length === 0) return 0;

  await db
    .update(appointments)
    .set({ status: "Completed", completedAt: now })
    .where(and(eq(appointments.status, "Upcoming"), inArray(appointments.id, dueIds)));

  return dueIds.length;
}
