import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const clearHistory = (menuCode, param = {}) => {
  if (AppCfg.ENV === 'development') return;
  $h.exec(() => {}, 'NavigationPlugin', 'clearHistory', [
    {
      menuCode: menuCode
    },
    param
  ]);
};
export default clearHistory;
