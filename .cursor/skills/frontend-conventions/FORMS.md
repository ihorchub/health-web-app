# Forms

## Always: React Hook Form + Yup

No Formik in new code.

Non-trivial forms:

```
modules/.../form/
├── fields.ts        # FieldName enum
├── validation.ts    # Yup schema + yupResolver + InferType
└── (optional) defaultValues.ts
```

```typescript
// form/fields.ts
export enum FieldName {
  email = 'email',
  password = 'password',
}
```

```typescript
// form/validation.ts
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FieldName } from './fields';

const schema = Yup.object({
  [FieldName.email]: Yup.string().email().required(),
  [FieldName.password]: Yup.string().required(),
});

export const validationSchema = yupResolver(schema);
export type FormValues = Yup.InferType<typeof schema>;
```

Reuse shared fragments in `src/utils/schemaUtils/` when the same rule appears twice (phone, password strength, etc.).

## Field names

Always `FieldName` enum — never raw string keys scattered in JSX.
