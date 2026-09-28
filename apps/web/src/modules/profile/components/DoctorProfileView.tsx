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
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

import {
  useGetDoctorMeProfile,
  useGetDoctorSchedule,
  usePatchDoctorMeProfile,
  type DoctorMeProfileDto,
  type DoctorScheduleResponse,
} from '@/api/doctors';
import type { DoctorEducationDto } from '@/api/doctors/me-profile';
import { useGetReferenceCities, useGetReferenceClinics } from '@/api/reference';
import { DoctorPreviewDialog } from '@/modules/profile/components/DoctorPreviewDialog';
import { ProfileAvatar } from '@/modules/profile/components/ProfileAvatar';
import { ProfileFieldRow } from '@/modules/profile/components/ProfileFieldRow';
import { ProfileSavingOverlay } from '@/modules/profile/components/ProfileSavingOverlay';
import { ProfileSectionHeader } from '@/modules/profile/components/ProfileSectionHeader';
import { useProfilePhotoInput } from '@/modules/profile/hooks/useProfilePhotoInput';
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
import type {
  DoctorEducationItem,
  DoctorProfileData,
  ProfileSection,
} from '@/modules/profile/types';
import { pickLocalizedDescription } from '@/utils/pickLocalizedDescription';

const mapEducationKind = (
  kind: DoctorEducationDto['kind'],
): DoctorEducationItem['kind'] => (kind === 'university' ? 'education' : 'certificate');

const mapEducation = (items: DoctorEducationDto[]): DoctorEducationItem[] =>
  items.map((item) => ({
    id: item.id,
    title: item.title,
    subtitle: item.subtitle ?? '',
    years: item.yearTo ? `${item.yearFrom} – ${item.yearTo}` : String(item.yearFrom),
    kind: mapEducationKind(item.kind),
  }));

const mapSupportedFormat = (
  formats: DoctorScheduleResponse['supportedFormats'],
): DoctorProfileData['format'] => {
  const hasOffline = formats.includes('offline');
  const hasOnline = formats.includes('online');
  if (hasOffline && hasOnline) {
    return 'both';
  }
  if (hasOnline) {
    return 'online';
  }
  return 'offline';
};

const licenseFileNameFromUrl = (url: string | null): string => {
  if (!url) {
    return '';
  }
  const segment = url.split('/').pop();
  return segment ?? '';
};

const mapDoctorDto = (
  dto: DoctorMeProfileDto,
  schedule: DoctorScheduleResponse | undefined,
  cityName: string,
  clinicName: string,
  specialtyLabel: string,
): DoctorProfileData => {
  const bio = dto.bio ?? '';
  return {
    id: dto.id,
    firstName: dto.firstName,
    lastName: dto.lastName,
    phone: dto.phone ?? '',
    email: dto.email,
    dateOfBirth: dto.dob,
    cityId: dto.cityId,
    clinicId: dto.clinicId,
    cityName,
    clinicName,
    address: '',
    specialtyLabel,
    yearsPractice: dto.yearsPractice,
    languages: (dto.languages ?? []).join(', '),
    licenseFileName: licenseFileNameFromUrl(dto.licenseFileUrl),
    consultationCount: dto.consultationCount,
    ratingAverage: 0,
    reviewCount: 0,
    basePrice: schedule?.basePriceUah ?? 0,
    promoPrice: schedule?.promoPriceUah ?? undefined,
    format: schedule ? mapSupportedFormat(schedule.supportedFormats) : 'offline',
    photoUrl: dto.photoUrl ?? '',
    shortBioUk: bio,
    shortBioEn: bio,
    fullBioUk: bio,
    fullBioEn: bio,
    education: mapEducation(dto.education),
    reviews: [],
  };
};

export const DoctorProfileView = () => {
  const { t, i18n } = useTranslation('profile');
  const { t: tSearch } = useTranslation('search');
  const profileQuery = useGetDoctorMeProfile();
  const scheduleQuery = useGetDoctorSchedule();
  const patchMutation = usePatchDoctorMeProfile();
  const citiesQuery = useGetReferenceCities();
  const clinicsQuery = useGetReferenceClinics(profileQuery.data?.cityId);

  const [draft, setDraft] = useState<DoctorProfileData | null>(null);
  const [editing, setEditing] = useState<ProfileSection | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const cityName =
    citiesQuery.data?.items.find((city) => city.id === profileQuery.data?.cityId)?.name ?? '';
  const clinicName =
    clinicsQuery.data?.items.find((clinic) => clinic.id === profileQuery.data?.clinicId)
      ?.name ?? '';
  const specialtyLabel = profileQuery.data
    ? tSearch(`specialties.${profileQuery.data.specialty}`, {
        defaultValue: profileQuery.data.specialty,
      })
    : '';

  const serverProfile = useMemo(() => {
    if (!profileQuery.data) {
      return null;
    }
    return mapDoctorDto(
      profileQuery.data,
      scheduleQuery.data,
      cityName,
      clinicName,
      specialtyLabel,
    );
  }, [profileQuery.data, scheduleQuery.data, cityName, clinicName, specialtyLabel]);

  const profile = draft ?? serverProfile;

  const applyPhotoUrl = (photoUrl: string) => {
    setDraft((current) => {
      const base = current ?? serverProfile;
      return base ? { ...base, photoUrl } : current;
    });
  };

  const { openPicker, fileInput, cropDialog } = useProfilePhotoInput(async (file) => {
    setSaving(true);
    try {
      const updated = await patchMutation.mutateAsync({ photo: file });
      applyPhotoUrl(updated.photoUrl ?? '');
      toast.success(t('photoSaved'));
    } finally {
      setSaving(false);
    }
  });

  const removePhoto = async () => {
    setSaving(true);
    try {
      await patchMutation.mutateAsync({ photoUrl: null });
      applyPhotoUrl('');
      toast.success(t('photoRemoved'));
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return null;
  }

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

  const beginEdit = (section: ProfileSection) => {
    setDraft((current) => current ?? serverProfile);
    setEditing(section);
  };

  const cancelEdit = () => {
    setDraft(null);
    setEditing(null);
  };

  const updateDraft = (patch: Partial<DoctorProfileData>) => {
    setDraft((current) => {
      const base = current ?? serverProfile;
      return base ? { ...base, ...patch } : current;
    });
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const languages = profile.languages
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean);
      const bio = profile.fullBioUk.trim() || profile.shortBioUk.trim() || null;

      await patchMutation.mutateAsync({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || null,
        email: profile.email,
        dob: profile.dateOfBirth,
        cityId: profile.cityId,
        clinicId: profile.clinicId,
        bio,
        languages,
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
          <PageSubtitle>{t('doctorSubtitle')}</PageSubtitle>
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
                  label={t('fields.languages')}
                  value={profile.languages}
                  onChange={(event) => {
                    updateDraft({ languages: event.target.value });
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
                  label={t('fields.clinic')}
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
              beginEdit('about');
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
                  updateDraft({
                    shortBioUk: event.target.value,
                    shortBioEn: event.target.value,
                  });
                }}
              />
              <ProfileTextField
                label={t('fields.fullBio')}
                multiline
                minRows={4}
                value={profile.fullBioUk}
                onChange={(event) => {
                  updateDraft({
                    fullBioUk: event.target.value,
                    fullBioEn: event.target.value,
                  });
                }}
              />
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
              beginEdit('education');
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
