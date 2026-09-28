import {
  getReferenceCities as generatedGetReferenceCities,
  getReferenceClinics as generatedGetReferenceClinics,
  getReferenceSpecialties as generatedGetReferenceSpecialties,
} from '@/api/generated/reference/reference';
import type {
  ReferenceCity,
  ReferenceClinic,
  ReferenceListResponse,
  ReferenceSpecialty,
} from '@/api/reference/types';

export const getReferenceCities = () => {
  return generatedGetReferenceCities() as Promise<
    ReferenceListResponse<ReferenceCity>
  >;
};

export const getReferenceClinics = (cityId: string) => {
  return generatedGetReferenceClinics({ cityId }) as Promise<
    ReferenceListResponse<ReferenceClinic>
  >;
};

export const getReferenceSpecialties = () => {
  return generatedGetReferenceSpecialties() as Promise<
    ReferenceListResponse<ReferenceSpecialty>
  >;
};
