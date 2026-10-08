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
import { doctorProfiles, patientProfiles } from "../db/schema/profiles.js";
import { ApiError } from "../lib/errors.js";
import { newId } from "../lib/ids.js";
import { loadDoctorForBooking, validateSlotOrThrow } from "./booking-validation.js";
import { createNotification } from "./notifications.js";

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

async function loadPatientDisplayName(userId: string): Promise<string> {
  const [row] = await getDb()
    .select({ firstName: patientProfiles.firstName, lastName: patientProfiles.lastName })
    .from(patientProfiles)
    .where(eq(patientProfiles.userId, userId))
    .limit(1);
  return row ? `${row.firstName} ${row.lastName}`.trim() : "";
}

async function loadDoctorDisplayName(userId: string): Promise<string> {
  const [row] = await getDb()
    .select({ firstName: doctorProfiles.firstName, lastName: doctorProfiles.lastName })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, userId))
    .limit(1);
  return row ? `${row.firstName} ${row.lastName}`.trim() : "";
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

  const appointment = await getAppointmentById(id);
  const patientName = await loadPatientDisplayName(input.patientId);
  await createNotification({
    userId: input.doctorId,
    type: "appointment_booked",
    payload: {
      appointmentId: id,
      patientId: input.patientId,
      patientName,
      startAt: appointment.startAt.toISOString(),
    },
  });
  return appointment;
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

  const updated = await getAppointmentById(input.appointmentId);
  const notifyUserId = input.actorRole === "patient" ? appointment.doctorId : appointment.patientId;
  const payload: Record<string, unknown> = {
    appointmentId: appointment.id,
    cancelledBy: input.actorRole,
    startAt: appointment.startAt.toISOString(),
  };
  if (input.actorRole === "patient") {
    payload.patientName = await loadPatientDisplayName(appointment.patientId);
  } else {
    payload.doctorName = await loadDoctorDisplayName(appointment.doctorId);
  }
  await createNotification({
    userId: notifyUserId,
    type: "appointment_cancelled",
    payload,
  });
  return updated;
}

export type MarkCompletedInput = {
  appointmentId: string;
  doctorId: string;
  now?: Date;
};

export async function markCompleted(input: MarkCompletedInput): Promise<AppointmentRecord> {
  const now = input.now ?? new Date();
  const appointment = await getAppointmentById(input.appointmentId);
  if (appointment.doctorId !== input.doctorId) throw new ApiError("APPOINTMENT_FORBIDDEN", 403);
  if (appointment.status !== "Upcoming") throw new ApiError("APPOINTMENT_INVALID_TRANSITION", 409);
  // Manual complete only from visit start (cancel remains available before start).
  if (now.getTime() < appointment.startAt.getTime()) {
    throw new ApiError("APPOINTMENT_TOO_EARLY_TO_COMPLETE", 409);
  }

  await getDb()
    .update(appointments)
    .set({ status: "Completed", completedAt: now })
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
  // Upcoming (FLO-02) or Reschedule Pending pick-another (FLO-03 / SCR-12).
  if (old.status !== "Upcoming" && old.status !== "Reschedule Pending") {
    throw new ApiError("APPOINTMENT_INVALID_TRANSITION", 409);
  }

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
      await tx
        .update(appointments)
        .set({ status: "Rescheduled", proposedStartAt: null })
        .where(eq(appointments.id, old.id));
    });
  } catch (err) {
    if (isUniqueViolation(err)) throw new ApiError("SLOT_TAKEN", 409);
    throw err;
  }

  const result = {
    oldAppointment: await getAppointmentById(old.id),
    newAppointment: await getAppointmentById(newAppointmentId),
  };
  const patientName = await loadPatientDisplayName(input.patientId);
  await createNotification({
    userId: old.doctorId,
    type: "appointment_rescheduled",
    payload: {
      oldAppointmentId: old.id,
      newAppointmentId,
      patientId: input.patientId,
      patientName,
      startAt: input.newStartAt.toISOString(),
    },
  });
  return result;
}

