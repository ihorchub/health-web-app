import { getDoctorMeProfile as generatedGetDoctorMeProfile } from '@/api/generated/doctor-schedule/doctor-schedule';
import { customInstance } from '@/api/mutator/customInstance';

export type DoctorEducationDto = {
  id: string;
  kind: 'university' | 'certificate' | 'training';
  title: string;
  subtitle: string | null;
  yearFrom: number;
  yearTo: number | null;
  imageUrl: string | null;
};

export type DoctorMeReviewDto = {
  id: string;
  rating: number;
  text: string;
  patientDisplayName: string;
  createdAt: string;
};

export interface DoctorMeProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dob: string;
  phone: string | null;
  cityId: string;
  clinicId: string;
  specialty: string;
  yearsPractice: number;
  photoUrl: string | null;
  licenseFileUrl: string | null;
  bio: string | null;
  languages: string[] | null;
  language: string | null;
  theme: string | null;
  education: DoctorEducationDto[];
  consultationCount: number;
  ratingAverage: number;
  reviewCount: number;
  reviews: DoctorMeReviewDto[];
}

export type DoctorMeProfilePatch = Partial<{
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  dob: string;
  cityId: string;
  clinicId: string;
  specialty: string;
  yearsPractice: number;
  bio: string | null;
  languages: string[];
  language: string;
  theme: string;
  education: Array<{
    id?: string;
    kind: 'university' | 'certificate' | 'training';
    title: string;
    subtitle?: string;
    yearFrom: number;
    yearTo?: number;
    imageUrl?: string | null;
  }>;
  educationImages: Array<File | null | undefined>;
  photo: File;
  photoUrl: string | null;
}>;

/** GET /api/v1/doctors/me/profile */
export const getDoctorMeProfile = () => {
  return generatedGetDoctorMeProfile() as Promise<DoctorMeProfileDto>;
};

const hasEducationImages = (images: DoctorMeProfilePatch['educationImages']): boolean =>
  Boolean(images?.some((file) => file instanceof File));

/** PATCH /api/v1/doctors/me/profile */
export const patchDoctorMeProfile = (body: DoctorMeProfilePatch) => {
  const useMultipart = body.photo instanceof File || hasEducationImages(body.educationImages);

  if (useMultipart) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (key === 'photo') {
        if (value instanceof File) {
          formData.append('photo', value);
        }
        continue;
      }
      if (key === 'educationImages') {
        const images = value as DoctorMeProfilePatch['educationImages'];
        images?.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`educationImage_${index}`, file);
          }
        });
        continue;
      }
      if (value === undefined) continue;
      if (key === 'education' || key === 'languages') {
        formData.append(key, JSON.stringify(value));
        continue;
      }
      formData.append(key, value === null ? '' : String(value));
    }
    return customInstance<DoctorMeProfileDto>({
      url: '/v1/doctors/me/profile',
      method: 'PATCH',
      data: formData,
    });
  }

  const { photo: _ignoredPhoto, educationImages: _ignoredImages, ...json } = body;
  void _ignoredPhoto;
  void _ignoredImages;
  return customInstance<DoctorMeProfileDto>({
    url: '/v1/doctors/me/profile',
    method: 'PATCH',
    data: json,
  });
};
