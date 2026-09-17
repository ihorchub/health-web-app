import { Button } from '@mui/material';
import { IconEye } from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { useGetReferenceCities, useGetReferenceClinics } from '@/api/reference';
import { DoctorPreviewDialog } from '@/modules/profile/components/DoctorPreviewDialog';
import { MOCK_DOCTOR_PROFILE } from '@/modules/profile/fixtures';
import {
  ActionRow,
  ActiveBadge,
  AddLink,
  Avatar,
  AvatarWrap,
  BioBlock,
  Content,
  EditLink,
  EduRow,
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
  SectionCard,
  SectionHead,
  SectionTitle,
  ViewProfileButton,
} from '@/modules/profile/styles';
import type { DoctorProfileData, ProfileSection } from '@/modules/profile/types';
import { pickLocalizedDescription } from '@/utils/pickLocalizedDescription';

export const DoctorProfileView = () => {
  const { t, i18n } = useTranslation(['profile', 'search']);
  const [profile, setProfile] = useState<DoctorProfileData>(MOCK_DOCTOR_PROFILE);
  const [editing, setEditing] = useState<ProfileSection | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const citiesQuery = useGetReferenceCities();
  const clinicsQuery = useGetReferenceClinics(profile.cityId);
  const cityName =
    citiesQuery.data?.items.find((city) => city.id === profile.cityId)?.name ?? profile.cityId;
  const clinicName =
    clinicsQuery.data?.items.find((clinic) => clinic.id === profile.clinicId)?.name ??
    profile.clinicId;

  const startEdit = (section: ProfileSection) => {
    setEditing(section);
  };

  const cancelEdit = () => {
    setEditing(null);
  };

  const saveEdit = async () => {
    setSaving(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
    setSaving(false);
    setEditing(null);
    toast.success(t('profile:saved'));
  };

  const shortBio = pickLocalizedDescription(
    profile.shortBioUk,
    profile.shortBioEn,
    i18n.language,
  );
  const fullBio = pickLocalizedDescription(profile.fullBioUk, profile.fullBioEn, i18n.language);

  return (
    <Page>
      <Content>
        <PageIntro>
          <PageTitle>{t('profile:title')}</PageTitle>
          <PageSubtitle>{t('profile:doctorSubtitle')}</PageSubtitle>
        </PageIntro>

        <HeroCard>
          <HeroLeft>
            <AvatarWrap>
              <Avatar src={profile.photoUrl} alt="" />
            </AvatarWrap>
            <HeroText>
              <HeroNameRow>
                <HeroName>
                  {profile.firstName} {profile.lastName}
                </HeroName>
                <ActiveBadge>{t('profile:activeBadge')}</ActiveBadge>
              </HeroNameRow>
              <HeroMeta>{t(`search:specialties.${profile.specialty}`)}</HeroMeta>
              <HeroMeta>{profile.yearsPractice}+ {t('profile:fields.experience').toLowerCase()}</HeroMeta>
              <HeroMeta>
                {t('profile:fields.rating', {
                  rating: profile.ratingAverage.toFixed(1),
                  count: profile.reviewCount,
                })}{' '}
                ·{' '}
                {t('profile:fields.consultations', { count: profile.consultationCount })}
              </HeroMeta>
            </HeroText>
          </HeroLeft>
          <ViewProfileButton
            variant="outlined"
            color="inherit"
            startIcon={<IconEye size={18} />}
            onClick={() => {
              setPreviewOpen(true);
            }}
          >
            {t('profile:viewPublicProfile')}
          </ViewProfileButton>
        </HeroCard>

        <SectionCard>
          <SectionHead>
            <SectionTitle>{t('profile:sections.basic')}</SectionTitle>
            {editing !== 'basic' ? (
              <EditLink type="button" onClick={() => startEdit('basic')}>
                {t('profile:edit')}
              </EditLink>
            ) : null}
          </SectionHead>
          {editing === 'basic' ? (
            <>
              <FieldGrid>
                <ProfileTextField
                  label={t('profile:fields.firstName')}
                  value={profile.firstName}
                  onChange={(event) => {
                    setProfile((current) => ({ ...current, firstName: event.target.value }));
                  }}
                />
                <ProfileTextField
                  label={t('profile:fields.lastName')}
                  value={profile.lastName}
                  onChange={(event) => {
                    setProfile((current) => ({ ...current, lastName: event.target.value }));
                  }}
                />
                <FieldBlock>
                  <FieldLabel>{t('profile:fields.dob')}</FieldLabel>
                  <FieldValue>{profile.dateOfBirth}</FieldValue>
                </FieldBlock>
                <FieldBlock>
                  <FieldLabel>{t('profile:fields.specialty')}</FieldLabel>
                  <FieldValue>{t(`search:specialties.${profile.specialty}`)}</FieldValue>
                </FieldBlock>
                <FieldBlock>
                  <FieldLabel>{t('profile:fields.city')}</FieldLabel>
                  <FieldValue>{cityName}</FieldValue>
                </FieldBlock>
                <FieldBlock>
                  <FieldLabel>{t('profile:fields.clinic')}</FieldLabel>
                  <FieldValue>{clinicName}</FieldValue>
                </FieldBlock>
                <FieldBlock>
                  <FieldLabel>{t('profile:fields.license')}</FieldLabel>
                  <FieldValue>
                    {t('profile:fields.licenseOnFile', { file: profile.licenseFileName })}
                  </FieldValue>
                </FieldBlock>
              </FieldGrid>
              <ActionRow>
                <Button onClick={cancelEdit}>{t('profile:cancel')}</Button>
                <Button variant="contained" color="primary" disabled={saving} onClick={saveEdit}>
                  {saving ? t('profile:saving') : t('profile:save')}
                </Button>
              </ActionRow>
            </>
          ) : (
            <FieldGrid>
              <FieldBlock>
                <FieldLabel>{t('profile:fields.fullName')}</FieldLabel>
                <FieldValue>
                  {profile.firstName} {profile.lastName}
                </FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('profile:fields.specialty')}</FieldLabel>
                <FieldValue>{t(`search:specialties.${profile.specialty}`)}</FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('profile:fields.experience')}</FieldLabel>
                <FieldValue>{profile.yearsPractice}+</FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('profile:fields.languages')}</FieldLabel>
                <FieldValue>{profile.languages}</FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('profile:fields.city')}</FieldLabel>
                <FieldValue>{cityName}</FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('profile:fields.clinic')}</FieldLabel>
                <FieldValue>{clinicName}</FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('profile:fields.license')}</FieldLabel>
                <FieldValue>
                  {t('profile:fields.licenseOnFile', { file: profile.licenseFileName })}
                </FieldValue>
              </FieldBlock>
            </FieldGrid>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead>
            <SectionTitle>{t('profile:sections.about')}</SectionTitle>
            {editing !== 'about' ? (
              <EditLink type="button" onClick={() => startEdit('about')}>
                {t('profile:edit')}
              </EditLink>
            ) : null}
          </SectionHead>
          {editing === 'about' ? (
            <>
              <ProfileTextField
                label={t('profile:fields.shortBio')}
                multiline
                minRows={2}
                value={profile.shortBioUk}
                onChange={(event) => {
                  setProfile((current) => ({ ...current, shortBioUk: event.target.value }));
                }}
              />
              <ProfileTextField
                label={t('profile:fields.fullBio')}
                multiline
                minRows={4}
                value={profile.fullBioUk}
                onChange={(event) => {
                  setProfile((current) => ({ ...current, fullBioUk: event.target.value }));
                }}
              />
              <ActionRow>
                <Button onClick={cancelEdit}>{t('profile:cancel')}</Button>
                <Button variant="contained" color="primary" onClick={saveEdit}>
                  {t('profile:save')}
                </Button>
              </ActionRow>
            </>
          ) : (
            <>
              <BioBlock>
                <FieldLabel>{t('profile:fields.shortBio')}</FieldLabel>
                <FieldValue>{shortBio}</FieldValue>
              </BioBlock>
              <BioBlock>
                <FieldLabel>{t('profile:fields.fullBio')}</FieldLabel>
                <FieldValue>{fullBio}</FieldValue>
              </BioBlock>
            </>
          )}
        </SectionCard>

        <SectionCard>
          <SectionHead>
            <SectionTitle>{t('profile:sections.education')}</SectionTitle>
            <EditLink type="button" onClick={() => startEdit('education')}>
              {t('profile:edit')}
            </EditLink>
          </SectionHead>
          {profile.education.map((item) => (
            <EduRow key={item.id}>
              <FieldValue>{item.title}</FieldValue>
              <HeroMeta>
                {item.subtitle} · {item.years}
              </HeroMeta>
            </EduRow>
          ))}
          <AddLink type="button">{t('profile:education.add')}</AddLink>
        </SectionCard>

        <SectionCard>
          <SectionHead>
            <SectionTitle>{t('profile:sections.contact')}</SectionTitle>
            {editing !== 'contact' ? (
              <EditLink type="button" onClick={() => startEdit('contact')}>
                {t('profile:edit')}
              </EditLink>
            ) : null}
          </SectionHead>
          {editing === 'contact' ? (
            <>
              <FieldGrid>
                <ProfileTextField
                  label={t('profile:fields.phone')}
                  value={profile.phone}
                  onChange={(event) => {
                    setProfile((current) => ({ ...current, phone: event.target.value }));
                  }}
                />
                <ProfileTextField
                  label={t('profile:fields.email')}
                  value={profile.email}
                  onChange={(event) => {
                    setProfile((current) => ({ ...current, email: event.target.value }));
                  }}
                />
              </FieldGrid>
              <ActionRow>
                <Button onClick={cancelEdit}>{t('profile:cancel')}</Button>
                <Button variant="contained" color="primary" onClick={saveEdit}>
                  {t('profile:save')}
                </Button>
              </ActionRow>
            </>
          ) : (
            <FieldGrid>
              <FieldBlock>
                <FieldLabel>{t('profile:fields.phone')}</FieldLabel>
                <FieldValue>{profile.phone}</FieldValue>
              </FieldBlock>
              <FieldBlock>
                <FieldLabel>{t('profile:fields.email')}</FieldLabel>
                <FieldValue>{profile.email}</FieldValue>
              </FieldBlock>
            </FieldGrid>
          )}
        </SectionCard>
      </Content>

      <DoctorPreviewDialog
        open={previewOpen}
        profile={profile}
        cityName={cityName}
        clinicName={clinicName}
        onClose={() => {
          setPreviewOpen(false);
        }}
      />
    </Page>
  );
};
