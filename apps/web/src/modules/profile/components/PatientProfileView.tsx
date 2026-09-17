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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { ProfileAvatar } from '@/modules/profile/components/ProfileAvatar';
import { ProfileFieldRow } from '@/modules/profile/components/ProfileFieldRow';
import { ProfileSavingOverlay } from '@/modules/profile/components/ProfileSavingOverlay';
import { ProfileSectionHeader } from '@/modules/profile/components/ProfileSectionHeader';
import { MOCK_PATIENT_PROFILE } from '@/modules/profile/fixtures';
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

export const PatientProfileView = () => {
  const { t, i18n } = useTranslation('profile');
  const [profile, setProfile] = useState<PatientProfileData>(MOCK_PATIENT_PROFILE);
  const [editing, setEditing] = useState<ProfileSection | null>(null);
  const [saving, setSaving] = useState(false);

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
  const dobLabel = formatProfileDate(profile.dateOfBirth, i18n.language);

  const saveEdit = async () => {
    setSaving(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
    setSaving(false);
    setEditing(null);
    toast.success(t('saved'));
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
                    setProfile((current) => ({
                      ...current,
                      firstName: event.target.value,
                    }));
                  }}
                />
                <ProfileTextField
                  label={t('fields.lastName')}
                  value={profile.lastName}
                  onChange={(event) => {
                    setProfile((current) => ({
                      ...current,
                      lastName: event.target.value,
                    }));
                  }}
                />
                <ProfileTextField
                  label={t('fields.dob')}
                  value={profile.dateOfBirth}
                  onChange={(event) => {
                    setProfile((current) => ({
                      ...current,
                      dateOfBirth: event.target.value,
                    }));
                  }}
                />
                <ProfileTextField
                  label={t('fields.city')}
                  value={profile.cityName}
                  onChange={(event) => {
                    setProfile((current) => ({
                      ...current,
                      cityName: event.target.value,
                    }));
                  }}
                />
                <ProfileTextField
                  label={t('fields.homeClinic')}
                  value={profile.clinicName}
                  onChange={(event) => {
                    setProfile((current) => ({
                      ...current,
                      clinicName: event.target.value,
                    }));
                  }}
                />
              </FieldGrid>
              <ActionRow>
                <Button
                  onClick={() => {
                    setEditing(null);
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={saving}
                  onClick={saveEdit}
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
                    setProfile((current) => ({ ...current, phone: event.target.value }));
                  }}
                />
                <ProfileTextField
                  label={t('fields.email')}
                  value={profile.email}
                  onChange={(event) => {
                    setProfile((current) => ({ ...current, email: event.target.value }));
                  }}
                />
              </FieldGrid>
              <ActionRow>
                <Button
                  onClick={() => {
                    setEditing(null);
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  disabled={saving}
                  onClick={saveEdit}
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
