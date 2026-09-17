export type BulkCancelScope = 'today' | 'rest_of_day' | 'rest_of_week' | 'custom';

export type VisitDurationMinutes = 20 | 30 | 45;

export type SupportedFormat = 'offline' | 'online' | 'both';

export interface ZoneAParams {
  workStart: string;
  workEnd: string;
  lunchStart: string;
  lunchEnd: string;
  format: SupportedFormat;
  durationMinutes: VisitDurationMinutes;
  priceUah: number;
}

export interface ZoneBFormState extends ZoneAParams {
  vacationDayOff: boolean;
  customDuration?: number;
}

export interface WorkingHoursSettings {
  zoneA: ZoneAParams;
  zoneB: ZoneBFormState;
  zoneAStartYmd: string;
  zoneAEndYmd: string;
  zoneBStartYmd: string;
  appointmentDays: string[];
}
