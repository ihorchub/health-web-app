import type { CabinetAppointment } from '@/modules/patient-room/types';

const ymdInKyiv = (iso: string): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Kyiv',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(iso));

export const ymdFromStartsAt = (startsAt: string): string => ymdInKyiv(startsAt);

export const appointmentsOnDay = (
  items: CabinetAppointment[],
  ymd: string,
): CabinetAppointment[] =>
  items
    .filter((item) => ymdFromStartsAt(item.startsAt) === ymd)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt));

export const appointmentDays = (items: CabinetAppointment[]): string[] => {
  const days = new Set<string>();
  items.forEach((item) => {
    days.add(ymdFromStartsAt(item.startsAt));
  });
  return [...days];
};
