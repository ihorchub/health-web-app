import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';

import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

import { ThemeContext } from '@/context/themeContextInstance';
import {
  applyThemeToDocument,
  getPreferredThemeMode,
  persistThemeMode,
  type ThemeMode,
} from '@/context/themeStorage';
import { createMediclyTheme } from '@/theme';

interface AppThemeProviderProps {
  children: ReactNode;
}

export const AppThemeProvider = ({ children }: AppThemeProviderProps) => {
  const [mode, setModeState] = useState<ThemeMode>(() => getPreferredThemeMode());

  useEffect(() => {
    applyThemeToDocument(mode);
  }, [mode]);

  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    persistThemeMode(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [mode, setMode]);

  const theme = useMemo(() => createMediclyTheme(mode), [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      setMode,
    }),
    [mode, setMode, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
