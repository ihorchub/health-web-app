/** GET /api/v1/doctors/:doctorId/calendar — backend-spec.md SCR-04. */
import {
  addCalendarDays,
  compareCalendarDates,
  formatCalendarDate,
  getZoneABounds,
  parseCalendarDate,
  weekdayKeyForDate,
  type CalendarDate,
} from "../lib/booking-horizon.js";
import { ApiError } from "../lib/errors.js";
import { getAppointmentById } from "./appointments.js";
import { dayBoundsUtc, loadDoctorForBooking, loadOccupancyInRange } from "./booking-validation.js";
import { generateDaySlots, getDayFlag, type CalendarSlot, type OccupancyEntry } from "./slots.js";

const MAX_RANGE_DAYS = 120;

export type DoctorCalendarDaySummary = { date: string; flag: ReturnType<typeof getDayFlag> };

export type DoctorCalendarResult = {
  doctorId: string;
  zoneAStart: string;
  zoneAEnd: string;
  visitDurationMinutes: number;
  supportedFormats: Array<"offline" | "online">;
  days: DoctorCalendarDaySummary[];
  slots: CalendarSlot[];
};

export type GetDoctorCalendarInput = {
  doctorId: string;
  patientId: string;
  date?: string;
  from?: string;
  to?: string;
  contextAppointmentId?: string;
  now?: Date;
};

export async function getDoctorCalendar(input: GetDoctorCalendarInput): Promise<DoctorCalendarResult> {
  const now = input.now ?? new Date();
  const doctor = await loadDoctorForBooking(input.doctorId);
  const zoneBounds = getZoneABounds(now);

  if (input.contextAppointmentId) {
    const ctx = await getAppointmentById(input.contextAppointmentId);
    if (ctx.doctorId !== input.doctorId || ctx.patientId !== input.patientId || ctx.status !== "Upcoming") {
      throw new ApiError("APPOINTMENT_FORBIDDEN", 403);
    }
  }

  const requestedDate = input.date ? parseCalendarDate(input.date) : zoneBounds.zoneAStartDate;

  let rangeStart = requestedDate;
  let rangeEnd = requestedDate;
  if (input.from && input.to) {
    const fromDate = parseCalendarDate(input.from);
    const toDate = parseCalendarDate(input.to);
    rangeStart = compareCalendarDates(fromDate, requestedDate) < 0 ? fromDate : requestedDate;
    rangeEnd = compareCalendarDates(toDate, requestedDate) > 0 ? toDate : requestedDate;
  }

  const { startUtc: rangeStartUtc } = dayBoundsUtc(rangeStart);
  const { startUtc: rangeEndExclusiveUtc } = dayBoundsUtc(addCalendarDays(rangeEnd, 1));
  const occupancy = await loadOccupancyInRange(input.doctorId, rangeStartUtc, rangeEndExclusiveUtc);

  const slotsForDate = (dateLocal: CalendarDate) => {
    const dateIso = formatCalendarDate(dateLocal);
    if (doctor.vacationDates.includes(dateIso)) {
      return [] as CalendarSlot[];
    }
    const bounds = dayBoundsUtc(dateLocal);
    const dayOccupancy: OccupancyEntry[] = occupancy.filter(
      (entry) => entry.startAt.getTime() >= bounds.startUtc.getTime() && entry.startAt.getTime() < bounds.endExclusiveUtc.getTime(),
    );
    const template = doctor.weeklyTemplate[weekdayKeyForDate(dateLocal)];
    return generateDaySlots({
      dateLocal,
      template,
      visitDurationMinutes: doctor.visitDurationMinutes,
      occupied: dayOccupancy,
      now,
      zoneBounds,
    });
  };

  const slots = slotsForDate(requestedDate);

  const days: DoctorCalendarDaySummary[] = [];
  if (input.from && input.to) {
    let cursor = parseCalendarDate(input.from);
    const toDate = parseCalendarDate(input.to);
    for (let i = 0; i < MAX_RANGE_DAYS && compareCalendarDates(cursor, toDate) <= 0; i += 1) {
      const daySlots = slotsForDate(cursor);
      const template = doctor.weeklyTemplate[weekdayKeyForDate(cursor)];
      days.push({
        date: formatCalendarDate(cursor),
        flag: getDayFlag({ dateLocal: cursor, template, zoneBounds, slots: daySlots }),
      });
      cursor = addCalendarDays(cursor, 1);
    }
  }

  return {
    doctorId: input.doctorId,
    zoneAStart: formatCalendarDate(zoneBounds.zoneAStartDate),
    zoneAEnd: formatCalendarDate(zoneBounds.zoneAEndDate),
    visitDurationMinutes: doctor.visitDurationMinutes,
    supportedFormats: doctor.supportedFormats,
    days,
    slots,
  };
}
