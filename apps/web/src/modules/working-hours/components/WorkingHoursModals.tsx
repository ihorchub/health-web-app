import {
  IconAlertCircle,
  IconCalendarEvent,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react';
import { Trans, useTranslation } from 'react-i18next';
import { styled } from '@/theme/styled';

import { SheetDialog } from '@/components/Dialog/SheetDialog';
import type { ZoneBFormState } from '@/modules/working-hours/types';
import {
  DangerModalButton,
  DateRangeField,
  DayChips,
  DayInfoChip,
  DaysBlock,
  FromPill,
  GhostModalButton,
  InfoIconBubble,
  MintDot,
  ModalActions,
  ModalBody,
  ModalBodyStrong,
  ModalCloseButton,
  ModalHeaderRow,
  ModalPaper,
  ModalTitle,
  OutlineModalButton,
  OverlineLabel,
  PrimaryModalButton,
  SummaryBox,
  SummaryLine,
  SummaryList,
  SummaryListLabel,
  SummaryListRow,
  SummaryListValue,
  WarnCallout,
  Callout,
} from '@/modules/working-hours/styles';

export type WorkingHoursModalKind =
  | 'bulk'
  | 'vacationA'
  | 'vacationB'
  | 'vacationRemove'
  | 'saveB'
  | null;

interface WorkingHoursModalsProps {
  kind: WorkingHoursModalKind;
  zoneBStartLabel: string;
  zoneBShortLabel: string;
  bulkRangeLabel: string;
  bulkCount: number;
  emptiedDays: string[];
  vacationBRangeLabel: string;
  zoneBSaveRangeLabel: string;
  zoneBPriceFromLabel: string;
  zoneBWorkingDaysLabel: string;
  zoneBForm: ZoneBFormState;
  formatLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalShell = styled(SheetDialog)<{ $maxWidth: number }>(({ theme, $maxWidth }) => ({
  '& .MuiDialog-paper': {
    maxWidth: $maxWidth,
    width: '100%',
    borderRadius: 20,
    padding: theme.spacing(3.5, 3.5, 3),
    boxShadow: '0 1px 2px rgba(22, 62, 82, 0.06), 0 8px 24px rgba(22, 62, 82, 0.06)',
    boxSizing: 'border-box',

    [theme.breakpoints.down('sm')]: {
      borderRadius: 0,
      padding: theme.spacing(3, 2.5),
    },
  },
}));

export const WorkingHoursModals = ({
  kind,
  zoneBStartLabel,
  zoneBShortLabel,
  bulkRangeLabel,
  bulkCount,
  emptiedDays,
  vacationBRangeLabel,
  zoneBSaveRangeLabel,
  zoneBPriceFromLabel,
  zoneBWorkingDaysLabel,
  zoneBForm,
  formatLabel,
  onClose,
  onConfirm,
}: WorkingHoursModalsProps) => {
  const { t } = useTranslation('workingHours');
  const open = kind !== null;
  const maxWidth =
    kind === 'saveB' ? 520 : kind === 'vacationA' || kind === 'vacationRemove' ? 480 : 500;

  return (
    <ModalShell open={open} onClose={onClose} $maxWidth={maxWidth}>
      <ModalPaper>
        {kind === 'bulk' ? (
          <>
            <ModalHeaderRow>
              <ModalTitle>{t('modals.bulkTitle')}</ModalTitle>
              <ModalCloseButton type="button" aria-label="close" onClick={onClose}>
                <IconX size={16} />
              </ModalCloseButton>
            </ModalHeaderRow>
            <ModalBody>{t('modals.bulkBody')}</ModalBody>
            <SummaryBox>
              <SummaryLine>{t('modals.bulkRange', { range: bulkRangeLabel })}</SummaryLine>
              <SummaryLine>{t('modals.bulkCount', { count: bulkCount })}</SummaryLine>
              <SummaryLine $muted>{t('modals.bulkPendingNote')}</SummaryLine>
            </SummaryBox>
            <WarnCallout $tone="warn">
              <InfoIconBubble $tone="pink">
                <IconAlertCircle size={12} />
              </InfoIconBubble>
              <span>{t('modals.bulkWarning')}</span>
            </WarnCallout>
            <ModalActions>
              <OutlineModalButton variant="outlined" onClick={onClose}>
                {t('modals.bulkBack')}
              </OutlineModalButton>
              <DangerModalButton variant="outlined" onClick={onConfirm}>
                {t('modals.bulkConfirm')}
              </DangerModalButton>
            </ModalActions>
          </>
        ) : null}

        {kind === 'vacationA' ? (
          <>
            <ModalHeaderRow>
              <ModalTitle>{t('modals.vacationATitle')}</ModalTitle>
              <ModalCloseButton type="button" aria-label="close" onClick={onClose}>
                <IconX size={16} />
              </ModalCloseButton>
            </ModalHeaderRow>
            <ModalBody>{t('modals.vacationABody')}</ModalBody>
            <DaysBlock>
              <OverlineLabel>{t('modals.vacationADaysLabel')}</OverlineLabel>
              <DayChips>
                {emptiedDays.map((day) => (
                  <DayInfoChip key={day}>{day}</DayInfoChip>
                ))}
              </DayChips>
            </DaysBlock>
            <Callout $tone="mint">
              <InfoIconBubble $tone="mint">
                <IconAlertCircle size={12} color="currentColor" />
              </InfoIconBubble>
              <span>{t('modals.vacationANote')}</span>
            </Callout>
            <ModalActions>
              <OutlineModalButton variant="outlined" onClick={onClose}>
                {t('modals.cancel')}
              </OutlineModalButton>
              <PrimaryModalButton variant="contained" color="primary" onClick={onConfirm}>
                {t('modals.vacationAConfirm')}
              </PrimaryModalButton>
            </ModalActions>
          </>
        ) : null}

        {kind === 'vacationRemove' ? (
          <>
            <ModalHeaderRow>
              <ModalTitle>{t('modals.vacationRemoveTitle')}</ModalTitle>
              <ModalCloseButton type="button" aria-label="close" onClick={onClose}>
                <IconX size={16} />
              </ModalCloseButton>
            </ModalHeaderRow>
            <ModalBody>{t('modals.vacationRemoveBody')}</ModalBody>
            <DaysBlock>
              <OverlineLabel>{t('modals.vacationRemoveDaysLabel')}</OverlineLabel>
              <DayChips>
                {emptiedDays.map((day) => (
                  <DayInfoChip key={day}>{day}</DayInfoChip>
                ))}
              </DayChips>
            </DaysBlock>
            <Callout $tone="mint">
              <InfoIconBubble $tone="mint">
                <IconAlertCircle size={12} color="currentColor" />
              </InfoIconBubble>
              <span>{t('modals.vacationRemoveNote')}</span>
            </Callout>
            <ModalActions>
              <OutlineModalButton variant="outlined" onClick={onClose}>
                {t('modals.cancel')}
              </OutlineModalButton>
              <PrimaryModalButton variant="contained" color="primary" onClick={onConfirm}>
                {t('modals.vacationRemoveConfirm')}
              </PrimaryModalButton>
            </ModalActions>
          </>
        ) : null}

        {kind === 'vacationB' ? (
          <>
            <ModalHeaderRow>
              <ModalTitle>{t('modals.vacationBTitle')}</ModalTitle>
              <ModalCloseButton type="button" aria-label="close" onClick={onClose}>
                <IconX size={18} />
              </ModalCloseButton>
            </ModalHeaderRow>
            <ModalBody>{t('modals.vacationBBody')}</ModalBody>
            <FromPill>{t('modals.vacationBFrom', { date: zoneBShortLabel })}</FromPill>
            <DateRangeField>
              <span>{vacationBRangeLabel || t('modals.vacationBRangePlaceholder')}</span>
              <IconCalendarEvent size={18} />
            </DateRangeField>
            <Callout $tone="mint">
              <MintDot />
              <span>{t('modals.vacationBNote')}</span>
            </Callout>
            <ModalActions>
              <GhostModalButton onClick={onClose}>{t('modals.cancel')}</GhostModalButton>
              <PrimaryModalButton variant="contained" color="primary" onClick={onConfirm}>
                {t('modals.vacationBConfirm')}
              </PrimaryModalButton>
            </ModalActions>
          </>
        ) : null}

        {kind === 'saveB' ? (
          <>
            <ModalHeaderRow>
              <ModalTitle>{t('modals.saveBTitle')}</ModalTitle>
              <ModalCloseButton type="button" aria-label="close" onClick={onClose}>
                <IconX size={18} />
              </ModalCloseButton>
            </ModalHeaderRow>
            <ModalBody>
              <Trans
                t={t}
                i18nKey="modals.saveBBody"
                values={{
                  range: zoneBSaveRangeLabel || t('modals.saveBRangeFallback'),
                }}
                components={{ bold: <ModalBodyStrong /> }}
              />
            </ModalBody>
            <SummaryList>
              <SummaryListRow>
                <SummaryListLabel>{t('modals.saveBWorkingDays')}</SummaryListLabel>
                <SummaryListValue>{zoneBWorkingDaysLabel}</SummaryListValue>
              </SummaryListRow>
              <SummaryListRow>
                <SummaryListLabel>{t('modals.saveBHours')}</SummaryListLabel>
                <SummaryListValue>
                  {t('modals.saveBHoursValue', {
                    start: zoneBForm.workStart,
                    end: zoneBForm.workEnd,
                    lunchStart: zoneBForm.lunchStart,
                    lunchEnd: zoneBForm.lunchEnd,
                  })}
                </SummaryListValue>
              </SummaryListRow>
              <SummaryListRow>
                <SummaryListLabel>{t('modals.saveBDuration')}</SummaryListLabel>
                <SummaryListValue>
                  {t('modals.saveBDurationValue', {
                    minutes: zoneBForm.customDuration ?? zoneBForm.durationMinutes,
                  })}
                </SummaryListValue>
              </SummaryListRow>
              <SummaryListRow>
                <SummaryListLabel>{t('modals.saveBFormat')}</SummaryListLabel>
                <SummaryListValue>{formatLabel}</SummaryListValue>
              </SummaryListRow>
              <SummaryListRow>
                <SummaryListLabel>{t('modals.saveBPrice')}</SummaryListLabel>
                <SummaryListValue>
                  {t('modals.saveBPriceValue', {
                    price: zoneBForm.priceUah,
                    date: zoneBPriceFromLabel || zoneBShortLabel,
                  })}
                </SummaryListValue>
              </SummaryListRow>
            </SummaryList>
            <WarnCallout $tone="warn">
              <InfoIconBubble $tone="pink">
                <IconInfoCircle size={14} />
              </InfoIconBubble>
              <span>{t('modals.saveBNote')}</span>
            </WarnCallout>
            <ModalActions $spread>
              <GhostModalButton onClick={onClose}>{t('modals.back')}</GhostModalButton>
              <PrimaryModalButton variant="contained" color="primary" onClick={onConfirm}>
                {t('modals.saveBConfirm')}
              </PrimaryModalButton>
            </ModalActions>
          </>
        ) : null}
      </ModalPaper>
    </ModalShell>
  );
};
