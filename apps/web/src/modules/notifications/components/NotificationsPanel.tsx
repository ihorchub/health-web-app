import { Button, DialogContent, DialogTitle, Paper, Popover } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { SheetDialog } from '@/components/Dialog/SheetDialog';
import { useNotifications } from '@/modules/notifications/NotificationsContext';
import type { AppNotification, NotificationEventType } from '@/modules/notifications/types';
import { formatCabinetHeaderDate, formatTime } from '@/modules/patient-room/utils/formatCabinetDate';
import { styled } from '@/theme/styled';
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

const DetailDialog = styled(SheetDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 420,
    width: '100%',
    paddingBottom: theme.spacing(2),

    [theme.breakpoints.down('sm')]: {
      height: 'auto',
      maxHeight: '90dvh',
      margin: theme.spacing(2),
      width: 'calc(100% - 32px)',
      borderRadius: 16,
    },
  },
}));

const DetailBody = styled('p')(({ theme }) => ({
  margin: 0,
  fontFamily: theme.typography.fontFamily,
  fontSize: 15,
  lineHeight: '22px',
  color: theme.palette.text.primary,
}));

const DetailMeta = styled('p')(({ theme }) => ({
  margin: theme.spacing(1.5, 0, 0),
  fontFamily: theme.typography.fontFamily,
  fontSize: 13,
  lineHeight: '18px',
  color: theme.palette.text.secondary,
}));

const DetailActions = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  gap: theme.spacing(1),
  padding: theme.spacing(0, 3, 1),
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
  return `${formatCabinetHeaderDate(new Date(visitAt), locale)}, ${formatTime(visitAt, locale)}`;
};

const navigateForNotification = (
  type: NotificationEventType,
  role: AppRole,
): AppRoute | null => {
  if (role === AppRole.PATIENT) {
    if (
      type === 'doctor_proposed_time' ||
      type === 'doctor_cancelled' ||
      type === 'proposal_expired'
    ) {
      return AppRoute.APPOINTMENTS;
    }
    return null;
  }
  if (role === AppRole.DOCTOR) {
    return AppRoute.DOCTOR_DAY;
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
  const [detail, setDetail] = useState<AppNotification | null>(null);

  const formatEvent = (item: AppNotification) =>
    t(`events.${item.type}`, {
      patientName: item.patientName ?? '',
      doctorName: item.doctorName ?? '',
      visit: visitLabel(item.visitAt, i18n.language) ?? '',
    });

  const handleItemClick = (item: AppNotification) => {
    markRead(item.id);
    setDetail(item);
    onClose();
  };

  const closeDetail = () => {
    setDetail(null);
  };

  const openRelated = () => {
    if (!detail) {
      return;
    }
    const route = navigateForNotification(detail.type, role);
    closeDetail();
    if (route) {
      void navigate(route);
    }
  };

  const relatedRoute = detail ? navigateForNotification(detail.type, role) : null;

  return (
    <>
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
                    <ItemBody>{formatEvent(item)}</ItemBody>
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

      <DetailDialog open={Boolean(detail)} onClose={closeDetail}>
        <DialogTitle>{t('detailTitle')}</DialogTitle>
        <DialogContent>
          {detail ? (
            <>
              <DetailBody>{formatEvent(detail)}</DetailBody>
              <DetailMeta>
                {formatCabinetHeaderDate(new Date(detail.createdAt), i18n.language)}
                {detail.visitAt ? ` · ${visitLabel(detail.visitAt, i18n.language)}` : null}
              </DetailMeta>
            </>
          ) : null}
        </DialogContent>
        <DetailActions>
          <Button variant="outlined" color="inherit" onClick={closeDetail}>
            {t('detailClose')}
          </Button>
          {relatedRoute ? (
            <Button variant="contained" color="primary" onClick={openRelated}>
              {role === AppRole.DOCTOR ? t('detailOpenDay') : t('detailOpenAppointments')}
            </Button>
          ) : null}
        </DetailActions>
      </DetailDialog>
    </>
  );
};
