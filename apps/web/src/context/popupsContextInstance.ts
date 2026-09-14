import { createContext } from 'react';

import type { PopupPayload, Popups } from '@/utils/popupUtils/popupTypes';

export interface PopupsContextValue {
  activePopup: Popups;
  payload?: PopupPayload;
  updatePopup: (popup: Popups, open: boolean, payload?: PopupPayload) => void;
  closePopup: () => void;
}

export const PopupsContext = createContext<PopupsContextValue | null>(null);
