import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';

import { PopupsProvider } from '@/context/PopupsContext';
import { AppThemeProvider } from '@/context/ThemeContext';
import i18n from '@/i18n';
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
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    const onLanguageChanged = (lng: string) => {
      setLanguage(lng);
    };
    i18n.on('languageChanged', onLanguageChanged);
    return () => {
      i18n.off('languageChanged', onLanguageChanged);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppThemeProvider>
        <PopupsProvider>
          <RouterProvider key={language} router={router} />
          <Toaster richColors position="top-center" />
        </PopupsProvider>
      </AppThemeProvider>
    </QueryClientProvider>
  );
};
