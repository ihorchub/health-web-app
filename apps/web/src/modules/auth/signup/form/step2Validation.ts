import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { FieldName } from '@/modules/auth/signup/form/step2Fields';

const schema = Yup.object({
  [FieldName.token]: Yup.string().trim().required(),
});

export const step2ValidationSchema = yupResolver(schema);
export type Step2FormValues = Yup.InferType<typeof schema>;
