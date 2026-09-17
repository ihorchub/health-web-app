import { Button } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useGetReferenceCities, useGetReferenceClinics } from '@/api/reference';
import { MOCK_PATIENT_PROFILE } from '@/modules/profile/fixtures';
import {
  ActionRow,
  Avatar,
  AvatarWrap,
  Content,
  EditLink,
  FieldBlock,
  FieldGrid,
  FieldLabel,
  FieldValue,
  HeroCard,
  HeroLeft,
  HeroMeta,
  HeroName,
  HeroNameRow,
  HeroText,
  Page,
  PageIntro,
  PageSubtitle,
  PageTitle,
  ProfileTextField,
  RoleBadge,
  SectionCard,
  SectionHead,
  SectionTitle,
} from '@/modules/profile/styles';
import type { PatientProfileData, ProfileSection } from '@/modules/profile/types';

export const PatientProfileView = () => {
  const { t } = useTranslation('profile');
  const [profile, setProfile] = useState<PatientProfileData>(MOCK_PATIENT_PROFILE);
  const [editing, setEditing] = useState<ProfileSection | null>(null);
  const [saving, setSaving] = useState(false);

  const citiesQuery = useGetReferenceCities();
  const clinicsQuery = useGetReferenceClinics(profile.cityId);
  const cityName =
    citiesQuery.data?.items.find((city) => city.id === profile.cityId)?.name ?? profile.cityId;
  const clinicName =
    clinicsQuery.data?.items.find((clinic) => clinic.id === profile.clinicId)?.name ??
    profile.clinicId;

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
            {profile.photoUrl ? (
              <AvatarWrap>
                <Avatar src={profile.photoUrl} alt="" />
              </AvatarWrap>
            ) : null}
            <HeroText>
              <HeroNameRow>
                <HeroName>
                  {profile.firstName} {profile.lastName}
                </HeroName>
                <RoleBadge>{t('rolePatient')}</RoleBadge>
              </HeroNameRow>
              <HeroMeta>{profile.email}</HeroMeta>
            </HeroText>
          </HeroLeft>
        </HeroCard>

        <SectionCard>
          <SectionHead>
            <SectionTitle>{t('sections.basic')}</SectionTitle>
            {editing !== 'basic' ? (
              <EditLink type="button" onClick={() => setEditing('basic')}>
                {t('edit')}
              </EditLink>
            ) : null}
          </SectionHead>
          {editing === 'basic' ? (
            <>
              <FieldGrid>
                <ProfileTextField
                  label={t('fields.firstName')}
                  value={profile.firstName}
                  onChange={(event) => {
                    setProfile((current) => ({ ...current, firstName: event.target.value }));
                  }}
                />
                <ProfileTextField
                  label={t('fields.lastName')}
                  value={profile.lastName}
                  onChange={(event) => {
                    setProfile((current) => ({ ...current, lastName: event.target.value }));
                  }}
                />
                <ProfileTextField
                  label={t('fields.dob')}
                  value={profile.dateOfBirth}
                  onChange={(event) => {
                    setProfile((current) => ({ ...current, dateOfBirth: event.target.value }));
                  }}
                />
                <FieldBlock>
                  <FieldLabel>{t('fields.city')}</FieldLabel>
                  <FieldValue>{cityName}</FieldValue>
                </FieldBlock>
                <FieldBlock>
                  <FieldLabel>{t('fields.clinic')}</FieldLabel>
                  <FieldValue>{clinicName}</FieldValue>
                </FieldBlock>
              </FieldGrid>
              <ActionRow>
                <Button
                  onClick={() => {
                    setEditing(null);
                  }}
                >
                  {t('cancel')}
                </Button>
                <Button variant="contained" color="primary" disabled={saving} onClick={saveEdit}>
                  {saving ? t('saving') : t('save')}
                </Button>
              </ActionRow>
            </>
          ) : (
            <FieldGrid>
              <FieldBlock>
                <FieldLabel>{t('fields.fullName')}</FieldLabel>
                <FieldValue>
                  {profile.firstName} {profile.lastName}
                </FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('fields.dob')}</FieldLabel>
                <FieldValue>{profile.dateOfBirth}</FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('fields.city')}</FieldLabel>
                <FieldValue>{cityName}</FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('fields.clinic')}</FieldLabel>
                <FieldValue>{clinicName}</FieldValue>
              </FieldBlock>
            </FieldGrid>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead>
            <SectionTitle>{t('sections.contact')}</SectionTitle>
            {editing !== 'contact' ? (
              <EditLink type="button" onClick={() => setEditing('contact')}>
                {t('edit')}
              </EditLink>
            ) : null}
          </SectionHead>
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
                <Button variant="contained" color="primary" onClick={saveEdit}>
                  {t('save')}
                </Button>
              </ActionRow>
            </>
          ) : (
            <FieldGrid>
              <FieldBlock>
                <FieldLabel>{t('fields.phone')}</FieldLabel>
                <FieldValue>{profile.phone}</FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('fields.email')}</FieldLabel>
                <FieldValue>{profile.email}</FieldValue>
              </FieldBlock>
            </FieldGrid>
          )}
        </SectionCard>
      </Content>
    </Page>
  );
};
