import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const homeAndLogin = () => {
  debugger;
  if (AppCfg.ENV === 'development') return;
  $h.exec(() => {}, 'NavigationPlugin', 'homeAndLogin', []);
};
export default homeAndLogin;
