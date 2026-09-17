import { Button, styled } from '@mui/material';
import {
  IconCalendarEvent,
  IconChevronLeft,
  IconChevronRight,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SheetDialog } from '@/components/Dialog/SheetDialog';
import { useAppRole } from '@/hooks/useAppRole';
import type { DoctorDayVisit, FreeWindowSlot, VisitFormat } from '@/modules/doctor-day/types';
import {
  DEMO_DOCTOR_DAY,
  PROPOSE_DATE_CHIPS,
} from '@/modules/doctor-day/utils/mapDashboard';
import {
  DayChip,
  DayChips,
  DateTimePanel,
  DangerOutlineButton,
  FieldBlock,
  FieldLabel,
  FormatRow,
  FormatSideLabel,
  FormatSwitchGroup,
  FormatTrack,
  LockedField,
  MetaChip,
  ModalActions,
  ModalCloseButton,
  ModalHeaderRow,
  ModalOverline,
  ModalPaper,
  ModalSubtitle,
  ModalTitle,
  ModalTitleBlock,
  MonthLabel,
  MonthNav,
  MonthNavButton,
  MonthNavButtons,
  OutlineButton,
  ProposeSummary,
  ProposeSummaryCopy,
  ProposeSummaryIcon,
  ProposeSummaryMeta,
  ProposeSummaryTitle,
  ScheduleChevron,
  ScheduleSlotMain,
  ScheduleSlotMeta,
  ScheduleSlotName,
  ScheduleSlotRow,
  ScheduleSlotTime,
  SlotChip,
  SlotPicker,
  SoftStatusPill,
  VisitCardActions,
  VisitCardBody,
  VisitCardContact,
  VisitCardChips,
  VisitCardDuration,
  VisitCardHeader,
  VisitCardMain,
  VisitCardName,
  VisitCardNameRow,
  VisitCardReason,
  VisitCardShell,
  VisitCardTime,
  VisitCardTimeCol,
} from '@/modules/doctor-day/styles';
import { formatTime } from '@/modules/patient-room/utils/formatCabinetDate';

const ProposeDialog = styled(SheetDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 560,
    width: '100%',
    borderRadius: 20,
    padding: theme.spacing(2.5, 2),
    boxShadow: '0 16px 48px rgba(22, 62, 82, 0.14)',
    boxSizing: 'border-box',

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3.5),
    },

    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      padding: theme.spacing(2.5, 2),
    },
  },
}));

const ScheduleDialog = styled(SheetDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 700,
    width: '100%',
    borderRadius: 20,
    padding: theme.spacing(2.5, 2),
    boxShadow: '0 16px 48px rgba(22, 62, 82, 0.14)',
    boxSizing: 'border-box',

    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(3.5),
    },

    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
    },
  },
}));

const VisitDialog = styled(SheetDialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 600,
    width: '100%',
    borderRadius: 20,
    padding: 0,
    overflow: 'hidden',
    boxShadow: '0 16px 48px rgba(22, 62, 82, 0.14)',

    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      margin: 0,
      maxHeight: '100dvh',
      height: 'auto',
    },
  },
}));

const softTone = (
  status: DoctorDayVisit['status'],
): 'accent' | 'warning' | 'error' | 'muted' => {
  if (status === 'cancelled') {
    return 'error';
  }
  if (status === 'reschedule_pending') {
    return 'warning';
  }
  if (status === 'completed' || status === 'rescheduled' || status === 'reserved') {
    return 'muted';
  }
  return 'accent';
};

const scheduleVariant = (
  status: DoctorDayVisit['status'],
): 'booked' | 'pending' | 'cancelled' => {
  if (status === 'cancelled') {
    return 'cancelled';
  }
  if (status === 'reschedule_pending') {
    return 'pending';
  }
  return 'booked';
};

const formatShortDate = (iso: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(iso));

const formatDayHeading = (ymd: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(`${ymd}T12:00:00+03:00`));

const formatMonthYear = (ymd: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(`${ymd}T12:00:00+03:00`));

const formatProposeMeta = (ymd: string, locale: string) =>
  new Intl.DateTimeFormat(locale === 'uk' ? 'uk-UA' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Kyiv',
  }).format(new Date(`${ymd}T12:00:00+03:00`));

