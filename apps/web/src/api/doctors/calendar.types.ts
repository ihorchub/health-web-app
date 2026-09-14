/** Slot / day DTOs for GET /api/v1/doctors/:doctorId/calendar (SCR-04). */

export type SlotStatus = 'free' | 'taken' | 'reserved' | 'past' | 'day_off';

export type DayAvailabilityFlag =
  | 'has_free'
  | 'full'
  | 'day_off'
  | 'outside_window'
  | 'past';

export interface CalendarSlot {
  startAt: string;
  status: SlotStatus;
}

export interface CalendarDaySummary {
  date: string;
  flag: DayAvailabilityFlag;
}

export interface DoctorCalendarResponse {
  doctorId: string;
  zoneAStart: string;
  zoneAEnd: string;
  visitDurationMinutes: number;
  supportedFormats: Array<'offline' | 'online'>;
  days: CalendarDaySummary[];
  /** Slots for the requested `date` (ISO date). */
  slots: CalendarSlot[];
}

export interface DoctorCalendarParams {
  date?: string;
  from?: string;
  to?: string;
  contextAppointmentId?: string;
}
