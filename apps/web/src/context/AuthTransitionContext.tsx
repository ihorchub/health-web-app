import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';

import {
  AuthTransitionContext,
  type AuthTransitionContextValue,
} from '@/context/authTransitionContextInstance';

interface AuthTransitionProviderProps {
  children: ReactNode;
}

const DEFAULT_DURATION_MS = 450;

export const AuthTransitionProvider = ({ children }: AuthTransitionProviderProps) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const beginAuthTransition = useCallback((durationMs = DEFAULT_DURATION_MS) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setIsTransitioning(true);
    timerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      timerRef.current = null;
    }, durationMs);
  }, []);

  const value = useMemo<AuthTransitionContextValue>(
    () => ({
      isTransitioning,
      beginAuthTransition,
    }),
    [beginAuthTransition, isTransitioning],
  );

  return (
    <AuthTransitionContext.Provider value={value}>{children}</AuthTransitionContext.Provider>
  );
};
