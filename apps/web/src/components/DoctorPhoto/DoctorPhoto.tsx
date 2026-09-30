import { useState } from 'react';

import { styled } from '@/theme/styled';
import { resolveMediaUrl } from '@/utils/mediaUrl';

export type DoctorPhotoSize = 'sm' | 'md' | 'lg' | 'xl';
export type DoctorPhotoShape = 'circle' | 'rounded';

const SIZE_PX: Record<DoctorPhotoSize, number> = {
  sm: 48,
  md: 64,
  lg: 88,
  xl: 140,
};

const RADIUS: Record<DoctorPhotoShape, number | string> = {
  circle: 999,
  rounded: 20,
};

const FONT: Record<DoctorPhotoSize, number> = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 36,
};

const Root = styled('div')<{
  $size: DoctorPhotoSize;
  $shape: DoctorPhotoShape;
}>(({ $size, $shape }) => ({
  position: 'relative',
  width: SIZE_PX[$size],
  height: SIZE_PX[$size],
  flexShrink: 0,
  borderRadius: RADIUS[$shape],
  overflow: 'hidden',
}));

const Image = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  display: 'block',
});

const Fallback = styled('div')<{
  $size: DoctorPhotoSize;
  $shape: DoctorPhotoShape;
}>(({ theme, $size, $shape }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  borderRadius: RADIUS[$shape],
  boxSizing: 'border-box',
  border: `1px solid ${theme.palette.divider}`,
  background:
    theme.palette.mode === 'dark'
      ? 'linear-gradient(145deg, rgba(62, 196, 163, 0.28) 0%, rgba(20, 52, 69, 0.95) 100%)'
      : 'linear-gradient(145deg, rgba(46, 177, 145, 0.22) 0%, rgba(242, 244, 246, 1) 100%)',
  color: theme.palette.primary.main,
  fontFamily: theme.typography.fontFamily,
  fontSize: FONT[$size],
  lineHeight: 1,
  fontWeight: 700,
  letterSpacing: '0.02em',
  userSelect: 'none',
}));

export const doctorInitials = (firstName?: string | null, lastName?: string | null): string => {
  const first = (firstName ?? '').trim().charAt(0);
  const last = (lastName ?? '').trim().charAt(0);
  const value = `${first}${last}`.toUpperCase();
  return value || '·';
};

interface DoctorPhotoProps {
  photoUrl?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  size?: DoctorPhotoSize;
  shape?: DoctorPhotoShape;
  alt?: string;
}

export const DoctorPhoto = ({
  photoUrl,
  firstName,
  lastName,
  size = 'md',
  shape = 'circle',
  alt = '',
}: DoctorPhotoProps) => {
  const [failed, setFailed] = useState(false);
  const resolved = resolveMediaUrl(photoUrl);
  const showImage = Boolean(resolved) && !failed;
  const initials = doctorInitials(firstName, lastName);

  return (
    <Root $size={size} $shape={shape}>
      {showImage ? (
        <Image
          src={resolved}
          alt={alt}
          onError={() => {
            setFailed(true);
          }}
        />
      ) : (
        <Fallback $size={size} $shape={shape} aria-hidden>
          {initials}
        </Fallback>
      )}
    </Root>
  );
};
