import type { CabinetAppointment } from '@/modules/patient-room/types';
import { PENDING_RESCHEDULE_STORAGE_KEY } from '@/utils/popupUtils/popupTypes';

export const PENDING_RESCHEDULE_RESOLVED = 'medicly:pending-reschedule-resolved';

export interface PendingRescheduleResolvedDetail {
  pendingId: string;
  newStartsAt: string;
  format: CabinetAppointment['format'];
  durationMinutes: number;
  doctorId: string;
}

export const storePendingReschedulePick = (appointmentId: string) => {
  window.sessionStorage.setItem(PENDING_RESCHEDULE_STORAGE_KEY, appointmentId);
};

export const readPendingReschedulePick = (): string | null =>
  window.sessionStorage.getItem(PENDING_RESCHEDULE_STORAGE_KEY);

export const clearPendingReschedulePick = () => {
  window.sessionStorage.removeItem(PENDING_RESCHEDULE_STORAGE_KEY);
};

export const dispatchPendingRescheduleResolved = (detail: PendingRescheduleResolvedDetail) => {
  window.dispatchEvent(
    new CustomEvent(PENDING_RESCHEDULE_RESOLVED, { detail }),
  );
};
