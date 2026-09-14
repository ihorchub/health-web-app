import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { AppRoute } from '@/utils/routeUtils/routes';

const FooterRoot = styled('footer')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  width: '100%',
  paddingBlock: theme.spacing(4),
  paddingInline: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: 'transparent',
}));

const FooterLink = styled(RouterLink)(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  textDecoration: 'none',
  color: theme.palette.text.primary,

  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const Dot = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 700,
  color: theme.palette.text.secondary,
}));

const Copyright = styled('span')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 12,
  lineHeight: '16px',
  fontWeight: 700,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: theme.palette.text.primary,
}));

export const Footer = () => {
  const { t } = useTranslation('common');
  const year = new Date().getFullYear();

  return (
    <FooterRoot>
      <FooterLink to={AppRoute.PRIVACY}>{t('footer.privacy')}</FooterLink>
      <Dot aria-hidden>·</Dot>
      <FooterLink to={AppRoute.TERMS}>{t('footer.terms')}</FooterLink>
      <Dot aria-hidden>·</Dot>
      <Copyright>{t('footer.copyright', { year })}</Copyright>
    </FooterRoot>
  );
};
