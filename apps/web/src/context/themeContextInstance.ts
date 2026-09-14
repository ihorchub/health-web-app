import { createContext } from 'react';

import type { ThemeMode } from '@/context/themeStorage';

export interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
