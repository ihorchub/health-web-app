import { boolean, date, integer, jsonb, pgTable, text } from "drizzle-orm/pg-core";

import { doctorProfiles } from "./profiles.js";

export type WeeklyDayTemplate = {
  works: boolean;
  start?: string;
  end?: string;
  lunchStart?: string;
  lunchEnd?: string;
};

export type WeeklyTemplate = {
  monday: WeeklyDayTemplate;
  tuesday: WeeklyDayTemplate;
  wednesday: WeeklyDayTemplate;
  thursday: WeeklyDayTemplate;
  friday: WeeklyDayTemplate;
  saturday: WeeklyDayTemplate;
  sunday: WeeklyDayTemplate;
};

export const defaultWeeklyTemplate: WeeklyTemplate = {
  monday: { works: true, start: "09:00", end: "18:00", lunchStart: "13:00", lunchEnd: "14:00" },
  tuesday: { works: true, start: "09:00", end: "18:00", lunchStart: "13:00", lunchEnd: "14:00" },
  wednesday: { works: true, start: "09:00", end: "18:00", lunchStart: "13:00", lunchEnd: "14:00" },
  thursday: { works: true, start: "09:00", end: "18:00", lunchStart: "13:00", lunchEnd: "14:00" },
  friday: { works: true, start: "09:00", end: "18:00", lunchStart: "13:00", lunchEnd: "14:00" },
  saturday: { works: false },
  sunday: { works: false },
};

export const doctorSchedules = pgTable("doctor_schedules", {
  doctorUserId: text("doctor_user_id")
    .primaryKey()
    .references(() => doctorProfiles.userId, { onDelete: "cascade" }),
  basePriceUah: integer("base_price_uah").notNull().default(600),
  promoPriceUah: integer("promo_price_uah"),
  promoValidUntil: date("promo_valid_until"),
  supportedFormats: text("supported_formats").array().notNull(),
  weeklyTemplate: jsonb("weekly_template").$type<WeeklyTemplate>().notNull(),
  visibleInSearch: boolean("visible_in_search").notNull().default(true),
});
