import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

import { FieldName } from '@/modules/booking/confirm/form/fields';

const schema = Yup.object({
  [FieldName.reason]: Yup.string().trim().max(500).default(''),
});

export const validationSchema = yupResolver(schema);
export type ConfirmFormValues = Yup.InferType<typeof schema>;
