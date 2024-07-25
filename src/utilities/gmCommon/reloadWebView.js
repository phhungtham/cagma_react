import { AppCfg } from '@configs/appConfigs';
import { $h } from 'navigation/wmatrix_config';

const reloadWebView = () => {
  if (AppCfg.ENV === 'development') return;
  return $h.exec(() => {}, 'GMCommon', 'reloadWebView', []);
};
export default reloadWebView;
