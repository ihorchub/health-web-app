import { IconCamera } from '@tabler/icons-react';

import {
  Avatar,
  AvatarFallback,
  AvatarWrap,
  CameraButton,
} from '@/modules/profile/styles';

interface ProfileAvatarProps {
  photoUrl?: string;
  initials: string;
  cameraLabel: string;
  onCameraClick?: () => void;
}

export const ProfileAvatar = ({
  photoUrl,
  initials,
  cameraLabel,
  onCameraClick,
}: ProfileAvatarProps) => {
  return (
    <AvatarWrap>
      {photoUrl ? (
        <Avatar src={photoUrl} alt="" />
      ) : (
        <AvatarFallback>{initials}</AvatarFallback>
      )}
      <CameraButton type="button" aria-label={cameraLabel} onClick={onCameraClick}>
        <IconCamera size={14} stroke={1.75} aria-hidden />
      </CameraButton>
    </AvatarWrap>
  );
};
