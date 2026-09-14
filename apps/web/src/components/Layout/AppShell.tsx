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
  children: ReactNode;
}

/** Minimal visual shell placeholder — full Paper chrome comes later. */
export const AppShell = ({ header, children }: AppShellProps) => {
  return (
    <Shell>
      {header}
      <Main>{children}</Main>
    </Shell>
  );
};
