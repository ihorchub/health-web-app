import { useContext } from 'react';

import { PopupsContext } from '@/context/popupsContextInstance';

export const usePopups = () => {
  const context = useContext(PopupsContext);

  if (!context) {
    throw new Error('usePopups must be used within PopupsProvider');
  }

  return context;
};
