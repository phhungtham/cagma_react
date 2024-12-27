import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const clearHistory = (menuCode, param = {}, src) => {
  if (AppCfg.ENV === 'development' && src) {
    document.dispatchEvent(new CustomEvent('redirect', { detail: { src: src, param: param.param || param } }));
    return;
  }
  $h.exec(() => {}, 'NavigationPlugin', 'clearHistory', [
    {
      menuCode: menuCode,
    },
    param,
  ]);
};
export default clearHistory;
