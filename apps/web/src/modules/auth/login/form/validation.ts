import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { FieldName } from '@/modules/auth/login/form/fields';

const schema = Yup.object({
  [FieldName.email]: Yup.string().email().required(),
  [FieldName.password]: Yup.string().required(),
});

export const validationSchema = yupResolver(schema);
export type LoginFormValues = Yup.InferType<typeof schema>;
