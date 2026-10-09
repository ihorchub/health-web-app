import { integer, pgTable, text } from "drizzle-orm/pg-core";

import { educationKindEnum } from "./enums.js";
import { doctorProfiles } from "./profiles.js";

export const doctorEducation = pgTable("doctor_education", {
  id: text("id").primaryKey(),
  doctorUserId: text("doctor_user_id")
    .notNull()
    .references(() => doctorProfiles.userId, { onDelete: "cascade" }),
  kind: educationKindEnum("kind").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  yearFrom: integer("year_from").notNull(),
  yearTo: integer("year_to"),
  imageUrl: text("image_url"),
});
