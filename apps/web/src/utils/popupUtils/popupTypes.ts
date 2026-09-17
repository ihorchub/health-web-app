/** Popup registry — register new modals here, wire in AppPopups. */
export enum Popups {
  NONE = 'NONE',
  DOCTOR_PROFILE = 'DOCTOR_PROFILE',
}

export interface DoctorProfilePopupPayload {
  doctorId: string;
  /** Skip SCR-03 profile when continuing an existing flow (e.g. SCR-12 pick another). */
  initialStep?: 'profile' | 'calendar' | 'confirm';
}

export const PENDING_RESCHEDULE_STORAGE_KEY = 'medicly-pending-reschedule';

export type PopupPayload = DoctorProfilePopupPayload | undefined;

export interface PopupState {
  active: Popups;
  payload?: PopupPayload;
}
