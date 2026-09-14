import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { FieldName } from '@/modules/auth/signup/form/step1Fields';

const schema = Yup.object({
  [FieldName.role]: Yup.mixed<'patient' | 'doctor'>()
    .oneOf(['patient', 'doctor'])
    .required(),
  [FieldName.firstName]: Yup.string().trim().required(),
  [FieldName.lastName]: Yup.string().trim().required(),
  [FieldName.email]: Yup.string().email().required(),
  [FieldName.password]: Yup.string().min(8).required(),
  [FieldName.passwordConfirm]: Yup.string()
    .oneOf([Yup.ref(FieldName.password)])
    .required(),
  [FieldName.acceptedPrivacy]: Yup.boolean().oneOf([true]).required(),
  [FieldName.acceptedTerms]: Yup.boolean().oneOf([true]).required(),
});

export const step1ValidationSchema = yupResolver(schema);
export type Step1FormValues = Yup.InferType<typeof schema>;
