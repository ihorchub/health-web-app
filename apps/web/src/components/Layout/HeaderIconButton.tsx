import { styled } from '@mui/material';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

const ButtonRoot = styled('button')<{ $size?: 'sm' | 'md' }>(
  ({ theme, $size = 'md' }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
    width: $size === 'sm' ? 32 : 40,
    height: $size === 'sm' ? 32 : 40,
    padding: 0,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: 8,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
);

const UnreadDot = styled('span')(({ theme }) => ({
  position: 'absolute',
  top: 8,
  right: 8,
  width: 8,
  height: 8,
  borderRadius: 999,
  backgroundColor: theme.palette.error.main,
}));

interface HeaderIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'sm' | 'md';
  showUnread?: boolean;
  bordered?: boolean;
}

const BorderlessRoot = styled(ButtonRoot)({
  border: 'none',
  backgroundColor: 'transparent',
});

export const HeaderIconButton = ({
  children,
  size = 'md',
  showUnread = false,
  bordered = true,
  ...rest
}: HeaderIconButtonProps) => {
  const Root = bordered ? ButtonRoot : BorderlessRoot;

  return (
    <Root type="button" $size={size} {...rest}>
      {children}
      {showUnread ? <UnreadDot /> : null}
    </Root>
  );
};
