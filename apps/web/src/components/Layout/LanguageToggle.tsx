import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { AppLanguage, setAppLanguage } from '@/i18n';

const ToggleRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  height: 36,
  overflow: 'hidden',
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
}));

const Option = styled('button')<{ $active: boolean }>(({ theme, $active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  paddingInline: 12,
  border: 'none',
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '16px',
  fontWeight: $active ? 600 : 500,
  backgroundColor: $active ? theme.palette.primary.main : theme.palette.background.paper,
  color: $active ? '#FFFFFF' : theme.palette.text.secondary,

  '&:hover': {
    backgroundColor: $active ? theme.palette.primary.light : theme.palette.action.hover,
  },
}));

export const LanguageToggle = () => {
  const { t, i18n } = useTranslation('common');
  const active = i18n.language === AppLanguage.EN ? AppLanguage.EN : AppLanguage.UK;

  return (
    <ToggleRoot role="group" aria-label={t('header.language')}>
      <Option
        type="button"
        $active={active === AppLanguage.UK}
        aria-pressed={active === AppLanguage.UK}
        onClick={() => {
          void setAppLanguage(AppLanguage.UK);
        }}
      >
        {t('languageUk')}
      </Option>
      <Option
        type="button"
        $active={active === AppLanguage.EN}
        aria-pressed={active === AppLanguage.EN}
        onClick={() => {
          void setAppLanguage(AppLanguage.EN);
        }}
      >
        {t('languageEn')}
      </Option>
    </ToggleRoot>
  );
};