interface ProposeTimeDialogProps {
  visit: DoctorDayVisit | null;
  open: boolean;
  onClose: () => void;
  /** Clock labels for chips, e.g. "15:00" */
  slotLabels: string[];
  /** Matching ISO start times for submit */
  slotIsos: string[];
  onSubmit: (proposedStartAt: string) => void;
}

export const ProposeTimeDialog = ({
  visit,
  open,
  onClose,
  slotLabels,
  slotIsos,
  onSubmit,
}: ProposeTimeDialogProps) => {
  const { t, i18n } = useTranslation('doctorDay');
  const { me } = useAppRole();
  const [selectedYmd, setSelectedYmd] = useState(DEMO_DOCTOR_DAY);
  const [slotIndex, setSlotIndex] = useState(0);
  const [format, setFormat] = useState<VisitFormat>('offline');

  useEffect(() => {
    if (open && visit) {
      setSelectedYmd(DEMO_DOCTOR_DAY);
      setSlotIndex(0);
      setFormat(visit.format);
    }
  }, [open, visit]);

  if (!visit) {
    return null;
  }

  const slotLabel = slotLabels[slotIndex] ?? slotLabels[0] ?? '—';
  const slotIso = slotIsos[slotIndex] ?? slotIsos[0];

  const doctorLabel = me
    ? t('modals.doctorShort', { name: `${me.firstName} ${me.lastName}` })
    : t('modals.doctorShort', { name: 'Оксана Коваленко' });

  return (
    <ProposeDialog open={open} onClose={onClose} fullWidth>
      <ModalPaper>
        <ModalHeaderRow>
          <ModalTitleBlock>
            <ModalTitle>{t('modals.proposeTitle')}</ModalTitle>
            <ModalSubtitle>{t('modals.proposeStep')}</ModalSubtitle>
          </ModalTitleBlock>
          <ModalCloseButton type="button" aria-label={t('modals.close')} onClick={onClose}>
            <IconX size={14} stroke={1.75} />
          </ModalCloseButton>
        </ModalHeaderRow>

        <ProposeSummary>
          <ProposeSummaryIcon>
            <IconCalendarEvent size={18} stroke={1.75} />
          </ProposeSummaryIcon>
          <ProposeSummaryCopy>
            <ProposeSummaryTitle>
              {t('modals.proposeSummaryTitle', {
                time: slotLabel,
                minutes: visit.durationMinutes,
              })}
            </ProposeSummaryTitle>
            <ProposeSummaryMeta>
              {t('modals.proposeSummaryMeta', {
                date: formatProposeMeta(selectedYmd, i18n.language),
                doctor: doctorLabel,
              })}
            </ProposeSummaryMeta>
          </ProposeSummaryCopy>
        </ProposeSummary>

        <FieldBlock>
          <FieldLabel>{t('modals.dateTime')}</FieldLabel>
          <DateTimePanel>
            <MonthNav>
              <MonthLabel>{formatMonthYear(selectedYmd, i18n.language)}</MonthLabel>
              <MonthNavButtons>
                <MonthNavButton type="button" aria-label={t('modals.prevMonth')} disabled>
                  <IconChevronLeft size={12} stroke={2} />
                </MonthNavButton>
                <MonthNavButton type="button" aria-label={t('modals.nextMonth')} disabled>
                  <IconChevronRight size={12} stroke={2} />
                </MonthNavButton>
              </MonthNavButtons>
            </MonthNav>

            <DayChips>
              {PROPOSE_DATE_CHIPS.map((day) => (
                <DayChip
                  key={day.ymd}
                  type="button"
                  $active={selectedYmd === day.ymd}
                  $disabled={day.disabled}
                  disabled={day.disabled}
                  onClick={() => {
                    setSelectedYmd(day.ymd);
                  }}
                >
                  {day.day}
                </DayChip>
              ))}
            </DayChips>

            <SlotPicker>
              {slotLabels.map((value, index) => (
                <SlotChip
                  key={value}
                  type="button"
                  $active={slotIndex === index}
                  onClick={() => {
                    setSlotIndex(index);
                  }}
                >
                  {value}
                </SlotChip>
              ))}
            </SlotPicker>
          </DateTimePanel>
        </FieldBlock>

        <FieldBlock>
          <FieldLabel>{t('modals.currentVisit')}</FieldLabel>
          <LockedField>
            <IconSearch size={16} stroke={1.75} />
            <span>{t('modals.patientAlreadyBooked')}</span>
          </LockedField>
        </FieldBlock>

        <FormatRow>
          <FieldLabel>{t('modals.visitFormat')}</FieldLabel>
          <FormatSwitchGroup>
            <FormatSideLabel $active={format === 'offline'}>{t('format.offline')}</FormatSideLabel>
            <FormatTrack
              type="button"
              $online={format === 'online'}
              aria-label={t('modals.visitFormat')}
              onClick={() => {
                setFormat((current) => (current === 'online' ? 'offline' : 'online'));
              }}
            />
            <FormatSideLabel $active={format === 'online'}>{t('format.online')}</FormatSideLabel>
          </FormatSwitchGroup>
        </FormatRow>

        <ModalActions>
          <OutlineButton variant="outlined" color="inherit" onClick={onClose}>
            {t('modals.cancel')}
          </OutlineButton>
          <Button
            variant="contained"
            color="primary"
            disabled={!slotIso}
            onClick={() => {
              if (!slotIso) {
                return;
              }
              onSubmit(slotIso);
              onClose();
            }}
          >
            {t('modals.next')}
          </Button>
        </ModalActions>
      </ModalPaper>
    </ProposeDialog>
  );
};

