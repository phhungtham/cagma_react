const LOCALSTORAGE_KEYS = {
  REFRESH_TOKEN: 'sol-refresh-token',
  AUTH_TOKEN: 'sol-auth-token',
  ACCESS_TOKEN: 'sol-access-token',
  JSESSIONID: 'JSESSIONID',
  USER_INFO: 'userInfo',
  CA_EN: 'ca_en',
  CA_KO: 'ca_ko',
  LANGUAGE_CODE: 'language_code'
};
const setToken = token => {
  localStorage.setItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN, token);
};

const getAccessToken = () => localStorage.getItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN);

const clearToken = () => {
  localStorage.removeItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN);
};

const setUserInfo = ({ userInfo }) => {
  localStorage.setItem(LOCALSTORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
};

const setLang = (lang, type) => {
  localStorage.setItem(LOCALSTORAGE_KEYS[type], JSON.stringify(lang));
};

const getLang = type => localStorage.getItem(LOCALSTORAGE_KEYS[type]);

const getuserInfo = () => localStorage.getItem(LOCALSTORAGE_KEYS.USER_INFO);

const setLanguageCode = lang => {
  localStorage.setItem(LOCALSTORAGE_KEYS.LANGUAGE_CODE, lang);
};

const getLanguageCode = () => localStorage.getItem(LOCALSTORAGE_KEYS.LANGUAGE_CODE) || 'en';

const localStorageService = {
  setToken,
  getAccessToken,
  clearToken,
  setUserInfo,
  getuserInfo,
  setLang,
  getLang,
  setLanguageCode,
  getLanguageCode
};

export default localStorageService;
