import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Minimal in-memory resources for UI-only strings. CMS content stays in Strapi.
const resources = {
  en: {
    common: {
      selectLanguage: 'Select language',
      siteFallback: 'Site',
      loading: '…',
    },
  },
  hi: {
    common: {
      selectLanguage: 'भाषा चुनें',
      siteFallback: 'साइट',
      loading: '…',
    },
  },
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      lng: 'en',
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      interpolation: { escapeValue: false },
      resources,
      defaultNS: 'common',
    });
}

export default i18n;


