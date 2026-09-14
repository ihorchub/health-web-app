import { IconBell, IconMenu2, IconX } from '@tabler/icons-react';
import { styled } from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';

import { AvatarMenu } from '@/components/Layout/AvatarMenu';
import { BrandLogo } from '@/components/Layout/BrandLogo';
import { HeaderIconButton } from '@/components/Layout/HeaderIconButton';
import { LanguageToggle } from '@/components/Layout/LanguageToggle';
import { MobileMenu } from '@/components/Layout/MobileMenu';
import { ThemeToggleButton } from '@/components/Layout/ThemeToggleButton';
import { useAppRole } from '@/hooks/useAppRole';
import { AppRole } from '@/types/role';
import { AppRoute } from '@/utils/routeUtils/routes';

const HEADER_HEIGHT = 68;

const HeaderRoot = styled('header')(({ theme }) => ({
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
}));

const Bar = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  height: HEADER_HEIGHT,
  paddingBlock: 14,
  paddingInline: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  boxSizing: 'border-box',

  [theme.breakpoints.up('md')]: {
    paddingInline: 48,
  },
}));

const Actions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
}));

const MobileActions = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),

  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const DesktopActions = styled(Actions)(({ theme }) => ({
  display: 'none',

  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const CompactLink = styled(RouterLink)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 40,
  height: 40,
  paddingInline: 16,
  fontSize: 14,
  lineHeight: '18px',
  fontWeight: 600,
  borderRadius: 8,
  border: `1px solid ${theme.palette.divider}`,
  color: theme.palette.text.primary,
  textDecoration: 'none',
  boxSizing: 'border-box',
  fontFamily: theme.typography.fontFamily,
}));

const PrimaryCompactLink = styled(CompactLink)(({ theme }) => ({
  paddingInline: 18,
  border: 'none',
  backgroundColor: theme.palette.primary.main,
  color: '#FFFFFF',

  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    color: '#FFFFFF',
  },
}));

const MenuOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  top: HEADER_HEIGHT,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: theme.zIndex.appBar - 1,
  backgroundColor: theme.palette.background.paper,
  overflowY: 'auto',

  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

export const AppHeader = () => {
  const { t } = useTranslation('common');
  const { role, hasUnreadNotifications } = useAppRole();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [role]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
  };

  return (
    <HeaderRoot>
      <Bar>
        <BrandLogo />

        <DesktopActions>
          {role === AppRole.GUEST ? (
            <>
              <LanguageToggle />
              <ThemeToggleButton />
              <CompactLink to={AppRoute.LOGIN}>{t('header.logIn')}</CompactLink>
              <PrimaryCompactLink to={AppRoute.SIGNUP}>
                {t('header.signUp')}
              </PrimaryCompactLink>
            </>
          ) : null}

          {role === AppRole.PATIENT ? (
            <>
              <PrimaryCompactLink to={AppRoute.HOME}>
                {t('header.findDoctor')}
              </PrimaryCompactLink>
              <HeaderIconButton
                aria-label={t('header.notifications')}
                showUnread={hasUnreadNotifications}
              >
                <IconBell size={20} />
              </HeaderIconButton>
              <ThemeToggleButton />
              <AvatarMenu />
            </>
          ) : null}

          {role === AppRole.DOCTOR ? (
            <>
              <HeaderIconButton
                aria-label={t('header.notifications')}
                showUnread={hasUnreadNotifications}
              >
                <IconBell size={20} />
              </HeaderIconButton>
              <ThemeToggleButton />
              <AvatarMenu />
            </>
          ) : null}
        </DesktopActions>

        <MobileActions>
          {menuOpen ? (
            <HeaderIconButton
              bordered={false}
              aria-label={t('header.closeMenu')}
              onClick={closeMenu}
            >
              <IconX size={22} stroke={2} />
            </HeaderIconButton>
          ) : (
            <>
              {role !== AppRole.GUEST ? (
                <HeaderIconButton
                  size="sm"
                  aria-label={t('header.notifications')}
                  showUnread={hasUnreadNotifications}
                >
                  <IconBell size={16} />
                </HeaderIconButton>
              ) : null}
              <HeaderIconButton
                bordered={false}
                aria-label={t('header.openMenu')}
                onClick={toggleMenu}
              >
                <IconMenu2 size={22} stroke={2} />
              </HeaderIconButton>
            </>
          )}
        </MobileActions>
      </Bar>

      {menuOpen ? (
        <MenuOverlay>
          <MobileMenu onNavigate={closeMenu} />
        </MenuOverlay>
      ) : null}
    </HeaderRoot>
  );
};
