import { IconMail } from '@tabler/icons-react';
import { styled } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  usePostAuthRegisterResendEmail,
  usePostAuthRegisterVerifyEmail,
} from '@/api/auth';
import { Body, Meta, TitleH2 } from '@/components/Text';
import {
  AuthTextField,
  ErrorText,
  FieldBlock,
  FieldLabel,
  FormCard,
  PrimaryButton,
  TextButton,
  StepHeading,
  SubmitSpacer,
} from '@/modules/auth/components/authStyles';
import { useAuthApiErrorMessage } from '@/modules/auth/hooks/useAuthApiErrorMessage';
import { FieldName } from '@/modules/auth/signup/form/step2Fields';
import {
  step2ValidationSchema,
  type Step2FormValues,
} from '@/modules/auth/signup/form/step2Validation';
import type { SignupDraft } from '@/modules/auth/signup/utils/signupDraft';

const MailIconWrap = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: 999,
  backgroundColor:
    theme.palette.mode === 'light' ? '#E8F7F2' : 'rgba(62, 196, 163, 0.16)',
  color: theme.palette.primary.main,
}));

const EmailCopy = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  textAlign: 'center',
  marginBottom: theme.spacing(2),
}));

interface Step2EmailProps {
  draft: SignupDraft;
  onSuccess: (draft: SignupDraft) => void;
}

export const Step2Email = ({ draft, onSuccess }: Step2EmailProps) => {
  const { t } = useTranslation('auth');
  const verifyMutation = usePostAuthRegisterVerifyEmail();
  const resendMutation = usePostAuthRegisterResendEmail();
  const mapError = useAuthApiErrorMessage();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step2FormValues>({
    resolver: step2ValidationSchema,
    defaultValues: {
      [FieldName.token]: draft.devVerifyToken ?? '',
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await verifyMutation.mutateAsync({
        registrationId: draft.registrationId,
        token: values.token.trim(),
      });
      onSuccess({ ...draft, step: 3, devVerifyToken: undefined });
    } catch (error) {
      toast.error(mapError(error));
    }
  });

  const handleResend = async () => {
    try {
      const result = await resendMutation.mutateAsync({
        registrationId: draft.registrationId,
      });
      toast.success(t('signup.step2.resendOk', { email: result.sentTo }));
    } catch (error) {
      toast.error(mapError(error));
    }
  };

  return (
    <>
      <StepHeading>
        <TitleH2>{t('signup.step2.title')}</TitleH2>
        <Body color="textSecondary">{t('signup.step2.subtitle')}</Body>
      </StepHeading>

      <FormCard onSubmit={onSubmit} noValidate>
        <EmailCopy>
          <MailIconWrap>
            <IconMail size={28} stroke={1.75} />
          </MailIconWrap>
          <Body color="textSecondary">
            {t('signup.step2.sentTo', { email: draft.email })}
          </Body>
        </EmailCopy>

        <FieldBlock>
          <FieldLabel htmlFor={FieldName.token}>{t('signup.step2.token')}</FieldLabel>
          <Controller
            name={FieldName.token}
            control={control}
            render={({ field }) => (
              <AuthTextField
                {...field}
                id={FieldName.token}
                autoComplete="one-time-code"
                error={Boolean(errors.token)}
              />
            )}
          />
          {import.meta.env.DEV ? (
            <Meta color="textSecondary">{t('signup.step2.tokenHint')}</Meta>
          ) : null}
        </FieldBlock>

        {verifyMutation.isError ? (
          <ErrorText>{mapError(verifyMutation.error)}</ErrorText>
        ) : null}

        <SubmitSpacer>
          <PrimaryButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={verifyMutation.isPending}
          >
            {t('signup.step2.submit')}
          </PrimaryButton>
        </SubmitSpacer>

        <TextButton
          type="button"
          onClick={handleResend}
          disabled={resendMutation.isPending}
        >
          {t('signup.step2.resend')}
        </TextButton>
      </FormCard>
    </>
  );
};
