import { IconMoon, IconSun } from '@tabler/icons-react';
import { Button, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useThemeMode } from '@/hooks/useThemeMode';
import { AppLanguage, setAppLanguage } from '@/i18n';

const HeaderRoot = styled('header')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  minHeight: 68,
  paddingInline: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const Brand = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 18,
  fontWeight: 700,
  lineHeight: '26px',
  color: theme.palette.text.primary,
}));

const Actions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

/** Stub header for theme/language checks — not Paper chrome. */
export const StubHeader = () => {
  const { t, i18n } = useTranslation('common');
  const { mode, toggleTheme } = useThemeMode();

  const nextLanguage = i18n.language === AppLanguage.UK ? AppLanguage.EN : AppLanguage.UK;

  return (
    <HeaderRoot>
      <Brand>{t('appName')}</Brand>
      <Actions>
        <Button
          variant="outlined"
          onClick={() => {
            void setAppLanguage(nextLanguage);
          }}
        >
          {t('toggleLanguage')}: {t('languageUk')} | {t('languageEn')}
        </Button>
        <Button
          variant="contained"
          startIcon={mode === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />}
          onClick={toggleTheme}
        >
          {t('toggleTheme')}: {mode === 'light' ? t('themeDark') : t('themeLight')}
        </Button>
      </Actions>
    </HeaderRoot>
  );
};
