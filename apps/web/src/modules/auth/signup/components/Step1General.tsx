import { Trans, useTranslation } from 'react-i18next';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { usePostAuthRegisterStep1 } from '@/api/auth';
import { Body, TitleH2 } from '@/components/Text';
import { AppLanguage } from '@/i18n';
import { useThemeMode } from '@/hooks/useThemeMode';
import {
  AuthTextField,
  ConsentCheckbox,
  ConsentLabel,
  ConsentRow,
  ErrorText,
  FieldBlock,
  FieldLabel,
  FormCard,
  InlineLink,
  NameCol,
  NameRow,
  PrimaryButton,
  RoleRow,
  SegmentButton,
  StepHeading,
  SubmitSpacer,
} from '@/modules/auth/components/authStyles';
import { useAuthApiErrorMessage } from '@/modules/auth/hooks/useAuthApiErrorMessage';
import { FieldName } from '@/modules/auth/signup/form/step1Fields';
import {
  step1ValidationSchema,
  type Step1FormValues,
} from '@/modules/auth/signup/form/step1Validation';
import type { SignupDraft } from '@/modules/auth/signup/utils/signupDraft';
import { AppRoute } from '@/utils/routeUtils/routes';

interface Step1GeneralProps {
  onSuccess: (draft: SignupDraft) => void;
}

export const Step1General = ({ onSuccess }: Step1GeneralProps) => {
  const { t, i18n } = useTranslation('auth');
  const { mode } = useThemeMode();
  const mutation = usePostAuthRegisterStep1();
  const mapError = useAuthApiErrorMessage();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<Step1FormValues>({
    resolver: step1ValidationSchema,
    mode: 'onChange',
    defaultValues: {
      [FieldName.role]: 'patient',
      [FieldName.firstName]: '',
      [FieldName.lastName]: '',
      [FieldName.email]: '',
      [FieldName.password]: '',
      [FieldName.passwordConfirm]: '',
      [FieldName.acceptedPrivacy]: false,
      [FieldName.acceptedTerms]: false,
    },
  });

  const role = useWatch({ control, name: FieldName.role });
  const acceptedPrivacy = useWatch({ control, name: FieldName.acceptedPrivacy });
  const acceptedTerms = useWatch({ control, name: FieldName.acceptedTerms });

  const onSubmit = handleSubmit(async (values) => {
    try {
      const result = await mutation.mutateAsync({
        role: values.role,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        acceptedPrivacy: values.acceptedPrivacy,
        acceptedTerms: values.acceptedTerms,
        language: i18n.language === AppLanguage.EN ? 'en' : 'uk',
        theme: mode,
      });

      onSuccess({
        registrationId: result.registrationId,
        email: result.email,
        role: result.role,
        step: 2,
        devVerifyToken: result.devVerifyToken,
      });
    } catch (error) {
      toast.error(mapError(error));
    }
  });

  return (
    <>
      <StepHeading>
        <TitleH2>{t('signup.step1.title')}</TitleH2>
        <Body color="textSecondary">{t('signup.step1.subtitle')}</Body>
      </StepHeading>

      <FormCard onSubmit={onSubmit} noValidate>
        <FieldLabel as="div">{t('signup.step1.roleLabel')}</FieldLabel>
        <RoleRow>
          <SegmentButton
            type="button"
            $active={role === 'patient'}
            onClick={() => {
              setValue(FieldName.role, 'patient', { shouldValidate: true });
            }}
          >
            {t('signup.step1.rolePatient')}
          </SegmentButton>
          <SegmentButton
            type="button"
            $active={role === 'doctor'}
            onClick={() => {
              setValue(FieldName.role, 'doctor', { shouldValidate: true });
            }}
          >
            {t('signup.step1.roleDoctor')}
          </SegmentButton>
        </RoleRow>

        <NameRow>
          <NameCol>
            <FieldLabel htmlFor={FieldName.firstName}>
              {t('signup.step1.firstName')}
            </FieldLabel>
            <Controller
              name={FieldName.firstName}
              control={control}
              render={({ field }) => (
                <AuthTextField
                  {...field}
                  id={FieldName.firstName}
                  autoComplete="given-name"
                  error={Boolean(errors.firstName)}
                />
              )}
            />
          </NameCol>
          <NameCol>
            <FieldLabel htmlFor={FieldName.lastName}>
              {t('signup.step1.lastName')}
            </FieldLabel>
            <Controller
              name={FieldName.lastName}
              control={control}
              render={({ field }) => (
                <AuthTextField
                  {...field}
                  id={FieldName.lastName}
                  autoComplete="family-name"
                  error={Boolean(errors.lastName)}
                />
              )}
            />
          </NameCol>
        </NameRow>

        <FieldBlock $mt={4}>
          <FieldLabel htmlFor={FieldName.email}>{t('signup.step1.email')}</FieldLabel>
          <Controller
            name={FieldName.email}
            control={control}
            render={({ field }) => (
              <AuthTextField
                {...field}
                id={FieldName.email}
                type="email"
                autoComplete="email"
                error={Boolean(errors.email)}
              />
            )}
          />
        </FieldBlock>

        <FieldBlock $mt={2}>
          <FieldLabel htmlFor={FieldName.password}>
            {t('signup.step1.password')}
          </FieldLabel>
          <Controller
            name={FieldName.password}
            control={control}
            render={({ field }) => (
              <AuthTextField
                {...field}
                id={FieldName.password}
                type="password"
                autoComplete="new-password"
                error={Boolean(errors.password)}
              />
            )}
          />
        </FieldBlock>

        <FieldBlock $mt={2}>
          <FieldLabel htmlFor={FieldName.passwordConfirm}>
            {t('signup.step1.passwordConfirm')}
          </FieldLabel>
          <Controller
            name={FieldName.passwordConfirm}
            control={control}
            render={({ field }) => (
              <AuthTextField
                {...field}
                id={FieldName.passwordConfirm}
                type="password"
                autoComplete="new-password"
                error={Boolean(errors.passwordConfirm)}
              />
            )}
          />
        </FieldBlock>

        <ConsentRow>
          <Controller
            name={FieldName.acceptedPrivacy}
            control={control}
            render={({ field }) => (
              <ConsentLabel
                control={
                  <ConsentCheckbox
                    checked={field.value}
                    onChange={(_, checked) => {
                      field.onChange(checked);
                    }}
                  />
                }
                label={
                  <Trans
                    i18nKey="signup.step1.privacy"
                    ns="auth"
                    components={{
                      privacy: <InlineLink to={AppRoute.PRIVACY} />,
                    }}
                  />
                }
              />
            )}
          />
          <Controller
            name={FieldName.acceptedTerms}
            control={control}
            render={({ field }) => (
              <ConsentLabel
                control={
                  <ConsentCheckbox
                    checked={field.value}
                    onChange={(_, checked) => {
                      field.onChange(checked);
                    }}
                  />
                }
                label={
                  <Trans
                    i18nKey="signup.step1.terms"
                    ns="auth"
                    components={{
                      terms: <InlineLink to={AppRoute.TERMS} />,
                    }}
                  />
                }
              />
            )}
          />
        </ConsentRow>

        {mutation.isError ? <ErrorText>{mapError(mutation.error)}</ErrorText> : null}

        <SubmitSpacer>
          <PrimaryButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={
              mutation.isPending || !isValid || !acceptedPrivacy || !acceptedTerms
            }
          >
            {t('signup.step1.submit')}
          </PrimaryButton>
        </SubmitSpacer>
      </FormCard>
    </>
  );
};
