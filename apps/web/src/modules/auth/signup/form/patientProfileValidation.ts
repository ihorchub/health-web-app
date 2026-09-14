import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { FieldName } from '@/modules/auth/signup/form/patientProfileFields';

const schema = Yup.object({
  [FieldName.dob]: Yup.string().required(),
  [FieldName.gender]: Yup.mixed<'female' | 'male'>().oneOf(['female', 'male']).required(),
  [FieldName.cityId]: Yup.string().required(),
  [FieldName.clinicId]: Yup.string().required(),
});

export const patientProfileValidationSchema = yupResolver(schema);
export type PatientProfileFormValues = Yup.InferType<typeof schema>;
