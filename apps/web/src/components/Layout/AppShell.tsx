import { styled } from '@mui/material';
import type { ReactNode } from 'react';

const Shell = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
});

const Main = styled('main')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

interface AppShellProps {
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

/** Visual shell — Header/Footer chrome live here, not in route layouts. */
export const AppShell = ({ header, footer, children }: AppShellProps) => {
  return (
    <Shell>
      {header}
      <Main>{children}</Main>
      {footer}
    </Shell>
  );
};
