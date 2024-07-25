import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const moveHome = (initHome = 'home') => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(() => {}, 'NavigationPlugin', initHome, []);
};
export default moveHome;
