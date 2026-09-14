import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["patient", "doctor"]);
export const genderEnum = pgEnum("gender", ["female", "male"]);
export const specialtyEnum = pgEnum("specialty", [
  "family_doctor",
  "cardiologist",
  "dermatologist",
  "paediatrician",
]);
