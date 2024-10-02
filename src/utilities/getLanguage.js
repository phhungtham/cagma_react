import { APP_LANGUAGE } from '@common/constants/common';

const getLanguageFM = (lang = '', isRequest = true) => {
  if (!lang || lang === '') {
    return isRequest ? 'EN' : 'en';
  } else {
    switch (lang) {
      case APP_LANGUAGE.EN:
        return isRequest ? 'EN' : 'en';

      case APP_LANGUAGE.KO:
        return isRequest ? 'KO' : 'ko';

      case APP_LANGUAGE.CA:
        return isRequest ? 'CA' : 'ac';

      default:
        return;
    }
  }
};

export default getLanguageFM;
