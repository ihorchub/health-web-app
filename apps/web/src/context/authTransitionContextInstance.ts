import { createContext } from 'react';

export interface AuthTransitionContextValue {
  isTransitioning: boolean;
  beginAuthTransition: (durationMs?: number) => void;
}

export const AuthTransitionContext = createContext<AuthTransitionContextValue | null>(null);
