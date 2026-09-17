import type { WorkingHoursSettings } from '@/modules/working-hours/types';

export const DEMO_SCHEDULE_ANCHOR = '2026-08-27';

export const MOCK_WORKING_HOURS: WorkingHoursSettings = {
  zoneAStartYmd: '2026-08-27',
  zoneAEndYmd: '2026-09-26',
  zoneBStartYmd: '2026-09-27',
  zoneA: {
    workStart: '09:00',
    workEnd: '18:00',
    lunchStart: '13:00',
    lunchEnd: '14:00',
    format: 'offline',
    durationMinutes: 30,
    priceUah: 600,
  },
  zoneB: {
    workStart: '09:00',
    workEnd: '18:00',
    lunchStart: '13:00',
    lunchEnd: '14:00',
    format: 'offline',
    durationMinutes: 30,
    priceUah: 600,
    vacationDayOff: false,
  },
  appointmentDays: [
    '2026-08-27',
    '2026-08-28',
    '2026-08-29',
    '2026-09-02',
    '2026-09-05',
    '2026-09-12',
    '2026-09-18',
    '2026-10-03',
  ],
};

export const SCHEDULE_MONTH_OPTIONS = [
  { value: '2026-08', labelUk: 'Серпень 2026', labelEn: 'August 2026' },
  { value: '2026-09', labelUk: 'Вересень 2026', labelEn: 'September 2026' },
];
