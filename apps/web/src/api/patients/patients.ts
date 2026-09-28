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
  return customInstance<PatientCabinetResponse>({
    url: '/v1/patients/me/cabinet',
    method: 'GET',
  });
};

/** GET /api/v1/patients/me/favourites */
export const getFavourites = () => {
  return customInstance<DoctorListResponse>({
    url: '/v1/patients/me/favourites',
    method: 'GET',
  });
};

/** POST /api/v1/patients/me/favourites/:doctorId */
export const postFavourite = (doctorId: string) => {
  return customInstance<{ ok: true }>({
    url: `/v1/patients/me/favourites/${encodeURIComponent(doctorId)}`,
    method: 'POST',
  });
};

/** DELETE /api/v1/patients/me/favourites/:doctorId */
export const deleteFavourite = (doctorId: string) => {
  return customInstance<{ ok: true }>({
    url: `/v1/patients/me/favourites/${encodeURIComponent(doctorId)}`,
    method: 'DELETE',
  });
};

/** GET /api/v1/patients/me/recently-viewed */
export const getRecentlyViewed = () => {
  return customInstance<DoctorListResponse>({
    url: '/v1/patients/me/recently-viewed',
    method: 'GET',
  });
};

/** POST /api/v1/patients/me/recently-viewed/:doctorId */
export const postRecentlyViewed = (doctorId: string) => {
  return customInstance<{ ok: true }>({
    url: `/v1/patients/me/recently-viewed/${encodeURIComponent(doctorId)}`,
    method: 'POST',
  });
};

/** DELETE /api/v1/patients/me/recently-viewed */
export const deleteRecentlyViewed = () => {
  return customInstance<{ ok: true }>({
    url: '/v1/patients/me/recently-viewed',
    method: 'DELETE',
  });
};

/** POST /api/v1/reviews */
export const postReview = (body: CreateReviewBody) => {
  return customInstance<CreateReviewResponse>({
    url: '/v1/reviews',
    method: 'POST',
    data: body,
  });
};

/** GET /api/v1/patients/me/profile */
export const getPatientProfile = () => {
  return customInstance<PatientProfileDto>({
    url: '/v1/patients/me/profile',
    method: 'GET',
  });
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

  const { photo: _photo, ...json } = body;
  return customInstance<PatientProfileDto>({
    url: '/v1/patients/me/profile',
    method: 'PATCH',
    data: json,
  });
};
