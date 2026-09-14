import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { usePostAuthRegisterComplete, usePostAuthRegisterStep3Patient } from '@/api/auth';
import { useGetReferenceCities, useGetReferenceClinics } from '@/api/reference';
import { Body, TitleH2 } from '@/components/Text';
import {
  AuthSelect,
  AuthTextField,
  ErrorText,
  FieldLabel,
  FormCard,
  PrimaryButton,
  ProfileFields,
  RoleRow,
  SegmentButton,
  StepHeading,
  SubmitSpacer,
} from '@/modules/auth/components/authStyles';
import { useAuthApiErrorMessage } from '@/modules/auth/hooks/useAuthApiErrorMessage';
import { FieldName } from '@/modules/auth/signup/form/patientProfileFields';
import {
  patientProfileValidationSchema,
  type PatientProfileFormValues,
} from '@/modules/auth/signup/form/patientProfileValidation';
import type { SignupDraft } from '@/modules/auth/signup/utils/signupDraft';
import { MenuItem } from '@mui/material';

interface Step3PatientProps {
  draft: SignupDraft;
  onSuccess: (draft: SignupDraft) => void;
}

export const Step3Patient = ({ draft, onSuccess }: Step3PatientProps) => {
  const { t } = useTranslation('auth');
  const citiesQuery = useGetReferenceCities();
  const step3Mutation = usePostAuthRegisterStep3Patient();
  const completeMutation = usePostAuthRegisterComplete();
  const mapError = useAuthApiErrorMessage();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PatientProfileFormValues>({
    resolver: patientProfileValidationSchema,
    defaultValues: {
      [FieldName.dob]: '',
      [FieldName.gender]: 'female',
      [FieldName.cityId]: '',
      [FieldName.clinicId]: '',
    },
  });

  const cityId = useWatch({ control, name: FieldName.cityId });
  const gender = useWatch({ control, name: FieldName.gender });
  const clinicsQuery = useGetReferenceClinics(cityId || undefined);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await step3Mutation.mutateAsync({
        registrationId: draft.registrationId,
        dob: values.dob,
        gender: values.gender,
        cityId: values.cityId,
        clinicId: values.clinicId,
      });
      const session = await completeMutation.mutateAsync({
        registrationId: draft.registrationId,
      });
      onSuccess({ ...draft, step: 4, redirectTo: session.redirectTo });
    } catch (error) {
      toast.error(mapError(error));
    }
  });

  const pending = step3Mutation.isPending || completeMutation.isPending;

  return (
    <>
      <StepHeading>
        <TitleH2>{t('signup.step3Patient.title')}</TitleH2>
        <Body color="textSecondary">{t('signup.step3Patient.subtitle')}</Body>
      </StepHeading>

      <FormCard onSubmit={onSubmit} noValidate>
        <ProfileFields>
          <div>
            <FieldLabel htmlFor={FieldName.dob}>
              {t('signup.step3Patient.dob')}
            </FieldLabel>
            <Controller
              name={FieldName.dob}
              control={control}
              render={({ field }) => (
                <AuthTextField
                  {...field}
                  id={FieldName.dob}
                  type="date"
                  error={Boolean(errors.dob)}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
          </div>

          <div>
            <FieldLabel as="div">{t('signup.step3Patient.gender')}</FieldLabel>
            <RoleRow>
              <SegmentButton
                type="button"
                $active={gender === 'female'}
                onClick={() => {
                  setValue(FieldName.gender, 'female', { shouldValidate: true });
                }}
              >
                {t('signup.step3Patient.genderFemale')}
              </SegmentButton>
              <SegmentButton
                type="button"
                $active={gender === 'male'}
                onClick={() => {
                  setValue(FieldName.gender, 'male', { shouldValidate: true });
                }}
              >
                {t('signup.step3Patient.genderMale')}
              </SegmentButton>
            </RoleRow>
          </div>

          <div>
            <FieldLabel htmlFor={FieldName.cityId}>
              {t('signup.step3Patient.city')}
            </FieldLabel>
            <Controller
              name={FieldName.cityId}
              control={control}
              render={({ field }) => (
                <AuthSelect
                  {...field}
                  id={FieldName.cityId}
                  select
                  error={Boolean(errors.cityId)}
                  onChange={(event) => {
                    field.onChange(event);
                    setValue(FieldName.clinicId, '');
                  }}
                >
                  <MenuItem value="" disabled>
                    {t('signup.selectPlaceholder')}
                  </MenuItem>
                  {(citiesQuery.data?.items ?? []).map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                      {city.name}
                    </MenuItem>
                  ))}
                </AuthSelect>
              )}
            />
          </div>

          <div>
            <FieldLabel htmlFor={FieldName.clinicId}>
              {t('signup.step3Patient.clinic')}
            </FieldLabel>
            <Controller
              name={FieldName.clinicId}
              control={control}
              render={({ field }) => (
                <AuthSelect
                  {...field}
                  id={FieldName.clinicId}
                  select
                  disabled={!cityId}
                  error={Boolean(errors.clinicId)}
                >
                  <MenuItem value="" disabled>
                    {t('signup.selectPlaceholder')}
                  </MenuItem>
                  {(clinicsQuery.data?.items ?? []).map((clinic) => (
                    <MenuItem key={clinic.id} value={clinic.id}>
                      {clinic.name}
                    </MenuItem>
                  ))}
                </AuthSelect>
              )}
            />
          </div>
        </ProfileFields>

        {step3Mutation.isError || completeMutation.isError ? (
          <ErrorText>{mapError(step3Mutation.error ?? completeMutation.error)}</ErrorText>
        ) : null}

        <SubmitSpacer>
          <PrimaryButton
            type="submit"
            variant="contained"
            color="primary"
            disabled={pending}
          >
            {t('signup.step3Patient.submit')}
          </PrimaryButton>
        </SubmitSpacer>
      </FormCard>
    </>
  );
};
