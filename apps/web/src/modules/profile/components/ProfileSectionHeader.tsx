import { IconPencil } from '@tabler/icons-react';

import { EditLink, SectionHead, SectionTitle } from '@/modules/profile/styles';

interface ProfileSectionHeaderProps {
  title: string;
  editLabel: string;
  onEdit?: () => void;
  showEdit?: boolean;
}

export const ProfileSectionHeader = ({
  title,
  editLabel,
  onEdit,
  showEdit = true,
}: ProfileSectionHeaderProps) => {
  return (
    <SectionHead>
      <SectionTitle>{title}</SectionTitle>
      {showEdit && onEdit ? (
        <EditLink type="button" onClick={onEdit}>
          <IconPencil size={16} stroke={1.75} aria-hidden />
          {editLabel}
        </EditLink>
      ) : null}
    </SectionHead>
  );
};
