import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import { getDb } from "../db/client.js";
import * as schema from "../db/schema/index.js";
import {
  defaultWeeklyTemplate,
  doctorSchedules,
  type WeeklyTemplate,
} from "../db/schema/doctor-schedule.js";
import { doctorProfiles } from "../db/schema/index.js";
import { ApiError } from "../lib/errors.js";

type Db = NodePgDatabase<typeof schema>;

export async function createDefaultDoctorSchedule(db: Db, doctorUserId: string): Promise<void> {
  await db.insert(doctorSchedules).values({
    doctorUserId,
    basePriceUah: 600,
    supportedFormats: ["offline"],
    weeklyTemplate: defaultWeeklyTemplate,
    visibleInSearch: true,
  });
}

export async function getDoctorScheduleForUser(doctorUserId: string) {
  const [schedule] = await getDb()
    .select()
    .from(doctorSchedules)
    .where(eq(doctorSchedules.doctorUserId, doctorUserId))
    .limit(1);

  if (!schedule) {
    throw new ApiError("AUTH_FORBIDDEN", 404);
  }

  const [profile] = await getDb()
    .select({
      visitDurationMinutes: doctorProfiles.visitDurationMinutes,
      specialty: doctorProfiles.specialty,
    })
    .from(doctorProfiles)
    .where(eq(doctorProfiles.userId, doctorUserId))
    .limit(1);

  return {
    doctorUserId,
    basePriceUah: schedule.basePriceUah,
    promoPriceUah: schedule.promoPriceUah,
    promoValidUntil: schedule.promoValidUntil,
    supportedFormats: schedule.supportedFormats,
    weeklyTemplate: schedule.weeklyTemplate as WeeklyTemplate,
    visibleInSearch: schedule.visibleInSearch,
    visitDurationMinutes: profile?.visitDurationMinutes ?? 30,
    specialty: profile?.specialty,
  };
}
