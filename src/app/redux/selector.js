import { APP_GLOBAL } from './type';

export const nativeRedirectStateSelector = state => {
  return state[APP_GLOBAL]?.isNativeRedirect;
};

export const appLanguage = state => {
  return state[APP_GLOBAL]?.currentLanguage;
};

export const backEventSelector = state => {
  return state[APP_GLOBAL]?.isNativeClickBack;
};

export const loginSelector = state => {
  return state[APP_GLOBAL]?.isLogin;
};

export const nativeParamsSelector = state => {
  return state[APP_GLOBAL]?.nativeParams;
};

export const appPathSelector = state => {
  return state[APP_GLOBAL]?.appPath;
};
