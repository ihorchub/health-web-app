import { AppShell, StubHeader } from '@/components/Layout';
import { DevCheckPage } from '@/modules/shared/dev-check';

export const DevCheckRoute = () => {
  return (
    <AppShell header={<StubHeader />}>
      <DevCheckPage />
    </AppShell>
  );
};
