import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import localStorageService from '../storage/localStorage';

let kh_en = JSON.parse(localStorageService.getLang('KH_EN'));
let kh_ko = JSON.parse(localStorageService.getLang('KH_KO'));
let kh_km = JSON.parse(localStorageService.getLang('KH_KM'));

// the translations
const resources = {
  en: {
    translation: kh_en
  },
  ko: {
    translation: kh_ko
  },
  km: {
    translation: kh_km
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
