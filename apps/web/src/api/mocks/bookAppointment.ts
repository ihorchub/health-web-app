import { SlotTakenError } from '@/api/appointments/errors';
import type {
  BookAppointmentBody,
  BookAppointmentResponse,
} from '@/api/appointments/types';
import { DoctorNotFoundError } from '@/api/doctors/errors';
import { findMockDoctor } from '@/api/mocks/doctorsFixtures';
import { mockVisitDurationMinutes } from '@/api/mocks/doctorCalendar';
import { getZoneARange, isDateInRange } from '@/utils/dateUtils/rollingMonth';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const bookedKeys = new Set<string>();

/** Mock POST /api/v1/appointments — FLO-01; SLOT_TAKEN on :00 slots + already booked (R-03). */
export const mockPostBookAppointment = async (
  body: BookAppointmentBody,
): Promise<BookAppointmentResponse> => {
  await delay(420);

  const doctor = findMockDoctor(body.doctorId);
  if (!doctor) {
    throw new DoctorNotFoundError();
  }

  const datePart = body.startAt.slice(0, 10);
  const { zoneAStart, zoneAEnd } = getZoneARange();
  if (!isDateInRange(datePart, zoneAStart, zoneAEnd)) {
    const error = new Error('SLOT_OUTSIDE_WINDOW') as Error & { code: string };
    error.code = 'SLOT_OUTSIDE_WINDOW';
    throw error;
  }

  const key = `${body.doctorId}|${body.startAt}`;
  const isOnTheHour = /T\d{2}:00:00/.test(body.startAt);

  // Demo refusal: every on-the-hour free chip fails (FLO-06); half-hours succeed.
  if (isOnTheHour || bookedKeys.has(key)) {
    throw new SlotTakenError();
  }

  bookedKeys.add(key);

  const duration = mockVisitDurationMinutes(body.doctorId);
  const startMs = Date.parse(body.startAt);
  const endAt = Number.isFinite(startMs)
    ? new Date(startMs + duration * 60_000).toISOString()
    : body.startAt;

  return {
    appointment: {
      id: `apt_${Date.now().toString(36)}`,
      doctorId: body.doctorId,
      startAt: body.startAt,
      endAt,
      format: body.format,
      status: 'Upcoming',
      reason: body.reason?.trim() ? body.reason.trim() : null,
      visitDurationMinutes: duration,
    },
  };
};
