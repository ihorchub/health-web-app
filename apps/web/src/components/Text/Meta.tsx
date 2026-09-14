import { styled, Typography } from '@mui/material';
import type { TypographyProps } from '@mui/material';

const Root = styled(Typography)(({ theme }) => ({
  ...theme.typography.body2,
}));

export const Meta = ({ color = 'textSecondary', ...props }: TypographyProps) => {
  return <Root component="span" color={color} {...props} />;
};
