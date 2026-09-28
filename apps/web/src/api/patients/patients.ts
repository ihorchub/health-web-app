import {
  deleteFavourite as generatedDeleteFavourite,
  deleteRecentlyViewed as generatedDeleteRecentlyViewed,
  getFavourites as generatedGetFavourites,
  getPatientCabinet as generatedGetPatientCabinet,
  getPatientProfile as generatedGetPatientProfile,
  getRecentlyViewed as generatedGetRecentlyViewed,
  postFavourite as generatedPostFavourite,
  postRecentlyViewed as generatedPostRecentlyViewed,
  postReview as generatedPostReview,
} from '@/api/generated/patients/patients';
import { customInstance } from '@/api/mutator/customInstance';
import type {
  CreateReviewBody,
  CreateReviewResponse,
  DoctorListResponse,
  PatientCabinetResponse,
  PatientProfileDto,
  PatientProfilePatch,
} from '@/api/patients/types';

/** GET /api/v1/patients/me/cabinet */
export const getPatientCabinet = () => {
  return generatedGetPatientCabinet() as Promise<PatientCabinetResponse>;
};

/** GET /api/v1/patients/me/favourites */
export const getFavourites = () => {
  return generatedGetFavourites() as Promise<DoctorListResponse>;
};

/** POST /api/v1/patients/me/favourites/:doctorId */
export const postFavourite = (doctorId: string) => {
  return generatedPostFavourite(doctorId) as Promise<{ ok: true }>;
};

/** DELETE /api/v1/patients/me/favourites/:doctorId */
export const deleteFavourite = (doctorId: string) => {
  return generatedDeleteFavourite(doctorId) as Promise<{ ok: true }>;
};

/** GET /api/v1/patients/me/recently-viewed */
export const getRecentlyViewed = () => {
  return generatedGetRecentlyViewed() as Promise<DoctorListResponse>;
};

/** POST /api/v1/patients/me/recently-viewed/:doctorId */
export const postRecentlyViewed = (doctorId: string) => {
  return generatedPostRecentlyViewed(doctorId) as Promise<{ ok: true }>;
};

/** DELETE /api/v1/patients/me/recently-viewed */
export const deleteRecentlyViewed = () => {
  return generatedDeleteRecentlyViewed() as Promise<{ ok: true }>;
};

/** POST /api/v1/reviews */
export const postReview = (body: CreateReviewBody) => {
  return generatedPostReview(body) as Promise<CreateReviewResponse>;
};

/** GET /api/v1/patients/me/profile */
export const getPatientProfile = () => {
  return generatedGetPatientProfile() as Promise<PatientProfileDto>;
};

/** PATCH /api/v1/patients/me/profile (JSON or multipart when photo present). */
export const patchPatientProfile = (body: PatientProfilePatch) => {
  if (body.photo instanceof File) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(body)) {
      if (key === 'photo') {
        formData.append('photo', value as File);
        continue;
      }
      if (value === undefined) continue;
      formData.append(key, value === null ? '' : String(value));
    }
    return customInstance<PatientProfileDto>({
      url: '/v1/patients/me/profile',
      method: 'PATCH',
      data: formData,
    });
  }

  const { photo: _ignoredPhoto, ...json } = body;
  void _ignoredPhoto;
  return customInstance<PatientProfileDto>({
    url: '/v1/patients/me/profile',
    method: 'PATCH',
    data: json,
  });
};
