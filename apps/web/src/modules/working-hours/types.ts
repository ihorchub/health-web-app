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
  /** Profile-level promo (display only); not a Zone B range override. */
  promoPriceUah: number | null;
  /** Inclusive Kyiv calendar day; promo hidden after this date. */
  promoValidUntil: string | null;
}

/** Read-only snapshot of a Zone B range plan. */
export type ZoneBSavedInfo = ZoneAParams;

/** One saved Zone B override shown in the plans section below the zone panels. */
export type ZoneBPlannedRange = {
  from: string;
  to: string;
  label: string;
  plan: ZoneBSavedInfo;
  dayOff: boolean;
};

export interface WorkingHoursSettings {
  zoneA: ZoneAParams;
  zoneB: ZoneBFormState;
  zoneAStartYmd: string;
  zoneAEndYmd: string;
  zoneBStartYmd: string;
  appointmentDays: string[];
  vacationDates: string[];
}
