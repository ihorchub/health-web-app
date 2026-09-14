import { pgTable, text } from "drizzle-orm/pg-core";

export const cities = pgTable("cities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const clinics = pgTable("clinics", {
  id: text("id").primaryKey(),
  cityId: text("city_id")
    .notNull()
    .references(() => cities.id),
  name: text("name").notNull(),
});
