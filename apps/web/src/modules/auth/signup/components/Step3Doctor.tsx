import { MenuItem } from '@mui/material';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  usePostAuthRegisterComplete,
  usePostAuthRegisterStep3Doctor,
  type SpecialtyId,
  type VisitDurationMinutes,
} from '@/api/auth';
import {
  useGetReferenceCities,
  useGetReferenceClinics,
  useGetReferenceSpecialties,
} from '@/api/reference';
import { Body, TitleH2 } from '@/components/Text';
import {
  AuthSelect,
  AuthTextField,
  ErrorText,
  FieldLabel,
  FormCard,
  HiddenFileInput,
  PrimaryButton,
  ProfileFields,
  ProfileRow,
  StepHeading,
  SubmitSpacer,
  UploadBox,
  UploadHint,
  UploadTitle,
} from '@/modules/auth/components/authStyles';
import { useAuthApiErrorMessage } from '@/modules/auth/hooks/useAuthApiErrorMessage';
import { FieldName } from '@/modules/auth/signup/form/doctorProfileFields';
import {
  doctorProfileValidationSchema,
  type DoctorProfileFormValues,
} from '@/modules/auth/signup/form/doctorProfileValidation';
import type { SignupDraft } from '@/modules/auth/signup/utils/signupDraft';

const DURATIONS: VisitDurationMinutes[] = [20, 30, 45];

interface Step3DoctorProps {
  draft: SignupDraft;
  onSuccess: (draft: SignupDraft) => void;
}

export const Step3Doctor = ({ draft, onSuccess }: Step3DoctorProps) => {
  const { t } = useTranslation('auth');
  const citiesQuery = useGetReferenceCities();
  const specialtiesQuery = useGetReferenceSpecialties();
  const step3Mutation = usePostAuthRegisterStep3Doctor();
  const completeMutation = usePostAuthRegisterComplete();
  const mapError = useAuthApiErrorMessage();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DoctorProfileFormValues>({
    resolver: doctorProfileValidationSchema,
    defaultValues: {
      [FieldName.dob]: '',
      [FieldName.cityId]: '',
      [FieldName.clinicId]: '',
      [FieldName.specialty]: 'family_doctor',
      [FieldName.yearsPractice]: 1,
      [FieldName.visitDurationMinutes]: 30,
      [FieldName.licenseFile]: null,
    },
  });

  const cityId = useWatch({ control, name: FieldName.cityId });
  const licenseFile = useWatch({ control, name: FieldName.licenseFile });
  const clinicsQuery = useGetReferenceClinics(cityId || undefined);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await step3Mutation.mutateAsync({
        registrationId: draft.registrationId,
        dob: values.dob,
        cityId: values.cityId,
        clinicId: values.clinicId,
        specialty: values.specialty as SpecialtyId,
        yearsPractice: Number(values.yearsPractice),
        visitDurationMinutes: values.visitDurationMinutes as VisitDurationMinutes,
        licenseFile: values.licenseFile ?? null,
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
        <TitleH2>{t('signup.step3Doctor.title')}</TitleH2>
        <Body color="textSecondary">{t('signup.step3Doctor.subtitle')}</Body>
      </StepHeading>

      <FormCard onSubmit={onSubmit} noValidate>
        <ProfileFields>
          <div>
            <FieldLabel htmlFor={FieldName.dob}>{t('signup.step3Doctor.dob')}</FieldLabel>
            <Controller
              name={FieldName.dob}
              control={control}
              render={({ field }) => (
                <AuthTextField
                  {...field}
                  id={FieldName.dob}
                  type="date"
                  error={Boolean(errors.dob)}
                />
              )}
            />
          </div>

          <div>
            <FieldLabel htmlFor={FieldName.cityId}>
              {t('signup.step3Doctor.city')}
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
              {t('signup.step3Doctor.clinic')}
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

          <div>
            <FieldLabel htmlFor={FieldName.specialty}>
              {t('signup.step3Doctor.specialty')}
            </FieldLabel>
            <Controller
              name={FieldName.specialty}
              control={control}
              render={({ field }) => (
                <AuthSelect
                  {...field}
                  id={FieldName.specialty}
                  select
                  error={Boolean(errors.specialty)}
                >
                  {(specialtiesQuery.data?.items ?? []).map((specialty) => (
                    <MenuItem key={specialty.id} value={specialty.id}>
                      {t(`signup.specialties.${specialty.id}`, {
                        defaultValue: specialty.name,
                      })}
                    </MenuItem>
                  ))}
                </AuthSelect>
              )}
            />
          </div>

          <ProfileRow>
            <div>
              <FieldLabel htmlFor={FieldName.yearsPractice}>
                {t('signup.step3Doctor.yearsPractice')}
              </FieldLabel>
              <Controller
                name={FieldName.yearsPractice}
                control={control}
                render={({ field }) => (
                  <AuthTextField
                    {...field}
                    id={FieldName.yearsPractice}
                    type="number"
                    error={Boolean(errors.yearsPractice)}
                    onChange={(event) => {
                      field.onChange(Number(event.target.value));
                    }}
                  />
                )}
              />
            </div>
            <div>
              <FieldLabel htmlFor={FieldName.visitDurationMinutes}>
                {t('signup.step3Doctor.visitDuration')}
              </FieldLabel>
              <Controller
                name={FieldName.visitDurationMinutes}
                control={control}
                render={({ field }) => (
                  <AuthSelect
                    {...field}
                    id={FieldName.visitDurationMinutes}
                    select
                    error={Boolean(errors.visitDurationMinutes)}
                    onChange={(event) => {
                      field.onChange(Number(event.target.value));
                    }}
                  >
                    {DURATIONS.map((minutes) => (
                      <MenuItem key={minutes} value={minutes}>
                        {minutes}
                      </MenuItem>
                    ))}
                  </AuthSelect>
                )}
              />
            </div>
          </ProfileRow>

          <div>
            <FieldLabel as="div">{t('signup.step3Doctor.license')}</FieldLabel>
            <UploadBox>
              <UploadTitle>
                {licenseFile instanceof File
                  ? licenseFile.name
                  : t('signup.step3Doctor.licenseUpload')}
              </UploadTitle>
              <UploadHint>{t('signup.step3Doctor.licenseHint')}</UploadHint>
              <HiddenFileInput
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setValue(FieldName.licenseFile, file, { shouldValidate: true });
                }}
              />
            </UploadBox>
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
            {t('signup.step3Doctor.submit')}
          </PrimaryButton>
        </SubmitSpacer>
      </FormCard>
    </>
  );
};
