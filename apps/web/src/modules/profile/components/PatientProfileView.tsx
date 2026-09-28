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
import { useMemo, useState } from 'react';
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
import { useProfilePhotoInput } from '@/modules/profile/hooks/useProfilePhotoInput';
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

  const [draft, setDraft] = useState<PatientProfileData | null>(null);
  const [editing, setEditing] = useState<ProfileSection | null>(null);
  const [saving, setSaving] = useState(false);

  const cityName =
    citiesQuery.data?.items.find((city) => city.id === profileQuery.data?.homeCityId)
      ?.name ?? '';
  const clinicName =
    clinicsQuery.data?.items.find(
      (clinic) => clinic.id === profileQuery.data?.homeClinicId,
    )?.name ?? '';

  const serverProfile = useMemo(() => {
    if (!profileQuery.data) {
      return null;
    }
    return mapPatientDto(profileQuery.data, cityName, clinicName);
  }, [profileQuery.data, cityName, clinicName]);

  const profile = draft ?? serverProfile;

  const applyPhotoUrl = (photoUrl: string | undefined) => {
    setDraft((current) => (current ? { ...current, photoUrl } : current));
  };

  const { openPicker, fileInput, cropDialog } = useProfilePhotoInput(async (file) => {
    setSaving(true);
    try {
      const updated = await patchMutation.mutateAsync({ photo: file });
      applyPhotoUrl(updated.photoUrl ?? undefined);
      toast.success(t('photoSaved'));
    } finally {
      setSaving(false);
    }
  });

  if (!profile) {
    return null;
  }

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
  const dobLabel = formatProfileDate(profile.dateOfBirth, i18n.language);

  const beginEdit = (section: ProfileSection) => {
    setDraft((current) => current ?? serverProfile);
    setEditing(section);
  };

  const cancelEdit = () => {
    setDraft(null);
    setEditing(null);
  };

  const updateDraft = (patch: Partial<PatientProfileData>) => {
    setDraft((current) => {
      const base = current ?? serverProfile;
      return base ? { ...base, ...patch } : current;
    });
  };

  const removePhoto = async () => {
    setSaving(true);
    try {
      await patchMutation.mutateAsync({ photoUrl: null });
      applyPhotoUrl(undefined);
      toast.success(t('photoRemoved'));
    } finally {
      setSaving(false);
    }
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
      setDraft(null);
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
            {fileInput}
            {cropDialog}
            <ProfileAvatar
              photoUrl={profile.photoUrl}
              initials={initials}
              cameraLabel={t('changePhoto')}
              onCameraClick={openPicker}
              removeLabel={t('removePhoto')}
              onRemoveClick={profile.photoUrl ? () => void removePhoto() : undefined}
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
              beginEdit('basic');
            }}
          />
          {editing === 'basic' ? (
            <>
              <FieldGrid>
                <ProfileTextField
                  label={t('fields.firstName')}
                  value={profile.firstName}
                  onChange={(event) => {
                    updateDraft({ firstName: event.target.value });
                  }}
                />
                <ProfileTextField
                  label={t('fields.lastName')}
                  value={profile.lastName}
                  onChange={(event) => {
                    updateDraft({ lastName: event.target.value });
                  }}
                />
                <ProfileTextField
                  label={t('fields.dob')}
                  value={profile.dateOfBirth}
                  onChange={(event) => {
                    updateDraft({ dateOfBirth: event.target.value });
                  }}
                />
                <ProfileTextField
                  label={t('fields.city')}
                  value={profile.cityName}
                  onChange={(event) => {
                    updateDraft({ cityName: event.target.value });
                  }}
                />
                <ProfileTextField
                  label={t('fields.homeClinic')}
                  value={profile.clinicName}
                  onChange={(event) => {
                    updateDraft({ clinicName: event.target.value });
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
              beginEdit('contact');
            }}
          />
          {editing === 'contact' ? (
            <>
              <FieldGrid>
                <ProfileTextField
                  label={t('fields.phone')}
                  value={profile.phone}
                  onChange={(event) => {
                    updateDraft({ phone: event.target.value });
                  }}
                />
                <ProfileTextField
                  label={t('fields.email')}
                  value={profile.email}
                  onChange={(event) => {
                    updateDraft({ email: event.target.value });
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
