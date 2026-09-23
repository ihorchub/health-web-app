import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["patient", "doctor"]);
export const genderEnum = pgEnum("gender", ["female", "male"]);
export const specialtyEnum = pgEnum("specialty", [
  "family_doctor",
  "cardiologist",
  "dermatologist",
  "paediatrician",
]);
export const appointmentFormatEnum = pgEnum("appointment_format", ["offline", "online"]);
export const appointmentStatusEnum = pgEnum("appointment_status", [
  "Upcoming",
  "Reschedule Pending",
  "Completed",
  "Cancelled",
  "Rescheduled",
]);
export const cancelledByEnum = pgEnum("cancelled_by", ["patient", "doctor"]);
