export type DoctorDayTab = 'visits' | 'past' | 'free' | 'cancellations';

export type DoctorVisitStatus =
  | 'upcoming'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

export type VisitFormat = 'offline' | 'online';

export type CancelledBy = 'patient' | 'doctor';

export interface DoctorDayVisit {
  id: string;
  startsAt: string;
  durationMinutes: number;
  patientName: string;
  status: DoctorVisitStatus;
  format: VisitFormat;
  reason?: string;
  cancelledBy?: CancelledBy;
  phone?: string;
  email?: string;
}

export interface FreeWindowSlot {
  id: string;
  start: string;
  end: string;
  slotsCount: number;
}

export interface WeekDaySummary {
  ymd: string;
  weekdayShort: string;
  dayNumber: number;
  visits: number;
  free: number;
  cancelled: number;
  isToday: boolean;
  isSelected: boolean;
}
