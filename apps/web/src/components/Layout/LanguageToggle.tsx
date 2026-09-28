import { styled } from '@/theme/styled';

import { useTranslation } from 'react-i18next';

import { AppLanguage, setAppLanguage } from '@/i18n';

const ToggleRoot = styled('div')<{ $fullWidth?: boolean }>(({ theme, $fullWidth }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  flexShrink: 0,
  width: $fullWidth ? '100%' : 'fit-content',
  minWidth: $fullWidth ? undefined : 128,
  padding: 3,
  borderRadius: 999,
  backgroundColor:
    theme.palette.mode === 'light' ? theme.palette.action.hover : 'rgba(255, 255, 255, 0.06)',
  border: `1px solid ${theme.palette.divider}`,
  boxSizing: 'border-box',
}));

const Option = styled('button')<{ $active: boolean }>(({ theme, $active }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 32,
  paddingInline: 12,
  border: 'none',
  borderRadius: 999,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '16px',
  fontWeight: $active ? 700 : 500,
  transition: 'background-color 140ms ease, color 140ms ease, box-shadow 140ms ease',
  backgroundColor: $active ? theme.palette.primary.main : 'transparent',
  color: $active ? '#FFFFFF' : theme.palette.text.secondary,
  boxShadow: $active ? '0 1px 3px rgba(0, 0, 0, 0.18)' : 'none',

  '&:hover': {
    color: $active ? '#FFFFFF' : theme.palette.text.primary,
    backgroundColor: $active ? theme.palette.primary.light : theme.palette.action.hover,
  },
}));

interface LanguageToggleProps {
  fullWidth?: boolean;
}

export const LanguageToggle = ({ fullWidth = false }: LanguageToggleProps) => {
  const { t, i18n } = useTranslation('common');
  const active = i18n.language === AppLanguage.EN ? AppLanguage.EN : AppLanguage.UK;

  return (
    <ToggleRoot role="group" aria-label={t('header.language')} $fullWidth={fullWidth}>
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