export type DoctorProposeInput = {
  appointmentId: string;
  doctorId: string;
  proposedStartAt: Date;
  format?: AppointmentFormat;
  now?: Date;
};

export async function doctorPropose(input: DoctorProposeInput): Promise<AppointmentRecord> {
  const now = input.now ?? new Date();
  const appointment = await getAppointmentById(input.appointmentId);
  if (appointment.doctorId !== input.doctorId) throw new ApiError("APPOINTMENT_FORBIDDEN", 403);
  if (appointment.status === "Reschedule Pending") {
    throw new ApiError("APPOINTMENT_PENDING_EXISTS", 409);
  }
  if (appointment.status !== "Upcoming") throw new ApiError("APPOINTMENT_INVALID_TRANSITION", 409);

  if (input.proposedStartAt.getTime() === appointment.startAt.getTime()) {
    throw new ApiError("AUTH_VALIDATION_FAILED", 400, { proposedStartAt: "SAME_AS_CURRENT" });
  }

  // Patient needs ≥20 minutes to respond before the soonest relevant start.
  if (proposalExpiryDeadlineMs(appointment.startAt, input.proposedStartAt, now) <= now.getTime()) {
    throw new ApiError("AUTH_VALIDATION_FAILED", 400, { proposedStartAt: "TOO_LATE_FOR_PROPOSAL" });
  }

  const doctor = await loadDoctorForBooking(appointment.doctorId);
  const format = input.format ?? appointment.format;
  if (!doctor.supportedFormats.includes(format)) {
    throw new ApiError("AUTH_VALIDATION_FAILED", 400, { format: "UNSUPPORTED" });
  }
  await validateSlotOrThrow({ doctor, startAt: input.proposedStartAt, now });

  try {
    await getDb()
      .update(appointments)
      .set({
        status: "Reschedule Pending",
        proposedStartAt: input.proposedStartAt,
        format,
      })
      .where(eq(appointments.id, appointment.id));
  } catch (err) {
    if (isUniqueViolation(err)) throw new ApiError("SLOT_TAKEN", 409);
    throw err;
  }

  const updated = await getAppointmentById(appointment.id);
  const doctorName = await loadDoctorDisplayName(appointment.doctorId);
  await createNotification({
    userId: appointment.patientId,
    type: "reschedule_proposed",
    payload: {
      appointmentId: appointment.id,
      proposedStartAt: input.proposedStartAt.toISOString(),
      doctorName,
      startAt: appointment.startAt.toISOString(),
    },
  });
  return updated;
}

export async function getPendingDecision(input: {
  appointmentId: string;
  patientId: string;
}): Promise<{
  appointmentId: string;
  doctorId: string;
  status: AppointmentStatus;
  originalStartAt: string;
  proposedStartAt: string;
  format: AppointmentFormat;
  durationMinutes: number;
  reason: string | null;
}> {
  const appointment = await getAppointmentById(input.appointmentId);
  if (appointment.patientId !== input.patientId) throw new ApiError("APPOINTMENT_FORBIDDEN", 403);
  if (appointment.status !== "Reschedule Pending" || !appointment.proposedStartAt) {
    throw new ApiError("APPOINTMENT_INVALID_TRANSITION", 409);
  }

  return {
    appointmentId: appointment.id,
    doctorId: appointment.doctorId,
    status: appointment.status,
    originalStartAt: appointment.startAt.toISOString(),
    proposedStartAt: appointment.proposedStartAt.toISOString(),
    format: appointment.format,
    durationMinutes: appointment.durationMinutes,
    reason: appointment.reason,
  };
}

