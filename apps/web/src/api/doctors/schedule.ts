import {
  getDoctorSchedule as generatedGetDoctorSchedule,
  patchDoctorSchedule as generatedPatchDoctorSchedule,
  postBulkCancel as generatedPostBulkCancel,
} from '@/api/generated/doctor-schedule/doctor-schedule';

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

export type ZoneBOverride = {
  from: string;
  to: string;
  supportedFormats?: Array<'offline' | 'online'>;
  visitDurationMinutes?: number;
  workStart?: string;
  workEnd?: string;
  lunchStart?: string;
  lunchEnd?: string;
  basePriceUah?: number;
  dayOff?: boolean;
};

export interface DoctorScheduleResponse {
  doctorUserId: string;
  basePriceUah: number;
  promoPriceUah: number | null;
  promoValidUntil: string | null;
  supportedFormats: Array<'offline' | 'online'>;
  weeklyTemplate: WeeklyTemplate;
  vacationDates: string[];
  zoneBOverrides: ZoneBOverride[];
  visibleInSearch: boolean;
  visitDurationMinutes: number;
  specialty?: string;
  zoneAStart: string;
  zoneAEnd: string;
  zoneBStart: string;
  zoneBEnd: string;
  frozenInZoneA: {
    hours: boolean;
    duration: boolean;
    basePrice: boolean;
  };
}

export type PatchDoctorScheduleBody = {
  zoneBWeeklyTemplate?: WeeklyTemplate;
  zoneBVisitDurationMinutes?: number;
  vacationDates?: string[];
  supportedFormats?: Array<'offline' | 'online'>;
  basePriceUah?: number;
  basePriceEffectiveFrom?: string;
  promoPriceUah?: number | null;
  promoValidUntil?: string | null;
  zoneBOverride?: ZoneBOverride;
};

export type BulkCancelScope = 'whole_day' | 'rest_of_day' | 'rest_of_week' | 'custom_range';

export type BulkCancelBody = {
  scope: BulkCancelScope;
  from?: string;
  to?: string;
  confirm: boolean;
};

export type BulkCancelResponse = {
  cancelledIds: string[];
};

/** GET /api/v1/doctors/me/schedule */
export const getDoctorSchedule = () => {
  return generatedGetDoctorSchedule() as Promise<DoctorScheduleResponse>;
};

/** PATCH /api/v1/doctors/me/schedule */
export const patchDoctorSchedule = (body: PatchDoctorScheduleBody) => {
  return generatedPatchDoctorSchedule(body) as Promise<DoctorScheduleResponse>;
};

/** POST /api/v1/doctors/me/schedule/bulk-cancel */
export const postBulkCancel = (body: BulkCancelBody) => {
  return generatedPostBulkCancel(body) as Promise<BulkCancelResponse>;
};
