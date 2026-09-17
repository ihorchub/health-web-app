import type { ReactNode } from 'react';

import {
  FieldIcon,
  FieldItem,
  FieldLabel,
  FieldText,
  FieldValue,
} from '@/modules/profile/styles';

interface ProfileFieldRowProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}

export const ProfileFieldRow = ({ icon, label, value }: ProfileFieldRowProps) => {
  return (
    <FieldItem>
      <FieldIcon aria-hidden>{icon}</FieldIcon>
      <FieldText>
        <FieldLabel>{label}</FieldLabel>
        <FieldValue>{value}</FieldValue>
      </FieldText>
    </FieldItem>
  );
};
