import { styled } from '@/theme/styled';

const Halo = styled('div')<{ $size: number }>(({ theme, $size }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: $size * 1.35,
  height: $size * 1.35,
  borderRadius: '50%',
  backgroundColor:
    theme.palette.mode === 'light' ? 'rgba(254, 217, 223, 0.55)' : 'rgba(255, 255, 255, 0.1)',
}));

const Image = styled('img')<{ $size: number }>(({ $size }) => ({
  width: $size,
  height: $size,
  objectFit: 'contain',
  flexShrink: 0,
}));

interface StateMascotProps {
  src: string;
  size?: number;
  className?: string;
}

/** Owl mascot with a soft translucent circle behind it (empty / loading / error). */
export const StateMascot = ({ src, size = 120, className }: StateMascotProps) => (
  <Halo $size={size} className={className}>
    <Image src={src} alt="" $size={size} />
  </Halo>
);