interface VisitCardDialogProps {
  visit: DoctorDayVisit | null;
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
  onPropose?: () => void;
  onCancel?: () => void;
}

export const VisitCardDialog = ({
  visit,
  open,
  onClose,
  onComplete,
  onPropose,
  onCancel,
}: VisitCardDialogProps) => {
  const { t, i18n } = useTranslation('doctorDay');

  if (!visit) {
    return null;
  }

  const canAct = visit.status === 'upcoming';
  const contactParts = [
    visit.phone ? t('modals.phone', { value: visit.phone }) : null,
    visit.email ? t('modals.email', { value: visit.email }) : null,
  ].filter(Boolean);

  return (
    <VisitDialog open={open} onClose={onClose} fullWidth>
      <VisitCardShell>
        <VisitCardHeader>
          <ModalOverline>{t('modals.visitCardTitle')}</ModalOverline>
          <ModalCloseButton type="button" aria-label={t('modals.close')} onClick={onClose}>
            <IconX size={14} stroke={1.75} />
          </ModalCloseButton>
        </VisitCardHeader>

        <VisitCardBody>
          <VisitCardTimeCol>
            <VisitCardTime>{formatTime(visit.startsAt, i18n.language)}</VisitCardTime>
            <VisitCardDuration>
              {t('nextVisit.durationMin', { minutes: visit.durationMinutes })}
            </VisitCardDuration>
          </VisitCardTimeCol>

          <VisitCardMain>
            <VisitCardNameRow>
              <VisitCardName>{visit.patientName}</VisitCardName>
              <SoftStatusPill $tone={softTone(visit.status)}>
                {t(`status.${visit.status}`)}
              </SoftStatusPill>
            </VisitCardNameRow>

            <VisitCardChips>
              <MetaChip>{t(`format.${visit.format}`)}</MetaChip>
              <MetaChip>{formatShortDate(visit.startsAt, i18n.language)}</MetaChip>
            </VisitCardChips>

            {visit.reason ? (
              <VisitCardReason>{t('list.reason', { reason: visit.reason })}</VisitCardReason>
            ) : null}

            {contactParts.length > 0 ? (
              <VisitCardContact>{contactParts.join(' · ')}</VisitCardContact>
            ) : null}
          </VisitCardMain>
        </VisitCardBody>

        {canAct ? (
          <VisitCardActions>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                onComplete?.();
                onClose();
              }}
            >
              {t('nextVisit.complete')}
            </Button>
            <OutlineButton
              variant="outlined"
              color="inherit"
              onClick={() => {
                onPropose?.();
              }}
            >
              {t('nextVisit.propose')}
            </OutlineButton>
            <DangerOutlineButton
              variant="outlined"
              onClick={() => {
                onCancel?.();
                onClose();
              }}
            >
              {t('nextVisit.cancel')}
            </DangerOutlineButton>
          </VisitCardActions>
        ) : null}
      </VisitCardShell>
    </VisitDialog>
  );
};

