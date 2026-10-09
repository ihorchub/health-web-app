import { Button } from '@mui/material';
import {
  IconBuildingHospital,
  IconCalendarEvent,
  IconCertificate,
  IconChevronDown,
  IconChevronUp,
  IconEye,
  IconFileText,
  IconId,
  IconMail,
  IconMapPin,
  IconPencil,
  IconPhone,
  IconPlus,
  IconSchool,
  IconStarFilled,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import { useMemo, useRef, useState, type ChangeEvent } from 'react';
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
  ReviewsExpandButton,
  EducationCard,
  EditLink,
  EduItem,
  EduList,
  EduPhotoActions,
  EduPhotoRow,
  EduRow,
  EduRowActions,
  EduText,
  EduThumb,
  EduThumbLink,
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
  HeroRatingButton,
  HeroStat,
  HeroStats,
  HeroStatMuted,
  HeroStatValue,
  HeroText,
  Page,
  PageIntro,
  PageSubtitle,
  PageTitle,
  PreviewReviewAuthor,
  PreviewReviewHeader,
  PreviewReviewItem,
  PreviewReviewScore,
  PreviewReviewScoreValue,
  PreviewReviewText,
  ProfileTextField,
  ReviewsEmpty,
  ReviewsEmptyHint,
  ReviewsEmptyTitle,
  ReviewsMeta,
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
import { resolveMediaUrl } from '@/utils/mediaUrl';
import { pickLocalizedDescription } from '@/utils/pickLocalizedDescription';

const CERT_PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp';
const CERT_PHOTO_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const CERT_PHOTO_MAX_BYTES = 10 * 1024 * 1024;

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
    imageUrl: item.imageUrl ?? '',
  }));

