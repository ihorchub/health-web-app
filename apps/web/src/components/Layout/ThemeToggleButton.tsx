import { IconMoon, IconSun } from '@tabler/icons-react';
import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useThemeMode } from '@/hooks/useThemeMode';

const ButtonRoot = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 40,
  height: 40,
  padding: 0,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  cursor: 'pointer',

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const ThemeToggleButton = () => {
  const { t } = useTranslation('common');
  const { mode, toggleTheme } = useThemeMode();

  return (
    <ButtonRoot
      type="button"
      onClick={toggleTheme}
      aria-label={t('header.theme')}
      title={mode === 'light' ? t('themeDark') : t('themeLight')}
    >
      {mode === 'light' ? (
        <IconMoon size={22} stroke={1.75} />
      ) : (
        <IconSun size={22} stroke={1.75} />
      )}
    </ButtonRoot>
  );
};
