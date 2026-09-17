import { Button } from '@mui/material';
import {
  IconBuildingHospital,
  IconCalendarEvent,
  IconCertificate,
  IconEye,
  IconFileText,
  IconId,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPlus,
  IconSchool,
  IconStarFilled,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import { DoctorPreviewDialog } from '@/modules/profile/components/DoctorPreviewDialog';
import { ProfileAvatar } from '@/modules/profile/components/ProfileAvatar';
import { ProfileFieldRow } from '@/modules/profile/components/ProfileFieldRow';
import { ProfileSavingOverlay } from '@/modules/profile/components/ProfileSavingOverlay';
import { ProfileSectionHeader } from '@/modules/profile/components/ProfileSectionHeader';
import { MOCK_DOCTOR_PROFILE } from '@/modules/profile/fixtures';
import {
  ActionRow,
  AddLink,
  BioValue,
  Content,
  EducationCard,
  EduList,
  EduRow,
  EduText,
  EduYears,
  FieldGrid,
  FieldIcon,
  FieldItem,
  FieldLabel,
  FieldRow,
  FieldRows,
  BioFieldText,
  FieldValue,
  HeroCard,
  HeroDot,
  HeroLeft,
  HeroMeta,
  HeroMuted,
  HeroName,
  HeroNameRow,
  HeroStat,
  HeroStats,
  HeroStatMuted,
  HeroStatValue,
  HeroText,
  Page,
  PageIntro,
  PageSubtitle,
  PageTitle,
  ProfileTextField,
  SectionCard,
  SoftBadge,
  StarAccent,
  ViewProfileButton,
} from '@/modules/profile/styles';
import type { DoctorProfileData, ProfileSection } from '@/modules/profile/types';
import { pickLocalizedDescription } from '@/utils/pickLocalizedDescription';

export const DoctorProfileView = () => {
  const { t, i18n } = useTranslation('profile');
  const [profile, setProfile] = useState<DoctorProfileData>(MOCK_DOCTOR_PROFILE);
  const [editing, setEditing] = useState<ProfileSection | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`;
  const shortBio = pickLocalizedDescription(
    profile.shortBioUk,
    profile.shortBioEn,
    i18n.language,
  );
  const fullBio = pickLocalizedDescription(
    profile.fullBioUk,
    profile.fullBioEn,
    i18n.language,
  );

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
    toast.success(t('saved'));
  };

  return (
    <Page>
      <Content>
        <PageIntro>
          <PageTitle>{t('title')}</PageTitle>
          <PageSubtitle>{t('doctorSubtitle')}</PageSubtitle>
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
                <SoftBadge>{t('activeBadge')}</SoftBadge>
              </HeroNameRow>
              <HeroMeta>{profile.specialtyLabel}</HeroMeta>
              <HeroMuted>
                {t('fields.experienceHero', { years: profile.yearsPractice })}
              </HeroMuted>
              <HeroStats>
                <HeroStat>
                  <StarAccent>
                    <IconStarFilled size={16} aria-hidden />
                  </StarAccent>
                  <HeroStatValue>
                    {t('fields.rating', {
                      rating: profile.ratingAverage.toFixed(1),
                      count: profile.reviewCount,
                    })}
                  </HeroStatValue>
                </HeroStat>
                <HeroDot />
                <HeroStatMuted>
                  {t('fields.consultations', { count: profile.consultationCount })}
                </HeroStatMuted>
              </HeroStats>
            </HeroText>
          </HeroLeft>
          <ViewProfileButton
            variant="outlined"
            startIcon={<IconEye size={18} stroke={1.75} />}
            onClick={() => {
              setPreviewOpen(true);
            }}
          >
            {t('viewPublicProfile')}
          </ViewProfileButton>
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
                  label={t('fields.languages')}
                  value={profile.languages}
                  onChange={(event) => {
                    setProfile((current) => ({
                      ...current,
                      languages: event.target.value,
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
                  label={t('fields.clinic')}
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
                <Button onClick={cancelEdit}>{t('cancel')}</Button>
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
                  label={t('fields.fullName')}
                  value={`${profile.firstName} ${profile.lastName}`}
                />
                <ProfileFieldRow
                  icon={<IconId size={18} stroke={1.75} />}
                  label={t('fields.specialty')}
                  value={profile.specialtyLabel}
                />
              </FieldRow>
              <FieldRow>
                <ProfileFieldRow
                  icon={<IconCalendarEvent size={18} stroke={1.75} />}
                  label={t('fields.experience')}
                  value={t('fields.experienceYears', { years: profile.yearsPractice })}
                />
                <ProfileFieldRow
                  icon={<IconWorld size={18} stroke={1.75} />}
                  label={t('fields.languages')}
                  value={profile.languages}
                />
              </FieldRow>
              <FieldRow>
                <ProfileFieldRow
                  icon={<IconMapPin size={18} stroke={1.75} />}
                  label={t('fields.city')}
                  value={profile.cityName}
                />
                <ProfileFieldRow
                  icon={<IconBuildingHospital size={18} stroke={1.75} />}
                  label={t('fields.clinic')}
                  value={profile.clinicName}
                />
              </FieldRow>
              <FieldRow>
                <ProfileFieldRow
                  icon={<IconFileText size={18} stroke={1.75} />}
                  label={t('fields.license')}
                  value={t('fields.licenseOnFile', { file: profile.licenseFileName })}
                />
              </FieldRow>
            </FieldRows>
          )}
        </SectionCard>

        <SectionCard>
          <ProfileSectionHeader
            title={t('sections.about')}
            editLabel={t('edit')}
            showEdit={editing !== 'about'}
            onEdit={() => {
              setEditing('about');
            }}
          />
          {editing === 'about' ? (
            <>
              <ProfileTextField
                label={t('fields.shortBio')}
                multiline
                minRows={2}
                value={profile.shortBioUk}
                onChange={(event) => {
                  setProfile((current) => ({
                    ...current,
                    shortBioUk: event.target.value,
                  }));
                }}
              />
              <ProfileTextField
                label={t('fields.fullBio')}
                multiline
                minRows={4}
                value={profile.fullBioUk}
                onChange={(event) => {
                  setProfile((current) => ({
                    ...current,
                    fullBioUk: event.target.value,
                  }));
                }}
              />
              <ActionRow>
                <Button onClick={cancelEdit}>{t('cancel')}</Button>
                <Button variant="contained" color="primary" onClick={saveEdit}>
                  {t('save')}
                </Button>
              </ActionRow>
            </>
          ) : (
            <FieldRows>
              <FieldItem>
                <FieldIcon aria-hidden>
                  <IconUser size={18} stroke={1.75} />
                </FieldIcon>
                <BioFieldText>
                  <FieldLabel>{t('fields.shortBio')}</FieldLabel>
                  <BioValue>{shortBio}</BioValue>
                </BioFieldText>
              </FieldItem>
              <FieldItem>
                <FieldIcon aria-hidden>
                  <IconFileText size={18} stroke={1.75} />
                </FieldIcon>
                <BioFieldText>
                  <FieldLabel>{t('fields.fullBio')}</FieldLabel>
                  <BioValue>{fullBio}</BioValue>
                </BioFieldText>
              </FieldItem>
            </FieldRows>
          )}
        </SectionCard>

        <EducationCard>
          <ProfileSectionHeader
            title={t('sections.education')}
            editLabel={t('edit')}
            onEdit={() => {
              setEditing('education');
            }}
          />
          <EduList>
            {profile.education.map((item) => (
              <EduRow key={item.id}>
                <FieldIcon aria-hidden>
                  {item.kind === 'education' ? (
                    <IconSchool size={18} stroke={1.75} />
                  ) : (
                    <IconCertificate size={18} stroke={1.75} />
                  )}
                </FieldIcon>
                <EduText>
                  <FieldValue>{item.title}</FieldValue>
                  <FieldLabel>{item.subtitle}</FieldLabel>
                </EduText>
                <EduYears>{item.years}</EduYears>
              </EduRow>
            ))}
          </EduList>
          <AddLink type="button">
            <IconPlus size={16} stroke={1.75} aria-hidden />
            {t('education.add')}
          </AddLink>
        </EducationCard>

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
                <Button onClick={cancelEdit}>{t('cancel')}</Button>
                <Button variant="contained" color="primary" onClick={saveEdit}>
                  {t('save')}
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

      <DoctorPreviewDialog
        open={previewOpen}
        profile={profile}
        onClose={() => {
          setPreviewOpen(false);
        }}
      />
      <ProfileSavingOverlay open={saving} />
    </Page>
  );
};
