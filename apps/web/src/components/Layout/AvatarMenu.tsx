import {
  IconCalendarEvent,
  IconLayoutDashboard,
  IconLogout,
  IconUser,
} from '@tabler/icons-react';
import { Divider, Menu, MenuItem } from '@mui/material';
import { styled } from '@/theme/styled';

import { useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { usePostAuthLogout } from '@/api/auth';
import { LanguageToggle } from '@/components/Layout/LanguageToggle';
import { Meta } from '@/components/Text';
import { useAppRole } from '@/hooks/useAppRole';
import { useAuthApiErrorMessage } from '@/modules/auth/hooks/useAuthApiErrorMessage';
import { AppRole } from '@/types/role';
import { AppRoute } from '@/utils/routeUtils/routes';

const AvatarButton = styled('button')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: 40,
  height: 40,
  padding: 0,
  border: 'none',
  borderRadius: 999,
  backgroundColor: theme.palette.brand.main,
  color: theme.palette.onBrand,
  cursor: 'pointer',
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '16px',
  fontWeight: 600,
}));

const AccountMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    minWidth: 280,
    width: 280,
    marginTop: theme.spacing(1),
    borderRadius: 14,
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    boxShadow:
      theme.palette.mode === 'light'
        ? '0px 8px 28px rgba(22, 62, 82, 0.14)'
        : '0px 10px 32px rgba(0, 0, 0, 0.45)',
  },
}));

const MenuSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  paddingInline: theme.spacing(2),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1.75),
  marginInline: theme.spacing(0.5),
}));

const ItemIcon = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(1.5),
  color: 'inherit',
}));

const DangerItem = styled(MenuItem)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.mode === 'light' ? '#D32F2F' : '#FF5252',

  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'light' ? 'rgba(211, 47, 47, 0.08)' : 'rgba(255, 82, 82, 0.12)',
  },
}));

export const AvatarMenu = () => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { role, initials, isSession, setPreviewRole } = useAppRole();
  const logoutMutation = usePostAuthLogout();
  const mapError = useAuthApiErrorMessage();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  if (role === AppRole.GUEST) {
    return null;
  }

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const go = (path: AppRoute) => {
    handleClose();
    void navigate(path);
  };

  const handleLogOut = async () => {
    handleClose();
    try {
      if (isSession) {
        await logoutMutation.mutateAsync();
      }
      setPreviewRole(AppRole.GUEST);
      void navigate(AppRoute.LOGIN);
    } catch (error) {
      toast.error(mapError(error));
    }
  };

  return (
    <>
      <AvatarButton
        type="button"
        aria-label={t('header.accountMenu')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleOpen}
      >
        {initials}
      </AvatarButton>
      <AccountMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            go(role === AppRole.DOCTOR ? AppRoute.DOCTOR_DAY : AppRoute.APPOINTMENTS);
          }}
        >
          <ItemIcon>
            <IconLayoutDashboard size={18} stroke={1.75} />
          </ItemIcon>
          {t('header.myCabinet')}
        </MenuItem>
        <MenuItem
          onClick={() => {
            go(AppRoute.PROFILE);
          }}
        >
          <ItemIcon>
            <IconUser size={18} stroke={1.75} />
          </ItemIcon>
          {t('header.myProfile')}
        </MenuItem>
        {role === AppRole.DOCTOR ? (
          <MenuItem
            onClick={() => {
              go(AppRoute.DOCTOR_HOURS);
            }}
          >
            <ItemIcon>
              <IconCalendarEvent size={18} stroke={1.75} />
            </ItemIcon>
            {t('header.mySchedule')}
          </MenuItem>
        ) : null}
        <Divider />
        <DangerItem onClick={handleLogOut}>
          <ItemIcon>
            <IconLogout size={18} stroke={1.75} />
          </ItemIcon>
          {t('header.logOut')}
        </DangerItem>
        <Divider />
        <MenuSection>
          <Meta>{t('header.language')}</Meta>
          <LanguageToggle fullWidth />
        </MenuSection>
      </AccountMenu>
    </>
  );
};
