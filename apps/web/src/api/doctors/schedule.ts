import { customInstance } from '@/api/mutator/customInstance';

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

export interface DoctorScheduleResponse {
  doctorUserId: string;
  basePriceUah: number;
  promoPriceUah: number | null;
  promoValidUntil: string | null;
  supportedFormats: Array<'offline' | 'online'>;
  weeklyTemplate: WeeklyTemplate;
  vacationDates: string[];
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
};

export type BulkCancelScope = 'whole_day' | 'rest_of_day' | 'rest_of_week' | 'custom_range';

export type BulkCancelBody = {
  scope: BulkCancelScope;
  from?: string;
  to?: string;
  confirm: boolean;
};

export type BulkCancelResponse = {
  cancelledCount: number;
};

/** GET /api/v1/doctors/me/schedule */
export const getDoctorSchedule = () => {
  return customInstance<DoctorScheduleResponse>({
    url: '/v1/doctors/me/schedule',
    method: 'GET',
  });
};

/** PATCH /api/v1/doctors/me/schedule */
export const patchDoctorSchedule = (body: PatchDoctorScheduleBody) => {
  return customInstance<DoctorScheduleResponse>({
    url: '/v1/doctors/me/schedule',
    method: 'PATCH',
    data: body,
  });
};

/** POST /api/v1/doctors/me/schedule/bulk-cancel */
export const postBulkCancel = (body: BulkCancelBody) => {
  return customInstance<BulkCancelResponse>({
    url: '/v1/doctors/me/schedule/bulk-cancel',
    method: 'POST',
    data: body,
  });
};
