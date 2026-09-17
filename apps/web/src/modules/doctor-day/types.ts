export type DoctorDayTab = 'visits' | 'pending' | 'free' | 'cancellations';

export type DoctorVisitStatus =
  | 'upcoming'
  | 'reschedule_pending'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'reserved';

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
  pendingNote?: string;
  proposedTime?: string;
}

export interface FreeWindowSlot {
  id: string;
  start: string;
  end: string;
  slotsCount: number;
}

export interface PendingPatientRow {
  id: string;
  patientName: string;
  fromTime: string;
  toTime: string;
}

export interface WeekDaySummary {
  ymd: string;
  weekdayShort: string;
  dayNumber: number;
  visits: number;
  free: number;
  pending: number;
  cancelled: number;
  isToday: boolean;
  isSelected: boolean;
}
