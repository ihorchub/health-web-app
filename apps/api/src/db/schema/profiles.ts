import { date, integer, pgTable, text } from "drizzle-orm/pg-core";

import { genderEnum, specialtyEnum } from "./enums.js";
import { users } from "./users.js";

export const patientProfiles = pgTable("patient_profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dob: date("dob").notNull(),
  gender: genderEnum("gender").notNull(),
  phone: text("phone"),
  photoUrl: text("photo_url"),
  homeCityId: text("home_city_id").notNull(),
  homeClinicId: text("home_clinic_id").notNull(),
  language: text("language"),
  theme: text("theme"),
});

export const doctorProfiles = pgTable("doctor_profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dob: date("dob").notNull(),
  phone: text("phone"),
  cityId: text("city_id").notNull(),
  clinicId: text("clinic_id").notNull(),
  specialty: specialtyEnum("specialty").notNull(),
  yearsPractice: integer("years_practice").notNull(),
  visitDurationMinutes: integer("visit_duration_minutes").notNull(),
  photoUrl: text("photo_url"),
  licenseFileUrl: text("license_file_url"),
  bio: text("bio"),
  languages: text("languages").array(),
  language: text("language"),
  theme: text("theme"),
});
