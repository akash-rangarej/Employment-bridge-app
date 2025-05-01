import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import hiTranslations from './locales/hi.json';
import bnTranslations from './locales/bn.json';
import taTranslations from './locales/ta.json';
import teTranslations from './locales/te.json';
import knTranslations from './locales/kn.json';
import mlTranslations from './locales/ml.json';
import mrTranslations from './locales/mr.json';
import guTranslations from './locales/gu.json';
import paTranslations from './locales/pa.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations
      },
      hi: {
        translation: hiTranslations
      },
      bn: {
        translation: bnTranslations
      },
      ta: {
        translation: taTranslations
      },
      te: {
        translation: teTranslations
      },
      kn: {
        translation: knTranslations
      },
      ml: {
        translation: mlTranslations
      },
      mr: {
        translation: mrTranslations
      },
      gu: {
        translation: guTranslations
      },
      pa: {
        translation: paTranslations
      }
    },
    lng: localStorage.getItem('language') || 'en', // Get saved language or default to English
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 