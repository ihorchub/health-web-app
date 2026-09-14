export type BookingWizardStep = 'profile' | 'calendar' | 'confirm';

export type BookingVisitFormat = 'offline' | 'online';

export interface BookingSelection {
  date: string;
  startAt: string;
  format: BookingVisitFormat;
  visitDurationMinutes: number;
}
