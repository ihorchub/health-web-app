import {
  IconCalendarEvent,
  IconLayoutDashboard,
  IconLogout,
  IconUser,
} from '@tabler/icons-react';
import { Divider, Menu, MenuItem, styled } from '@mui/material';
import { useState, type MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageToggle } from '@/components/Layout/LanguageToggle';
import { Meta } from '@/components/Text';
import { usePreviewRole } from '@/hooks/usePreviewRole';
import { AppRole } from '@/types/role';

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

const MenuSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  paddingInline: theme.spacing(2),
  paddingBlock: theme.spacing(1.5),
}));

const ItemIcon = styled('span')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginRight: theme.spacing(1.5),
  color: 'inherit',
}));

const DangerItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.error.main,
}));

export const AvatarMenu = () => {
  const { t } = useTranslation('common');
  const { role, initials, setRole } = usePreviewRole();
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

  const handleLogOut = () => {
    setRole(AppRole.GUEST);
    handleClose();
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
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleClose}>
          <ItemIcon>
            <IconLayoutDashboard size={18} stroke={1.75} />
          </ItemIcon>
          {t('header.myCabinet')}
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ItemIcon>
            <IconUser size={18} stroke={1.75} />
          </ItemIcon>
          {t('header.myProfile')}
        </MenuItem>
        {role === AppRole.DOCTOR ? (
          <MenuItem onClick={handleClose}>
            <ItemIcon>
              <IconCalendarEvent size={18} stroke={1.75} />
            </ItemIcon>
            {t('header.mySchedule')}
          </MenuItem>
        ) : null}
        <Divider />
        <MenuSection>
          <Meta>{t('header.language')}</Meta>
          <LanguageToggle />
        </MenuSection>
        <Divider />
        <DangerItem onClick={handleLogOut}>
          <ItemIcon>
            <IconLogout size={18} stroke={1.75} />
          </ItemIcon>
          {t('header.logOut')}
        </DangerItem>
      </Menu>
    </>
  );
};
