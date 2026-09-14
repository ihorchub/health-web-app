import { boolean, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { userRoleEnum } from "./enums.js";

export const registrations = pgTable("registrations", {
  id: text("id").primaryKey(),
  role: userRoleEnum("role").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  acceptedPrivacy: boolean("accepted_privacy").notNull(),
  acceptedTerms: boolean("accepted_terms").notNull(),
  language: text("language"),
  theme: text("theme"),
  emailVerifyToken: text("email_verify_token").notNull(),
  emailVerifyExpiresAt: timestamp("email_verify_expires_at", { withTimezone: true }).notNull(),
  emailVerifySentAt: timestamp("email_verify_sent_at", { withTimezone: true }).notNull(),
  emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
  profileData: jsonb("profile_data"),
  profileCompletedAt: timestamp("profile_completed_at", { withTimezone: true }),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
