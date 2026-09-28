import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

import { doctorProfiles, patientProfiles } from "./profiles.js";

export const patientFavourites = pgTable(
  "patient_favourites",
  {
    patientId: text("patient_id")
      .notNull()
      .references(() => patientProfiles.userId, { onDelete: "cascade" }),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctorProfiles.userId, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.patientId, table.doctorId] })],
);

export const patientRecentlyViewed = pgTable(
  "patient_recently_viewed",
  {
    patientId: text("patient_id")
      .notNull()
      .references(() => patientProfiles.userId, { onDelete: "cascade" }),
    doctorId: text("doctor_id")
      .notNull()
      .references(() => doctorProfiles.userId, { onDelete: "cascade" }),
    viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [primaryKey({ columns: [table.patientId, table.doctorId] })],
);
