import { IconBell } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { HeaderIconButton } from '@/components/Layout/HeaderIconButton';
import { useAppRole } from '@/hooks/useAppRole';
import { NotificationsPanel } from '@/modules/notifications/components/NotificationsPanel';
import { useNotifications } from '@/modules/notifications/NotificationsContext';

interface NotificationBellProps {
  size?: 'sm' | 'md';
}

export const NotificationBell = ({ size = 'md' }: NotificationBellProps) => {
  const { t } = useTranslation('common');
  const { role } = useAppRole();
  const { hasUnread } = useNotifications();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  return (
    <>
      <HeaderIconButton
        size={size}
        aria-label={t('header.notifications')}
        aria-expanded={open}
        showUnread={hasUnread}
        onClick={(event) => {
          setAnchorEl(event.currentTarget);
        }}
      >
        <IconBell size={size === 'sm' ? 16 : 20} />
      </HeaderIconButton>
      <NotificationsPanel
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null);
        }}
        role={role}
      />
    </>
  );
};
