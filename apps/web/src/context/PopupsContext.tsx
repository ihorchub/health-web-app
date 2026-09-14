import { useCallback, useMemo, useState, type ReactNode } from 'react';

import { PopupsContext } from '@/context/popupsContextInstance';
import { Popups, type PopupPayload } from '@/utils/popupUtils/popupTypes';

interface PopupsProviderProps {
  children: ReactNode;
}

export const PopupsProvider = ({ children }: PopupsProviderProps) => {
  const [activePopup, setActivePopup] = useState<Popups>(Popups.NONE);
  const [payload, setPayload] = useState<PopupPayload | undefined>(undefined);

  const closePopup = useCallback(() => {
    setActivePopup(Popups.NONE);
    setPayload(undefined);
  }, []);

  const updatePopup = useCallback(
    (popup: Popups, open: boolean, nextPayload?: PopupPayload) => {
      if (!open || popup === Popups.NONE) {
        setActivePopup(Popups.NONE);
        setPayload(undefined);
        return;
      }

      setActivePopup(popup);
      setPayload(nextPayload);
    },
    [],
  );

  const value = useMemo(
    () => ({
      activePopup,
      payload,
      updatePopup,
      closePopup,
    }),
    [activePopup, closePopup, payload, updatePopup],
  );

  return <PopupsContext.Provider value={value}>{children}</PopupsContext.Provider>;
};
