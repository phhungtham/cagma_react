import { AppCfg } from '@configs/appConfigs';
import { setLoginState } from 'app/redux/action';
import { $h } from 'navigation/wmatrix_config';

const showLogin = (cb, cbParams) => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(
    result => {
      const { statusCode } = result || {};
      const isLoginSuccess = Number(statusCode) === 1000;
      if (isLoginSuccess) {
        setLoginState(true);
      }
      cb(isLoginSuccess, cbParams);
    },
    'NavigationPlugin',
    'showLogin',
    []
  );
};
export default showLogin;
