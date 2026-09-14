import {
  IconCalendarEvent,
  IconLayoutDashboard,
  IconLogin2,
  IconLogout,
  IconMoon,
  IconSun,
  IconUser,
  IconUserPlus,
} from '@tabler/icons-react';
import { Button, styled } from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { usePostAuthLogout } from '@/api/auth';
import { LanguageToggle } from '@/components/Layout/LanguageToggle';
import { Meta } from '@/components/Text';
import { useAppRole } from '@/hooks/useAppRole';
import { useThemeMode } from '@/hooks/useThemeMode';
import { useAuthApiErrorMessage } from '@/modules/auth/hooks/useAuthApiErrorMessage';
import { AppRole } from '@/types/role';
import { AppRoute } from '@/utils/routeUtils/routes';

const Panel = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: theme.spacing(3),
  width: '100%',
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  paddingInline: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const NavList = styled('nav')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(0.5),
  width: '100%',
}));

const NavRow = styled('button')<{ $danger?: boolean }>(({ theme, $danger }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  width: '100%',
  height: 48,
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '24px',
  fontWeight: 600,
  color: $danger ? theme.palette.error.main : theme.palette.text.primary,
  textAlign: 'left',
}));

const IconSlot = styled('span')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 24,
  height: 24,
  flexShrink: 0,
});

const Divider = styled('div')(({ theme }) => ({
  width: '100%',
  height: 1,
  backgroundColor: theme.palette.divider,
  flexShrink: 0,
}));

const Section = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  width: '100%',
}));

const ThemeRow = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  height: 48,
  paddingInline: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 16,
  lineHeight: '20px',
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const ThemeIconBox = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 8,
  flexShrink: 0,
}));

const Spacer = styled('div')({
  flex: 1,
  minHeight: 24,
});

interface MenuItemProps {
  icon: ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}

const MenuItem = ({ icon, label, danger, onClick }: MenuItemProps) => {
  return (
    <NavRow type="button" $danger={danger} onClick={onClick}>
      <IconSlot>{icon}</IconSlot>
      {label}
    </NavRow>
  );
};

interface MobileMenuProps {
  onNavigate?: () => void;
}

export const MobileMenu = ({ onNavigate }: MobileMenuProps) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { role, isSession, setPreviewRole } = useAppRole();
  const { mode, toggleTheme } = useThemeMode();
  const logoutMutation = usePostAuthLogout();
  const mapError = useAuthApiErrorMessage();

  const go = (path: AppRoute) => {
    onNavigate?.();
    void navigate(path);
  };

  const handleLogOut = async () => {
    try {
      if (isSession) {
        await logoutMutation.mutateAsync();
      }
      setPreviewRole(AppRole.GUEST);
      onNavigate?.();
      void navigate(AppRoute.LOGIN);
    } catch (error) {
      toast.error(mapError(error));
    }
  };

  return (
    <Panel>
      {role === AppRole.PATIENT ? (
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            go(AppRoute.HOME);
          }}
        >
          {t('header.findDoctor')}
        </Button>
      ) : null}

      <NavList aria-label={t('header.menu')}>
        {role === AppRole.GUEST ? (
          <>
            <MenuItem
              icon={<IconLogin2 size={22} stroke={1.75} />}
              label={t('header.logIn')}
              onClick={() => {
                go(AppRoute.LOGIN);
              }}
            />
            <MenuItem
              icon={<IconUserPlus size={22} stroke={1.75} />}
              label={t('header.signUp')}
              onClick={() => {
                go(AppRoute.SIGNUP);
              }}
            />
          </>
        ) : null}

        {role === AppRole.PATIENT || role === AppRole.DOCTOR ? (
          <>
            <MenuItem
              icon={<IconLayoutDashboard size={22} stroke={1.75} />}
              label={t('header.myCabinet')}
              onClick={() => {
                go(role === AppRole.DOCTOR ? AppRoute.DOCTOR_DAY : AppRoute.APPOINTMENTS);
              }}
            />
            <MenuItem
              icon={<IconUser size={22} stroke={1.75} />}
              label={t('header.myProfile')}
              onClick={() => {
                onNavigate?.();
              }}
            />
          </>
        ) : null}

        {role === AppRole.DOCTOR ? (
          <MenuItem
            icon={<IconCalendarEvent size={22} stroke={1.75} />}
            label={t('header.mySchedule')}
            onClick={() => {
              go(AppRoute.DOCTOR_DAY);
            }}
          />
        ) : null}

        {role !== AppRole.GUEST ? (
          <MenuItem
            icon={<IconLogout size={22} stroke={1.75} />}
            label={t('header.logOut')}
            danger
            onClick={handleLogOut}
          />
        ) : null}
      </NavList>

      <Divider />

      <Section>
        <Meta>{t('header.language')}</Meta>
        <LanguageToggle />
      </Section>

      <Section>
        <Meta>{t('header.theme')}</Meta>
        <ThemeRow type="button" onClick={toggleTheme}>
          {mode === 'light' ? t('themeLight') : t('themeDark')}
          <ThemeIconBox>
            {mode === 'light' ? (
              <IconSun size={18} stroke={2} />
            ) : (
              <IconMoon size={18} stroke={2} />
            )}
          </ThemeIconBox>
        </ThemeRow>
      </Section>

      <Spacer />
    </Panel>
  );
};
