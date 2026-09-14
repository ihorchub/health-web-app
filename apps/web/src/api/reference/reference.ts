import { customInstance } from '@/api/mutator/customInstance';
import type {
  ReferenceCity,
  ReferenceClinic,
  ReferenceListResponse,
  ReferenceSpecialty,
} from '@/api/reference/types';

export const getReferenceCities = () => {
  return customInstance<ReferenceListResponse<ReferenceCity>>({
    url: '/v1/reference/cities',
    method: 'GET',
  });
};

export const getReferenceClinics = (cityId: string) => {
  return customInstance<ReferenceListResponse<ReferenceClinic>>({
    url: '/v1/reference/clinics',
    method: 'GET',
    params: { cityId },
  });
};

export const getReferenceSpecialties = () => {
  return customInstance<ReferenceListResponse<ReferenceSpecialty>>({
    url: '/v1/reference/specialties',
    method: 'GET',
  });
};
