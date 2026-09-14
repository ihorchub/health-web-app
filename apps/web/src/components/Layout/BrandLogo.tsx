import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { useThemeMode } from '@/hooks/useThemeMode';
import { AppRoute } from '@/utils/routeUtils/routes';

const LOGO_LIGHT = '/brand/logo/medicly-logo-header-light@2x.png';
const LOGO_DARK = '/brand/logo/medicly-logo-header-dark@2x.png';

const LogoLink = styled(RouterLink)({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  textDecoration: 'none',
});

const LogoImage = styled('img')({
  height: 32,
  width: 'auto',
  display: 'block',
});

interface BrandLogoProps {
  to?: AppRoute;
}

export const BrandLogo = ({ to = AppRoute.HOME }: BrandLogoProps) => {
  const { t } = useTranslation('common');
  const { mode } = useThemeMode();

  return (
    <LogoLink to={to} aria-label={t('appName')}>
      <LogoImage src={mode === 'light' ? LOGO_LIGHT : LOGO_DARK} alt={t('appName')} />
    </LogoLink>
  );
};