export async function patientAcceptProposal(input: {
  appointmentId: string;
  patientId: string;
  now?: Date;
}): Promise<PatientRescheduleResult> {
  const now = input.now ?? new Date();
  const old = await getAppointmentById(input.appointmentId);
  if (old.patientId !== input.patientId) throw new ApiError("APPOINTMENT_FORBIDDEN", 403);
  if (old.status !== "Reschedule Pending" || !old.proposedStartAt) {
    throw new ApiError("APPOINTMENT_INVALID_TRANSITION", 409);
  }

  const doctor = await loadDoctorForBooking(old.doctorId);
  await validateSlotOrThrow({
    doctor,
    startAt: old.proposedStartAt,
    now,
    ignoreAppointmentId: old.id,
  });

  const newAppointmentId = newId("apt");
  try {
    await getDb().transaction(async (tx) => {
      await tx.insert(appointments).values({
        id: newAppointmentId,
        doctorId: old.doctorId,
        patientId: input.patientId,
        startAt: old.proposedStartAt!,
        durationMinutes: doctor.visitDurationMinutes,
        format: old.format,
        reason: old.reason,
        status: "Upcoming",
        replacesAppointmentId: old.id,
      });
      await tx
        .update(appointments)
        .set({ status: "Rescheduled", proposedStartAt: null })
        .where(eq(appointments.id, old.id));
    });
  } catch (err) {
    if (isUniqueViolation(err)) throw new ApiError("SLOT_TAKEN", 409);
    throw err;
  }

  const result = {
    oldAppointment: await getAppointmentById(old.id),
    newAppointment: await getAppointmentById(newAppointmentId),
  };
  const patientName = await loadPatientDisplayName(input.patientId);
  await createNotification({
    userId: old.doctorId,
    type: "proposal_accepted",
    payload: {
      oldAppointmentId: old.id,
      newAppointmentId,
      patientId: input.patientId,
      patientName,
      startAt: old.proposedStartAt!.toISOString(),
    },
  });
  return result;
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

/** Lead time before a visit when an unanswered proposal expires. */
export const PROPOSAL_RESPONSE_LEAD_MS = 20 * 60_000;

/**
 * Deadline for patient response: 20 minutes before the soonest *still-relevant* start.
 * - Always includes the proposed time.
 * - Includes the original only while it is still in the future (so a late propose onto a
 *   future slot is not instantly expired just because the old time already passed).
 */
export function proposalExpiryDeadlineMs(
  startAt: Date,
  proposedStartAt: Date,
  now: Date = new Date(),
): number {
  const candidates = [proposedStartAt.getTime()];
  if (startAt.getTime() > now.getTime()) {
    candidates.push(startAt.getTime());
  }
  return Math.min(...candidates) - PROPOSAL_RESPONSE_LEAD_MS;
}

/**
 * If the patient has not answered by the proposal deadline, drop the proposal: back to
 * `Upcoming` at the original time, release the reserved slot, notify both parties.
 */
export async function expireStalePendingProposals(now: Date = new Date()): Promise<number> {
  const db = getDb();
  const pendingRows = await db
    .select({
      id: appointments.id,
      doctorId: appointments.doctorId,
      patientId: appointments.patientId,
      startAt: appointments.startAt,
      proposedStartAt: appointments.proposedStartAt,
    })
    .from(appointments)
    .where(eq(appointments.status, "Reschedule Pending"));

  const due = pendingRows.filter((row) => {
    if (!row.proposedStartAt) return false;
    return proposalExpiryDeadlineMs(row.startAt, row.proposedStartAt, now) <= now.getTime();
  });

  let expired = 0;
  for (const row of due) {
    const updated = await db
      .update(appointments)
      .set({ status: "Upcoming", proposedStartAt: null })
      .where(and(eq(appointments.id, row.id), eq(appointments.status, "Reschedule Pending")))
      .returning({ id: appointments.id });

    if (updated.length === 0) continue;
    expired += 1;

    const patientName = await loadPatientDisplayName(row.patientId);
    const doctorName = await loadDoctorDisplayName(row.doctorId);
    const payload = {
      appointmentId: row.id,
      startAt: row.startAt.toISOString(),
      patientName,
      doctorName,
    };
    await createNotification({
      userId: row.patientId,
      type: "proposal_expired",
      payload,
    });
    await createNotification({
      userId: row.doctorId,
      type: "proposal_expired",
      payload,
    });
  }

  return expired;
}

/** Run proposal expiry then auto-complete (order matters for reverted Upcoming). */
export async function runAppointmentMaintenance(now: Date = new Date()): Promise<void> {
  await expireStalePendingProposals(now);
  await autoCompleteDueAppointments(now);
}
