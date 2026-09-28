import { Button } from '@mui/material';
import {
  IconBuildingHospital,
  IconCalendarEvent,
  IconId,
  IconMail,
  IconPhone,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  useGetPatientProfile,
  usePatchPatientProfile,
  type PatientProfileDto,
} from '@/api/patients';
import { useGetReferenceCities, useGetReferenceClinics } from '@/api/reference';
import { ProfileAvatar } from '@/modules/profile/components/ProfileAvatar';
import { ProfileFieldRow } from '@/modules/profile/components/ProfileFieldRow';
import { ProfileSavingOverlay } from '@/modules/profile/components/ProfileSavingOverlay';
import { ProfileSectionHeader } from '@/modules/profile/components/ProfileSectionHeader';
import {
  ActionRow,
  Content,
  FieldGrid,
  FieldRow,
  FieldRows,
  HeroCard,
  HeroLeft,
  HeroName,
  HeroNameRow,
  HeroText,
  Page,
  PageIntro,
  PageSubtitle,
  PageTitle,
  ProfileTextField,
  SectionCard,
  SoftBadge,
} from '@/modules/profile/styles';
import type { PatientProfileData, ProfileSection } from '@/modules/profile/types';
import { formatProfileDate } from '@/modules/profile/utils/formatProfileDate';

const mapPatientDto = (
  dto: PatientProfileDto,
  cityName: string,
  clinicName: string,
): PatientProfileData => ({
  firstName: dto.firstName,
  lastName: dto.lastName,
  phone: dto.phone ?? '',
  email: dto.email,
  dateOfBirth: dto.dob,
  cityId: dto.homeCityId ?? '',
  clinicId: dto.homeClinicId ?? '',
  cityName,
  clinicName,
  photoUrl: dto.photoUrl ?? undefined,
});

