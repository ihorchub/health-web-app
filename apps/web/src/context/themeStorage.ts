export type ThemeMode = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'medicly-theme';

export const getPreferredThemeMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyThemeToDocument = (mode: ThemeMode) => {
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = mode;
};

export const persistThemeMode = (mode: ThemeMode) => {
  window.localStorage.setItem(THEME_STORAGE_KEY, mode);
  applyThemeToDocument(mode);
};
