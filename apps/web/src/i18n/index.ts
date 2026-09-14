import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enAuth from '@/i18n/locales/en/auth.json';
import enBooking from '@/i18n/locales/en/booking.json';
import enCommon from '@/i18n/locales/en/common.json';
import enSearch from '@/i18n/locales/en/search.json';
import ukAuth from '@/i18n/locales/uk/auth.json';
import ukBooking from '@/i18n/locales/uk/booking.json';
import ukCommon from '@/i18n/locales/uk/common.json';
import ukSearch from '@/i18n/locales/uk/search.json';

export enum AppLanguage {
  UK = 'uk',
  EN = 'en',
}

export const LANGUAGE_STORAGE_KEY = 'medicly-language';

const getInitialLanguage = (): AppLanguage => {
  if (typeof window === 'undefined') {
    return AppLanguage.UK;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  if (stored === AppLanguage.UK || stored === AppLanguage.EN) {
    return stored;
  }

  return AppLanguage.UK;
};

void i18n.use(initReactI18next).init({
  resources: {
    [AppLanguage.UK]: {
      common: ukCommon,
      auth: ukAuth,
      search: ukSearch,
      booking: ukBooking,
    },
    [AppLanguage.EN]: {
      common: enCommon,
      auth: enAuth,
      search: enSearch,
      booking: enBooking,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: AppLanguage.UK,
  defaultNS: 'common',
  ns: ['common', 'auth', 'search', 'booking'],
  interpolation: {
    escapeValue: false,
  },
});

i18n.on('languageChanged', (lng) => {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lng);
  document.documentElement.lang = lng;
});

document.documentElement.lang = i18n.language;

export const setAppLanguage = async (language: AppLanguage) => {
  await i18n.changeLanguage(language);
};

export default i18n;
