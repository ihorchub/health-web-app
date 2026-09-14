/** Popup registry — register new modals here, wire in AppPopups. */
export enum Popups {
  NONE = 'NONE',
  DOCTOR_PROFILE = 'DOCTOR_PROFILE',
}

export interface DoctorProfilePopupPayload {
  doctorId: string;
}

export type PopupPayload = DoctorProfilePopupPayload | undefined;

export interface PopupState {
  active: Popups;
  payload?: PopupPayload;
}
