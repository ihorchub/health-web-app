/** Popup registry — register new modals here, wire in AppPopups. */
export enum Popups {
  NONE = 'NONE',
}

export type PopupPayload = unknown;

export interface PopupState {
  active: Popups;
  payload?: PopupPayload;
}
