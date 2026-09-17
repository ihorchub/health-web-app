import type { CabinetAppointment } from '@/modules/patient-room/types';

export const ymdFromStartsAt = (startsAt: string): string => startsAt.slice(0, 10);

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
