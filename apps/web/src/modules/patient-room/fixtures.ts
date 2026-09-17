import { findMockDoctor, MOCK_DOCTOR_RECORDS, toSearchCard } from '@/api/mocks/doctorsFixtures';

import type { CabinetAppointment } from '@/modules/patient-room/types';

/** Static demo timeline aligned with Paper SCR-06 default artboard (Aug 2026). */
export const MOCK_CABINET_APPOINTMENTS: CabinetAppointment[] = [
  {
    id: 'apt_next',
    doctorId: 'doc_olena_kovalenko',
    startsAt: '2026-08-27T09:00:00+03:00',
    durationMinutes: 30,
    status: 'upcoming',
    format: 'offline',
    reason: 'Профілактичний огляд',
  },
  {
    id: 'apt_pending',
    doctorId: 'doc_andriy_shevchenko',
    startsAt: '2026-08-28T10:30:00+03:00',
    proposedStartsAt: '2026-08-30T12:00:00+03:00',
    durationMinutes: 30,
    status: 'reschedule_pending',
    format: 'online',
    reason: 'Консультація',
  },
  {
    id: 'apt_up_2',
    doctorId: 'doc_maria_bondar',
    startsAt: '2026-09-02T11:00:00+03:00',
    durationMinutes: 30,
    status: 'upcoming',
    format: 'offline',
  },
  {
    id: 'apt_up_3',
    doctorId: 'doc_maria_bondar',
    startsAt: '2026-09-01T14:00:00+03:00',
    durationMinutes: 45,
    status: 'upcoming',
    format: 'offline',
  },
  {
    id: 'apt_past_done',
    doctorId: 'doc_olena_kovalenko',
    startsAt: '2026-08-10T11:00:00+03:00',
    durationMinutes: 30,
    status: 'completed',
    format: 'offline',
  },
  {
    id: 'apt_past_cancel',
    doctorId: 'doc_maria_bondar',
    startsAt: '2026-08-05T16:00:00+03:00',
    durationMinutes: 30,
    status: 'cancelled',
    format: 'online',
    cancelledBy: 'doctor',
  },
];

export const MOCK_CABINET_PAST_ONLY: CabinetAppointment[] = MOCK_CABINET_APPOINTMENTS.filter(
  (item) => item.status !== 'upcoming' && item.status !== 'reschedule_pending',
);

export type CabinetFixtureKey = 'default' | 'empty' | 'upcoming-empty' | 'loading';

export const getCabinetFixtureAppointments = (
  preview: CabinetFixtureKey | null,
): CabinetAppointment[] => {
  switch (preview) {
    case 'empty':
      return [];
    case 'upcoming-empty':
      return MOCK_CABINET_PAST_ONLY;
    case 'loading':
      return MOCK_CABINET_APPOINTMENTS;
    default:
      return MOCK_CABINET_APPOINTMENTS;
  }
};

export const MOCK_FAVOURITE_DOCTOR_IDS = [
  'doc_olena_kovalenko',
  'doc_andriy_shevchenko',
  'doc_maria_bondar',
];

export const MOCK_RECENT_DOCTOR_IDS = ['doc_maria_bondar', 'doc_andriy_shevchenko'];

export const MOCK_PROMO_DOCTOR_ID = 'doc_maria_bondar';

export const MOCK_CALENDAR_DOTS = [
  '2026-08-27',
  '2026-08-28',
  '2026-09-01',
  '2026-08-10',
];

export const getDoctorDisplayName = (doctorId: string): string => {
  const doctor = findMockDoctor(doctorId);
  if (!doctor) {
    return doctorId;
  }

  return `${doctor.firstName} ${doctor.lastName}`;
};

export const getFavouriteDoctors = () =>
  MOCK_FAVOURITE_DOCTOR_IDS.map((id) => {
    const record = MOCK_DOCTOR_RECORDS.find((doctor) => doctor.id === id);
    return record ? toSearchCard({ ...record, isFavourite: true }) : null;
  }).filter((doctor): doctor is NonNullable<typeof doctor> => doctor !== null);

export const getRecentDoctors = () =>
  MOCK_RECENT_DOCTOR_IDS.map((id) => {
    const record = MOCK_DOCTOR_RECORDS.find((doctor) => doctor.id === id);
    return record ? toSearchCard(record) : null;
  }).filter((doctor): doctor is NonNullable<typeof doctor> => doctor !== null);

export const getPromoDoctor = () => {
  const record = findMockDoctor(MOCK_PROMO_DOCTOR_ID);
  return record ? toSearchCard(record) : null;
};
