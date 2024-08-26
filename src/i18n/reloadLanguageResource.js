import { initReactI18next } from 'react-i18next';

import i18n from 'i18next';
import { localStorageService } from 'storage';

export const reloadLanguageResource = language => {
  let ca_en = JSON.parse(localStorageService.getLang('CA_EN'));
  let ca_ko = JSON.parse(localStorageService.getLang('CA_KO'));

  const resources = {
    en: {
      translation: ca_en,
    },
    ko: {
      translation: ca_ko,
    },
  };

  i18n.use(initReactI18next).init({
    resources,
    lng: language,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
  });
};
