import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en';
import bn from './bn';

/**
 * Initialize i18n with English and Bangla translations.
 */
i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    en: { translation: en },
    bn: { translation: bn },
  },
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
