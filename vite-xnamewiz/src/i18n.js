import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const loadResources = async () => {
  const enTranslation = await import('./locales/en-translation.json');
  const ruTranslation = await import('./locales/ru-translation.json');
  const heTranslation = await import('./locales/he-translation.json');

  return {
    en: { translation: enTranslation.default },
    ru: { translation: ruTranslation.default },
    he: { translation: heTranslation.default },
  };
};

const initI18n = async () => {
  const resources = await loadResources();
  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: import.meta.env.MODE === 'development',
      interpolation: {
        escapeValue: false,
      },
    });
};

export default initI18n;