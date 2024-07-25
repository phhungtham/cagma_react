import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { localStorageService } from 'storage';

export const reloadLanguageResource = language => {
  let kh_en = JSON.parse(localStorageService.getLang('KH_EN'));
  let kh_ko = JSON.parse(localStorageService.getLang('KH_KO'));
  let kh_km = JSON.parse(localStorageService.getLang('KH_KM'));

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

  i18n.use(initReactI18next).init({
    resources,
    lng: language,
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  });
};
