import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import type { SpecialtyId } from '@/api/auth/types';
import { FieldName } from '@/modules/auth/signup/form/doctorProfileFields';

const SPECIALTY_OPTIONS: SpecialtyId[] = [
  'family_doctor',
  'cardiologist',
  'dermatologist',
  'paediatrician',
  'neurologist',
  'ophthalmologist',
  'orthopedist',
  'endocrinologist',
  'gastroenterologist',
  'gynecologist',
  'urologist',
  'otolaryngologist',
  'psychiatrist',
  'pulmonologist',
];

const schema = Yup.object({
  [FieldName.dob]: Yup.string().required(),
  [FieldName.cityId]: Yup.string().required(),
  [FieldName.clinicId]: Yup.string().required(),
  [FieldName.specialty]: Yup.mixed<SpecialtyId>().oneOf(SPECIALTY_OPTIONS).required(),
  [FieldName.yearsPractice]: Yup.number().min(0).max(80).required(),
  [FieldName.visitDurationMinutes]: Yup.mixed<20 | 30 | 45>()
    .oneOf([20, 30, 45])
    .required(),
  [FieldName.licenseFile]: Yup.mixed<File>().nullable().defined(),
});

export const doctorProfileValidationSchema = yupResolver(schema);
export type DoctorProfileFormValues = Yup.InferType<typeof schema>;
