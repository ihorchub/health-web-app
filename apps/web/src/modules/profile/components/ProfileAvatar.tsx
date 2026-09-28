import { IconCamera, IconTrash } from '@tabler/icons-react';

import {
  Avatar,
  AvatarFallback,
  AvatarWrap,
  CameraButton,
  RemovePhotoButton,
} from '@/modules/profile/styles';
import { resolveMediaUrl } from '@/utils/mediaUrl';

interface ProfileAvatarProps {
  photoUrl?: string;
  initials: string;
  cameraLabel: string;
  onCameraClick?: () => void;
  removeLabel?: string;
  onRemoveClick?: () => void;
}

export const ProfileAvatar = ({
  photoUrl,
  initials,
  cameraLabel,
  onCameraClick,
  removeLabel,
  onRemoveClick,
}: ProfileAvatarProps) => {
  const resolved = resolveMediaUrl(photoUrl);

  return (
    <AvatarWrap>
      {resolved ? (
        <Avatar src={resolved} alt="" />
      ) : (
        <AvatarFallback>{initials}</AvatarFallback>
      )}
      {resolved && onRemoveClick ? (
        <RemovePhotoButton type="button" aria-label={removeLabel} onClick={onRemoveClick}>
          <IconTrash size={14} stroke={1.75} aria-hidden />
        </RemovePhotoButton>
      ) : null}
      <CameraButton type="button" aria-label={cameraLabel} onClick={onCameraClick}>
        <IconCamera size={14} stroke={1.75} aria-hidden />
      </CameraButton>
    </AvatarWrap>
  );
};
