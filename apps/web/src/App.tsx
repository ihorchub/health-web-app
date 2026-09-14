import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { AppPopups } from '@/components/Popups';
import { PopupsProvider } from '@/context/PopupsContext';
import { AppThemeProvider } from '@/context/ThemeContext';
import { router } from '@/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <PopupsProvider>
          <RouterProvider router={router} />
          <AppPopups />
          <Toaster richColors position="top-center" />
        </PopupsProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
};