export const PatientProfileView = () => {
  const { t, i18n } = useTranslation('profile');
  const profileQuery = useGetPatientProfile();
  const patchMutation = usePatchPatientProfile();
  const citiesQuery = useGetReferenceCities();
  const clinicsQuery = useGetReferenceClinics(profileQuery.data?.homeCityId ?? undefined);

  const [profile, setProfile] = useState<PatientProfileData | null>(null);
  const [editing, setEditing] = useState<ProfileSection | null>(null);
  const [saving, setSaving] = useState(false);

  const cityName =
    citiesQuery.data?.items.find((city) => city.id === profileQuery.data?.homeCityId)?.name ??
    '';
  const clinicName =
    clinicsQuery.data?.items.find((clinic) => clinic.id === profileQuery.data?.homeClinicId)
      ?.name ?? '';

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }
    setProfile(mapPatientDto(profileQuery.data, cityName, clinicName));
  }, [profileQuery.data, cityName, clinicName]);

  if (!profile) {
    return null;
  }

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
  const dobLabel = formatProfileDate(profile.dateOfBirth, i18n.language);

  const cancelEdit = () => {
    if (profileQuery.data) {
      setProfile(mapPatientDto(profileQuery.data, cityName, clinicName));
    }
    setEditing(null);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      await patchMutation.mutateAsync({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || null,
        email: profile.email,
        dob: profile.dateOfBirth,
        ...(profile.cityId ? { homeCityId: profile.cityId } : {}),
        ...(profile.clinicId ? { homeClinicId: profile.clinicId } : {}),
      });
      setEditing(null);
      toast.success(t('saved'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Page>
      <Content>
        <PageIntro>
          <PageTitle>{t('title')}</PageTitle>
          <PageSubtitle>{t('patientSubtitle')}</PageSubtitle>
        </PageIntro>

        <HeroCard>
          <HeroLeft>
            <ProfileAvatar
              photoUrl={profile.photoUrl}
              initials={initials}
              cameraLabel={t('changePhoto')}
              onCameraClick={() => undefined}
            />
            <HeroText>
              <HeroNameRow>
                <HeroName>
                  {profile.firstName} {profile.lastName}
                </HeroName>
                <SoftBadge>{t('rolePatient')}</SoftBadge>
              </HeroNameRow>
            </HeroText>
          </HeroLeft>
        </HeroCard>

        <SectionCard>
          <ProfileSectionHeader
            title={t('sections.basic')}
            editLabel={t('edit')}
            showEdit={editing !== 'basic'}
            onEdit={() => {
              setEditing('basic');
            }}
          />
          {editing === 'basic' ? (
            <>
              <FieldGrid>
                <ProfileTextField
                  label={t('fields.firstName')}
                  value={profile.firstName}
                  onChange={(event) => {
                    setProfile((current) =>
                      current
                        ? {
                            ...current,
                            firstName: event.target.value,
                          }
                        : current,
                    );
                  }}
                />
                <ProfileTextField
                  label={t('fields.lastName')}
                  value={profile.lastName}
                  onChange={(event) => {
                    setProfile((current) =>
                      current
                        ? {
                            ...current,
                            lastName: event.target.value,
                          }
                        : current,
                    );
                  }}
                />
                <ProfileTextField
                  label={t('fields.dob')}
                  value={profile.dateOfBirth}
                  onChange={(event) => {
                    setProfile((current) =>
                      current
                        ? {
                            ...current,
                            dateOfBirth: event.target.value,
                          }
                        : current,
                    );
                  }}
                />
                <ProfileTextField
                  label={t('fields.city')}
                  value={profile.cityName}
                  onChange={(event) => {
                    setProfile((current) =>
                      current
                        ? {
                            ...current,
                            cityName: event.target.value,
                          }
                        : current,
                    );
                  }}
                />
                <ProfileTextField
                  label={t('fields.homeClinic')}
                  value={profile.clinicName}
                  onChange={(event) => {
                    setProfile((current) =>
                      current
                        ? {
                            ...current,
                            clinicName: event.target.value,
                          }
                        : current,
                    );
                  }}
                />
              </FieldGrid>
              <ActionRow>
                <Button onClick={cancelEdit}>{t('cancel')}</Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={saving}
                  onClick={() => {
                    void saveEdit();
                  }}
                >
                  {saving ? t('saving') : t('save')}
                </Button>
              </ActionRow>
            </>
          ) : (
            <FieldRows>
              <FieldRow>
                <ProfileFieldRow
                  icon={<IconUser size={18} stroke={1.75} />}
                  label={t('fields.firstName')}
                  value={profile.firstName}
                />
                <ProfileFieldRow
                  icon={<IconId size={18} stroke={1.75} />}
                  label={t('fields.lastName')}
                  value={profile.lastName}
                />
              </FieldRow>
              <FieldRow>
                <ProfileFieldRow
                  icon={<IconCalendarEvent size={18} stroke={1.75} />}
                  label={t('fields.dob')}
                  value={dobLabel}
                />
                <ProfileFieldRow
                  icon={<IconWorld size={18} stroke={1.75} />}
                  label={t('fields.city')}
                  value={profile.cityName}
                />
              </FieldRow>
              <FieldRow>
                <ProfileFieldRow
                  icon={<IconBuildingHospital size={18} stroke={1.75} />}
                  label={t('fields.homeClinic')}
                  value={profile.clinicName}
                />
              </FieldRow>
            </FieldRows>
          )}
        </SectionCard>

        <SectionCard>
          <ProfileSectionHeader
            title={t('sections.contact')}
            editLabel={t('edit')}
            showEdit={editing !== 'contact'}
            onEdit={() => {
              setEditing('contact');
            }}
          />
          {editing === 'contact' ? (
            <>
              <FieldGrid>
                <ProfileTextField
                  label={t('fields.phone')}
                  value={profile.phone}
                  onChange={(event) => {
                    setProfile((current) =>
                      current ? { ...current, phone: event.target.value } : current,
                    );
                  }}
                />
                <ProfileTextField
                  label={t('fields.email')}
                  value={profile.email}
                  onChange={(event) => {
                    setProfile((current) =>
                      current ? { ...current, email: event.target.value } : current,
                    );
                  }}
                />
              </FieldGrid>
              <ActionRow>
                <Button onClick={cancelEdit}>{t('cancel')}</Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={saving}
                  onClick={() => {
                    void saveEdit();
                  }}
                >
                  {saving ? t('saving') : t('save')}
                </Button>
              </ActionRow>
            </>
          ) : (
            <FieldRows>
              <FieldRow>
                <ProfileFieldRow
                  icon={<IconPhone size={18} stroke={1.75} />}
                  label={t('fields.phone')}
                  value={profile.phone}
                />
                <ProfileFieldRow
                  icon={<IconMail size={18} stroke={1.75} />}
                  label={t('fields.email')}
                  value={profile.email}
                />
              </FieldRow>
            </FieldRows>
          )}
        </SectionCard>
      </Content>
      <ProfileSavingOverlay open={saving} />
    </Page>
  );
};
