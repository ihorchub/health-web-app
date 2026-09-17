import { Button, Paper, Popover, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useNotifications } from '@/modules/notifications/NotificationsContext';
import type { AppNotification, NotificationEventType } from '@/modules/notifications/types';
import { formatCabinetHeaderDate, formatTime } from '@/modules/patient-room/utils/formatCabinetDate';
import { AppRole } from '@/types/role';
import { AppRoute } from '@/utils/routeUtils/routes';

const PopoverPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(1),
  borderRadius: 16,
  overflow: 'hidden',
}));

const Panel = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: 360,
  maxWidth: 'calc(100vw - 32px)',
  maxHeight: 420,
  boxSizing: 'border-box',
});

const PanelHead = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const PanelTitle = styled('span')(({ theme }) => ({
  fontSize: 16,
  fontWeight: 700,
  fontFamily: theme.typography.fontFamily,
}));

const List = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  overflowY: 'auto',
  flex: 1,
});

const ItemButton = styled('button')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(0.5),
  width: '100%',
  padding: theme.spacing(1.5, 2),
  border: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: theme.typography.fontFamily,

  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ItemBody = styled('span')(({ theme }) => ({
  fontSize: 14,
  lineHeight: '20px',
  color: theme.palette.text.primary,
}));

const ItemMeta = styled('span')(({ theme }) => ({
  fontSize: 12,
  color: theme.palette.text.secondary,
}));

const EmptyState = styled('p')(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(3, 2),
  fontSize: 14,
  color: theme.palette.text.secondary,
  textAlign: 'center',
}));

interface NotificationsPanelProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  role: AppRole;
}

const visitLabel = (visitAt: string | undefined, locale: string): string | undefined => {
  if (!visitAt) {
    return undefined;
  }
  const date = new Date(visitAt);
  return `${formatCabinetHeaderDate(date, locale)}, ${formatTime(visitAt, locale)}`;
};

const navigateForNotification = (
  type: NotificationEventType,
  role: AppRole,
): AppRoute | null => {
  if (role === AppRole.PATIENT && type === 'doctor_proposed_time') {
    return AppRoute.APPOINTMENTS;
  }
  if (role === AppRole.DOCTOR) {
    return AppRoute.DOCTOR_DAY;
  }
  if (role === AppRole.PATIENT && type === 'doctor_cancelled') {
    return AppRoute.APPOINTMENTS;
  }
  return null;
};

export const NotificationsPanel = ({
  anchorEl,
  open,
  onClose,
  role,
}: NotificationsPanelProps) => {
  const { t, i18n } = useTranslation('notifications');
  const navigate = useNavigate();
  const { items, markRead, markAllRead } = useNotifications();

  const handleItemClick = (item: AppNotification) => {
    const route = navigateForNotification(item.type, role);
    markRead(item.id);
    onClose();
    if (route) {
      void navigate(route);
    }
  };

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{
        paper: {
          component: PopoverPaper,
          elevation: 3,
        },
      }}
    >
      <Panel>
        <PanelHead>
          <PanelTitle>{t('title')}</PanelTitle>
          {items.length > 0 ? (
            <Button size="small" onClick={markAllRead}>
              {t('readAll')}
            </Button>
          ) : null}
        </PanelHead>
        {items.length === 0 ? (
          <EmptyState>{t('empty')}</EmptyState>
        ) : (
          <List>
            {items.map((item) => (
              <li key={item.id}>
                <ItemButton
                  type="button"
                  onClick={() => {
                    handleItemClick(item);
                  }}
                >
                  <ItemBody>
                    {t(`events.${item.type}`, {
                      patientName: item.patientName ?? '',
                      doctorName: item.doctorName ?? '',
                      visit: visitLabel(item.visitAt, i18n.language) ?? '',
                    })}
                  </ItemBody>
                  <ItemMeta>
                    {formatCabinetHeaderDate(new Date(item.createdAt), i18n.language)}
                  </ItemMeta>
                </ItemButton>
              </li>
            ))}
          </List>
        )}
      </Panel>
    </Popover>
  );
};
