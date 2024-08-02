import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import localStorageService from '../storage/localStorage';

let ca_en = JSON.parse(localStorageService.getLang('CA_EN'));
let ca_ko = JSON.parse(localStorageService.getLang('CA_KO'));

// the translations
const resources = {
  en: {
    translation: ca_en
  },
  ko: {
    translation: ca_ko
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