const revokePreviewUrl = (url: string | undefined) => {
  if (url?.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

const parseEducationYears = (
  years: string,
): { yearFrom: number; yearTo?: number } | null => {
  const match = years.trim().match(/^(\d{4})(?:\s*[–\-—]\s*(\d{4}))?$/);
  if (!match) {
    return null;
  }
  const yearFrom = Number(match[1]);
  const yearTo = match[2] ? Number(match[2]) : undefined;
  if (yearTo != null && yearTo < yearFrom) {
    return null;
  }
  return { yearFrom, yearTo };
};

const toApiEducation = (items: DoctorEducationItem[]) =>
  items
    .map((item) => {
      const years = parseEducationYears(item.years);
      if (!years || !item.title.trim()) {
        return null;
      }
      return {
        id: item.id.startsWith('edu_tmp_') ? undefined : item.id,
        kind: (item.kind === 'education' ? 'university' : 'certificate') as
          | 'university'
          | 'certificate'
          | 'training',
        title: item.title.trim(),
        subtitle: item.subtitle.trim() || undefined,
        yearFrom: years.yearFrom,
        yearTo: years.yearTo,
        imageUrl: item.imageUrl || null,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item != null);

const createEmptyCertificate = (): DoctorEducationItem => ({
  id: `edu_tmp_${Date.now()}`,
  title: '',
  subtitle: '',
  years: String(new Date().getFullYear()),
  kind: 'certificate',
  imageUrl: '',
});

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
    ratingAverage: dto.ratingAverage ?? 0,
    reviewCount: dto.reviewCount ?? 0,
    basePrice: schedule?.basePriceUah ?? 0,
    promoPrice: schedule?.promoPriceUah ?? undefined,
    format: schedule ? mapSupportedFormat(schedule.supportedFormats) : 'offline',
    photoUrl: dto.photoUrl ?? '',
    shortBioUk: bio,
    shortBioEn: bio,
    fullBioUk: bio,
    fullBioEn: bio,
    education: mapEducation(dto.education),
    reviews: (dto.reviews ?? []).map((review) => ({
      id: review.id,
      author: review.patientDisplayName,
      rating: review.rating,
      text: review.text,
    })),
  };
};

const REVIEWS_PREVIEW_COUNT = 3;

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
  const [reviewsExpanded, setReviewsExpanded] = useState(false);
  const [pendingCertImages, setPendingCertImages] = useState<Record<string, File>>({});
  const [certPhotoTargetId, setCertPhotoTargetId] = useState<string | null>(null);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const certPhotoInputRef = useRef<HTMLInputElement>(null);

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
    draft?.education.forEach((item) => {
      revokePreviewUrl(item.previewUrl);
    });
    setPendingCertImages({});
    setEditingEducationId(null);
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

      if (editing === 'education') {
        const filled = profile.education.filter((item) => item.title.trim());
        const education = toApiEducation(filled);
        if (filled.length > 0 && education.length === 0) {
          toast.error(t('education.invalidYears'));
          setSaving(false);
          return;
        }
        const educationImages = filled.map((item) => pendingCertImages[item.id]);
        await patchMutation.mutateAsync({ education, educationImages });
        filled.forEach((item) => {
          revokePreviewUrl(item.previewUrl);
        });
        setPendingCertImages({});
        setEditingEducationId(null);
      } else {
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
      }
      setDraft(null);
      setEditing(null);
      toast.success(t('saved'));
    } finally {
      setSaving(false);
    }
  };

  const beginEducationRowEdit = (id: string) => {
    setDraft((current) => current ?? serverProfile);
    setEditing('education');
    setEditingEducationId(id);
  };

  const addCertificate = () => {
    const next = createEmptyCertificate();
    setDraft((current) => {
      const base = current ?? serverProfile;
      if (!base) {
        return current;
      }
      return {
        ...base,
        education: [...base.education, next],
      };
    });
    setEditing('education');
    setEditingEducationId(next.id);
  };

  const updateEducationItem = (id: string, patch: Partial<DoctorEducationItem>) => {
    setDraft((current) => {
      const base = current ?? serverProfile;
      if (!base) {
        return current;
      }
      return {
        ...base,
        education: base.education.map((item) =>
          item.id === id ? { ...item, ...patch } : item,
        ),
      };
    });
  };

  const removeEducationItem = (id: string) => {
    setDraft((current) => {
      const base = current ?? serverProfile;
      if (!base) {
        return current;
      }
      const removed = base.education.find((item) => item.id === id);
      revokePreviewUrl(removed?.previewUrl);
      return {
        ...base,
        education: base.education.filter((item) => item.id !== id),
      };
    });
    setPendingCertImages((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setEditingEducationId((current) => (current === id ? null : current));
  };

  const openCertPhotoPicker = (id: string) => {
    setCertPhotoTargetId(id);
    certPhotoInputRef.current?.click();
  };

  const onCertPhotoInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const targetId = certPhotoTargetId;
    event.target.value = '';
    setCertPhotoTargetId(null);
    if (!file || !targetId) {
      return;
    }
    if (!CERT_PHOTO_TYPES.has(file.type)) {
      toast.error(t('photoInvalidType'));
      return;
    }
    if (file.size > CERT_PHOTO_MAX_BYTES) {
      toast.error(t('photoTooLarge'));
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setPendingCertImages((current) => ({ ...current, [targetId]: file }));
    setDraft((current) => {
      const base = current ?? serverProfile;
      if (!base) {
        return current;
      }
      return {
        ...base,
        education: base.education.map((item) => {
          if (item.id !== targetId) {
            return item;
          }
          revokePreviewUrl(item.previewUrl);
          return { ...item, previewUrl };
        }),
      };
    });
  };

  const removeCertPhoto = (id: string) => {
    setPendingCertImages((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
    setDraft((current) => {
      const base = current ?? serverProfile;
      if (!base) {
        return current;
      }
      return {
        ...base,
        education: base.education.map((item) => {
          if (item.id !== id) {
            return item;
          }
          revokePreviewUrl(item.previewUrl);
          return { ...item, imageUrl: '', previewUrl: undefined };
        }),
      };
    });
  };

  const educationImageSrc = (item: DoctorEducationItem) =>
    item.previewUrl || resolveMediaUrl(item.imageUrl);

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
                  <HeroRatingButton
                    type="button"
                    onClick={() => {
                      document
                        .getElementById('doctor-reviews')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <StarAccent>
                      <IconStarFilled size={16} aria-hidden />
                    </StarAccent>
                    <HeroStatValue>
                      {t('fields.rating', {
                        rating: profile.ratingAverage.toFixed(1),
                        count: profile.reviewCount,
                      })}
                    </HeroStatValue>
                  </HeroRatingButton>
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
            showEdit={false}
          />
          {editing === 'education' ? (
            <input
              ref={certPhotoInputRef}
              type="file"
              accept={CERT_PHOTO_ACCEPT}
              hidden
              onChange={onCertPhotoInputChange}
            />
          ) : null}
          <EduList>
            {profile.education.map((item) => {
              const imageSrc = educationImageSrc(item);
              const isRowEditing =
                editing === 'education' && editingEducationId === item.id;

              if (isRowEditing) {
                return (
                  <EduItem key={item.id}>
                    <FieldGrid>
                      <ProfileTextField
                        label={t('education.title')}
                        value={item.title}
                        placeholder={t('education.emptyTitle')}
                        onChange={(event) => {
                          updateEducationItem(item.id, { title: event.target.value });
                        }}
                      />
                      <ProfileTextField
                        label={t('education.subtitle')}
                        value={item.subtitle}
                        onChange={(event) => {
                          updateEducationItem(item.id, { subtitle: event.target.value });
                        }}
                      />
                      <ProfileTextField
                        label={t('education.years')}
                        value={item.years}
                        onChange={(event) => {
                          updateEducationItem(item.id, { years: event.target.value });
                        }}
                      />
                      <EduPhotoRow>
                        {imageSrc ? (
                          <EduThumb src={imageSrc} alt={t('education.photoAlt')} />
                        ) : null}
                        <EduPhotoActions>
                          <Button
                            onClick={() => {
                              openCertPhotoPicker(item.id);
                            }}
                          >
                            {imageSrc
                              ? t('education.changePhoto')
                              : t('education.attachPhoto')}
                          </Button>
                          {imageSrc ? (
                            <Button
                              color="error"
                              onClick={() => {
                                removeCertPhoto(item.id);
                              }}
                            >
                              {t('education.removePhoto')}
                            </Button>
                          ) : null}
                        </EduPhotoActions>
                      </EduPhotoRow>
                      <Button
                        color="error"
                        onClick={() => {
                          removeEducationItem(item.id);
                        }}
                      >
                        {t('education.remove')}
                      </Button>
                    </FieldGrid>
                  </EduItem>
                );
              }

              return (
                <EduItem key={item.id}>
                  <EduRow>
                    <FieldIcon aria-hidden>
                      {item.kind === 'education' ? (
                        <IconSchool size={18} stroke={1.75} />
                      ) : (
                        <IconCertificate size={18} stroke={1.75} />
                      )}
                    </FieldIcon>
                    <EduText>
                      <FieldValue>
                        {item.title.trim() || t('education.emptyTitle')}
                      </FieldValue>
                      {item.subtitle ? <FieldLabel>{item.subtitle}</FieldLabel> : null}
                    </EduText>
                    {imageSrc ? (
                      <EduThumbLink
                        href={imageSrc}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={t('education.openPhoto')}
                      >
                        <EduThumb src={imageSrc} alt={t('education.photoAlt')} />
                      </EduThumbLink>
                    ) : null}
                    <EduYears>{item.years}</EduYears>
                    <EduRowActions>
                      <EditLink
                        type="button"
                        onClick={() => {
                          beginEducationRowEdit(item.id);
                        }}
                      >
                        <IconPencil size={16} stroke={1.75} aria-hidden />
                        {t('edit')}
                      </EditLink>
                      {editing === 'education' ? (
                        <Button
                          color="error"
                          onClick={() => {
                            removeEducationItem(item.id);
                          }}
                        >
                          {t('education.remove')}
                        </Button>
                      ) : null}
                    </EduRowActions>
                  </EduRow>
                </EduItem>
              );
            })}
          </EduList>
          <AddLink type="button" onClick={addCertificate}>
            <IconPlus size={16} stroke={1.75} aria-hidden />
            {t('education.add')}
          </AddLink>
          {editing === 'education' ? (
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
          ) : null}
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

        <SectionCard id="doctor-reviews">
          <ProfileSectionHeader title={t('sections.reviews')} editLabel="" showEdit={false} />
          {profile.reviews.length === 0 ? (
            <ReviewsEmpty>
              <ReviewsEmptyTitle>{t('reviews.empty')}</ReviewsEmptyTitle>
              <ReviewsEmptyHint>{t('reviews.emptyHint')}</ReviewsEmptyHint>
            </ReviewsEmpty>
          ) : (
            <>
              <ReviewsMeta>{t('reviews.count', { count: profile.reviewCount })}</ReviewsMeta>
              {(reviewsExpanded
                ? profile.reviews
                : profile.reviews.slice(0, REVIEWS_PREVIEW_COUNT)
              ).map((review) => (
                <PreviewReviewItem key={review.id}>
                  <PreviewReviewHeader>
                    <PreviewReviewAuthor>{review.author}</PreviewReviewAuthor>
                    <PreviewReviewScore>
                      <StarAccent>
                        <IconStarFilled size={14} aria-hidden />
                      </StarAccent>
                      <PreviewReviewScoreValue>
                        {review.rating.toFixed(1)}
                      </PreviewReviewScoreValue>
                    </PreviewReviewScore>
                  </PreviewReviewHeader>
                  {review.text ? (
                    <PreviewReviewText>{review.text}</PreviewReviewText>
                  ) : null}
                </PreviewReviewItem>
              ))}
              {profile.reviews.length > REVIEWS_PREVIEW_COUNT ? (
                <ReviewsExpandButton
                  type="button"
                  onClick={() => {
                    setReviewsExpanded((open) => !open);
                  }}
                >
                  {reviewsExpanded ? (
                    <>
                      {t('reviews.showLess')}
                      <IconChevronUp size={16} stroke={1.75} aria-hidden />
                    </>
                  ) : (
                    <>
                      {t('reviews.showMore', {
                        count: profile.reviews.length - REVIEWS_PREVIEW_COUNT,
                      })}
                      <IconChevronDown size={16} stroke={1.75} aria-hidden />
                    </>
                  )}
                </ReviewsExpandButton>
              ) : null}
            </>
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
