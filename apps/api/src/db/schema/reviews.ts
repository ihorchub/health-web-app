import { integer, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

import { appointments } from "./appointments.js";
import { doctorProfiles, patientProfiles } from "./profiles.js";

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    appointmentId: text("appointment_id")
      .notNull()
      .references(() => appointments.id),
    patientId: text("patient_id")
      .notNull()
      .references(() => patientProfiles.userId),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctorProfiles.userId),
    rating: integer("rating").notNull(),
    text: text("text"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("reviews_appointment_id_uidx").on(table.appointmentId)],
);
