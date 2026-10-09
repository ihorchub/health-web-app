import { useContext } from 'react';

import { AuthTransitionContext } from '@/context/authTransitionContextInstance';

export const useAuthTransition = () => {
  const ctx = useContext(AuthTransitionContext);
  if (!ctx) {
    throw new Error('useAuthTransition must be used within AuthTransitionProvider');
  }
  return ctx;
};