interface DayScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  visits: DoctorDayVisit[];
  freeWindows: FreeWindowSlot[];
  onOpenVisit: (visit: DoctorDayVisit) => void;
}

export const DayScheduleDialog = ({
  open,
  onClose,
  visits,
  freeWindows,
  onOpenVisit,
}: DayScheduleDialogProps) => {
  const { t, i18n } = useTranslation('doctorDay');

  const orderedVisits = useMemo(
    () => [...visits].sort((a, b) => a.startsAt.localeCompare(b.startsAt)),
    [visits],
  );

  const freeCount = freeWindows.reduce((sum, window) => sum + window.slotsCount, 0);

  return (
    <ScheduleDialog open={open} onClose={onClose} fullWidth>
      <ModalPaper>
        <ModalHeaderRow>
          <ModalTitleBlock>
            <ModalTitle>{formatDayHeading(DEMO_DOCTOR_DAY, i18n.language)}</ModalTitle>
            <ModalSubtitle>
              {t('modals.dayScheduleMeta', {
                visits: orderedVisits.length,
                free: freeCount,
              })}
            </ModalSubtitle>
          </ModalTitleBlock>
          <ModalCloseButton type="button" aria-label={t('modals.close')} onClick={onClose}>
            <IconX size={14} stroke={1.75} />
          </ModalCloseButton>
        </ModalHeaderRow>

        {orderedVisits.map((visit) => {
          const variant = scheduleVariant(visit.status);
          const meta =
            visit.status === 'cancelled' && visit.cancelledBy
              ? visit.cancelledBy === 'patient'
                ? t('list.cancelledByPatient')
                : t('list.cancelledByDoctor')
              : visit.status === 'reschedule_pending' && visit.proposedTime
                ? t('list.pendingNote', {
                    original: formatTime(visit.startsAt, i18n.language),
                    proposed: formatTime(visit.proposedTime, i18n.language),
                  })
                : visit.status === 'reserved'
                  ? t('list.reservedNote')
                  : [t(`format.${visit.format}`), visit.reason].filter(Boolean).join(' · ');

          return (
            <ScheduleSlotRow
              key={visit.id}
              type="button"
              $variant={variant}
              onClick={() => {
                onClose();
                onOpenVisit(visit);
              }}
            >
              <ScheduleSlotTime
                $tone={variant === 'cancelled' ? 'strike' : 'default'}
              >
                {formatTime(visit.startsAt, i18n.language)}
              </ScheduleSlotTime>
              <ScheduleSlotMain>
                <ScheduleSlotName $muted={variant === 'cancelled'}>
                  {visit.patientName}
                </ScheduleSlotName>
                <ScheduleSlotMeta
                  $tone={
                    variant === 'pending'
                      ? 'warning'
                      : variant === 'cancelled'
                        ? 'error'
                        : 'default'
                  }
                >
                  {meta}
                </ScheduleSlotMeta>
              </ScheduleSlotMain>
              <SoftStatusPill $tone={softTone(visit.status)}>
                {visit.status === 'reschedule_pending'
                  ? t('modals.statusWaitingShort')
                  : t(`status.${visit.status}`)}
              </SoftStatusPill>
              <ScheduleChevron>›</ScheduleChevron>
            </ScheduleSlotRow>
          );
        })}

        {freeWindows.map((window) => (
          <ScheduleSlotRow key={window.id} type="button" $variant="free" disabled>
            <ScheduleSlotTime $tone="accent">{window.start}</ScheduleSlotTime>
            <ScheduleSlotMain>
              <ScheduleSlotName $muted>
                {t('modals.freeSlotTitle', { minutes: 30 })}
              </ScheduleSlotName>
              <ScheduleSlotMeta $tone="accent">{t('modals.freeSlotHint')}</ScheduleSlotMeta>
            </ScheduleSlotMain>
            <ScheduleChevron>+</ScheduleChevron>
          </ScheduleSlotRow>
        ))}
      </ModalPaper>
    </ScheduleDialog>
  );
};
