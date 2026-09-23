import { sql } from "drizzle-orm";
import { type AnyPgColumn, integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { appointmentFormatEnum, appointmentStatusEnum, cancelledByEnum } from "./enums.js";
import { doctorProfiles, patientProfiles } from "./profiles.js";

/**
 * backend-spec.md "Appointment state machine" + "Slots and double booking".
 *
 * `appointments_doctor_start_occupied_uidx` is the DB-level double-booking guard (R-03,
 * FLO-06): only one row per (doctor, start_at) may be in a status that occupies that
 * instant. A concurrent second insert for the same doctor+time hits this unique index and
 * fails, which the service layer turns into the `SLOT_TAKEN` error.
 */
export const appointments = pgTable(
  "appointments",
  {
    id: text("id").primaryKey(),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctorProfiles.userId),
    patientId: text("patient_id")
      .notNull()
      .references(() => patientProfiles.userId),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    durationMinutes: integer("duration_minutes").notNull(),
    format: appointmentFormatEnum("format").notNull(),
    reason: text("reason"),
    status: appointmentStatusEnum("status").notNull(),
    cancelledBy: cancelledByEnum("cancelled_by"),
    proposedStartAt: timestamp("proposed_start_at", { withTimezone: true }),
    replacesAppointmentId: text("replaces_appointment_id").references((): AnyPgColumn => appointments.id),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("appointments_doctor_start_occupied_uidx")
      .on(table.doctorId, table.startAt)
      .where(sql`${table.status} IN ('Upcoming', 'Reschedule Pending')`),
  ],
);
