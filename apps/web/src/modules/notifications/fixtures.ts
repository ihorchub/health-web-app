import type { AppNotification } from '@/modules/notifications/types';
import { AppRole } from '@/types/role';

const DOCTOR_MOCK: AppNotification[] = [
  {
    id: 'n-doc-1',
    type: 'patient_booked',
    createdAt: '2026-08-27T09:12:00+03:00',
    patientName: 'Марія Коваленко',
    visitAt: '2026-08-28T10:00:00+03:00',
  },
  {
    id: 'n-doc-2',
    type: 'patient_rescheduled',
    createdAt: '2026-08-26T16:40:00+03:00',
    patientName: 'Андрій Шевченко',
    visitAt: '2026-08-29T14:30:00+03:00',
  },
  {
    id: 'n-doc-3',
    type: 'patient_cancelled',
    createdAt: '2026-08-25T11:05:00+03:00',
    patientName: 'Олена Петренко',
    visitAt: '2026-08-27T15:00:00+03:00',
  },
];

const PATIENT_MOCK: AppNotification[] = [
  {
    id: 'n-pat-1',
    type: 'doctor_proposed_time',
    createdAt: '2026-08-27T08:20:00+03:00',
    doctorName: 'Оксана Литвин',
    visitAt: '2026-08-30T12:00:00+03:00',
  },
  {
    id: 'n-pat-2',
    type: 'doctor_cancelled',
    createdAt: '2026-08-24T18:00:00+03:00',
    doctorName: 'Оксана Литвин',
    visitAt: '2026-08-26T09:30:00+03:00',
  },
];

export const mockNotificationsForRole = (role: AppRole): AppNotification[] => {
  if (role === AppRole.DOCTOR) {
    return DOCTOR_MOCK;
  }
  if (role === AppRole.PATIENT) {
    return PATIENT_MOCK;
  }
  return [];
};
