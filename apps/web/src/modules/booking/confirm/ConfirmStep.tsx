import { TextField, styled } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { FieldLabel } from '@/modules/booking/doctor-profile/styles';
import { FieldName } from '@/modules/booking/confirm/form/fields';
import {
  validationSchema,
  type ConfirmFormValues,
} from '@/modules/booking/confirm/form/validation';
import {
  formatConfirmDate,
  formatSlotTime,
} from '@/modules/booking/wizard/formatBookingDate';
import type { BookingSelection } from '@/modules/booking/wizard/types';

const ConfirmBody = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3.5),
  flexGrow: 1,
  overflowY: 'auto',
  padding: theme.spacing(3, 3.5),
}));

const SummaryList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

const SummaryRow = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: theme.spacing(2),
  width: '100%',
  padding: theme.spacing(1.75, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const SummaryLabel = styled('div')(({ theme }) => ({
  ...theme.typography.caption,
  width: 140,
  flexShrink: 0,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: theme.palette.text.secondary,
}));

const SummaryValue = styled('div')(({ theme }) => ({
  ...theme.typography.body1,
  flexGrow: 1,
  fontWeight: 600,
  textAlign: 'right',
  color: theme.palette.text.primary,
}));

const SummaryPlace = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 2,
  flexGrow: 1,
});

const SummaryAddress = styled('div')(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: 14,
  lineHeight: '20px',
  textAlign: 'right',
  color: theme.palette.text.secondary,
}));

const ReasonBlock = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.25),
  width: '100%',
}));

const ReasonHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: theme.spacing(1.5),
  width: '100%',
}));

const OptionalHint = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

const ErrorBanner = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  borderRadius: 8,
  border: `1px solid ${theme.palette.error.main}`,
  backgroundColor: theme.palette.background.paper,
}));

const ErrorText = styled('div')(({ theme }) => ({
  ...theme.typography.body2,
  color: theme.palette.error.main,
}));

const ErrorAction = styled('button')(({ theme }) => ({
  ...theme.typography.body2,
  padding: 0,
  border: 'none',
  background: 'none',
  color: theme.palette.primary.main,
  fontWeight: 600,
  cursor: 'pointer',
  textDecoration: 'underline',
}));

interface ConfirmStepProps {
  selection: BookingSelection;
  clinicName: string;
  cityName: string;
  address: string;
  errorMessage: string | null;
  onSubmit: (reason: string) => void;
  onPickAnother: () => void;
  formId: string;
}

export const ConfirmStep = ({
  selection,
  clinicName,
  cityName,
  address,
  errorMessage,
  onSubmit,
  onPickAnother,
  formId,
}: ConfirmStepProps) => {
  const { t, i18n } = useTranslation('booking');
  const { control, handleSubmit } = useForm<ConfirmFormValues>({
    resolver: validationSchema,
    defaultValues: {
      [FieldName.reason]: '',
    },
  });

  const placeLine = [clinicName, cityName].filter(Boolean).join(' · ');
  const timeLine = `${formatSlotTime(selection.startAt)} · ${t('durationMinutes', {
    count: selection.visitDurationMinutes,
  })}`;

  return (
    <ConfirmBody
      id={formId}
      onSubmit={handleSubmit((values) => {
        onSubmit(values[FieldName.reason] ?? '');
      })}
    >
      {errorMessage ? (
        <ErrorBanner role="alert">
          <ErrorText>{errorMessage}</ErrorText>
          <ErrorAction type="button" onClick={onPickAnother}>
            {t('confirm.pickAnother')}
          </ErrorAction>
        </ErrorBanner>
      ) : null}

      <SummaryList>
        <SummaryRow>
          <SummaryLabel>{t('confirm.date')}</SummaryLabel>
          <SummaryValue>
            {formatConfirmDate(selection.date, i18n.language)}
          </SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>{t('confirm.time')}</SummaryLabel>
          <SummaryValue>{timeLine}</SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>{t('confirm.format')}</SummaryLabel>
          <SummaryValue>
            {selection.format === 'online' ? t('formatOnline') : t('formatOffline')}
          </SummaryValue>
        </SummaryRow>
        <SummaryRow>
          <SummaryLabel>{t('confirm.place')}</SummaryLabel>
          <SummaryPlace>
            <SummaryValue>{placeLine}</SummaryValue>
            {address ? <SummaryAddress>{address}</SummaryAddress> : null}
          </SummaryPlace>
        </SummaryRow>
      </SummaryList>

      <ReasonBlock>
        <ReasonHeader>
          <FieldLabel>{t('confirm.reason')}</FieldLabel>
          <OptionalHint>{t('confirm.reasonOptional')}</OptionalHint>
        </ReasonHeader>
        <Controller
          name={FieldName.reason}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              multiline
              minRows={3}
              fullWidth
              placeholder={t('confirm.reasonPlaceholder')}
            />
          )}
        />
      </ReasonBlock>
    </ConfirmBody>
  );
};
