import { useContext } from 'react';

import { ThemeContext } from '@/context/themeContextInstance';

export const useThemeMode = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useThemeMode must be used within AppThemeProvider');
  }

  return context;
};
