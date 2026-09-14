import { styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useThemeMode } from '@/hooks/useThemeMode';

const LOGO_LIGHT = '/brand/logo/medicly-logo-header-light@2x.png';
const LOGO_DARK = '/brand/logo/medicly-logo-header-dark@2x.png';
const LIKA_POSE = '/brand/lika-poses/lika1.png';

const Page = styled('section')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  textAlign: 'center',
  backgroundColor: theme.palette.background.default,
}));

const Logo = styled('img')({
  height: 40,
  width: 'auto',
});

const Mascot = styled('img')({
  width: 120,
  height: 'auto',
});

export const DevCheckPage = () => {
  const { t } = useTranslation('common');
  const { mode } = useThemeMode();

  return (
    <Page>
      <Logo src={mode === 'light' ? LOGO_LIGHT : LOGO_DARK} alt={t('appName')} />
      <Mascot src={LIKA_POSE} alt="" />
      <Typography variant="h1">{t('stubTitle')}</Typography>
      <Typography variant="body1" color="text.secondary">
        {t('stubSubtitle')}
      </Typography>
      <Typography variant="overline" color="primary">
        {t('themeOk')}
      </Typography>
    </Page>
  );
};
