import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import sr from './locales/sr.json'
import bs from './locales/bs.json'
import hr from './locales/hr.json'
import mk from './locales/mk.json'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sr: { translation: sr },
      bs: { translation: bs },
      hr: { translation: hr },
      mk: { translation: mk }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  })

export default i18n
